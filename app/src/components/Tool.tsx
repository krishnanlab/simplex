import {
  useEffect,
  useReducer,
  createContext,
  useContext,
  Dispatch,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { css } from "@emotion/react";
import Flex from "@/components/Flex";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Editor from "@/components/Editor";
import Stat from "@/components/Stat";
import Field from "@/components/Field";
import Grid from "./Grid";
import Spinner from "@/components/Spinner";
import { exampleText } from "@/assets/example.json";
import { light } from "@/palette";
import { audiences, Audience, ReadAuthor } from "@/types";
import { analyze } from "@/api/tool";
import { sleep } from "@/util/debug";
import { getArticle } from "@/api/article";
import { exampleLogin, loggedInState } from "@/state";
import { formatDate, splitComma, splitWords } from "@/util/string";

const spinnerStyle = css({
  position: "fixed",
  bottom: "15px",
  right: "15px",
  fontSize: "1.5rem",
});

interface State {
  // input
  audience: Audience;
  showHighlights: boolean;
  version: "original" | "simplified";
  originalText: string;
  simplifiedText: string;
  ignoreWords: Array<string>;

  // results
  scores: Record<string, number>;
  complexity: number;
  gradeLevel: number;

  // metadata
  id: number;
  title: string;
  source: string;

  // read-only metadata
  date: Date;
  author: ReadAuthor;

  // other state
  loading: boolean;
  analyzing: boolean;
}

type Action = ReturnType<typeof setValue | typeof spreadValue>;

const setValue = <T extends keyof State>(key: T, value: State[T]) => ({
  type: "setValue" as const,
  key,
  value,
});

const spreadValue = (value: Partial<State>) => ({
  type: "spreadValue" as const,
  value,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setValue":
      return { ...state, [action.key]: action.value };
    case "spreadValue":
      return { ...state, ...action.value };
    default:
      return state;
  }
};

const defaultState: State = {
  id: 0,
  audience: "general",
  showHighlights: true,
  version: "simplified",
  originalText: "",
  simplifiedText: "",
  ignoreWords: [],
  scores: {},
  complexity: 0,
  gradeLevel: 0,
  title: "",
  source: "",
  date: new Date(),
  author: exampleLogin,
  loading: false,
  analyzing: false,
};

interface Computed {
  text: string;
  setText: (text: string) => unknown;
  editable: boolean;
}

interface Props {
  fresh?: boolean;
}

export const Context = createContext<
  Props & State & { dispatch: Dispatch<Action> } & Computed
>({
  fresh: false,
  ...defaultState,
  dispatch: () => null,
  text: "",
  setText: () => null,
  editable: false,
});

const Tool = ({ fresh = true }: Props) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [loggedIn] = useAtom(loggedInState);

  // computed
  const text =
    state.version === "original" ? state.originalText : state.simplifiedText;
  const setText = (text: string) =>
    dispatch(
      setValue(
        state.version === "original" ? "originalText" : "simplifiedText",
        text
      )
    );
  const words = useMemo(() => splitWords(text), [text]);
  const editable = !!loggedIn && state.author.id === loggedIn.id;

  // load article
  useEffect(() => {
    (async () => {
      if (fresh) return;
      dispatch(setValue("loading", true));
      const article = await getArticle();
      dispatch(spreadValue(article));
      dispatch(setValue("loading", false));
    })();
  }, [fresh]);

  // analyze text
  useEffect(() => {
    let latest = true;

    (async () => {
      // debounce when any input changes
      await sleep(500);
      if (!latest) return;
      dispatch(setValue("analyzing", true));
      const results = await analyze(words, state.audience, state.ignoreWords);
      if (!latest) return;
      dispatch(spreadValue(results));
      dispatch(setValue("analyzing", false));
    })();

    return () => {
      latest = false;
    };
  }, [words, state.audience, state.ignoreWords]);

  return (
    <>
      {!state.loading && (
        <Context.Provider
          value={{ fresh, ...state, dispatch, text, setText, editable }}
        >
          {!fresh && <h2>Article</h2>}
          {!fresh && <Metadata />}
          {!fresh && <ReadonlyMetadata />}
          <Controls />
          <Editor
            value={text}
            onChange={setText}
            scores={state.scores}
            showHighlights={state.showHighlights}
            disabled={state.version === "original" || !(fresh || editable)}
          />
          <Results />
          <MoreControls />
          {fresh && <Metadata />}
          <Actions />
        </Context.Provider>
      )}
      {(state.loading || state.analyzing) &&
        createPortal(<Spinner css={spinnerStyle} />, document.body)}
      {createPortal(<form id="main-form"></form>, document.body)}
    </>
  );
};

export default Tool;

const Controls = () => {
  const { dispatch, fresh, version, audience, showHighlights } =
    useContext(Context);

  return (
    <>
      <Flex hAlign="space">
        {fresh && (
          <Button
            text="Try Example"
            icon="lightbulb"
            onClick={() => dispatch(setValue("simplifiedText", exampleText))}
          />
        )}
        {!fresh && (
          <Select
            label="Version"
            options={["original", "simplified"]}
            value={version}
            onChange={(key) => dispatch(setValue("version", key))}
          />
        )}
        <Flex display="inline">
          <Select
            label="Audience"
            options={audiences}
            value={audience}
            onChange={(value) => dispatch(setValue("audience", value))}
          />
          <Checkbox
            label="Highlights"
            checked={showHighlights}
            onChange={(event) =>
              dispatch(setValue("showHighlights", event.target.checked))
            }
          />
        </Flex>
      </Flex>
    </>
  );
};

const Results = () => {
  const { text, complexity, gradeLevel } = useContext(Context);

  return (
    <>
      <Flex>
        <Flex display="inline" gap="small">
          <Stat
            label="Complex"
            tooltip="Click, select, or hover over a word to show synonyms, find simpler definitions on wikipedia, or exclude it from penalty in the whole document."
          />
          <svg viewBox="0 0 30 10" width="60px">
            <g fill={light}>
              <rect x="0" y="0" width="10" height="10" opacity="1" />
              <rect x="10" y="0" width="10" height="10" opacity="0.66" />
              <rect x="20" y="0" width="10" height="10" opacity="0.33" />
            </g>
          </svg>
          <Stat label="Simpler" />
        </Flex>
        <Stat label="Chars" value={text.length} />
        <Stat
          label="Words"
          value={text.split(/\s+/).filter((word) => word).length}
        />
      </Flex>
      <Flex>
        <Stat
          label="Overall Complexity"
          value={complexity.toFixed(0)}
          tooltip="Percentage of words that are difficult to understand for the selected audience. Improve this score by replacing complex and jargon words with more common and simpler ones. To learn how we calculate this score, see the About page."
        />
        <Stat
          label="Grade Level"
          value={gradeLevel.toFixed(0)}
          tooltip="Flesch-kincaid grade level score, calculated based on average word and sentence length. Improve this score by breaking long sentences into shorter ones, and replacing long, multi-syllabic words with shorter ones."
        />
      </Flex>
    </>
  );
};

const MoreControls = () => {
  const { ignoreWords, dispatch } = useContext(Context);

  return (
    <Field
      label="Ignore these words (exclude from complexity penalty)"
      optional={true}
      defaultValue={ignoreWords.join(", ")}
      placeholder="word, some phrase, compound-word"
      form="main-form"
      onChange={(event) =>
        dispatch(setValue("ignoreWords", splitComma(event.target.value)))
      }
    />
  );
};

const ReadonlyMetadata = () => {
  const { author, date, editable } = useContext(Context);

  return (
    <Grid>
      <Stat
        label="Author"
        value={
          author.name + ", " + author.institution + (editable ? " (You)" : "")
        }
      />
      <Stat label="Last Saved" value={formatDate(date)} />
    </Grid>
  );
};

const Metadata = () => {
  const { fresh, title, source, editable, dispatch } = useContext(Context);

  return (
    <Grid>
      <Field
        label="Title"
        placeholder="Article title"
        form="main-form"
        disabled={!(fresh || editable)}
        value={title}
        onChange={(event) => dispatch(setValue("title", event.target.value))}
      />
      <Field
        label="Source"
        optional={true}
        placeholder="https://some-website.com/"
        form="main-form"
        disabled={!(fresh || editable)}
        value={source}
        onChange={(event) => dispatch(setValue("source", event.target.value))}
      />
    </Grid>
  );
};

const Actions = () => {
  const { fresh, editable } = useContext(Context);

  return (
    <Flex>
      {editable && <Button text="Save" icon="floppy-disk" form="main-form" />}
      {fresh && !editable && (
        <span>
          <Link to="login">Log In</Link> to save
        </span>
      )}
      <Button text="Share" icon="share-nodes" />
      {!fresh && editable && <Button text="Delete" icon="trash-alt" />}
    </Flex>
  );
};

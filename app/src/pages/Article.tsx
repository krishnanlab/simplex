import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthor } from "@/api/account";
import { getArticle } from "@/api/article";
import { Analysis, analyze } from "@/api/tool";
import { exampleText } from "@/assets/example.json";
import Ago from "@/components/Ago";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Editor from "@/components/Editor";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Notification from "@/components/Notification";
import Section from "@/components/Section";
import Select from "@/components/Select";
import Stat from "@/components/Stat";
import { light } from "@/global/palette";
import { State } from "@/global/state";
import { Audience, audiences, ReadArticle } from "@/global/types";
import { sleep } from "@/util/debug";
import { splitComma, splitWords } from "@/util/string";

const blank: ReadArticle = {
  id: "",
  author: "",
  date: new Date().toISOString(),
  title: "",
  source: "",
  collections: [],
};

interface Props {
  fresh: boolean;
}

const Article = ({ fresh }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedIn } = useContext(State);
  const queryClient = useQueryClient();

  const [version, setVersion] = useState<"original" | "simplified">("original");
  const [highlights, setHighlights] = useState<boolean>(true);
  const [article, setArticle] = useState(blank);

  const loadedArticle = useQuery({
    queryKey: ["getCollection", id],
    queryFn: () => getArticle(id || ""),
    enabled: !!id,
  });

  const author = useQuery({
    queryKey: ["getAuthor", loadedArticle.data?.author],
    queryFn: () => getAuthor(loadedArticle.data?.author || ""),
    initialData: fresh ? loggedIn : undefined,
    enabled: !!loadedArticle.data?.id,
  });

  useEffect(() => {
    if (loadedArticle.data) setArticle(loadedArticle.data);
  }, [loadedArticle.data]);

  const editField = useCallback(
    <T extends keyof ReadArticle>(key: T, value: ReadArticle[T]) =>
      setArticle((collection) => ({ ...collection, [key]: value })),
    []
  );

  const editable = !!loggedIn && (fresh || article?.author === loggedIn.id);

  const heading = (
    <h2>
      {fresh && "New "}
      {!fresh && editable && "Edit "}Collection
    </h2>
  );

  const text =
    version === "original" ? article.originalText : article.simplifiedText;

  const words = useMemo(() => splitWords(text), [text]);

  return (
    <Section>
      {!state.loading && (
        <>
          {!fresh && <h2>Article</h2>}
          {!fresh && <Metadata />}
          {!fresh && <ReadonlyMetadata />}
          <Controls />
          <Editor
            value={text}
            onChange={setText}
            scores={state.scores}
            showHighlights={state.showHighlights}
            editable={state.version !== "original" && (fresh || editable)}
          />
          <Results />
          <MoreControls />
          {fresh && <Metadata />}
          <Actions />
        </>
      )}
      {(state.loading || state.analyzing) && <Notification />}
      {createPortal(<form id="article-form"></form>, document.body)}
    </Section>
  );
};

export default Article;

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
      form="article-form"
      onChange={(event) =>
        dispatch(setValue("ignoreWords", splitComma(event.target.value)))
      }
    />
  );
};

const ReadonlyMetadata = () => {
  const { author, date, collections, editable } = useContext(Context);

  return (
    <Grid cols={2}>
      <Stat
        label="Author"
        value={
          author.name + ", " + author.institution + (editable ? " (You)" : "")
        }
      />
      <Stat label="Last Saved" value={<Ago date={date} />} />
      <Stat value={`In ${collections.length} collection(s)`} />
    </Grid>
  );
};

const Metadata = () => {
  const { fresh, title, source, editable, dispatch } = useContext(Context);

  return (
    <Grid cols={2}>
      <Field
        label="Title"
        placeholder="Article title"
        form="article-form"
        disabled={!(fresh || editable)}
        value={title}
        onChange={(event) => dispatch(setValue("title", event.target.value))}
      />
      <Field
        label="Source"
        optional={true}
        placeholder="https://some-website.com/"
        form="article-form"
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
      <Button text="Share" icon="share-nodes" />
      {fresh && !editable && (
        <span>
          <Link to="login">Log In</Link> to save
        </span>
      )}
      {editable && (
        <Button text="Save" icon="floppy-disk" form="article-form" />
      )}
      {!fresh && editable && <Button text="Delete" icon="trash-alt" />}
    </Flex>
  );
};

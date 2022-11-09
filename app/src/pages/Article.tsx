import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { QueryParamConfig, useQueryParam } from "use-query-params";
import { css } from "@emotion/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthor } from "@/api/account";
import { deleteArticle, getArticle, saveArticle } from "@/api/article";
import { Analysis, analyze } from "@/api/tool";
import { exampleText } from "@/assets/example.json";
import Ago from "@/components/Ago";
import ArrayField from "@/components/ArrayField";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Editor from "@/components/Editor";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form from "@/components/Form";
import Grid from "@/components/Grid";
import Meta from "@/components/Meta";
import Notification, { notification } from "@/components/Notification";
import Section from "@/components/Section";
import Select from "@/components/Select";
import Share from "@/components/Share";
import Simplify from "@/components/Simplify";
import Spinner from "@/components/Spinner";
import Stat from "@/components/Stat";
import { dark, light } from "@/global/palette";
import { State } from "@/global/state";
import {
  Audience,
  audiences,
  ReadArticle,
  Version,
  versions,
} from "@/global/types";
import { sleep } from "@/util/debug";
import { splitWords } from "@/util/string";

const spinnerStyle = css({
  position: "fixed",
  right: "10px",
  bottom: "10px",
  color: dark,
  height: "30px",
});

/** blank article to start with and fallback to */
const blank: ReadArticle = {
  id: "",
  author: "",
  date: new Date().toISOString(),
  title: "",
  source: "",
  originalText: "",
  simplifiedText: "",
  ignoreWords: [],
  collections: [],
};

interface Props {
  /** whether starting a new article */
  fresh: boolean;
}

/** methods for syncing version with url param */
const VersionParam: QueryParamConfig<Version> = {
  encode: (value: Version) => value,
  decode: (value): Version => {
    const decoded = value as Version;
    return versions.includes(decoded) ? decoded : "simplified";
  },
};

/** methods for syncing audience with url param */
const AudienceParam: QueryParamConfig<Audience> = {
  encode: (value: Audience) => value,
  decode: (value): Audience => {
    const decoded = value as Audience;
    return audiences.includes(decoded) ? decoded : "general";
  },
};

/** methods for syncing highlights with url param */
const HighlightsParam: QueryParamConfig<boolean> = {
  encode: (value: boolean) => String(value),
  decode: (value): boolean => (value === "false" ? false : true),
};

/** new/edit/view page for article, and homepage content */
const Article = ({ fresh }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn } = useContext(State);
  const queryClient = useQueryClient();

  /** version of saved article */
  const [version, setVersion] = useQueryParam<Version>("version", VersionParam);
  /** audience to analyze for */
  const [audience, setAudience] = useQueryParam<Audience>(
    "audience",
    AudienceParam
  );
  /** whether to show highlights */
  const [highlights, setHighlights] = useQueryParam<boolean>(
    "highlights",
    HighlightsParam
  );

  /** whether to show loading spinner */
  const [analyzing, setAnalyzing] = useState(false);

  /** main editable article state */
  const [article, setArticle] = useState(blank);

  /** whether article is writable (either new, or belongs to logged in user) */
  const editable = fresh || (!!loggedIn && article?.author === loggedIn.id);

  /** is homepage of site */
  const homepage = location.pathname === "/";

  /** query for loading article data (if loading existing article) */
  const {
    data: loadedArticle,
    isInitialLoading: articleLoading,
    isError: articleError,
  } = useQuery({
    queryKey: ["getArticle", id],
    queryFn: () => getArticle(id || ""),
    initialData: fresh ? blank : undefined,
  });

  /** query for getting author details from just id */
  const {
    data: author,
    isInitialLoading: authorLoading,
    isError: authorError,
  } = useQuery({
    queryKey: ["getAuthor", loadedArticle?.author],
    queryFn: () => getAuthor(loadedArticle?.author || ""),
    initialData: loadedArticle?.author ? undefined : loggedIn,
    enabled: !!loadedArticle?.author,
  });

  /** mutation for saving article details */
  const {
    mutate: save,
    isLoading: saveLoading,
    isError: saveError,
  } = useMutation({
    mutationFn: () => saveArticle(id || ""),
    onSuccess: async (data) => {
      if (data.id) await navigate("/article/" + data.id);
      notification("success", `Saved article "${article.title}"`);
      await queryClient.removeQueries({ queryKey: ["getArticle", id] });
    },
  });

  /** mutation for deleting article */
  const {
    mutate: trash,
    isLoading: trashLoading,
    isError: trashError,
  } = useMutation({
    mutationFn: async () => {
      if (!window.confirm("Are you sure you want to delete this article?"))
        return;
      await deleteArticle(id || "");
    },
    onSuccess: async () => {
      await navigate("/my-articles");
      notification("success", `Deleted article "${article.title}"`);
      await queryClient.removeQueries({ queryKey: ["getArticle", id] });
    },
  });

  /** when loaded article changes, set editable article data */
  useEffect(() => {
    if (loadedArticle) setArticle(loadedArticle);
  }, [loadedArticle]);

  /** helper func to edit article data state */
  const editField = useCallback(
    <T extends keyof ReadArticle>(key: T, value: ReadArticle[T]) =>
      setArticle((article) => ({ ...article, [key]: value })),
    []
  );

  /** helper func to add word to ignore list in article data */
  const addIgnore = useCallback(
    (text: ReadArticle["ignoreWords"][0]) =>
      setArticle((article) => ({
        ...article,
        ignoreWords: [...article.ignoreWords, text],
      })),
    []
  );

  /** helper func to remove word from ignore list in article data */
  const removeIgnore = useCallback(
    (text: ReadArticle["ignoreWords"][0]) =>
      setArticle((article) => ({
        ...article,
        ignoreWords: article.ignoreWords.filter((word) => word !== text),
      })),
    []
  );

  /** author string */
  const by = author
    ? author.name + (editable ? " (You)" : "") + " | " + author.institution
    : "You";

  /** text to render in editor */
  const text =
    version === "original" ? article.originalText : article.simplifiedText;

  /** array of words in editor */
  const words = useMemo(() => splitWords(text), [text]);

  /** results of complexity analysis */
  const [analysis, setAnalysis] = useState<Analysis>({
    scores: {},
    complexity: 0,
    grade: 0,
  });

  /** when params that would affect the analysis change */
  useEffect(() => {
    let latest = true;

    /** run analysis */
    (async () => {
      if (!words.length) return;
      await sleep(500); // debounce
      if (!latest) return;
      setAnalyzing(true);
      const analysis = await analyze(words, audience, article.ignoreWords);
      if (!latest) return;
      setAnalysis(analysis);
      setAnalyzing(false);
    })();

    return () => {
      latest = false;
    };
  }, [words, audience, article.ignoreWords]);

  /** overall loading */
  if (articleLoading || authorLoading)
    return (
      <Section>
        <Notification type="loading" text="Loading article" />
      </Section>
    );

  /** overall error */
  if (articleError || authorError)
    return (
      <Section>
        <Notification type="error" text="Error loading article" />
      </Section>
    );

  /** metadata fields section */
  const metadata = (
    <Grid cols={2}>
      <Field
        label="Title"
        placeholder="Article title"
        disabled={!editable}
        value={article.title}
        onChange={(value) => editField("title", value)}
        form="article-form"
      />
      <Field
        label="Source"
        optional={true}
        placeholder="https://some-website.com/"
        disabled={!editable}
        value={article.source}
        onChange={(value) => editField("source", value)}
        form="article-form"
      />
    </Grid>
  );

  /** heading and title text */
  let heading = "";
  if (!homepage) {
    if (fresh) heading = "New Article";
    else if (editable) heading = "Edit Article";
    else heading = "Article";
  }

  return (
    <Section>
      {/* heading */}
      <Meta title={[heading, article.title]} />
      <h2>{heading}</h2>

      {/* if not on homepage, put metadata above editor */}
      {!homepage && metadata}

      {/* details */}
      {!homepage && (
        <Grid cols={2}>
          <Stat label="Author" value={by} />
          <Stat label="Last Saved" value={<Ago date={article.date} />} />
          <Stat value={`In ${article.collections.length} collection(s)`} />
        </Grid>
      )}

      {/* controls */}
      <Flex hAlign="space">
        {fresh && (
          <Button
            text="Try Example"
            icon="lightbulb"
            onClick={() => editField("simplifiedText", exampleText)}
          />
        )}
        {!fresh && (
          <Select
            label="Version"
            options={["original", "simplified"]}
            value={version}
            onChange={(value) => setVersion(value)}
          />
        )}
        <Flex display="inline">
          <Select
            label="Audience"
            options={audiences}
            value={audience}
            onChange={(value) => setAudience(value)}
          />
          <Checkbox
            label="Highlights"
            checked={highlights}
            onChange={(value) => setHighlights(value)}
          />
        </Flex>
      </Flex>

      {/* editor */}
      <Editor
        value={text}
        onChange={(value) =>
          version === "original"
            ? editField("originalText", value)
            : editField("simplifiedText", value)
        }
        scores={analysis.scores}
        highlights={highlights}
        editable={editable && version == "simplified"}
        tooltip={(word) => (
          <Simplify
            word={word}
            ignored={article.ignoreWords.includes(word)}
            setIgnored={() =>
              article.ignoreWords.includes(word)
                ? removeIgnore(word)
                : addIgnore(word)
            }
          />
        )}
      />
      {analyzing && <Spinner css={spinnerStyle} />}

      {/* results */}
      <Flex>
        <Flex display="inline" gap="small">
          <Stat
            label="Complex"
            help="Click a word to show synonyms, find simpler definitions on wikipedia, or exclude it from penalty in the whole document."
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
          value={analysis.complexity.toFixed(0)}
          help="Percentage of words that are difficult to understand for the selected audience. Improve this score by replacing complex and jargon words with more common and simpler ones. To learn how we calculate this score, see the About page."
        />
        <Stat
          label="Grade Level"
          value={analysis.grade.toFixed(0)}
          help="Flesch-kincaid grade level score, calculated based on average word and sentence length. Improve this score by breaking long sentences into shorter ones, and replacing long, multi-syllabic words with shorter ones."
        />
      </Flex>

      {/* more controls */}
      <ArrayField
        label="Ignore these words (exclude from complexity penalty)"
        optional={true}
        value={article.ignoreWords}
        placeholder="word, some phrase, compound-word"
        form="article-form"
        onChange={(value) => editField("ignoreWords", value)}
      />

      {/* if on homepage, put metadata after so editor is first and foremost */}
      {homepage && metadata}

      {/* actions */}
      <Flex>
        {fresh && !loggedIn && (
          <span>
            <Link to="/login">Log In</Link> to save
          </span>
        )}
        {!(fresh && !loggedIn) && editable && (
          <Button
            text="Save"
            icon="floppy-disk"
            disabled={saveLoading || trashLoading}
            type="submit"
            form="article-form"
          />
        )}
        {!(loggedIn && fresh) && (
          <Share
            heading="Share Article"
            field="URL to this article"
            help="With currently selected options (version, audience, highlights)"
            generate={
              fresh ? { article, options: { audience, highlights } } : undefined
            }
          />
        )}
        {!fresh && editable && (
          <Button
            text="Delete"
            icon="trash-alt"
            disabled={saveLoading || trashLoading}
            onClick={() => trash()}
          />
        )}
      </Flex>

      {/* action statuses */}
      {saveLoading && <Notification type="loading" text="Saving article" />}
      {saveError && <Notification type="error" text="Error saving article" />}
      {trashLoading && <Notification type="loading" text="Deleting article" />}
      {trashError && (
        <Notification type="error" text="Error deleting article" />
      )}

      {/* associated form */}
      <Form id="article-form" onSubmit={() => save()} />
    </Section>
  );
};

export default Article;

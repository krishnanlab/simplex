import {
  ComponentProps,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FaRegLightbulb, FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { capitalize } from "lodash";
import { QueryParamConfig, useQueryParam } from "use-query-params";
import { css } from "@stitches/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthor } from "@/api/account";
import {
  deleteArticle,
  getArticle,
  getLatestArticle,
  getRevisions,
  saveArticle,
  saveNewArticle,
} from "@/api/article";
import { analyze } from "@/api/tool";
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
  Analysis,
  Article,
  Audience,
  audiences,
  blankAnalysis,
  blankArticle,
  blankAuthor,
  Revision,
} from "@/global/types";
import { sleep } from "@/util/debug";
import {
  authorString,
  dateString,
  shortenUrl,
  splitWords,
} from "@/util/string";

const spinnerStyle = css({
  position: "fixed",
  right: "10px",
  bottom: "10px",
  color: dark,
  height: "30px",
});

/** methods for syncing revision with url param */
const RevisionParam: QueryParamConfig<Revision> = {
  encode: (value: Revision) => (value ? String(value) : undefined),
  decode: (value): Revision => Number(value) || 0,
};

/** methods for syncing audience with url param */
const AudienceParam: QueryParamConfig<Audience> = {
  encode: (value: Audience) => value.value,
  decode: (value): Audience => {
    const decoded = audiences.find((audience) => audience.value === value);
    return decoded || audiences[0];
  },
};

/** methods for syncing highlights with url param */
const HighlightsParam: QueryParamConfig<boolean> = {
  encode: (value: boolean) => String(value),
  decode: (value): boolean => (value === "false" ? false : true),
};

/** new/edit/view page for article, and homepage content */
const ArticlePage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn } = useContext(State);
  const queryClient = useQueryClient();

  /** whether to show loading spinner */
  const [analyzing, setAnalyzing] = useState(false);

  /** results of complexity analysis */
  const [analysis, setAnalysis] = useState<Analysis>(blankAnalysis);

  /** editable article state */
  const [editableArticle, setEditableArticle] = useState(blankArticle);

  /** selected revision of article */
  const [revision, setRevision] = useQueryParam<Revision>(
    "revision",
    RevisionParam
  );
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

  /** what "mode" we are in */
  let mode: "new" | "anon" | "edit" | "view" = "view";

  /** determine mode */
  if (!id && !!loggedIn) {
    /** logged in user creating new collection */
    mode = "new";
  } else if (!id && !loggedIn) {
    /** anonymous user creating new collection */
    mode = "anon";
  } else if (!!loggedIn && editableArticle.author === loggedIn.id) {
    /** logged in user editing collection belonging to them */
    mode = "edit";
  } else {
    /** logged in or anonymous user viewing someone else's collection */
    mode = "view";
  }

  /** is homepage of site */
  const homepage = location.pathname === "/";

  /** heading and title text */
  const heading = homepage ? "" : capitalize(mode) + " Article";

  /** query for loading revision of article data */
  const {
    data: loadedArticle = blankArticle,
    isInitialLoading: articleLoading,
    isError: articleError,
  } = useQuery({
    queryKey: ["getArticle", id, revision],
    queryFn: () => getArticle(id, revision),
    enabled: !!id && !!revision,
    keepPreviousData: true,
  });

  /** query for loading latest revision of article data */
  const {
    data: latestArticle,
    isInitialLoading: latestLoading,
    isError: latestError,
  } = useQuery({
    queryKey: ["getLatestArticle", id],
    queryFn: () => getLatestArticle(id),
    enabled: !!id,
  });

  /** query for getting author details from just id */
  const {
    data: author = mode === "edit" ? loggedIn || blankAuthor : blankAuthor,
    isInitialLoading: authorLoading,
    isError: authorError,
  } = useQuery({
    queryKey: ["getAuthor", loadedArticle.author],
    queryFn: () => getAuthor(loadedArticle.author),
    enabled: !!loadedArticle.author,
  });

  /** query for loading article revisions (if loading existing article) */
  const {
    data: revisions = [],
    isInitialLoading: revisionsLoading,
    isError: revisionsError,
  } = useQuery({
    queryKey: ["getRevisions", id],
    queryFn: () => getRevisions(id),
    enabled: !!id,
  });

  /** mutation for saving article details */
  const {
    mutate: save,
    isLoading: saveLoading,
    isError: saveError,
  } = useMutation({
    mutationFn: () =>
      id ? saveArticle(editableArticle, id) : saveNewArticle(editableArticle),
    onSuccess: async (data) => {
      if (data?.id) await navigate("/article/" + data.id);
      notification("success", `Saved article "${editableArticle.title}"`);
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
      await deleteArticle(id);
    },
    onSuccess: async () => {
      await navigate("/my-articles");
      notification("success", `Deleted article "${editableArticle.title}"`);
      await queryClient.removeQueries({ queryKey: ["getArticle", id] });
    },
  });

  /** helper func to edit article data state */
  const editField = useCallback(
    <T extends keyof Article>(key: T, value: Article[T]) =>
      setEditableArticle((editableArticle) => ({
        ...editableArticle,
        [key]: value,
      })),
    []
  );

  /** helper func to add word to ignore list in article data */
  const addIgnore = useCallback(
    (text: Article["ignoreWords"][0]) =>
      setEditableArticle((editableArticle) => ({
        ...editableArticle,
        ignoreWords: [...editableArticle.ignoreWords, text],
      })),
    []
  );

  /** helper func to remove word from ignore list in article data */
  const removeIgnore = useCallback(
    (text: Article["ignoreWords"][0]) =>
      setEditableArticle((editableArticle) => ({
        ...editableArticle,
        ignoreWords: editableArticle.ignoreWords.filter(
          (word) => word !== text
        ),
      })),
    []
  );

  /** options to show in revisions dropdown select */
  const revisionOptions: ComponentProps<typeof Select>["options"] = useMemo(
    () =>
      revisions
        .map((revision) => ({
          label: `${revision.revision}: ${dateString(revision.date)}`,
          value: String(revision.revision),
        }))
        .concat(mode === "edit" ? { label: "new", value: "0" } : []),
    [revisions, mode]
  );

  /** latest revision */
  const latest = revisions?.at(-1)?.revision;

  /** main article state to render */
  const article = revision === 0 ? editableArticle : loadedArticle;

  /** whether controls are editable */
  const editable = mode !== "view" && revision === 0;

  /** initialize editable article from latest revision */
  useEffect(() => {
    if (latestArticle) setEditableArticle(latestArticle);
  }, [latestArticle]);

  /** auto select latest revision when appropriate */
  useEffect(() => {
    if (
      /** in view mode */
      mode === "view" &&
      /** but not in view mode due to editable/latest article not being loaded yet */
      editableArticle.id &&
      /** no revision already selected or specified in url */
      revision === 0 &&
      /** latest revision defined */
      latest
    )
      setRevision(latest);
  });

  /** when params that would affect the analysis change */
  useEffect(() => {
    let latest = true;

    /** run analysis */
    (async () => {
      if (!article.text.trim()) return;
      await sleep(500); // debounce
      if (!latest) return;
      setAnalyzing(true);
      const analysis = await analyze(
        article.text,
        audience.value,
        article.ignoreWords || []
      );
      if (!latest) return;
      setAnalysis(analysis);
      setAnalyzing(false);
    })();

    return () => {
      latest = false;
    };
  }, [article.text, audience, article.ignoreWords]);

  /** overall loading */
  if (articleLoading || latestLoading || authorLoading || revisionsLoading)
    return (
      <Section>
        <Notification type="loading" text="Loading article" />
      </Section>
    );

  /** overall error */
  if (articleError || latestError || authorError || revisionsError)
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
        value={article.source}
        onChange={(value) => editField("source", value)}
        form="article-form"
      >
        {!editable ? (
          <a href={article.source}>{shortenUrl(article.source)}</a>
        ) : undefined}
      </Field>
    </Grid>
  );

  return (
    <Section>
      {/* heading */}
      <Meta title={[heading, article.title]} />
      {heading && <h2>{heading}</h2>}

      {/* if not on homepage, put metadata above editor */}
      {!homepage && metadata}

      {/* details */}
      {mode !== "new" && mode !== "anon" && (
        <Grid cols={2}>
          <Stat
            label="Author"
            value={authorString(author, mode === "edit")}
            title={author.id}
          />
          {!editable && (
            <Stat label="Saved" value={<Ago date={article.date} />} />
          )}
          <Stat label="In collection(s)" value={article.collections.length} />
        </Grid>
      )}

      {/* controls */}
      <Flex hAlign="space">
        {(mode === "new" || mode === "anon") && (
          <Button
            text="Try Example"
            icon={<FaRegLightbulb />}
            onClick={() => editField("text", exampleText)}
          />
        )}
        {(mode === "edit" || mode === "view") && (
          <Select
            label="Revision"
            options={revisionOptions}
            value={String(revision)}
            onChange={(value) => setRevision(Number(value.value) || 0)}
          />
        )}
        <Flex display="inline" hAlign="left">
          <Select
            label="Audience"
            options={audiences}
            value={audience.value}
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
        value={article.text}
        onChange={(value) => editField("text", value)}
        scores={analysis.scores}
        highlights={highlights}
        editable={editable}
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
      {analyzing && <Spinner className={spinnerStyle()} />}

      {/* results */}
      <Flex>
        <Flex display="inline">
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
          <Stat
            label="Overall Complexity"
            value={analysis.complexity}
            help="Percentage of words that are difficult to understand for the selected audience. Improve this score by replacing complex and jargon words with more common and simpler ones. To learn how we calculate this score, see the About page."
          />
          <Stat
            label="Grade Level"
            value={analysis.gradeLevelText}
            help={`Flesch-kincaid grade level score (${analysis.gradeLevel}), calculated based on average word and sentence length. Improve this score by breaking long sentences into shorter ones, and replacing long, multi-syllabic words with shorter ones.`}
          />
        </Flex>
      </Flex>
      <Flex>
        <Stat label="Sentences" value={analysis.sentences} />
        <Stat label="Syllables" value={analysis.syllables} />
        <Stat
          label="Words"
          value={splitWords(article.text).filter(Boolean).length}
        />
        <Stat label="Chars" value={article.text.length} />
      </Flex>

      {/* more controls */}
      <ArrayField
        label="Ignore these words (exclude from complexity penalty)"
        optional={true}
        disabled={!editable}
        value={article.ignoreWords}
        placeholder="word, some phrase, compound-word"
        form="article-form"
        onChange={(value) => editField("ignoreWords", value)}
      />

      {/* if on homepage, put metadata after so editor is first and foremost */}
      {homepage && metadata}

      {/* actions */}
      <Flex>
        {mode !== "view" && (
          <Button
            text={
              mode === "new"
                ? "Save"
                : mode === "anon"
                ? "Save Anonymously"
                : "Save"
            }
            icon={<FaRegSave />}
            disabled={saveLoading || trashLoading}
            type="submit"
            form="article-form"
          />
        )}
        {mode === "anon" && (
          <span>
            <Link to="/login">Log in</Link> to save to your account
          </span>
        )}
        {mode !== "new" && mode !== "anon" && (
          <Share
            heading="Share Article"
            field="URL to this article"
            help="With currently selected options (revision, audience, highlights)"
          />
        )}
        {mode === "edit" && (
          <Button
            text="Delete"
            icon={<FaRegTrashAlt />}
            disabled={saveLoading || trashLoading}
            onClick={() => trash()}
          />
        )}
      </Flex>

      {/* note */}
      <Flex>
        {mode === "new" ||
          (mode === "anon" && <strong>Save this article to share it!</strong>)}
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

export default ArticlePage;

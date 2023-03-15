import { ComponentProps, useContext, useEffect } from "react";
import {
  FaCopy,
  FaRegLightbulb,
  FaRegSave,
  FaRegTrashAlt,
} from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { capitalize, isEqual } from "lodash";
import { useDebounce } from "use-debounce";
import { QueryParamConfig, useQueryParam } from "use-query-params";
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
import { ReactComponent as SelectAnimation } from "@/assets/select-word.svg";
import Ago from "@/components/Ago";
import ArrayField from "@/components/ArrayField";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Editor from "@/components/Editor";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form from "@/components/Form";
import Grid from "@/components/Grid";
import Help from "@/components/Help";
import Meta from "@/components/Meta";
import Status, {
  clearNotification,
  notification,
} from "@/components/Notification";
import Section from "@/components/Section";
import Select from "@/components/Select";
import Share from "@/components/Share";
import Simplify from "@/components/Simplify";
import Stat from "@/components/Stat";
import { light } from "@/global/palette";
import { State } from "@/global/state";
import {
  Article,
  Audience,
  audiences,
  blankAnalysis,
  blankArticle,
  blankAuthor,
} from "@/global/types";
import { sleep } from "@/util/debug";
import { authorString, dateString, shortenUrl } from "@/util/string";
import { setStorage } from "@/util/storage";

/** methods for syncing revision with url param */
const RevisionParam: QueryParamConfig<number> = {
  encode: (value) => (value ? String(value) : undefined),
  decode: (value) => Number(value) || 0,
};

/** methods for syncing audience with url param */
const AudienceParam: QueryParamConfig<Audience> = {
  encode: (value) => value.value,
  decode: (value) => {
    const decoded = audiences.find((audience) => audience.value === value);
    return decoded || audiences[0];
  },
};

/** methods for syncing highlights with url param */
const HighlightsParam: QueryParamConfig<boolean> = {
  encode: (value) => String(value),
  decode: (value) => (value === "false" ? false : true),
};

/** new/edit/view page for article, and homepage content */
const ArticlePage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(State);
  const queryClient = useQueryClient();

  /** editable article state */
  const [
    editableArticle = blankArticle,
    setEditableArticle,
    removeArticleStorage,
  ] = useLocalStorage<Article>("article-" + location.pathname, blankArticle);

  /** selected revision of article */
  const [revision, setRevision] = useQueryParam<number>(
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
  if (!id && !!currentUser) {
    /** logged in user creating new collection */
    mode = "new";
  } else if (!id && !currentUser) {
    /** anonymous user creating new collection */
    mode = "anon";
  } else if (!!currentUser && editableArticle.author === currentUser.id) {
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

  /** query for loading article revisions (if loading existing article) */
  const {
    data: revisions = [],
    isInitialLoading: revisionsLoading,
    isError: revisionsError,
    error: revisionsErrorMessage,
  } = useQuery({
    queryKey: ["getRevisions", id],
    queryFn: () => getRevisions(id),
    enabled: !!id,
  });

  /** query for loading revision of article data */
  const {
    data: loadedArticle = blankArticle,
    isInitialLoading: articleLoading,
    isError: articleError,
    error: articleErrorMessage,
  } = useQuery({
    queryKey: ["getArticle", id, revision],
    queryFn: () =>
      getArticle(id, (revisions[revision - 1] || revisions.at(-1)).revision),
    enabled: !!id && !!revision && !!revisions && !!revisions.length,
    keepPreviousData: true,
  });

  /** query for loading latest revision of article data */
  const {
    data: latestArticle = blankArticle,
    isInitialLoading: latestLoading,
    isError: latestError,
    error: latestErrorMessage,
  } = useQuery({
    queryKey: ["getLatestArticle", id],
    queryFn: () => getLatestArticle(id),
    enabled: !!id,
  });

  /** query for getting author details from just id */
  const {
    data: author = mode === "edit" ? currentUser || blankAuthor : blankAuthor,
    isInitialLoading: authorLoading,
    isError: authorError,
    error: authorErrorMessage,
  } = useQuery({
    queryKey: ["getAuthor", latestArticle.author],
    queryFn: () =>
      latestArticle.author
        ? getAuthor(latestArticle.author)
        : { ...blankAuthor, name: "Anonymous" },
    enabled: !!latestArticle.author || latestArticle.author === null,
  });

  /** clear query cache */
  const clearCache = () => {
    queryClient.removeQueries({ queryKey: ["getRevisions", id] });
    queryClient.removeQueries({ queryKey: ["getArticle", id] });
    queryClient.removeQueries({ queryKey: ["getLatestArticle", id] });
    queryClient.removeQueries({ queryKey: ["getArticles"] });
    queryClient.removeQueries({
      queryKey: ["getUserArticles", currentUser?.id],
    });
    queryClient.removeQueries({
      queryKey: ["getUserCollections", currentUser?.id],
    });
  };

  /** mutation for saving article details */
  const { mutate: save, isLoading: saveLoading } = useMutation({
    mutationFn: () =>
      id ? saveArticle(editableArticle, id) : saveNewArticle(editableArticle),
    onMutate: () => notification("loading", "Saving article"),
    onSuccess: async (data) => {
      notification("success", `Saved article "${editableArticle.title}"`);
      await sleep(1000);
      clearCache();
      removeArticleStorage();
      if (data?.id) await navigate("/article/" + data.id);
    },
    onError: () => notification("error", "Error saving article"),
  });

  /** mutation for deleting article */
  const { mutate: trash, isLoading: trashLoading } = useMutation({
    mutationFn: async () => {
      if (!window.confirm("Are you sure you want to delete this article?"))
        return;
      await deleteArticle(id);
    },
    onMutate: () => notification("loading", "Deleting article"),
    onSuccess: async () => {
      notification("success", `Deleted article "${editableArticle.title}"`);
      await sleep(1000);
      clearCache();
      await navigate("/my-articles");
    },
    onError: () => notification("error", "Error deleting article"),
  });

  /** helper func to edit article data state */
  const editField = <T extends keyof Article>(key: T, value: Article[T]) =>
    setEditableArticle(() => ({
      ...editableArticle,
      [key]: value,
    }));

  /** helper func to add word to ignore list in article data */
  const addIgnore = (text: Article["ignoreWords"][0]) =>
    setEditableArticle(() => ({
      ...editableArticle,
      ignoreWords: [...editableArticle.ignoreWords, text.toLowerCase()],
    }));

  /** helper func to remove word from ignore list in article data */
  const removeIgnore = (text: Article["ignoreWords"][0]) =>
    setEditableArticle(() => ({
      ...editableArticle,
      ignoreWords: editableArticle.ignoreWords.filter(
        (word) => word.toLowerCase() !== text.toLowerCase()
      ),
    }));

  /** options to show in revisions dropdown select */
  const revisionOptions: ComponentProps<typeof Select>["options"] = revisions
    .map((revision, index) => ({
      label: `${index + 1}: ${dateString(revision.date)}`,
      value: String(revision.revision),
    }))
    .concat(mode === "edit" ? { label: "new", value: "0" } : []);

  /** main article state to render */
  const article = revision === 0 ? editableArticle : loadedArticle;

  /** whether controls are editable */
  const editable = mode !== "view" && revision === 0;

  /** query for complexity analysis */
  const [analysisParams] = useDebounce<Parameters<typeof analyze>>(
    [article.text, audience.value, article.ignoreWords || []],
    300,
    { equalityFn: isEqual }
  );
  const { data: analysis = blankAnalysis } = useQuery({
    queryKey: ["analyze", analysisParams],
    queryFn: () => {
      notification("loading", "Analyzing");
      return analyze(...analysisParams);
    },
    onSuccess: clearNotification,
    onError: () => notification("error", "Error analyzing"),
  });

  /** useQuery callbacks won't run if unmounted */
  useEffect(() => {
    return () => {
      clearNotification();
    };
  }, []);

  /** initialize editable article from latest revision */
  useEffect(() => {
    if (latestArticle.id) setEditableArticle(latestArticle);
  }, [setEditableArticle, latestArticle]);

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
      revisions.length
    )
      setRevision(revisions.length);
  });

  /** overall loading */
  if (articleLoading || latestLoading || authorLoading || revisionsLoading)
    return (
      <Section>
        <Status type="loading" text="Loading article" />
      </Section>
    );

  /** overall error */
  if (articleError || latestError || authorError || revisionsError)
    return (
      <Section>
        <Status
          type="error"
          text={[
            "Error loading article",
            articleErrorMessage,
            latestErrorMessage,
            authorErrorMessage,
            revisionsErrorMessage,
          ]}
        />
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
          <Flex display="inline" gap="small">
            <Select
              label="Revision"
              options={revisionOptions}
              value={revisionOptions.at(revision - 1)?.value || ""}
              onChange={(value, index) =>
                setRevision(
                  value.label.toLowerCase().includes("new") ? 0 : index + 1
                )
              }
            />
          </Flex>
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
            ignored={article.ignoreWords.includes(word.toLowerCase())}
            setIgnored={() =>
              article.ignoreWords.includes(word.toLowerCase())
                ? removeIgnore(word)
                : addIgnore(word)
            }
          />
        )}
      />

      {/* results */}
      <Flex>
        <Flex display="inline">
          <Flex display="inline" gap="small">
            <Stat label="Complex" />
            <svg viewBox="0 0 30 10" width="60px">
              <g fill={light}>
                <rect x="0" y="0" width="10" height="10" opacity="1" />
                <rect x="10" y="0" width="10" height="10" opacity="0.66" />
                <rect x="20" y="0" width="10" height="10" opacity="0.33" />
              </g>
            </svg>
            <Stat
              label="Simpler"
              help={
                <>
                  <SelectAnimation />
                  Select a word to show synonyms, find simpler definitions on
                  wikipedia, or exclude it from penalty in the whole document.
                </>
              }
            />
          </Flex>

          <Stat
            label="Overall Complexity"
            value={analysis.complexity.toFixed(0) + "%"}
            help={
              <span>
                Percentage of words that are difficult to understand for the
                selected audience. Improve this score by replacing complex and
                jargon words with more common and simpler ones. To learn how we
                calculate this score, see the <Link to="about">About page</Link>
                .
              </span>
            }
          />
          <Stat
            label="Grade Level"
            value={analysis.gradeLevelText}
            help={
              <>
                Flesch-kincaid grade level score ({analysis.gradeLevel}),
                calculated based on average word and sentence length. Improve
                this score by breaking long sentences into shorter ones, and
                replacing long, multi-syllabic words with shorter ones.
              </>
            }
          />
        </Flex>
      </Flex>
      <Flex>
        <Stat label="Sentences" value={analysis.sentences} />
        <Stat label="Syllables" value={analysis.syllables} />
        <Stat label="Words" value={analysis.words} />
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
        {/* save */}
        <Flex display="inline" gap="small">
          {mode !== "view" && (
            <Button
              text="Save"
              icon={<FaRegSave />}
              disabled={saveLoading || trashLoading}
              type="submit"
              form="article-form"
            />
          )}
          {/* note */}
          {(mode === "new" || mode === "anon") && (
            <Stat
              label={mode === "anon" ? "Anonymous" : ""}
              help={
                <span>
                  {mode === "anon" && (
                    <>
                      You’re not logged in, so this article will be saved
                      anonymously. <Link to="/login">Log in</Link> to save this
                      article to your account and edit or delete it later.{" "}
                    </>
                  )}
                  Saving will create a shareable link.
                </span>
              }
            />
          )}
        </Flex>

        {/* share */}
        {mode !== "new" && mode !== "anon" && (
          <Share
            type="article"
            title={loadedArticle.title}
            help="With currently selected revision, audience, and highlights."
          />
        )}

        {/* edit */}
        {mode === "edit" && (
          <Button
            text="Delete"
            icon={<FaRegTrashAlt />}
            disabled={saveLoading || trashLoading}
            onClick={() => trash()}
          />
        )}

        {/* copy */}
        {mode === "view" && (
          <Flex display="inline" gap="small">
            <Button
              text="Copy to new"
              icon={<FaCopy />}
              disabled={saveLoading || trashLoading}
              onClick={() => {
                setStorage("article-/", loadedArticle);
                navigate("/");
              }}
            />
            <Help tooltip="You can't directly edit this article, but you can start a new article from its content." />
          </Flex>
        )}
      </Flex>

      {/* associated form */}
      <Form id="article-form" onSubmit={() => save()} />
    </Section>
  );
};

export default ArticlePage;

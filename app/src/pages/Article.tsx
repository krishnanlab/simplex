import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthor } from "@/api/account";
import { deleteArticle, getArticle, saveArticle } from "@/api/article";
import { Analysis, analyze } from "@/api/tool";
import { exampleText } from "@/assets/example.json";
import Ago from "@/components/Ago";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Editor from "@/components/Editor";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form from "@/components/Form";
import Grid from "@/components/Grid";
import Notification, { notification } from "@/components/Notification";
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
  originalText: "",
  simplifiedText: "",
  ignoreWords: [],
  collections: [],
};

interface Props {
  fresh: boolean;
}

const Article = ({ fresh }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn } = useContext(State);
  const queryClient = useQueryClient();

  const [version, setVersion] = useState<"original" | "simplified">(
    "simplified"
  );
  const [audience, setAudience] = useState<Audience>("general");
  const [highlights, setHighlights] = useState<boolean>(true);

  const [article, setArticle] = useState(blank);

  const editable = fresh || (!!loggedIn && article?.author === loggedIn.id);
  const homepage = location.pathname === "/";

  const {
    data: loadedArticle,
    isInitialLoading: articleLoading,
    isError: articleError,
  } = useQuery({
    queryKey: ["getArticle", id],
    queryFn: () => getArticle(id || ""),
    initialData: fresh ? blank : undefined,
  });

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

  const {
    mutate: save,
    isLoading: saveLoading,
    isError: saveError,
  } = useMutation({
    mutationFn: () => saveArticle(id || ""),
    onSuccess: async (data) => {
      await navigate("/article/" + (id || data.id));
      notification("success", `Saved article ${id || data.id}`);
      await queryClient.removeQueries({ queryKey: ["getArticle", id] });
    },
  });

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
      notification("success", `Deleted article ${id}`);
      await queryClient.removeQueries({ queryKey: ["getArticle", id] });
    },
  });

  useEffect(() => {
    if (loadedArticle) setArticle(loadedArticle);
  }, [loadedArticle]);

  const editField = useCallback(
    <T extends keyof ReadArticle>(key: T, value: ReadArticle[T]) =>
      setArticle((article) => ({ ...article, [key]: value })),
    []
  );

  const by = author
    ? author.name + (editable ? " (You)" : "") + " | " + author.institution
    : "You";

  const text =
    version === "original" ? article.originalText : article.simplifiedText;

  const words = useMemo(() => splitWords(text), [text]);

  const [analysis, setAnalysis] = useState<Analysis>({
    scores: {},
    complexity: 0,
    grade: 0,
  });

  useEffect(() => {
    let latest = true;

    (async () => {
      await sleep(500); // debounce
      if (!latest) return;
      const analysis = await analyze(words, audience, article.ignoreWords);
      if (!latest) return;
      setAnalysis(analysis);
    })();

    return () => {
      latest = false;
    };
  }, [words, audience, article.ignoreWords]);

  if (articleLoading || authorLoading)
    return (
      <Section>
        <Notification type="loading" text="Loading article" />
      </Section>
    );

  if (articleError || authorError)
    return (
      <Section>
        <Notification type="error" text="Error loading article" />
      </Section>
    );

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

  return (
    <Section>
      {/* heading */}
      {!homepage && (
        <h2>
          {fresh && "New "}
          {!fresh && editable && "Edit "}Article
        </h2>
      )}

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
      />

      {/* results */}
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
          value={analysis.complexity.toFixed(0)}
          tooltip="Percentage of words that are difficult to understand for the selected audience. Improve this score by replacing complex and jargon words with more common and simpler ones. To learn how we calculate this score, see the About page."
        />
        <Stat
          label="Grade Level"
          value={analysis.grade.toFixed(0)}
          tooltip="Flesch-kincaid grade level score, calculated based on average word and sentence length. Improve this score by breaking long sentences into shorter ones, and replacing long, multi-syllabic words with shorter ones."
        />
      </Flex>

      {/* more controls */}
      <Field
        label="Ignore these words (exclude from complexity penalty)"
        optional={true}
        defaultValue={article.ignoreWords.join(", ")}
        placeholder="word, some phrase, compound-word"
        form="article-form"
        onChange={(value) => editField("ignoreWords", splitComma(value))}
      />

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
        <Button text="Share" icon="share-nodes" />
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

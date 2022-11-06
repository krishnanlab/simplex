import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthor } from "@/api/account";
import { getArticles } from "@/api/article";
import {
  deleteCollection,
  getCollection,
  saveCollection,
} from "@/api/collection";
import Ago from "@/components/Ago";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form from "@/components/Form";
import Grid from "@/components/Grid";
import Notification, { notification } from "@/components/Notification";
import Section from "@/components/Section";
import Stat from "@/components/Stat";
import { State } from "@/global/state";
import { ReadCollection } from "@/global/types";

const blank: ReadCollection = {
  id: "",
  author: "",
  date: new Date().toISOString(),
  title: "",
  description: "",
  articles: [],
};

interface Props {
  fresh: boolean;
}

const Collection = ({ fresh }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedIn } = useContext(State);
  const queryClient = useQueryClient();

  const [collection, setCollection] = useState(blank);

  const editable = !!loggedIn && (fresh || collection?.author === loggedIn.id);

  const {
    data: loadedCollection,
    isInitialLoading: collectionLoading,
    isError: collectionError,
  } = useQuery({
    queryKey: ["getCollection", id],
    queryFn: () => getCollection(id || ""),
    initialData: fresh ? blank : undefined,
  });

  const {
    data: author,
    isInitialLoading: authorLoading,
    isError: authorError,
  } = useQuery({
    queryKey: ["getAuthor", loadedCollection?.author],
    queryFn: () => getAuthor(loadedCollection?.author || ""),
    initialData: loadedCollection?.author ? undefined : loggedIn,
    enabled: !!loadedCollection?.author,
  });

  const {
    data: userArticles,
    isInitialLoading: userArticlesLoading,
    isError: userArticlesError,
  } = useQuery({
    queryKey: ["getArticles", "user", loggedIn?.id],
    queryFn: () => getArticles(),
    enabled: !!loggedIn?.id,
  });

  const {
    data: collectionArticles,
    isInitialLoading: collectionArticlesLoading,
    isError: collectionArticlesError,
  } = useQuery({
    queryKey: ["getArticles", "collection", loadedCollection?.articles],
    queryFn: () => getArticles(loadedCollection?.articles),
    enabled: !!loadedCollection?.articles,
  });

  const {
    mutate: save,
    isLoading: saveLoading,
    isError: saveError,
  } = useMutation({
    mutationFn: () => saveCollection(id || ""),
    onSuccess: async (data) => {
      await queryClient.removeQueries({ queryKey: ["getCollection", id] });
      notification("success", `Saved collection ${id || data.id}`);
    },
  });

  const {
    mutate: trash,
    isLoading: trashLoading,
    isError: trashError,
  } = useMutation({
    mutationFn: async () => {
      if (!window.confirm("Are you sure you want to delete this collection?"))
        return;
      await deleteCollection(id || "");
    },
    onSuccess: async () => {
      await queryClient.removeQueries({ queryKey: ["getCollection", id] });
      navigate("/my-articles");
      notification("success", `Deleted collection ${id}`);
    },
  });

  useEffect(() => {
    if (loadedCollection) setCollection(loadedCollection);
  }, [loadedCollection]);

  const editField = useCallback(
    <T extends keyof ReadCollection>(key: T, value: ReadCollection[T]) =>
      setCollection((collection) => ({ ...collection, [key]: value })),
    []
  );

  const addArticle = useCallback(
    (id: ReadCollection["articles"][0]) =>
      setCollection((collection) => ({
        ...collection,
        articles: [...collection.articles, id],
      })),
    []
  );

  const removeArticle = useCallback(
    (id: ReadCollection["articles"][0]) =>
      setCollection((collection) => ({
        ...collection,
        articles: collection.articles.filter((article) => article !== id),
      })),
    []
  );

  const by = author
    ? author.name + (editable ? " (You)" : "") + " | " + author.institution
    : "Loading...";

  const articles = userArticles || collectionArticles;

  const selected = useMemo(
    () =>
      collection.articles
        .map((id) => articles?.find((article) => article.id === id))
        .filter((article) => article) || [],
    [collection.articles, articles]
  );

  const unselected = useMemo(
    () =>
      articles?.filter(
        (article) => !collection.articles.find((id) => article.id === id)
      ) || [],
    [collection.articles, articles]
  );

  if (
    collectionLoading ||
    authorLoading ||
    userArticlesLoading ||
    collectionArticlesLoading
  )
    return (
      <Section>
        <Notification type="loading" text="Loading collection" />
      </Section>
    );

  if (
    collectionError ||
    authorError ||
    userArticlesError ||
    collectionArticlesError
  )
    return (
      <Section>
        <Notification type="error" text="Error loading collection" />
      </Section>
    );

  return (
    <Section>
      {/* heading */}
      <h2>
        {fresh && "New "}
        {!fresh && editable && "Edit "}Collection
      </h2>

      {/* metadata */}
      <Grid cols={2}>
        <Field
          label="Title"
          placeholder="Collection title"
          disabled={!editable}
          value={collection.title}
          onChange={(value) => editField("title", value)}
          form="collection-form"
        />
        <Field
          label="Description"
          optional={true}
          placeholder="Collection description"
          disabled={!editable}
          value={collection.description}
          onChange={(value) => editField("description", value)}
          form="collection-form"
        />
      </Grid>

      {/* details */}
      <Grid cols={2}>
        <Stat label="Author" value={by} />
        <Stat label="Last Saved" value={<Ago date={collection.date} />} />
      </Grid>

      {/* editable article list */}
      {editable && (
        <>
          <h3>Selected Articles ({selected.length})</h3>
          <Grid>
            {selected.map((article, index) => (
              <Card
                key={index}
                article={article}
                editable={editable}
                action={{
                  icon: "times",
                  onClick: () => removeArticle(article?.id || ""),
                }}
              />
            ))}
          </Grid>
          <h3>Add Articles ({unselected.length})</h3>
          <Grid>
            {unselected.map((article, index) => (
              <Card
                key={index}
                article={article}
                editable={editable}
                action={{
                  icon: "plus",
                  onClick: () => addArticle(article.id),
                }}
              />
            ))}
          </Grid>
        </>
      )}

      {/* read-only article list */}
      {!editable && (
        <>
          <h3>Articles ({articles?.length})</h3>
          <Grid>
            {articles?.map((article, index) => (
              <Card key={index} article={article} />
            ))}
          </Grid>
        </>
      )}

      {/* actions */}
      <Flex>
        {editable && (
          <Button
            text="Save"
            icon="floppy-disk"
            disabled={saveLoading || trashLoading}
            type="submit"
            form="collection-form"
          />
        )}
        {!fresh && <Button text="Share" icon="share-nodes" />}
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
      {saveLoading && <Notification type="loading" text="Saving collection" />}
      {saveError && (
        <Notification type="error" text="Error saving collection" />
      )}
      {trashLoading && (
        <Notification type="loading" text="Deleting collection" />
      )}
      {trashError && (
        <Notification type="error" text="Error deleting collection" />
      )}

      {/* associated form */}
      <Form id="collection-form" onSubmit={() => save()} />
    </Section>
  );
};

export default Collection;

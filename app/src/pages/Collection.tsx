import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Section from "@/components/Section";
import Grid from "@/components/Grid";
import Field from "@/components/Field";
import Card from "@/components/Card";
import Flex from "@/components/Flex";
import Button from "@/components/Button";
import Stat from "@/components/Stat";
import Ago from "@/components/Ago";
import { notification } from "@/components/Notification";
import { ReadCollection } from "@/global/types";
import { State } from "@/global/state";
import { deleteCollection, getCollection } from "@/api/collection";
import { getArticles } from "@/api/article";
import { getAuthor } from "@/api/account";

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

  const articles = useQuery({
    queryKey: ["getArticles", loggedIn?.id],
    queryFn: () => getArticles(),
  });

  const loadedCollection = useQuery({
    queryKey: ["getCollection", id],
    queryFn: () => getCollection(id || ""),
    enabled: !!id,
  });

  const author = useQuery({
    queryKey: ["getAuthor", loadedCollection.data?.author],
    queryFn: () => getAuthor(loadedCollection.data?.author || ""),
    enabled: !!loadedCollection.data?.id,
  });

  const trash = useMutation({
    mutationFn: async () => {
      if (!window.confirm("Are you sure you want to delete this collection?"))
        return;
      notification("loading", "Deleting collection");
      await deleteCollection(id || "");
    },
    onError: () => notification("error", "Error deleting collection"),
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: ["getCollection", id] });
      notification("success", `Deleted collection ${id}`);
      navigate("/my-articles");
    },
  });

  const [collection, setCollection] = useState(blank);

  useEffect(() => {
    if (loadedCollection.data) setCollection(loadedCollection.data);
  }, [loadedCollection.data]);

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

  const error = articles.isError || loadedCollection.isError || author.isError;
  const loading =
    articles.isLoading || loadedCollection.isLoading || author.isLoading;
  useEffect(() => {
    if (error) notification("error", "Error loading collection data");
    else if (loading) notification("loading", "Loading collection data");
    else notification("clear");
  }, [error, loading]);

  const editable = !!loggedIn && (fresh || collection?.author === loggedIn.id);

  let prefix = "";
  if (fresh) prefix = "New";
  else if (editable) prefix = "Edit";

  if (!collection || !articles.data || !author.data)
    return (
      <Section>
        <h2>{prefix} Collection</h2>
      </Section>
    );

  const authorString =
    author.data.name +
    (editable ? " (You)" : "") +
    " | " +
    author.data.institution;

  const selectedArticles = collection.articles
    .map((id) => articles.data.find((article) => article.id === id))
    .filter((article) => article);

  const unselectedArticles = articles.data.filter(
    (article) => !collection.articles.find((id) => article.id === id)
  );

  return (
    <Section>
      <h2>{prefix} Collection</h2>

      {/* metadata */}
      <Grid cols={2}>
        <Field
          label="Title"
          placeholder="Collection title"
          disabled={!editable}
          value={collection.title}
          onChange={(event) => editField("title", event.target.value)}
          form="collection-form"
        />
        <Field
          label="Description"
          optional={true}
          placeholder="Collection description"
          disabled={!editable}
          value={collection.description}
          onChange={(event) => editField("description", event.target.value)}
          form="collection-form"
        />
      </Grid>

      {/* details (read-only metadata) */}
      <Grid cols={2}>
        <Stat label="Author" value={authorString} />
        <Stat label="Last Saved" value={<Ago date={collection.date} />} />
      </Grid>

      {/* articles */}
      <h3>Selected Articles ({selectedArticles.length})</h3>
      <Grid>
        {selectedArticles.map((article, index) => (
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

      {/* unselected articles */}
      <h3>Add Articles ({unselectedArticles.length})</h3>
      <Grid>
        {unselectedArticles.map((article, index) => (
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

      {/* actions */}
      <Flex>
        {!fresh && <Button text="Share" icon="share-nodes" />}
        {editable && <Button text="Save" icon="floppy-disk" form="main-form" />}
        {!fresh && editable && (
          <Button
            text="Delete"
            icon="trash-alt"
            onClick={() => trash.mutate()}
          />
        )}
      </Flex>
    </Section>
  );
};

export default Collection;

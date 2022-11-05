import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthor } from "@/api/account";
import { getArticles } from "@/api/article";
import { deleteCollection, getCollection, saveCollection } from "@/api/collection";
import Ago from "@/components/Ago";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import { notification } from "@/components/Notification";
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

  const loadedCollection = useQuery({
    queryKey: ["getCollection", id],
    queryFn: () => getCollection(id || ""),
    enabled: !!id,
  });

  const articleList = useQuery({
    queryKey: ["getArticles", editable, loadedCollection.data?.articles],
    queryFn: () =>
      getArticles(editable ? undefined : loadedCollection.data?.articles),
    enabled: !!loadedCollection.data?.articles,
  });

  const author = useQuery({
    queryKey: ["getAuthor", loadedCollection.data?.author],
    queryFn: () => getAuthor(loadedCollection.data?.author || ""),
    initialData: fresh ? loggedIn : undefined,
    enabled: !!loadedCollection.data?.id,
  });

  const save = useMutation({
    mutationFn: async () => {
      notification("loading", "Saving collection");
      await saveCollection(id || "");
    },
    onError: () => notification("error", "Error saving collection"),
    onSuccess: async () => {
      await queryClient.removeQueries({ queryKey: ["getCollection", id] });
      notification("success", `Saved collection ${id}`);
    },
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
      await queryClient.removeQueries({ queryKey: ["getCollection", id] });
      notification("success", `Deleted collection ${id}`);
      navigate("/my-articles");
    },
  });

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

  const heading = (
    <h2>
      {fresh && "New "}
      {!fresh && editable && "Edit "}Collection
    </h2>
  );

  let metadata = <></>;
  if (collection)
    metadata = (
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
    );
  else metadata = <>Loading</>;

  let details = <></>;
  if (collection) {
    const by = author.data
      ? author.data.name +
        (editable ? " (You)" : "") +
        " | " +
        author.data.institution
      : "Loading...";
    details = (
      <Grid cols={2}>
        <Stat label="Author" value={by} />
        <Stat label="Last Saved" value={<Ago date={collection.date} />} />
      </Grid>
    );
  }

  let articles = <></>;
  if (articleList.data) {
    if (editable) {
      const selected = collection.articles
        .map((id) => articleList.data?.find((article) => article.id === id))
        .filter((article) => article);

      const unselected = articleList.data?.filter(
        (article) => !collection.articles.find((id) => article.id === id)
      );

      articles = (
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
      );
    } else {
      articles = (
        <>
          <h3>Articles ({articleList.data.length})</h3>
          <Grid>
            {articleList.data.map((article, index) => (
              <Card key={index} article={article} />
            ))}
          </Grid>
        </>
      );
    }
  }

  let actions = <></>;
  if (collection)
    actions = (
      <Flex>
        {!fresh && <Button text="Share" icon="share-nodes" />}
        {editable && (
          <Button
            text="Save"
            icon="floppy-disk"
            form="main-form"
            onClick={() => save.mutate()}
          />
        )}
        {!fresh && editable && (
          <Button
            text="Delete"
            icon="trash-alt"
            onClick={() => trash.mutate()}
          />
        )}
      </Flex>
    );

  return (
    <Section>
      {heading}
      {metadata}
      {details}
      {articles}
      {actions}
    </Section>
  );
};

export default Collection;

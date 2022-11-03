import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Section from "@/components/Section";
import Grid from "@/components/Grid";
import Spinner from "@/components/Spinner";
import Field from "@/components/Field";
import Card from "@/components/Card";
import Flex from "@/components/Flex";
import Button from "@/components/Button";
import { ReadArticle, ReadCollection } from "@/types";
import { GlobalState } from "@/App";
import { getCollection } from "@/api/collection";
import { getArticles } from "@/api/article";

const blank: ReadCollection = {
  id: "",
  author: {
    id: "",
    name: "",
    institution: "",
  },
  date: new Date().toISOString(),
  title: "",
  description: "",
  articles: [],
};

interface Props {
  fresh: boolean;
}

const Collection = ({ fresh }: Props) => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Array<ReadArticle> | undefined>();
  const [collection, setCollection] = useState<ReadCollection | undefined>();
  const { loggedIn } = useContext(GlobalState);
  const { id } = useParams();
  const editable =
    !!loggedIn && (fresh || collection?.author.id === loggedIn.id);

  const editCollection = <T extends keyof ReadCollection>(
    key: T,
    value: ReadCollection[T]
  ) =>
    setCollection((collection) =>
      collection ? { ...collection, [key]: value } : undefined
    );

  const addArticle = (id: ReadCollection["articles"][0]) =>
    setCollection((collection) =>
      collection
        ? {
            ...collection,
            articles: [...collection.articles, id],
          }
        : undefined
    );

  const removeArticle = (id: ReadCollection["articles"][0]) =>
    setCollection((collection) =>
      collection
        ? {
            ...collection,
            articles: collection.articles.filter((article) => article !== id),
          }
        : undefined
    );

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (id) setCollection(await getCollection(id));
      setArticles(await getArticles());
      setLoading(false);
    })();
  }, [id]);

  let metadata = <></>;
  if (collection)
    metadata = (
      <Grid cols={2}>
        <Field
          label="Title"
          placeholder="Collection title"
          disabled={!editable}
          value={collection.title}
          onChange={(event) => editCollection("title", event.target.value)}
          form="collection-form"
        />
        <Field
          label="Description"
          optional={true}
          placeholder="Collection description"
          disabled={!editable}
          value={collection.description}
          onChange={(event) =>
            editCollection("description", event.target.value)
          }
          form="collection-form"
        />
      </Grid>
    );

  let selectedArticles = <></>;
  let unselectedArticles = <></>;
  if (collection && articles) {
    selectedArticles = (
      <Grid>
        {collection.articles
          .map((id) => articles.find((article) => article.id === id))
          .filter((article) => article)
          .map((article, index) => (
            <Card
              key={index}
              article={article}
              action={{
                icon: "times",
                onClick: () => removeArticle(article?.id || ""),
              }}
            />
          ))}
      </Grid>
    );
    unselectedArticles = (
      <Grid>
        {articles
          .filter(
            (article) => !collection.articles.find((id) => article.id === id)
          )
          .map((article, index) => (
            <Card
              key={index}
              article={article}
              action={{
                icon: "plus",
                onClick: () => addArticle(article.id),
              }}
            />
          ))}
      </Grid>
    );
  }

  const actions = (
    <Flex>
      <Button text="Share" icon="share-nodes" />
      {editable && <Button text="Save" icon="floppy-disk" form="main-form" />}
      {!fresh && editable && <Button text="Delete" icon="trash-alt" />}
    </Flex>
  );

  return (
    <Section>
      <h2>Collection</h2>
      {loading && "Loading collection metadata..."}
      {metadata}
      <h3>Selected Articles</h3>
      {loading && "Loading collection articles..."}
      {selectedArticles}
      <h3>Add Articles</h3>
      {loading && "Loading collection articles..."}
      {unselectedArticles}
      {actions}
      {loading && <Spinner />}
    </Section>
  );
};

export default Collection;

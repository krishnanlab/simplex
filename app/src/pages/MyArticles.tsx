import { useContext, useEffect, useState } from "react";
import Section from "@/components/Section";
import { getArticles } from "@/api/article";
import { getCollections } from "@/api/collection";
import { ReadArticle, ReadCollection } from "@/global/types";
import Card from "@/components/Card";
import Grid from "@/components/Grid";
import Flex from "@/components/Flex";
import Button from "@/components/Button";
import Notification from "@/components/Notification";
import { State } from "@/global/state";

const MyArticles = () => {
  const { loggedIn } = useContext(State);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Array<ReadArticle>>([]);
  const [collections, setCollections] = useState<Array<ReadCollection>>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const articles = await getArticles();
      const collections = await getCollections();
      setArticles(articles);
      setCollections(collections);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Section>
        <h2>My Articles</h2>
        {!articles.length && "Loading your articles..."}
        <Grid>
          {articles?.map((article, index) => (
            <Card
              key={index}
              article={article}
              editable={article.author === loggedIn?.id}
            />
          ))}
        </Grid>
        <Flex>
          <Button to="/" text="New Article" icon="plus" />
        </Flex>
        <h2>My Collections</h2>
        {!collections.length && "Loading your collections..."}
        <Grid>
          {collections?.map((collection, index) => (
            <Card
              key={index}
              collection={collection}
              editable={collection.author === loggedIn?.id}
            />
          ))}
        </Grid>
        <Flex>
          <Button to="/collection" text="New Collection" icon="plus" />
        </Flex>
        {loading && <Notification />}
      </Section>
    </>
  );
};

export default MyArticles;

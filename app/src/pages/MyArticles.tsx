import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/api/article";
import { getCollections } from "@/api/collection";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Notification from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";

const MyArticles = () => {
  const { loggedIn } = useContext(State);

  const articles = useQuery({
    queryKey: ["getArticles", loggedIn?.id],
    queryFn: () => getArticles(),
  });

  const collections = useQuery({
    queryKey: ["getCollections", loggedIn?.id],
    queryFn: () => getCollections(),
  });

  return (
    <>
      <Section>
        <h2>My Articles</h2>
        {articles.isLoading && (
          <Notification type="loading" text="Loading your articles" />
        )}
        {articles.data && (
          <Grid>
            {articles.data.map((article, index) => (
              <Card
                key={index}
                article={article}
                editable={article.author === loggedIn?.id}
              />
            ))}
          </Grid>
        )}
        <Flex>
          <Button to="/" text="New Article" icon="plus" />
        </Flex>
        <h2>My Collections</h2>
        {collections.isLoading && (
          <Notification type="loading" text="Loading your collections" />
        )}
        {collections.data && (
          <Grid>
            {collections.data.map((collection, index) => (
              <Card
                key={index}
                collection={collection}
                editable={collection.author === loggedIn?.id}
              />
            ))}
          </Grid>
        )}
        <Flex>
          <Button to="/collection" text="New Collection" icon="plus" />
        </Flex>
      </Section>
    </>
  );
};

export default MyArticles;

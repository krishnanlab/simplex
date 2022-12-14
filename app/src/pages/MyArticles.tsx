import { useContext } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { useQuery } from "@tanstack/react-query";
import { getUserArticles } from "@/api/article";
import { getUserCollections } from "@/api/collection";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Meta from "@/components/Meta";
import Notification from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";

/** logged-in user's page of articles and collections */
const MyArticles = () => {
  const { loggedIn } = useContext(State);
  console.log(localStorage["anonymous-articles"]);
  const [anonymousArticles] =
    useLocalStorage<Array<string>>("anonymous-articles");

  /** query for user's articles */
  const articles = useQuery({
    queryKey: ["getArticles", loggedIn?.id],
    queryFn: () => getUserArticles(),
  });

  /** query for user's collection */
  const collections = useQuery({
    queryKey: ["getCollections", loggedIn?.id],
    queryFn: () => getUserCollections(),
  });

  return (
    <>
      <Meta title="My Articles" />
      <Section>
        <h2>My Articles</h2>

        {/* statuses */}
        {articles.isLoading && (
          <Notification type="loading" text="Loading your articles" />
        )}
        {articles.isError && (
          <Notification type="error" text="Error loading your articles" />
        )}

        {articles.data && (
          <Grid>
            {articles.data.map((article, index) => (
              <Card key={index} article={article} editable={true} />
            ))}
          </Grid>
        )}

        {/* new */}
        <Flex>
          <Button to="/" text="New Article" icon={<FaPlus />} />
        </Flex>
      </Section>

      <Section fill="offWhite">
        <h2>My Collections</h2>

        {/* statuses */}
        {collections.isLoading && (
          <Notification type="loading" text="Loading your collections" />
        )}
        {collections.isError && (
          <Notification type="error" text="Error loading your collections" />
        )}

        {collections.data && (
          <Grid>
            {collections.data.map((collection, index) => (
              <Card key={index} collection={collection} editable={true} />
            ))}
          </Grid>
        )}

        {/* new */}
        <Flex>
          <Button to="/collection" text="New Collection" icon={<FaPlus />} />
        </Flex>
      </Section>

      {anonymousArticles?.length && (
        <Section>
          <h2>Anonymous Articles</h2>

          <p style={{ textAlign: "center" }}>
            Articles created anonymously (not logged-in) on this device.
          </p>

          <Flex>
            {anonymousArticles.map((article, index) => (
              <Link key={index} to={`/article/${article}`}>
                {String(article)}
              </Link>
            ))}
          </Flex>
        </Section>
      )}
    </>
  );
};

export default MyArticles;

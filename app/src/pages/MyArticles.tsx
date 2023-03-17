import { useContext, useEffect } from "react";
import { FaPlus, FaRegTrashAlt, FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteArticle, getUserArticles } from "@/api/article";
import { deleteCollection, getUserCollections } from "@/api/collection";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Meta from "@/components/Meta";
import Notification, { notification } from "@/components/Notification";
import Section from "@/components/Section";
import Share from "@/components/Share";
import { State } from "@/global/state";
import { ArticleSummary, CollectionSummary } from "@/global/types";
import { scrollToTop } from "@/util/dom";

/** logged-in user's page of articles and collections */
const MyArticles = () => {
  const { currentUser } = useContext(State);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /** redirect if not logged in */
  useEffect(() => {
    if (currentUser === null) {
      navigate("/login");
      scrollToTop();
    }
  });

  /** query for user's articles */
  const {
    data: articles,
    isLoading: articlesLoading,
    isError: articlesError,
    error: articlesErrorMessage,
  } = useQuery({
    queryKey: ["getUserArticles", currentUser?.id],
    queryFn: () => getUserArticles(),
  });

  /** query for user's collection */
  const {
    data: collections,
    isLoading: collectionsLoading,
    isError: collectionsError,
    error: collectionsErrorMessage,
  } = useQuery({
    queryKey: ["getUserCollections", currentUser?.id],
    queryFn: () => getUserCollections(),
  });

  const clearCache = () => {
    queryClient.removeQueries({
      queryKey: ["getUserArticles", currentUser?.id],
    });
    queryClient.removeQueries({
      queryKey: ["getUserCollections", currentUser?.id],
    });
  };

  /** mutation for deleting article */
  const { mutate: deleteArticleMutate, isLoading: deleteArticleLoading } =
    useMutation({
      mutationFn: async (article: ArticleSummary) => deleteArticle(article.id),
      onMutate: () => notification("loading", "Deleting article"),
      onSuccess: async (_, article) => {
        notification("success", `Deleted article "${article.title}"`);
        clearCache();
      },
      onError: () => notification("error", "Error deleting article"),
    });

  /** mutation for deleting collection */
  const { mutate: deleteCollectionMutate, isLoading: deleteCollectionLoading } =
    useMutation({
      mutationFn: async (collection: CollectionSummary) =>
        deleteCollection(collection.id),
      onMutate: () => notification("loading", "Deleting collection"),
      onSuccess: async (_, collection) => {
        notification("success", `Deleted collection "${collection.title}"`);
        clearCache();
      },
      onError: () => notification("error", "Error deleting collection"),
    });

  return (
    <>
      <Meta title="My Articles" />
      <Section>
        <h2>My Articles</h2>

        {/* statuses */}
        {articlesLoading && (
          <Notification type="loading" text="Loading your articles" />
        )}
        {articlesError && (
          <Notification
            type="error"
            text={["Error loading your articles", articlesErrorMessage]}
          />
        )}

        {articles && (
          <Grid>
            {articles.map((article, index) => (
              <Card
                key={index}
                article={article}
                editable={true}
                actions={[
                  <Share
                    key={0}
                    trigger={
                      <Button
                        fill={false}
                        icon={<FaShareAlt />}
                        tooltip="Share article"
                      />
                    }
                    type="article"
                    title={article.title}
                    link={`${window.location.origin}/articles/${article.id}`}
                  />,
                  <Button
                    key={1}
                    icon={<FaRegTrashAlt />}
                    fill={false}
                    disabled={deleteArticleLoading}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete this article?\n\n"${article.title}"`
                        )
                      )
                        deleteArticleMutate(article);
                    }}
                    tooltip="Delete article"
                  />,
                ]}
              />
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
        {collectionsLoading && (
          <Notification type="loading" text="Loading your collections" />
        )}
        {collectionsError && (
          <Notification
            type="error"
            text={["Error loading your collections", collectionsErrorMessage]}
          />
        )}

        {collections && (
          <Grid>
            {collections.map((collection, index) => (
              <Card
                key={index}
                collection={collection}
                editable={true}
                actions={[
                  <Share
                    key={0}
                    trigger={
                      <Button
                        fill={false}
                        icon={<FaShareAlt />}
                        tooltip="Share collection"
                      />
                    }
                    type="collection"
                    title={collection.title}
                    link={`${window.location.origin}/collections/${collection.id}`}
                  />,
                  <Button
                    key={1}
                    icon={<FaRegTrashAlt />}
                    fill={false}
                    disabled={deleteCollectionLoading}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete this collection?\n\n"${collection.title}"`
                        )
                      )
                        deleteCollectionMutate(collection);
                    }}
                    tooltip="Delete article"
                  />,
                ]}
              />
            ))}
          </Grid>
        )}

        {/* new */}
        <Flex>
          <Button to="/collection" text="New Collection" icon={<FaPlus />} />
        </Flex>
      </Section>
    </>
  );
};

export default MyArticles;

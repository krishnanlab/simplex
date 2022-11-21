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
import Meta from "@/components/Meta";
import Notification, { notification } from "@/components/Notification";
import Section from "@/components/Section";
import Share from "@/components/Share";
import Stat from "@/components/Stat";
import { State } from "@/global/state";
import { ReadCollection } from "@/global/types";

interface Props {
  /** whether starting a new collection */
  fresh: boolean;
}

/** blank collection to start with and fallback to */
const blank: ReadCollection = {
  id: "",
  author: "",
  date: new Date().toISOString(),
  title: "",
  description: "",
  articles: [],
};

/** new/edit/view page for collection */
const Collection = ({ fresh }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedIn } = useContext(State);
  const queryClient = useQueryClient();

  /** redirect if not logged in */
  useEffect(() => {
    if (!loggedIn) navigate("/login");
  });

  /** main editable collection state */
  const [collection, setCollection] = useState(blank);

  /** whether collection is writable (either new, or belongs to logged in user) */
  const editable = fresh || (!!loggedIn && collection?.author === loggedIn.id);

  /** query for loading collection data (if loading existing collection) */
  const {
    data: loadedCollection,
    isInitialLoading: collectionLoading,
    isError: collectionError,
  } = useQuery({
    queryKey: ["getCollection", id],
    queryFn: () => getCollection(id || ""),
    initialData: fresh ? blank : undefined,
  });

  /** query for getting author details from just id */
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

  /** query for getting logged-in user's articles */
  const {
    data: userArticles,
    isInitialLoading: userArticlesLoading,
    isError: userArticlesError,
  } = useQuery({
    queryKey: ["getArticles", "user", loggedIn?.id],
    queryFn: () => getArticles(),
    enabled: editable && !!loggedIn?.id,
  });

  /** query for getting collection's articles (if third-party collection) */
  const {
    data: collectionArticles,
    isInitialLoading: collectionArticlesLoading,
    isError: collectionArticlesError,
  } = useQuery({
    queryKey: ["getArticles", "collection", loadedCollection?.articles],
    queryFn: () => getArticles(loadedCollection?.articles),
    enabled: !editable && !!loadedCollection?.articles,
  });

  /** mutation for saving collection */
  const {
    mutate: save,
    isLoading: saveLoading,
    isError: saveError,
  } = useMutation({
    mutationFn: () => saveCollection(id || ""),
    onSuccess: async (data) => {
      if (data.id) await navigate("/collection/" + data.id);
      notification("success", `Saved collection "${collection.title}"`);
      await queryClient.removeQueries({ queryKey: ["getCollection", id] });
    },
  });

  /** mutation for deleting collection */
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
      await navigate("/my-articles");
      notification("success", `Deleted collection "${collection.title}"`);
      await queryClient.removeQueries({ queryKey: ["getCollection", id] });
    },
  });

  /** when loaded collection changes, set editable collection data */
  useEffect(() => {
    if (loadedCollection) setCollection(loadedCollection);
  }, [loadedCollection]);

  /** helper func to edit collection data state */
  const editField = useCallback(
    <T extends keyof ReadCollection>(key: T, value: ReadCollection[T]) =>
      setCollection((collection) => ({ ...collection, [key]: value })),
    []
  );

  /** helper func to add article to list in collection data */
  const addArticle = useCallback(
    (id: ReadCollection["articles"][0]) =>
      setCollection((collection) => ({
        ...collection,
        articles: [...collection.articles, id],
      })),
    []
  );

  /** helper func to remove article from list in collection data */
  const removeArticle = useCallback(
    (id: ReadCollection["articles"][0]) =>
      setCollection((collection) => ({
        ...collection,
        articles: collection.articles.filter((article) => article !== id),
      })),
    []
  );

  /** author string */
  const by = author
    ? author.name + (editable ? " (You)" : "") + " | " + author.institution
    : "You";

  /** user's articles that are selected */
  const selected = useMemo(
    () =>
      collection.articles
        .map((id) => userArticles?.find((article) => article.id === id))
        .filter(Boolean) || [],
    [collection.articles, userArticles]
  );

  /** user's articles that are not selected */
  const unselected = useMemo(
    () =>
      userArticles?.filter(
        (article) => !collection.articles.find((id) => article.id === id)
      ) || [],
    [collection.articles, userArticles]
  );

  /** overall loading */
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

  /** overall error */
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

  /** heading and title text */
  let heading = "";
  if (fresh) heading = "New Collection";
  else if (editable) heading = "Edit Collection";
  else heading = "Collection";

  return (
    <Section>
      {/* heading */}
      <Meta title={[heading, collection.title]} />
      <h2>{heading}</h2>

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
          <h3>Articles ({collectionArticles?.length})</h3>
          <Grid>
            {collectionArticles?.map((article, index) => (
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
        {!fresh && (
          <Share heading="Share Collection" field="URL to this collection" />
        )}
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

import { useCallback, useContext, useEffect, useState } from "react";
import {
  FaPlus,
  FaRegSave,
  FaRegTrashAlt,
  FaShareAlt,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { capitalize } from "lodash";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthor } from "@/api/account";
import { getArticles, getUserArticles } from "@/api/article";
import {
  deleteCollection,
  getCollection,
  saveCollection,
  saveNewCollection,
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
import { blankAuthor, blankCollection, Collection } from "@/global/types";
import { sleep } from "@/util/debug";
import { scrollToTop } from "@/util/dom";
import { authorString } from "@/util/string";

/** new/edit/view page for collection */
const CollectionPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(State);
  const queryClient = useQueryClient();

  /** main editable collection state */
  const [editableCollection, setEditableCollection] = useState(blankCollection);

  /** what "mode" we are in */
  let mode: "new" | "anon" | "edit" | "view" = "view";

  /** determine mode */
  if (!id && !!currentUser) {
    /** logged in user creating new collection */
    mode = "new";
  } else if (!id && !currentUser) {
    /** anonymous user creating new collection */
    mode = "anon";
  } else if (!!currentUser && editableCollection.author === currentUser.id) {
    /** logged in user editing collection belonging to them */
    mode = "edit";
  } else {
    /** logged in or anonymous user viewing someone else's collection */
    mode = "view";
  }

  /** anonymous collections not supported, so redirect */
  useEffect(() => {
    if (mode === "anon") {
      navigate("/");
      scrollToTop();
    }
  });

  /** heading and title text */
  const heading = capitalize(mode) + " Collection";

  /** query for loading collection data */
  const {
    data: loadedCollection = blankCollection,
    isInitialLoading: collectionLoading,
    isError: collectionError,
  } = useQuery({
    queryKey: ["getCollection", id],
    queryFn: () => getCollection(id),
    enabled: !!id,
  });

  /** query for getting author details from just id */
  const {
    data: author = blankAuthor,
    isInitialLoading: authorLoading,
    isError: authorError,
  } = useQuery({
    queryKey: ["getAuthor", loadedCollection.author],
    queryFn: () => getAuthor(loadedCollection.author),
    enabled: !!loadedCollection.author,
  });

  /** query for getting all of logged in user's articles */
  const {
    data: userArticles = [],
    isInitialLoading: userArticlesLoading,
    isError: userArticlesError,
  } = useQuery({
    queryKey: ["getUserArticles", currentUser?.id],
    queryFn: getUserArticles,
    enabled: !!currentUser?.id,
  });

  /** query for getting collection's articles */
  const {
    data: collectionArticles = [],
    isInitialLoading: collectionArticlesLoading,
    isError: collectionArticlesError,
  } = useQuery({
    queryKey: ["getArticles", loadedCollection.articles],
    queryFn: () => getArticles(loadedCollection.articles),
    enabled: !!loadedCollection.articles,
  });

  /** clear query cache */
  const clearCache = () => {
    queryClient.removeQueries({ queryKey: ["getCollection", id] });
    queryClient.removeQueries({ queryKey: ["getArticles"] });
    queryClient.removeQueries({
      queryKey: ["getUserArticles", currentUser?.id],
    });
    queryClient.removeQueries({
      queryKey: ["getUserCollections", currentUser?.id],
    });
  };

  /** mutation for saving collection */
  const { mutate: save, isLoading: saveLoading } = useMutation({
    mutationFn: () =>
      id
        ? saveCollection(editableCollection, id)
        : saveNewCollection(editableCollection),
    onMutate: () => notification("loading", "Saving collection"),
    onSuccess: async (data) => {
      notification("success", `Saved collection "${editableCollection.title}"`);
      await sleep(1000);
      clearCache();
      if (data?.id) await navigate("/collection/" + data.id);
    },
    onError: () => notification("error", "Error saving collection"),
  });

  /** mutation for deleting collection */
  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation({
    mutationFn: async () => deleteCollection(id),
    onMutate: () => notification("loading", "Deleting collection"),
    onSuccess: async () => {
      notification(
        "success",
        `Deleted collection "${editableCollection.title}"`
      );
      await sleep(1000);
      clearCache();
      await navigate("/my-articles");
      scrollToTop();
    },
    onError: () => notification("error", "Error deleting collection"),
  });

  /** helper func to edit collection data state */
  const editField = useCallback(
    <T extends keyof Collection>(key: T, value: Collection[T]) =>
      setEditableCollection((editableCollection) => ({
        ...editableCollection,
        [key]: value,
      })),
    []
  );

  /** helper func to add article to list in collection data */
  const addArticle = useCallback(
    (id: Collection["articles"][0]) =>
      setEditableCollection((editableCollection) => ({
        ...editableCollection,
        articles: [...editableCollection.articles, id],
      })),
    []
  );

  /** helper func to remove article from list in collection data */
  const removeArticle = useCallback(
    (id: Collection["articles"][0]) =>
      setEditableCollection((editableCollection) => ({
        ...editableCollection,
        articles: editableCollection.articles.filter(
          (article) => article !== id
        ),
      })),
    []
  );

  /** user's articles that are selected */
  const selected = userArticles.filter((article) =>
    editableCollection.articles.find((id) => article.id === id)
  );

  /** user's articles that are not selected */
  const unselected = userArticles.filter(
    (article) => !editableCollection.articles.find((id) => article.id === id)
  );

  /** initialize editable collection from loaded */
  useEffect(() => {
    if (loadedCollection.id) setEditableCollection(loadedCollection);
  }, [setEditableCollection, loadedCollection]);

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

  return (
    <Section>
      {/* heading */}
      <Meta title={[heading, editableCollection.title]} />
      <h2>{heading}</h2>

      {/* metadata */}
      <Grid cols={2}>
        <Field
          label="Title"
          placeholder="Collection title"
          disabled={mode === "view"}
          value={editableCollection.title}
          onChange={(value) => editField("title", value)}
          form="collection-form"
        />
        <Field
          label="Description"
          optional={true}
          placeholder="Collection description"
          disabled={mode === "view"}
          value={editableCollection.description}
          onChange={(value) => editField("description", value)}
          form="collection-form"
        />
      </Grid>

      {/* details */}
      {mode !== "new" && (
        <Grid cols={2}>
          <Stat
            label="Author"
            value={authorString(author, mode === "edit")}
            title={author.id}
          />
          <Stat
            label="Last Saved"
            value={<Ago date={editableCollection.date} />}
          />
        </Grid>
      )}

      {/* editable article list */}
      {mode !== "view" && (
        <>
          <h3>Selected Articles ({selected.length})</h3>
          <Grid>
            {selected.map((article, index) => (
              <Card
                key={index}
                article={article}
                editable={true}
                actions={[
                  <Button
                    key={0}
                    fill={false}
                    icon={<FaTimes />}
                    onClick={() => removeArticle(article.id)}
                    tooltip="Remove article from collection"
                  />,
                ]}
              />
            ))}
          </Grid>
          <h3>Add Articles ({unselected.length})</h3>
          <Grid>
            {unselected.map((article, index) => (
              <Card
                key={index}
                article={article}
                editable={true}
                actions={[
                  <Button
                    key={0}
                    fill={false}
                    icon={<FaPlus />}
                    onClick={() => addArticle(article.id)}
                    tooltip="Add article to collection"
                  />,
                ]}
              />
            ))}
          </Grid>
        </>
      )}

      {/* read-only article list */}
      {mode === "view" && (
        <>
          <h3>Articles ({collectionArticles?.length})</h3>
          <Grid>
            {collectionArticles?.map((article, index) => (
              <Card key={index} article={article} editable={false} />
            ))}
          </Grid>
        </>
      )}

      {/* actions */}
      <Flex>
        {/* save */}
        {mode !== "view" && (
          <Button
            text="Save"
            icon={<FaRegSave />}
            disabled={saveLoading || deleteLoading}
            type="submit"
            form="collection-form"
          />
        )}

        {/* share */}
        {mode !== "new" && (
          <Share
            trigger={<Button text="Share" icon={<FaShareAlt />} />}
            type="collection"
            title={loadedCollection.title}
          />
        )}

        {/* delete */}
        {mode === "edit" && (
          <Button
            text="Delete"
            icon={<FaRegTrashAlt />}
            disabled={saveLoading || deleteLoading}
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete this collection?"
                )
              )
                return;
              deleteMutate();
            }}
          />
        )}
      </Flex>

      {/* associated form */}
      <Form id="collection-form" onSubmit={() => save()} />
    </Section>
  );
};

export default CollectionPage;

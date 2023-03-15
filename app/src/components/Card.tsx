import { ReactNode } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { css } from "@stitches/react";
import Ago from "@/components/Ago";
import Button from "@/components/Button";
import Flex, { Spacer } from "@/components/Flex";
import { dark, gray, rounded, shadow, white } from "@/global/palette";
import { ArticleSummary, CollectionSummary } from "@/global/types";

type Props = {
  /** article details */
  article?: ArticleSummary;
  /** collection details */
  collection?: CollectionSummary;
  /** change design/icons/etc based on whether editable */
  editable?: boolean;
  /** extra action buttons */
  actions?: Array<ReactNode>;
};

const cardStyle = css({
  padding: "15px 20px",
  background: white,
  borderRadius: rounded,
  "&[data-editable='true']": {
    boxShadow: shadow,
  },
  "&[data-editable='false']": {
    outline: "solid 1px",
    outlineColor: gray,
  },
});

const summaryStyle = css({
  flexGrow: 1,
});

const countStyle = css({
  color: dark,
});

/** card to display article or collection  */
const Card = ({ article, collection, editable = false, actions }: Props) => (
  <Flex
    dir="col"
    gap="small"
    hAlign="left"
    className={cardStyle()}
    data-editable={editable}
  >
    {/* title */}
    <strong>{article?.title || collection?.title}</strong>
    {/* secondary info */}
    <div className={summaryStyle()}>
      {article && article.textTruncated}
      {collection && collection.description}
    </div>

    {/* tertiary info */}
    <div className={countStyle()}>
      {article
        ? `In ${article.collectionCount} collection(s)`
        : `Has ${collection?.articleCount} article(s)`}
    </div>

    {/* actions */}
    <Flex gap="tiny" wrap={false}>
      {/* view/edit button */}
      <Button
        to={
          "/" +
          (collection ? "collection" : "article") +
          "/" +
          (article?.id || collection?.id)
        }
        fill={false}
        icon={editable ? <FaEdit /> : <FaEye />}
        tooltip={`Go to ${collection ? "collection" : "article"} page and ${
          editable ? "edit" : "view"
        }`}
      />
      <Ago date={article?.date || collection?.date || ""} />

      <Spacer />

      {/* extra action elements */}
      {editable && actions}
    </Flex>
  </Flex>
);

export default Card;

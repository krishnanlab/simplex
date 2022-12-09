import { ReactNode } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { css } from "@stitches/react";
import Ago from "@/components/Ago";
import Button from "@/components/Button";
import Flex, { Spacer } from "@/components/Flex";
import { dark, gray, rounded, shadow } from "@/global/palette";
import { ArticleSummary, CollectionSummary } from "@/global/types";

type Props = {
  /** article details */
  article?: ArticleSummary;
  /** collection details */
  collection?: CollectionSummary;
  /** change design/icons/etc based on whether editable */
  editable?: boolean;
  /** extra action button */
  action?: {
    icon: ReactNode;
    onClick: () => void;
  };
};

const cardStyle = css({
  padding: "15px 20px",
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
const Card = ({ article, collection, editable = false, action }: Props) => (
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
    <Flex gap="tiny">
      {/* view/edit button */}
      <Button
        to={
          "/" +
          (article ? "article" : "collection") +
          "/" +
          (article?.id || collection?.id)
        }
        fill={false}
        icon={editable ? <FaEdit /> : <FaEye />}
      />
      <Ago date={article?.date || collection?.date || ""} />

      <Spacer />

      {/* extra action button */}
      {editable && action && (
        <Button fill={false} icon={action.icon} onClick={action.onClick} />
      )}
    </Flex>
  </Flex>
);

export default Card;

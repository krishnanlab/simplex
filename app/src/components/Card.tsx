import { IconName } from "@fortawesome/fontawesome-svg-core";
import { css } from "@stitches/react";
import Ago from "@/components/Ago";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import { dark, gray, rounded, shadow } from "@/global/palette";
import { ReadArticle, ReadCollection } from "@/global/types";
import { shortenURl } from "@/util/string";

interface Props {
  /** article details */
  article?: ReadArticle;
  /** collection details */
  collection?: ReadCollection;
  /** change design/icons/etc based on whether editable */
  editable?: boolean;
  /** extra action button */
  action?: {
    icon: IconName;
    onClick: () => void;
  };
}

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
    {article && <a href={article.source}>{shortenURl(article.source)}</a>}
    {collection && <div>{collection.description}</div>}

    <Spacer />

    {/* tertiary info */}
    <div className={countStyle()}>
      {article
        ? `In ${article.collections.length} collection(s)`
        : `Has ${collection?.articles.length} article(s)`}
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
        icon={editable ? "pen-to-square" : "eye"}
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

const Spacer = () => <div style={{ flexGrow: 1 }}></div>;

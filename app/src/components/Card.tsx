import { css } from "@emotion/react";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import Ago from "@/components/Ago";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import { dark, gray, rounded, shadow } from "@/global/palette";
import { ReadArticle, ReadCollection } from "@/global/types";
import { shortenURl } from "@/util/string";

interface Props {
  article?: ReadArticle;
  collection?: ReadCollection;
  editable?: boolean;
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

const Card = ({ article, collection, editable = false, action }: Props) => (
  <Flex
    dir="col"
    gap="small"
    hAlign="left"
    css={cardStyle}
    data-editable={editable}
  >
    <strong>{article?.title || collection?.title}</strong>
    {article && <a href={article.source}>{shortenURl(article.source)}</a>}
    {collection && <div>{collection.description}</div>}
    <Spacer />
    <div css={countStyle}>
      {article
        ? `In ${article.collections.length} collection(s)`
        : `Has ${collection?.articles.length} article(s)`}
    </div>
    <Flex gap="tiny">
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
      {editable && action && (
        <Button fill={false} icon={action.icon} onClick={action.onClick} />
      )}
    </Flex>
  </Flex>
);

export default Card;

const Spacer = () => <div style={{ flexGrow: 1 }}></div>;

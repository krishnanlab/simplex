import { IconName } from "@fortawesome/fontawesome-svg-core";
import { css } from "@emotion/react";
import { ReadArticle, ReadCollection } from "@/types";
import { dark, shadow } from "@/palette";
import { shortenURl } from "@/util/string";
import Ago from "@/components/Ago";
import Button from "@/components/Button";

interface Props {
  article?: ReadArticle;
  collection?: ReadCollection;
  action?: {
    icon: IconName;
    onClick: () => void;
  };
}

const style = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "10px",
  padding: "15px 20px",
  boxShadow: shadow,
});

const countStyle = css({
  color: dark,
});

const actionsStyle = css({
  display: "flex",
  width: "100%",
  alignItems: "center",
  gap: "5px",
});

const Card = ({ article, collection, action }: Props) => (
  <div css={style}>
    <strong>{article?.title || collection?.title}</strong>
    {article && <a href={article.source}>{shortenURl(article.source)}</a>}
    {collection && <div>{collection.description}</div>}
    <div css={countStyle}>
      {article
        ? `In ${article.collections.length} collection(s)`
        : `Has ${collection?.articles.length} article(s)`}
    </div>
    <div css={actionsStyle}>
      <Button
        to={
          "/" +
          (article ? "article" : "collection") +
          "/" +
          (article?.id || collection?.id)
        }
        fill={false}
        icon="pen-to-square"
      />
      <Ago date={article?.date || collection?.date || ""} />
      <div style={{ flexGrow: 1 }}></div>
      {action && (
        <Button fill={false} icon={action.icon} onClick={action.onClick} />
      )}
    </div>
  </div>
);

export default Card;

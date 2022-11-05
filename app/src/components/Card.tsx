import { css } from "@emotion/react";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import Ago from "@/components/Ago";
import Button from "@/components/Button";
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

const style = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "10px",
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

const actionsStyle = css({
  display: "flex",
  width: "100%",
  alignItems: "center",
  gap: "5px",
});

const Card = ({ article, collection, editable = false, action }: Props) => (
  <div css={style} data-editable={editable}>
    <strong>{article?.title || collection?.title}</strong>
    {article && <a href={article.source}>{shortenURl(article.source)}</a>}
    {collection && <div>{collection.description}</div>}
    <Spacer />
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
        icon={editable ? "pen-to-square" : "eye"}
      />
      <Ago date={article?.date || collection?.date || ""} />
      <Spacer />
      {editable && action && (
        <Button fill={false} icon={action.icon} onClick={action.onClick} />
      )}
    </div>
  </div>
);

export default Card;

const Spacer = () => <div style={{ flexGrow: 1 }}></div>;

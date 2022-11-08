import { css } from "@emotion/react";
import { useQuery } from "@tanstack/react-query";
import { simplify } from "@/api/tool";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Notification from "@/components/Notification";

interface Props {
  word: string;
  ignored: boolean;
  setIgnored: () => unknown;
}

const contentStyle = css({
  maxHeight: "250px",
  overflowY: "auto",
  "& > *": {
    margin: "0 !important",
  },
});

const imageStyle = css({
  width: "100%",
});

const Simplification = ({ word, ignored, setIgnored }: Props) => {
  const {
    data: simplification,
    isLoading: simplifyLoading,
    isError: simplifyError,
  } = useQuery({
    queryKey: ["simplify", word || ""],
    queryFn: () => simplify(word || ""),
    enabled: !!word,
  });

  return (
    <Flex dir="col" gap="small">
      <Flex hAlign="space" wrap={false}>
        <h4>Simplify &quot;{word}&quot;</h4>
        <Button
          text={ignored ? "Remove from ignore list" : "Add to ignore list"}
          icon={ignored ? "times" : "plus"}
          fill={false}
          onClick={() => setIgnored?.()}
        />
      </Flex>
      <div css={contentStyle}>
        {simplification && (
          <Flex dir="col" hAlign="left" gap="small">
            <strong>Synonyms:</strong>
            <div>{simplification.synonyms.join(", ")}</div>
            <strong>Definition:</strong>
            <p>{simplification.definition}</p>
            <a href={simplification.link} target="_blank" rel="noreferrer">
              See more <Icon icon="arrow-up-right-from-square" />
            </a>
            <img src={simplification.image} css={imageStyle} alt="" />
          </Flex>
        )}
        {simplifyLoading && (
          <Notification type="loading" text="Getting synonyms and definition" />
        )}
        {simplifyError && (
          <Notification
            type="error"
            text="Error getting synonyms and definition"
          />
        )}
      </div>
    </Flex>
  );
};

export default Simplification;

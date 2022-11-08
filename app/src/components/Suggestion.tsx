import { css } from "@emotion/react";
import { simplify, Simplify } from "@/api/tool";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import { gray, rounded } from "@/global/palette";
import { useEffect, useState } from "react";
import { sleep } from "@/util/debug";

interface Props {
  word: string;
}

const suggestionStyle = css({
  padding: "30px",
  borderRadius: rounded,
  outline: "solid 1px",
  outlineColor: gray,
});

const contentStyle = css({
  maxHeight: "300px",
  overflowY: "auto",
});

const imageStyle = css({
  width: "33%",
});

const Suggestion = ({ word }: Props) => {
  const [suggestion, setSuggestion] = useState<Simplify>();

  useEffect(() => {
    let latest = true;

    (async () => {
      if (!word) {
        setSuggestion(undefined);
        return;
      }
      await sleep(500); // debounce
      if (!latest) return;
      const suggestion = await simplify(word);
      if (!latest) return;
      setSuggestion(suggestion);
    })();

    return () => {
      latest = false;
    };
  }, [word]);

  if (!suggestion) return <></>;

  return (
    <Flex css={suggestionStyle} dir="col" hAlign="left" gap="small">
      <Flex hAlign="space" wrap={false}>
        <h4>&quot;{word}&quot;</h4>
      </Flex>
      <Flex css={contentStyle} vAlign="top" wrap={false}>
        <Flex display="inline" dir="col" hAlign="left" gap="small">
          <strong>Synonyms:</strong>
          <p>{suggestion.synonyms.join(", ")}</p>
          <strong>Definition:</strong>
          <p>{suggestion.definition}</p>
          <a href={suggestion.link} target="_blank" rel="noreferrer">
            See more <Icon icon="arrow-up-right-from-square" />
          </a>
        </Flex>
        <img src={suggestion.image} css={imageStyle} alt="" />
      </Flex>
    </Flex>
  );
};

export default Suggestion;

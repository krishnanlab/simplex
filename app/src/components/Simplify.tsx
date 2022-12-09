import { FaExternalLinkAlt, FaPlus, FaTimes } from "react-icons/fa";
import { css } from "@stitches/react";
import { useQuery } from "@tanstack/react-query";
import { simplify } from "@/api/tool";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Notification from "@/components/Notification";

type Props = {
  /** word to simplified */
  word: string;
  /** whether word is in ignore list */
  ignored: boolean;
  /** on click of ignore button */
  setIgnored: () => unknown;
};

const contentStyle = css({
  maxHeight: "250px",
  overflowY: "auto",
});

const imageStyle = css({
  width: "100%",
});

/** synonyms, definitions, etc. of provided word HOC  */
const Simplification = ({ word, ignored, setIgnored }: Props) => {
  /** query for simplification */
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
      {/* top */}
      <Flex hAlign="space" wrap={false}>
        <h4>Simplify &quot;{word}&quot;</h4>
        <Button
          text={ignored ? "Remove from ignore list" : "Add to ignore list"}
          icon={ignored ? <FaTimes /> : <FaPlus />}
          fill={false}
          onClick={() => setIgnored?.()}
        />
      </Flex>

      <div className={contentStyle()}>
        {/* content */}
        {simplification && (
          <Flex dir="col" hAlign="left" gap="small">
            <strong>Synonyms:</strong>
            <div>{simplification.synonyms.join(", ")}</div>
            <strong>Definition:</strong>
            <p>{simplification.definition}</p>
            <a href={simplification.link} target="_blank" rel="noreferrer">
              See more <FaExternalLinkAlt />
            </a>
            <img src={simplification.image} className={imageStyle()} alt="" />
          </Flex>
        )}

        {/* statuses */}
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

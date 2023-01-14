import { FaExternalLinkAlt, FaPlus, FaTimes } from "react-icons/fa";
import parse from "html-react-parser";
import { css } from "@stitches/react";
import { useQuery } from "@tanstack/react-query";
import { simplify } from "@/api/tool";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Notification from "@/components/Notification";
import { dark } from "@/global/palette";

type Props = {
  /** word to simplified */
  word: string;
  /** whether word is in ignore list */
  ignored: boolean;
  /** on click of ignore button */
  setIgnored: () => unknown;
};

const contentStyle = css({
  width: "100%",
  maxHeight: "250px",
  overflowY: "auto",
});

const emptyStyle = css({
  color: dark,
  fontStyle: "italic",
});

const imageStyle = css({
  width: "100%",
});

const iconStyle = css({
  marginLeft: "0.5em",
});

/** synonyms, definitions, etc. of provided word HOC  */
const Simplify = ({ word, ignored, setIgnored }: Props) => {
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

  const { synonyms, definition, link, image } = simplification || {};

  return (
    <Flex dir="col" gap="small">
      {/* top */}
      <Flex hAlign="space" gap="small">
        <h4>Simplify &quot;{word}&quot;</h4>
        <Button
          text={ignored ? "Remove from ignore list" : "Add to ignore list"}
          icon={ignored ? <FaTimes /> : <FaPlus />}
          onClick={() => setIgnored?.()}
        />
      </Flex>

      <div className={contentStyle()}>
        {/* content */}
        {simplification && (
          <Flex dir="col" hAlign="left" gap="small">
            <strong>Synonyms:</strong>
            {synonyms?.length ? (
              <div>{synonyms.join(", ")}</div>
            ) : (
              <div className={emptyStyle()}>No synonyms found</div>
            )}
            <strong>Definition:</strong>
            {definition ? (
              parse(String(definition))
            ) : (
              <div className={emptyStyle()}>Definition not found</div>
            )}
            {link && (
              <a href={link} target="_blank" rel="noreferrer">
                See more
                <FaExternalLinkAlt className={iconStyle()} />
              </a>
            )}
            {image && <img src={image} className={imageStyle()} alt="" />}
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

export default Simplify;

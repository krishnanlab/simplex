import { useEffect, useCallback, useRef, useMemo } from "react";
import useResizeObserver from "@react-hook/resize-observer";
import { css } from "@emotion/react";
import { light, shadow, accent, offWhite } from "@/palette";
import { splitWords } from "@/util/string";

const wrapperStyle = css({
  position: "relative",
  display: "flex",
  margin: "20px 0",
  boxShadow: shadow,
  resize: "none",
  overflow: "hidden",
  zIndex: "0",
  "&:focus-within": {
    outline: accent,
  },
  "&[data-disabled='true']": {
    background: offWhite,
    boxShadow: "none",
  },
});

const scrollbar = 50;

const underlayStyle = css({
  position: "absolute",
  top: "0",
  right: `-${scrollbar}px`,
  bottom: "0",
  left: "0",
  margin: "0",
  padding: "15px 20px",
  paddingRight: scrollbar + 20 + "px !important",
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",
  overflowX: "hidden",
  overflowY: "auto",
  userSelect: "none",
  zIndex: "-1",
  overscrollBehavior: "none",
  "& > mark": {
    background: "none",
    color: "transparent",
  },
});

const inputStyle = css({
  width: "100%",
  height: "300px",
  minHeight: "100px",
  maxHeight: "90vh",
  margin: "0",
  padding: "15px 20px",
  background: "none",
  fontFamily: "inherit",
  lineHeight: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  border: "none",
  outline: "none",
  resize: "vertical",
  overflowY: "auto",
  zIndex: "1",
  overscrollBehavior: "none",
});

// references
// https://github.com/lonekorean/highlight-within-textarea/blob/master/jquery.highlight-within-textarea.js
// alternatives
// https://github.com/bonafideduck/react-highlight-within-textarea
// https://github.com/facebook/lexical

const label = "Type or paste text";

interface Props {
  value: string;
  onChange: (value: string) => void;
  showHighlights: boolean;
  scores: Record<string, number>;
  disabled?: boolean;
}

const Editor = ({
  value,
  onChange,
  showHighlights,
  scores,
  disabled = false,
}: Props) => {
  const underlay = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  const words = useMemo(() => splitWords(value), [value]);

  const matchScroll = useCallback(() => {
    if (!underlay.current || !input.current) return;
    underlay.current.scrollTop = input.current.scrollTop;
  }, []);

  useEffect(() => {
    matchScroll();
  }, [words, showHighlights, matchScroll]);
  useResizeObserver(input, matchScroll);

  return (
    <div css={wrapperStyle} data-disabled={disabled}>
      {showHighlights && (
        <div ref={underlay} css={underlayStyle}>
          {words.map((word, index, array) => {
            if (scores[word])
              return (
                <mark
                  key={index}
                  style={{
                    background:
                      light +
                      Math.floor((255 * (scores[word] || 0)) / 100)
                        .toString(16)
                        .padStart(2, "0"),
                  }}
                >
                  {word}
                </mark>
              );
            else
              return index === array.length - 1
                ? word.replace(/\n$/, "\n ")
                : word;
          })}
        </div>
      )}
      <textarea
        ref={input}
        css={inputStyle}
        onScroll={matchScroll}
        placeholder={label}
        aria-label={label}
        required={true}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default Editor;

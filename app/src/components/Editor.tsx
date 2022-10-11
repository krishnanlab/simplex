import { useEffect, useCallback, useRef, useMemo } from "react";
import { css } from "@emotion/react";
import { useAtom } from "jotai";
import { light, shadow, accent } from "@/palette";
import { textState, showHighlightsState } from "@/pages/Tool";

const wrapperStyle = css({
  position: "relative",
  display: "flex",
  boxShadow: shadow,
  resize: "none",
  "& > *": {
    margin: "0",
    padding: "15px 20px",
    fontFamily: "inherit",
    lineHeight: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    border: "none",
    outline: "none",
    background: "none",
  },
  "&:focus-within": {
    outline: accent,
  },
});

const underlayStyle = css({
  position: "absolute",
  width: "100%",
  height: "100%",
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",
  overflowY: "auto",
  userSelect: "none",
  zIndex: "-1",
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
  resize: "vertical",
  overflowY: "auto",
  zIndex: "1",
});

// references
// https://github.com/lonekorean/highlight-within-textarea/blob/master/jquery.highlight-within-textarea.js
// alternatives
// https://github.com/bonafideduck/react-highlight-within-textarea
// https://github.com/facebook/lexical

const label = "Type or paste text";

// dummy func
const scoreStore: Record<string, number> = {};
const getWordScore = (word: string) =>
  scoreStore[word] || (scoreStore[word] = Math.random());

const Editor = () => {
  const underlay = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useAtom(textState);
  const [showHighlights] = useAtom(showHighlightsState);

  const content = useMemo(
    () =>
      text
        .split(/(\S+)/)
        .filter((text) => text)
        .map((text, index, array) => ({
          text: index === array.length - 1 ? text.replace(/\n$/, "\n ") : text,
          color: light + Math.floor(getWordScore(text) * 255).toString(16),
        })),
    [text]
  );

  const matchScroll = useCallback(() => {
    if (!underlay.current || !input.current) return;
    underlay.current.scrollTop = input.current.scrollTop;
  }, []);

  useEffect(() => {
    matchScroll();
  }, [matchScroll, text, showHighlights]);

  return (
    <div css={wrapperStyle}>
      {showHighlights && (
        <div ref={underlay} css={underlayStyle}>
          {content.map(({ text, color }, index) => {
            if (text.trim())
              return (
                <mark key={index} style={{ background: color }}>
                  {text}
                </mark>
              );
            else return text;
          })}
        </div>
      )}
      <textarea
        ref={input}
        css={inputStyle}
        onScroll={matchScroll}
        placeholder={label}
        aria-label={label}
        value={text}
        onChange={(event) => setText(event.target.value)}
      ></textarea>
    </div>
  );
};

export default Editor;

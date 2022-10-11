import { useEffect, useCallback, useRef, useMemo } from "react";
import { css } from "@emotion/react";
import { useAtom } from "jotai";
import { light, shadow, accent } from "@/palette";
import {
  textState,
  showHighlightsState,
  highlightsState,
  loadingState,
} from "@/pages/Tool";
import Spinner from "@/components/Spinner";

const textStyle = {
  margin: "0",
  padding: "15px 20px",
  fontFamily: "inherit",
  lineHeight: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  border: "none",
  outline: "none",
  background: "none",
};

const wrapperStyle = css({
  position: "relative",
  display: "flex",
  margin: "20px 0",
  boxShadow: shadow,
  resize: "none",
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
  ...textStyle,
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
  ...textStyle,
});

const spinnerStyle = css({
  position: "absolute",
  top: "20px",
  right: "20px",
});

// references
// https://github.com/lonekorean/highlight-within-textarea/blob/master/jquery.highlight-within-textarea.js
// alternatives
// https://github.com/bonafideduck/react-highlight-within-textarea
// https://github.com/facebook/lexical

const label = "Type or paste text";

const Editor = () => {
  const underlay = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useAtom(textState);
  const [showHighlights] = useAtom(showHighlightsState);

  const [highlights] = useAtom(highlightsState);

  const [loading] = useAtom(loadingState);

  const matchScroll = useCallback(() => {
    if (!underlay.current || !input.current) return;
    underlay.current.scrollTop = input.current.scrollTop;
  }, []);

  useEffect(() => {
    matchScroll();
  }, [highlights, matchScroll, text, showHighlights]);

  return (
    <div css={wrapperStyle}>
      {showHighlights && (
        <div ref={underlay} css={underlayStyle}>
          {highlights.map(({ text, score }, index, array) => {
            if (text.trim())
              return (
                <mark
                  key={index}
                  style={{
                    background:
                      light +
                      Math.floor((255 * score) / 100)
                        .toString(16)
                        .padStart(2, "0"),
                  }}
                >
                  {text}
                </mark>
              );
            else
              return index === array.length - 1
                ? text.replace(/\n$/, "\n ")
                : text;
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
      />
      {loading && <Spinner css={spinnerStyle} />}
    </div>
  );
};

export default Editor;

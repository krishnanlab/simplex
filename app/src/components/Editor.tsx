import {
  ReactElement,
  ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { css } from "@emotion/react";
import useResizeObserver from "@react-hook/resize-observer";
import Tooltip from "@/components/Tooltip";
import {
  accent,
  light,
  offWhite,
  rounded,
  shadow,
  spacing,
} from "@/global/palette";
import { splitWords } from "@/util/string";

const wrapperStyle = css({
  position: "relative",
  display: "flex",
  margin: "20px 0",
  borderRadius: rounded,
  resize: "none",
  overflow: "hidden",
  zIndex: "0",
  "&:focus-within": {
    outline: accent,
  },
  "&[data-editable='true']": {
    boxShadow: shadow,
  },
  "&[data-editable='false']": {
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
  lineHeight: spacing + 0.2,
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
  lineHeight: spacing + 0.2,
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
  highlights: boolean;
  scores: Record<string, number>;
  editable?: boolean;
  tooltip?: (word: string) => ReactElement;
}

const colors = new Map<number, string>();
const getColor = (score: number) =>
  colors.get(score) ||
  colors
    .set(
      score,
      light +
        Math.floor((255 * (score || 0)) / 100)
          .toString(16)
          .padStart(2, "0")
    )
    .get(score);

const Editor = ({
  value,
  onChange,
  highlights,
  scores,
  editable = false,
  tooltip,
}: Props) => {
  const underlay = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  const [selected, setSelected] = useState(-1);

  const words = useMemo(() => splitWords(value), [value]);

  const matchScroll = useCallback(() => {
    if (!underlay.current || !input.current) return;
    underlay.current.scrollTop = input.current.scrollTop;
  }, []);

  useEffect(() => {
    matchScroll();
  }, [words, highlights, matchScroll]);
  useResizeObserver(input, matchScroll);

  const onClick: ReactEventHandler<HTMLTextAreaElement> = (event) => {
    const target = event.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    let total = 0;
    setSelected(-1);
    for (const [index, word] of Object.entries(words)) {
      if (start >= total && start < total + word.length) {
        setSelected(Number(index));
        break;
      }
      total += word.length;
    }
  };

  return (
    <div css={wrapperStyle} data-editable={editable}>
      {highlights && (
        <div ref={underlay} css={underlayStyle}>
          {words.map((word, index, array) => {
            if (scores[word] !== undefined) {
              const background = getColor(scores[word]);
              if (index === selected && tooltip)
                return (
                  <Tooltip
                    key={index}
                    reference={<mark style={{ background }}>{word}</mark>}
                    content={tooltip(word)}
                    open={true}
                    onClose={() => setSelected(-1)}
                  />
                );
              else
                return (
                  <mark key={index} style={{ background }}>
                    {word}
                  </mark>
                );
            } else if (index === array.length - 1)
              return word.replace(/\n$/, "\n ");
            else return word;
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
        disabled={!editable}
        value={value}
        onClick={onClick}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default Editor;

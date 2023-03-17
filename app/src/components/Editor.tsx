import {
  Fragment,
  ReactElement,
  ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useResizeObserver from "@react-hook/resize-observer";
import { css } from "@stitches/react";
import Tooltip from "@/components/Tooltip";
import {
  accent,
  light,
  offWhite,
  rounded,
  shadow,
  spacing,
} from "@/global/palette";
import { tokenize } from "@/util/string";

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** whether to show highlights */
  highlights: boolean;
  /** map of word to scores */
  scores: Record<string, number>;
  /** whether editable */
  editable?: boolean;
  /** tooltip element to show on word click */
  tooltip?: (word: string) => ReactElement;
};

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

const markStyle = css({
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

/** cache of computed hex colors based on score */
const colors = new Map<number, string>();

/** get hex color of score */
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

/** multi-line text area with word highlighting */
const Editor = ({
  value,
  onChange,
  highlights,
  scores,
  editable = false,
  tooltip,
}: Props) => {
  /** mark layer element */
  const mark = useRef<HTMLDivElement>(null);
  /** textarea layer element */
  const input = useRef<HTMLTextAreaElement>(null);

  /** split words */
  const words = useMemo(() => tokenize(value), [value]);

  /** index of selected word in split words */
  const [selected, setSelected] = useState(-1);

  /** sync scrolls of layers */
  const matchScroll = useCallback(() => {
    if (!mark.current || !input.current) return;
    mark.current.scrollTop = input.current.scrollTop;
  }, []);
  useEffect(() => {
    matchScroll();
  }, [words, highlights, matchScroll]);
  useResizeObserver(input, matchScroll);

  /** when text area text selected */
  const onSelect: ReactEventHandler<HTMLTextAreaElement> = (event) => {
    /** selection range */
    const start = (event.target as HTMLTextAreaElement).selectionStart;
    const end = (event.target as HTMLTextAreaElement).selectionEnd;
    if (end - start <= 0) return;
    /** determine corresponding word number */
    let total = 0;
    for (const [index, word] of Object.entries(words)) {
      if (start >= total && end <= total + word.length) {
        setSelected(Number(index));
        break;
      }
      total += word.length;
    }
  };

  return (
    <div className={wrapperStyle()} data-editable={editable}>
      {highlights && (
        <div ref={mark} className={markStyle()}>
          {words.map((word, index, array) => {
            let element = <></>;

            /** if word is highlight-able, show mark */
            if (scores[word.toLowerCase()] !== undefined) {
              const background = getColor(scores[word.toLowerCase()]);
              element = <mark style={{ background }}>{word}</mark>;
            } else if (index === array.length - 1) {
              /** correct end of input peculiarity */
              element = <span>{word.replace(/\n$/, "\n ")}</span>;
            } else {
              /** pass through as string */
              element = <span>{word}</span>;
            }

            /** if selected, wrap in tooltip */
            if (index === selected && tooltip)
              return (
                <Tooltip
                  key={index}
                  reference={element}
                  content={tooltip(word)}
                  open={true}
                  onClose={() => setSelected(-1)}
                />
              );
            else return <Fragment key={index}>{element}</Fragment>;
          })}
        </div>
      )}

      <textarea
        ref={input}
        className={inputStyle()}
        onScroll={matchScroll}
        placeholder={label}
        aria-label={label}
        required={true}
        disabled={!editable}
        value={value}
        onSelect={onSelect}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default Editor;

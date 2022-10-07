import { useState, FormEvent, Fragment, ClipboardEvent } from "react";
import { css } from "@emotion/react";
import { light, dark, shadow, accent } from "@/palette";
import { getInnerText } from "@/util/dom";

const wrapperStyle = css({
  position: "relative",
  height: "300px",
  minHeight: "100px",
  maxHeight: "90vh",
  resize: "vertical",
  overflowY: "auto",
  boxShadow: shadow,
  "& > *": {
    position: "absolute",
    width: "100%",
    minHeight: "100%",
    padding: "15px 20px",
    outline: "none",
    whiteSpace: "pre",
  },
  "&:focus-within": {
    outline: accent,
  },
});

const placeholderStyle = css({
  "&::before": {
    content: "attr(placeholder)",
    opacity: 0.5,
    color: dark,
    pointerEvents: "none",
  },
});

const underlayStyle = css({
  color: "transparent",
  pointerEvents: "none",
});

const label = "Type or paste text";

const Editor = () => {
  const [text, setText] = useState("");

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    // document.execCommand("insertHTML", false, text);
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    setText(text);
  };

  const onInput = (event: FormEvent<HTMLDivElement>) => {
    setText(getInnerText(event.target as HTMLElement));
  };

  const content = text
    .split(/(\s)/)
    .map((word) => ({ text: word, score: Math.random() }));

  return (
    <div css={wrapperStyle}>
      <div css={underlayStyle}>
        {content.map((word, index) => {
          if (word.text === "\n") return <br key={index} />;
          if (word.text.match(/^\s$/))
            return <Fragment key={index}>&nbsp;</Fragment>;
          if (word.text === "") return null;
          const color = light + Math.floor(word.score * 255).toString(16);
          return (
            <span key={index} style={{ background: color }}>
              {word.text}
            </span>
          );
        })}
      </div>
      <div
        css={content.length === 0 ? placeholderStyle : null}
        contentEditable
        placeholder={label}
        onPaste={onPaste}
        onInput={onInput}
        suppressContentEditableWarning={true}
        role="textbox"
        aria-placeholder={label}
        aria-label={label}
        aria-multiline="true"
      />
    </div>
  );
};

export default Editor;

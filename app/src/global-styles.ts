import { css } from "@emotion/react";
import { light, black, fast, serif, deep, spacing, gray } from "@/palette";

const globalStyles = css({
  "*": {
    boxSizing: "border-box",
  },
  body: {
    margin: "0",
    fontFamily: serif,
    fontSize: "16px",
    fontWeight: "300",
    lineHeight: spacing,
  },
  "#root": {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    flexGrow: "1",
  },
  h1: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "400",
    letterSpacing: "5px",
    textTransform: "uppercase",
  },
  h2: {
    margin: "60px 0 40px 0",
    color: deep,
    fontSize: "24px",
    fontWeight: "400",
    letterSpacing: "5px",
    textTransform: "uppercase",
    textAlign: "center",
  },
  h3: {
    margin: "40px 0 20px 0",
    color: deep,
    fontSize: "20px",
    fontWeight: "400",
    textAlign: "left",
  },
  h4: {
    margin: "40px 0 20px 0",
    fontSize: "18px",
    fontWeight: "400",
    textAlign: "left",
  },
  a: {
    position: "relative",
    display: "inline-block",
    color: "currentColor",
    transition: "color " + fast,
    zIndex: "0",
  },
  "a:hover": {
    color: black,
  },
  "a::before": {
    content: "''",
    position: "absolute",
    left: "-2px",
    right: "calc(100% + 4px)",
    height: "1.5em",
    top: "50%",
    transform: "translateY(-50%)",
    background: light,
    transition: "right " + fast,
    zIndex: "-1",
  },
  "a:hover::before": {
    right: "-2px",
  },
  p: {
    margin: "20px 0",
    textAlign: "justify",
  },
  ul: {
    margin: "20px 0",
  },
  hr: {
    height: "1px",
    margin: "60px 0",
    border: "none",
    background: gray,
  },
  strong: {
    fontWeight: "400",
  },
  form: {
    display: "contents",
  },
});

export default globalStyles;

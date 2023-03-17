import { globalCss } from "@stitches/react";
import {
  big,
  black,
  deep,
  fast,
  gray,
  light,
  offWhite,
  plus,
  serif,
  spacing,
  title,
} from "@/global/palette";

const globalStyles = globalCss({
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
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
  h1: {
    margin: "0",
    ...title,
  },
  h2: {
    margin: "60px 0 40px 0",
    color: deep,
    textAlign: "center",
    ...title,
  },
  h3: {
    margin: "40px 0 20px 0",
    color: deep,
    ...big,
    textAlign: "left",
  },
  h4: {
    margin: "40px 0 20px 0",
    ...plus,
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
    height: "80%",
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
    lineHeight: spacing + 0.4,
    textAlign: "justify",
  },
  ul: {
    margin: "20px 0",
    lineHeight: spacing + 0.4,
  },
  hr: {
    height: "1px",
    margin: "60px 0",
    border: "none",
    background: gray,
  },
  b: {
    fontWeight: "400",
  },
  strong: {
    fontWeight: "400",
  },
  "[disabled]": {
    background: offWhite,
    color: "inherit",
    boxShadow: "none !important",
  },
  ".react-icons": {
    verticalAlign: "middle",
  },
  ".center": {
    textAlign: "center",
  },
});

export default globalStyles;

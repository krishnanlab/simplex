import { createGlobalStyle } from "styled-components";
import { light, black, fast, serif } from "@/palette";

const GlobalStyles = createGlobalStyle({
  "*": {
    boxSizing: "border-box",
  },
  body: {
    margin: "0",
    fontFamily: serif,
    fontSize: "16px",
    fontWeight: 300,
  },
  "#root": {
    display: "flex",
    "flex-direction": "column",
    "min-height": "100vh",
  },
  main: {
    flexGrow: "1",
  },
  a: {
    position: "relative",
    display: "inline-block",
    color: black,
    transition: "color " + fast,
    zIndex: "0",
  },
  "a::before": {
    content: "''",
    display: "block",
    position: "absolute",
    left: "-2px",
    top: "-1px",
    right: "calc(100% + 4px)",
    bottom: "-1px",
    background: light,
    transition: "right " + fast,
    zIndex: "-1",
  },
  "a:hover::before": {
    right: "-2px",
  },
});

export default GlobalStyles;

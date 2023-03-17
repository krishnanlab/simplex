import { CSSProperties } from "@stitches/react";

/** colors */
const deep = "#0081A7";
const muted = "#79d2ed";
const pale = "#F8F1ED";
const light = "#FFB4A2";
const accent = "#F08080";
const dark = "#6D6875";
const black = "#000000";
const gray = "#E0E0E0";
const offWhite = "#F8F8F8";
const white = "#FFFFFF";

/** effects styles */
const rounded = "3px";
const shadow = "0 4px 2px 0 #00000010, 0 0 5px 2px #00000020";
const fast = "0.1s ease";

/** text styles */
const serif = "'Roboto Slab', serif";
const spacing = 1.7;
const small: CSSProperties = { fontSize: "0.9rem", lineHeight: spacing };
const plus: CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: "400",
  lineHeight: spacing,
};
const big: CSSProperties = {
  fontSize: "1.3rem",
  fontWeight: "300",
  lineHeight: spacing,
};
const title: CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: "300",
  letterSpacing: "0.3em",
  textTransform: "uppercase",
};

export {
  deep,
  muted,
  pale,
  light,
  accent,
  dark,
  black,
  gray,
  offWhite,
  white,
  rounded,
  shadow,
  fast,
  serif,
  spacing,
  small,
  plus,
  big,
  title,
};

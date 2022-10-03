import { CSSObject } from "styled-components";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as fas from "@fortawesome/free-solid-svg-icons";
import * as far from "@fortawesome/free-regular-svg-icons";

// colors
const deep = "#0081A7";
const pale = "#F8F1ED";
const light = "#FFB4A2";
const accent = "#F08080";
const dark = "#6D6875";
const black = "#000000";
const gray = "#E0E0E0";
const white = "#FFFFFF";

// effects
const round = "3px";
const shadow = "0 4px 0px 0 #0000020, 0 0 5px 2px #00000040";
const fast = "0.1s ease";

// text
const serif = "'Roboto Slab', serif";
const spacing = "1.5";
const bold = {
  fontWeight: "400",
};
const big: CSSObject = {
  fontSize: "20px",
  fontWeight: "400",
};
const xl: CSSObject = {
  fontSize: "24px",
  fontWeight: "400",
  letterSpacing: "5px",
  textTransform: "uppercase",
};

export {
  deep,
  pale,
  light,
  accent,
  dark,
  black,
  gray,
  white,
  round,
  shadow,
  fast,
  serif,
  spacing,
  bold,
  big,
  xl,
};

// font awesome icons
library.add(fas.faTimes, fas.faBars, fas.faRightToBracket);

import { CSSObject } from "@emotion/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as fab from "@fortawesome/free-brands-svg-icons";
import * as far from "@fortawesome/free-regular-svg-icons";
import * as fas from "@fortawesome/free-solid-svg-icons";

// colors
const deep = "#0081A7";
const pale = "#F8F1ED";
const light = "#FFB4A2";
const accent = "#F08080";
const dark = "#6D6875";
const black = "#000000";
const gray = "#E0E0E0";
const offWhite = "#F8F8F8";
const white = "#FFFFFF";

// effects
const rounded = "3px";
const shadow = "0 4px 2px 0 #00000010, 0 0 5px 2px #00000020";
const fast = "0.1s ease";

// text
const serif = "'Roboto Slab', serif";
const spacing = 1.7;
const small: CSSObject = { fontSize: "0.9rem", lineHeight: spacing };
const plus: CSSObject = {
  fontSize: "1.1rem",
  fontWeight: "400",
  lineHeight: spacing,
};
const big: CSSObject = {
  fontSize: "1.3rem",
  fontWeight: "300",
  lineHeight: spacing,
};
const title: CSSObject = {
  fontSize: "1.4rem",
  fontWeight: "300",
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

// font awesome icons
library.add(
  fab.faGithub,
  far.faCopy,
  far.faEnvelope,
  far.faFloppyDisk,
  far.faLightbulb,
  far.faPenToSquare,
  far.faQuestionCircle,
  far.faTrashAlt,
  far.faTrashCan,
  fas.faArrowUpRightFromSquare,
  fas.faBars,
  fas.faCircleCheck,
  fas.faCircleExclamation,
  fas.faEye,
  fas.faLock,
  fas.faPlus,
  fas.faRightToBracket,
  fas.faShareNodes,
  fas.faTimes,
  fas.faUserPlus
);

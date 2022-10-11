import { library } from "@fortawesome/fontawesome-svg-core";
import * as fas from "@fortawesome/free-solid-svg-icons";
import * as far from "@fortawesome/free-regular-svg-icons";
import * as fab from "@fortawesome/free-brands-svg-icons";

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
const rounded = "3px";
const shadow = "0 4px 2px 0 #00000010, 0 0 5px 2px #00000020";
const fast = "0.1s ease";

// text
const serif = "'Roboto Slab', serif";
const spacing = 2;

export {
  deep,
  pale,
  light,
  accent,
  dark,
  black,
  gray,
  white,
  rounded,
  shadow,
  fast,
  serif,
  spacing,
};

// font awesome icons
library.add(
  fab.faGithub,
  far.faEnvelope,
  far.faFloppyDisk,
  fas.faBars,
  fas.faLock,
  far.faLightbulb,
  fas.faRightToBracket,
  fas.faTimes,
  fas.faUserPlus
);

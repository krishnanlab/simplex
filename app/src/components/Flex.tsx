import { ReactNode } from "react";
import { css } from "@stitches/react";

type Props = {
  display?: "inline" | "block";
  dir?: "row" | "col";
  gap?: "none" | "tiny" | "small" | "medium" | "big";
  hAlign?: "left" | "center" | "right" | "stretch" | "space";
  vAlign?: "top" | "center" | "bottom" | "stretch" | "space";
  wrap?: boolean;
  children: ReactNode;
  [key: string]: unknown;
};

const flexStyle = css({
  "& > *": {
    margin: "0 !important",
  },
  "section > &": {
    margin: "30px 0",
  },
});

/** map intuitive align name to actual css prop */
const aligns = {
  left: "flex-start",
  top: "flex-start",
  center: "center",
  right: "flex-end",
  bottom: "flex-end",
  stretch: "stretch",
  space: "space-between",
};

/** gap palette */
const gaps = {
  none: "0",
  tiny: "5px",
  small: "15px",
  medium: "30px",
  big: "60px",
};

/** util flex wrapper */
const Flex = ({
  display = "block",
  dir = "row",
  gap = "medium",
  hAlign = "center",
  vAlign = "center",
  wrap = true,
  children,
  ...props
}: Props) => (
  <div
    className={flexStyle()}
    style={{
      /** computed style */
      display: display === "inline" ? "inline-flex" : "flex",
      width: display === "block" ? "100%" : "",
      flexDirection: dir === "col" ? "column" : "row",
      justifyContent: dir === "col" ? aligns[vAlign] : aligns[hAlign],
      alignItems: dir === "col" ? aligns[hAlign] : aligns[vAlign],
      gap: gaps[gap],
      flexWrap: wrap ? "wrap" : "nowrap",
    }}
    {...props}
  >
    {children}
  </div>
);

export default Flex;

export const Spacer = () => <div style={{ flexGrow: 1 }}></div>;

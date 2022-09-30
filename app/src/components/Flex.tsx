import { ElementType } from "react";
import styled, { CSSObject } from "styled-components";

interface Props {
  display?: "inline" | "block";
  dir?: "row" | "col";
  gap?: "none" | "tiny" | "small" | "medium" | "big";
  hAlign?: "left" | "center" | "right" | "stretch" | "space";
  vAlign?: "top" | "center" | "bottom" | "stretch" | "space";
  wrap?: "true" | "false";
  component?: ElementType;
  [key: string]: unknown;
}

const aligns = {
  left: "flex-start",
  top: "flex-start",
  center: "center",
  right: "flex-end",
  bottom: "flex-end",
  stretch: "stretch",
  space: "space-between",
};

const gaps = {
  none: 0,
  tiny: 5,
  small: 10,
  medium: 30,
  big: 60,
};

const Div = styled.div(
  (props: Required<Props>): CSSObject => ({
    display: props.display === "inline" ? "inline-flex" : "flex",
    justifyContent:
      props.dir === "col" ? aligns[props.vAlign] : aligns[props.hAlign],
    alignItems:
      props.dir === "col" ? aligns[props.hAlign] : aligns[props.vAlign],
    gap: gaps[props.gap],
    flexWrap: props.wrap ? "wrap" : "nowrap",
  })
);

const Flex = ({
  display = "block",
  dir = "row",
  gap = "medium",
  hAlign = "center",
  vAlign = "center",
  wrap = "true",
  component = "div",
  ...props
}: Props) => (
  <Div
    as={component}
    {...{ display, dir, gap, hAlign, vAlign, wrap, component, ...props }}
  />
);

export default Flex;

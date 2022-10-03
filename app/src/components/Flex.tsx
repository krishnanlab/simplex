import { ElementType } from "react";
import styled, { CSSObject } from "styled-components";

interface Props {
  display?: "inline" | "block";
  dir?: "row" | "col";
  gap?: "none" | "tiny" | "small" | "medium" | "big";
  hAlign?: "left" | "center" | "right" | "stretch" | "space";
  vAlign?: "top" | "center" | "bottom" | "stretch" | "space";
  wrap?: "true" | "false";
  breakpoint?: string;
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

interface StyleProps {
  $display: NonNullable<Props["display"]>;
  $dir: NonNullable<Props["dir"]>;
  $gap: NonNullable<Props["gap"]>;
  $hAlign: NonNullable<Props["hAlign"]>;
  $vAlign: NonNullable<Props["vAlign"]>;
  $wrap: NonNullable<Props["wrap"]>;
  $breakpoint: NonNullable<Props["breakpoint"]>;
}

const StyledDiv = styled.div(
  (props: StyleProps): CSSObject => ({
    display: props.$display === "inline" ? "inline-flex" : "flex",
    width: props.$display === "block" ? "100%" : "",
    flexDirection: props.$dir === "col" ? "column" : "row",
    justifyContent:
      props.$dir === "col" ? aligns[props.$vAlign] : aligns[props.$hAlign],
    alignItems:
      props.$dir === "col" ? aligns[props.$hAlign] : aligns[props.$vAlign],
    gap: gaps[props.$gap],
    flexWrap: props.$wrap === "true" ? "wrap" : "nowrap",
    [`@media (max-width: ${props.$breakpoint})`]: {
      flexDirection: "column",
      alignItems: "stretch",
    },
  })
);

const Flex = ({
  display = "block",
  dir = "row",
  gap = "medium",
  hAlign = "center",
  vAlign = "center",
  wrap = "true",
  breakpoint = "0px",
  component = "div",
  ...props
}: Props) => (
  <StyledDiv
    as={component}
    $display={display}
    $dir={dir}
    $gap={gap}
    $hAlign={hAlign}
    $vAlign={vAlign}
    $wrap={wrap}
    $breakpoint={breakpoint}
    {...props}
  />
);

export default Flex;

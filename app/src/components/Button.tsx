import { ButtonHTMLAttributes, forwardRef, Ref } from "react";
import { Link, LinkProps, To } from "react-router-dom";
import { css } from "@emotion/react";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import Icon from "@/components/Icon";
import {
  accent,
  black,
  deep,
  fast,
  pale,
  rounded,
  white,
} from "@/global/palette";

type Props = {
  /** location when link */
  to?: To;
  /** text to show */
  text?: string;
  /** font awesome icon name */
  icon?: IconName;
  /** fill design */
  fill?: boolean;
} & Partial<ButtonHTMLAttributes<HTMLButtonElement>> &
  Partial<LinkProps>;

const buttonStyle = css({
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "7.5px 15px",
  maxWidth: "100%",
  minHeight: "40px",
  gap: "10px",
  background: "none",
  border: "none",
  borderRadius: rounded,
  color: deep,
  fontSize: "inherit",
  fontFamily: "inherit",
  textDecoration: "none",
  appearance: "none",
  cursor: "pointer",
  transition: `background ${fast}, color ${fast}`,
  "&:hover": {
    color: black,
  },
  "&:before": {
    display: "none",
  },
});

const fillStyle = css({
  background: accent,
  color: white,
  "&:hover": {
    background: deep,
    color: white,
  },
});

const squareStyle = css({
  padding: "0",
  width: "30px",
  height: "30px",
  minHeight: "unset",
  "&:hover": {
    background: pale,
    color: black,
  },
});

/** button that links somewhere or does something */
const Button = forwardRef(
  ({ to, text, icon, fill = true, ...props }: Props, ref) => {
    /** inner text and icon  */
    const content = (
      <>
        {text && <span>{text}</span>}
        {icon && <Icon icon={icon} />}
      </>
    );

    const css = [
      buttonStyle,
      fill ? fillStyle : null,
      icon && !text ? squareStyle : null,
    ];

    if (to)
      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          to={to || ""}
          css={css}
          {...props}
        >
          {content}
        </Link>
      );
    else
      return (
        <button ref={ref as Ref<HTMLButtonElement>} css={css} {...props}>
          {content}
        </button>
      );
  }
);
Button.displayName = "Button";

export default Button;

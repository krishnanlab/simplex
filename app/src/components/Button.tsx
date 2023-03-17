import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref } from "react";
import { Link, LinkProps, To } from "react-router-dom";
import { css } from "@stitches/react";
import Tooltip from "@/components/Tooltip";
import {
  accent,
  black,
  deep,
  fast,
  pale,
  rounded,
  white,
} from "@/global/palette";
import { classNames } from "@/util/string";

type Props = {
  /** location when link */
  to?: To;
  /** text to show */
  text?: string;
  /** icon component */
  icon?: ReactNode;
  /** fill design */
  fill?: boolean;
  /** tooltip content */
  tooltip?: ReactNode;
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
  ({ to, text, icon, fill = true, tooltip, ...props }: Props, ref) => {
    /** inner text and icon  */
    const content = (
      <>
        {text && <span>{text}</span>}
        {icon}
      </>
    );

    const className = classNames([
      buttonStyle(),
      fill ? fillStyle() : "",
      icon && !text ? squareStyle() : "",
    ]);

    let element = <></>;

    /** determine element and attributes */
    if (to) {
      if (String(to).startsWith("http"))
        element = (
          <a
            ref={ref as Ref<HTMLAnchorElement>}
            href={String(to)}
            className={className}
            {...props}
          >
            {content}
          </a>
        );
      else
        element = (
          <Link
            ref={ref as Ref<HTMLAnchorElement>}
            to={to}
            className={className}
            {...props}
          >
            {content}
          </Link>
        );
    } else
      element = (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          className={className}
          {...props}
        >
          {content}
        </button>
      );

    /** wrap in tooltip */
    if (tooltip) return <Tooltip reference={element} content={tooltip} />;
    else return element;
  }
);
Button.displayName = "Button";

export default Button;

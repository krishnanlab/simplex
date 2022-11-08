import { ButtonHTMLAttributes } from "react";
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

interface Props {
  to?: To;
  text?: string;
  icon?: IconName;
  fill?: boolean;
}

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

const Button = ({
  to,
  text,
  icon,
  fill = true,
  ...props
}: Props &
  Partial<ButtonHTMLAttributes<HTMLButtonElement>> &
  Partial<LinkProps>) => {
  const Component = to ? Link : "button";

  return (
    <Component
      to={to || ""}
      css={[
        buttonStyle,
        fill ? fillStyle : null,
        icon && !text ? squareStyle : null,
      ]}
      {...props}
    >
      {text && <span>{text}</span>}
      {icon && <Icon icon={icon} />}
    </Component>
  );
};

export default Button;

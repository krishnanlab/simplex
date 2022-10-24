import { ButtonHTMLAttributes } from "react";
import { css } from "@emotion/react";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { accent, black, deep, fast, rounded, white } from "@/palette";
import Icon from "@/components/Icon";

interface Props {
  text?: string;
  icon?: IconName;
  fill?: boolean;
}

const style = css({
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
  color: accent,
  fontSize: "inherit",
  fontFamily: "inherit",
  appearance: "none",
  cursor: "pointer",
  transition: `background ${fast}, color ${fast}`,
  "&:hover": {
    color: black,
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

const Button = ({
  text,
  icon,
  fill = true,
  ...props
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button css={[style, fill ? fillStyle : null]} {...props}>
      {text && <span>{text}</span>}
      {icon && <Icon icon={icon} />}
    </button>
  );
};

export default Button;

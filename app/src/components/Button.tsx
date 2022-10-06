import { ButtonHTMLAttributes } from "react";
import { css } from "@emotion/react";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { accent, deep, fast, rounded, white } from "@/palette";
import Icon from "@/components/Icon";

interface Props {
  text?: string;
  icon?: IconName;
}

const style = css({
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "7.5px 15px",
  minWidth: "min(200px, 100%)",
  minHeight: "40px",
  gap: "10px",
  border: "none",
  borderRadius: rounded,
  background: accent,
  color: white,
  fontSize: "inherit",
  fontFamily: "inherit",
  appearance: "none",
  cursor: "pointer",
  transition: "background " + fast,
  "&:hover": {
    background: deep,
  },
});

const Button = ({
  text,
  icon,
  ...props
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button css={style} {...props}>
      {text && <span>{text}</span>}
      {icon && <Icon icon={icon} />}
    </button>
  );
};

export default Button;

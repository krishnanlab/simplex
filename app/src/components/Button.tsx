import { css } from "@emotion/react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { accent, deep, fast, round, serif, white } from "@/palette";
import Icon from "@/components/Icon";

interface Props {
  text?: string;
  icon?: IconProp;
  [key: string]: any;
}

const style = css({
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "7.5px 15px",
  minWidth: "40px",
  minHeight: "40px",
  fontSize: "1rem",
  gap: "10px",
  border: "none",
  borderRadius: round,
  background: accent,
  color: white,
  fontFamily: serif,
  appearance: "none",
  cursor: "pointer",
  transition: "background " + fast,
  "&:hover": {
    background: deep,
  },
});

const Button = ({ text, icon, ...props }: Props) => {
  return (
    <button css={style} {...props}>
      {text && <span>{text}</span>}
      {icon && <Icon icon={icon} />}
    </button>
  );
};

export default Button;

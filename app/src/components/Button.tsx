import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { accent, deep, fast, round, serif, white } from "@/palette";

interface Props {
  text?: string;
  icon?: string;
  [key: string]: any;
}

const StyledButton = styled.button({
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

const Button = ({ text = "", icon = "", ...props }: Props) => {
  return (
    <StyledButton {...props}>
      {text && <span>{text}</span>}
      {icon && <FontAwesomeIcon icon={icon} />}
    </StyledButton>
  );
};

export default Button;

import styled from "styled-components";
import { accent, deep, fast, round, serif, white } from "@/palette";

interface Props {
  text?: string;
  [key: string]: any;
}

const StyledButton = styled.button({
  padding: "7.5px 15px",
  minWidth: "100px",
  minHeight: "40px",
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

const Button = ({ text = "", ...props }: Props) => {
  return <StyledButton {...props}>{text && <span>{text}</span>}</StyledButton>;
};

export default Button;

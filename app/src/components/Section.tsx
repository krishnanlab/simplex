import { ReactNode } from "react";
import styled, { CSSObject } from "styled-components";

interface Props {
  children: ReactNode;
}

const pageWidth = "1000px";

const StyledSection = styled.section(
  (): CSSObject => ({
    padding: `60px max(60px, calc((100% - ${pageWidth})/2));`,
    "& > *:first-child": {
      marginTop: "0",
    },
    "& > *:last-child": {
      marginBottom: "0",
    },
  })
);

const Section = ({ children }: Props) => (
  <StyledSection>{children}</StyledSection>
);

export default Section;

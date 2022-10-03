import { ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
  children: ReactNode;
}

const pageWidth = "1000px";

const sectionStyle = css({
  padding: `60px max(60px, calc((100% - ${pageWidth})/2));`,
});

const Section = ({ children }: Props) => (
  <section css={sectionStyle}>{children}</section>
);

export default Section;

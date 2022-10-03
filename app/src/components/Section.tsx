import { ReactNode } from "react";
import { css } from "@emotion/react";
import { deep, dark, pale } from "@/palette";

interface Props {
  fill?: "none" | "deep" | "dark";
  children: ReactNode;
}

const pageWidth = "1000px";

const sectionStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "60px",
  padding: `60px max(60px, calc((100% - ${pageWidth})/2));`,
});

const fills = {
  none: "",
  deep: deep,
  dark: dark,
};

const Section = ({ fill = "none", children }: Props) => (
  <section
    css={[
      sectionStyle,
      {
        background: fills[fill],
        color: fills[fill] ? pale : "",
      },
    ]}
  >
    {children}
  </section>
);

export default Section;

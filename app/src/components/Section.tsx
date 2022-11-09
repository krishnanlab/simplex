import { ReactNode } from "react";
import { css } from "@emotion/react";
import { dark, deep, pale } from "@/global/palette";

interface Props {
  /** background */
  fill?: "none" | "deep" | "dark";
  className?: string;
  children: ReactNode;
}

const pageWidth = "1000px";

const sectionStyle = css({
  padding: `60px max(60px, calc((100% - ${pageWidth})/2));`,
  "& > *:first-child": {
    marginTop: "0",
  },
  "& > *:last-child": {
    marginBottom: "0",
  },
});

const fills = {
  none: "",
  deep: deep,
  dark: dark,
};

/** util section wrapper */
const Section = ({ fill = "none", children, className }: Props) => (
  <section
    css={[
      sectionStyle,
      {
        background: fills[fill],
        color: fills[fill] ? pale : "",
      },
    ]}
    className={className}
  >
    {children}
  </section>
);

export default Section;

import { HTMLAttributes } from "react";
import { css } from "@stitches/react";
import { dark, deep, offWhite, pale } from "@/global/palette";
import { classNames } from "@/util/string";

const fills = {
  none: { bg: "", color: "" },
  offWhite: { bg: offWhite, color: "" },
  deep: { bg: deep, color: pale },
  dark: { bg: dark, color: pale },
};

type Props = {
  /** background */
  fill?: keyof typeof fills;
  className?: string;
} & Partial<HTMLAttributes<HTMLElement>>;

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

/** util section wrapper */
const Section = ({ fill = "none", className, ...props }: Props) => (
  <section
    className={classNames([sectionStyle(), className])}
    style={{
      background: fills[fill].bg,
      color: fills[fill].color,
    }}
    {...props}
  />
);

export default Section;

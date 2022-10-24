import { css } from "@emotion/react";
import Citation from "@/components/Citation";
import Section from "@/components/Section";
import Tool from "@/components/Tool";
import { big } from "@/palette";

const heroStyle = css({
  ...big,
  textAlign: "center",
});

const Home = () => (
  <>
    <Section fill="deep">
      <p css={heroStyle}>
        Scientific and medical writing is often hard for non-experts to
        understand because it&apos;s full of jargon. Simplex helps you identify
        complexity in your writing and simplify it.
      </p>
    </Section>

    <Section>
      <Tool />
    </Section>

    <Section fill="dark">
      <Citation />
    </Section>
  </>
);

export default Home;

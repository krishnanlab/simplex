import { css } from "@emotion/react";
import Citation from "@/components/Citation";
import Section from "@/components/Section";
import Flex from "@/components/Flex";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Editor from "@/components/Editor";

const heroStyle = css({
  fontSize: "1.3rem",
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
      <Flex>
        <Select
          label="Audience"
          options={[
            "general",
            "biology",
            "chemistry",
            "physics",
            "computer science",
            "mathematics",
          ]}
        />
        <Checkbox label="Highlights" />
      </Flex>
      <Editor />
    </Section>

    <Section fill="dark">
      <Citation />
    </Section>
  </>
);

export default Home;

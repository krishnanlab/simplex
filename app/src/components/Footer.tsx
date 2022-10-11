import { css } from "@emotion/react";
import { pale } from "@/palette";
import Icon from "@/components/Icon";
import Flex from "@/components/Flex";

const style = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "30px",
  background: pale,
  textAlign: "center",
});

const Footer = () => (
  <footer css={style}>
    <Flex gap="medium">
      <a href="https://github.com/krishnanlab">
        <Icon icon="envelope" />
      </a>
      <a href="mailto:arjun.krishnan@cuanschutz.edu">
        <Icon icon="github" />
      </a>
    </Flex>
    <div>
      A project of the{" "}
      <a href="https://www.thekrishnanlab.org/">Krishnan Lab</a> &copy; 2022
    </div>
  </footer>
);

export default Footer;

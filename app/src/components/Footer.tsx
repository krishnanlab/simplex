import { css } from "@emotion/react";
import { pale } from "@/palette";
import Icon from "@/components/Icon";
import Flex from "@/components/Flex";

const style = css({
  padding: "30px",
  background: pale,
  textAlign: "center",
});

const Footer = () => (
  <footer css={style}>
    <Flex dir="col" gap="small">
      <Flex gap="small">
        <a href="https://github.com/krishnanlab">
          <Icon icon="envelope" />
        </a>
        <a href="mailto:arjun@msu.edu">
          <Icon icon="github" />
        </a>
      </Flex>
      <div>
        A project of the{" "}
        <a href="https://www.thekrishnanlab.org/">Krishnan Lab</a> &copy; 2022
      </div>
    </Flex>
  </footer>
);

export default Footer;

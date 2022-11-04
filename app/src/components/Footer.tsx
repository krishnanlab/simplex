import { css } from "@emotion/react";
import { pale } from "@/global/palette";
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

const iconStyle = css({
  fontSize: "1.2rem",
});

const Footer = () => (
  <footer css={style}>
    <Flex gap="small">
      <a href="https://github.com/krishnanlab">
        <Icon css={iconStyle} icon="envelope" />
      </a>
      <a href="mailto:arjun.krishnan@cuanschutz.edu">
        <Icon css={iconStyle} icon="github" />
      </a>
    </Flex>
    <div>
      A project of the{" "}
      <a href="https://www.thekrishnanlab.org/">Krishnan Lab</a> &copy; 2022
    </div>
  </footer>
);

export default Footer;

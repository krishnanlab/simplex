import { FaGithub, FaRegEnvelope } from "react-icons/fa";
import { css } from "@stitches/react";
import Flex from "@/components/Flex";
import { pale } from "@/global/palette";

const footerStyle = css({
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

/** section at bottom of every page */
const Footer = () => (
  <footer className={footerStyle()}>
    <Flex gap="small">
      <a href="https://github.com/krishnanlab">
        <FaRegEnvelope className={iconStyle().toString()} />
      </a>
      <a href="mailto:arjun.krishnan@cuanschutz.edu">
        <FaGithub className={iconStyle().toString()} />
      </a>
    </Flex>
    <div>
      A project of the{" "}
      <a href="https://www.thekrishnanlab.org/">Krishnan Lab</a> &copy; 2022
    </div>
  </footer>
);

export default Footer;

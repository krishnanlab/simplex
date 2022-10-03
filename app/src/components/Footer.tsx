import styled from "styled-components";
import { pale } from "@/palette";
import Flex from "@/components/Flex";

const StyledFooter = styled.footer({
  padding: "30px",
  background: pale,
});

const Footer = () => (
  <StyledFooter>
    <Flex dir="col">
      <span>
        A project of the{" "}
        <a href="https://www.thekrishnanlab.org/">Krishnan Lab</a>, &copy; 2022
      </span>
    </Flex>
  </StyledFooter>
);

export default Footer;

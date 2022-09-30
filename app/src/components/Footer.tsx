import styled from "styled-components";
import { pale } from "@/palette";
import Flex from "@/components/Flex";

const Container = styled.footer({
  padding: "30px",
  background: pale,
});

const Footer = () => (
  <Container>
    <Flex dir="col">
      <span>
        A project of the{" "}
        <a href="https://www.thekrishnanlab.org/">Krishnan Lab</a>, &copy; 2022
      </span>
    </Flex>
  </Container>
);

export default Footer;

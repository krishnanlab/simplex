import styled from "styled-components";
import { pale, xl } from "@/palette";
import logo from "@/assets/logo.svg";
import Flex from "@/components/Flex";

const Container = styled.header({
  padding: "30px",
  background: pale,
});

const Logo = styled.object({
  width: "50px",
});

const Title = styled.span({
  ...xl,
});

const Header = () => (
  <Container>
    <Flex hAlign="space">
      <Flex>
        <Logo data={logo} />
        <Title>Simplex</Title>
      </Flex>
      <Flex component="nav">
        <span>About</span>
        <span>My Articles</span>
        <span>Account</span>
        <span>Log Out</span>
      </Flex>
    </Flex>
  </Container>
);

export default Header;

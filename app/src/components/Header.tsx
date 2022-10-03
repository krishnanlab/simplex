import { Link } from "react-router-dom";
import styled from "styled-components";
import { pale, xl } from "@/palette";
import logo from "@/assets/logo.svg";
import Flex from "@/components/Flex";

const Container = styled.header({
  padding: "30px",
  background: pale,
});

const Home = styled(Link)({
  display: "flex",
  alignItems: "center",
  gap: "15px",
  textDecoration: "none",
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
      <Home to="/">
        <Logo data={logo} />
        <Title>Simplex</Title>
      </Home>
      <Flex component="nav">
        <Link to="about">About</Link>
        <Link to="my-articles">My Articles</Link>
        <Link to="account">Account</Link>
        <Link to="logout">Log Out</Link>
      </Flex>
    </Flex>
  </Container>
);

export default Header;

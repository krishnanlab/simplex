import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import styled from "styled-components";
import { accent, gray, pale, white, xl } from "@/palette";
import logo from "@/assets/logo.svg";
import Flex from "@/components/Flex";
import { loggedInState } from "@/state";

const StyledHeader = styled.header({
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

const Header = () => {
  const [loggedIn] = useAtom(loggedInState);

  return (
    <StyledHeader>
      <Flex hAlign="space">
        <Home to="/">
          <Logo data={logo} />
          <Title>Simplex</Title>
        </Home>
        <Flex component="nav">
          <Link to="about">About</Link>
          {loggedIn && (
            <>
              <Link to="my-articles">My Articles</Link>
              <Link to="account">Account</Link>
              <Link to="logout">Log Out</Link>
              <strong>{loggedIn.displayName}</strong>
            </>
          )}
          {!loggedIn && <Link to="login">Log In</Link>}
        </Flex>
      </Flex>
    </StyledHeader>
  );
};

export default Header;

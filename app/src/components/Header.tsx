import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import styled, { CSSObject } from "styled-components";
import { pale, gray, fast, round } from "@/palette";
import logo from "@/assets/logo.svg";
import Flex from "@/components/Flex";
import { loggedInState } from "@/state";

const StyledHeader = styled.header({
  padding: "30px",
  background: pale,
});

const Home = styled(Link)({
  textDecoration: "none",
});

const Logo = styled.object({
  width: "50px",
});

const Button = styled.button(
  (props: { $menuBreakpoint: string }): CSSObject => ({
    width: "40px",
    height: "40px",
    background: "none",
    border: "none",
    borderRadius: round,
    appearance: "none",
    cursor: "pointer",
    transition: "background " + fast,
    "&:hover": {
      background: gray,
    },
    [`@media not screen and (max-width: ${props.$menuBreakpoint})`]: {
      display: "none",
    },
  })
);

const Nav = styled(Flex)(
  (props: { $open: boolean; $menuBreakpoint: string }): CSSObject => ({
    [`@media (max-width: ${props.$menuBreakpoint})`]: {
      display: props.$open ? "" : "none",
    },
  })
);

const Header = () => {
  const [loggedIn] = useAtom(loggedInState);
  const [open, setOpen] = useState(false);

  const menuBreakpoint = loggedIn ? "800px" : "500px";

  return (
    <StyledHeader>
      <Flex hAlign="space" breakpoint={menuBreakpoint}>
        <Flex display="inline" hAlign="space" gap="tiny" wrap="false">
          <Flex display="inline" gap="small" wrap="false">
            <Logo data={logo} />
            <Home to="/">
              <h1>Simplex</h1>
            </Home>
          </Flex>
          <Button
            $menuBreakpoint={menuBreakpoint}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Collapse nav menu" : "Expand nav menu"}
          >
            <FontAwesomeIcon icon={open ? "times" : "bars"} />
          </Button>
        </Flex>
        <Nav
          display="inline"
          component="nav"
          $open={open}
          $menuBreakpoint={menuBreakpoint}
        >
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
        </Nav>
      </Flex>
    </StyledHeader>
  );
};

export default Header;

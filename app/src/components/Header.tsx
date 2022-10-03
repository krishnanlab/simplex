import { useState } from "react";
import { Link } from "react-router-dom";
import { css, CSSObject } from "@emotion/react";
import { useAtom } from "jotai";
import { pale, gray, fast, rounded } from "@/palette";
import { ReactComponent as Logo } from "@/assets/logo.svg";
import { loggedInState } from "@/state";
import Icon from "@/components/Icon";
import { restartAnimations } from "@/util/dom";

const headerStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "30px",
  background: pale,
});

const titleStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "15px",
});

const navStyle = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px 30px",
});

const homeStyle = css({
  textDecoration: "none",
});

const logoStyle = css({
  width: "50px",
});

const buttonStyle = css({
  width: "40px",
  height: "40px",
  background: "none",
  border: "none",
  borderRadius: rounded,
  appearance: "none",
  cursor: "pointer",
  transition: "background " + fast,
  "&:hover": {
    background: gray,
  },
});

const Header = () => {
  const [loggedIn] = useAtom(loggedInState);
  const [open, setOpen] = useState(false);

  const menuBreakpoint = loggedIn ? "800px" : "500px";

  const wrapHeader: CSSObject = {
    [`@media (max-width: ${menuBreakpoint})`]: {
      flexDirection: "column",
    },
  };

  const hideButton = {
    [`@media not screen and (max-width: ${menuBreakpoint})`]: {
      display: "none",
    },
  };
  const hideNav = {
    [`@media (max-width: ${menuBreakpoint})`]: {
      display: open ? "" : "none",
    },
  };

  return (
    <header css={[headerStyle, wrapHeader]}>
      <div css={titleStyle}>
        <Logo
          css={logoStyle}
          onMouseEnter={(event) => restartAnimations(event.target as Element)}
        />
        <Link css={homeStyle} to="/">
          <h1>Simplex</h1>
        </Link>
        <button
          css={[buttonStyle, hideButton]}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Collapse nav menu" : "Expand nav menu"}
        >
          <Icon icon={open ? "times" : "bars"} />
        </button>
      </div>
      <nav css={[navStyle, hideNav]}>
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
      </nav>
    </header>
  );
};

export default Header;

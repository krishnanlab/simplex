import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { css, CSSObject } from "@emotion/react";
import { ReactComponent as Logo } from "@/assets/logo.svg";
import Icon from "@/components/Icon";
import { fast, gray, pale, plus, rounded } from "@/global/palette";
import { State } from "@/global/state";
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
  ...plus,
  fontWeight: "300",
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

/** section at top of every page, with logo and nav bar */
const Header = () => {
  /** use global state */
  const { loggedIn } = useContext(State);
  /** whether nav bar expanded */
  const [open, setOpen] = useState(false);

  /** point where header collapses into menu */
  const menuBreakpoint = loggedIn ? "920px" : "640px";

  /** styles from breakpoint */
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
        {/* title/logo */}
        <Logo
          css={logoStyle}
          onMouseEnter={(event) => restartAnimations(event.target as Element)}
        />
        <Link css={homeStyle} to="/">
          <h1>Simplex</h1>
        </Link>

        {/* expand/collapse button */}
        <div style={{ width: 0 }}>
          <button
            css={[buttonStyle, hideButton]}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Collapse nav menu" : "Expand nav menu"}
          >
            <Icon icon={open ? "times" : "bars"} />
          </button>
        </div>
      </div>

      {/* nav bar */}
      <nav css={[navStyle, hideNav]}>
        <Link to="/">Editor</Link>
        <Link to="about">About</Link>
        {loggedIn && (
          <>
            <Link to="my-articles">My Articles</Link>
            <Link to="account">Account</Link>
            <Link to="logout">Log Out</Link>
            <strong>{loggedIn.name}</strong>
          </>
        )}
        {!loggedIn && (
          <>
            <Link to="login">Log In</Link>
            <Link to="signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

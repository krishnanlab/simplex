import { useContext, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { css } from "@stitches/react";
import { ReactComponent as Logo } from "@/assets/logo.svg";
import { fast, gray, pale, plus, rounded } from "@/global/palette";
import { State } from "@/global/state";
import { restartAnimations } from "@/util/dom";
import { classNames } from "@/util/string";

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
  fontSize: "min(10vw, 1.4rem)",
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
  h1: {
    fontSize: "inherit",
  },
});

const logoStyle = css({
  width: "2.5em",
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
  const location = useLocation();
  const { currentUser } = useContext(State);

  /** whether nav bar expanded */
  const [open, setOpen] = useState(false);

  /** is homepage of site */
  const homepage = location.pathname === "/";

  /** point where header collapses into menu */
  const menuBreakpoint = currentUser ? "920px" : "640px";

  /** styles from breakpoint */
  const wrapHeader = css({
    [`@media (max-width: ${menuBreakpoint})`]: {
      flexDirection: "column",
    },
  });
  const hideButton = css({
    [`@media not screen and (max-width: ${menuBreakpoint})`]: {
      display: "none",
    },
  });
  const hideNav = css({
    [`@media (max-width: ${menuBreakpoint})`]: {
      display: open ? "" : "none",
    },
  });

  return (
    <header className={classNames([headerStyle(), wrapHeader()])}>
      <div className={titleStyle()}>
        {/* title/logo */}
        <Logo
          className={logoStyle()}
          onMouseEnter={(event) => restartAnimations(event.target as Element)}
        />
        <Link className={homeStyle()} to="/">
          <h1>Simplex</h1>
        </Link>

        {/* expand/collapse button */}
        <button
          className={classNames([buttonStyle(), hideButton()])}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="nav"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* nav bar */}
      <nav id="nav" className={classNames([navStyle(), hideNav()])}>
        {!homepage && <Link to="/">Editor</Link>}
        <Link to="about">About</Link>
        {currentUser && (
          <>
            <Link to="my-articles">My Articles</Link>
            <Link to="account">Account</Link>
            <Link to="logout">Log Out</Link>
            <strong title={currentUser.id}>{currentUser.name}</strong>
          </>
        )}
        {!currentUser && (
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

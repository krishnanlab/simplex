import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import Citation from "@/components/Citation";
import Section from "@/components/Section";
import Tool from "@/components/Tool";
import { big } from "@/palette";
import { useEffect } from "react";

const heroStyle = css({
  ...big,
  textAlign: "center",
});

const Home = () => {
  const navigate = useNavigate();

  // handle 404 redirect
  useEffect(() => {
    const redirect = window.sessionStorage.redirect as string;
    if (!redirect) return;
    console.info("Redirecting to:", redirect);
    window.sessionStorage.removeItem("redirect");
    navigate(redirect);
  }, [navigate]);

  return (
    <>
      <Section fill="deep">
        <p css={heroStyle}>
          Scientific and medical writing is often hard for non-experts to
          understand because it&apos;s full of jargon. Simplex helps you
          identify complexity in your writing and simplify it.
        </p>
      </Section>

      <Section>
        <Tool />
      </Section>

      <Section fill="dark">
        <Citation />
      </Section>
    </>
  );
};

export default Home;

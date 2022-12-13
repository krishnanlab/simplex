import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "@stitches/react";
import Citation from "@/components/Citation";
import Meta from "@/components/Meta";
import Section from "@/components/Section";
import { big } from "@/global/palette";
import Article from "@/pages/Article";

const heroStyle = css({
  ...big,
  textAlign: "center",
});

/** homepage of app */
const Home = () => {
  const navigate = useNavigate();

  /** handle 404 redirect */
  useEffect(() => {
    const redirect = window.sessionStorage.redirect as string;
    if (redirect) {
      console.info("Redirecting to:", redirect);
      window.sessionStorage.removeItem("redirect");
      navigate(redirect);
    }
  });

  return (
    <>
      <Meta title="" />

      <Section fill="deep">
        <p className={heroStyle()}>
          Scientific and medical writing is often hard for non-experts to
          understand because it&apos;s full of jargon. Simplex helps you
          identify complexity in your writing and simplify it.
        </p>
      </Section>

      <Article />

      <Section fill="dark">
        <Citation />
      </Section>
    </>
  );
};

export default Home;

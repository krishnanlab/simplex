import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
import Balancer from "react-wrap-balancer";
import { css } from "@stitches/react";
import Citation from "@/components/Citation";
import Flex from "@/components/Flex";
import Meta from "@/components/Meta";
import Section from "@/components/Section";
import { big } from "@/global/palette";
import Article from "@/pages/Article";

const heroStyle = css({
  display: "block !important",
  margin: "0 auto",
  textAlign: "center",
  ...big,
});

/** homepage of app */
const Home = () => {
  const navigate = useNavigate();

  const [anonymousArticles] =
    useLocalStorage<Array<string>>("anonymous-articles");

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
        <Balancer className={heroStyle()}>
          {import.meta.env.VITE_DESCRIPTION}
        </Balancer>
      </Section>

      <Article />

      {anonymousArticles?.length && (
        <Section fill="offWhite">
          <h2>Anonymous Articles</h2>

          <p className="center">
            Articles created on this device while not logged in.
          </p>

          <Flex gap="small">
            {anonymousArticles.map((article, index) => (
              <Link key={index} to={`/article/${article}`}>
                {String(article)}
              </Link>
            ))}
          </Flex>
        </Section>
      )}

      <Section fill="dark">
        <Citation />
      </Section>
    </>
  );
};

export default Home;

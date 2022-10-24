import { Link } from "react-router-dom";
import Section from "@/components/Section";

const MyArticles = () => (
  <Section>
    <h2>My Articles</h2>
    <Link to="/article/123">Dummy Article</Link>
  </Section>
);

export default MyArticles;

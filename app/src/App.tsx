import { createGlobalStyle } from "styled-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { accent, black, fast } from "@/palette";

const GlobalStyles = createGlobalStyle({
  "*": {
    boxSizing: "border-box",
  },
  body: {
    margin: "0",
    fontFamily: "'Roboto Slab', serif",
    fontSize: "16px",
    fontWeight: 300,
  },
  "#root": {
    display: "flex",
    "flex-direction": "column",
    "min-height": "100vh",
  },
  main: {
    flexGrow: "1",
  },
  a: {
    color: black,
    transition: fast,
  },
  "a:hover": {
    color: accent,
  },
});

const App = () => (
  <>
    <GlobalStyles />
    <Header />
    <main></main>
    <Footer />
  </>
);

export default App;

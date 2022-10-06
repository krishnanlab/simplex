import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Global } from "@emotion/react";
import globalStyles from "@/global-styles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import MyArticles from "@/pages/MyArticles";
import Account from "@/pages/Account";
import Article from "@/pages/Article";
import Collection from "@/pages/Collection";
import LogIn from "@/pages/LogIn";
import LogOut from "@/pages/LogOut";

const App = () => (
  <BrowserRouter>
    <Global styles={globalStyles} />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="my-articles" element={<MyArticles />} />
        <Route path="account" element={<Account />} />
        <Route path="article/:id" element={<Article />} />
        <Route path="collection/:id" element={<Collection />} />
        <Route path="login" element={<LogIn />} />
        <Route path="logout" element={<LogOut />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;

const Layout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

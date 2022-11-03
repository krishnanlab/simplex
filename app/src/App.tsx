import { createContext, Dispatch, SetStateAction } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useLocalStorage } from "react-use";
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
import SignUp from "@/pages/SignUp";
import LogOut from "@/pages/LogOut";
import ForgotPassword from "@/pages/ForgotPassword";
import { LoggedIn } from "@/types";

interface GlobalStateType {
  loggedIn: LoggedIn;
  setLoggedIn: Dispatch<SetStateAction<LoggedIn>>;
}

export const GlobalState = createContext<GlobalStateType>({
  loggedIn: null,
  setLoggedIn: () => null,
});

const App = () => {
  const [loggedIn, setLoggedIn] = useLocalStorage<LoggedIn>("logged-in", null);

  return (
    <GlobalState.Provider value={{ loggedIn, setLoggedIn }}>
      <RouterProvider router={router} />
      <Global styles={globalStyles} />
    </GlobalState.Provider>
  );
};

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "my-articles", element: <MyArticles /> },
      { path: "account", element: <Account /> },
      { path: "article/:id", element: <Article fresh={false} /> },
      { path: "article", element: <Article fresh={true} /> },
      { path: "collection/:id", element: <Collection fresh={false} /> },
      { path: "collection", element: <Collection fresh={true} /> },
      { path: "login", element: <LogIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "logout", element: <LogOut /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "*", element: <Home /> },
    ],
  },
]);

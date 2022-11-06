import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Global } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TopNotification } from "@/components/Notification";
import { State } from "@/global/state";
import globalStyles from "@/global/styles";
import { LoggedIn } from "@/global/types";
import About from "@/pages/About";
import Account from "@/pages/Account";
import Article from "@/pages/Article";
import Collection from "@/pages/Collection";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import LogIn from "@/pages/LogIn";
import LogOut from "@/pages/LogOut";
import MyArticles from "@/pages/MyArticles";
import SignUp from "@/pages/SignUp";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retryOnMount: false,
      retry: false,
    },
    mutations: {
      networkMode: "always",
    },
  },
});

const App = () => {
  const [loggedIn, setLoggedIn] = useLocalStorage<LoggedIn>("logged-in", null);

  return (
    <QueryClientProvider client={queryClient}>
      <State.Provider value={{ loggedIn, setLoggedIn }}>
        <RouterProvider router={router} />
        <Global styles={globalStyles} />
      </State.Provider>
    </QueryClientProvider>
  );
};

export default App;

const Layout = () => (
  <>
    <Header />
    <main>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <TopNotification />
        <Outlet />
      </QueryParamProvider>
    </main>
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "my-articles",
        element: <MyArticles />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "article/:id",
        element: <Article fresh={false} />,
      },
      {
        path: "article",
        element: <Article fresh={true} />,
      },
      {
        path: "collection/:id",
        element: <Collection fresh={false} />,
      },
      {
        path: "collection",
        element: <Collection fresh={true} />,
      },
      {
        path: "login",
        element: <LogIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "logout",
        element: <LogOut />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "*",
        element: <Home />,
      },
    ],
  },
]);

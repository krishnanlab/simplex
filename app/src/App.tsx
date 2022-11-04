import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Global } from "@emotion/react";
import globalStyles from "@/global/styles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Notification from "@/components/Notification";
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
import { LoggedIn } from "@/global/types";
import { State } from "@/global/state";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retryOnMount: false,
      notifyOnChangeProps: "all",
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
      <Outlet />
    </main>
    <Footer />
    <Notification />
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

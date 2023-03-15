import { IconContext } from "react-icons";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Notification } from "@/components/Notification";
import StateProvider from "@/global/state";
import globalStyles from "@/global/styles";
import About from "@/pages/About";
import Account from "@/pages/Account";
import Article from "@/pages/Article";
import Collection from "@/pages/Collection";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import LogIn from "@/pages/LogIn";
import LogOut from "@/pages/LogOut";
import MyArticles from "@/pages/MyArticles";
import ResetPassword from "@/pages/ResetPassword";
import SignUp from "@/pages/SignUp";

/** react-query configuration  */
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

/** main app entry point */
const App = () => (
  <>
    {globalStyles()}
    <IconContext.Provider value={{ className: "react-icons" }}>
      <QueryClientProvider client={queryClient}>
        <StateProvider>
          <RouterProvider router={router} />
        </StateProvider>
      </QueryClientProvider>
    </IconContext.Provider>
  </>
);

export default App;

/** route layout */
const Layout = () => (
  <>
    <Header />
    <main>
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{ updateType: "replaceIn" }}
      >
        <Notification />
        <Outlet />
      </QueryParamProvider>
    </main>
    <Footer />
  </>
);

/** route definitions */
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
        element: <Article />,
      },
      {
        path: "article",
        element: <Article />,
      },
      {
        path: "collection/:id",
        element: <Collection />,
      },
      {
        path: "collection",
        element: <Collection />,
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
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "*",
        element: <Home />,
      },
    ],
  },
]);

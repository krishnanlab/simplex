import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TopNotification } from "@/components/Notification";
import { State, StateType } from "@/global/state";
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
const App = () => {
  const [loggedIn, setLoggedIn] = useLocalStorage<StateType["loggedIn"]>(
    "logged-in",
    null
  );

  return (
    <>
      {globalStyles()}
      <QueryClientProvider client={queryClient}>
        <State.Provider value={{ loggedIn, setLoggedIn }}>
          <RouterProvider router={router} />
        </State.Provider>
      </QueryClientProvider>
    </>
  );
};

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
        <TopNotification />
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

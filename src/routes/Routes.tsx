import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { routesGenerator } from "@/utils/Generator/RoutesGenerator";





import App from "../App";
import { publicRoutes } from "./PublicRoutes";
import Practice from "@/pages/Public/Practice01/Practice";
import Practice02 from "@/pages/Public/Practice02/Practice02";

// CORE COMPONENTS (Always included)
const Login = lazy(() => import("@/pages/Auth/Login"));
const Signup = lazy(() => import("@/pages/Auth/Signup"));
const Form = lazy(() => import("@/pages/Form"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
            ...routesGenerator(publicRoutes),
            {
        path: "/form",
        element: <Form />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },  
  {
    path: "/practice",
    element: <Practice />,
  },
  {
    path: "/practice02",
    element: <Practice02 />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;

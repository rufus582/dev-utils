import { createBrowserRouter } from "react-router";
import { RouterProvider as ReactRouterProvider } from "react-router/dom";
import HomeLayout from "@/components/layout/home-layout/home-layout";
import { routeDefinitions } from "./route-definitions";

const router = createBrowserRouter([
  {
    Component: HomeLayout,
    children: routeDefinitions
  },
]);

const RouterProvider = () => <ReactRouterProvider router={router} />

export default RouterProvider

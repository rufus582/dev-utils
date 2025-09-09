import { createBrowserRouter, Link } from "react-router";
import { RouterProvider as ReactRouterProvider } from "react-router/dom";
import HomeLayout from "@/components/layout/home-layout/home-layout";
import { routeDefinitions } from "./route-definitions";

const router = createBrowserRouter([
  {
    Component: HomeLayout,
    children: [
      {
        path: '/',
        element: <Link to='/jq'>Load</Link>
      },
      ...routeDefinitions
    ]
  },
]);

const RouterProvider = () => <ReactRouterProvider router={router} />

export default RouterProvider

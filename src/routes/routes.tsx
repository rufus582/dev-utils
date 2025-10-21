import { createBrowserRouter } from "react-router";
import { RouterProvider as ReactRouterProvider } from "react-router/dom";
import HomeLayout from "@/components/layout/home-layout/home-layout";
import { routeDefinitions } from "./route-definitions";
import HomePage from "@/components/pages/HomePage/HomePage";

const router = createBrowserRouter([
  {
    Component: HomeLayout,
    errorElement: <HomeLayout showErrorLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      ...routeDefinitions,
    ],
  },
]);

const RouterProvider = () => <ReactRouterProvider router={router} />;

export default RouterProvider;

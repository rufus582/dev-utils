import JQPlayground from "@/components/pages/JQPlayground/JQPlayground";
import TextConverter from "@/components/pages/TextConverter/TextConverter";
import JSONTableViewer from "@/components/pages/JSONTableViewer/JSONTableViewer";
import type React from "react";
import { Grid2x2, WholeWord } from "lucide-react";
import type { RouteObject } from "react-router";
import JQLogo from "@/components/icons/jq-logo";

type RouteDefinition = RouteObject & {
  definitionId: number;
  path: string;
  element: React.ReactNode;
  displayable: string;
  icon: React.ReactNode;
  children?: RouteDefinition[];
};

export const routeDefinitions: RouteDefinition[] = [
  {
    definitionId: 1,
    path: "/text-converter",
    element: <TextConverter />,
    icon: <WholeWord />,
    displayable: "Text Converter",
  },
  {
    definitionId: 2,
    path: "/jq",
    element: <JQPlayground />,
    icon: <JQLogo />,
    displayable: "JQ Playground",
  },
  {
    definitionId: 3,
    path: "/json-table",
    element: <JSONTableViewer />,
    icon: <Grid2x2 />,
    displayable: "JSON Table Viewer",
  },
];

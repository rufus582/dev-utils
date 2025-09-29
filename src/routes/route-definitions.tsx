import JQPlayground from "@/components/pages/JQPlayground/JQPlayground";
import TextConverter from "@/components/pages/TextConverter/TextConverter";
import JSONTableViewer from "@/components/pages/JSONTableViewer/JSONTableViewer";
import type React from "react";
import { Database, Grid2x2, WholeWord } from "lucide-react";
import type { RouteObject } from "react-router";
import JQLogo from "@/components/icons/jq-logo";
import JMESPathPlayground from "@/components/pages/JMESPathPlayground/JMESPathPlayground";
import SQLPlayground from "@/components/pages/SQLPlayground/SQLPlayground";

type RouteDefinition = RouteObject & {
  definitionId: number;
  path: string;
  element: React.ReactNode;
  displayable: React.ReactNode;
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
    path: "/jmespath",
    element: <JMESPathPlayground />,
    icon: (
      <div className="font-bold font-mono text-muted-foreground flex">
        J <p className="text-foreground">P</p>
      </div>
    ),
    displayable: "JMESPath Playground",
  },
  {
    definitionId: 4,
    path: "/json-table",
    element: <JSONTableViewer />,
    icon: <Grid2x2 />,
    displayable: "JSON Table Viewer",
  },
  {
    definitionId: 5,
    path: "/sql",
    element: <SQLPlayground />,
    icon: <Database />,
    displayable: "SQL Playground",
  },
];

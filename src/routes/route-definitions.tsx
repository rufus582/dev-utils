import JQPlayground from "@/components/pages/JQPlayground/JQPlayground";
import TextConverter from "@/components/pages/TextConverter/TextConverter";
import JSONTableViewer from "@/components/pages/JSONTableViewer/JSONTableViewer";
import type React from "react";
import { Archive, Database, Grid2x2, PlusIcon, WholeWord } from "lucide-react";
import type { RouteObject } from "react-router";
import JQLogo from "@/components/icons/jq-logo";
import JMESPathPlayground from "@/components/pages/JMESPathPlayground/JMESPathPlayground";
import SQLPlayground from "@/components/pages/SQLPlayground/SQLPlayground";
import CELPlayground from "@/components/pages/CELPlayground/CELPlayground";
import JSONPathPlayground from "@/components/pages/JSONPathPlayground/JSONPathPlayground";
import { FileJson } from "lucide-react";
import CELLogo from "@/components/icons/cel-logo";
import SnapshotsPage from "@/components/pages/SnapshotsPage/SnapshotsPage";
import CreateSnapshotDialog from "@/components/pages/SnapshotsPage/CreateSnapshotDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IRouteDefinitionActionElementProps {
  definition: RouteDefinition;
  isActive: boolean;
}

export type RouteDefinition = RouteObject & {
  definitionId: number;
  path: string;
  element: React.ReactNode;
  displayable: string;
  icon: React.ReactNode;
  category?: string;
  keywords?: string[];
  children?: RouteDefinition[];
  sidebarPlace: "header" | "content" | "footer";
  actionElement?: (
    props: IRouteDefinitionActionElementProps
  ) => React.ReactNode;
};

export const routeDefinitions: RouteDefinition[] = [
  {
    definitionId: 1,
    path: "/text-converter",
    element: <TextConverter />,
    icon: <WholeWord />,
    displayable: "Text Converter",
    sidebarPlace: "content",
    keywords: ["base64", "json", "yaml", "toml"],
    category: "JSON",
  },
  {
    definitionId: 2,
    path: "/jq",
    element: <JQPlayground />,
    icon: <JQLogo />,
    displayable: "JQ Playground",
    sidebarPlace: "content",
    category: "Playground",
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
    sidebarPlace: "content",
    category: "Playground",
  },
  {
    definitionId: 4,
    path: "/json-table",
    element: <JSONTableViewer />,
    icon: <Grid2x2 />,
    displayable: "JSON Table Viewer",
    sidebarPlace: "content",
    keywords: ["csv", "parquet"],
    category: "JSON",
  },
  {
    definitionId: 5,
    path: "/sql",
    element: <SQLPlayground />,
    icon: <Database />,
    displayable: "SQL Playground",
    sidebarPlace: "content",
    category: "Playground",
  },
  {
    definitionId: 6,
    path: "/cel",
    element: <CELPlayground />,
    icon: <CELLogo />,
    displayable: "CEL Playground",
    sidebarPlace: "content",
    category: "Playground",
  },
  {
    definitionId: 7,
    path: "/jsonpath",
    element: <JSONPathPlayground />,
    icon: <FileJson />,
    displayable: "JSONPath Playground",
    sidebarPlace: "content",
    category: "Playground",
  },
  {
    definitionId: 8,
    path: "/snapshots",
    element: <SnapshotsPage />,
    icon: <Archive />,
    displayable: "Saved Snapshots",
    sidebarPlace: "footer",
    keywords: ["data"],
    actionElement: ({ isActive }) => (
      <CreateSnapshotDialog
        trigger={
          <Button
            size="icon"
            className={cn(
              "rounded-xl duration-150 transition-all shadow-primary",
              "active:scale-90 hover:scale-110 hover:shadow-[0px_0_15px]",
              "absolute top-1.5 right-1 flex after:absolute group-data-[collapsible=icon]:hidden",
              isActive && "shadow-[-10px_0_50px]"
            )}
          >
            <PlusIcon strokeWidth={7} />
          </Button>
        }
      />
    ),
  },
];

import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import z4 from "zod/v4";
import { Icon } from "#components/icons/huge-icon.tsx";
import { GeneralSettingsIcon, SettingsIcon } from "#components/icons/pages";
import { AddIcon, ArchiveIcon } from "#components/icons/routes";
import Header from "#components/layout/header/page-header.tsx";
import { cn } from "#lib/utils.ts";
import { Button } from "#ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs.tsx";
import SettingsTab from "./-tabs/settings";
import { SnapshotsTab } from "./-tabs/snapshots";
import CreateSnapshotDialog from "./-tabs/snapshots/create-snapshot-dialog";

const MotionButton = motion.create(Button);

const SETTINGS_TABS = ["settings", "snapshots"];
const defaultSearch = { tab: "settings" as const };

const searchParamSchema = z4.object({
  tab: z4.enum(SETTINGS_TABS).default("settings"),
});

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
  validateSearch: searchParamSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  staticData: {
    title: "tset",
    sidebar: {
      label: "Saved Snapshots",
      icon: <Icon icon={ArchiveIcon} />,
      place: "footer",
      routeMatch: {
        to: "/settings",
        includeSearch: true,
        search: { tab: "snapshots" },
      },
      search: { tab: "snapshots" },
      action: ({ isActive }) => (
        <CreateSnapshotDialog
          trigger={
            <MotionButton
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              size="icon"
              className={cn(
                "rounded-xl duration-150 transition-all shadow-primary",
                "active:scale-90 hover:scale-110 hover:shadow-[0px_0_15px]",
                "absolute top-1.5 right-1 flex after:absolute group-data-[collapsible=icon]:hidden",
                isActive && "shadow-[-10px_0_50px]",
              )}
            >
              <Icon icon={AddIcon} strokeWidth={7} />
            </MotionButton>
          }
        />
      ),
    },
    command: {
      entries: [
        {
          id: "settings",
          label: "Settings",
          icon: <Icon icon={SettingsIcon} />,
          keywords: ["preferences", "theme"],
          search: { tab: "settings" },
        },
        {
          id: "snapshots",
          label: "Snapshots",
          icon: <Icon icon={ArchiveIcon} />,
          keywords: ["data"],
          search: { tab: "snapshots" },
        },
      ],
    },
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  return (
    <Tabs
      value={search.tab}
      className="h-full gap-0!"
      onValueChange={(value) => {
        navigate({
          search: (prev) => ({
            ...prev,
            tab: value,
          }),
          replace: true,
        });
      }}
    >
      <Header
        title={
          <TabsList variant="line" className="m-auto">
            <TabsTrigger value={SETTINGS_TABS[0]}>
              <Icon icon={GeneralSettingsIcon} />
              Settings
            </TabsTrigger>
            <TabsTrigger value={SETTINGS_TABS[1]}>
              <Icon icon={ArchiveIcon} />
              Snapshots
            </TabsTrigger>
          </TabsList>
        }
        separator
      />
      <TabsContent value={SETTINGS_TABS[0]}>
        <SettingsTab />
      </TabsContent>
      <TabsContent value={SETTINGS_TABS[1]}>
        <SnapshotsTab />
      </TabsContent>
    </Tabs>
  );
}

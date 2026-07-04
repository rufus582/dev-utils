import { useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouteCatalog } from "#hooks/use-route-catalog";
import { Icon } from "#icons/huge-icon";
import { HomeIcon } from "#icons/sidebar";
import { CommandGroup, CommandItem } from "#ui/command";
import { settingsOps } from "@/store/indexed-db/settings";

const PagesCommandGroup = ({ closeCommand }: { closeCommand: () => void }) => {
  const settings = useLiveQuery(settingsOps.get);
  const navigate = useNavigate();
  const routeCatalog = useRouteCatalog();
  routeCatalog.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));

  const navigateCommand = (path: string) => {
    navigate({
      to: path,
      viewTransition: settings?.pageTransition,
    });
    closeCommand();
  };

  return (
    <CommandGroup heading="Pages">
      <CommandItem onSelect={() => navigateCommand("/")}>
        <Icon icon={HomeIcon} /> Home Page
      </CommandItem>
      {routeCatalog.map((route) => {
        return (
          <CommandItem
            key={route.routeId}
            onSelect={() => navigateCommand(route.fullPath)}
            keywords={route.sidebar?.keywords}
          >
            {route.sidebar?.icon} {route.title}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
};

export default PagesCommandGroup;

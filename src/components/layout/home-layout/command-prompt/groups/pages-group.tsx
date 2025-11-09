import { routeDefinitions } from "@/routes/route-definitions";
import { settingsOps } from "@/store/indexed-db/settings";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { HomeIcon } from "lucide-react";

const PagesCommandGroup = ({ closeCommand }: { closeCommand: () => void }) => {
  const settings = useLiveQuery(settingsOps.get);
  const navigate = useNavigate();

  const navigateCommand = (path: string) => {
    navigate(path, {
      viewTransition: settings?.pageTransition,
    });
    closeCommand();
  };

  return (
    <CommandGroup heading="Pages">
      <CommandItem onSelect={() => navigateCommand("/")}>
        <HomeIcon /> Home Page
      </CommandItem>
      {routeDefinitions.map((definition) => {
        return (
          <CommandItem
            key={definition.definitionId}
            onSelect={() => navigateCommand(definition.path)}
            keywords={definition.keywords}
          >
            {definition.icon} {definition.displayable}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
};

export default PagesCommandGroup;

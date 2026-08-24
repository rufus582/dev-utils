import { useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useCommandCatalog } from "#hooks/use-command-catalog";
import { Icon } from "#icons/huge-icon";
import { HomeIcon } from "#icons/sidebar";
import { CommandGroup, CommandItem } from "#ui/command";
import { settingsOps } from "@/store/indexed-db/settings";

const PagesCommandGroup = ({ closeCommand }: { closeCommand: () => void }) => {
  const settings = useLiveQuery(settingsOps.get);
  const navigate = useNavigate();
  const commandCatalog = useCommandCatalog();
  commandCatalog.sort((a, b) => a.label.localeCompare(b.label));

  const navigateCommand = (to: string, search?: object) => {
    navigate({
      to,
      search,
      viewTransition: settings?.pageTransition,
    });
    closeCommand();
  };

  return (
    <CommandGroup heading="Pages">
      <CommandItem onSelect={() => navigateCommand("/")}>
        <Icon icon={HomeIcon} /> Home Page
      </CommandItem>
      {commandCatalog.map((item) => {
        return (
          <CommandItem
            key={item.id}
            onSelect={() => navigateCommand(item.to, item.search)}
            keywords={item.keywords}
          >
            {item.icon} {item.label}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
};

export default PagesCommandGroup;

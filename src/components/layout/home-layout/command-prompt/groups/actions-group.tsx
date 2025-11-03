import { CommandGroup, CommandItem } from "@/components/ui/command";
import SettingsDialog from "@/components/layout/header/settings-dialog";
import { useState, type JSX } from "react";
import { SaveIcon, SettingsIcon } from "lucide-react";
import CreateSnapshotDialog from "@/components/pages/SnapshotsPage/CreateSnapshotDialog";

interface IActionItem {
  name: string;
  icon: JSX.Element;
  element: (item: Omit<IActionItem, "element">) => JSX.Element;
}

const ActionsCommandGroup = ({
  closeCommand,
}: {
  closeCommand: () => void;
}) => {
  const [currentItem, setCurrentItem] = useState("");

  const onActionDialogOpenChange = (open: boolean) => {
    setCurrentItem(open ? currentItem : "");
    if (!open) closeCommand();
  };

  const actions: IActionItem[] = [
    {
      name: "Create Snapshot",
      icon: <SaveIcon />,
      element: (item) => {
        return (
          <CreateSnapshotDialog
            open={currentItem === item.name}
            onOpenChange={onActionDialogOpenChange}
          />
        );
      },
    },
    {
      name: "Settings",
      icon: <SettingsIcon />,
      element: (item) => {
        return (
          <SettingsDialog
            open={currentItem === item.name}
            onOpenChange={onActionDialogOpenChange}
          />
        );
      },
    },
  ];

  return (
    <CommandGroup heading="Actions">
      {actions.map((action) => (
        <CommandItem
          key={action.name}
          onSelect={() => setCurrentItem(action.name)}
        >
          {action.element(action)}
          {action.icon}
          {action.name}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default ActionsCommandGroup;

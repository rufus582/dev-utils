import { type JSX, useState } from "react";
import CreateSnapshotDialog from "#/routes/settings/-tabs/snapshots/create-snapshot-dialog";
import { Icon } from "#icons/huge-icon";
import { SaveIcon } from "#icons/pages";
import { CommandGroup, CommandItem } from "#ui/command";

interface IActionItem {
  name: string;
  icon: JSX.Element;
  element: (item: Omit<IActionItem, "element">) => JSX.Element;
  keywords?: string[];
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
      icon: <Icon icon={SaveIcon} />,
      keywords: ["snapshot", "save"],
      element: (item) => {
        return (
          <CreateSnapshotDialog
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
          keywords={action.keywords}
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

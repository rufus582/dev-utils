import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import PagesCommandGroup from "./groups/pages-group";
import ActionsCommandGroup from "./groups/actions-group";

const DevUtilsCommandPrompt = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const closeCommand = () => setOpen(false);

  return (
    <CommandDialog
      loop
      open={open}
      onOpenChange={setOpen}
      bgBlur
      className="rounded-2xl bg-card/75"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <PagesCommandGroup closeCommand={closeCommand} />
        <ActionsCommandGroup closeCommand={closeCommand} />
      </CommandList>
    </CommandDialog>
  );
};

export default DevUtilsCommandPrompt;

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import PagesCommandGroup from "./groups/pages-group";
import ActionsCommandGroup from "./groups/actions-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IDevUtilsCommandPromptProps {
  setupGlobalShortcut?: boolean;
  showSearchBar?: boolean;
  searchBarPlaceholder?: string;
  className?: string;
}

const DevUtilsCommandPrompt = ({
  setupGlobalShortcut = false,
  showSearchBar = false,
  searchBarPlaceholder = "Search...",
  className,
}: IDevUtilsCommandPromptProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    if (setupGlobalShortcut) document.addEventListener("keydown", down);
    return () => {
      if (setupGlobalShortcut) document.removeEventListener("keydown", down);
    };
  }, [setupGlobalShortcut]);

  return (
    <>
      {showSearchBar && (
        <InputGroup
          className={cn(
            "rounded-full hover:border-muted-foreground transition-all",
            className
          )}
        >
          <InputGroupInput
            onFocus={() => setOpen(true)}
            placeholder={searchBarPlaceholder}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⌘ K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      )}
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
          <PagesCommandGroup closeCommand={() => setOpen(false)} />
          <ActionsCommandGroup closeCommand={() => setOpen(false)} />
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default DevUtilsCommandPrompt;

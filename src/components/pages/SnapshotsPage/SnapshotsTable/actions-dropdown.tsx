import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { useAppDispatch } from "@/hooks/hooks";
import { snapshotOps, type SnapshotType } from "@/store/indexed-db/snapshots";
import { RootActions, type AppStateType } from "@/store/redux/root-reducer";
import {
  ArchiveRestoreIcon,
  MoreHorizontal,
  PencilLineIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useStore } from "react-redux";
import { toast } from "sonner";

const handleDeleteSnapshot = async (snapshotId: number) => {
  try {
    await snapshotOps.delete(snapshotId);
    toast.success("Successfully deleted snapshot.");
  } catch (error) {
    toast.error(`${error}`);
  }
};

const handleUpdateSnapshot = async (
  snapshotId: number,
  state: AppStateType,
) => {
  try {
    await snapshotOps.update(snapshotId, state);
    toast.success("Successfully updated snapshot.");
  } catch (error) {
    toast.error(`${error}`);
  }
};

const SnapshotActionsCell = ({ snapshot }: { snapshot: SnapshotType }) => {
  const store = useStore<AppStateType>();
  const appState = store.getState();
  const dispatch = useAppDispatch();

  const handleLoadSnapshot = async (snapshotId: number) => {
    try {
      const snapshot = await snapshotOps.read(snapshotId);
      if (!snapshot) {
        throw new Error(`Cannot find snapshot with id '${snapshotId}'`);
      }

      dispatch(RootActions.setAppState(snapshot.state));
      toast.success("Successfully restored snapshot.");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const restoreRef = useRef<HTMLDivElement>(null);
  const updateRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "R" && restoreRef.current) {
        restoreRef.current.click();
      }
      if (event.key === "S" && updateRef.current) {
        updateRef.current.click();
      }
      if (event.key === "D" && deleteRef.current) {
        deleteRef.current.click();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="*:*:data-[slot=kbd]:ml-auto *:*:data-[slot=kbd]:border *:*:data-[slot=kbd]:font-mono"
      >
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          ref={restoreRef}
          onClick={() => handleLoadSnapshot(snapshot.id)}
        >
          <ArchiveRestoreIcon /> Restore Snapshot <Kbd>R</Kbd>
        </DropdownMenuItem>
        <DropdownMenuItem
          ref={updateRef}
          onClick={() => handleUpdateSnapshot(snapshot.id, appState)}
        >
          <PencilLineIcon /> Update Snapshot <Kbd>S</Kbd>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          ref={deleteRef}
          variant="destructive"
          onClick={() => handleDeleteSnapshot(snapshot.id)}
        >
          <Trash2Icon /> Delete Snapshot{" "}
          <Kbd className="text-destructive/90 bg-destructive/10 border-destructive/20">
            D
          </Kbd>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SnapshotActionsCell;

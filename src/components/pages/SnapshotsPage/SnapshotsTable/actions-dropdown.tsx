import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/hooks/hooks";
import { snapshotOps, type ISnapshot } from "@/store/indexed-db/snapshots";
import { RootActions } from "@/store/redux/root-reducer";
import { ImportIcon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

const handleDeleteSnapshot = async (snapshotId: number) => {
  try {
    await snapshotOps.delete(snapshotId);
    toast.success("Successfully deleted snapshot.");
  } catch (error) {
    toast.error(`${error}`);
  }
};

const SnapshotActionsCell = ({ snapshot }: { snapshot: ISnapshot }) => {
  const dispatch = useAppDispatch();

  const handleLoadSnapshot = async (snapshotId: number) => {
    try {
      const snapshot = await snapshotOps.read(snapshotId);
      if (!snapshot) {
        throw new Error(`Cannot find snapshot with id '${snapshotId}'`);
      }

      dispatch(RootActions.setAppState(snapshot.state));
      toast.success("Successfully loaded snapshot.");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleLoadSnapshot(snapshot.id)}>
          <ImportIcon /> Load Snapshot
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => handleDeleteSnapshot(snapshot.id)}
        >
          <Trash2Icon /> Delete Snapshot
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SnapshotActionsCell;

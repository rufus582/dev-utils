import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/ui/data-table.tsx/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/hooks/hooks";
import { snapshotOps, type ISnapshot } from "@/store/indexed-db/snapshots";
import { RootActions } from "@/store/redux/root-reducer";
import type { Table } from "@tanstack/react-table";
import { ImportIcon, Trash2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

interface ISelectedSnapshotsActionBarProps {
  tableState: Table<ISnapshot>;
  resetSelectedRows: () => void;
}

const SelectedSnapshotsActionBar = ({
  tableState,
  resetSelectedRows,
}: ISelectedSnapshotsActionBarProps) => {
  const dispatch = useAppDispatch();

  const selectedRowData = tableState.getSelectedRowModel().rows;

  const handleDeleteSelected = async () => {
    const selectedRowIds: number[] = selectedRowData.map((row) =>
      row.getValue("id")
    );
    try {
      await snapshotOps.deleteBulk(selectedRowIds);
      toast.success("Successfully deleted selected snapshots.");
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      resetSelectedRows();
    }
  };

  const handleLoadSnapshot = async () => {
    try {
      const snapshotId = selectedRowData.at(0)?.getValue("id");
      if (snapshotId === undefined || typeof snapshotId !== "number") {
        throw new Error("Selected snapshot is invalid.");
      }

      const snapshot = await snapshotOps.read(snapshotId);
      if (!snapshot) {
        throw new Error(`Cannot find snapshot with id '${snapshotId}'`);
      }

      dispatch(RootActions.setAppState(snapshot.state));
      toast.success("Successfully loaded snapshot.");
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      resetSelectedRows();
    }
  };

  return (
    <DataTableActionBar table={tableState}>
      <DataTableActionBarSelection table={tableState} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />

      <AnimatePresence>
        {selectedRowData.length === 1 && (
          <motion.div
            initial={{ scale: 0, width: 0 }}
            animate={{ scale: 1, width: "auto" }}
            exit={{ scale: 0, width: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex gap-2"
          >
            <DataTableActionBarAction
              size="icon"
              tooltip="Load Snapshot"
              onClick={handleLoadSnapshot}
            >
              <ImportIcon />
            </DataTableActionBarAction>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        layout
        initial={{ scale: 0, width: 0 }}
        animate={{ scale: 1, width: "auto" }}
        transition={{ duration: 0.2 }}
      >
        <DataTableActionBarAction
          variant="destructive"
          size="icon"
          tooltip="Delete selected"
          onClick={handleDeleteSelected}
        >
          <Trash2Icon />
        </DataTableActionBarAction>
      </motion.div>
    </DataTableActionBar>
  );
};

export default SelectedSnapshotsActionBar;

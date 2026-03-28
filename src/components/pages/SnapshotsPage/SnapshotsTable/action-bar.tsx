import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/ui/data-table.tsx/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/hooks/hooks";
import { snapshotOps, type SnapshotType } from "@/store/indexed-db/snapshots";
import { RootActions, type AppStateType } from "@/store/redux/root-reducer";
import type { Table } from "@tanstack/react-table";
import { ArchiveRestoreIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "react-redux";
import { toast } from "sonner";

interface ISelectedSnapshotsActionBarProps {
  tableState: Table<SnapshotType>;
  resetSelectedRows: () => void;
}

const SelectedSnapshotsActionBar = ({
  tableState,
  resetSelectedRows,
}: ISelectedSnapshotsActionBarProps) => {
  const store = useStore<AppStateType>();
  const appState = store.getState();
  const dispatch = useAppDispatch();

  const selectedRowData = tableState.getSelectedRowModel().rows;

  const handleDeleteSelected = async () => {
    const selectedRowIds: number[] = selectedRowData.map((row) =>
      row.getValue("id"),
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
      toast.success("Successfully restored snapshot.");
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      resetSelectedRows();
    }
  };

  const handleUpdateSnapshot = async () => {
    try {
      const snapshotId = selectedRowData.at(0)?.getValue("id");
      if (snapshotId === undefined || typeof snapshotId !== "number") {
        throw new Error("Selected snapshot is invalid.");
      }

      await snapshotOps.update(snapshotId, appState);
      toast.success("Successfully updated snapshot.");
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

      <AnimatePresence initial={false}>
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
              tooltip="Restore Snapshot"
              onClick={handleLoadSnapshot}
              keyName="R"
            >
              <ArchiveRestoreIcon />
            </DataTableActionBarAction>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update Snapshot"
              onClick={handleUpdateSnapshot}
              keyName="S"
            >
              <PencilLineIcon />
            </DataTableActionBarAction>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div layout transition={{ duration: 0.2 }}>
        <DataTableActionBarAction
          variant="destructive"
          size="icon"
          tooltip="Delete selected"
          onClick={handleDeleteSelected}
          keyName="D"
        >
          <Trash2Icon />
        </DataTableActionBarAction>
      </motion.div>
    </DataTableActionBar>
  );
};

export default SelectedSnapshotsActionBar;

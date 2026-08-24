import type {
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useLegacyTable,
} from "@tanstack/react-table/legacy";
import { useLiveQuery } from "dexie-react-hooks";
import { customAlphabet } from "nanoid";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Icon } from "#icons/huge-icon";
import { DownloadIcon, SaveIcon, UploadIcon } from "#icons/pages";
import { ArchiveIcon } from "#icons/routes";
import { CancelIcon } from "#icons/ui";
import { sleep } from "#lib/utils";
import { type SnapshotType, snapshotOps } from "#store/indexed-db/snapshots";
import { ButtonGroup } from "#ui/button-group";
import { Button } from "#ui/custom-components/animated-button";
import { DataTable } from "#ui/data-table.tsx/data-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#ui/empty";
import {
  InputButton,
  InputButtonAction,
  InputButtonInput,
  InputButtonProvider,
  InputButtonSubmit,
} from "#ui/input-button";
import CreateSnapshotDialog from "./create-snapshot-dialog";
import { ImportSnapshotsForm } from "./import-snapshots-form";
import SelectedSnapshotsActionBar from "./snapshots-table/action-bar";
import { columns } from "./snapshots-table/columns";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);
const defaultSnapshot: SnapshotType[] = [];

const NoSnapshots = () => {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon={ArchiveIcon} />
        </EmptyMedia>
        <EmptyTitle>No Saved Snapshots Found</EmptyTitle>
        <EmptyDescription>You haven't saved any snapshots yet</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export function SnapshotsTab() {
  const snapshots = useLiveQuery(snapshotOps.readAll);

  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const exportAnchorRef = useRef<HTMLAnchorElement>(null);
  const onExportClick = async () => {
    if (exportAnchorRef.current && snapshots) {
      if (!snapshots.length) {
        toast.error("You haven't saved any snapshots yet!");
        return false;
      }
      const stringifiedSnapshots = JSON.stringify(snapshots, undefined, "");
      exportAnchorRef.current.download = `DevUtilsBackup_${Intl.DateTimeFormat().format()}_${nanoid()}.dvubak`;
      exportAnchorRef.current.href = `data:text/json;charset=utf-8,${encodeURIComponent(stringifiedSnapshots)}`;
      exportAnchorRef.current.click();

      toast.success("Snapshots exported successfully");
      return true;
    }
    return false;
  };

  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const tableState = useLegacyTable({
    columns: columns,
    data: snapshots ?? defaultSnapshot,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setSelectedRows,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
    state: {
      rowSelection: selectedRows,
      columnFilters,
      sorting,
    },
  });

  const handleCancelSearch = async (onlyOnEmpty?: boolean) => {
    if (!showSearchInput) return setShowSearchInput(true);

    if (onlyOnEmpty && tableState.getColumn("name")?.getFilterValue())
      return searchInputRef.current?.blur();

    await sleep(10);
    tableState.getColumn("name")?.setFilterValue("");
    setShowSearchInput(false);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between gap-2 px-4 mb-4 w-full">
        <InputButtonProvider
          setShowInput={setShowSearchInput}
          showInput={showSearchInput}
          className={showSearchInput ? "w-2xs" : ""}
        >
          <InputButton>
            <InputButtonAction>Search snapshots</InputButtonAction>
            <InputButtonSubmit
              onClick={() => handleCancelSearch()}
              className={"aspect-square px-0"}
            >
              <Icon icon={CancelIcon} />
            </InputButtonSubmit>
          </InputButton>
          <InputButtonInput
            ref={searchInputRef}
            className="pr-11"
            type="text"
            placeholder="Search text..."
            value={
              (tableState.getColumn("name")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              tableState.getColumn("name")?.setFilterValue(e.target.value)
            }
            onBlur={() => handleCancelSearch(true)}
            onKeyDown={(e) => e.key === "Escape" && handleCancelSearch(true)}
            autoFocus
          />
        </InputButtonProvider>
        <div className="flex gap-4">
          <ButtonGroup className="">
            <ImportSnapshotsForm
              triggerElement={
                <Button
                  variant={"outline"}
                  className="w-fit ml-auto rounded-full"
                  buttonIcon={<Icon icon={UploadIcon} />}
                  loaderIcon={null}
                  errorIcon={null}
                  successIcon={null}
                  whileTap={{ scale: 0.97 }}
                >
                  Import
                </Button>
              }
            />
            <Button
              variant={"outline"}
              className="w-fit ml-auto rounded-full border!"
              buttonIcon={<Icon icon={DownloadIcon} />}
              onClick={onExportClick}
              whileTap={{ scale: 0.97 }}
            >
              {/** biome-ignore lint/a11y/useValidAnchor: href is generated dynamically */}
              <a
                ref={exportAnchorRef}
                download="DevUtilsBackup.dvubak"
                className="hidden"
              >
                Export Snapshots
              </a>
              Export
            </Button>
          </ButtonGroup>
          <CreateSnapshotDialog
            trigger={
              <Button
                className="w-fit ml-auto rounded-full"
                buttonIcon={<Icon icon={SaveIcon} />}
                loaderIcon={null}
                errorIcon={null}
                successIcon={null}
                useDefaultInteractionAnimation
              >
                Create Snapshot
              </Button>
            }
          />
        </div>
      </div>
      <DataTable
        viewTransitionName="code-view"
        tableState={tableState}
        emptyContent={<NoSnapshots />}
      />
      <SelectedSnapshotsActionBar
        tableState={tableState}
        resetSelectedRows={() => setSelectedRows({})}
      />
    </div>
  );
}

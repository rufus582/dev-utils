import { ArchiveIcon, SaveIcon, XIcon } from "lucide-react";
import Header from "../page-header";
import { useLiveQuery } from "dexie-react-hooks";
import { snapshotOps, type ISnapshot } from "@/store/indexed-db/snapshots";
import { DataTable } from "@/components/ui/data-table.tsx/data-table";
import { columns } from "./SnapshotsTable/columns";
import { useRef, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  InputButton,
  InputButtonAction,
  InputButtonInput,
  InputButtonProvider,
  InputButtonSubmit,
} from "@/components/ui/input-button";
import { sleep } from "@/lib/utils";
import CreateSnapshotDialog from "./CreateSnapshotDialog";
import { Button } from "@/components/ui/button";
import SelectedSnapshotsActionBar from "./SnapshotsTable/action-bar";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const defaultSnapshot: ISnapshot[] = [];

const NoSnapshots = () => {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ArchiveIcon />
        </EmptyMedia>
        <EmptyTitle>No Saved Snapshots Found</EmptyTitle>
        <EmptyDescription>You haven't saved any snapshots yet</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

const SnapshotsPage = () => {
  const snapshots = useLiveQuery(snapshotOps.readAll);

  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const tableState = useReactTable({
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
      <Header separator />
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
              <XIcon />
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
        <CreateSnapshotDialog
          trigger={
            <Button className="w-fit ml-auto rounded-full">
              <SaveIcon /> Create Snapshot
            </Button>
          }
        />
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
};

export default SnapshotsPage;

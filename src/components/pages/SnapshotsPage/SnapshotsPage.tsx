import { Icon } from "@/components/icons/huge-icon";
import { ArchiveIcon } from "@/components/icons/routes";
import { SaveIcon, DownloadIcon, UploadIcon } from "@/components/icons/pages";
import { CancelIcon } from "@/components/icons/ui";
import Header from "@/components/layout/header/page-header";
import { useLiveQuery } from "dexie-react-hooks";
import { snapshotOps, type SnapshotType } from "@/store/indexed-db/snapshots";
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
import { Button } from "@/components/ui/custom-components/animated-button";
import SelectedSnapshotsActionBar from "./SnapshotsTable/action-bar";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ButtonGroup } from "@/components/ui/button-group";
import { toast } from "sonner";
import { ImportSnapshotsForm } from "./ImportSnapshotsForm";
import { customAlphabet } from "nanoid";

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

const SnapshotsPage = () => {
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
              <a
                ref={exportAnchorRef}
                download="DevUtilsBackup.dvubak"
                className="hidden"
              />
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
};

export default SnapshotsPage;

import { Checkbox } from "@/components/ui/checkbox";
import { type ISnapshot } from "@/store/indexed-db/snapshots";
import { type ColumnDef } from "@tanstack/react-table";
import SnapshotActionsCell from "./actions-dropdown";
import { DataCell, HeaderCell } from "@/components/ui/data-table.tsx/data-table-cell";

export const columns: ColumnDef<ISnapshot>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 20,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: (headerCtx) => <HeaderCell name="Name" headerCtx={headerCtx} />,
    cell: ({ getValue }) => <DataCell value={getValue() as string ?? ""} />,
    sortingFn: "alphanumeric",
    size: 600,
  },
  {
    accessorKey: "createdAt",
    header: (headerCtx) => <HeaderCell name="Created At" headerCtx={headerCtx} />,
    cell: ({ getValue }) => {
      const dateVal = getValue();
      return <DataCell value={dateVal instanceof Date ? dateVal.toLocaleString() : ""} />;
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "updatedAt",
    header: (headerCtx) => <HeaderCell name="Updated At" headerCtx={headerCtx} />,
    cell: ({ getValue }) => {
      const dateVal = getValue();
      return <DataCell value={dateVal instanceof Date ? dateVal.toLocaleString() : ""} />;
    },
    sortingFn: "datetime",
  },
  {
    id: "actions",
    size: 20,
    cell: ({ row }) => <SnapshotActionsCell snapshot={row.original} />,
  },
];

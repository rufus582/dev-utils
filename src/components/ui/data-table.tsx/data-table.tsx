import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type Table as TableType,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table-utils";

interface DataTableProps<TData, TValue> {
  columns?: ColumnDef<TData, TValue>[];
  data?: TData[];
  emptyContent?: React.ReactNode;
  tableState?: TableType<TData>;
  viewTransitionName?: string;
}

export function DataTable<TData, TValue>({
  columns = [],
  data = [],
  emptyContent,
  viewTransitionName,
  ...props
}: DataTableProps<TData, TValue>) {
  const tableState = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const table = props.tableState ?? tableState;

  return (
    <div
      className="overflow-hidden rounded-xl border h-full"
      style={{ viewTransitionName }}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={getCommonPinningStyles({ column: header.column })}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={getCommonPinningStyles({ column: cell.column })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                {emptyContent ?? "No records."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

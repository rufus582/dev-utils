import { Button } from "@/components/ui/button";
import type { ISnapshot } from "@/store/indexed-db/snapshots";
import type { HeaderContext } from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

interface IHeaderCellProps {
  name: string;
  headerCtx: HeaderContext<ISnapshot, unknown>;
  sorting?: boolean;
}

const HeaderCell = ({ name, headerCtx, sorting = true }: IHeaderCellProps) => {
  const isSorted = headerCtx.column.getIsSorted();
  const Icon =
    isSorted === "asc"
      ? ChevronUp
      : isSorted === "desc"
      ? ChevronDown
      : ChevronsUpDown;

  return (
    <Button
      className="w-full text-left justify-start"
      variant="ghost"
      onClick={() => headerCtx.column.toggleSorting(isSorted === "asc")}
    >
      {name}
      {sorting && <Icon className="ml-2 h-4 w-4" />}
    </Button>
  );
};

const DataCell = ({ value }: { value: string }) => (
  <p className="px-3">{value}</p>
);

export { DataCell, HeaderCell };

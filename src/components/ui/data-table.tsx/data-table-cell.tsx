import type { HeaderContext } from "@tanstack/react-table";
import type { LegacyFeatures } from "@tanstack/react-table/legacy";
import { Icon } from "#icons/huge-icon";
import {
  ArrowPointDownIcon,
  ArrowPointUpIcon,
  ArrowUpDownIcon,
} from "#icons/ui";
import { Button } from "#ui/button";
import type { SnapshotType } from "@/store/indexed-db/snapshots";

interface IHeaderCellProps {
  name: string;
  headerCtx: HeaderContext<LegacyFeatures, SnapshotType, unknown>;
  sorting?: boolean;
}

const SortingIcon = ({
  sorting,
  className,
}: {
  sorting: "asc" | "desc" | false;
  className: string;
}) => {
  const SortIcon =
    sorting === "asc"
      ? ArrowPointUpIcon
      : sorting === "desc"
        ? ArrowPointDownIcon
        : ArrowUpDownIcon;

  return <Icon icon={SortIcon} className={className} />;
};

const HeaderCell = ({ name, headerCtx, sorting = true }: IHeaderCellProps) => {
  const isSorted = headerCtx.column.getIsSorted();

  return (
    <Button
      className="w-full text-left justify-start"
      variant="ghost"
      onClick={() => headerCtx.column.toggleSorting(isSorted === "asc")}
    >
      {name}
      {sorting && (
        <SortingIcon
          sorting={isSorted}
          className="ml-2 h-4 w-4 text-muted-foreground/70"
        />
      )}
    </Button>
  );
};

const DataCell = ({ value }: { value: string }) => (
  <p className="px-3">{value}</p>
);

export { DataCell, HeaderCell };

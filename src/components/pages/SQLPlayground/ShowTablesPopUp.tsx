import { Icon } from "@/components/icons/huge-icon";
import {
  MoreHorizontalIcon,
  CheckmarkCircleIcon,
  DeleteIcon,
  ViewIcon,
} from "@/components/icons/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Arrow } from "@radix-ui/react-popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { convertSqlResultToRecords } from "@/lib/sql-utils";
import { useState } from "react";
import { Button } from "@/components/ui/custom-components/animated-button";
import { Button as NormalButton } from "@/components/ui/button";
import type { Database } from "sql.js";
import { toast } from "sonner";

interface ShowTablesPopUpProps {
  tables: JSONObject[];
  setTables: (tables: JSONObject[]) => void;
  db?: Database;
  onClickCellItemAction: (query: string) => void;
}

const ShowTablesPopUp = ({
  tables,
  setTables,
  db,
  onClickCellItemAction,
}: ShowTablesPopUpProps) => {
  const [isShowTablesPopoverOpen, setIsShowTablesPopoverOpen] = useState(false);

  const handleShowTables = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    showWarning: boolean = true,
  ) => {
    const result = db?.exec(
      'SELECT name FROM sqlite_master WHERE type = "table"',
    );
    if (result && result.length > 0) {
      const tablesList = convertSqlResultToRecords(result[0]);
      setTables(tablesList);
      return true;
    }

    if (showWarning) toast.warning("No tables found, please create one!");

    setTables([]);
    e?.preventDefault();
    setIsShowTablesPopoverOpen(false);

    return false;
  };

  const handleCellItemAction = (query: string) => {
    onClickCellItemAction(query);
    handleShowTables(undefined, false);
  };

  return (
    <Popover
      modal
      open={isShowTablesPopoverOpen}
      onOpenChange={setIsShowTablesPopoverOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          buttonIcon={<Icon icon={ViewIcon} />}
          successIcon={<Icon icon={CheckmarkCircleIcon} />}
          errorBgColorClass="bg-destructive-alt"
          className="w-fit rounded-full mb-4 ml-2"
          useDefaultInteractionAnimation
          onClick={handleShowTables}
        >
          Show Tables
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="rounded-xl p-0 relative h-37.5 overflow-scroll overscroll-y-contain"
        align="center"
      >
        <Arrow className="fill-muted-foreground" />
        <Table scroll={false}>
          <TableHeader>
            <TableRow className="*:px-4 h-12 sticky top-0 bg-background hover:bg-muted">
              <TableHead>Table Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map(({ name }) => {
              return (
                <TableRow className="*:px-4 h-10" key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <NormalButton
                          variant="ghost"
                          size="icon"
                          className="size-8"
                        >
                          <Icon icon={MoreHorizontalIcon} />
                          <span className="sr-only">Open menu</span>
                        </NormalButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleCellItemAction(`select * from ${name}`)
                          }
                        >
                          <Icon icon={ViewIcon} />
                          View Records
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            handleCellItemAction(`drop table ${name}`)
                          }
                        >
                          <Icon icon={DeleteIcon} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
};

export { ShowTablesPopUp, type ShowTablesPopUpProps };

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useImmer } from "use-immer";
import { Icon } from "@/components/icons/huge-icon";
import { PlayIcon, TypeCursorIcon } from "@/components/icons/pages";
import { CancelIcon, PasteIcon, TickIcon } from "@/components/icons/ui";
import Header from "@/components/layout/header/page-header";
import CodeEditor, {
  type CodeEditorRefType,
} from "@/components/ui/code/code-editor";
import type {
  JSONGridTabDataProps,
  JSONGridTabsRefType,
} from "@/components/ui/code/json-grid-tabs";
import JSONGridTabs from "@/components/ui/code/json-grid-tabs";
import { Button } from "@/components/ui/custom-components/animated-button";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DatabaseLibs,
  type DatabaseType,
  type ISQLDBProps,
  supportedDatabaseTypes,
} from "@/lib/sql";
import { getClipboardText } from "@/lib/utils";
import {
  type DBConnectionState,
  DBConnectionStatusBadge,
} from "./DBConnectionStatusBadge";
import { ImportTableForm } from "./ImportTableForm";
import { ShowTablesPopUp } from "./ShowTablesPopUp";

interface SQLDataStateType {
  db?: ISQLDBProps;
  sqlCode: string;
  resultData: JSONGridTabDataProps[];
  tables: JSONObject[];
  databaseType: DatabaseType;
}

const SQLPlayground = () => {
  const [dbConnectionState, setDbConnectionState] =
    useState<DBConnectionState>("connecting");
  const [isSQLPanelCollapsed, setIsSQLPanelCollapsed] = useState(false);
  const [sqlDataState, setSQLDataState] = useImmer<SQLDataStateType>({
    db: new DatabaseLibs.DuckDB(),
    sqlCode: "",
    resultData: [],
    tables: [],
    databaseType: "DuckDB",
  });

  const editorRef: CodeEditorRefType = useRef(null);
  const resultViewerRef: JSONGridTabsRefType = useRef(null);

  useEffect(() => {
    const connectDB = async () => {
      try {
        setDbConnectionState("connecting");
        await sqlDataState.db?.establishConnection();
      } catch (e) {
        console.log(e);
        setDbConnectionState("error");
      }

      setDbConnectionState("connected");
    };

    connectDB();

    return () => {
      sqlDataState.db?.close();
    };
  }, [sqlDataState.db]);

  useEffect(() => {
    if (sqlDataState.resultData.length > 0)
      resultViewerRef.current?.setSelectedTabValue(
        sqlDataState.resultData[0]?.value,
      );
  }, [sqlDataState.resultData]);

  const runSQLQueryAndUpdateState = async (query: string) => {
    try {
      const resultData = await sqlDataState.db?.exec(query);
      if (resultData && resultData.length > 0) {
        setSQLDataState((state) => {
          state.resultData = resultData;
        });
      }

      toast.success("SQL Query ran successfully!");
      return true;
    } catch (error) {
      toast.error(`${error}`);
      return false;
    }
  };

  const onClickRunSQL = async (
    selection: boolean = false,
  ): Promise<boolean> => {
    try {
      let queryToRun: string = sqlDataState.sqlCode;
      if (selection && editorRef.current) {
        const selection = editorRef.current.getSelection();
        if (selection)
          queryToRun =
            editorRef.current.getModel()?.getValueInRange(selection) ??
            queryToRun;
      }
      if (!queryToRun || queryToRun === "")
        throw new Error("SQL Query is empty!");

      return runSQLQueryAndUpdateState(queryToRun);
    } catch (error) {
      toast.error(`${error}`);
      return false;
    }
  };

  const handleClipboardPaste = async () => {
    let isSuccess = false;
    await getClipboardText()
      .then(async (value) => {
        setSQLDataState((state) => {
          state.sqlCode = value;
        });
        isSuccess = true;
      })
      .catch((error) => {
        isSuccess = false;
        console.error(error);
      });

    return isSuccess;
  };

  const handleDbChange = async (newDB: DatabaseType) => {
    setSQLDataState((state) => {
      state.db = new DatabaseLibs[newDB]();
      state.databaseType = newDB;
      state.resultData = [];
      state.tables = [];
    });
  };

  return (
    <div className="flex flex-col h-full rounded-xl gap-4">
      <Header separator />
      <div className="flex justify-between">
        <div className="flex gap-2 ml-2">
          <ImportTableForm
            db={sqlDataState.db}
            disabled={dbConnectionState !== "connected"}
          />
          <Tooltip content="Paste copied data from clipboard" asChild>
            <Button
              variant="outline"
              buttonIcon={<Icon icon={PasteIcon} />}
              successBgColorClass="bg-success-alt"
              errorBgColorClass="bg-destructive-alt"
              className="w-fit rounded-full"
              onClick={handleClipboardPaste}
              disabled={dbConnectionState !== "connected"}
              useDefaultInteractionAnimation
            >
              Paste
            </Button>
          </Tooltip>
          <ShowTablesPopUp
            tables={sqlDataState.tables}
            setTables={(tables) =>
              setSQLDataState((state) => {
                state.tables = tables;
              })
            }
            db={sqlDataState.db}
            onClickCellItemAction={runSQLQueryAndUpdateState}
            disabled={dbConnectionState !== "connected"}
          />
          <Select
            onValueChange={handleDbChange}
            value={sqlDataState.databaseType}
          >
            <SelectTrigger
              className="rounded-3xl flex gap-0 w-50"
              disabled={dbConnectionState !== "connected"}
            >
              <DBConnectionStatusBadge
                className="-ml-1.5"
                state={dbConnectionState}
              />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Database</SelectLabel>
                {supportedDatabaseTypes.map((dbType) => (
                  <SelectItem key={dbType} value={dbType}>
                    {dbType}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="mr-2 flex gap-2">
          <Tooltip
            content="Run SQL Query"
            asChild
            className=" justify-items-end"
          >
            <Button
              buttonIcon={<Icon icon={PlayIcon} />}
              successIcon={<Icon icon={TickIcon} />}
              successBgColorClass="bg-primary"
              errorIcon={<Icon icon={CancelIcon} />}
              errorBgColorClass="bg-primary"
              className="w-fit rounded-full"
              onClick={() => onClickRunSQL()}
              disabled={dbConnectionState !== "connected"}
              useDefaultInteractionAnimation
            >
              Run SQL
            </Button>
          </Tooltip>
          <Tooltip
            content="Run Selected SQL Query"
            asChild
            className="justify-items-end"
          >
            <Button
              buttonIcon={<Icon icon={TypeCursorIcon} />}
              successIcon={<Icon icon={TickIcon} />}
              successBgColorClass="bg-primary"
              errorIcon={<Icon icon={CancelIcon} />}
              errorBgColorClass="bg-primary"
              className="w-fit rounded-full"
              onClick={() => onClickRunSQL(true)}
              disabled={dbConnectionState !== "connected"}
              useDefaultInteractionAnimation
            >
              Run Selected
            </Button>
          </Tooltip>
        </div>
      </div>
      <ResizablePanelGroup
        direction="vertical"
        style={{ viewTransitionName: "code-view" }}
      >
        <ResizablePanel
          collapsible
          minSize={25}
          onCollapse={() => setIsSQLPanelCollapsed(true)}
          onExpand={() => setIsSQLPanelCollapsed(false)}
        >
          <CodeEditor
            ref={editorRef}
            className="rounded-t-xl h-full"
            onChange={(value) =>
              setSQLDataState((state) => {
                state.sqlCode = value ?? "";
              })
            }
            title="SQL"
            value={sqlDataState.sqlCode}
            language="sql"
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={15} className="overflow-hidden">
          <JSONGridTabs
            ref={resultViewerRef}
            tabsData={
              sqlDataState.resultData.length
                ? sqlDataState.resultData
                : [
                    {
                      displayable: "Result",
                      value: "1",
                      content: {},
                    },
                  ]
            }
            className={`h-full rounded-b-xl ${
              isSQLPanelCollapsed ? "rounded-t-xl" : ""
            }`}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SQLPlayground;

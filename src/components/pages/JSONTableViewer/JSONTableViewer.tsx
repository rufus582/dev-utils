import CodeEditor from "@/components/ui/code/code-editor";
import { useCallback, useRef, useState } from "react";
import { TextFormats } from "@/lib/text-formats";
import JSONGrid from "@/components/ui/code/json-grid";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "@/components/pages/page-header";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Button } from "@/components/ui/custom-components/animated-button";
import { FolderOpen, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import useOpenFile from "@/hooks/use-open-file";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";

const JSONTableViewer = () => {
  const [jsonDataState, setJsonDataState] = useState<JSONObject>();
  const [isInputCollapsed, setisInputCollapsed] = useState(false);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  const handleJsonDataChanged = useCallback((value: string) => {
    let parsedJsonData: object | string = {};
    try {
      parsedJsonData = TextFormats.JSON.parse(value ?? "{}");
      if (typeof parsedJsonData === "string") {
        throw new Error("Cannot convert string to table");
      }
    } catch (error) {
      // TODO error handling | maybe show a toast?
      return console.error(error);
    }

    setJsonDataState(parsedJsonData ?? {});
  }, []);

  const onOpenFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      files[0].text().then((fileContent) => handleJsonDataChanged(fileContent));
    }
  };

  const { FileInputComponent, openFileDialog } = useOpenFile({
    onOpenFiles,
    acceptedExtensions: ".json,.csv,.parquet,.yaml",
  });

  const toggleLeftPanel = () => {
    if (isInputCollapsed) {
      leftPanelRef.current?.expand();
    } else {
      leftPanelRef.current?.collapse();
    }
    return true;
  };

  return (
    <div className="flex flex-col h-full rounded-xl">
      <Header />
      <FileInputComponent />
      <div>
        <Tooltip content="Supported files: JSON, YAML, CSV, PARQUET">
          <Button
            loaderIcon={null}
            buttonIcon={<FolderOpen />}
            successIcon={null}
            className="w-fit rounded-full mb-4 ml-2"
            onClick={() => openFileDialog() || true}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
          >
            Open File
          </Button>
        </Tooltip>
        <Button
          variant="outline"
          loaderIcon={null}
          buttonIcon={isInputCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          successIcon={null}
          className="w-fit rounded-full mb-4 ml-2"
          onClick={toggleLeftPanel}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1 }}
        >
          {isInputCollapsed ? "Show" : "Hide"} Input
        </Button>
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        style={{ viewTransitionName: "code-view" }}
      >
        <ResizablePanel
          ref={leftPanelRef}
          collapsible
          minSize={25}
          onCollapse={() => setisInputCollapsed(true)}
          onExpand={() => setisInputCollapsed(false)}
        >
          <CodeEditor
            className="rounded-l-xl h-full"
            onChange={(value) => handleJsonDataChanged(value ?? "")}
            title="JSON Input Content"
            value={jsonDataState ? TextFormats.JSON.unparse(jsonDataState) : ""}
            language={TextFormats.JSON.highlightName}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={15} className="overflow-hidden">
          <JSONGrid
            data={jsonDataState ?? {}}
            className={`h-full rounded-r-xl ${
              isInputCollapsed ? "rounded-l-xl" : ""
            }`}
            title="JSON Table"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default JSONTableViewer;

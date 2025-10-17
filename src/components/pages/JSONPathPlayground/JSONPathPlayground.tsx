import CodeEditor from "@/components/ui/code/code-editor";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Header from "@/components/pages/page-header";
import { JSONPathActions } from "@/store/redux/jsonpath-slice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { TextFormats } from "@/lib/text-formats";
import { query } from "jsonpathly";

export default function JSONPathPlayground() {
  const jsonpathDataState = useAppSelector((state) => state.jsonpath);
  const dispatch = useAppDispatch();

  const handleCodeChanged = async (
    expressionVal?: string,
    jsonStrVal?: string
  ) => {
    const expression =
      expressionVal === undefined
        ? jsonpathDataState.expression
        : expressionVal;
    const jsonStr =
      jsonStrVal === undefined ? jsonpathDataState.jsonStr : jsonStrVal;

    dispatch(JSONPathActions.setExpression(expression));
    dispatch(JSONPathActions.setJsonStr(jsonStr));

    let rawResult = "";

    try {
      const parsedJsonData = await Promise.resolve(
        TextFormats.JSON.parse(jsonStr)
      );

      if (typeof parsedJsonData === "string")
        throw new Error(
          "Invalid input JSON data - strings cannot be queried with JSONPath"
        );

      const result = query(parsedJsonData, expression);
      rawResult = await Promise.resolve(
        TextFormats.JSON.unparse(result as object)
      );
    } catch (error: unknown) {
      if (error && typeof error === "object") {
        const err = error as { stderr?: string; message?: string };
        rawResult = `${
          err.stderr ?? err.message ?? "Error processing JSONPath Expression"
        }`;
      } else {
        rawResult = "Error processing JSONPath Expression";
      }
    }

    dispatch(JSONPathActions.setResult(rawResult ?? ""));
  };

  const onOpenJSONFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      files[0]
        .text()
        .then((fileContent) => handleCodeChanged(undefined, fileContent));
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <Header separator />
      <ResizablePanelGroup
        direction="vertical"
        className="pt-0"
        style={{ viewTransitionName: "code-view" }}
      >
        <ResizablePanel minSize={10} maxSize={30} defaultSize={15}>
          <CodeEditor
            className="rounded-t-xl rounded-b-none h-full w-full"
            value={jsonpathDataState.expression}
            onChange={(expression) => handleCodeChanged(expression)}
            title="JSONPath Expression"
            copyButton
            lineNumbers={false}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={30}>
              <CodeEditor
                className="rounded-t-none rounded-bl-xl rounded-br-none h-full"
                value={jsonpathDataState.jsonStr}
                title="Input JSON"
                language="json"
                onChange={(jsonStr) => handleCodeChanged(undefined, jsonStr)}
                copyButton
                fileButton={{
                  enabled: true,
                  acceptedExtensions: ".json",
                  onOpenFiles: onOpenJSONFile,
                  tooltipContent: "Supported files: JSON",
                }}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={20}>
              <CodeEditor
                className="rounded-br-xl rounded-bl-none rounded-t-none h-full"
                value={jsonpathDataState.result}
                title="Output"
                language="json"
                readOnly
                copyButton
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

import CodeEditor from "@/components/ui/code/code-editor";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Header from "@/components/layout/header/page-header";
import { CELActions } from "@/store/redux/cel-slice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import * as CEL from "@marcbachmann/cel-js";
import { TextFormats } from "@/lib/text-formats";
import CELLogo from "@/components/icons/cel-logo";

export default function CELPlayground() {
  const celDataState = useAppSelector(state => state.cel);
  const dispatch = useAppDispatch();

  const handleCodeChanged = async (
    celExpressionVal?: string,
    jsonStrVal?: string
  ) => {
    const celExpression =
      celExpressionVal === undefined
        ? celDataState.expression
        : celExpressionVal;
    const jsonStr =
      jsonStrVal === undefined ? celDataState.jsonStr : jsonStrVal;

    dispatch(CELActions.setCELExpression(celExpression));
    dispatch(CELActions.setJsonStr(jsonStr));

    let rawResult = "";

    try {
      const parsedJsonData = await Promise.resolve(
        TextFormats.JSON.parse(jsonStr)
      );

      if (typeof parsedJsonData === "string" || Array.isArray(parsedJsonData))
        throw new Error("Invalid input JSON data");

      const celResult = CEL.evaluate(celExpression, parsedJsonData);
      rawResult = await Promise.resolve(TextFormats.JSON.unparse(celResult));
    } catch (error: unknown) {
      if (error && typeof error === "object") {
        const err = error as { stderr?: string; message?: string };
        rawResult = `${
          err.stderr ?? err.message ?? "Error processing CEL Expression"
        }`;
      } else {
        rawResult = "Error processing CEL Expression";
      }
    }

    dispatch(CELActions.setResult(rawResult ?? ""));
  };

  const onOpenJSONFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      files[0]
        .text()
        .then((fileContent) => handleCodeChanged(undefined, fileContent));
    }
  };

  const titleContent = (
    <div className="flex gap-2">
      <CELLogo className="m-auto h-8" colorVariant="original" />
      <p>Playground</p>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col">
      <Header title={titleContent} separator />
      <ResizablePanelGroup
        direction="vertical"
        className="pt-0"
        style={{ viewTransitionName: "code-view" }}
      >
        <ResizablePanel minSize={10} maxSize={30} defaultSize={15}>
          <CodeEditor
            className="rounded-t-xl rounded-b-none h-full w-full"
            value={celDataState.expression}
            onChange={(expression) => handleCodeChanged(expression)}
            title="CEL Expression"
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
                value={celDataState.jsonStr}
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
                value={celDataState.result}
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

import * as CEL from "@marcbachmann/cel-js";
import { createFileRoute } from "@tanstack/react-router";
import Header from "#components/layout/header/page-header";
import { useAppDispatch, useAppSelector } from "#hooks/hooks";
import CELLogo from "#icons/sidebar/cel-logo";
import { TextFormats } from "#lib/text-formats";
import { CELActions } from "#store/redux/cel-slice";
import CodeEditor from "#ui/code/code-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "#ui/resizable";

export const Route = createFileRoute("/cel")({
  component: RouteComponent,
  staticData: {
    title: "CEL Playground",
    sidebar: {
      label: "CEL",
      icon: <CELLogo />,
      place: "content",
      category: "Playground",
      order: 6,
    },
  },
  ssr: false,
});

function RouteComponent() {
  const celDataState = useAppSelector((state) => state.cel);
  const dispatch = useAppDispatch();

  const handleCodeChanged = async (
    celExpressionVal?: string,
    jsonStrVal?: string,
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
        TextFormats.JSON.parse(jsonStr),
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
        orientation="vertical"
        className="pt-0"
        style={{ viewTransitionName: "code-view" }}
      >
        <ResizablePanel minSize={100} maxSize={300} defaultSize={150}>
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
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel minSize={350}>
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
            <ResizablePanel minSize={200}>
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

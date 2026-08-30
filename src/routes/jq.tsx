import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import JQLogo from "#icons/sidebar/jq-logo";
import CodeEditor from "#ui/code/code-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "#ui/resizable";
import GenerateExpressionPopover from "@/components/chatgpt/generate-expression-popover";
import Header from "@/components/layout/header/page-header";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useJQ } from "@/hooks/use-jq";
import { sanitizeGeneratedExpression } from "@/lib/ai/generation-tools";
import { JQActions } from "@/store/redux/jq-slice";

export const Route = createFileRoute("/jq")({
  component: RouteComponent,
  staticData: {
    title: "JQ Playground",
    sidebar: {
      label: "JQ",
      icon: <JQLogo />,
      place: "content",
      category: "Playground",
      routeMatch: { to: "/jq" },
    },
  },
  ssr: false,
});

function RouteComponent() {
  const jqDataState = useAppSelector((state) => state.jq);
  const dispatch = useAppDispatch();
  const [isGeneratingExpression, setIsGeneratingExpression] = useState(false);

  const { setFilter, setJSONStr, invoke } = useJQ({
    logJqVersion: true,
    invokeOnChange: true,
    shouldInvoke: () => !isGeneratingExpression,
    onChange: (state) => {
      dispatch(JQActions.setFilter(state.filter));
      dispatch(JQActions.setJsonStr(state.jsonStr));
      dispatch(JQActions.setResult(state.result));
    },
    initial: jqDataState,
  });

  const onOpenJSONFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      files[0].text().then(setJSONStr);
    }
  };

  const titleContent = (
    <div className="flex gap-2">
      <JQLogo className="m-auto" />
      <p>Playground</p>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col">
      <Header title={titleContent} separator />
      <div
        className="h-full w-full grid grid-cols-2 gap-2 pt-0"
        style={{ viewTransitionName: "code-view" }}
      >
        <CodeEditor
          className="rounded-l-xl rounded-r-md"
          value={jqDataState.filter}
          onChange={setFilter}
          title="JQ"
          copyButton
          showAiProcessingUI={isGeneratingExpression}
          aiProcessingText="Generating JQ filter..."
          headerActions={
            <GenerateExpressionPopover
              tool="jq"
              jsonSample={jqDataState.jsonStr}
              currentExpression={jqDataState.filter}
              outputSample={jqDataState.result}
              onGeneratingChange={setIsGeneratingExpression}
              onStreamChunk={(partial) => {
                setFilter(sanitizeGeneratedExpression(partial, "jq"));
              }}
              onGenerated={(expression) => {
                setFilter(expression);
                void invoke({ filter: expression });
              }}
            />
          }
        />
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel minSize={50}>
            <CodeEditor
              className="rounded-tr-xl rounded-tl-md h-full"
              value={jqDataState.jsonStr}
              title="Input JSON"
              language="json"
              onChange={setJSONStr}
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
          <ResizablePanel minSize={50}>
            <CodeEditor
              className="rounded-br-xl rounded-bl-md h-full"
              value={jqDataState.result}
              title="Output"
              language="json"
              readOnly
              copyButton
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

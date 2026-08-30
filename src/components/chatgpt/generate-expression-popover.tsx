import { Arrow } from "@radix-ui/react-popover";
import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "#icons/huge-icon";
import { AiBeautifyIcon, AiGenerativeIcon } from "#icons/pages";
import { Alert, AlertDescription } from "#ui/alert";
import { Button } from "#ui/button";
import { Button as AnimatedButton } from "#ui/custom-components/animated-button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "#ui/custom-components/pill-toggle-group";
import { FieldLabel } from "#ui/field";
import { InputGroup, InputGroupTextarea } from "#ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover";
import { Spinner } from "#ui/spinner";
import {
  GenerateExpressionError,
  getGenerateExpressionErrorMessage,
  useGenerateExpression,
} from "@/hooks/use-generate-expression";
import {
  GENERATION_TOOLS,
  type GenerationContext,
  type GenerationToolId,
} from "@/lib/ai/generation-tools";
import { LWC_PROVIDER_ID } from "@/lib/ai/providers/ids";
import { getAiProviderClient } from "@/lib/ai/providers/registry";

type ContextToggleId = "json" | "expression" | "output";

type GenerateExpressionPopoverProps = {
  tool: GenerationToolId;
  jsonSample?: string;
  currentExpression?: string;
  outputSample?: string;
  onGenerated: (expression: string) => void;
  trigger?: ReactNode;
  onGeneratingChange?: (isGenerating: boolean) => void;
  onStreamChunk?: (partial: string) => void;
};

const CONTEXT_OPTIONS: Record<
  GenerationToolId,
  { id: ContextToggleId; label: string }[]
> = {
  jq: [
    { id: "json", label: "Input JSON" },
    { id: "expression", label: "JQ" },
    { id: "output", label: "Output" },
  ],
  jmespath: [
    { id: "json", label: "Input JSON" },
    { id: "expression", label: "JMESPath" },
    { id: "output", label: "Output" },
  ],
  cel: [
    { id: "json", label: "Input JSON" },
    { id: "expression", label: "CEL" },
    { id: "output", label: "Output" },
  ],
  jsonpath: [
    { id: "json", label: "Input JSON" },
    { id: "expression", label: "JSONPath" },
    { id: "output", label: "Output" },
  ],
};

const DEFAULT_JQ_EXPRESSION = ".";

function isMeaningfulExpression(expression?: string): boolean {
  const trimmed = expression?.trim();
  return Boolean(trimmed && trimmed !== DEFAULT_JQ_EXPRESSION);
}

function isContextAvailable(
  id: ContextToggleId,
  jsonSample?: string,
  currentExpression?: string,
  outputSample?: string,
): boolean {
  switch (id) {
    case "json":
      return Boolean(jsonSample?.trim());
    case "expression":
      return isMeaningfulExpression(currentExpression);
    case "output":
      return Boolean(outputSample?.trim());
  }
}

const GenerateExpressionPopover = ({
  tool,
  jsonSample,
  currentExpression,
  outputSample,
  onGenerated,
  trigger,
  onGeneratingChange,
  onStreamChunk,
}: GenerateExpressionPopoverProps) => {
  const toolConfig = GENERATION_TOOLS[tool];
  const contextOptions = CONTEXT_OPTIONS[tool];
  const lwcProvider = getAiProviderClient(LWC_PROVIDER_ID);
  if (!lwcProvider) {
    throw new Error("LWC AI provider is not registered");
  }
  const connection = lwcProvider.useConnection();
  const isReady = connection.status === "ready";
  const isConnectionLoading = connection.status === "loading";
  const { generate, isGenerating } = useGenerateExpression({ tool });

  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [contextToggles, setContextToggles] = useState<ContextToggleId[]>([]);

  useEffect(() => {
    if (isMeaningfulExpression(currentExpression)) {
      setContextToggles((prev) =>
        prev.includes("expression") ? prev : [...prev, "expression"],
      );
    }
  }, [currentExpression]);

  useEffect(() => {
    setContextToggles((prev) =>
      prev.filter((id) =>
        isContextAvailable(id, jsonSample, currentExpression, outputSample),
      ),
    );
  }, [jsonSample, currentExpression, outputSample]);

  useEffect(() => {
    onGeneratingChange?.(isGenerating);
  }, [isGenerating, onGeneratingChange]);

  const buildContext = (): GenerationContext | undefined => {
    const context: GenerationContext = {};

    if (contextToggles.includes("json") && jsonSample?.trim()) {
      context.jsonSample = jsonSample;
    }
    if (
      contextToggles.includes("expression") &&
      isMeaningfulExpression(currentExpression)
    ) {
      context.currentExpression = currentExpression;
    }
    if (contextToggles.includes("output") && outputSample?.trim()) {
      context.outputSample = outputSample;
    }

    if (
      !context.jsonSample &&
      !context.currentExpression &&
      !context.outputSample
    ) {
      return undefined;
    }

    return context;
  };

  const handleSubmit = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error("Enter a prompt describing what you want to generate.");
      return;
    }

    if (!isReady) {
      toast.error("Connect ChatGPT in Settings to use AI generation.");
      return;
    }

    setOpen(false);

    try {
      const result = await generate({
        prompt: trimmedPrompt,
        context: buildContext(),
        onStreamChunk,
      });

      onGenerated(result.expression);
      setPrompt("");
      toast.success(`${toolConfig.label} applied.`);
    } catch (error) {
      setOpen(true);
      if (error instanceof GenerateExpressionError) {
        toast.error(getGenerateExpressionErrorMessage(error));
      } else {
        toast.error("Unable to generate an expression. Please try again.");
      }
    }
  };

  const canSubmit = isReady && !isGenerating && !isConnectionLoading;
  const isMac = navigator.platform.includes("Mac");

  const navigate = useNavigate();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <AnimatedButton
            type="button"
            size="sm"
            className="rounded-full hover:bg-secondary bg-secondary text-secondary-foreground border-border border-2"
            buttonIcon={<Icon icon={AiGenerativeIcon} />}
            errorIcon={null}
            successIcon={null}
            loaderIcon={null}
            onClick={() => true}
            useDefaultInteractionAnimation
          >
            Generate
          </AnimatedButton>
        )}
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="w-96 rounded-2xl p-4"
        sideOffset={8}
      >
        <Arrow className="fill-popover" />
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium">{toolConfig.generateLabel}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Describe what you want in plain language. Your prompt and any
              selected context are sent to ChatGPT.
            </p>
          </div>

          {!isReady && !isConnectionLoading && (
            <Alert className="rounded-xl">
              <AlertDescription className="flex flex-col gap-2">
                <span>Connect ChatGPT in Settings to use AI generation.</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit rounded-full"
                  onClick={() => navigate({ to: "/settings" })}
                >
                  Open Settings
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <InputGroup className="rounded-xl">
            <InputGroupTextarea
              value={prompt}
              placeholder="e.g. extract all user emails"
              rows={4}
              disabled={isGenerating}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  void handleSubmit();
                }
              }}
              className="min-h-[5lh]"
            />
          </InputGroup>

          <p className="-mt-1 text-right text-[10px] leading-none text-muted-foreground/45 pr-2">
            {isMac ? "⌘↵" : "Ctrl+↵"} to generate
          </p>

          <div className="flex flex-col gap-2">
            <FieldLabel className="text-xs font-normal text-muted-foreground">
              Include as context
            </FieldLabel>
            <ToggleGroup
              type="multiple"
              value={contextToggles}
              onValueChange={setContextToggles}
              disabled={isGenerating}
            >
              {contextOptions.map((option) => (
                <ToggleGroupItem
                  key={option.id}
                  value={option.id}
                  disabled={
                    !isContextAvailable(
                      option.id,
                      jsonSample,
                      currentExpression,
                      outputSample,
                    )
                  }
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Button
            type="button"
            size="sm"
            className="w-full rounded-full"
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
          >
            {isGenerating ? (
              <>
                <Spinner />
                Generating
              </>
            ) : (
              <>
                <Icon icon={AiBeautifyIcon} />
                Generate
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GenerateExpressionPopover;

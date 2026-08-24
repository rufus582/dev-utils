import { Arrow } from "@radix-ui/react-popover";
import { useNavigate } from "@tanstack/react-router";
import { motion, Reorder } from "motion/react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Icon } from "#icons/huge-icon";
import { AiBeautifyIcon, AiGenerativeIcon } from "#icons/pages";
import { Alert, AlertDescription } from "#ui/alert";
import { Button } from "#ui/button";
import { Button as AnimatedButton } from "#ui/custom-components/animated-button";
import { FieldLabel } from "#ui/field";
import { InputGroup, InputGroupTextarea } from "#ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover";
import { Spinner } from "#ui/spinner";
import { Toggle } from "#ui/toggle";
import { useChatGPTSession } from "@/hooks/use-chatgpt-session";
import {
  GenerateExpressionError,
  getGenerateExpressionErrorMessage,
  useGenerateExpression,
} from "@/hooks/use-generate-expression";
import {
  GENERATION_TOOLS,
  type GenerationContext,
  type GenerationToolId,
} from "@/lib/chatgpt/generation-tools";

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

type ContextOption = { id: ContextToggleId; label: string };

const CONTEXT_TOGGLE_SPRING = {
  type: "spring" as const,
  bounce: 0.2,
};

const CONTEXT_TOGGLE_GAP = 8;

const CONTEXT_TOGGLE_PILL_RADIUS = 24;

const DEFAULT_JQ_EXPRESSION = ".";

const contextToggleItemClassName =
  "w-full rounded-none text-xs px-2 data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-muted";

function clusterContextToggleOrder(
  options: ContextOption[],
  activeIds: ContextToggleId[],
  isAvailable: (id: ContextToggleId) => boolean,
): ContextToggleId[] {
  const order = options.map((option) => option.id);
  const activeSet = new Set(activeIds);

  const availableActive = activeIds.filter((id) => isAvailable(id));
  const availableInactive = order.filter(
    (id) => isAvailable(id) && !activeSet.has(id),
  );
  const unavailable = order.filter((id) => !isAvailable(id));

  return [...availableActive, ...availableInactive, ...unavailable];
}

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

function getContextToggleMarginLeft(
  index: number,
  displayOrder: ContextToggleId[],
  activeIds: ContextToggleId[],
): number {
  if (index === 0) {
    return 0;
  }

  const id = displayOrder[index];
  const prevId = displayOrder[index - 1];
  const isActive = activeIds.includes(id);
  const prevActive = activeIds.includes(prevId);

  if (isActive && prevActive) {
    return 0;
  }

  return CONTEXT_TOGGLE_GAP;
}

function getContextToggleRadiusAnimation(
  isActive: boolean,
  connectLeft: boolean,
  connectRight: boolean,
) {
  if (!isActive) {
    return {
      borderTopLeftRadius: CONTEXT_TOGGLE_PILL_RADIUS,
      borderTopRightRadius: CONTEXT_TOGGLE_PILL_RADIUS,
      borderBottomLeftRadius: CONTEXT_TOGGLE_PILL_RADIUS,
      borderBottomRightRadius: CONTEXT_TOGGLE_PILL_RADIUS,
      borderLeftWidth: "1px",
    };
  }

  if (connectLeft && connectRight) {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderLeftWidth: "0px",
    };
  }

  if (connectLeft) {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: CONTEXT_TOGGLE_PILL_RADIUS,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: CONTEXT_TOGGLE_PILL_RADIUS,
      borderLeftWidth: "0px",
    };
  }

  if (connectRight) {
    return {
      borderTopLeftRadius: CONTEXT_TOGGLE_PILL_RADIUS,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: CONTEXT_TOGGLE_PILL_RADIUS,
      borderBottomRightRadius: 0,
      borderLeftWidth: "1px",
    };
  }

  return {
    borderTopLeftRadius: CONTEXT_TOGGLE_PILL_RADIUS,
    borderTopRightRadius: CONTEXT_TOGGLE_PILL_RADIUS,
    borderBottomLeftRadius: CONTEXT_TOGGLE_PILL_RADIUS,
    borderBottomRightRadius: CONTEXT_TOGGLE_PILL_RADIUS,
    borderLeftWidth: "1px",
  };
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
  const { isSignedIn, status } = useChatGPTSession();
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

    if (!isSignedIn) {
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

  const isLoadingSession = status === "loading";
  const canSubmit = isSignedIn && !isGenerating && !isLoadingSession;
  const isMac = navigator.platform.includes("Mac");

  const naturalContextOrder = useMemo(
    () => contextOptions.map((option) => option.id),
    [contextOptions],
  );

  const clusteredContextOrder = useMemo(
    () =>
      clusterContextToggleOrder(contextOptions, contextToggles, (id) =>
        isContextAvailable(id, jsonSample, currentExpression, outputSample),
      ),
    [
      contextOptions,
      contextToggles,
      jsonSample,
      currentExpression,
      outputSample,
    ],
  );

  const [displayOrder, setDisplayOrder] =
    useState<ContextToggleId[]>(naturalContextOrder);

  useEffect(() => {
    setDisplayOrder((prev) => {
      const next = clusteredContextOrder;
      return prev.join() === next.join() ? prev : next;
    });
  }, [clusteredContextOrder]);

  const setContextToggle = (id: ContextToggleId, pressed: boolean) => {
    setContextToggles((prev) => {
      if (pressed) {
        return prev.includes(id) ? prev : [...prev, id];
      }
      return prev.filter((item) => item !== id);
    });
  };

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

          {!isSignedIn && !isLoadingSession && (
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
            <Reorder.Group
              as="div"
              axis="x"
              values={displayOrder}
              onReorder={setDisplayOrder}
              className="flex w-full items-stretch"
            >
              {displayOrder.map((id, index) => {
                const option = contextOptions.find((item) => item.id === id);
                if (!option) {
                  return null;
                }

                const isAvailable = isContextAvailable(
                  option.id,
                  jsonSample,
                  currentExpression,
                  outputSample,
                );
                const isActive = contextToggles.includes(id);
                const prevId = displayOrder[index - 1];
                const nextId = displayOrder[index + 1];
                const connectLeft =
                  isActive &&
                  isAvailable &&
                  prevId !== undefined &&
                  contextToggles.includes(prevId) &&
                  isContextAvailable(
                    prevId,
                    jsonSample,
                    currentExpression,
                    outputSample,
                  );
                const connectRight =
                  isActive &&
                  isAvailable &&
                  nextId !== undefined &&
                  contextToggles.includes(nextId) &&
                  isContextAvailable(
                    nextId,
                    jsonSample,
                    currentExpression,
                    outputSample,
                  );

                const toggle = (
                  <Toggle
                    asChild
                    variant="outline"
                    size="sm"
                    pressed={isActive}
                    disabled={!isAvailable || isGenerating}
                    onPressedChange={(pressed) =>
                      setContextToggle(option.id, pressed)
                    }
                  >
                    <motion.button
                      type="button"
                      initial={false}
                      animate={getContextToggleRadiusAnimation(
                        isActive,
                        connectLeft,
                        connectRight,
                      )}
                      transition={CONTEXT_TOGGLE_SPRING}
                      className={contextToggleItemClassName}
                    >
                      {option.label}
                    </motion.button>
                  </Toggle>
                );

                return (
                  <Reorder.Item
                    key={id}
                    value={id}
                    as="div"
                    dragListener={false}
                    transition={CONTEXT_TOGGLE_SPRING}
                    className="flex min-w-0 flex-1 list-none"
                    style={{
                      marginLeft: getContextToggleMarginLeft(
                        index,
                        displayOrder,
                        contextToggles,
                      ),
                    }}
                  >
                    {toggle}
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
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

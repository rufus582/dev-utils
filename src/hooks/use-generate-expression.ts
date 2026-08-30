import { useCallback, useState } from "react";
import {
  GENERATION_TOOLS,
  type GenerationContext,
  type GenerationToolId,
  sanitizeGeneratedExpression,
} from "@/lib/ai/generation-tools";
import { LWC_PROVIDER_ID } from "@/lib/ai/providers/ids";
import { settingsOps } from "@/store/indexed-db/settings";

export type GenerateExpressionErrorCode =
  | "not_authenticated"
  | "invalid_tool"
  | "prompt_required"
  | "invalid_json"
  | "invalid_expression"
  | "model_not_allowed"
  | "models_unavailable"
  | "rate_limited"
  | "generation_failed"
  | "network_error"
  | "unknown";

export class GenerateExpressionError extends Error {
  readonly code: GenerateExpressionErrorCode;
  readonly status: number;
  readonly retryAfterSeconds?: number;

  constructor(
    code: GenerateExpressionErrorCode,
    status: number,
    message?: string,
    retryAfterSeconds?: number,
  ) {
    super(message ?? code);
    this.name = "GenerateExpressionError";
    this.code = code;
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

type GenerateExpressionInput = {
  prompt: string;
  context?: GenerationContext;
  onStreamChunk?: (partial: string) => void;
};

type UseGenerateExpressionOptions = {
  tool: GenerationToolId;
};

type GenerateExpressionResult = {
  expression: string;
};

async function parseGenerateError(
  response: Response,
): Promise<GenerateExpressionError> {
  const retryAfter = response.headers.get("retry-after");
  const retryAfterSeconds = retryAfter
    ? Number.parseInt(retryAfter, 10)
    : undefined;

  let code: GenerateExpressionErrorCode = "unknown";
  try {
    const body = (await response.json()) as { error?: string };
    if (body.error === "not_authenticated") code = "not_authenticated";
    else if (body.error === "invalid_tool") code = "invalid_tool";
    else if (body.error === "prompt_required") code = "prompt_required";
    else if (body.error === "invalid_json") code = "invalid_json";
    else if (body.error === "invalid_expression") code = "invalid_expression";
    else if (body.error === "models_unavailable") code = "models_unavailable";
    else if (body.error === "generation_failed") code = "generation_failed";
    else if (body.error === "model_not_allowed") code = "model_not_allowed";
    else if (body.error === "rate_limited") code = "rate_limited";
  } catch {
    if (response.status === 401) code = "not_authenticated";
    else if (response.status === 403) code = "model_not_allowed";
    else if (response.status === 429) code = "rate_limited";
  }

  return new GenerateExpressionError(
    code,
    response.status,
    undefined,
    Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : undefined,
  );
}

async function readTextStream(
  response: Response,
  onStreamChunk?: (partial: string) => void,
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new GenerateExpressionError("generation_failed", 500);
  }

  const decoder = new TextDecoder();
  let raw = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    raw += decoder.decode(value, { stream: true });
    onStreamChunk?.(raw);
  }

  raw += decoder.decode();
  onStreamChunk?.(raw);

  return raw;
}

export function getGenerateExpressionErrorMessage(
  error: GenerateExpressionError,
): string {
  switch (error.code) {
    case "not_authenticated":
      return "Connect ChatGPT in Settings to use AI generation.";
    case "model_not_allowed":
      return "This model is not allowed for your account.";
    case "rate_limited":
      return error.retryAfterSeconds
        ? `Rate limited. Try again in ${error.retryAfterSeconds}s.`
        : "Rate limited. Please try again shortly.";
    case "invalid_expression":
      return "ChatGPT returned an invalid expression. Try rephrasing your prompt.";
    case "models_unavailable":
      return "No ChatGPT models are available for your account.";
    case "prompt_required":
      return "Enter a prompt describing what you want to generate.";
    default:
      return "Unable to generate an expression. Please try again.";
  }
}

export function useGenerateExpression({ tool }: UseGenerateExpressionOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<GenerateExpressionError | null>(null);
  const toolConfig = GENERATION_TOOLS[tool];

  const generate = useCallback(
    async (
      input: GenerateExpressionInput,
    ): Promise<GenerateExpressionResult> => {
      setIsGenerating(true);
      setError(null);

      try {
        const settings = await settingsOps.get();
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tool,
            prompt: input.prompt,
            context: input.context,
            providerId: settings.aiProviderId ?? LWC_PROVIDER_ID,
            model: settings.aiModelId,
          }),
        });

        if (!response.ok) {
          const parsedError = await parseGenerateError(response);
          setError(parsedError);
          throw parsedError;
        }

        const raw = await readTextStream(response, input.onStreamChunk);
        const expression = sanitizeGeneratedExpression(raw, tool);

        if (!toolConfig.validate(expression)) {
          const parsedError = new GenerateExpressionError(
            "invalid_expression",
            422,
          );
          setError(parsedError);
          throw parsedError;
        }

        input.onStreamChunk?.(expression);
        return { expression };
      } catch (caught) {
        if (caught instanceof GenerateExpressionError) {
          throw caught;
        }

        const networkError = new GenerateExpressionError(
          "network_error",
          0,
          caught instanceof Error ? caught.message : "Network error",
        );
        setError(networkError);
        throw networkError;
      } finally {
        setIsGenerating(false);
      }
    },
    [tool, toolConfig],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    generate,
    isGenerating,
    error,
    reset,
  };
}

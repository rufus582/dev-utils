import { createChatGPTProxyProvider } from "@opencoredev/loginwithchatgpt-ai";
import { createFileRoute } from "@tanstack/react-router";
import { createTextStreamResponse, streamText, toTextStream } from "ai";
import { chatgptAuth } from "@/lib/chatgpt/auth";
import {
  buildGenerationUserContent,
  GENERATION_TOOLS,
  isGenerationToolId,
} from "@/lib/chatgpt/generation-tools";

type GenerateExpressionRequest = {
  tool?: string;
  prompt?: string;
  context?: {
    jsonSample?: string;
    currentExpression?: string;
    outputSample?: string;
  };
};

function pickModel(
  availableModels: string[] | undefined,
  allowedModels: readonly string[],
): string | undefined {
  if (!availableModels?.length) {
    return undefined;
  }

  for (const model of allowedModels) {
    if (availableModels.includes(model)) {
      return model;
    }
  }

  return availableModels[0];
}

export const Route = createFileRoute("/api/ai/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: GenerateExpressionRequest;
        try {
          body = (await request.json()) as GenerateExpressionRequest;
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }

        const { tool, prompt, context } = body;

        if (!tool || !isGenerationToolId(tool)) {
          return Response.json({ error: "invalid_tool" }, { status: 400 });
        }

        if (!prompt?.trim()) {
          return Response.json({ error: "prompt_required" }, { status: 400 });
        }

        const session = await chatgptAuth.getSession(request);
        if (session.status !== "authenticated") {
          return Response.json({ error: "not_authenticated" }, { status: 401 });
        }

        const toolConfig = GENERATION_TOOLS[tool];
        const availableModels = await chatgptAuth.getModels(request);
        const allowedModels = ["gpt-5.5", "gpt-5.4", "gpt-5.4-mini"] as const;
        const model = pickModel(availableModels, allowedModels);

        if (!model) {
          return Response.json({ error: "models_unavailable" }, { status: 503 });
        }

        const chatgpt = createChatGPTProxyProvider({
          fetch: chatgptAuth.proxyFetch(request),
        });

        try {
          const result = streamText({
            model: chatgpt(model),
            system: toolConfig.systemPrompt,
            prompt: buildGenerationUserContent(prompt, context),
          });

          return createTextStreamResponse({
            stream: toTextStream({ stream: result.stream }),
          });
        } catch (error) {
          console.error("[api/ai/generate]", error);
          return Response.json({ error: "generation_failed" }, { status: 500 });
        }
      },
    },
  },
});

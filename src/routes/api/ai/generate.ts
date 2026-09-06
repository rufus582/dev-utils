import { createFileRoute } from "@tanstack/react-router";
import { createTextStreamResponse, streamText, toTextStream } from "ai";
import {
  buildGenerationUserContent,
  GENERATION_TOOLS,
  isGenerationToolId,
} from "#/ai/generation-tools";
import { LWC_PROVIDER_ID } from "#/ai/providers/ids";
import { pickPreferredLwcModel } from "#/ai/providers/lwc/lib/lwc.server";
import { getAiProviderServer } from "#/ai/providers/registry.server";

type GenerateExpressionRequest = {
  tool?: string;
  prompt?: string;
  providerId?: string;
  model?: string;
  context?: {
    jsonSample?: string;
    currentExpression?: string;
    outputSample?: string;
  };
};

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

        const { tool, prompt, context, model: requestedModel } = body;
        const providerId = body.providerId?.trim() || LWC_PROVIDER_ID;

        if (!tool || !isGenerationToolId(tool)) {
          return Response.json({ error: "invalid_tool" }, { status: 400 });
        }

        if (!prompt?.trim()) {
          return Response.json({ error: "prompt_required" }, { status: 400 });
        }

        const provider = getAiProviderServer(providerId);
        if (!provider) {
          return Response.json({ error: "unknown_provider" }, { status: 400 });
        }

        if (!(await provider.isReady(request))) {
          return Response.json({ error: "not_authenticated" }, { status: 401 });
        }

        const availableModels = await provider.listModels(request);
        if (!availableModels.length) {
          return Response.json(
            { error: "models_unavailable" },
            { status: 503 },
          );
        }

        let selected = requestedModel?.trim()
          ? availableModels.find((entry) => entry.id === requestedModel.trim())
          : undefined;

        if (requestedModel?.trim() && !selected) {
          return Response.json({ error: "model_not_allowed" }, { status: 403 });
        }

        if (!selected) {
          selected =
            provider.id === LWC_PROVIDER_ID
              ? pickPreferredLwcModel(availableModels)
              : availableModels[0];
        }

        if (!selected) {
          return Response.json(
            { error: "models_unavailable" },
            { status: 503 },
          );
        }

        const toolConfig = GENERATION_TOOLS[tool];

        try {
          const model = await provider.getModel(request, selected.id);
          const result = streamText({
            model,
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

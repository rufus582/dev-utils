import { createFileRoute } from "@tanstack/react-router";
import {
  getAiProviderServer,
  listAiProvidersServer,
} from "@/lib/ai/providers/registry.server";
import type {
  AiModelsResponse,
  AiProviderServer,
} from "@/lib/ai/providers/types";

export const Route = createFileRoute("/api/ai/models")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const providerIdParam = url.searchParams.get("providerId")?.trim();

        const providers = providerIdParam
          ? (() => {
              const provider = getAiProviderServer(providerIdParam);
              return provider ? [provider] : [];
            })()
          : listAiProvidersServer();

        if (providerIdParam && providers.length === 0) {
          return Response.json({ error: "unknown_provider" }, { status: 400 });
        }

        // Match generate auth posture: catalog requires a ready provider.
        const readyProviders: AiProviderServer[] = [];
        for (const provider of providers) {
          if (await provider.isReady(request)) {
            readyProviders.push(provider);
          }
        }

        if (readyProviders.length === 0) {
          return Response.json({ error: "not_authenticated" }, { status: 401 });
        }

        const body: AiModelsResponse = {
          providers: await Promise.all(
            readyProviders.map(async (provider) => ({
              id: provider.id,
              label: provider.label,
              kind: provider.kind,
              models: await provider.listModels(request),
            })),
          ),
        };

        return Response.json(body);
      },
    },
  },
});

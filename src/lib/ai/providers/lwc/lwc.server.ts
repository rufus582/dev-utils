import { createChatGPTProxyProvider } from "@opencoredev/loginwithchatgpt-ai";
import type { createChatGPTHandler } from "@opencoredev/loginwithchatgpt-server";
import { LWC_PROVIDER_ID } from "@/lib/ai/providers/ids";
import type { AiProviderServer, ProviderModel } from "@/lib/ai/providers/types";

type ChatGPTAuth = ReturnType<typeof createChatGPTHandler>;

const PREFERRED_MODELS = ["gpt-5.5", "gpt-5.4", "gpt-5.4-mini"] as const;

function formatModelLabel(slug: string): string {
  return slug
    .split("-")
    .map((part) => {
      if (/^\d/.test(part)) {
        return part.toUpperCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("-")
    .replace(/^(Gpt)/, "GPT");
}

export function createLwcServerProvider(deps: {
  auth: ChatGPTAuth;
}): AiProviderServer {
  const { auth } = deps;

  return {
    id: LWC_PROVIDER_ID,
    label: "ChatGPT",
    kind: "oauth-session",

    async isReady(request) {
      const session = await auth.getSession(request);
      return session.status === "authenticated";
    },

    async listModels(request): Promise<ProviderModel[]> {
      const slugs = await auth.getModels(request);
      if (!slugs?.length) {
        return [];
      }

      return slugs.map((id) => ({
        id,
        providerId: LWC_PROVIDER_ID,
        label: formatModelLabel(id),
      }));
    },

    async getModel(request, modelId) {
      const chatgpt = createChatGPTProxyProvider({
        fetch: auth.proxyFetch(request),
      });
      return chatgpt(modelId);
    },
  };
}

/** Prefer known capable models, else first available. */
export function pickPreferredLwcModel(
  models: ProviderModel[],
): ProviderModel | undefined {
  if (!models.length) {
    return undefined;
  }

  for (const preferred of PREFERRED_MODELS) {
    const match = models.find((model) => model.id === preferred);
    if (match) {
      return match;
    }
  }

  return models[0];
}

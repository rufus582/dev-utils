import { createChatGPTProxyProvider } from "@opencoredev/loginwithchatgpt-ai";
import type { createChatGPTHandler } from "@opencoredev/loginwithchatgpt-server";
import { LWC_PROVIDER_ID } from "#/ai/providers/ids";
import type { AiProviderServer, ProviderModel } from "#/ai/providers/types";
import { withCodexModelsCapture } from "../lib/auth";
import { parseCodexModelCatalog, selectCodexPickerModels } from "../lib/models";

type ChatGPTAuth = ReturnType<typeof createChatGPTHandler>;

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
      const { result: slugs, catalog } = await withCodexModelsCapture(() =>
        auth.getModels(request),
      );
      if (!slugs?.length) {
        return [];
      }

      const picker = selectCodexPickerModels(parseCodexModelCatalog(catalog));
      const models = picker.length
        ? picker
        : slugs.map((slug) => ({ slug, displayName: undefined }));

      return models.map((model) => ({
        id: model.slug,
        providerId: LWC_PROVIDER_ID,
        label: model.displayName ?? formatModelLabel(model.slug),
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

import { LWC_PROVIDER_ID } from "#/ai/providers/ids";
import { createLwcServerProvider } from "#/ai/providers/lwc/lib/lwc.server";
import type { AiProviderServer, ProviderId } from "#/ai/providers/types";
import { chatgptAuth } from "@/lib/chatgpt/auth";

const providers: AiProviderServer[] = [
  createLwcServerProvider({ auth: chatgptAuth }),
];

export function listAiProvidersServer(): AiProviderServer[] {
  return [...providers];
}

export function getAiProviderServer(
  id: ProviderId = LWC_PROVIDER_ID,
): AiProviderServer | undefined {
  return providers.find((provider) => provider.id === id);
}

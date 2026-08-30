import { LWC_PROVIDER_ID } from "@/lib/ai/providers/ids";
import { createLwcServerProvider } from "@/lib/ai/providers/lwc/lwc.server";
import type { AiProviderServer, ProviderId } from "@/lib/ai/providers/types";
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

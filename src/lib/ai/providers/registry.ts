import { LWC_PROVIDER_ID } from "@/lib/ai/providers/ids";
import { createLwcClientProvider } from "@/lib/ai/providers/lwc/lwc";
import type { AiProviderClient, ProviderId } from "@/lib/ai/providers/types";

const providers: AiProviderClient[] = [createLwcClientProvider()];

export function listAiProvidersClient(): AiProviderClient[] {
  return [...providers];
}

export function getAiProviderClient(
  id: ProviderId = LWC_PROVIDER_ID,
): AiProviderClient | undefined {
  return providers.find((provider) => provider.id === id);
}

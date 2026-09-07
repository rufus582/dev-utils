import { LWC_PROVIDER_ID } from "#/ai/providers/ids";
import { createLwcClientProvider } from "#/ai/providers/lwc/adapter/lwc";
import type { AiProviderClient, ProviderId } from "#/ai/providers/types";

const providers: AiProviderClient[] = [createLwcClientProvider()];

export function listAiProvidersClient(): AiProviderClient[] {
  return [...providers];
}

export function getAiProviderClient(
  id: ProviderId = LWC_PROVIDER_ID,
): AiProviderClient | undefined {
  return providers.find((provider) => provider.id === id);
}

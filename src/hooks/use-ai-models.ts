import { useEffect, useState } from "react";
import { LWC_PROVIDER_ID } from "#/ai/providers/ids";
import type {
  AiModelsResponse,
  ProviderId,
  ProviderModel,
} from "#/ai/providers/types";

type UseAiModelsOptions = {
  enabled?: boolean;
  providerId?: ProviderId;
};

type UseAiModelsResult = {
  models: ProviderModel[];
  isLoading: boolean;
  error: string | null;
};

export function useAiModels({
  enabled = true,
  providerId = LWC_PROVIDER_ID,
}: UseAiModelsOptions = {}): UseAiModelsResult {
  const [models, setModels] = useState<ProviderModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setModels([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL("/api/ai/models", window.location.origin);
        if (providerId) {
          url.searchParams.set("providerId", providerId);
        }

        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401) {
            setModels([]);
            setError(null);
            return;
          }
          setModels([]);
          setError("Unable to load models.");
          return;
        }

        const body = (await response.json()) as AiModelsResponse;
        const provider = body.providers.find(
          (entry) => entry.id === providerId,
        );
        setModels(provider?.models ?? []);
      } catch (caught) {
        if (controller.signal.aborted) {
          return;
        }
        setModels([]);
        setError(
          caught instanceof Error ? caught.message : "Unable to load models.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [enabled, providerId]);

  return {
    models,
    isLoading,
    error,
  };
}

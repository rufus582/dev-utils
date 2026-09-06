import type { LanguageModel } from "ai";
import type { ComponentType } from "react";

export type ProviderId = string;

export type ProviderKind = "oauth-session" | "api-key";

export type ProviderModel = {
  id: string;
  providerId: ProviderId;
  label?: string;
};

export type ConnectionStatus = "loading" | "disconnected" | "ready" | "error";

export type ConnectionState = {
  status: ConnectionStatus;
  label?: string;
  errorMessage?: string;
  disconnect: () => Promise<void>;
};

export type AiProviderMeta = {
  id: ProviderId;
  label: string;
  kind: ProviderKind;
};

export type AiProviderAuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type AiProviderClient = AiProviderMeta & {
  useConnection: () => ConnectionState;
  SettingsEntry: ComponentType;
  AuthDialog?: ComponentType<AiProviderAuthDialogProps>;
};

export type AiProviderServer = AiProviderMeta & {
  isReady: (request: Request) => Promise<boolean>;
  listModels: (request: Request) => Promise<ProviderModel[]>;
  getModel: (request: Request, modelId: string) => Promise<LanguageModel>;
};

export type AiModelsProviderResponse = AiProviderMeta & {
  models: ProviderModel[];
};

export type AiModelsResponse = {
  providers: AiModelsProviderResponse[];
};

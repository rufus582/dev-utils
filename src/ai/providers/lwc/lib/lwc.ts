import { LWC_PROVIDER_ID } from "#/ai/providers/ids";
import LWCDialog from "#/ai/providers/lwc/components/lwc-dialog";
import LWCSettings from "#/ai/providers/lwc/components/lwc-settings";
import { useLwcConnection } from "#/ai/providers/lwc/lib/use-lwc-connection";
import type { AiProviderClient } from "#/ai/providers/types";

export function createLwcClientProvider(): AiProviderClient {
  return {
    id: LWC_PROVIDER_ID,
    label: "ChatGPT",
    kind: "oauth-session",
    useConnection: useLwcConnection,
    SettingsEntry: LWCSettings,
    AuthDialog: LWCDialog,
  };
}

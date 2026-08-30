import LoginWithChatGPTDialog from "@/components/chatgpt/login-with-chatgpt-dialog";
import LoginWithChatGPTSettings from "@/components/chatgpt/login-with-chatgpt-settings";
import { LWC_PROVIDER_ID } from "@/lib/ai/providers/ids";
import { useLwcConnection } from "@/lib/ai/providers/lwc/use-lwc-connection";
import type { AiProviderClient } from "@/lib/ai/providers/types";

export function createLwcClientProvider(): AiProviderClient {
  return {
    id: LWC_PROVIDER_ID,
    label: "ChatGPT",
    kind: "oauth-session",
    useConnection: useLwcConnection,
    SettingsEntry: LoginWithChatGPTSettings,
    AuthDialog: LoginWithChatGPTDialog,
  };
}

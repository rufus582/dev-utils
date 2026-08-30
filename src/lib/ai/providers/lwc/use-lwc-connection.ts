import { useChatGPTSession } from "@/hooks/use-chatgpt-session";
import type { ConnectionState } from "@/lib/ai/providers/types";

export function useLwcConnection(): ConnectionState {
  const session = useChatGPTSession();

  if (session.status === "loading") {
    return {
      status: "loading",
      disconnect: async () => {
        await session.logout();
      },
    };
  }

  if (session.status === "error") {
    return {
      status: "error",
      errorMessage: "Unable to check ChatGPT connection.",
      disconnect: async () => {
        await session.logout();
      },
    };
  }

  if (session.isSignedIn) {
    return {
      status: "ready",
      label: session.user?.plan
        ? `${session.user.plan.normalize().toUpperCase()} Subscription`
        : "Connected",
      disconnect: async () => {
        await session.logout();
      },
    };
  }

  return {
    status: "disconnected",
    disconnect: async () => {
      await session.logout();
    },
  };
}

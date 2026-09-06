import { useChatGPTAuth } from "#/ai/providers/lwc/components/auth-provider";

export function useChatGPTSession() {
  const session = useChatGPTAuth();

  return {
    ...session,
    isSignedIn: session.isAuthenticated,
  };
}

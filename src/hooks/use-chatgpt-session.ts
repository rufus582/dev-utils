import { useChatGPTAuth } from "@/components/chatgpt/chatgpt-auth-provider";

export function useChatGPTSession() {
  const session = useChatGPTAuth();

  return {
    ...session,
    isSignedIn: session.isAuthenticated,
  };
}

import {
  type UseLoginWithChatGPTResult,
  useLoginWithChatGPT,
} from "@opencoredev/loginwithchatgpt-react";
import { createContext, type ReactNode, useContext } from "react";
import { toast } from "sonner";

const ChatGPTAuthContext = createContext<UseLoginWithChatGPTResult | null>(
  null,
);

export function ChatGPTAuthProvider({ children }: { children: ReactNode }) {
  const session = useLoginWithChatGPT({
    // Keep focus in-app during login so the device code can be auto-copied.
    // The dialog opens the verification page after login completes.
    openPopup: false,
    onAuthenticated: () => {
      toast.success("Connected to ChatGPT.");
    },
  });

  return (
    <ChatGPTAuthContext.Provider value={session}>
      {children}
    </ChatGPTAuthContext.Provider>
  );
}

export function useChatGPTAuth(): UseLoginWithChatGPTResult {
  const context = useContext(ChatGPTAuthContext);
  if (!context) {
    throw new Error("useChatGPTAuth must be used within ChatGPTAuthProvider");
  }
  return context;
}

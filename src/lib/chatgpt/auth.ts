import { createChatGPTHandler } from "@opencoredev/loginwithchatgpt-server";

const secret = process.env.LWC_SECRET;

if (!secret && process.env.NODE_ENV === "production") {
  throw new Error(
    "LWC_SECRET is required in production for Login with ChatGPT.",
  );
}

/**
 * Dev uses an in-memory session store by default. For production on Vercel,
 * configure a shared `sessionStore` (e.g. Redis/Upstash) so sessions survive
 * cold starts and scale across instances.
 */
export const chatgptAuth = createChatGPTHandler({
  secret,
  responsesProxy: {
    allowedModels: ["gpt-5.5", "gpt-5.4", "gpt-5.4-mini"],
  },
});

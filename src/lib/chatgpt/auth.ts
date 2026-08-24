import {
  createChatGPTHandler,
  type RateLimitBucket,
  type StoredSession,
} from "@opencoredev/loginwithchatgpt-server";
import {
  createUpstashKeyValueStore,
  createUpstashRedisClient,
} from "@/lib/chatgpt/upstash-key-value-store";

const secret = process.env.LWC_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (!secret && isProduction) {
  throw new Error(
    "LWC_SECRET is required in production for Login with ChatGPT.",
  );
}

const redis = createUpstashRedisClient();

if (isProduction && !redis) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production for Login with ChatGPT session persistence.",
  );
}

if (!redis && !isProduction) {
  console.warn(
    "[login-with-chatgpt] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set. Using in-memory sessions (lost on server restart).",
  );
}

const sessionStore = redis
  ? createUpstashKeyValueStore<StoredSession>(redis, "dev-utils:lwc:session")
  : undefined;

const rateLimitStore = redis
  ? createUpstashKeyValueStore<RateLimitBucket>(redis, "dev-utils:lwc:rate")
  : undefined;

export const chatgptAuth = createChatGPTHandler({
  secret,
  sessionStore,
  responsesProxy: {
    allowedModels: ["gpt-5.5", "gpt-5.4", "gpt-5.4-mini"],
    rateLimit: rateLimitStore ? { store: rateLimitStore } : undefined,
  },
});

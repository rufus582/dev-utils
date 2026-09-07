import { AsyncLocalStorage } from "node:async_hooks";
import {
	createChatGPTHandler,
	type RateLimitBucket,
	type StoredSession,
} from "@opencoredev/loginwithchatgpt-server";
import {
	createUpstashKeyValueStore,
	createUpstashRedisClient,
} from "./upstash-key-value-store";

type CodexModelsCapture = {
	raw?: unknown;
};

const codexModelsCapture = new AsyncLocalStorage<CodexModelsCapture>();

function requestUrl(input: Parameters<typeof fetch>[0]): string {
	if (typeof input === "string") {
		return input;
	}
	if (input instanceof URL) {
		return input.toString();
	}
	if (input instanceof Request) {
		return input.url;
	}
	return String(input);
}

function isCodexModelsUrl(url: string): boolean {
	try {
		return new URL(url).pathname.includes("/backend-api/codex/models");
	} catch {
		return url.includes("/backend-api/codex/models");
	}
}

async function capturedFetch(
	input: Parameters<typeof fetch>[0],
	init?: Parameters<typeof fetch>[1],
): Promise<Response> {
	const response = await globalThis.fetch(input, init);
	const capture = codexModelsCapture.getStore();
	if (!capture || !response.ok || !isCodexModelsUrl(requestUrl(input))) {
		return response;
	}

	try {
		capture.raw = await response.clone().json();
	} catch {
		// Keep the original response; listModels will fall back to slugs.
	}

	return response;
}

/** Run `fn` while capturing the raw Codex `/models` JSON from the same request. */
export function withCodexModelsCapture<T>(
	fn: () => Promise<T>,
): Promise<{ result: T; catalog: unknown }> {
	const capture: CodexModelsCapture = {};
	return codexModelsCapture.run(capture, async () => {
		const result = await fn();
		return { result, catalog: capture.raw };
	});
}

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
	fetch: capturedFetch,
	// Codex gates /models on this. The SDK default (0.142.5) still advertises
	// retired GPT-5.5 / 5.4 slugs and omits the current GPT-5.6 family.
	clientVersion: process.env.LWC_CLIENT_VERSION ?? "0.153.2",
	responsesProxy: {
		rateLimit: rateLimitStore ? { store: rateLimitStore } : undefined,
	},
});

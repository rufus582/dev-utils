export type CodexCatalogModel = {
	slug: string;
	displayName?: string;
	priority: number;
	visibility: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function catalogLists(value: unknown): unknown[][] {
	if (Array.isArray(value)) {
		return [value];
	}
	if (!isRecord(value)) {
		return [];
	}
	return [value.models, value.data, value.items, value.available_models].filter(
		(entry): entry is unknown[] => Array.isArray(entry),
	);
}

function readSlug(item: unknown): string | undefined {
	if (typeof item === "string") {
		return item.trim() || undefined;
	}
	if (!isRecord(item)) {
		return undefined;
	}
	const candidate = item.slug ?? item.id ?? item.model;
	return typeof candidate === "string" && candidate.trim()
		? candidate.trim()
		: undefined;
}

function readDisplayName(item: unknown): string | undefined {
	if (!isRecord(item)) {
		return undefined;
	}
	const candidate = item.display_name ?? item.displayName ?? item.title;
	return typeof candidate === "string" && candidate.trim()
		? candidate.trim()
		: undefined;
}

function readVisibility(item: unknown): string {
	if (!isRecord(item)) {
		return "list";
	}
	const candidate = item.visibility;
	return typeof candidate === "string" && candidate.trim()
		? candidate.trim().toLowerCase()
		: "list";
}

function readPriority(item: unknown): number {
	if (!isRecord(item)) {
		return 0;
	}
	return typeof item.priority === "number" ? item.priority : 0;
}

/** Parse Codex `/models` JSON. Unknown shapes are ignored. */
export function parseCodexModelCatalog(value: unknown): CodexCatalogModel[] {
	const seen = new Set<string>();
	const models: CodexCatalogModel[] = [];

	for (const list of catalogLists(value)) {
		for (const item of list) {
			const slug = readSlug(item);
			if (!slug || seen.has(slug)) {
				continue;
			}
			seen.add(slug);
			models.push({
				slug,
				displayName: readDisplayName(item),
				priority: readPriority(item),
				visibility: readVisibility(item),
			});
		}
	}

	return models;
}

function isInternalCodexSlug(slug: string): boolean {
	return slug === "gpt-reserve" || slug.startsWith("codex-auto-");
}

function isCurrentCodexFamily(slug: string): boolean {
	return /^(gpt-5\.(?:[6-9]|\d{2,})|gpt-(?:[6-9]|\d{2,}))\b/.test(slug);
}

function isPreviousCodexFamily(slug: string): boolean {
	return /^(gpt-5(?:\.[0-5])?)\b/.test(slug) && !isCurrentCodexFamily(slug);
}

/**
 * Codex CLI picker rules: `visibility: list` only, plus drop internal
 * reviewer/reserve rows. When a current family (GPT-5.6+) is present, also
 * drop previous-gen slugs that OpenAI still ships for old clients but often
 * 404 on ChatGPT-authenticated `/responses`.
 */
export function selectCodexPickerModels(
	models: CodexCatalogModel[],
): CodexCatalogModel[] {
	const listed = models.filter(
		(model) => model.visibility === "list" && !isInternalCodexSlug(model.slug),
	);
	const hasCurrentFamily = listed.some((model) =>
		isCurrentCodexFamily(model.slug),
	);
	const picker = hasCurrentFamily
		? listed.filter((model) => !isPreviousCodexFamily(model.slug))
		: listed;

	return [...picker].sort((a, b) => a.priority - b.priority);
}

export const GENERATION_TOOL_IDS = [
  "jq",
  "jmespath",
  "cel",
  "jsonpath",
] as const;

export type GenerationToolId = (typeof GENERATION_TOOL_IDS)[number];

export const JSON_SAMPLE_MAX_BYTES = 16_384;

export const GENERATION_TOOLS = {
  jq: {
    label: "JQ filter",
    generateLabel: "Generate JQ filter",
    systemPrompt: `You are a jq expert. Given a natural-language request and optional JSON input, return ONLY a valid jq filter. Multi-line pipelines are fine. Indent nested or multi-line filters with tabs where it improves readability. No markdown, no code fences, no labels, and no explanation.`,
    validate: (value: string) => value.trim().length > 0,
  },
  jmespath: {
    label: "JMESPath expression",
    generateLabel: "Generate JMESPath expression",
    systemPrompt: `You are a JMESPath expert. Given a natural-language request and optional JSON input, return ONLY a valid JMESPath expression. No markdown, no explanation, no code fences.`,
    validate: (value: string) => value.trim().length > 0,
  },
  cel: {
    label: "CEL expression",
    generateLabel: "Generate CEL expression",
    systemPrompt: `You are a CEL (Common Expression Language) expert. Given a natural-language request and optional JSON input, return ONLY a valid CEL expression. No markdown, no explanation, no code fences.`,
    validate: (value: string) => value.trim().length > 0,
  },
  jsonpath: {
    label: "JSONPath expression",
    generateLabel: "Generate JSONPath expression",
    systemPrompt: `You are a JSONPath expert. Given a natural-language request and optional JSON input, return ONLY a valid JSONPath expression. No markdown, no explanation, no code fences.`,
    validate: (value: string) => value.trim().length > 0,
  },
} as const satisfies Record<
  GenerationToolId,
  {
    label: string;
    generateLabel: string;
    systemPrompt: string;
    validate: (value: string) => boolean;
  }
>;

export function isGenerationToolId(value: string): value is GenerationToolId {
  return GENERATION_TOOL_IDS.includes(value as GenerationToolId);
}

function extractFencedCodeBlock(text: string): string {
  const trimmed = text.trim();

  const fullFence = trimmed.match(/^```(?:[\w-]+)?\s*\n([\s\S]*?)\n?```\s*$/i);
  if (fullFence) {
    return fullFence[1].trim();
  }

  const embeddedFence = trimmed.match(/```(?:[\w-]+)?\s*\n([\s\S]*?)\n?```/i);
  if (embeddedFence) {
    return embeddedFence[1].trim();
  }

  return trimmed
    .replace(/^```(?:[\w-]+)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
}

function unwrapQuotedString(text: string): string {
  const trimmed = text.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") &&
      trimmed.endsWith("`") &&
      !trimmed.includes("\n"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function stripLabelPrefix(text: string): string {
  const labelMatch = text.match(
    /^(?:here(?:'s| is)?\s+(?:the\s+)?(?:(?:jq|jmespath|cel|jsonpath)\s+)?(?:filter|expression)?:?\s*|(?:(?:jq|jmespath|cel|jsonpath)\s+)?(?:filter|expression):\s*)/i,
  );
  if (labelMatch && text.length > labelMatch[0].length) {
    return text.slice(labelMatch[0].length).trim();
  }
  return text;
}

const PROSE_LINE_PREFIX =
  /^(?:here(?:'s| is)?|the |this |use |note:?|output:?|filter:?|expression:?|i |you |we )/i;

function looksLikeProseLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) {
    return true;
  }
  if (PROSE_LINE_PREFIX.test(trimmed)) {
    return true;
  }
  if (
    /^[A-Za-z][^|{[.".]*[.!?]$/.test(trimmed) &&
    !trimmed.includes("|") &&
    !trimmed.startsWith(".") &&
    !trimmed.startsWith("[") &&
    !trimmed.startsWith("{")
  ) {
    return true;
  }
  return false;
}

function sanitizeJqExpression(text: string): string {
  let result = stripLabelPrefix(text);
  result = unwrapQuotedString(result);

  if (!result.includes("\n")) {
    return result.replace(/\s+/g, " ").trim();
  }

  const lines = result
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);

  const nonProseLines = lines.filter(
    (line) => !looksLikeProseLine(line.trim()),
  );

  if (nonProseLines.length > 0) {
    return nonProseLines.join("\n");
  }

  return lines.join("\n");
}

function sanitizeGenericExpression(text: string): string {
  let result = stripLabelPrefix(text);
  result = unwrapQuotedString(result);
  return result.trim();
}

export function sanitizeGeneratedExpression(
  raw: string,
  tool?: GenerationToolId,
): string {
  const unfenced = extractFencedCodeBlock(raw);

  if (tool === "jq") {
    return sanitizeJqExpression(unfenced);
  }

  return sanitizeGenericExpression(unfenced);
}

export function truncateJsonSample(jsonSample: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(jsonSample).length <= JSON_SAMPLE_MAX_BYTES) {
    return jsonSample;
  }

  let truncated = jsonSample;
  while (
    truncated.length > 0 &&
    encoder.encode(truncated).length > JSON_SAMPLE_MAX_BYTES
  ) {
    truncated = truncated.slice(0, Math.floor(truncated.length * 0.9));
  }

  return `${truncated}\n…`;
}

export type GenerationContext = {
  jsonSample?: string;
  currentExpression?: string;
  outputSample?: string;
};

export function buildGenerationUserContent(
  prompt: string,
  context?: GenerationContext,
): string {
  const trimmedPrompt = prompt.trim();
  const sections: string[] = [];

  if (context?.jsonSample?.trim()) {
    sections.push(
      `Input JSON:\n${truncateJsonSample(context.jsonSample.trim())}`,
    );
  }
  if (context?.currentExpression?.trim()) {
    sections.push(
      `Current expression:\n${truncateJsonSample(context.currentExpression.trim())}`,
    );
  }
  if (context?.outputSample?.trim()) {
    sections.push(
      `Current output:\n${truncateJsonSample(context.outputSample.trim())}`,
    );
  }

  if (sections.length === 0) {
    return trimmedPrompt;
  }

  return `${sections.join("\n\n")}\n\nRequest: ${trimmedPrompt}`;
}

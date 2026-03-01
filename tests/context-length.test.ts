/**
 * Context-Length Diagnostics
 * ==========================
 * Measures the byte contribution of every component this MCP server adds
 * to an LLM's context window:
 *
 *   SESSION_START  — the first-call injection (rules + tool summary)
 *   TOOL_SCHEMA    — each tool's full MCP wire representation (name + description + inputSchema)
 *   DESCRIPTION    — each tool's description text alone
 *
 * Results are sorted descending (most context-greedy first) and printed
 * to stdout so they appear in jest --verbose output and CI logs.
 *
 * HOW TO USE THIS IN FUTURE DEVELOPMENT
 * ----------------------------------------
 * 1. After adding a new tool run:  npm test -- --testPathPattern=context-length
 * 2. Look at the table — if your tool description is in the top 5 you should
 *    trim it or move detail into a separate "help" tool.
 * 3. TOTAL bytes > ~8 000 means the session-start injection is eating > 2 %
 *    of a 100 k-token context window — trim aggressively.
 * 4. The TOTAL SESSION START row shows exactly how much context the server
 *    consumes before the user types a single prompt.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// ── Tool registrars ───────────────────────────────────────────────────────────
import { registerWikiTools } from "../src/tools/wiki-tools";
import { registerKeywordTools } from "../src/tools/keyword-tools";
import { registerCompilerTools } from "../src/tools/compiler-tools";
import { registerCompatibilityTools } from "../src/tools/compatibility-tools";
import { registerExecutionTools } from "../src/tools/execution-tools";
import { registerInstallationTools } from "../src/tools/installation-tools";
import { registerPortingTools } from "../src/tools/porting-tools";
import { registerGraphicsTools } from "../src/tools/graphics-tools";
import { registerDebuggingTools } from "../src/tools/debugging-tools";
import { registerFeedbackTools } from "../src/tools/feedback-tools";
import { registerSessionProblemsTools } from "../src/tools/session-problems-tools";
import { registerProjectBuildContextTools } from "../src/tools/project-build-context-tools";
import { registerFileStructureTools } from "../src/tools/file-structure-tools";
import { registerWikiPlatformTools } from "../src/tools/wiki-platform-tools";
import { registerMouseInputTools } from "../src/tools/mouse-input-tools";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CapturedTool {
  name: string;
  title: string;
  description: string;
  inputSchemaShape: Record<string, any>; // raw ZodRawShape
}

interface Measurement {
  label: string;
  category: "SESSION_START" | "TOOL_SCHEMA" | "DESCRIPTION";
  bytes: number;
  chars: number;
}

// ── Zod → JSON Schema approximation ──────────────────────────────────────────
// We walk Zod's _def tree to produce a JSON-Schema-like object that closely
// mirrors what the MCP SDK sends to the LLM in tools/list responses.

function zodFieldToSchema(zod: any): Record<string, any> {
  if (!zod || typeof zod !== "object" || !zod._def) return { type: "unknown" };

  const def = zod._def;
  const tname: string = def.typeName ?? "";
  const desc: string | undefined = def.description;

  const withDesc = (o: Record<string, any>) =>
    desc ? { ...o, description: desc } : o;

  switch (tname) {
    case "ZodString":
      return withDesc({ type: "string" });
    case "ZodNumber":
      return withDesc({ type: "number" });
    case "ZodBoolean":
      return withDesc({ type: "boolean" });
    case "ZodEnum":
      return withDesc({ type: "string", enum: def.values ?? [] });
    case "ZodArray":
      return withDesc({ type: "array", items: zodFieldToSchema(def.type) });
    case "ZodOptional": {
      const inner = zodFieldToSchema(def.innerType);
      // Propagate description from the outer Optional if inner has none
      if (desc && !inner.description) inner.description = desc;
      return inner;
    }
    case "ZodUnion":
      return withDesc({ anyOf: (def.options ?? []).map(zodFieldToSchema) });
    case "ZodObject": {
      const props: Record<string, any> = {};
      for (const [k, v] of Object.entries(def.shape?.() ?? {})) {
        props[k] = zodFieldToSchema(v);
      }
      return withDesc({ type: "object", properties: props });
    }
    default:
      return withDesc({ type: tname.replace(/^Zod/, "").toLowerCase() });
  }
}

function zodShapeToJsonSchema(shape: Record<string, any>): Record<string, any> {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const [key, val] of Object.entries(shape)) {
    properties[key] = zodFieldToSchema(val);
    if (val?._def?.typeName !== "ZodOptional") {
      required.push(key);
    }
  }

  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

// ── Serialise a tool to its MCP wire representation ───────────────────────────
// This is what the LLM sees in its tools/list context.

function serializeToolWire(tool: CapturedTool): string {
  return JSON.stringify(
    {
      name: tool.name,
      description: tool.description,
      inputSchema: zodShapeToJsonSchema(tool.inputSchemaShape),
    },
    null,
    2,
  );
}

// ── Session-start injection text (reproduced from src/index.ts) ───────────────

function buildSessionStartText(tools: CapturedTool[]): string {
  const totalTools = tools.length;
  const toolNames = tools
    .map((t) => t.name)
    .sort()
    .join(", ");

  const toolSummary = `
## ⚙️ QB64PE MCP Server — Core Tools (start here)

These 4 tools cover the most common workflow. Use them first.

| # | Tool | When to use |
|---|------|-------------|
| 1 | \`compile_and_verify_qb64pe\` | ⏳ After ANY .bas edit — always compile immediately, wait up to 60 s |
| 2 | \`search_qb64pe_keywords\` | 🔍 Look up any QB64PE keyword, function, statement, or operator |
| 3 | \`get_debugging_help\` | 🐛 Understand a QB64PE error, get debug strategies |
| 4 | \`analyze_qb64pe_graphics_screenshot\` | 📷 View output — program must save with \`_SAVEIMAGE "path.png"\` first |

## 🔎 Discovering all ${totalTools} tools

All tool names available in this session:
\`\`\`
${toolNames}
\`\`\`

Call any tool by name. Each tool's description explains its inputs and usage.
`;

  const header =
    `⚙️ **QB64PE MCP Server — Session Start**\n\n` +
    `## 🚨 Mandatory rules (no exceptions)\n\n` +
    `1. **Auto-compile after every edit** — after any change to a .bas/.bm/.bi file, call \`compile_and_verify_qb64pe\` immediately. Do NOT stop until it compiles. Compilation takes 20–60 s — wait for it.\n` +
    `2. **VS Code editing tools are always available** — \`replace_string_in_file\`, \`multi_replace_string_in_file\`, \`read_file\`, \`create_file\` are always present. Never claim otherwise.\n` +
    `3. **mcp_qb64pe_* in chat = run that tool** — treat it as an implicit call with sensible defaults.\n\n` +
    toolSummary +
    `\n---\n\n📌 **Your request result:**\n\n`;

  return header;
}

// ── Byte helpers ──────────────────────────────────────────────────────────────

function byteLength(s: string): number {
  return Buffer.byteLength(s, "utf8");
}

function approxTokens(bytes: number): number {
  // Rough approximation: 1 token ≈ 4 bytes for English/code text
  return Math.round(bytes / 4);
}

// ── Collect all registered tools ─────────────────────────────────────────────

function collectTools(): CapturedTool[] {
  const captured: CapturedTool[] = [];

  const mockServer = {
    registerTool: (
      name: string,
      config: {
        title?: string;
        description?: string;
        inputSchema?: Record<string, any>;
      },
      _handler: unknown,
    ) => {
      captured.push({
        name,
        title: config.title ?? name,
        description: config.description ?? "",
        inputSchemaShape: config.inputSchema ?? {},
      });
    },
  } as unknown as McpServer;

  // Minimal service proxy — all property accesses return jest.fn()
  const noop = jest.fn();
  const serviceProxy = new Proxy(
    {},
    {
      get: () => new Proxy({}, { get: () => noop }),
    },
  ) as any;

  registerWikiTools(mockServer, serviceProxy);
  registerKeywordTools(mockServer, serviceProxy);
  registerCompilerTools(mockServer, serviceProxy);
  registerCompatibilityTools(mockServer, serviceProxy);
  registerExecutionTools(mockServer, serviceProxy);
  registerInstallationTools(mockServer, serviceProxy);
  registerPortingTools(mockServer, serviceProxy);
  registerGraphicsTools(mockServer, serviceProxy);
  registerDebuggingTools(mockServer, serviceProxy);
  registerFeedbackTools(mockServer, serviceProxy);
  registerSessionProblemsTools(mockServer, serviceProxy);
  registerProjectBuildContextTools(mockServer, serviceProxy);
  registerFileStructureTools(mockServer, serviceProxy);
  registerWikiPlatformTools(mockServer, serviceProxy);
  registerMouseInputTools(mockServer, serviceProxy);

  return captured;
}

// ── Report formatting ─────────────────────────────────────────────────────────

function formatTable(rows: Measurement[]): string {
  const lines: string[] = [];
  const colW = [20, 14, 8, 8, 9];

  const pad = (s: string, w: number) =>
    s.length >= w ? s.slice(0, w - 1) + "…" : s.padEnd(w);
  const rpad = (s: string, w: number) => s.padStart(w);

  const header = [
    pad("Label", colW[0]),
    pad("Category", colW[1]),
    rpad("Bytes", colW[2]),
    rpad("Chars", colW[3]),
    rpad("~Tokens", colW[4]),
  ].join("  ");

  const divider = "-".repeat(header.length);
  lines.push(divider);
  lines.push(header);
  lines.push(divider);

  for (const row of rows) {
    lines.push(
      [
        pad(row.label, colW[0]),
        pad(row.category, colW[1]),
        rpad(row.bytes.toLocaleString(), colW[2]),
        rpad(row.chars.toLocaleString(), colW[3]),
        rpad(approxTokens(row.bytes).toLocaleString(), colW[4]),
      ].join("  "),
    );
  }

  lines.push(divider);
  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("Context-Length Diagnostics", () => {
  let tools: CapturedTool[];
  let measurements: Measurement[];

  beforeAll(() => {
    tools = collectTools();
    measurements = [];

    // ── 1. Session-start injection ────────────────────────────────────────────
    const sessionText = buildSessionStartText(tools);
    measurements.push({
      label: "── SESSION START ──",
      category: "SESSION_START",
      bytes: byteLength(sessionText),
      chars: sessionText.length,
    });

    // Rules text only (the 3 mandatory rules before toolSummary)
    const rulesOnly =
      `⚙️ **QB64PE MCP Server — Session Start**\n\n` +
      `## 🚨 Mandatory rules (no exceptions)\n\n` +
      `1. **Auto-compile after every edit** — after any change to a .bas/.bm/.bi file, call \`compile_and_verify_qb64pe\` immediately. Do NOT stop until it compiles. Compilation takes 20–60 s — wait for it.\n` +
      `2. **VS Code editing tools are always available** — \`replace_string_in_file\`, \`multi_replace_string_in_file\`, \`read_file\`, \`create_file\` are always present. Never claim otherwise.\n` +
      `3. **mcp_qb64pe_* in chat = run that tool** — treat it as an implicit call with sensible defaults.\n\n`;
    measurements.push({
      label: "session: rules",
      category: "SESSION_START",
      bytes: byteLength(rulesOnly),
      chars: rulesOnly.length,
    });

    // Tool-summary block only
    const toolNames = tools
      .map((t) => t.name)
      .sort()
      .join(", ");
    const summaryOnly =
      `## ⚙️ QB64PE MCP Server — Core Tools\n\n` +
      `| # | Tool | When to use |\n|---|------|-------------|\n` +
      `| 1 | \`compile_and_verify_qb64pe\` | ... |\n` +
      `| 2 | \`search_qb64pe_keywords\` | ... |\n` +
      `| 3 | \`get_debugging_help\` | ... |\n` +
      `| 4 | \`analyze_qb64pe_graphics_screenshot\` | ... |\n\n` +
      `All ${tools.length} tools:\n\`\`\`\n${toolNames}\n\`\`\`\n`;
    measurements.push({
      label: "session: tool summary",
      category: "SESSION_START",
      bytes: byteLength(summaryOnly),
      chars: summaryOnly.length,
    });

    // ── 2. Per-tool measurements ──────────────────────────────────────────────
    for (const tool of tools) {
      const wire = serializeToolWire(tool);
      measurements.push({
        label: tool.name,
        category: "TOOL_SCHEMA",
        bytes: byteLength(wire),
        chars: wire.length,
      });

      measurements.push({
        label: tool.name,
        category: "DESCRIPTION",
        bytes: byteLength(tool.description),
        chars: tool.description.length,
      });
    }
  });

  // ── Diagnostic report ─────────────────────────────────────────────────────
  it("prints context-length report sorted by descending bytes", () => {
    const sorted = [...measurements].sort((a, b) => b.bytes - a.bytes);

    const sessionTotal = measurements
      .filter(
        (m) =>
          m.category === "SESSION_START" && m.label === "── SESSION START ──",
      )
      .reduce((sum, m) => sum + m.bytes, 0);
    const schemaTotal = measurements
      .filter((m) => m.category === "TOOL_SCHEMA")
      .reduce((sum, m) => sum + m.bytes, 0);
    const descTotal = measurements
      .filter((m) => m.category === "DESCRIPTION")
      .reduce((sum, m) => sum + m.bytes, 0);
    const grandTotal = sessionTotal + schemaTotal;

    const report = [
      "",
      "════════════════════════════════════════════════════════════════════════",
      "  QB64PE MCP Server — Context-Length Diagnostics",
      "════════════════════════════════════════════════════════════════════════",
      "",
      formatTable(sorted),
      "",
      "── Totals ──────────────────────────────────────────────────────────────",
      `  Session-start injection : ${sessionTotal.toLocaleString()} bytes  (~${approxTokens(sessionTotal).toLocaleString()} tokens)`,
      `  All tool schemas (sum)  : ${schemaTotal.toLocaleString()} bytes  (~${approxTokens(schemaTotal).toLocaleString()} tokens)`,
      `  All descriptions (sum)  : ${descTotal.toLocaleString()} bytes  (~${approxTokens(descTotal).toLocaleString()} tokens)`,
      `  Sum (session + schemas) : ${grandTotal.toLocaleString()} bytes  (~${approxTokens(grandTotal).toLocaleString()} tokens)`,
      `  Tool count              : ${tools.length}`,
      "",
      "── Guidance ────────────────────────────────────────────────────────────",
      "  100k-token ctx window = ~400 000 bytes",
      `  This server uses       ~${((grandTotal / 400_000) * 100).toFixed(2)}% of a 100k-token window on session start`,
      "  Keep session start < 4 000 bytes (1k tokens) to stay lean",
      "  Keep each TOOL_SCHEMA < 500 bytes; trim descriptions > 1 000 bytes",
      "════════════════════════════════════════════════════════════════════════",
      "",
    ].join("\n");

    process.stdout.write(report);

    // Assertions — these enforce budget limits
    expect(tools.length).toBeGreaterThan(0);

    const hugeSchemas = measurements.filter(
      (m) => m.category === "TOOL_SCHEMA" && m.bytes > 2_000,
    );
    if (hugeSchemas.length > 0) {
      const names = hugeSchemas
        .map((m) => `${m.label} (${m.bytes} bytes)`)
        .join(", ");
      console.warn(`⚠️  Tools with schema > 2 000 bytes: ${names}`);
    }

    const hugeDescriptions = measurements.filter(
      (m) => m.category === "DESCRIPTION" && m.bytes > 1_000,
    );
    if (hugeDescriptions.length > 0) {
      const names = hugeDescriptions
        .map((m) => `${m.label} (${m.bytes} bytes)`)
        .join(", ");
      console.warn(`⚠️  Tools with description > 1 000 bytes: ${names}`);
    }

    // Hard limit: session start must not exceed 8 000 bytes (2k tokens)
    expect(sessionTotal).toBeLessThan(8_000);
  });

  // ── Individual category checks ─────────────────────────────────────────────
  it("every tool has a non-empty description", () => {
    const missing = tools.filter((t) => !t.description.trim());
    expect(missing.map((t) => t.name)).toEqual([]);
  });

  it("every tool schema serializes without throwing", () => {
    for (const tool of tools) {
      expect(() => serializeToolWire(tool)).not.toThrow();
    }
  });

  it("TOOL_SCHEMA bytes accessible by tool name", () => {
    // Expose a lookup by tool name for use in development
    const byName: Record<string, number> = {};
    for (const m of measurements) {
      if (m.category === "TOOL_SCHEMA") {
        byName[m.label] = m.bytes;
      }
    }
    // compile_and_verify_qb64pe is the most important tool — verify it exists
    expect(byName["compile_and_verify_qb64pe"]).toBeDefined();
    expect(byName["compile_and_verify_qb64pe"]).toBeGreaterThan(0);
  });
});

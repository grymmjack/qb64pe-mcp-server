/**
 * Tool Discovery System - Ensures LLMs learn about all available tools
 * This system tracks whether an LLM has learned about all available tools
 * and automatically provides tool information on the first interaction.
 */

export interface ToolInfo {
  name: string;
  title: string;
  description: string;
  category: string;
  inputSchema?: string;
}

export interface ToolCategory {
  name: string;
  description: string;
  tools: string[];
}

/**
 * Manages tool discovery and learning state
 */
export class ToolDiscoveryManager {
  private toolsLearned: Set<string> = new Set();
  private toolRegistry: Map<string, ToolInfo> = new Map();
  private categories: Map<string, ToolCategory> = new Map();
  private firstToolCallMade: boolean = false;

  /**
   * Register a tool in the discovery system
   */
  registerTool(info: ToolInfo): void {
    this.toolRegistry.set(info.name, info);

    // Add to category
    if (!this.categories.has(info.category)) {
      this.categories.set(info.category, {
        name: info.category,
        description: this.getCategoryDescription(info.category),
        tools: [],
      });
    }
    this.categories.get(info.category)!.tools.push(info.name);
  }

  /**
   * Check if tools have been learned
   */
  hasLearnedTools(): boolean {
    return this.firstToolCallMade;
  }

  /**
   * Mark that tools have been learned
   */
  markToolsAsLearned(): void {
    this.firstToolCallMade = true;
  }

  /**
   * Get a focused summary of the 4 core tools + discovery hint.
   * Intentionally short — do NOT dump all tool schemas into the context.
   */
  getToolSummary(): string {
    const totalTools = this.toolRegistry.size;
    const toolNames = Array.from(this.toolRegistry.keys()).sort().join(", ");

    return `
## ⚙️ QB64PE MCP Server — Core Tools (start here)

These 4 tools cover the most common workflow. Use them first.

| # | Tool | When to use |
|---|------|-------------|
| 1 | \`compile_and_verify_qb64pe\` | ⏳ After ANY .bas edit — always compile immediately, wait up to 120 s; run flags like \`-x\` are ignored |
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
  }

  // ORIGINAL VERBOSE BLOCK REMOVED — see git history if needed.
  // The new getToolSummary() above is intentionally short: 4 core tools
  // + a flat list of all tool names to keep LLM context lean.

  /**
   * Get a concise tool list (for quick reference)
   */
  getToolList(): string[] {
    return Array.from(this.toolRegistry.keys()).sort();
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(category: string): ToolInfo[] {
    const categoryInfo = this.categories.get(category);
    if (!categoryInfo) return [];

    return categoryInfo.tools
      .map((name) => this.toolRegistry.get(name))
      .filter((tool): tool is ToolInfo => tool !== undefined);
  }

  /**
   * Get all categories
   */
  getCategories(): ToolCategory[] {
    return Array.from(this.categories.values());
  }

  /**
   * Format category name for display
   */
  private formatCategoryName(category: string): string {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Get category description
   */
  private getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      wiki: "Access QB64PE documentation, tutorials, and reference materials from the official wiki",
      keywords:
        "Query and explore QB64PE keywords, functions, and statement syntax",
      compiler: "Compile QB64PE code and manage compilation options",
      compatibility:
        "Validate code compatibility and resolve QB64PE-specific issues",
      execution: "Execute compiled programs and manage execution monitoring",
      installation: "Manage QB64PE installation and verification",
      porting: "Port QBasic/QuickBASIC code to QB64PE with automated fixes",
      graphics:
        "Analyze graphics output, screenshots, and visual program results",
      debugging:
        "Debug programs with enhanced timeout management and issue resolution",
      feedback: "Generate feedback and analysis for completed work",
    };

    return descriptions[category] || "Tools for QB64PE development";
  }
}

// Global singleton instance
export const toolDiscoveryManager = new ToolDiscoveryManager();

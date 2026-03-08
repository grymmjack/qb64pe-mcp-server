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
   * Get a focused workflow summary + discovery hint.
   * Intentionally short — do NOT dump all tool schemas into the context.
   */
  getToolSummary(): string {
    const totalTools = this.toolRegistry.size;
    const toolNames = Array.from(this.toolRegistry.keys()).sort().join(", ");

    return `
## ⚙️ QB64PE MCP Server — Workflow Routing

Pick the tool that matches the job. Do not default to compile plus keyword lookup for every task.

| Workflow | Primary tools | When to use |
|---|---|---|
| Edit → verify | \`compile_and_verify_qb64pe\`, \`validate_qb64pe_syntax\` | After changing .bas/.bm/.bi files |
| Language/docs | \`lookup_qb64pe_keyword\`, \`search_qb64pe_keywords\`, \`search_qb64pe_wiki\` | Find syntax, statements, functions, and wiki guidance |
| Pre-compile review | \`validate_qb64pe_compatibility\`, \`search_qb64pe_compatibility\`, \`get_qb64pe_best_practices\` | Catch compatibility and platform issues before compiling |
| Legacy BASIC porting | \`analyze_qbasic_compatibility\`, \`port_qbasic_to_qb64pe\`, \`get_porting_dialect_info\` | QBasic/QuickBASIC/VB-DOS migration work |
| Runtime behavior | \`analyze_qb64pe_execution_mode\`, \`get_execution_monitoring_guidance\`, \`get_process_monitoring_commands\`, \`parse_console_output\` | Decide how to monitor or inspect a running program |
| Graphics output | \`analyze_qb64pe_graphics_screenshot\`, \`generate_qb64pe_screenshot_analysis_template\` | Understand what a graphics program actually drew |
| Setup/build memory | \`detect_qb64pe_installation\`, \`get_project_build_context\` | Find QB64PE or inspect remembered build settings |

## 🔎 Discovering all ${totalTools} tools

All tool names available in this session:
\`\`\`
${toolNames}
\`\`\`

Call any tool by name. Use specialized tools when the task is about compatibility, porting, runtime behavior, graphics, installation, or build context — not just compilation.
`;
  }

  // The summary above is intentionally short and workflow-oriented so LLMs
  // can route to specialized tools without needing every schema in-context.

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

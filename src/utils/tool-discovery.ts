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
   * Get comprehensive tool summary for LLM learning
   */
  getToolSummary(): string {
    let summary = `# QB64PE MCP Server - Complete Tool Reference

This MCP server provides comprehensive QB64PE development assistance with ${this.toolRegistry.size} tools organized into ${this.categories.size} categories.

## IMPORTANT: Always Use Available Tools
Before attempting any QB64PE-related task, review the tools available to you. These tools provide:
- Accurate QB64PE syntax and documentation
- Code compilation and execution
- Compatibility checking and issue resolution
- Graphics and screenshot analysis
- Debugging assistance
- Code porting from QBasic/QuickBASIC

## Tool Categories Overview\n\n`;

    // Add category summaries
    for (const [categoryName, category] of this.categories.entries()) {
      summary += `### ${this.formatCategoryName(categoryName)}\n`;
      summary += `${category.description}\n`;
      summary += `Tools: ${category.tools.length}\n\n`;
    }

    summary += `\n## Complete Tool Reference\n\n`;

    // Add detailed tool information by category
    for (const [categoryName, category] of this.categories.entries()) {
      summary += `### ${this.formatCategoryName(categoryName)} Tools\n\n`;
      
      for (const toolName of category.tools) {
        const tool = this.toolRegistry.get(toolName);
        if (tool) {
          summary += `#### ${tool.name}\n`;
          summary += `**Title:** ${tool.title}\n`;
          summary += `**Description:** ${tool.description}\n`;
          if (tool.inputSchema) {
            summary += `**Input Schema:**\n\`\`\`\n${tool.inputSchema}\n\`\`\`\n`;
          }
          summary += `\n`;
        }
      }
      summary += `\n`;
    }

    summary += `\n## Usage Guidelines\n\n`;
    summary += `1. **Always search the wiki first** - Use search_qb64pe_wiki for documentation\n`;
    summary += `2. **Check compatibility** - Use validate_qb64pe_compatibility before compiling\n`;
    summary += `3. **Test code execution** - Use compile_qb64pe_code and execute_qb64pe_program\n`;
    summary += `4. **Handle graphics programs** - Use screenshot analysis tools for visual output\n`;
    summary += `5. **Debug issues** - Use debugging tools for timeout management and analysis\n`;
    summary += `6. **Get feedback** - Use feedback tools to improve code quality\n\n`;

    summary += `## Quick Start Workflow\n\n`;
    summary += `For a typical QB64PE development task:\n`;
    summary += `1. Search wiki for relevant keywords/functions\n`;
    summary += `2. Validate code compatibility\n`;
    summary += `3. Compile the code\n`;
    summary += `4. Execute the program\n`;
    summary += `5. Analyze results (screenshots for graphics, console output for text)\n`;
    summary += `6. Debug any issues\n`;
    summary += `7. Apply fixes and iterate\n\n`;

    return summary;
  }

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
      .map(name => this.toolRegistry.get(name))
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
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get category description
   */
  private getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      'wiki': 'Access QB64PE documentation, tutorials, and reference materials from the official wiki',
      'keywords': 'Query and explore QB64PE keywords, functions, and statement syntax',
      'compiler': 'Compile QB64PE code and manage compilation options',
      'compatibility': 'Validate code compatibility and resolve QB64PE-specific issues',
      'execution': 'Execute compiled programs and manage execution monitoring',
      'installation': 'Manage QB64PE installation and verification',
      'porting': 'Port QBasic/QuickBASIC code to QB64PE with automated fixes',
      'graphics': 'Analyze graphics output, screenshots, and visual program results',
      'debugging': 'Debug programs with enhanced timeout management and issue resolution',
      'feedback': 'Generate feedback and analysis for completed work',
    };
    
    return descriptions[category] || 'Tools for QB64PE development';
  }
}

// Global singleton instance
export const toolDiscoveryManager = new ToolDiscoveryManager();

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
export declare class ToolDiscoveryManager {
    private toolsLearned;
    private toolRegistry;
    private categories;
    private firstToolCallMade;
    /**
     * Register a tool in the discovery system
     */
    registerTool(info: ToolInfo): void;
    /**
     * Check if tools have been learned
     */
    hasLearnedTools(): boolean;
    /**
     * Mark that tools have been learned
     */
    markToolsAsLearned(): void;
    /**
     * Get comprehensive tool summary for LLM learning
     */
    getToolSummary(): string;
    /**
     * Get a concise tool list (for quick reference)
     */
    getToolList(): string[];
    /**
     * Get tools by category
     */
    getToolsByCategory(category: string): ToolInfo[];
    /**
     * Get all categories
     */
    getCategories(): ToolCategory[];
    /**
     * Format category name for display
     */
    private formatCategoryName;
    /**
     * Get category description
     */
    private getCategoryDescription;
}
export declare const toolDiscoveryManager: ToolDiscoveryManager;
//# sourceMappingURL=tool-discovery.d.ts.map
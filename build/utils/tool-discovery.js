"use strict";
/**
 * Tool Discovery System - Ensures LLMs learn about all available tools
 * This system tracks whether an LLM has learned about all available tools
 * and automatically provides tool information on the first interaction.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolDiscoveryManager = exports.ToolDiscoveryManager = void 0;
/**
 * Manages tool discovery and learning state
 */
class ToolDiscoveryManager {
    toolsLearned = new Set();
    toolRegistry = new Map();
    categories = new Map();
    firstToolCallMade = false;
    /**
     * Register a tool in the discovery system
     */
    registerTool(info) {
        this.toolRegistry.set(info.name, info);
        // Add to category
        if (!this.categories.has(info.category)) {
            this.categories.set(info.category, {
                name: info.category,
                description: this.getCategoryDescription(info.category),
                tools: [],
            });
        }
        this.categories.get(info.category).tools.push(info.name);
    }
    /**
     * Check if tools have been learned
     */
    hasLearnedTools() {
        return this.firstToolCallMade;
    }
    /**
     * Mark that tools have been learned
     */
    markToolsAsLearned() {
        this.firstToolCallMade = true;
    }
    /**
     * Get comprehensive tool summary for LLM learning
     */
    getToolSummary() {
        let summary = `# QB64PE MCP Server - Complete Tool Reference

This MCP server provides comprehensive QB64PE development assistance with ${this.toolRegistry.size} tools organized into ${this.categories.size} categories.

## 🧠 AGENT INTELLIGENCE RESOURCES

**For LLMs/AI Agents:** This server includes comprehensive guidance for intelligent tool usage:

### 📚 Available Resources (Use MCP Resource Access)
- **qb64pe://agent/intelligence-guide** - Complete Agent Intelligence Guide
  - Context recognition patterns (detect compilation errors, porting needs, etc.)
  - Tool decision matrix (which tools to use for each scenario)
  - Autonomous workflows (how to fix issues without asking permission)
  - Training examples (good vs. bad agent behavior)
  - Decision frameworks and flowcharts

### 🎯 Available Prompts (Use MCP Prompt Access)
- **analyze-compilation-error** - Autonomous compilation error analysis and fixing
- **port-qbasic-to-qb64pe** - Automated QBasic/QuickBASIC porting workflow
- **debug-qb64pe-issue** - Step-by-step debugging guidance
- **review-qb64pe-code** - Comprehensive code review with best practices
- **monitor-qb64pe-execution** - Execution monitoring for timeout-prone programs

### ⚡ Key Intelligence Principles
1. **Recognize Context** - Detect when user shows terminal errors with compilation failures
2. **Autonomous Action** - Apply fixes WITHOUT asking permission
3. **Tool Selection** - Use analyze-compilation-error prompt for compilation issues
4. **Iterate** - Keep trying compile_and_verify_qb64pe until success (max 5 iterations)
5. **Report Results** - Only show final outcome, not intermediate steps

### 🔄 CRITICAL WORKFLOW: Auto-Compile After Code Edits
**MANDATORY RULE:** After ANY file edit operation (replace_string_in_file, multi_replace_string_in_file, create_file) on QB64PE source files (.bas, .bm, .bi):
1. **IMMEDIATELY** call compile_and_verify_qb64pe with the edited file path
2. Check result.success - if false, analyze errors and apply fixes
3. **REPEAT** compile-fix cycle until success OR user explicitly stops you
4. **DO NOT** wait for user to ask "does it compile?" or "can you test it?"

This is NOT optional - it's a critical workflow requirement that eliminates the need for users to repeatedly request compilation verification.

**💡 Quick Example:**
User shows: "Compilation failed: Line 15: Type mismatch #qb64pe"
You should: 1) Use analyze-compilation-error prompt 2) Apply fixes 3) Run compile_and_verify_qb64pe 4) Report success

---

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
    getToolList() {
        return Array.from(this.toolRegistry.keys()).sort();
    }
    /**
     * Get tools by category
     */
    getToolsByCategory(category) {
        const categoryInfo = this.categories.get(category);
        if (!categoryInfo)
            return [];
        return categoryInfo.tools
            .map(name => this.toolRegistry.get(name))
            .filter((tool) => tool !== undefined);
    }
    /**
     * Get all categories
     */
    getCategories() {
        return Array.from(this.categories.values());
    }
    /**
     * Format category name for display
     */
    formatCategoryName(category) {
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    /**
     * Get category description
     */
    getCategoryDescription(category) {
        const descriptions = {
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
exports.ToolDiscoveryManager = ToolDiscoveryManager;
// Global singleton instance
exports.toolDiscoveryManager = new ToolDiscoveryManager();
//# sourceMappingURL=tool-discovery.js.map
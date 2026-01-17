# QB64PE MCP Server - Automatic Tool Discovery System

## Overview

The QB64PE MCP Server now includes an **Automatic Tool Discovery System** that ensures LLMs (Large Language Models) are always aware of all available tools before processing any request. This system addresses the common issue where LLMs struggle without knowing what tools are available.

## How It Works

### 1. Tool Discovery Manager

The `ToolDiscoveryManager` class (in `src/utils/tool-discovery.ts`) tracks all registered tools and provides comprehensive documentation about them:

- **Tool Registry**: Maintains a complete catalog of all tools with their metadata
- **Category Organization**: Groups tools by functionality (wiki, compiler, execution, etc.)
- **Learning State**: Tracks whether the LLM has been introduced to the tools
- **Summary Generation**: Creates detailed, structured documentation of all tools

### 2. Enhanced MCP Server Wrapper

The `ToolDiscoveryMCPServer` class (in `src/index.ts`) extends the standard MCP Server to automatically inject tool discovery:

- **Transparent Wrapping**: Intercepts all `registerTool()` calls without changing existing code
- **Automatic Registration**: Every tool is automatically registered in the discovery manager
- **Category Inference**: Intelligently categorizes tools based on their names
- **First-Call Injection**: On the very first tool call (any tool), provides complete tool documentation

### 3. First-Call Behavior

When an LLM makes its **first tool call** to the server:

1. The system detects this is the first interaction
2. The original tool request is still processed normally
3. **Before** returning the result, a comprehensive tool summary is prepended
4. The LLM receives both:
   - Complete documentation of all available tools
   - The actual result of their tool request

This ensures the LLM learns about all capabilities without requiring a separate "discovery" step.

## Tool Summary Structure

The automatically generated summary includes:

### Category Overview
- Total tool count
- Number of categories
- Brief description of each category

### Detailed Tool Reference
For each tool:
- Tool name
- Title and description
- Input schema (parameters and their descriptions)
- Category classification

### Usage Guidelines
- Best practices for QB64PE development
- Recommended workflow patterns
- Quick start instructions

## Benefits

### For LLMs
1. **Immediate Awareness**: Knows all available tools from the first interaction
2. **Better Tool Selection**: Can choose the most appropriate tool for each task
3. **Improved Workflows**: Understands the full development workflow
4. **No Guesswork**: Has complete documentation instead of making assumptions

### For Users
1. **Better Results**: LLM makes informed decisions about tool usage
2. **Faster Development**: No need to manually explain available tools
3. **Consistent Quality**: Every session starts with full tool knowledge
4. **Zero Configuration**: Works automatically without setup

### For Developers
1. **No Code Changes**: Existing tool registration code works as-is
2. **Automatic Updates**: New tools are automatically included
3. **Maintainable**: Single source of truth for tool documentation
4. **Type-Safe**: Full TypeScript support maintained

## Implementation Details

### Tool Categories

The system organizes tools into these categories:

- **wiki**: QB64PE documentation and reference materials
- **keywords**: Keyword and syntax information
- **compiler**: Code compilation and options
- **compatibility**: Code validation and issue resolution
- **execution**: Program execution and monitoring
- **installation**: QB64PE setup and verification
- **porting**: QBasic/QuickBASIC code migration
- **graphics**: Screenshot and visual analysis
- **debugging**: Debug support and timeout management
- **feedback**: Analysis and reporting

### Category Inference

Categories are automatically inferred from tool names using pattern matching:
- `search_qb64pe_wiki` → wiki category
- `compile_qb64pe_code` → compiler category
- `execute_qb64pe_program` → execution category
- And so on...

### State Management

- Discovery state is managed per server instance
- State persists across tool calls within a session
- Resets when the server restarts (new session = new learning)
- Thread-safe and concurrent-request safe

## Example Output

When an LLM first calls any tool (e.g., `search_qb64pe_wiki`), they receive:

```
🎓 **IMPORTANT: QB64PE MCP Server Tool Discovery**

Before processing your request, you must review all available tools...

# QB64PE MCP Server - Complete Tool Reference

This MCP server provides comprehensive QB64PE development assistance 
with 30+ tools organized into 10 categories.

## Tool Categories Overview

### Wiki
Access QB64PE documentation, tutorials, and reference materials
Tools: 3

### Keywords
Query and explore QB64PE keywords and syntax
Tools: 4

[... detailed documentation of all tools ...]

---

📋 **Your Request Result:**

[... actual tool result ...]
```

## Future Enhancements

Potential improvements for future versions:

1. **Selective Discovery**: Option to show only relevant tool categories
2. **Progressive Disclosure**: Show brief summary first, detailed docs on request
3. **Usage Statistics**: Track which tools are most commonly used
4. **Smart Recommendations**: Suggest related tools based on current task
5. **Custom Summaries**: Allow customization of discovery documentation
6. **Caching**: Cache tool summaries for performance

## Files Modified

- `src/utils/tool-discovery.ts` - New file containing the discovery manager
- `src/index.ts` - Added `ToolDiscoveryMCPServer` wrapper class
- `src/utils/mcp-helpers.ts` - Minor import changes (reverted experimental code)

## Configuration

No configuration required! The system works automatically with zero setup.

## Testing

To test the discovery system:

1. Build the server: `npm run build`
2. Start the server: `npm start`
3. Make any tool call through an MCP client
4. Observe the tool discovery documentation in the first response
5. Subsequent calls will work normally without the discovery injection

## Debugging

If you need to debug the discovery system:

- Check console output for server startup messages
- Tool registration happens during `setupTools()` phase
- Discovery injection happens on first tool call
- Look for "🎓 IMPORTANT: QB64PE MCP Server Tool Discovery" in responses

## Support

For issues or questions about the tool discovery system:
1. Check that TypeScript compilation succeeded
2. Verify all tool registration functions are being called
3. Confirm tools are being registered with proper metadata
4. Review the discovery manager state during runtime

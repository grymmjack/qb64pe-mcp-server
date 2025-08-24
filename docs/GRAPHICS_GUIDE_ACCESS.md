# How to Access QB64PE Graphics Guide in Agent Chat

## Overview

The comprehensive QB64PE Graphics Statements Guide is now available as an MCP tool for LLMs to access during agent conversations. This ensures LLMs have immediate access to graphics guidance without needing to search external resources.

## Access Methods

### 1. **Primary MCP Tool** (Recommended)

Use the `get_qb64pe_graphics_guide` tool to access the guide:

```
#get_qb64pe_graphics_guide
```

**Parameters:**
- `section` (optional): Get specific section instead of full guide
  - `"all"` - Complete guide (default)
  - `"putimage"` - _PUTIMAGE usage patterns and pitfalls
  - `"image_management"` - Image lifecycle and memory management
  - `"drawing_commands"` - Basic drawing operations
  - `"screen_management"` - Screen setup and display control
  - `"troubleshooting"` - Common issues and solutions
  - `"examples"` - Code patterns and examples

### 2. **Section-Specific Access**

Get just the _PUTIMAGE section (most important for avoiding stretching issues):
```
#get_qb64pe_graphics_guide putimage
```

Get troubleshooting guidance:
```
#get_qb64pe_graphics_guide troubleshooting
```

Get code examples:
```
#get_qb64pe_graphics_guide examples
```

## Integration with Existing Tools

The graphics guide works alongside existing MCP tools:

### Related Graphics Tools:
- `#mcp_qb64pe_lookup_qb64pe_keyword _PUTIMAGE` - Get detailed keyword information
- `#mcp_qb64pe_get_qb64pe_keywords_by_category` - Browse graphics keywords
- `#mcp_qb64pe_search_qb64pe_keywords_by_wiki_category Graphics and Imaging:` - Find graphics functions
- `#mcp_qb64pe_generate_qb64pe_screenshot_analysis_template` - Create test programs
- `#mcp_qb64pe_analyze_qb64pe_graphics_screenshot` - Analyze program output

## Usage in Agent Chat

### For LLM Systems:

**Step 1**: Check graphics guide when working with QB64PE graphics
```
Hey Claude, I need help with QB64PE graphics. Can you check the graphics guide first?

#get_qb64pe_graphics_guide putimage
```

**Step 2**: Apply guidance to specific problems
```
I'm having issues with _PUTIMAGE stretching my sprites. What's the correct syntax?

#get_qb64pe_graphics_guide putimage
```

**Step 3**: Get examples for implementation
```
Show me examples of proper image management in QB64PE.

#get_qb64pe_graphics_guide examples
```

### For Developers Using LLM Agents:

1. **Initial Setup**: Ask your LLM to review the graphics guide
2. **Problem-Specific**: Request specific sections when encountering issues
3. **Code Review**: Have LLM check your graphics code against the guide
4. **Best Practices**: Get guidance on proper graphics patterns

## Key Benefits

### 1. **Immediate Access**
- No external file reading required
- Available in any agent conversation
- Always up-to-date information

### 2. **Context-Aware**
- LLMs can reference guide while helping with code
- Specific sections for targeted help
- Integrated with other QB64PE tools

### 3. **Prevents Common Mistakes**
- _PUTIMAGE stretching issues clearly explained
- Memory management best practices
- Coordinate system guidance

### 4. **LLM-Optimized Content**
- Written specifically for AI systems
- Clear do/don't examples
- Troubleshooting patterns

## Example Agent Conversation

```
User: I'm trying to load and display a sprite in QB64PE but it keeps getting stretched.

LLM: Let me check the graphics guide for _PUTIMAGE usage patterns.

#get_qb64pe_graphics_guide putimage

Based on the guide, the issue is likely that you're using the stretching form of _PUTIMAGE. 

❌ WRONG (causes stretching):
_PUTIMAGE (100, 100)-(300, 300), imageHandle

✅ CORRECT (no stretching):
_PUTIMAGE (100, 100), imageHandle

The guide shows 5 different _PUTIMAGE syntax forms, and forms 4-5 cause stretching while forms 1-3 preserve original size.
```

## Tool Configuration

### MCP Server Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "qb64pe": {
      "command": "node",
      "args": ["path/to/qb64pe-mcp-server/build/index.js"],
      "env": {}
    }
  }
}
```

### Available in These MCP Clients:
- Claude Desktop App
- Other MCP-compatible AI agents
- Custom implementations using MCP SDK

## Advanced Usage

### 1. **Automated Code Review**
```
#get_qb64pe_graphics_guide troubleshooting

Review this QB64PE graphics code against the guide and identify potential issues:
[paste code here]
```

### 2. **Learning Workflow**
```
#get_qb64pe_graphics_guide all

Study this comprehensive guide, then help me implement a sprite animation system.
```

### 3. **Debugging Assistance**
```
#get_qb64pe_graphics_guide putimage
#mcp_qb64pe_lookup_qb64pe_keyword _PUTIMAGE

My sprites are appearing at wrong sizes. What are the most common _PUTIMAGE mistakes?
```

## Maintenance

The guide is automatically available when the MCP server is running. Updates to the guide file (`docs/QB64PE_GRAPHICS_STATEMENTS_GUIDE.md`) are immediately accessible through the tool.

### Updating the Guide:
1. Edit `docs/QB64PE_GRAPHICS_STATEMENTS_GUIDE.md`
2. Restart MCP server: `npm run build`
3. Guide updates are immediately available to LLMs

### Adding New Sections:
1. Add content to the guide file
2. Update the section regex patterns in the tool if needed
3. Test access with `#get_qb64pe_graphics_guide [new_section]`

---

This system ensures LLMs have immediate, contextual access to QB64PE graphics guidance, significantly reducing the _PUTIMAGE stretching issues and other common graphics mistakes.

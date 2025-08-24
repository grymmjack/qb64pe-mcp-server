# LLM Connection Examples for QB64PE MCP Server

## Claude Desktop Configuration

To connect Claude Desktop to your QB64PE MCP server, add this to your Claude configuration:

### Windows Configuration
**File**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "qb64pe-debugging": {
      "command": "node",
      "args": ["C:/Users/grymmjack/git/qb64pe-mcp-server/build/index.js"],
      "env": {}
    }
  }
}
```

### Example LLM Conversation

**User**: "My QB64PE program hangs when I run it. Here's the code: [code]"

**Claude with MCP**: 
```
I'll help you debug that QB64PE program. Let me analyze and enhance it for better debugging.

[Claude calls: analyze_qb64pe_execution_mode]
[Claude calls: enhance_qb64pe_code_for_debugging]

I've identified the issue and enhanced your code. The problem was [specific issue]. Here's the enhanced version with debugging features:

[Enhanced code with explanations]

The enhanced program will:
- Not hang on user input (auto-timeout in DEBUG_MODE)
- Provide clear console output
- Clean up resources properly
- Generate logs for troubleshooting

Save this as enhanced_program.bas and compile with: qb64pe -c enhanced_program.bas
```

## Other LLM Platforms

### OpenAI ChatGPT (with MCP support)
```json
{
  "mcp_servers": {
    "qb64pe": {
      "command": ["node", "C:/Users/grymmjack/git/qb64pe-mcp-server/build/index.js"]
    }
  }
}
```

### VS Code Extensions
If using an LLM extension in VS Code, they can access your MCP server through the `.vscode/mcp.json` configuration you already have.

## Example LLM Prompts for Users

When users interact with LLMs that have access to your MCP server, they can ask:

### Basic Debugging:
```
"My QB64PE program exits immediately without showing output. Can you help?"
```

### Graphics Issues:
```
"I have a QB64PE graphics program that seems to hang. Here's the code: [code]"
```

### Compilation Problems:
```
"I keep getting 'Cannot CREATE because file is already in use' errors when compiling QB64PE programs."
```

### General Development:
```
"I need to port this QBasic program to QB64PE and make it automation-friendly for testing."
```

## What Happens Behind the Scenes

1. **LLM receives user question about QB64PE**
2. **LLM automatically calls appropriate MCP tools**:
   - `analyze_qb64pe_execution_mode` to understand program type
   - `enhance_qb64pe_code_for_debugging` to fix issues
   - `get_llm_debugging_guide` for execution strategy
3. **LLM provides enhanced code and clear guidance**
4. **User gets working, automation-friendly QB64PE code**

## Benefits for Users

✅ **Instant debugging assistance** - No more manual debugging
✅ **Automation-ready code** - Programs work reliably for testing
✅ **Clear explanations** - LLM explains what was fixed and why
✅ **Best practices** - Code follows QB64PE debugging best practices
✅ **Time savings** - No more trial-and-error debugging sessions

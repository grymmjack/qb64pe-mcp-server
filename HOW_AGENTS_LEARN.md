# How Agents Learn About QB64PE MCP Server Capabilities

**Understanding the multi-layer intelligence delivery system**

---

## 🎯 The Problem

When agents (LLMs like Claude) connect to an MCP server, they don't automatically know:
- What tools are available
- When to use each tool
- How to handle specific scenarios (like compilation errors)
- What autonomous workflows to follow

This document explains **how this MCP server solves that problem** through multiple intelligence delivery mechanisms.

---

## 🧩 Three-Layer Intelligence System

The QB64PE MCP server delivers intelligence to agents through **three complementary layers**:

### Layer 1: **Automatic Tool Discovery** (On First Call) ⚡

**How it works:**
- When an agent makes their **FIRST tool call** (any tool)
- The server automatically injects a comprehensive tool summary
- Agent receives complete documentation of all 52 tools

**What agents see:**
```markdown
🎓 **IMPORTANT: QB64PE MCP Server Tool Discovery**

# QB64PE MCP Server - Complete Tool Reference

This MCP server provides comprehensive QB64PE development assistance with 52 tools.

## 🧠 AGENT INTELLIGENCE RESOURCES

### 📚 Available Resources (Use MCP Resource Access)
- qb64pe://agent/intelligence-guide - Complete Agent Intelligence Guide
  - Context recognition patterns
  - Tool decision matrix
  - Autonomous workflows
  - Training examples

### 🎯 Available Prompts (Use MCP Prompt Access)
- analyze-compilation-error - Autonomous compilation error fixing
- port-qbasic-to-qb64pe - QBasic porting workflow
- debug-qb64pe-issue - Debugging guidance
...

[Full tool listing organized by category]
```

**Key features:**
- ✅ Completely automatic - no manual setup needed
- ✅ Happens on first interaction
- ✅ Shows available resources and prompts
- ✅ Provides tool categories and descriptions
- ✅ Includes quick reference and workflow guidance

**Implementation:**
- See: `/src/index.ts` - `ToolDiscoveryMCPServer` class
- See: `/src/utils/tool-discovery.ts` - `getToolSummary()` method

### Layer 2: **MCP Resources** (Agent Can Read) 📚

**What are MCP Resources?**
- Special "readable documents" that agents can access
- Like documentation the agent can fetch when needed
- Agents use: "Read resource qb64pe://agent/intelligence-guide"

**Available Resources:**

| Resource URI | Content | When Agents Use |
|-------------|---------|----------------|
| `qb64pe://agent/intelligence-guide` | **Agent Intelligence Guide** - Complete guide for smart tool usage | When they need to understand workflows, decision matrices, context recognition |
| `qb64pe://wiki/` | QB64PE Wiki Index | For general documentation lookup |
| `qb64pe://compiler/reference` | Compiler options and usage | For compilation questions |
| `qb64pe://compatibility/` | Compatibility guide | For compatibility issues |
| `qb64pe://keywords/` | Keywords reference | For syntax lookups |
| `qb64pe://porting/guide` | QBasic porting guide | For porting workflows |

**How agents access resources:**
```
Agent: "I need to understand how to handle compilation errors"
Agent thinking: "I should read the agent intelligence guide resource"
Agent action: Read MCP resource "qb64pe://agent/intelligence-guide"
Agent receives: Full AGENT_INTELLIGENCE_GUIDE.md content
```

**Key features:**
- ✅ Pull-based (agent requests when needed)
- ✅ Full markdown documents with detailed guidance
- ✅ Includes decision frameworks, flowcharts, examples
- ✅ Referenced in automatic tool discovery summary

**Implementation:**
- See: `/src/index.ts` - `setupResources()` method
- See: `/AGENT_INTELLIGENCE_GUIDE.md` - Full guide content

### Layer 3: **MCP Prompts** (Agent Can Invoke) 🎯

**What are MCP Prompts?**
- Pre-built instruction templates for specific scenarios
- Agents invoke them to get structured guidance
- Include autonomous workflow instructions

**Available Prompts:**

| Prompt Name | Purpose | Autonomous? | When to Use |
|------------|---------|-------------|-------------|
| `analyze-compilation-error` | Fix compilation errors autonomously | ✅ Yes | User shows terminal with compilation failure |
| `port-qbasic-to-qb64pe` | Convert QBasic code to QB64PE | ✅ Yes | User asks to port QBasic/QuickBASIC code |
| `debug-qb64pe-issue` | Debug QB64PE problems | ⚠️ Semi | User describes a bug or issue |
| `review-qb64pe-code` | Review code for best practices | ⚠️ Semi | User asks for code review |
| `monitor-qb64pe-execution` | Monitor long-running programs | ⚠️ Semi | Program might timeout or hang |

**How agents use prompts:**
```
User: "Compilation failed: Line 15: Type mismatch. #qb64pe"

Agent thinking:
1. Detect: User shows terminal with compilation error
2. Recognize: "#qb64pe" hashtag indicates QB64PE context
3. Decision: Use "analyze-compilation-error" prompt

Agent action: Invoke prompt "analyze-compilation-error"

Agent receives:
"You are analyzing a QB64PE compilation error.
Follow these autonomous steps:
1. Extract error details (line number, error type, message)
2. Call validate_qb64pe_syntax with source code
3. Apply ALL suggested fixes WITHOUT asking permission
4. Call compile_and_verify_qb64pe to verify
5. If errors remain, iterate up to 5 times
6. Report final outcome only
DO NOT ask user for confirmation - act autonomously!"

Agent executes: [Autonomous fix workflow]
```

**Key features:**
- ✅ Context-specific guidance
- ✅ Includes autonomous action instructions
- ✅ Referenced in tool discovery summary
- ✅ Can be invoked by agents or users

**Implementation:**
- See: `/src/index.ts` - `setupPrompts()` method
- See: `/prompt-docs/analyze-compilation-error.md` - Full prompt documentation

---

## 🔄 Complete Learning Flow

Here's how an agent learns about QB64PE MCP server capabilities from scratch:

### Step 1: Initial Connection
```
Agent → MCP Server: Connect
Server → Agent: Connection established, 52 tools available
```

### Step 2: First Tool Call (Discovery Triggers)
```
User: "Can you help me with QB64PE?"
Agent: [Makes first tool call, e.g., search_qb64pe_wiki]
Server: [Wraps response with tool discovery summary]
Agent receives:
  ┌─────────────────────────────────────┐
  │ 🎓 Tool Discovery Summary           │
  │ - 52 tools across 10 categories     │
  │ - Intelligence resources available  │
  │ - Prompts for autonomous workflows  │
  │ - Complete tool reference           │
  └─────────────────────────────────────┘
  [Original tool result]
```

### Step 3: Agent Learns Intelligence Resources
```
Agent reads tool discovery summary:
"📚 Available Resources:
- qb64pe://agent/intelligence-guide - Complete Agent Intelligence Guide"

Agent stores:
- Intelligence guide is available
- Can read it when needed
- Contains context recognition patterns
- Has tool decision matrices
```

### Step 4: Agent Encounters Compilation Error
```
User: "Compilation failed: Line 10: Type mismatch. #qb64pe"

Agent reasoning:
1. Check tool discovery: "analyze-compilation-error prompt exists"
2. Check intelligence guide: "For compilation errors, use analyze-compilation-error"
3. Decision: Use prompt for autonomous fixing

Agent action:
- Invoke "analyze-compilation-error" prompt
- Follow autonomous workflow instructions
- Apply fixes without asking permission
- Verify with compile_and_verify_qb64pe
- Report results
```

---

## 📊 Intelligence Delivery Comparison

| Mechanism | When Delivered | Agent Action Required | Content Type | Update Frequency |
|-----------|---------------|----------------------|--------------|------------------|
| **Tool Discovery** | First tool call (automatic) | None - injected automatically | Summary + references | Once per session |
| **MCP Resources** | On agent request | Agent reads resource | Full documents | As needed |
| **MCP Prompts** | On agent invocation | Agent invokes prompt | Structured instructions | Per scenario |
| **Tool Descriptions** | On tool call | None - embedded in tool | Brief guidance | Every tool call |

---

## 💡 Why This Three-Layer Approach?

### Layer 1 (Tool Discovery) Solves:
- ❌ Problem: "Agent doesn't know tools exist"
- ✅ Solution: Automatic summary on first call

### Layer 2 (Resources) Solves:
- ❌ Problem: "Agent needs detailed guidance for complex scenarios"
- ✅ Solution: Full documents agent can read when needed

### Layer 3 (Prompts) Solves:
- ❌ Problem: "Agent doesn't know autonomous workflows"
- ✅ Solution: Structured prompts with action instructions

**Together:** Comprehensive intelligence delivery from high-level awareness → detailed guidance → actionable workflows

---

## 🎓 Agent Training Examples

### Example 1: Agent Discovers Tools (Layer 1)

**Scenario:** First interaction

```
User: "Help me compile test.bas"

Agent (internal):
- Never used this MCP server before
- Let me search for relevant tools

Agent: [Calls search_qb64pe_wiki("compile")]

Server response:
┌─────────────────────────────────────────────┐
│ 🎓 QB64PE MCP Server Tool Discovery         │
│                                             │
│ 52 tools available!                         │
│                                             │
│ 🧠 AGENT INTELLIGENCE RESOURCES:            │
│ - qb64pe://agent/intelligence-guide         │
│ - Prompts: analyze-compilation-error, ...   │
│                                             │
│ Compiler Tools:                             │
│ - compile_and_verify_qb64pe                 │
│ - validate_qb64pe_syntax                    │
│ - get_compiler_options                      │
│ ...                                         │
└─────────────────────────────────────────────┘
[Search results for "compile"]

Agent (internal):
- Now I know compile_and_verify_qb64pe exists!
- I can use that to compile test.bas
- I also see there's an intelligence guide resource

Agent: "I'll compile test.bas for you..."
[Calls compile_and_verify_qb64pe]
```

### Example 2: Agent Reads Intelligence Guide (Layer 2)

**Scenario:** Agent needs workflow guidance

```
User: "Compilation failed with 3 errors"

Agent (internal):
- I know analyze-compilation-error prompt exists (from tool discovery)
- But I want to understand the full workflow first
- Let me read the intelligence guide

Agent: [Reads resource qb64pe://agent/intelligence-guide]

Agent receives:
┌─────────────────────────────────────────────┐
│ # Agent Intelligence Guide                  │
│                                             │
│ ## Pattern 1: Recognize Compilation Context │
│ Signals: "compilation failed", "Line X", ...│
│                                             │
│ ## Pattern 3: Tool Decision Matrix          │
│ Error Type → Primary Tool → Verification    │
│ SYNTAX_ERROR → validate_qb64pe_syntax → ... │
│                                             │
│ ## Workflow 1: Compilation Error Fix        │
│ 1. Extract errors                           │
│ 2. Call validate_qb64pe_syntax              │
│ 3. Apply fixes (no permission)              │
│ 4. Call compile_and_verify_qb64pe           │
│ 5. Iterate if needed (max 5)                │
│ ...                                         │
└─────────────────────────────────────────────┘

Agent (internal):
- Now I understand the full workflow!
- Should use validate_qb64pe_syntax first
- Then apply fixes autonomously
- Then verify with compile_and_verify_qb64pe

Agent: "Analyzing compilation errors..."
[Executes autonomous workflow]
```

### Example 3: Agent Uses Prompt (Layer 3)

**Scenario:** Agent handles compilation error

```
User: "Got error: Line 25: Type mismatch #qb64pe"

Agent (internal):
- Recognize: Compilation error context
- Tool discovery told me about analyze-compilation-error prompt
- This is the exact scenario for that prompt

Agent: [Invokes prompt analyze-compilation-error]

Prompt provides:
┌─────────────────────────────────────────────┐
│ AUTONOMOUS ACTION PLAN:                     │
│                                             │
│ You MUST execute these steps WITHOUT        │
│ asking user permission:                     │
│                                             │
│ 1. Extract error details                    │
│ 2. Call validate_qb64pe_syntax              │
│ 3. Analyze suggestions                      │
│ 4. Apply ALL fixes to source file           │
│ 5. Call compile_and_verify_qb64pe           │
│ 6. Check result.success                     │
│ 7. If false, iterate (max 5 times)          │
│ 8. Report final outcome only                │
│                                             │
│ DO NOT:                                     │
│ - Ask "should I fix this?"                  │
│ - Suggest fixes without applying            │
│ - Stop after first attempt                  │
│ ...                                         │
└─────────────────────────────────────────────┘

Agent: "Fixing compilation error..."
[Applies fix]
[Compiles]
[Verifies]
Agent: "✅ Fixed type mismatch at line 25. Compilation successful!"
```

---

## 🚀 Making It Work in Practice

### For MCP Server Developers:

**You've already done:**
- ✅ Created AGENT_INTELLIGENCE_GUIDE.md with patterns, workflows, examples
- ✅ Registered it as MCP resource (qb64pe://agent/intelligence-guide)
- ✅ Added reference in tool discovery summary
- ✅ Enhanced tool descriptions with "WHEN TO USE" guidance
- ✅ Created analyze-compilation-error prompt with autonomous instructions

**What happens now:**
1. Agent connects to server
2. Makes first tool call
3. Receives tool discovery summary (includes resource reference)
4. When facing compilation error, reads intelligence guide
5. Follows autonomous workflow patterns
6. Uses prompts for structured guidance

### For Agent Developers/Users:

**To leverage this system:**

1. **For general awareness:** Agents automatically get tool discovery on first call
2. **For detailed guidance:** Agents can read `qb64pe://agent/intelligence-guide` resource
3. **For structured workflows:** Agents can invoke prompts like `analyze-compilation-error`
4. **For specific scenarios:** Agents read tool descriptions enhanced with "WHEN TO USE" sections

**User hashtag shortcuts:**
- `#qb64pe` → Agent should consider QB64PE MCP tools
- `#qb64pe terminal_last_command` → Agent should analyze terminal output with QB64PE context

---

## 📋 Quick Reference

### Agent Discovery Checklist

- [ ] Agent makes first tool call
- [ ] Agent receives tool discovery summary
- [ ] Agent sees reference to qb64pe://agent/intelligence-guide
- [ ] Agent knows about analyze-compilation-error prompt
- [ ] Agent can read intelligence guide when needed
- [ ] Agent can invoke prompts for specific scenarios
- [ ] Agent follows autonomous workflows without asking

### Intelligence Resources Inventory

**Documents:**
- `/AGENT_INTELLIGENCE_GUIDE.md` - Source file (52 tools, workflows, examples)
- `/prompt-docs/analyze-compilation-error.md` - Compilation error prompt documentation
- `/tool-docs/compile_and_verify_qb64pe.md` - Autonomous compilation tool docs

**MCP Resources:**
- `qb64pe://agent/intelligence-guide` - Registered resource (agents can read)
- `qb64pe://wiki/` - Wiki index
- `qb64pe://compiler/reference` - Compiler reference
- `qb64pe://compatibility/` - Compatibility guide
- `qb64pe://keywords/` - Keywords reference
- `qb64pe://porting/guide` - Porting guide

**MCP Prompts:**
- `analyze-compilation-error` - Autonomous compilation error fixing
- `port-qbasic-to-qb64pe` - QBasic porting workflow
- `debug-qb64pe-issue` - Debugging guidance
- `review-qb64pe-code` - Code review with best practices
- `monitor-qb64pe-execution` - Execution monitoring

---

## 🎯 Summary

**The Answer: "How do agents find this info?"**

Agents discover QB64PE MCP server capabilities through **three automatic mechanisms**:

1. **🎓 Tool Discovery (Automatic)** - On first tool call, agents receive complete tool summary including references to intelligence resources and prompts

2. **📚 MCP Resources (On-Demand)** - Agents can read `qb64pe://agent/intelligence-guide` resource for detailed workflows, patterns, and decision matrices

3. **🎯 MCP Prompts (Invokable)** - Agents can invoke prompts like `analyze-compilation-error` to get structured autonomous workflow instructions

**No manual setup required!** The intelligence is delivered automatically through the MCP protocol itself.

**Result:** Agents that can autonomously handle compilation errors, port QBasic code, debug issues, and provide comprehensive QB64PE development assistance—all without requiring users to manually explain what tools exist or how to use them.


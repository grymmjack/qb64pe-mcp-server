import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { QB64PEWikiService } from "./services/wiki-service.js";
import { QB64PECompilerService } from "./services/compiler-service.js";
import { QB64PESyntaxService } from "./services/syntax-service.js";

/**
 * Main MCP Server for QB64PE Development
 */
class QB64PEMCPServer {
  private server: McpServer;
  private wikiService: QB64PEWikiService;
  private compilerService: QB64PECompilerService;
  private syntaxService: QB64PESyntaxService;

  constructor() {
    this.server = new McpServer({
      name: "qb64pe-mcp-server",
      version: "1.0.0"
    });

    // Initialize services
    this.wikiService = new QB64PEWikiService();
    this.compilerService = new QB64PECompilerService();
    this.syntaxService = new QB64PESyntaxService();
  }

  /**
   * Initialize and configure the MCP server
   */
  async initialize(): Promise<void> {
    await this.setupTools();
    await this.setupResources();
    await this.setupPrompts();
  }

  /**
   * Setup tool implementations
   */
  private async setupTools(): Promise<void> {
    // Wiki search tool
    this.server.registerTool(
      "search_qb64pe_wiki",
      {
        title: "Search QB64PE Wiki",
        description: "Search the QB64PE wiki for documentation, tutorials, and reference materials",
        inputSchema: {
          query: z.string().describe("Search query for QB64PE wiki content"),
          category: z.enum([
            "keywords", 
            "functions", 
            "statements", 
            "operators", 
            "data-types", 
            "tutorials", 
            "examples",
            "all"
          ]).optional().describe("Specific category to search in")
        }
      },
      async ({ query, category }) => {
        try {
          const results = await this.wikiService.searchWiki(query, category);
          return {
            content: [{
              type: "text",
              text: JSON.stringify(results, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error searching wiki: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Get QB64PE page content
    this.server.registerTool(
      "get_qb64pe_page",
      {
        title: "Get QB64PE Wiki Page",
        description: "Retrieve detailed content from a specific QB64PE wiki page",
        inputSchema: {
          pageTitle: z.string().describe("Title or URL of the QB64PE wiki page"),
          includeExamples: z.boolean().optional().describe("Whether to include code examples")
        }
      },
      async ({ pageTitle, includeExamples = true }) => {
        try {
          const content = await this.wikiService.getPageContent(pageTitle, includeExamples);
          return {
            content: [{
              type: "text",
              text: content
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error fetching page: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Compiler options tool
    this.server.registerTool(
      "get_compiler_options",
      {
        title: "Get QB64PE Compiler Options",
        description: "Get information about QB64PE compiler command-line options and flags",
        inputSchema: {
          platform: z.enum(["windows", "macos", "linux", "all"]).optional().describe("Target platform"),
          optionType: z.enum(["compilation", "debugging", "optimization", "all"]).optional().describe("Type of compiler options")
        }
      },
      async ({ platform = "all", optionType = "all" }) => {
        try {
          const options = await this.compilerService.getCompilerOptions(platform, optionType);
          return {
            content: [{
              type: "text",
              text: JSON.stringify(options, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error getting compiler options: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Syntax validation tool
    this.server.registerTool(
      "validate_qb64pe_syntax",
      {
        title: "Validate QB64PE Syntax",
        description: "Validate QB64PE code syntax and suggest corrections",
        inputSchema: {
          code: z.string().describe("QB64PE code to validate"),
          checkLevel: z.enum(["basic", "strict", "best-practices"]).optional().describe("Level of syntax checking")
        }
      },
      async ({ code, checkLevel = "basic" }) => {
        try {
          const validation = await this.syntaxService.validateSyntax(code, checkLevel);
          return {
            content: [{
              type: "text",
              text: JSON.stringify(validation, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error validating syntax: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Debugging help tool
    this.server.registerTool(
      "get_debugging_help",
      {
        title: "Get QB64PE Debugging Help",
        description: "Get help with debugging QB64PE programs using PRINT statements, $CONSOLE, etc.",
        inputSchema: {
          issue: z.string().describe("Description of the debugging issue"),
          platform: z.enum(["windows", "macos", "linux", "all"]).optional().describe("Target platform")
        }
      },
      async ({ issue, platform = "all" }) => {
        try {
          const help = await this.compilerService.getDebuggingHelp(issue, platform);
          return {
            content: [{
              type: "text",
              text: help
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error getting debugging help: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );
  }

  /**
   * Setup resource implementations
   */
  private async setupResources(): Promise<void> {
    // QB64PE wiki base resource
    this.server.registerResource(
      "qb64pe-wiki",
      "qb64pe://wiki/",
      {
        title: "QB64PE Wiki",
        description: "Access to the QB64PE wiki documentation",
        mimeType: "text/markdown"
      },
      async (uri) => {
        const wikiIndex = await this.wikiService.getWikiIndex();
        return {
          contents: [{
            uri: uri.href,
            text: wikiIndex
          }]
        };
      }
    );

    // Compiler reference resource
    this.server.registerResource(
      "qb64pe-compiler",
      "qb64pe://compiler/reference",
      {
        title: "QB64PE Compiler Reference",
        description: "Complete reference for QB64PE compiler options and usage",
        mimeType: "text/markdown"
      },
      async (uri) => {
        const compilerRef = await this.compilerService.getCompilerReference();
        return {
          contents: [{
            uri: uri.href,
            text: compilerRef
          }]
        };
      }
    );
  }

  /**
   * Setup prompt templates
   */
  private async setupPrompts(): Promise<void> {
    // Code review prompt
    this.server.registerPrompt(
      "review-qb64pe-code",
      {
        title: "Review QB64PE Code",
        description: "Review QB64PE code for best practices, syntax issues, and optimizations",
        argsSchema: {
          code: z.string().describe("QB64PE code to review"),
          focusAreas: z.string().optional().describe("Comma-separated list of areas to focus the review on: syntax, performance, best-practices, cross-platform, debugging")
        }
      },
      ({ code, focusAreas = "syntax, best-practices" }) => ({
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `Please review this QB64PE code focusing on: ${focusAreas}

Code to review:
\`\`\`basic
${code}
\`\`\`

Please provide:
1. Syntax validation and corrections
2. Best practice recommendations
3. Cross-platform compatibility notes
4. Performance optimization suggestions
5. Debugging recommendations

Ensure all suggestions are specific to QB64PE and not other BASIC dialects.`
          }
        }]
      })
    );

    // Debugging helper prompt
    this.server.registerPrompt(
      "debug-qb64pe-issue",
      {
        title: "Debug QB64PE Issue",
        description: "Help debug QB64PE programs with step-by-step guidance",
        argsSchema: {
          problemDescription: z.string().describe("Description of the problem or error"),
          code: z.string().optional().describe("Relevant QB64PE code (if any)"),
          platform: z.enum(["windows", "macos", "linux"]).optional().describe("Target platform")
        }
      },
      ({ problemDescription, code, platform }) => ({
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `Help me debug this QB64PE issue:

Problem: ${problemDescription}
${platform ? `Platform: ${platform}` : ''}
${code ? `\n\nCode:\n\`\`\`basic\n${code}\n\`\`\`` : ''}

Please provide:
1. Likely causes of the issue
2. Step-by-step debugging approach using QB64PE tools
3. PRINT statement debugging strategies
4. $CONSOLE usage for debugging
5. Platform-specific considerations (if applicable)
6. Common QB64PE pitfalls to check

Focus specifically on QB64PE debugging techniques and tools.`
          }
        }]
      })
    );
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("QB64PE MCP Server started successfully");
  }
}

// Main execution
async function main(): Promise<void> {
  const server = new QB64PEMCPServer();
  await server.initialize();
  await server.start();
}

// Error handling
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

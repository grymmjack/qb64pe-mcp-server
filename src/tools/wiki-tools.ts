/**
 * Wiki-related tool registrations for QB64PE MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createMCPResponse,
  createMCPError,
  createTextToolHandler,
} from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";

/**
 * Register all wiki-related tools
 */
export function registerWikiTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  // Wiki search tool
  server.registerTool(
    "search_qb64pe_wiki",
    {
      title: "Search QB64PE Wiki",
      description:
        "Search the QB64PE wiki for documentation, tutorials, and reference materials",
      inputSchema: {
        query: z.string().describe("Search query for QB64PE wiki content"),
        category: z
          .enum([
            "keywords",
            "functions",
            "statements",
            "operators",
            "data-types",
            "tutorials",
            "examples",
            "all",
          ])
          .optional()
          .describe("Specific category to search in"),
      },
    },
    async ({ query, category }) => {
      try {
        const results = await services.wikiService.searchWiki(query, category);
        return createMCPResponse(results);
      } catch (error) {
        return createMCPError(error, "searching wiki");
      }
    },
  );

  // Get QB64PE page content
  server.registerTool(
    "get_qb64pe_page",
    {
      title: "Get QB64PE Wiki Page",
      description: "Retrieve detailed content from a specific QB64PE wiki page",
      inputSchema: {
        pageTitle: z.string().describe("Title or URL of the QB64PE wiki page"),
        includeExamples: z
          .boolean()
          .optional()
          .describe("Whether to include code examples"),
      },
    },
    createTextToolHandler(async ({ pageTitle, includeExamples = true }) => {
      return await services.wikiService.getPageContent(
        pageTitle,
        includeExamples,
      );
    }, "fetching page"),
  );

  // Get wiki categories
  server.registerTool(
    "get_qb64pe_wiki_categories",
    {
      title: "Get QB64PE Wiki Categories",
      description:
        "Get all available QB64PE wiki categories for organizing keywords and functions",
      inputSchema: {},
    },
    async () => {
      try {
        const categories = await services.wikiService.getWikiCategories();
        return createMCPResponse(categories);
      } catch (error) {
        return createMCPError(error, "getting wiki categories");
      }
    },
  );
}

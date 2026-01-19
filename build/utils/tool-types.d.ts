/**
 * Type definitions for tool registration
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
/**
 * Tool registration function type
 */
export type ToolRegistrar = (server: McpServer, services: ServiceContainer) => void;
/**
 * Container for all services used by tools
 */
export interface ServiceContainer {
    wikiService: any;
    compilerService: any;
    syntaxService: any;
    compatibilityService: any;
    keywordsService: any;
    executionService: any;
    installationService: any;
    portingService: any;
    screenshotService: any;
    screenshotWatcher: any;
    feedbackService: any;
    debuggingService: any;
    loggingService: any;
    validationService: any;
    sessionProblemsService: any;
    fileStructureService: any;
}
//# sourceMappingURL=tool-types.d.ts.map
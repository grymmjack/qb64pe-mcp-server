/**
 * QB64PE File Structure Validation Tools
 * 
 * MCP tools for validating .BI/.BM file structure according to QB64_GJ_LIB conventions
 */

import { ServiceContainer } from "../utils/tool-types.js";

/**
 * Register file structure validation tools
 */
export function registerFileStructureTools(
  server: any,
  services: ServiceContainer
): void {
  // Tool 1: Validate .BI file structure
  server.tool(
    "validate_bi_file_structure",
    "Validate QB64_GJ_LIB .BI (header/interface) file structure. Ensures file contains only TYPE definitions, CONST declarations, DIM SHARED variables, and optionally DECLARE statements. Detects SUB/FUNCTION implementations that should be in .BM files.",
    {
      content: {
        type: "string",
        description: "Content of the .BI file to validate",
      },
      filename: {
        type: "string",
        description: "Filename for context (optional)",
      },
    },
    async ({
      content,
      filename,
    }: {
      content: string;
      filename?: string;
    }) => {
      const result = services.fileStructureService.validateBIFile(
        content
      );

      // Format output
      let output = `# .BI File Structure Validation${filename ? `: ${filename}` : ""}\n\n`;
      output += `**Status:** ${result.isValid ? "✅ VALID" : "❌ INVALID"}\n\n`;

      if (result.summary.totalIssues > 0) {
        output += `## Issues Found\n`;
        output += `- Errors: ${result.summary.errors}\n`;
        output += `- Warnings: ${result.summary.warnings}\n`;
        output += `- Info: ${result.summary.info}\n\n`;

        // Group by severity
        const errors = result.issues.filter(
          (i: any) => i.severity === "error"
        );
        const warnings = result.issues.filter(
          (i: any) => i.severity === "warning"
        );
        const info = result.issues.filter((i: any) => i.severity === "info");

        if (errors.length > 0) {
          output += `### ❌ Errors\n`;
          errors.forEach((issue: any) => {
            output += `**Line ${issue.line}:** ${issue.issue}\n`;
            output += `  Code: \`${issue.content}\`\n`;
            output += `  Fix: ${issue.suggestion}\n\n`;
          });
        }

        if (warnings.length > 0) {
          output += `### ⚠️ Warnings\n`;
          warnings.forEach((issue: any) => {
            output += `**Line ${issue.line}:** ${issue.issue}\n`;
            output += `  Code: \`${issue.content}\`\n`;
            output += `  Suggestion: ${issue.suggestion}\n\n`;
          });
        }

        if (info.length > 0) {
          output += `### ℹ️ Information\n`;
          info.forEach((issue: any) => {
            output += `**Line ${issue.line}:** ${issue.issue}\n`;
            output += `  Code: \`${issue.content}\`\n`;
            output += `  Note: ${issue.suggestion}\n\n`;
          });
        }
      }

      output += `## Recommendations\n`;
      result.recommendations.forEach((rec: string) => {
        output += `- ${rec}\n`;
      });

      output += `\n## QB64_GJ_LIB .BI File Rules\n`;
      output += `✅ **Should contain:**\n`;
      output += `- TYPE definitions\n`;
      output += `- CONST declarations\n`;
      output += `- DIM SHARED variables\n`;
      output += `- $INCLUDEONCE directive\n\n`;
      output += `❌ **Should NOT contain:**\n`;
      output += `- SUB/FUNCTION implementations (move to .BM)\n`;
      output += `- Executable code\n`;

      return {
        content: [
          {
            type: "text",
            text: output,
          },
        ],
      };
    }
  );

  // Tool 2: Validate .BM file structure
  server.tool(
    "validate_bm_file_structure",
    "Validate QB64_GJ_LIB .BM (implementation) file structure. Ensures file contains ONLY SUB/FUNCTION implementations. Detects TYPE definitions, CONST declarations, and DIM SHARED statements that should be in .BI files. CRITICAL for avoiding 'Statement cannot be placed between SUB/FUNCTIONs' errors.",
    {
      content: {
        type: "string",
        description: "Content of the .BM file to validate",
      },
      filename: {
        type: "string",
        description: "Filename for context (optional)",
      },
    },
    async ({
      content,
      filename,
    }: {
      content: string;
      filename?: string;
    }) => {
      const result = services.fileStructureService.validateBMFile(
        content
      );

      let output = `# .BM File Structure Validation${filename ? `: ${filename}` : ""}\n\n`;
      output += `**Status:** ${result.isValid ? "✅ VALID" : "❌ INVALID"}\n\n`;

      if (result.summary.totalIssues > 0) {
        output += `## Issues Found\n`;
        output += `- Errors: ${result.summary.errors}\n`;
        output += `- Warnings: ${result.summary.warnings}\n`;
        output += `- Info: ${result.summary.info}\n\n`;

        const errors = result.issues.filter(
          (i: any) => i.severity === "error"
        );
        const warnings = result.issues.filter(
          (i: any) => i.severity === "warning"
        );

        if (errors.length > 0) {
          output += `### ❌ Errors (MUST FIX)\n`;
          errors.forEach((issue: any) => {
            output += `**Line ${issue.line}:** ${issue.issue}\n`;
            output += `  Code: \`${issue.content}\`\n`;
            output += `  Fix: ${issue.suggestion}\n\n`;
          });
        }

        if (warnings.length > 0) {
          output += `### ⚠️ Warnings\n`;
          warnings.forEach((issue: any) => {
            output += `**Line ${issue.line}:** ${issue.issue}\n`;
            output += `  Suggestion: ${issue.suggestion}\n\n`;
          });
        }
      }

      output += `## Recommendations\n`;
      result.recommendations.forEach((rec: string) => {
        output += `- ${rec}\n`;
      });

      output += `\n## QB64_GJ_LIB .BM File Rules\n`;
      output += `✅ **Should contain:**\n`;
      output += `- SUB/FUNCTION implementations ONLY\n`;
      output += `- $INCLUDEONCE directive\n`;
      output += `- Local DIM/CONST inside functions (OK)\n\n`;
      output += `❌ **Should NOT contain:**\n`;
      output += `- TYPE definitions (move to .BI)\n`;
      output += `- CONST declarations (move to .BI)\n`;
      output += `- DIM SHARED variables (move to .BI)\n`;
      output += `- Executable code outside SUB/FUNCTION\n`;

      return {
        content: [
          {
            type: "text",
            text: output,
          },
        ],
      };
    }
  );

  // Tool 3: Validate QB64_GJ_LIB file pair
  server.tool(
    "validate_qb64_gj_lib_file_pair",
    "Validate a matched .BI/.BM file pair for QB64_GJ_LIB architecture compliance. Checks both files and ensures proper separation of declarations (.BI) and implementations (.BM). Essential before compilation to avoid structural errors.",
    {
      biContent: {
        type: "string",
        description: "Content of the .BI file",
      },
      bmContent: {
        type: "string",
        description: "Content of the .BM file",
      },
      libraryName: {
        type: "string",
        description: "Name of the library (for context)",
      },
    },
    async ({
      biContent,
      bmContent,
      libraryName,
    }: {
      biContent: string;
      bmContent: string;
      libraryName?: string;
    }) => {
      const result =
        services.fileStructureService.followsGJLibConventions(
          biContent,
          bmContent
        );

      let output = `# QB64_GJ_LIB File Pair Validation${libraryName ? `: ${libraryName}` : ""}\n\n`;
      output += `**Status:** ${result.follows ? "✅ COMPLIANT" : "❌ NON-COMPLIANT"}\n\n`;

      if (result.issues.length > 0) {
        output += `## Issues Found\n`;
        result.issues.forEach((issue: string) => {
          output += `- ${issue}\n`;
        });
        output += `\n`;
      }

      if (result.suggestions.length > 0) {
        output += `## Suggestions\n`;
        result.suggestions.forEach((suggestion: string) => {
          output += `- ${suggestion}\n`;
        });
        output += `\n`;
      }

      output += `## QB64_GJ_LIB Architecture\n`;
      output += `\`\`\`basic\n`;
      output += `' ${libraryName || "LIBRARY"}.BI - Header/Interface\n`;
      output += `$INCLUDEONCE\n`;
      output += `'' Documentation block\n\n`;
      output += `' TYPE definitions\n`;
      output += `TYPE custom_type\n`;
      output += `    field AS STRING\n`;
      output += `END TYPE\n\n`;
      output += `' Constants\n`;
      output += `CONST MAX_VALUE = 100\n\n`;
      output += `' Shared variables\n`;
      output += `DIM SHARED library_initialized AS INTEGER\n\n`;
      output += `' ${libraryName || "LIBRARY"}.BM - Implementation\n`;
      output += `$INCLUDEONCE\n\n`;
      output += `' SUB/FUNCTION implementations ONLY\n`;
      output += `SUB initialize_library\n`;
      output += `    library_initialized = 1\n`;
      output += `END SUB\n`;
      output += `\`\`\`\n`;

      return {
        content: [
          {
            type: "text",
            text: output,
          },
        ],
      };
    }
  );

  // Tool 4: Quick structure check
  server.tool(
    "quick_check_qb64_file_structure",
    "Quick check of any QB64PE file structure. Auto-detects .BI or .BM and validates accordingly. Use this before compiling to catch common structural errors early.",
    {
      filename: {
        type: "string",
        description: "Filename (with .BI or .BM extension)",
      },
      content: {
        type: "string",
        description: "File content to validate",
      },
    },
    async ({
      filename,
      content,
    }: {
      filename: string;
      content: string;
    }) => {
      const result = services.fileStructureService.validateFile(
        filename,
        content
      );

      let output = `# Quick Structure Check: ${filename}\n\n`;

      if (result.fileType === "other") {
        output += `This file is not part of .BI/.BM architecture.\n`;
        output += `No structural validation needed.\n`;
        return {
          content: [{ type: "text", text: output }],
        };
      }

      output += `**File Type:** ${result.fileType}\n`;
      output += `**Status:** ${result.isValid ? "✅ VALID" : "❌ INVALID"}\n`;
      output += `**Issues:** ${result.summary.errors} errors, ${result.summary.warnings} warnings\n\n`;

      if (!result.isValid) {
        output += `## Top Issues\n`;
        result.issues.slice(0, 5).forEach((issue: any) => {
          output += `- Line ${issue.line}: ${issue.issue}\n`;
        });

        if (result.issues.length > 5) {
          output += `\n... and ${result.issues.length - 5} more issues.\n`;
          output += `Use validate_${result.fileType === ".BI" ? "bi" : "bm"}_file_structure for full details.\n`;
        }
      } else {
        output += `✅ File structure looks good!\n`;
      }

      return {
        content: [{ type: "text", text: output }],
      };
    }
  );
}

/**
 * Example: Integrating validation service into a tool
 *
 * This example shows how to refactor an existing tool to use
 * the validation service for better error handling and consistency.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ServiceContainer } from "../utils/tool-types.js";
import { createMCPResponse, createMCPError } from "../utils/mcp-helpers.js";

/**
 * BEFORE: Tool without validation service
 * - Manual validation scattered throughout
 * - Inconsistent error messages
 * - Duplicate validation logic
 */
function registerToolBefore(server: McpServer, services: ServiceContainer) {
  server.registerTool(
    "port_code_example_old",
    {
      title: "Port Code (Old)",
      description: "Example without validation service",
      inputSchema: {
        code: z.string().describe("Code to port"),
        dialect: z.string().describe("Source dialect"),
        outputPath: z.string().optional().describe("Output file path"),
      },
    },
    async ({ code, dialect, outputPath }) => {
      try {
        // Manual validation - repeated in every tool
        if (!code || code.trim().length === 0) {
          throw new Error("Code cannot be empty");
        }

        if (code.length > 100000) {
          throw new Error("Code is too large (max 100KB)");
        }

        const supportedDialects = ["qbasic", "quickbasic", "gwbasic"];
        if (!supportedDialects.includes(dialect)) {
          throw new Error(
            `Dialect must be one of: ${supportedDialects.join(", ")}`,
          );
        }

        if (outputPath) {
          if (outputPath.includes("|") || outputPath.includes("?")) {
            throw new Error("Output path contains invalid characters");
          }
        }

        // Process the code...
        const result = await services.portingService.portCode(code, dialect);

        return createMCPResponse({
          ported: result,
          dialect: dialect,
        });
      } catch (error) {
        return createMCPError(error, "porting code");
      }
    },
  );
}

/**
 * AFTER: Tool with validation service
 * - Centralized validation logic
 * - Consistent error messages
 * - Reusable validators
 * - Better separation of concerns
 */
function registerToolAfter(server: McpServer, services: ServiceContainer) {
  server.registerTool(
    "port_code_example_new",
    {
      title: "Port Code (New)",
      description: "Example with validation service",
      inputSchema: {
        code: z.string().describe("Code to port"),
        dialect: z.string().describe("Source dialect"),
        outputPath: z.string().optional().describe("Output file path"),
      },
    },
    async ({ code, dialect, outputPath }) => {
      try {
        // Validate all inputs using validation service
        const validations = [
          // Validate code with specific constraints
          services.validationService.validateCode(code, {
            minLength: 1,
            maxLength: 100000,
            allowEmpty: false,
          }),

          // Validate dialect is one of supported values
          services.validationService.validateEnum(dialect, "dialect", [
            "qbasic",
            "quickbasic",
            "gwbasic",
          ]),
        ];

        // Validate optional output path if provided
        if (outputPath) {
          validations.push(
            services.validationService.validatePath(outputPath, {
              allowRelative: true,
              allowedExtensions: [".bas", ".bi"],
            }),
          );
        }

        // Combine all validation results
        const validation = services.validationService.combineResults(
          ...validations,
        );

        // Check for errors
        if (!validation.isValid) {
          return createMCPError(
            new Error(`Validation failed: ${validation.errors.join("; ")}`),
            "validating inputs",
          );
        }

        // Log warnings if any
        if (validation.warnings.length > 0) {
          console.warn("Validation warnings:", validation.warnings.join("; "));
        }

        // Process the code (inputs are now validated)
        const result = await services.portingService.portCode(code, dialect);

        return createMCPResponse({
          ported: result,
          dialect: dialect,
          validationWarnings: validation.warnings,
        });
      } catch (error) {
        return createMCPError(error, "porting code");
      }
    },
  );
}

/**
 * ADVANCED: Custom validation with multiple steps
 */
function registerAdvancedTool(server: McpServer, services: ServiceContainer) {
  server.registerTool(
    "analyze_code_advanced",
    {
      title: "Analyze Code (Advanced)",
      description: "Example with complex validation logic",
      inputSchema: {
        files: z.array(z.string()).describe("Array of file paths"),
        maxFileSize: z.number().optional().describe("Max file size in bytes"),
        analysisDepth: z
          .string()
          .describe("Analysis depth: basic, standard, deep"),
      },
    },
    async ({ files, maxFileSize = 50000, analysisDepth }) => {
      try {
        // Step 1: Validate array parameter with custom item validator
        const filesValidation = services.validationService.validateArray(
          files,
          "files",
          {
            minLength: 1,
            maxLength: 10,
            itemValidator: (file) =>
              services.validationService.validatePath(file, {
                allowedExtensions: [".bas", ".bi", ".bm"],
              }),
          },
        );

        // Step 2: Validate numeric parameter
        const sizeValidation = services.validationService.validateNumber(
          maxFileSize,
          "maxFileSize",
          {
            min: 1024, // 1KB minimum
            max: 1048576, // 1MB maximum
            integer: true,
          },
        );

        // Step 3: Validate enum parameter
        const depthValidation = services.validationService.validateEnum(
          analysisDepth,
          "analysisDepth",
          ["basic", "standard", "deep"],
        );

        // Step 4: Combine all validations
        const allValidations = services.validationService.combineResults(
          filesValidation,
          sizeValidation,
          depthValidation,
        );

        // Step 5: Handle validation results
        if (!allValidations.isValid) {
          return createMCPError(
            new Error(allValidations.errors.join("; ")),
            "validating inputs",
          );
        }

        // Step 6: Process with validated inputs
        const analysisResults = await Promise.all(
          files.map((file) =>
            services.compatibilityService.analyzeFile(file, analysisDepth),
          ),
        );

        return createMCPResponse({
          results: analysisResults,
          filesAnalyzed: files.length,
          depth: analysisDepth,
          warnings: allValidations.warnings,
        });
      } catch (error) {
        return createMCPError(error, "analyzing code");
      }
    },
  );
}

/**
 * PATTERN: Validation helper function
 * Create reusable validation patterns for common tool inputs
 */
function createPortingInputValidator(validationService: any) {
  return (code: string, dialect: string, options: any = {}) => {
    const {
      maxCodeLength = 100000,
      allowedDialects = ["qbasic", "quickbasic", "gwbasic"],
    } = options;

    return validationService.combineResults(
      validationService.validateCode(code, {
        maxLength: maxCodeLength,
        allowEmpty: false,
      }),
      validationService.validateEnum(dialect, "dialect", allowedDialects),
    );
  };
}

// Usage of the helper
function registerToolWithHelper(server: McpServer, services: ServiceContainer) {
  const validatePortingInput = createPortingInputValidator(
    services.validationService,
  );

  server.registerTool(
    "port_code_with_helper",
    {
      title: "Port Code (With Helper)",
      description: "Example using validation helper",
      inputSchema: {
        code: z.string().describe("Code to port"),
        dialect: z.string().describe("Source dialect"),
      },
    },
    async ({ code, dialect }) => {
      try {
        // Use the reusable helper
        const validation = validatePortingInput(code, dialect);

        if (!validation.isValid) {
          return createMCPError(
            new Error(validation.errors.join("; ")),
            "validating inputs",
          );
        }

        // Process...
        const result = await services.portingService.portCode(code, dialect);
        return createMCPResponse({ ported: result });
      } catch (error) {
        return createMCPError(error, "porting code");
      }
    },
  );
}

/**
 * KEY BENEFITS:
 *
 * 1. Consistency: All tools use the same validation logic
 * 2. Reusability: Validators can be reused across tools
 * 3. Maintainability: Update validation rules in one place
 * 4. Better errors: Detailed, consistent error messages
 * 5. Separation: Validation logic separated from business logic
 * 6. Type safety: TypeScript types ensure correct usage
 * 7. Testability: Validation service can be tested independently
 */

export {
  registerToolBefore,
  registerToolAfter,
  registerAdvancedTool,
  registerToolWithHelper,
  createPortingInputValidator,
};

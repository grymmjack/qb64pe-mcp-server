/**
 * Mouse input tool registrations for QB64PE MCP Server
 * Tools for validating and generating proper mouse input handling patterns
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createMCPResponse,
  createMCPError,
  createMCPTextResponse,
} from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";

/**
 * Register all mouse input-related tools
 */
export function registerMouseInputTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  // Tool 1: Validate _MOUSEWHEEL usage
  server.registerTool(
    "validate_mouse_wheel_usage",
    {
      title: "Validate _MOUSEWHEEL Usage",
      description:
        "🐭 WHEN TO USE: When implementing mouse wheel features (zoom, scroll) or debugging why wheel input isn't working.\n\n" +
        "Performs static analysis to detect _MOUSEWHEEL calls outside _MOUSEINPUT loops. " +
        "_MOUSEWHEEL ONLY returns non-zero values when called INSIDE the _MOUSEINPUT polling loop. " +
        "This tool identifies the critical gotcha that causes wheel-based features to silently fail.",
      inputSchema: {
        sourceCode: z.string().describe("QB64PE source code to analyze"),
        strictMode: z
          .boolean()
          .optional()
          .describe("Enable strict validation (default: true)"),
      },
    },
    async ({ sourceCode, strictMode = true }) => {
      try {
        const issues: Array<{
          line: number;
          code: string;
          issue: string;
          severity: "critical" | "warning";
          fix: string;
        }> = [];

        const lines = sourceCode.split("\n");
        let insideMouseInputLoop = false;
        let loopDepth = 0;
        let mouseInputLoopStart = -1;

        // Track whether we're inside a _MOUSEINPUT loop
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim().toUpperCase();
          const lineNum = i + 1;

          // Check for _MOUSEINPUT loop start
          if (
            line.includes("WHILE _MOUSEINPUT") ||
            line.includes("DO WHILE _MOUSEINPUT")
          ) {
            insideMouseInputLoop = true;
            mouseInputLoopStart = lineNum;
            loopDepth++;
          }

          // Check for loop end
          if (line.includes("WEND") || line.includes("LOOP")) {
            loopDepth--;
            if (loopDepth === 0) {
              insideMouseInputLoop = false;
            }
          }

          // Check for _MOUSEWHEEL usage
          if (line.includes("_MOUSEWHEEL")) {
            if (!insideMouseInputLoop) {
              issues.push({
                line: lineNum,
                code: lines[i].trim(),
                issue:
                  "_MOUSEWHEEL called OUTSIDE _MOUSEINPUT loop - will always return 0",
                severity: "critical",
                fix:
                  "Move _MOUSEWHEEL accumulation INSIDE the _MOUSEINPUT loop:\n" +
                  "wheel_delta% = 0\n" +
                  "DO WHILE _MOUSEINPUT\n" +
                  "    wheel_delta% = wheel_delta% + _MOUSEWHEEL\n" +
                  "LOOP",
              });
            }
          }

          // Detect nested loops that might cause issues
          if (insideMouseInputLoop && strictMode) {
            if (
              line.includes("DO WHILE") ||
              line.includes("WHILE") ||
              line.includes("FOR")
            ) {
              if (!line.includes("_MOUSEINPUT")) {
                issues.push({
                  line: lineNum,
                  code: lines[i].trim(),
                  issue:
                    "Nested loop inside _MOUSEINPUT may cause performance issues",
                  severity: "warning",
                  fix: "Consider moving expensive operations outside the _MOUSEINPUT loop",
                });
              }
            }
          }
        }

        const hasIssues = issues.length > 0;
        const criticalCount = issues.filter(
          (i) => i.severity === "critical",
        ).length;
        const warningCount = issues.filter(
          (i) => i.severity === "warning",
        ).length;

        return createMCPResponse({
          valid: !hasIssues || criticalCount === 0,
          issues,
          summary: {
            totalIssues: issues.length,
            critical: criticalCount,
            warnings: warningCount,
            recommendation: hasIssues
              ? "⚠️ Fix critical issues to enable proper mouse wheel handling"
              : "✅ Mouse wheel usage appears correct",
          },
          bestPractices: {
            pattern: "Accumulate wheel delta inside _MOUSEINPUT loop",
            correctUsage: [
              "wheel_delta% = 0",
              "DO WHILE _MOUSEINPUT",
              "    wheel_delta% = wheel_delta% + _MOUSEWHEEL",
              "LOOP",
              "IF wheel_delta% <> 0 THEN",
              "    ' Process zoom/scroll with wheel_delta%",
              "END IF",
            ].join("\n"),
            commonMistake: [
              "DO WHILE _MOUSEINPUT: LOOP  ' Drain events",
              "wheel% = _MOUSEWHEEL  ' ❌ Always returns 0!",
            ].join("\n"),
          },
        });
      } catch (error) {
        return createMCPError(error, "validating mouse wheel usage");
      }
    },
  );

  // Tool 2: Get mouse input best practices
  server.registerTool(
    "get_mouse_input_best_practices",
    {
      title: "Get Mouse Input Best Practices",
      description:
        "🐭 WHEN TO USE: When implementing mouse handling or experiencing input lag/performance issues.\n\n" +
        "Documents the drain-then-process pattern vs per-event processing patterns for optimal mouse input handling. " +
        "Provides code templates and explains when to use each pattern.",
      inputSchema: {
        pattern: z
          .enum(["drain-then-process", "per-event", "modal-states", "all"])
          .optional()
          .describe("Specific pattern to get (default: all)"),
        includeExamples: z
          .boolean()
          .optional()
          .describe("Include code examples (default: true)"),
      },
    },
    async ({ pattern = "all", includeExamples = true }) => {
      try {
        const patterns: Record<string, any> = {
          "drain-then-process": {
            name: "Drain-Then-Process Pattern",
            when: "Use for modal states, tool handling, or any expensive operations",
            why: "Processes only the final mouse state once per frame instead of for every buffered event",
            template: includeExamples
              ? [
                  "' ✅ CORRECT: Drain buffer, then process final state",
                  "DO WHILE _MOUSEINPUT: LOOP  ' Drain all buffered events",
                  "mx% = _MOUSEX: my% = _MOUSEY  ' Read final position",
                  "",
                  "' Accumulate wheel delta during drain",
                  "wheel_delta% = 0",
                  "DO WHILE _MOUSEINPUT",
                  "    wheel_delta% = wheel_delta% + _MOUSEWHEEL",
                  "LOOP",
                  "",
                  "' Process once with final state",
                  "IF import_mode THEN handle_import_mouse(mx%, my%, wheel_delta%)",
                ].join("\n")
              : undefined,
            benefits: [
              "Runs once per frame regardless of event count",
              "Prevents severe input lag",
              "Ideal for modal interfaces",
              "Simplifies state management",
            ],
          },

          "per-event": {
            name: "Per-Event Processing Pattern",
            when: "Use for click detection, button state changes, or event-specific logic",
            why: "Processes each individual mouse event in the buffer",
            template: includeExamples
              ? [
                  "' ✅ CORRECT: Process each event individually",
                  "WHILE _MOUSEINPUT",
                  "    mx% = _MOUSEX: my% = _MOUSEY",
                  "    ",
                  "    ' Detect clicks",
                  "    IF _MOUSEBUTTON(1) THEN",
                  "        IF NOT was_pressed THEN",
                  "            handle_click(mx%, my%)  ' Process click event",
                  "            was_pressed = _TRUE",
                  "        END IF",
                  "    ELSE",
                  "        was_pressed = _FALSE",
                  "    END IF",
                  "WEND",
                ].join("\n")
              : undefined,
            caution:
              "⚠️ Do NOT put expensive operations inside this loop - they will run 10-100x per frame!",
            antiPattern: [
              "❌ WRONG: Expensive operations inside event loop",
              "WHILE _MOUSEINPUT",
              "    IF import_mode THEN",
              "        ' This runs for EVERY buffered event!",
              "        render_preview()  ' ❌ Causes severe lag",
              "    END IF",
              "WEND",
            ].join("\n"),
          },

          "modal-states": {
            name: "Modal State Management Pattern",
            when: "Use for complex interactive tools with multiple modes",
            why: "Separates input polling from mode-specific processing",
            template: includeExamples
              ? [
                  "' ✅ CORRECT: Modal state handling",
                  "' 1. Drain input buffer and accumulate",
                  "wheel_delta% = 0",
                  "DO WHILE _MOUSEINPUT",
                  "    wheel_delta% = wheel_delta% + _MOUSEWHEEL",
                  "LOOP",
                  "",
                  "' 2. Read final state",
                  "mx% = _MOUSEX: my% = _MOUSEY",
                  "mb% = _MOUSEBUTTON(1)",
                  "",
                  "' 3. Route to appropriate handler based on mode",
                  "SELECT CASE current_tool",
                  "    CASE TOOL_MOVE",
                  "        handle_move_tool(mx%, my%, mb%)",
                  "    CASE TOOL_IMPORT",
                  "        handle_import_tool(mx%, my%, mb%, wheel_delta%)",
                  "    CASE TOOL_MARQUEE",
                  "        handle_marquee_tool(mx%, my%, mb%)",
                  "END SELECT",
                ].join("\n")
              : undefined,
            benefits: [
              "Clean separation of concerns",
              "Each tool handler runs once per frame",
              "Easy to add new tools",
              "Predictable performance",
            ],
          },
        };

        const response: any = {
          patterns:
            pattern === "all" ? patterns : { [pattern]: patterns[pattern] },
          criticalRules: [
            "🔴 _MOUSEWHEEL ONLY works inside _MOUSEINPUT loop",
            "🔴 NEVER put expensive operations inside WHILE _MOUSEINPUT",
            "🟡 Drain buffer with DO WHILE _MOUSEINPUT: LOOP for modal states",
            "🟡 Use per-event processing only for click/button detection",
            "🟢 Accumulate wheel delta inside loop, process outside",
          ],
          performanceGuideline: {
            rule: "Input polling should be O(n) where n = buffered events, but processing should be O(1) per frame",
            explanation:
              "The _MOUSEINPUT loop drains the event buffer (10-100 events per frame). Processing must happen OUTSIDE this loop.",
          },
        };

        if (includeExamples) {
          response.completeExample = [
            "' Complete example: Image import tool with wheel zoom",
            "DIM wheel_delta AS INTEGER",
            "DIM mx AS INTEGER, my AS INTEGER",
            "DIM mb AS INTEGER",
            "",
            "' Game/tool loop",
            "DO",
            "    ' 1. Drain input buffer and accumulate",
            "    wheel_delta = 0",
            "    DO WHILE _MOUSEINPUT",
            "        wheel_delta = wheel_delta + _MOUSEWHEEL",
            "    LOOP",
            "    ",
            "    ' 2. Read final state",
            "    mx = _MOUSEX: my = _MOUSEY",
            "    mb = _MOUSEBUTTON(1)",
            "    ",
            "    ' 3. Process based on mode (runs once per frame)",
            "    IF import_mode THEN",
            "        ' Handle zoom",
            "        IF wheel_delta <> 0 THEN",
            "            zoom_level = zoom_level + (wheel_delta * 0.1)",
            "            IF zoom_level < 0.1 THEN zoom_level = 0.1",
            "            IF zoom_level > 10 THEN zoom_level = 10",
            "        END IF",
            "        ",
            "        ' Handle pan/place",
            "        IF mb THEN handle_mouse_drag(mx, my)",
            "        ",
            "        ' Render preview (once per frame)",
            "        render_import_preview(mx, my, zoom_level)",
            "    END IF",
            "    ",
            "    _DISPLAY",
            "    _LIMIT 60",
            "LOOP",
          ].join("\n");
        }

        return createMCPResponse(response);
      } catch (error) {
        return createMCPError(error, "getting mouse input best practices");
      }
    },
  );

  // Tool 3: Generate state machine template
  server.registerTool(
    "generate_state_machine_template",
    {
      title: "Generate State Machine Template",
      description:
        "🎰 WHEN TO USE: When creating complex interactive tools with multiple modes (import, marquee, move, etc.).\n\n" +
        "Generates a User Defined Type (UDT) with state constants and transition helpers for interactive tools. " +
        "Promotes clear state management using explicit state constants instead of multiple boolean flags.",
      inputSchema: {
        toolName: z
          .string()
          .describe("Name of the tool (e.g., 'ImageImport', 'Marquee')"),
        stateNames: z
          .array(z.string())
          .describe(
            "Array of state names (e.g., ['IDLE', 'LOADED', 'PLACING', 'PANNING'])",
          ),
        includeKeyboardHandler: z
          .boolean()
          .optional()
          .describe("Include keyboard input handler template (default: true)"),
        includeMouseHandler: z
          .boolean()
          .optional()
          .describe("Include mouse input handler template (default: true)"),
      },
    },
    async ({
      toolName,
      stateNames,
      includeKeyboardHandler = true,
      includeMouseHandler = true,
    }) => {
      try {
        const upperToolName = toolName.toUpperCase().replace(/[^A-Z0-9]/g, "_");
        const titleToolName = toolName.replace(/([A-Z])/g, " $1").trim();

        // Generate state constants
        const stateConstants = stateNames
          .map((state, index) => {
            const upperState = state.toUpperCase().replace(/[^A-Z0-9]/g, "_");
            return `CONST ${upperToolName}_STATE_${upperState} = ${index}`;
          })
          .join("\n");

        // Generate state name array
        const stateNameArray = stateNames
          .map((state) => {
            const upperState = state.toUpperCase().replace(/[^A-Z0-9]/g, "_");
            return `${upperToolName}_STATE_NAMES$(${upperToolName}_STATE_${upperState}) = "${state}"`;
          })
          .join("\n");

        // Generate UDT
        const udt = [
          `TYPE ${upperToolName}_TYPE`,
          `    STATE AS INTEGER          ' Current state`,
          `    PREV_STATE AS INTEGER     ' Previous state (for transitions)`,
          `    `,
          `    ' Mouse state`,
          `    MOUSE_X AS INTEGER`,
          `    MOUSE_Y AS INTEGER`,
          `    MOUSE_BUTTON AS INTEGER`,
          `    WHEEL_DELTA AS INTEGER`,
          `    `,
          `    ' Tool-specific data (customize as needed)`,
          `    ' DATA_IMAGE AS LONG       ' Example: image handle`,
          `    ' ZOOM_LEVEL AS SINGLE     ' Example: zoom factor`,
          `    ' OFFSET_X AS INTEGER      ' Example: pan offset`,
          `    ' OFFSET_Y AS INTEGER`,
          `END TYPE`,
        ].join("\n");

        // Generate initialization function
        const initFunction = [
          `SUB ${upperToolName}_INIT (tool AS ${upperToolName}_TYPE)`,
          `    tool.STATE = ${upperToolName}_STATE_${stateNames[0].toUpperCase().replace(/[^A-Z0-9]/g, "_")}`,
          `    tool.PREV_STATE = ${upperToolName}_STATE_${stateNames[0].toUpperCase().replace(/[^A-Z0-9]/g, "_")}`,
          `    tool.MOUSE_X = 0`,
          `    tool.MOUSE_Y = 0`,
          `    tool.MOUSE_BUTTON = 0`,
          `    tool.WHEEL_DELTA = 0`,
          `    `,
          `    ' Initialize tool-specific data here`,
          `END SUB`,
        ].join("\n");

        // Generate state transition function
        const transitionFunction = [
          `SUB ${upperToolName}_SET_STATE (tool AS ${upperToolName}_TYPE, new_state AS INTEGER)`,
          `    IF tool.STATE <> new_state THEN`,
          `        tool.PREV_STATE = tool.STATE`,
          `        tool.STATE = new_state`,
          `        `,
          `        ' Optional: Log state transitions for debugging`,
          `        ' PRINT "State: " + ${upperToolName}_STATE_NAMES$(tool.PREV_STATE) + " -> " + ${upperToolName}_STATE_NAMES$(tool.STATE)`,
          `    END IF`,
          `END SUB`,
        ].join("\n");

        // Generate mouse handler
        let mouseHandlerString = "";
        if (includeMouseHandler) {
          const mouseHandler = [
            `SUB ${upperToolName}_HANDLE_MOUSE (tool AS ${upperToolName}_TYPE)`,
            `    ' 1. Drain input buffer and accumulate wheel delta`,
            `    tool.WHEEL_DELTA = 0`,
            `    DO WHILE _MOUSEINPUT`,
            `        tool.WHEEL_DELTA = tool.WHEEL_DELTA + _MOUSEWHEEL`,
            `    LOOP`,
            `    `,
            `    ' 2. Read final mouse state`,
            `    tool.MOUSE_X = _MOUSEX`,
            `    tool.MOUSE_Y = _MOUSEY`,
            `    tool.MOUSE_BUTTON = _MOUSEBUTTON(1)`,
            `    `,
            `    ' 3. Route to state-specific handlers`,
            `    SELECT CASE tool.STATE`,
          ];

          stateNames.forEach((state) => {
            const upperState = state.toUpperCase().replace(/[^A-Z0-9]/g, "_");
            const functionState = state
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "_");
            mouseHandler.push(
              `        CASE ${upperToolName}_STATE_${upperState}`,
              `            ${upperToolName}_HANDLE_MOUSE_${upperState}(tool)`,
            );
          });

          mouseHandler.push(`    END SELECT`, `END SUB`, ``);

          // Generate state-specific mouse handler stubs
          stateNames.forEach((state) => {
            const upperState = state.toUpperCase().replace(/[^A-Z0-9]/g, "_");
            mouseHandler.push(
              `SUB ${upperToolName}_HANDLE_MOUSE_${upperState} (tool AS ${upperToolName}_TYPE)`,
              `    ' TODO: Implement ${state} state mouse handling`,
              `    `,
              `    ' Example patterns:`,
              `    ' - Click detection: IF tool.MOUSE_BUTTON THEN ...`,
              `    ' - Wheel zoom: IF tool.WHEEL_DELTA <> 0 THEN zoom = zoom + tool.WHEEL_DELTA * 0.1`,
              `    ' - Drag: IF tool.MOUSE_BUTTON THEN offset_x = tool.MOUSE_X - start_x`,
              `    ' - State transitions: ${upperToolName}_SET_STATE tool, ${upperToolName}_STATE_NEXT`,
              `END SUB`,
              ``,
            );
          });

          mouseHandlerString = mouseHandler.join("\n");
        }

        // Generate keyboard handler
        let keyboardHandlerString = "";
        if (includeKeyboardHandler) {
          const keyboardHandler = [
            `SUB ${upperToolName}_HANDLE_KEYBOARD (tool AS ${upperToolName}_TYPE)`,
            `    DIM k AS LONG`,
            `    k = _KEYHIT`,
            `    IF k = 0 THEN EXIT SUB`,
            `    `,
            `    ' Route to state-specific handlers`,
            `    SELECT CASE tool.STATE`,
          ];

          stateNames.forEach((state) => {
            const upperState = state.toUpperCase().replace(/[^A-Z0-9]/g, "_");
            keyboardHandler.push(
              `        CASE ${upperToolName}_STATE_${upperState}`,
              `            ${upperToolName}_HANDLE_KEYBOARD_${upperState}(tool, k)`,
            );
          });

          keyboardHandler.push(`    END SELECT`, `END SUB`, ``);

          // Generate state-specific keyboard handler stubs
          stateNames.forEach((state) => {
            const upperState = state.toUpperCase().replace(/[^A-Z0-9]/g, "_");
            keyboardHandler.push(
              `SUB ${upperToolName}_HANDLE_KEYBOARD_${upperState} (tool AS ${upperToolName}_TYPE, k AS LONG)`,
              `    ' TODO: Implement ${state} state keyboard handling`,
              `    `,
              `    ' Example patterns:`,
              `    ' SELECT CASE k`,
              `    '     CASE 27 ' ESC`,
              `    '         ${upperToolName}_SET_STATE tool, ${upperToolName}_STATE_${stateNames[0].toUpperCase().replace(/[^A-Z0-9]/g, "_")}`,
              `    '     CASE 13 ' ENTER`,
              `    '         ${upperToolName}_SET_STATE tool, ${upperToolName}_STATE_NEXT`,
              `    ' END SELECT`,
              `END SUB`,
              ``,
            );
          });

          keyboardHandlerString = keyboardHandler.join("\n");
        }

        // Generate usage example
        const usageExample = [
          `' ========================================`,
          `' USAGE EXAMPLE`,
          `' ========================================`,
          ``,
          `' 1. Declare state names array (in main program or module)`,
          `DIM SHARED ${upperToolName}_STATE_NAMES$(${stateNames.length - 1})`,
          ``,
          `' 2. Initialize state names`,
          stateNameArray,
          ``,
          `' 3. Declare tool instance`,
          `DIM ${toolName.toLowerCase()} AS ${upperToolName}_TYPE`,
          ``,
          `' 4. Initialize tool`,
          `${upperToolName}_INIT ${toolName.toLowerCase()}`,
          ``,
          `' 5. Main loop`,
          `DO`,
          `    ' Handle input`,
          includeMouseHandler
            ? `    ${upperToolName}_HANDLE_MOUSE ${toolName.toLowerCase()}`
            : "",
          includeKeyboardHandler
            ? `    ${upperToolName}_HANDLE_KEYBOARD ${toolName.toLowerCase()}`
            : "",
          `    `,
          `    ' Render based on state`,
          `    SELECT CASE ${toolName.toLowerCase()}.STATE`,
        ];

        stateNames.forEach((state) => {
          const upperState = state.toUpperCase().replace(/[^A-Z0-9]/g, "_");
          usageExample.push(
            `        CASE ${upperToolName}_STATE_${upperState}`,
            `            ' Render ${state} state`,
          );
        });

        usageExample.push(
          `    END SELECT`,
          `    `,
          `    _DISPLAY`,
          `    _LIMIT 60`,
          `LOOP`,
        );

        // Compile full template
        const headerFile = [
          `' ========================================`,
          `' ${titleToolName} Tool - Header File`,
          `' ${upperToolName}.BI`,
          `' ========================================`,
          ``,
          `' State constants`,
          stateConstants,
          ``,
          `' UDT definition`,
          udt,
          ``,
          `' Function declarations`,
          `DECLARE SUB ${upperToolName}_INIT (tool AS ${upperToolName}_TYPE)`,
          `DECLARE SUB ${upperToolName}_SET_STATE (tool AS ${upperToolName}_TYPE, new_state AS INTEGER)`,
          includeMouseHandler
            ? `DECLARE SUB ${upperToolName}_HANDLE_MOUSE (tool AS ${upperToolName}_TYPE)`
            : "",
          includeKeyboardHandler
            ? `DECLARE SUB ${upperToolName}_HANDLE_KEYBOARD (tool AS ${upperToolName}_TYPE)`
            : "",
        ]
          .filter(Boolean)
          .join("\n");

        const implementationFile = [
          `' ========================================`,
          `' ${titleToolName} Tool - Implementation File`,
          `' ${upperToolName}.BM`,
          `' ========================================`,
          ``,
          initFunction,
          ``,
          transitionFunction,
          ``,
          mouseHandlerString,
          keyboardHandlerString,
        ]
          .filter(Boolean)
          .join("\n");

        return createMCPResponse({
          toolName,
          stateCount: stateNames.length,
          states: stateNames,
          files: {
            header: {
              filename: `${upperToolName}.BI`,
              content: headerFile,
            },
            implementation: {
              filename: `${upperToolName}.BM`,
              content: implementationFile,
            },
          },
          usageExample: usageExample.join("\n"),
          benefits: [
            "✅ Clear state management with explicit constants",
            "✅ Easy to debug (print current state name)",
            "✅ Prevents invalid state combinations",
            "✅ Separates concerns (state vs input vs rendering)",
            "✅ Scalable pattern for complex tools",
          ],
          nextSteps: [
            `1. Save header to ${upperToolName}.BI`,
            `2. Save implementation to ${upperToolName}.BM`,
            `3. Include in main program: '$INCLUDE:'${upperToolName}.BI'`,
            `4. Implement TODO sections in state handlers`,
            `5. Add tool-specific data fields to UDT`,
          ],
        });
      } catch (error) {
        return createMCPError(error, "generating state machine template");
      }
    },
  );
}

/**
 * Service contract tests.
 *
 * Each entry maps a real service class to the list of method names that
 * tool handlers call on it at runtime.  This test checks those methods
 * exist on the class prototype — no instantiation, no side-effects.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * ServiceContainer types every service as `any`, so TypeScript cannot catch
 * misspelled or missing method names at compile time.  Jest mocks use
 * hand-typed method names that also silently pass when the real name differs.
 * This test is the safety net that catches the gap.
 *
 * WHAT TO DO WHEN A TEST FAILS
 * ----------------------------
 * Either the tool is calling the wrong method name (fix the tool) or the
 * service method was renamed/removed (add an alias or fix the service).
 */

import { QB64PECompatibilityService as CompatibilityService } from "../src/services/compatibility-service";
import { QB64PECompilerService as CompilerService } from "../src/services/compiler-service";
import { QB64PESyntaxService as SyntaxService } from "../src/services/syntax-service";
import { QB64PEExecutionService as ExecutionService } from "../src/services/execution-service";
import { QB64PEDebuggingService as DebuggingService } from "../src/services/debugging-service";
import { QB64PELoggingService as LoggingService } from "../src/services/logging-service";
import { QB64PEInstallationService as InstallationService } from "../src/services/installation-service";
import { QB64PEPortingService as PortingService } from "../src/services/porting-service";
import { ScreenshotService } from "../src/services/screenshot-service";
import { ScreenshotWatcherService } from "../src/services/screenshot-watcher-service";
import { FeedbackService } from "../src/services/feedback-service";
import { FileStructureService } from "../src/services/file-structure-service";
import { KeywordsService } from "../src/services/keywords-service";
import { SessionProblemsService } from "../src/services/session-problems-service";
import { QB64PEWikiService as WikiService } from "../src/services/wiki-service";

/** [ServiceClass, [...methodsCalledByTools]] */
const contracts: [Function, string[]][] = [
  [
    CompatibilityService,
    [
      "validateCompatibility",
      "searchCompatibility",
      "getBestPractices",
      "getDebuggingGuidance",
      "getPlatformCompatibility",
      "validateKeyboardBufferSafety",
    ],
  ],

  [
    CompilerService,
    ["compileAndVerify", "getCompilerOptions", "getDebuggingHelp"],
  ],

  [SyntaxService, ["validateSyntax"]],

  [
    ExecutionService,
    [
      "analyzeExecutionMode",
      "getExecutionGuidance",
      "getProcessMonitoringCommands",
      "getProcessTerminationCommands",
      "generateMonitoringTemplate",
      "generateConsoleFormattingTemplate",
      "getRealTimeMonitoringGuidance", // ← was misnamed getMonitoringGuidance in tool
      "parseConsoleOutput",
      "getFileMonitoringCommands",
    ],
  ],

  [
    DebuggingService,
    [
      "enhanceCodeForDebugging",
      "getDebuggingBestPractices",
      "getLLMDebuggingGuide",
      "generateAdvancedTemplate", // ← was missing; added to service
    ],
  ],

  [
    LoggingService,
    [
      "injectNativeLogging",
      "parseStructuredOutput",
      "generateEchoFunctions",
      "generateOutputCaptureCommands", // ← was singular in service; alias added
    ],
  ],

  [
    InstallationService,
    [
      "detectInstallation",
      "getPathConfiguration",
      "validatePath",
      "generateInstallationReport",
      "generateInstallationGuidance",
    ],
  ],

  [
    PortingService,
    ["portQBasicToQB64PE", "getSupportedDialects", "getDialectRules"],
  ],

  [ScreenshotService, ["analyzeScreenshot", "generateAnalysisTemplate"]],

  [
    ScreenshotWatcherService,
    [
      "startWatching",
      "stopWatching",
      "getAnalysisHistory",
      "getRecentScreenshots",
      "getStatus",
    ],
  ],

  [
    FeedbackService,
    ["generateFeedback", "getFeedbackHistory", "getStatistics"],
  ],

  [
    FileStructureService,
    [
      "validateBIFile",
      "validateBMFile",
      "followsGJLibConventions",
      "validateFile",
    ],
  ],

  [
    KeywordsService,
    [
      "validateKeyword",
      "searchKeywords",
      "searchMCPDocs",
      "getAutocomplete",
      "getAllKeywords",
      "getKeywordsByCategory",
      "searchByWikiCategory",
      "batchUpdatePlatformAvailability",
    ],
  ],

  [
    SessionProblemsService,
    [
      "logProblem",
      "generateReport",
      "exportAsMarkdown",
      "getStatistics",
      "clear",
    ],
  ],

  [
    WikiService,
    [
      "searchWiki",
      "getPageContent",
      "getWikiCategories",
      "batchParsePlatformAvailability",
    ],
  ],
];

describe("Service contracts — every method called by a tool handler must exist", () => {
  for (const [ServiceClass, methods] of contracts) {
    describe(ServiceClass.name, () => {
      for (const method of methods) {
        it(`exposes ${method}()`, () => {
          expect(typeof (ServiceClass as any).prototype[method]).toBe(
            "function",
          );
        });
      }
    });
  }
});

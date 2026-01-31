"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QB64PEDebuggingService = void 0;
const path = __importStar(require("path"));
/**
 * Enhanced debugging service for QB64PE development
 * Addresses the core debugging issues identified in the user's analysis
 */
class QB64PEDebuggingService {
    debugSessions = new Map();
    templateCache = new Map();
    defaultConfig;
    constructor() {
        this.defaultConfig = {
            enableConsole: true,
            enableLogging: true,
            enableScreenshots: true,
            enableFlowControl: true,
            enableResourceTracking: true,
            timeoutSeconds: 30,
            autoExit: true,
            verboseOutput: true,
        };
    }
    /**
     * Create a new debugging session with enhanced monitoring
     */
    createDebuggingSession(sourceCode, projectPath = ".", config = {}) {
        const sessionId = `debug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mergedConfig = { ...this.defaultConfig, ...config };
        const session = {
            id: sessionId,
            projectPath,
            sourceCode,
            debugMode: "automated",
            startTime: new Date(),
            lastActivity: new Date(),
            issues: [],
            solutions: [],
            status: "active",
            executionMode: this.detectExecutionMode(sourceCode),
        };
        // Analyze code for potential issues
        const detectedIssues = this.analyzeCodeForIssues(sourceCode);
        session.issues.push(...detectedIssues);
        // Generate solutions for detected issues
        for (const issue of detectedIssues) {
            const solutions = this.generateSolutions(issue, mergedConfig);
            session.solutions.push(...solutions);
        }
        this.debugSessions.set(sessionId, session);
        return session;
    }
    /**
     * Apply debugging enhancements to QB64PE source code
     */
    enhanceCodeForDebugging(sourceCode, config = {}) {
        const mergedConfig = { ...this.defaultConfig, ...config };
        const session = this.createDebuggingSession(sourceCode, ".", mergedConfig);
        let enhancedCode = sourceCode;
        const modifications = [];
        const debugFeatures = [];
        // 1. Console Output Enhancement (Issue #1 fix)
        if (mergedConfig.enableConsole) {
            const consoleEnhancement = this.injectConsoleManagement(enhancedCode, mergedConfig);
            enhancedCode = consoleEnhancement.code;
            modifications.push(...consoleEnhancement.modifications);
            debugFeatures.push("Console Management");
        }
        // 2. Flow Control Enhancement (prevents hanging)
        if (mergedConfig.enableFlowControl) {
            const flowEnhancement = this.injectFlowControl(enhancedCode, mergedConfig);
            enhancedCode = flowEnhancement.code;
            modifications.push(...flowEnhancement.modifications);
            debugFeatures.push("Flow Control");
        }
        // 3. Resource Management Enhancement (Issue #4 fix)
        if (mergedConfig.enableResourceTracking) {
            const resourceEnhancement = this.injectResourceManagement(enhancedCode);
            enhancedCode = resourceEnhancement.code;
            modifications.push(...resourceEnhancement.modifications);
            debugFeatures.push("Resource Management");
        }
        // 4. Graphics Context Enhancement (Issue #6 fix)
        if (session.executionMode === "graphics" ||
            session.executionMode === "mixed") {
            const graphicsEnhancement = this.injectGraphicsContextManagement(enhancedCode);
            enhancedCode = graphicsEnhancement.code;
            modifications.push(...graphicsEnhancement.modifications);
            debugFeatures.push("Graphics Context Management");
        }
        // 5. Logging and Monitoring
        if (mergedConfig.enableLogging) {
            const loggingEnhancement = this.injectLoggingSystem(enhancedCode, mergedConfig);
            enhancedCode = loggingEnhancement.code;
            modifications.push(...loggingEnhancement.modifications);
            debugFeatures.push("Logging System");
        }
        // 6. Screenshot Automation
        if (mergedConfig.enableScreenshots &&
            (session.executionMode === "graphics" ||
                session.executionMode === "mixed")) {
            const screenshotEnhancement = this.injectScreenshotSystem(enhancedCode);
            enhancedCode = screenshotEnhancement.code;
            modifications.push(...screenshotEnhancement.modifications);
            debugFeatures.push("Screenshot System");
        }
        return {
            enhancedCode,
            modifications,
            debugFeatures,
            issues: session.issues,
            solutions: session.solutions,
        };
    }
    /**
     * Issue #1: Console Output and Program Execution Issues
     * Inject console management and visibility controls
     */
    injectConsoleManagement(sourceCode, config) {
        const modifications = [];
        let code = sourceCode;
        // Force console activation for shell redirection compatibility
        if (!code.includes("$CONSOLE")) {
            code = `$CONSOLE:ONLY\n${code}`;
            modifications.push("Added $CONSOLE:ONLY directive for shell redirection compatibility");
        }
        else if (code.includes("$CONSOLE") && !code.includes("$CONSOLE:ONLY")) {
            // Replace existing $CONSOLE with $CONSOLE:ONLY for better automation compatibility
            code = code.replace(/\$CONSOLE(?!:)/g, "$CONSOLE:ONLY");
            modifications.push("Updated $CONSOLE to $CONSOLE:ONLY for shell redirection compatibility");
        }
        // Add explicit logging setup with _LOGINFO
        const consoleActivation = `
' === DEBUGGING ENHANCEMENT: Logging System ===
CONST DEBUG_MODE = 1
CONST AUTO_TEST_DELAY = ${config.timeoutSeconds / 10}

SUB DebugPause (message AS STRING)
    IF DEBUG_MODE = 1 THEN
        _LOGINFO message + " (auto-continuing in " + STR$(AUTO_TEST_DELAY) + "s...)"
        _DELAY AUTO_TEST_DELAY
    ELSE
        _LOGINFO message
        SLEEP
    END IF
END SUB

SUB DebugExit (message AS STRING)
    _LOGINFO message
    IF DEBUG_MODE = 1 THEN
        _LOGINFO "Auto-exiting in " + STR$(AUTO_TEST_DELAY) + " seconds..."
        _DELAY AUTO_TEST_DELAY
    ELSE
        PRINT "Press any key to exit..."
        SLEEP
    END IF
    SYSTEM
END SUB
`;
        // Insert after any existing metacommands but before main code
        const lines = code.split("\n");
        let insertIndex = 0;
        // Find the end of metacommands
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith("$") ||
                lines[i].trim().startsWith("'") ||
                lines[i].trim() === "") {
                insertIndex = i + 1;
            }
            else {
                break;
            }
        }
        lines.splice(insertIndex, 0, consoleActivation);
        code = lines.join("\n");
        modifications.push("Injected console management system");
        // Replace problematic SLEEP and END statements
        code = code.replace(/PRINT\s+"Press any key[^"]*"\s*[\r\n]+\s*SLEEP/gi, 'CALL DebugPause("Press any key to continue...")');
        modifications.push("Replaced blocking SLEEP statements with conditional pauses");
        code = code.replace(/\bEND\s*$/gm, 'CALL DebugExit("Program completed")');
        modifications.push("Replaced END statements with explicit debugging exit");
        return { code, modifications };
    }
    /**
     * Issue #4: File Handle and Resource Management Issues
     * Inject proper resource management and cleanup
     */
    injectResourceManagement(sourceCode) {
        const modifications = [];
        let code = sourceCode;
        const resourceManagement = `
' === DEBUGGING ENHANCEMENT: Resource Management ===
DIM SHARED ResourceManager_FileHandles(100) AS INTEGER
DIM SHARED ResourceManager_ImageHandles(100) AS LONG
DIM SHARED ResourceManager_FileCount AS INTEGER
DIM SHARED ResourceManager_ImageCount AS INTEGER

SUB ResourceManager_Init
    ResourceManager_FileCount = 0
    ResourceManager_ImageCount = 0
END SUB

FUNCTION ResourceManager_GetFileHandle%
    DIM handle AS INTEGER
    handle = FREEFILE
    IF ResourceManager_FileCount < 100 THEN
        ResourceManager_FileHandles(ResourceManager_FileCount) = handle
        ResourceManager_FileCount = ResourceManager_FileCount + 1
    END IF
    ResourceManager_GetFileHandle% = handle
END FUNCTION

SUB ResourceManager_RegisterImage (handle AS LONG)
    IF ResourceManager_ImageCount < 100 THEN
        ResourceManager_ImageHandles(ResourceManager_ImageCount) = handle
        ResourceManager_ImageCount = ResourceManager_ImageCount + 1
    END IF
END SUB

SUB ResourceManager_Cleanup
    DIM i AS INTEGER
    ' Close any open file handles
    FOR i = 0 TO ResourceManager_FileCount - 1
        IF ResourceManager_FileHandles(i) > 0 THEN
            CLOSE #ResourceManager_FileHandles(i)
        END IF
    NEXT i
    ' Free any image handles
    FOR i = 0 TO ResourceManager_ImageCount - 1
        IF ResourceManager_ImageHandles(i) > 0 THEN
            _FREEIMAGE ResourceManager_ImageHandles(i)
        END IF
    NEXT i
    PRINT "Resource cleanup completed"
END SUB

CALL ResourceManager_Init
`;
        // Add the resource management system
        code = resourceManagement + "\n" + code;
        modifications.push("Added resource management system");
        // Replace FREEFILE usage with tracked version
        code = code.replace(/FREEFILE/g, "ResourceManager_GetFileHandle%");
        modifications.push("Replaced FREEFILE with tracked resource allocation");
        // Add cleanup before SYSTEM calls
        code = code.replace(/SYSTEM/g, "CALL ResourceManager_Cleanup\nSYSTEM");
        modifications.push("Added resource cleanup before program exit");
        return { code, modifications };
    }
    /**
     * Issue #6: QB64PE Graphics Context Issues
     * Inject graphics context management
     */
    injectGraphicsContextManagement(sourceCode) {
        const modifications = [];
        let code = sourceCode;
        const graphicsManagement = `
' === DEBUGGING ENHANCEMENT: Graphics Context Management ===
DIM SHARED GraphicsManager_CurrentDest AS LONG
DIM SHARED GraphicsManager_StackPointer AS INTEGER
DIM SHARED GraphicsManager_DestStack(10) AS LONG

SUB GraphicsManager_Init
    GraphicsManager_CurrentDest = 0
    GraphicsManager_StackPointer = 0
END SUB

SUB GraphicsManager_PushDest (newDest AS LONG)
    IF GraphicsManager_StackPointer < 10 THEN
        GraphicsManager_DestStack(GraphicsManager_StackPointer) = _DEST
        GraphicsManager_StackPointer = GraphicsManager_StackPointer + 1
    END IF
    GraphicsManager_CurrentDest = newDest
    _DEST newDest
END SUB

SUB GraphicsManager_PopDest
    IF GraphicsManager_StackPointer > 0 THEN
        GraphicsManager_StackPointer = GraphicsManager_StackPointer - 1
        _DEST GraphicsManager_DestStack(GraphicsManager_StackPointer)
        GraphicsManager_CurrentDest = _DEST
    END IF
END SUB

FUNCTION GraphicsManager_CreateImage& (width AS INTEGER, height AS INTEGER)
    DIM img AS LONG
    img = _NEWIMAGE(width, height, 32)
    IF img > 0 THEN
        CALL ResourceManager_RegisterImage(img)
        PRINT "Created image handle: " + STR$(img) + " (" + STR$(width) + "x" + STR$(height) + ")"
    ELSE
        PRINT "ERROR: Failed to create image (" + STR$(width) + "x" + STR$(height) + ")"
    END IF
    GraphicsManager_CreateImage& = img
END FUNCTION

SUB GraphicsManager_SafePSET (x AS INTEGER, y AS INTEGER, clr AS LONG)
    IF x >= 0 AND y >= 0 AND x < _WIDTH AND y < _HEIGHT THEN
        PSET (x, y), clr
    END IF
END SUB

CALL GraphicsManager_Init
`;
        // Add graphics management system
        code = graphicsManagement + "\n" + code;
        modifications.push("Added graphics context management system");
        // Replace _NEWIMAGE with tracked version
        code = code.replace(/_NEWIMAGE\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g, "GraphicsManager_CreateImage&($1, $2)");
        modifications.push("Replaced _NEWIMAGE with tracked image creation");
        // Replace risky PSET operations with bounds-checked version
        code = code.replace(/PSET\s*\(\s*([^,]+),\s*([^)]+)\)\s*,\s*([^\n\r]+)/g, "CALL GraphicsManager_SafePSET($1, $2, $3)");
        modifications.push("Replaced PSET with bounds-checked version");
        return { code, modifications };
    }
    /**
     * Inject enhanced flow control for automated testing
     */
    injectFlowControl(sourceCode, config) {
        const modifications = [];
        let code = sourceCode;
        // Wrap main execution in an automated test wrapper
        const mainWrapper = `
' === DEBUGGING ENHANCEMENT: Flow Control Wrapper ===
SUB AutoTestWrapper
    CALL DebugPause("Starting automated test session...")
    
    ' Call original main program
    CALL OriginalMainProgram
    
    CALL DebugExit("Test session completed successfully")
END SUB

SUB OriginalMainProgram
    ' Original program code will be moved here
`;
        // Find the main execution code (not SUBs/FUNCTIONs)
        const lines = code.split("\n");
        const functionLines = [];
        const mainLines = [];
        let inFunction = false;
        let hasMainCode = false;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim().toUpperCase();
            if (line.startsWith("SUB ") || line.startsWith("FUNCTION ")) {
                inFunction = true;
                functionLines.push(lines[i]);
            }
            else if (line.startsWith("END SUB") ||
                line.startsWith("END FUNCTION")) {
                inFunction = false;
                functionLines.push(lines[i]);
            }
            else if (inFunction) {
                functionLines.push(lines[i]);
            }
            else if (line.startsWith("$") ||
                line.startsWith("'") ||
                line === "" ||
                line.startsWith("CONST ") ||
                line.startsWith("DIM SHARED") ||
                line.startsWith("DEFINT") ||
                line.startsWith("OPTION")) {
                // Keep metacommands and declarations at the top
                mainLines.push(lines[i]);
            }
            else {
                // This is main execution code
                hasMainCode = true;
                mainLines.push(lines[i]);
            }
        }
        if (hasMainCode) {
            // Reconstruct with wrapper
            const topDeclarations = [];
            const mainExecution = [];
            let inDeclarations = true;
            for (const line of mainLines) {
                const trimmed = line.trim().toUpperCase();
                if (inDeclarations &&
                    (trimmed.startsWith("$") ||
                        trimmed.startsWith("'") ||
                        trimmed === "" ||
                        trimmed.startsWith("CONST ") ||
                        trimmed.startsWith("DIM SHARED") ||
                        trimmed.startsWith("DEFINT") ||
                        trimmed.startsWith("OPTION"))) {
                    topDeclarations.push(line);
                }
                else {
                    inDeclarations = false;
                    mainExecution.push("    " + line); // Indent for SUB
                }
            }
            code = [
                ...topDeclarations,
                mainWrapper,
                ...mainExecution,
                "END SUB",
                "",
                ...functionLines,
                "",
                "'Call the wrapper instead of original main code",
                "CALL AutoTestWrapper",
            ].join("\n");
            modifications.push("Wrapped main execution in automated test framework");
            modifications.push("Added timeout and flow control management");
        }
        return { code, modifications };
    }
    /**
     * Inject comprehensive logging system
     */
    injectLoggingSystem(sourceCode, config) {
        const modifications = [];
        let code = sourceCode;
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const logFile = path.join(process.cwd(), "qb64pe-logs", `debug_${timestamp}.log`);
        const loggingSystem = `
' === DEBUGGING ENHANCEMENT: Logging System ===
DIM SHARED LogFile AS STRING
DIM SHARED LogEnabled AS INTEGER

SUB LogInit
    LogFile = "${logFile.replace(/\\/g, "/")}"
    LogEnabled = ${config.verboseOutput ? "1" : "0"}
    IF LogEnabled THEN
        OPEN LogFile FOR OUTPUT AS #98
        PRINT #98, "=== QB64PE DEBUG SESSION STARTED ==="
        PRINT #98, "Date: " + DATE$ + " Time: " + TIME$
        PRINT #98, "Platform: " + _OS$
        PRINT #98, "======================================="
        CLOSE #98
    END IF
END SUB

SUB LogMessage (category AS STRING, message AS STRING)
    IF LogEnabled THEN
        OPEN LogFile FOR APPEND AS #98
        PRINT #98, TIME$ + " [" + category + "] " + message
        CLOSE #98
    END IF
    
    ' Also print to console with color coding
    DIM oldDest AS LONG
    oldDest = _DEST
    _DEST _CONSOLE
    
    SELECT CASE UCASE$(category)
        CASE "ERROR"
            COLOR 12, 0
        CASE "WARNING"
            COLOR 14, 0
        CASE "SUCCESS"
            COLOR 10, 0
        CASE "INFO"
            COLOR 11, 0
        CASE ELSE
            COLOR 7, 0
    END SELECT
    
    PRINT "[" + category + "] " + message
    COLOR 7, 0
    _DEST oldDest
END SUB

CALL LogInit
`;
        code = loggingSystem + "\n" + code;
        modifications.push("Added comprehensive logging system");
        // Add logging to critical points
        code = code.replace(/(OPEN\s+[^}]+FOR\s+[A-Z]+\s+AS\s+#\d+)/gi, '$1\nCALL LogMessage("FILE", "Opened file: " + filename)');
        modifications.push("Added file operation logging");
        return { code, modifications };
    }
    /**
     * Inject automated screenshot system for graphics programs
     *
     * IMPROVEMENT: Includes visual debugging markers alongside screenshots.
     * Session Problem: Console output confirms execution but doesn't prove pixels
     * are drawn. Visual markers (colored lines/boxes) confirm both execution AND rendering.
     */
    injectScreenshotSystem(sourceCode) {
        const modifications = [];
        let code = sourceCode;
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const screenshotBase = path.join(process.cwd(), "qb64pe-screenshots", `debug_${timestamp}`);
        const screenshotSystem = `
' === DEBUGGING ENHANCEMENT: Screenshot System with Visual Markers ===
DIM SHARED ScreenshotCounter AS INTEGER
DIM SHARED ScreenshotBase AS STRING
DIM SHARED DebugMarkerColor~& 

SUB ScreenshotInit
    ScreenshotCounter = 0
    ScreenshotBase = "${screenshotBase.replace(/\\/g, "/")}"
    DebugMarkerColor~& = _RGB32(0, 255, 0)  ' Bright green for visibility
END SUB

' Draw visual marker to confirm code path executes AND renders
SUB DrawDebugMarker (x%, y%, label$)
    IF _DEST <> _CONSOLE THEN
        DIM oldDest AS LONG
        oldDest = _DEST
        
        ' Draw obvious colored marker at location
        LINE (x% - 2, y% - 2)-(x% + 2, y% + 2), DebugMarkerColor~&, BF
        
        ' Draw label line at screen edge for visibility
        LINE (0, y%)-(10, y%), DebugMarkerColor~&
        
        _DEST oldDest
    END IF
END SUB

SUB TakeDebugScreenshot (label AS STRING)
    IF _DEST <> _CONSOLE THEN
        ScreenshotCounter = ScreenshotCounter + 1
        DIM filename AS STRING
        filename = ScreenshotBase + "_" + label + "_" + RIGHT$("000" + LTRIM$(STR$(ScreenshotCounter)), 3) + ".png"
        _SAVEIMAGE filename
        CALL LogMessage("SCREENSHOT", "Saved: " + filename + " (" + label + ")")
    END IF
END SUB

SUB AutoScreenshot
    CALL TakeDebugScreenshot("auto")
END SUB

CALL ScreenshotInit
`;
        code = screenshotSystem + "\n" + code;
        modifications.push("Added automated screenshot system with visual debugging markers");
        // Add automatic screenshots after graphics operations
        code = code.replace(/(CIRCLE\s*\([^)]+\)[^.\n]*)/gi, "$1\nCALL AutoScreenshot");
        code = code.replace(/(LINE\s*\([^)]+\)[^.\n]*)/gi, "$1\nCALL AutoScreenshot");
        code = code.replace(/(_PUTIMAGE\s*\([^)]+\)[^.\n]*)/gi, "$1\nCALL AutoScreenshot");
        modifications.push("Added automatic screenshots after graphics operations");
        return { code, modifications };
    }
    /**
     * Detect execution mode from source code
     */
    detectExecutionMode(sourceCode) {
        const hasConsole = /\$CONSOLE/i.test(sourceCode);
        const hasGraphics = /\b(SCREEN|CIRCLE|LINE|PSET|POINT|PAINT|PUT|GET|_NEWIMAGE|_PUTIMAGE|_LOADIMAGE)\b/i.test(sourceCode);
        if (hasGraphics && hasConsole)
            return "mixed";
        if (hasGraphics)
            return "graphics";
        return "console";
    }
    /**
     * Analyze code for potential debugging issues
     */
    analyzeCodeForIssues(sourceCode) {
        const issues = [];
        const lines = sourceCode.split("\n");
        // Issue #1: Console visibility problems
        if (!sourceCode.includes("$CONSOLE") &&
            this.detectExecutionMode(sourceCode) !== "graphics") {
            issues.push({
                id: "console_visibility_1",
                type: "console_visibility",
                severity: "high",
                description: "Program may exit immediately without showing console output",
                symptoms: [
                    "Program compiles but no output visible",
                    "Process exits immediately",
                    "Console window not visible",
                ],
                detectedAt: new Date(),
                resolved: false,
                autoFixable: true,
            });
        }
        // Issue #1b: Blocking SLEEP statements
        const blockingSleepPattern = /PRINT\s+"Press any key[^"]*"\s*[\r\n]+\s*SLEEP/gi;
        if (blockingSleepPattern.test(sourceCode)) {
            issues.push({
                id: "console_visibility_2",
                type: "flow_control",
                severity: "high",
                description: 'Program contains blocking "Press any key" prompts that prevent automation',
                symptoms: [
                    "Program hangs waiting for user input",
                    "Automated testing fails",
                    "LLM cannot continue execution",
                ],
                detectedAt: new Date(),
                resolved: false,
                autoFixable: true,
            });
        }
        // Issue #4: File handle management
        const fileHandlePattern = /FREEFILE/g;
        const fileHandleCount = (sourceCode.match(fileHandlePattern) || []).length;
        if (fileHandleCount > 0) {
            issues.push({
                id: "file_handle_1",
                type: "file_handle",
                severity: "medium",
                description: `Code uses ${fileHandleCount} file handles without tracking or cleanup`,
                symptoms: [
                    "Cannot CREATE because file is already in use",
                    "Compilation errors after failed runs",
                    "File locking issues",
                ],
                detectedAt: new Date(),
                resolved: false,
                autoFixable: true,
            });
        }
        // Issue #6: Graphics context management
        const newImagePattern = /_NEWIMAGE/g;
        const newImageCount = (sourceCode.match(newImagePattern) || []).length;
        if (newImageCount > 0 && !sourceCode.includes("_FREEIMAGE")) {
            issues.push({
                id: "graphics_context_1",
                type: "graphics_context",
                severity: "medium",
                description: `Code creates ${newImageCount} images without proper cleanup`,
                symptoms: [
                    "Memory leaks",
                    "Graphics operations fail",
                    "Image handle errors",
                ],
                detectedAt: new Date(),
                resolved: false,
                autoFixable: true,
            });
        }
        // Process management issues
        if (sourceCode.includes("SYSTEM") && !sourceCode.includes("_DELAY")) {
            issues.push({
                id: "process_management_1",
                type: "process_management",
                severity: "low",
                description: "Program exits immediately without allowing observation",
                symptoms: [
                    "Process terminates too quickly to see output",
                    "No time to analyze graphics",
                ],
                detectedAt: new Date(),
                resolved: false,
                autoFixable: true,
            });
        }
        return issues;
    }
    /**
     * Generate solutions for detected issues
     */
    generateSolutions(issue, config) {
        const solutions = [];
        switch (issue.type) {
            case "console_visibility":
                solutions.push({
                    issueId: issue.id,
                    strategy: "code_injection",
                    priority: 1,
                    description: "Inject logging system using QB64PE's built-in _LOGINFO functions",
                    implementation: {
                        codeChanges: [
                            "Add _LOGINFO calls for debug output",
                            "Use _LOGERROR for error reporting with stacktraces",
                            "Add DEBUG_MODE constant for flow control",
                        ],
                    },
                    rationale: "QB64PE programs should use _LOGINFO for proper logging without disrupting program flow",
                });
                break;
            case "flow_control":
                solutions.push({
                    issueId: issue.id,
                    strategy: "template_replacement",
                    priority: 1,
                    description: "Replace blocking user input with conditional automation-friendly pauses",
                    implementation: {
                        codeChanges: [
                            "Replace SLEEP with conditional DebugPause function",
                            "Add automated timeout for DEBUG_MODE",
                            "Maintain interactive behavior for non-debug use",
                        ],
                    },
                    rationale: "Automated systems need timeout mechanisms to prevent indefinite hanging",
                });
                break;
            case "file_handle":
                solutions.push({
                    issueId: issue.id,
                    strategy: "code_injection",
                    priority: 2,
                    description: "Implement resource management system to track and cleanup file handles",
                    implementation: {
                        codeChanges: [
                            "Add ResourceManager system",
                            "Replace FREEFILE with tracked allocation",
                            "Add cleanup on program exit",
                        ],
                    },
                    rationale: "Proper resource management prevents file locking and compilation errors",
                });
                break;
            case "graphics_context":
                solutions.push({
                    issueId: issue.id,
                    strategy: "code_injection",
                    priority: 2,
                    description: "Add graphics context management with automatic cleanup and bounds checking",
                    implementation: {
                        codeChanges: [
                            "Add GraphicsManager system",
                            "Track image handles for cleanup",
                            "Add bounds checking for graphics operations",
                        ],
                    },
                    rationale: "Graphics programs need careful resource management to prevent memory leaks and crashes",
                });
                break;
            case "process_management":
                solutions.push({
                    issueId: issue.id,
                    strategy: "code_injection",
                    priority: 3,
                    description: "Add process management with delays and controlled exit",
                    implementation: {
                        codeChanges: [
                            "Add delays before SYSTEM calls",
                            "Add cleanup routines",
                            "Add debug output for process state",
                        ],
                    },
                    rationale: "Controlled program termination allows proper observation and cleanup",
                });
                break;
        }
        return solutions;
    }
    /**
     * Get debugging best practices guide
     */
    getDebuggingBestPractices() {
        return `
# QB64PE Debugging Best Practices

## Core Debugging Issues and Solutions

### 1. Debug Output and Logging Issues
**Problem**: Need debug output without disrupting program flow
**Solution**: Use QB64PE's built-in logging system
\`\`\`basic
' Use _LOGINFO for debug output:
_LOGINFO "Starting initialization"
_LOGINFO "Variable x = " + STR$(x)

' Use _LOGERROR for errors with automatic stacktrace:
_LOGERROR "Critical error occurred"
' Output includes full call stack showing SUB/FUNCTION hierarchy:
' [0.12100] ERROR QB64 MySub: 5: Critical error occurred
' #1 [0x00007FF6664AFA7E] in MySub() (QB64)
' #2 [0x00007FF6664AF891] in Main QB64 code

' Other logging levels:
_LOGWARN "Warning: Using default value"  ' Warnings
_LOGTRACE "Entering loop iteration"      ' Detailed traces
\`\`\`

### 2. File Handle and Resource Management Issues  
**Problem**: "Cannot CREATE because file is already in use"
**Solution**: Use tracked resource management
\`\`\`basic
' Auto-injected by debugging service:
handle = ResourceManager_GetFileHandle%
' ... use handle ...
' Cleanup handled automatically
\`\`\`

### 3. Graphics Context Issues
**Problem**: Graphics operations fail or cause memory leaks
**Solution**: Use graphics context management
\`\`\`basic
' Auto-injected by debugging service:
img = GraphicsManager_CreateImage&(800, 600)
CALL GraphicsManager_SafePSET(x, y, color)
' Cleanup handled automatically
\`\`\`

### 4. Flow Control for Automation
**Problem**: Programs hang waiting for user input
**Solution**: Use conditional automation pauses
\`\`\`basic
' Auto-injected by debugging service:
CALL DebugPause("Press any key to continue...")
' In DEBUG_MODE: auto-continues after timeout
' In normal mode: waits for user input
\`\`\`

## For LLMs and Automated Systems:

### DO:
- Use the debugging service to enhance code before execution
- Set reasonable timeouts (30-60 seconds for graphics, 15-30 for console)  
- Monitor process CPU usage to detect hanging
- Generate screenshots for graphics programs
- Parse console output for completion signals

### DON'T:
- Wait indefinitely for graphics programs to complete
- Ignore resource management warnings
- Skip debugging enhancements for complex programs
- Assume all QB64PE programs will auto-terminate

## Usage Examples:

### Basic Enhancement:
\`\`\`typescript
const debugService = new QB64PEDebuggingService();
const result = debugService.enhanceCodeForDebugging(sourceCode, {
  enableConsole: true,
  enableFlowControl: true,
  timeoutSeconds: 30
});
\`\`\`

### Full Debug Session:
\`\`\`typescript
const session = debugService.createDebuggingSession(sourceCode, projectPath, {
  enableConsole: true,
  enableLogging: true,
  enableScreenshots: true,
  enableFlowControl: true,
  enableResourceTracking: true,
  autoExit: true
});
\`\`\`

The debugging service automatically detects issues and applies appropriate fixes, making QB64PE development more reliable and automation-friendly.
`;
    }
    /**
     * Get comprehensive debugging guide for LLMs
     */
    getLLMDebuggingGuide() {
        return `
# QB64PE Debugging Guide for LLMs

## CRITICAL: Never Wait Indefinitely for QB64PE Programs

### Program Type Detection:
1. **Graphics-Only**: No $CONSOLE, uses SCREEN/graphics → Will open window, may wait forever
2. **Console+Graphics**: Has $CONSOLE + graphics → Monitor console, allow graphics interaction  
3. **Console-Only**: Has $CONSOLE, minimal graphics → Monitor STDOUT for completion

### Timeout Strategy:
- **Graphics programs**: 30-60 seconds max, then suggest human testing
- **Console programs**: 15-30 seconds for simple, 60+ for complex
- **Mixed programs**: Monitor console output, timeout graphics portions

### Automated Debugging Workflow:

1. **Enhance Code First**:
\`\`\`typescript
const debugService = new QB64PEDebuggingService();
const enhanced = debugService.enhanceCodeForDebugging(sourceCode, {
  enableConsole: true,
  enableFlowControl: true,
  timeoutSeconds: 30,
  autoExit: true
});
\`\`\`

2. **Compile Enhanced Version**:
\`\`\`bash
qb64pe -c enhanced_program.bas
\`\`\`

3. **Execute with Monitoring**:
\`\`\`bash
# Start program with output redirection
./enhanced_program.exe > output.log 2>&1 &
PID=$!

# Monitor for timeout
timeout 30s tail -f output.log &
wait $PID || kill $PID
\`\`\`

4. **Parse Results**:
- Check output.log for completion signals
- Look for screenshots in qb64pe-screenshots/
- Review debug logs in qb64pe-logs/
- Analyze any error messages

### Console Output Patterns to Watch For:

**Completion Signals**:
- "Program completed", "END", "SYSTEM", "finished"
- "Press any key to exit" (in enhanced code)
- Process termination

**Input Prompts** (require intervention):
- "Enter value:", "Press Y/N:", "Choose option:"
- Any line ending with ":" or "?"

**Error Signals**:
- "Error", "Failed", "Cannot", "Invalid"
- Compiler error messages
- Runtime exception messages

### Graphics Program Handling:

**Never wait indefinitely for graphics windows**. Instead:

1. Take early screenshots (auto-generated by debugging system)
2. Monitor CPU usage: low steady usage = waiting for input  
3. Check for window responsiveness
4. Timeout after 30-60 seconds
5. Suggest human testing for interactive elements

### Resource Management:

The debugging system automatically handles:
- File handle tracking and cleanup
- Image handle management  
- Graphics context preservation
- Process termination cleanup

### Error Recovery:

Common issues and auto-fixes:
- **Console not visible**: $CONSOLE injection
- **Program hangs**: Timeout and flow control  
- **File locked**: Resource cleanup
- **Graphics errors**: Context management
- **Memory leaks**: Automatic cleanup

### Example LLM Decision Tree:

\`\`\`
1. Analyze source code with debugging service
2. Apply enhancements based on detected issues
3. Compile enhanced version
4. Execute with timeout monitoring
5. If graphics-only: timeout quickly, suggest human testing
6. If console output: parse for completion signals  
7. If mixed: monitor console, screenshot graphics
8. If hangs: terminate and analyze partial results
9. If errors: apply additional debugging enhancements
10. Report results with debugging recommendations
\`\`\`

### Key Takeaway:
**Use the debugging service to make QB64PE programs automation-friendly, but still respect timeouts and human handoff for interactive programs.**
`;
    }
    /**
     * Get debug session status
     */
    getSessionStatus(sessionId) {
        return this.debugSessions.get(sessionId);
    }
    /**
     * List all active debug sessions
     */
    getActiveSessions() {
        return Array.from(this.debugSessions.values()).filter((session) => session.status === "active");
    }
    /**
     * Close debug session
     */
    closeSession(sessionId) {
        const session = this.debugSessions.get(sessionId);
        if (session) {
            session.status = "completed";
            session.lastActivity = new Date();
            return true;
        }
        return false;
    }
}
exports.QB64PEDebuggingService = QB64PEDebuggingService;
//# sourceMappingURL=debugging-service.js.map
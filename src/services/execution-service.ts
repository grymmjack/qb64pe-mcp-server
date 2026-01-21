import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Load keywords data for dynamic graphics detection
const KEYWORDS_DATA_PATH = path.join(__dirname, '../data/keywords-data.json');
let keywordsData: any = null;
let graphicsKeywordsCache: Set<string> | null = null;

/**
 * Load and cache QB64PE keywords data
 */
function loadKeywordsData(): any {
  if (!keywordsData) {
    try {
      const data = fs.readFileSync(KEYWORDS_DATA_PATH, 'utf8');
      keywordsData = JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load keywords data: ${error}`);
      keywordsData = { categories: {} };
    }
  }
  return keywordsData;
}

/**
 * Build and cache set of graphics-related keywords
 * Includes all keywords that produce screen output
 */
function getGraphicsKeywords(): Set<string> {
  if (graphicsKeywordsCache) {
    return graphicsKeywordsCache;
  }

  const data = loadKeywordsData();
  const graphicsKeywords = new Set<string>();
  
  // Graphics-related keyword patterns (case-insensitive)
  const graphicsPatterns = [
    /SCREEN/i, /_NEWIMAGE/i, /_LOADIMAGE/i, /_DISPLAY/i, /_PUTIMAGE/i,
    /PSET/i, /PRESET/i, /LINE/i, /CIRCLE/i, /PAINT/i, /DRAW/i,
    /COLOR/i, /PALETTE/i, /CLS/i, /POINT/i, /GET/i, /PUT/i,
    /_PRINTSTRING/i, /_UPRINTSTRING/i, /_FONT/i, /_PRINTMODE/i,
    /_COPYIMAGE/i, /_FREEIMAGE/i, /_SAVEIMAGE/i, /_SCREENIMAGE/i,
    /_MAPTRIANGLE/i, /_SETALPHA/i, /_BLEND/i, /_DONTBLEND/i,
    /_CLEARCOLOR/i, /PCOPY/i, /VIEW/i, /WINDOW/i, /_PRINTWIDTH/i,
    /LOCATE/i, /_WIDTH/i, /_HEIGHT/i, /_RESIZE/i, /_BACKGROUNDCOLOR/i,
    /_ALPHA/i, /_BLUE/i, /_GREEN/i, /_RED/i, /_RGB/i, /_RGBA/i,
    /_SCREENSHOW/i, /_SCREENHIDE/i, /_SCREENMOVE/i, /_SCREENCLICK/i,
    /_SCREENX/i, /_SCREENY/i, /_SCREENICON/i, /_TITLE/i,
    /_GLRENDER/i, /_DEPTHBUFFER/i, /SMOOTH/i, /STEP/i,
  ];
  
  // Add keywords from the database that match graphics patterns
  if (data.keywords) {
    for (const [keywordName, keywordInfo] of Object.entries(data.keywords)) {
      const keyword = keywordName.toUpperCase();
      
      // Check if keyword matches any graphics pattern
      if (graphicsPatterns.some(pattern => pattern.test(keyword))) {
        graphicsKeywords.add(keyword);
      }
    }
  }
  
  // Also check categories for graphics-related keywords
  if (data.categories) {
    const categoriesToCheck = ['statements', 'functions'];
    
    for (const categoryName of categoriesToCheck) {
      const category = data.categories[categoryName];
      if (category && category.keywords && Array.isArray(category.keywords)) {
        for (const keyword of category.keywords) {
          const keywordUpper = keyword.toUpperCase();
          if (graphicsPatterns.some(pattern => pattern.test(keywordUpper))) {
            graphicsKeywords.add(keywordUpper);
          }
        }
      }
    }
  }
  
  // Fallback: if data loading failed, use minimal essential graphics keywords
  if (graphicsKeywords.size === 0) {
    console.warn('No graphics keywords loaded from data, using fallback set');
    [
      'SCREEN', 'PSET', 'PRESET', 'LINE', 'CIRCLE', 'PAINT', 'DRAW',
      'PUT', 'GET', 'POINT', '_PUTIMAGE', '_LOADIMAGE', '_NEWIMAGE',
      '_DISPLAY', '_LIMIT', 'COLOR', 'PALETTE', 'CLS',
      '_SCREENIMAGE', '_SAVEIMAGE', '_FREEIMAGE', '_PRINTSTRING'
    ].forEach(kw => graphicsKeywords.add(kw));
  }
  
  graphicsKeywordsCache = graphicsKeywords;
  return graphicsKeywords;
}

export interface ExecutionState {
  processId?: number;
  status: 'not_started' | 'running' | 'completed' | 'terminated' | 'graphics_mode' | 'console_mode';
  hasGraphics: boolean;
  hasConsole: boolean;
  startTime?: Date;
  lastActivity?: Date;
  outputFile?: string;
  screenshotDir?: string;
  logFile?: string;
}

export interface ProcessInfo {
  pid: number;
  command: string;
  cpu: number;
  memory: number;
  status: string;
}

export interface ExecutionGuidance {
  recommendation: string;
  waitingBehavior: 'wait_indefinitely' | 'wait_timeout' | 'wait_user_input' | 'terminate';
  monitoringStrategy: string[];
  crossPlatformCommands: {
    windows: string[];
    linux: string[];
    macos: string[];
  };
  outputParsing: {
    consolePatterns: string[];
    graphicsIndicators: string[];
    completionSignals: string[];
  };
}

/**
 * Service for monitoring and managing QB64PE program execution
 */
export class QB64PEExecutionService {
  private readonly screenshotDir: string;
  private readonly logDir: string;
  private readonly platform: string;

  constructor() {
    this.platform = os.platform();
    this.screenshotDir = path.join(process.cwd(), 'qb64pe-screenshots');
    this.logDir = path.join(process.cwd(), 'qb64pe-logs');
    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist and are in .gitignore
   */
  private ensureDirectories(): void {
    // Create directories if they don't exist
    [this.screenshotDir, this.logDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Ensure .gitignore contains our directories
    this.updateGitignore();
  }

  /**
   * Update .gitignore to exclude QB64PE output directories
   */
  private updateGitignore(): void {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    const requiredEntries = [
      '# QB64PE execution output',
      'qb64pe-screenshots/',
      'qb64pe-logs/',
      '*.exe',
      '*.dmg',
      '# QB64PE temporary files',
      'internal/temp/',
      'internal/c/parts/core/temp/',
      ''
    ];

    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    // Check if QB64PE entries already exist
    const hasQB64PEEntries = gitignoreContent.includes('qb64pe-screenshots/');
    
    if (!hasQB64PEEntries) {
      gitignoreContent += '\n' + requiredEntries.join('\n');
      fs.writeFileSync(gitignorePath, gitignoreContent);
    }
  }

  /**
   * Analyze QB64PE source code to determine execution characteristics
   */
  analyzeExecutionMode(sourceCode: string): ExecutionState {
    const hasConsole = /\$CONSOLE/i.test(sourceCode);
    const hasGraphics = this.detectGraphicsUsage(sourceCode);
    
    let status: ExecutionState['status'] = 'not_started';
    if (hasGraphics && hasConsole) {
      status = 'graphics_mode'; // Graphics with console window
    } else if (hasConsole) {
      status = 'console_mode';
    } else if (hasGraphics) {
      status = 'graphics_mode';
    }

    return {
      status,
      hasGraphics,
      hasConsole,
      screenshotDir: hasGraphics ? this.screenshotDir : undefined,
      logFile: path.join(this.logDir, `execution_${Date.now()}.log`)
    };
  }

  /**
   * Detect if source code uses graphics functions
   * Dynamically uses the validated QB64PE keyword database
   */
  private detectGraphicsUsage(sourceCode: string): boolean {
    const graphicsKeywords = getGraphicsKeywords();
    const codeUpper = sourceCode.toUpperCase();
    
    // Check if any graphics keyword appears in the source code
    for (const keyword of graphicsKeywords) {
      // Use word boundary regex to avoid false matches in variable names
      const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (pattern.test(codeUpper)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get execution guidance based on program characteristics
   */
  getExecutionGuidance(executionState: ExecutionState): ExecutionGuidance {
    const guidance: ExecutionGuidance = {
      recommendation: '',
      waitingBehavior: 'wait_timeout',
      monitoringStrategy: [],
      crossPlatformCommands: {
        windows: [],
        linux: [],
        macos: []
      },
      outputParsing: {
        consolePatterns: [
          '^[A-Za-z0-9\\s\\-_\\.]+$', // Clean text output
          '^\\s*\\d+\\s*$', // Numeric output
          '^\\s*[A-Za-z]+\\s*:\\s*.+$', // Label: value pairs
          '^\\|[\\s\\-\\|]+\\|$' // ASCII tables
        ],
        graphicsIndicators: [
          'graphics window', 'display mode', 'screen resolution',
          'image loaded', 'sprite', 'pixel', 'drawing'
        ],
        completionSignals: [
          'Press any key', 'END', 'SYSTEM', 'program finished',
          'execution complete', 'Process finished'
        ]
      }
    };

    if (executionState.hasGraphics && !executionState.hasConsole) {
      // Graphics-only programs
      guidance.recommendation = `Graphics-only program detected. This will open a graphics window and may run indefinitely waiting for user interaction. The LLM should NOT wait forever for completion - instead, allow human interaction to test the graphics output.`;
      guidance.waitingBehavior = 'wait_user_input';
      guidance.monitoringStrategy = [
        'Monitor process CPU usage - if low and stable, program is likely waiting for input',
        'Generate periodic screenshots using embedded _SAVEIMAGE calls',
        'Use process monitoring to detect if window is responsive',
        'Set reasonable timeout (30-60 seconds) before suggesting manual testing'
      ];
    } else if (executionState.hasGraphics && executionState.hasConsole) {
      // Graphics with console
      guidance.recommendation = `Mixed graphics/console program detected. Monitor both console output and graphics window. Console output can be tracked for progress, while graphics require human interaction.`;
      guidance.waitingBehavior = 'wait_timeout';
      guidance.monitoringStrategy = [
        'Parse console output for completion signals',
        'Monitor graphics window for user interaction requirements',
        'Track process CPU/memory usage for hung state detection',
        'Generate screenshots at key intervals'
      ];
    } else if (executionState.hasConsole) {
      // Console-only programs
      guidance.recommendation = `Console program detected. Output can be monitored through STDOUT/STDERR. Watch for completion signals or input prompts.`;
      guidance.waitingBehavior = 'wait_timeout';
      guidance.monitoringStrategy = [
        'Parse console output line by line',
        'Look for INPUT statements or user prompts',
        'Monitor for program completion signals',
        'Track execution time and process status'
      ];
    } else {
      // Unknown or minimal program
      guidance.recommendation = `Program execution mode unclear. Monitor conservatively with timeout.`;
      guidance.waitingBehavior = 'wait_timeout';
      guidance.monitoringStrategy = [
        'Use process monitoring to detect completion',
        'Set conservative timeout (15-30 seconds)',
        'Check for any output or error messages'
      ];
    }

    // Platform-specific commands
    guidance.crossPlatformCommands = {
      windows: [
        'tasklist /FI "IMAGENAME eq *.exe" /FO CSV',
        'wmic process where "name like \'%qb64pe%\'" get ProcessId,CommandLine,PageFileUsage',
        'taskkill /PID {pid} /F',
        'powershell "Get-Process | Where-Object {$_.ProcessName -like \'*qb64*\'}"'
      ],
      linux: [
        'ps aux | grep qb64',
        'pgrep -f qb64',
        'kill -9 {pid}',
        'pstree -p {pid}',
        'lsof -p {pid}'
      ],
      macos: [
        'ps aux | grep qb64',
        'pgrep -f qb64',
        'kill -9 {pid}',
        'lsof -p {pid}',
        'top -pid {pid} -l 1'
      ]
    };

    return guidance;
  }

  /**
   * Generate cross-platform process monitoring commands
   */
  getProcessMonitoringCommands(processName: string = 'qb64pe'): string[] {
    switch (this.platform) {
      case 'win32':
        return [
          `tasklist /FI "IMAGENAME eq ${processName}*" /FO CSV`,
          `wmic process where "CommandLine like '%${processName}%'" get ProcessId,CommandLine,WorkingSetSize,UserModeTime`,
          `powershell "Get-Process | Where-Object {$_.ProcessName -like '*${processName}*'} | Select-Object Id,Name,CPU,WorkingSet,StartTime"`
        ];
      
      case 'linux':
        return [
          `ps aux | grep "${processName}" | grep -v grep`,
          `pgrep -af "${processName}"`,
          `top -b -n 1 | grep "${processName}"`,
          `lsof | grep "${processName}"`
        ];
      
      case 'darwin': // macOS
        return [
          `ps aux | grep "${processName}" | grep -v grep`,
          `pgrep -af "${processName}"`,
          `top -l 1 | grep "${processName}"`,
          `lsof | grep "${processName}"`
        ];
      
      default:
        return [
          `ps aux | grep "${processName}" | grep -v grep`,
          `pgrep -af "${processName}"`
        ];
    }
  }

  /**
   * Generate cross-platform process termination commands
   */
  getProcessTerminationCommands(pid: number): string[] {
    switch (this.platform) {
      case 'win32':
        return [
          `taskkill /PID ${pid} /T`, // Graceful termination
          `taskkill /PID ${pid} /F /T` // Force termination with child processes
        ];
      
      case 'linux':
      case 'darwin':
        return [
          `kill ${pid}`, // SIGTERM
          `kill -9 ${pid}` // SIGKILL
        ];
      
      default:
        return [`kill ${pid}`, `kill -9 ${pid}`];
    }
  }

  /**
   * Generate QB64PE code template for logging and screenshots
   */
  generateMonitoringTemplate(originalCode: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = path.join(this.logDir, `execution_${timestamp}.log`);
    const screenshotBase = path.join(this.screenshotDir, `screenshot_${timestamp}`);

    const monitoringCode = `
' ============================================================================
' QB64PE Execution Monitoring Template
' Auto-generated monitoring wrapper for better execution visibility
' ============================================================================

$CONSOLE ' Enable console for logging output

' Monitoring variables
DIM LogFile AS STRING
DIM ScreenshotCounter AS INTEGER
DIM StartTime AS DOUBLE

' Initialize monitoring
LogFile = "${logFile.replace(/\\/g, '/')}"
ScreenshotCounter = 0
StartTime = TIMER

' Log program start
OPEN LogFile FOR APPEND AS #99
PRINT #99, "=== QB64PE Program Started at " + DATE$ + " " + TIME$ + " ==="
PRINT #99, "Platform: " + _OS$
PRINT #99, "Screen Mode: " + STR$(_WIDTH) + "x" + STR$(_HEIGHT)
CLOSE #99

' Console output formatting
_DEST _CONSOLE
COLOR 15, 1 ' White on blue for headers
PRINT STRING$(60, "=")
PRINT "  QB64PE PROGRAM EXECUTION MONITOR"
PRINT "  Started: " + DATE$ + " " + TIME$
PRINT "  Log: ${path.basename(logFile)}"
PRINT STRING$(60, "=")
COLOR 7, 0 ' Reset to normal

' Monitoring SUBs
SUB LogMessage (msg AS STRING)
    OPEN LogFile FOR APPEND AS #99
    PRINT #99, TIME$ + " - " + msg
    CLOSE #99
    
    ' Also print to console with formatting
    _DEST _CONSOLE
    COLOR 14, 0 ' Yellow text
    PRINT "[LOG] " + TIME$ + " - " + msg
    COLOR 7, 0 ' Reset
    _DEST 0
END SUB

SUB TakeScreenshot
    IF _DEST <> _CONSOLE THEN ' Only if graphics mode
        ScreenshotCounter = ScreenshotCounter + 1
        DIM filename AS STRING
        filename = "${screenshotBase.replace(/\\/g, '/')}_" + RIGHT$("000" + LTRIM$(STR$(ScreenshotCounter)), 3) + ".bmp"
        _SAVEIMAGE filename
        CALL LogMessage("Screenshot saved: " + filename)
    END IF
END SUB

SUB MonitoringCleanup
    DIM ElapsedTime AS DOUBLE
    ElapsedTime = TIMER - StartTime
    CALL LogMessage("Program completed. Runtime: " + STR$(ElapsedTime) + " seconds")
    
    _DEST _CONSOLE
    COLOR 10, 0 ' Green
    PRINT STRING$(60, "-")
    PRINT "EXECUTION COMPLETED - Runtime: " + STR$(ElapsedTime) + "s"
    PRINT "Check log file: ${path.basename(logFile)}"
    IF ScreenshotCounter > 0 THEN
        PRINT "Screenshots taken: " + STR$(ScreenshotCounter)
    END IF
    PRINT STRING$(60, "-")
    COLOR 7, 0
END SUB

' ============================================================================
' ORIGINAL PROGRAM CODE BEGINS HERE
' ============================================================================

CALL LogMessage("Starting original program code")

${originalCode}

' ============================================================================
' MONITORING CLEANUP
' ============================================================================

CALL LogMessage("Original program code completed")
CALL MonitoringCleanup

' Final screenshot if graphics were used
CALL TakeScreenshot

PRINT "Press any key to exit..."
SLEEP
SYSTEM
`;

    return monitoringCode;
  }

  /**
   * Generate improved console output template with formatting
   */
  generateConsoleFormattingTemplate(): string {
    return `
' ============================================================================
' QB64PE Enhanced Console Output Template
' Improved formatting for better terminal parsing and human readability
' ============================================================================

$CONSOLE ' Enable console output

' Console formatting constants
CONST HEADER_COLOR = 15 ' White
CONST HEADER_BG = 1     ' Blue
CONST INFO_COLOR = 14   ' Yellow
CONST SUCCESS_COLOR = 10 ' Green
CONST ERROR_COLOR = 12  ' Red
CONST NORMAL_COLOR = 7  ' Light gray
CONST NORMAL_BG = 0     ' Black

' Formatting helper SUBs
SUB PrintHeader (title AS STRING)
    _DEST _CONSOLE
    COLOR HEADER_COLOR, HEADER_BG
    PRINT STRING$(60, "=")
    PRINT "  " + title
    PRINT STRING$(60, "=")
    COLOR NORMAL_COLOR, NORMAL_BG
    _DEST 0
END SUB

SUB PrintInfo (label AS STRING, value AS STRING)
    _DEST _CONSOLE
    COLOR INFO_COLOR, NORMAL_BG
    PRINT "[INFO] " + SPACE$(12 - LEN(label)) + label + ": ";
    COLOR NORMAL_COLOR, NORMAL_BG
    PRINT value
    _DEST 0
END SUB

SUB PrintSuccess (message AS STRING)
    _DEST _CONSOLE
    COLOR SUCCESS_COLOR, NORMAL_BG
    PRINT "[SUCCESS] " + message
    COLOR NORMAL_COLOR, NORMAL_BG
    _DEST 0
END SUB

SUB PrintError (message AS STRING)
    _DEST _CONSOLE
    COLOR ERROR_COLOR, NORMAL_BG
    PRINT "[ERROR] " + message
    COLOR NORMAL_COLOR, NORMAL_BG
    _DEST 0
END SUB

SUB PrintTable (headers() AS STRING, data() AS STRING, rows AS INTEGER, cols AS INTEGER)
    DIM i AS INTEGER, j AS INTEGER
    DIM colWidth AS INTEGER
    colWidth = 15 ' Adjust as needed
    
    _DEST _CONSOLE
    
    ' Print header
    COLOR HEADER_COLOR, HEADER_BG
    PRINT "|";
    FOR j = 0 TO cols - 1
        PRINT " " + LEFT$(headers(j) + SPACE$(colWidth), colWidth) + " |";
    NEXT j
    PRINT
    
    ' Print separator
    COLOR NORMAL_COLOR, NORMAL_BG
    PRINT "|";
    FOR j = 0 TO cols - 1
        PRINT STRING$(colWidth + 2, "-") + "|";
    NEXT j
    PRINT
    
    ' Print data rows
    FOR i = 0 TO rows - 1
        PRINT "|";
        FOR j = 0 TO cols - 1
            PRINT " " + LEFT$(data(i * cols + j) + SPACE$(colWidth), colWidth) + " |";
        NEXT j
        PRINT
    NEXT i
    
    COLOR NORMAL_COLOR, NORMAL_BG
    _DEST 0
END SUB

' Example usage:
CALL PrintHeader("QB64PE PROGRAM OUTPUT")
CALL PrintInfo("Version", "QB64PE v3.14.1")
CALL PrintInfo("Platform", _OS$)
CALL PrintInfo("Start Time", DATE$ + " " + TIME$)

' Your program logic here...

CALL PrintSuccess("Program completed successfully!")
`;
  }

  /**
   * Get real-time execution monitoring guidance
   */
  getRealTimeMonitoringGuidance(): string {
    return `
# QB64PE Real-Time Execution Monitoring Guide

## For LLMs and Automated Systems:

### 1. **DO NOT WAIT INDEFINITELY**
- Graphics programs often run continuously waiting for user input
- Set reasonable timeouts: 30-60 seconds for graphics, 15-30 for console
- Monitor CPU usage: steady low usage often means "waiting for input"

### 2. **Detect Program Types**
\`\`\`
Graphics Only: No $CONSOLE, uses SCREEN/graphics functions
→ Will open window, may wait forever for user interaction
→ TIMEOUT EARLY, let humans test interactively

Console + Graphics: Has $CONSOLE + graphics functions  
→ Monitor console output, allow graphics interaction
→ Parse console for completion signals

Console Only: Has $CONSOLE, minimal/no graphics
→ Monitor STDOUT/STDERR, look for completion
→ Watch for INPUT prompts requiring user input
\`\`\`

### 3. **Cross-Platform Process Monitoring**

**Windows:**
\`\`\`powershell
# Check if QB64PE processes are running
tasklist /FI "IMAGENAME eq *.exe" | findstr qb64
wmic process where "CommandLine like '%qb64%'" get ProcessId,WorkingSetSize

# Terminate if needed
taskkill /PID {pid} /F
\`\`\`

**Linux/macOS:**
\`\`\`bash
# Monitor processes
ps aux | grep qb64 | grep -v grep
pgrep -af qb64

# Check resource usage
top -p {pid} -n 1

# Terminate if needed  
kill {pid}        # Graceful
kill -9 {pid}     # Force
\`\`\`

### 4. **Output Parsing Strategies**

**Console Output Patterns:**
- Clean text: "Processing file..."
- Results: "Result: 42" 
- Tables: "|  Name  | Value |"
- Completion: "Press any key", "END", "finished"
- Input prompts: "Enter value:", "Press Y/N:"

**Graphics Indicators:**
- Window creation messages
- "Image loaded", "Drawing complete"
- Low CPU after initial spike = waiting for input

### 5. **Automated Screenshot Generation**

Insert into QB64PE code:
\`\`\`basic
SUB TakeScreenshot (filename AS STRING)
    _SAVEIMAGE filename + "_" + TIME$ + ".bmp"
END SUB

' Call periodically or at key points
CALL TakeScreenshot("debug")
\`\`\`

### 6. **Log File Monitoring**

Tail log files for real-time progress:
\`\`\`bash
# Linux/macOS
tail -f qb64pe-logs/execution_*.log

# Windows PowerShell
Get-Content -Path "qb64pe-logs\\execution_*.log" -Wait -Tail 10
\`\`\`

### 7. **Termination Strategies**

1. **Graceful**: Send SIGTERM/close signal, wait 5 seconds
2. **Force**: Use SIGKILL/taskkill /F if needed
3. **Cleanup**: Remove temporary files, close log handles

## For Human Users:

- Graphics programs are meant for interaction - click, key press, etc.
- Console output shows program progress and debug info
- Screenshots capture visual output for iteration/debugging
- Log files provide execution timeline and error tracking

## Key Takeaway:
**LLMs should NOT wait forever for QB64PE graphics programs. Timeout early and hand over to human for interactive testing.**
`;
  }

  /**
   * Parse console output for completion signals
   */
  parseConsoleOutput(output: string): {
    isWaitingForInput: boolean;
    isCompleted: boolean;
    lastActivity: string;
    suggestedAction: string;
  } {
    const lines = output.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const lastLine = lines[lines.length - 1] || '';
    const lastFewLines = lines.slice(-5).join(' ').toLowerCase();

    // Check for input prompts
    const inputPrompts = [
      'press any key', 'enter', 'input', 'type', 'choose',
      'y/n', 'yes/no', 'continue', 'press', 'key'
    ];
    const isWaitingForInput = inputPrompts.some(prompt => 
      lastFewLines.includes(prompt)
    );

    // Check for completion signals
    const completionSignals = [
      'end', 'finished', 'complete', 'done', 'exit', 'system',
      'program completed', 'execution finished', 'closing'
    ];
    const isCompleted = completionSignals.some(signal => 
      lastFewLines.includes(signal)
    );

    // Determine suggested action
    let suggestedAction = 'continue_monitoring';
    if (isCompleted) {
      suggestedAction = 'program_completed';
    } else if (isWaitingForInput) {
      suggestedAction = 'requires_user_input';
    } else if (lines.length === 0) {
      suggestedAction = 'no_output_timeout_recommended';
    }

    return {
      isWaitingForInput,
      isCompleted,
      lastActivity: lastLine,
      suggestedAction
    };
  }

  /**
   * Get file monitoring utilities for log tailing
   */
  getFileMonitoringCommands(logFile: string): string[] {
    const absolutePath = path.resolve(logFile);
    
    switch (this.platform) {
      case 'win32':
        return [
          `powershell "Get-Content -Path '${absolutePath}' -Wait -Tail 10"`,
          `type "${absolutePath}"`,
          `findstr /N "ERROR\\|WARNING\\|SUCCESS" "${absolutePath}"`
        ];
      
      case 'linux':
      case 'darwin':
        return [
          `tail -f "${absolutePath}"`,
          `tail -10 "${absolutePath}"`,
          `grep -n "ERROR\\|WARNING\\|SUCCESS" "${absolutePath}"`
        ];
      
      default:
        return [`tail -f "${absolutePath}"`];
    }
  }
}

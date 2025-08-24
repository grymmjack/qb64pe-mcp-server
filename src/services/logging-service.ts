/**
 * QB64PE Logging Service
 * 
 * Provides native QB64PE logging capabilities and enhanced console output management
 * for automated debugging and LLM analysis workflows.
 * 
 * Key Features:
 * - Native QB64PE logging function injection (_LOGINFO, _LOGERROR, etc.)
 * - $CONSOLE:ONLY directive management for shell redirection
 * - Structured output section generation
 * - Automated output capture and parsing
 */

export interface LoggingConfiguration {
    enableNativeLogging: boolean;
    enableStructuredOutput: boolean;
    consoleDirective: '$CONSOLE' | '$CONSOLE:ONLY';
    logLevel: 'TRACE' | 'INFO' | 'WARN' | 'ERROR';
    autoExitTimeout: number;
    outputSections: string[];
}

export interface LogEntry {
    level: 'TRACE' | 'INFO' | 'WARN' | 'ERROR';
    message: string;
    timestamp?: string;
    section?: string;
}

export interface StructuredOutput {
    sections: Record<string, string[]>;
    logs: LogEntry[];
    summary: {
        success: boolean;
        totalSteps: number;
        failedSteps: number;
        executionTime?: number;
    };
}

export class QB64PELoggingService {
    private defaultConfig: LoggingConfiguration = {
        enableNativeLogging: true,
        enableStructuredOutput: true,
        consoleDirective: '$CONSOLE:ONLY', // Critical for shell redirection
        logLevel: 'INFO',
        autoExitTimeout: 10,
        outputSections: [
            'PROGRAM ANALYSIS',
            'HEADER VALIDATION', 
            'DATA PROCESSING',
            'RESULTS SUMMARY'
        ]
    };

    /**
     * Inject native QB64PE logging functions into source code
     */
    public injectNativeLogging(sourceCode: string, config?: Partial<LoggingConfiguration>): string {
        const cfg = { ...this.defaultConfig, ...config };
        
        let enhanced = sourceCode;

        // Ensure proper console directive for automation
        if (!enhanced.includes('$CONSOLE')) {
            enhanced = `${cfg.consoleDirective}\n${enhanced}`;
        } else {
            // Fix existing console directive
            enhanced = enhanced.replace(/\$CONSOLE(?!:ONLY)/g, cfg.consoleDirective);
        }

        // Add logging function definitions if not present
        if (!enhanced.includes('_LOGINFO') && cfg.enableNativeLogging) {
            const loggingHeader = this.generateLoggingHeader(cfg);
            enhanced = this.insertAfterDirectives(enhanced, loggingHeader);
        }

        return enhanced;
    }

    /**
     * Generate structured output sections for systematic debugging
     */
    public generateStructuredOutput(
        sections: string[], 
        includeLogging: boolean = true
    ): string {
        let output = '';

        sections.forEach((section, index) => {
            const sectionName = section.toUpperCase().replace(/\s+/g, ' ');
            output += `\nPRINT "=== ${sectionName} ==="\n`;
            
            if (includeLogging) {
                output += `_LOGINFO "Starting ${section.toLowerCase()}"\n`;
            }
            
            output += `' TODO: Add ${section.toLowerCase()} logic here\n`;
            output += `PRINT "Step ${index + 1} completed"\n`;
        });

        return output;
    }

    /**
     * Enhance existing QB64PE code with comprehensive logging
     */
    public enhanceCodeWithLogging(
        sourceCode: string, 
        config?: Partial<LoggingConfiguration>
    ): string {
        const cfg = { ...this.defaultConfig, ...config };
        let enhanced = this.injectNativeLogging(sourceCode, cfg);

        // Add structured sections if enabled
        if (cfg.enableStructuredOutput) {
            enhanced = this.addStructuredSections(enhanced, cfg);
        }

        // Add auto-exit mechanism for automation
        enhanced = this.addAutoExitMechanism(enhanced, cfg);

        // Add error handling and cleanup
        enhanced = this.addErrorHandling(enhanced, cfg);

        return enhanced;
    }

    /**
     * Parse structured output from QB64PE program execution
     */
    public parseStructuredOutput(output: string): StructuredOutput {
        const sections: Record<string, string[]> = {};
        const logs: LogEntry[] = [];
        
        const lines = output.split('\n');
        let currentSection = '';
        let success = true;
        let totalSteps = 0;
        let failedSteps = 0;

        for (const line of lines) {
            const trimmed = line.trim();
            
            // Parse section headers
            const sectionMatch = trimmed.match(/^=== (.+) ===$/);
            if (sectionMatch) {
                currentSection = sectionMatch[1];
                sections[currentSection] = [];
                continue;
            }

            // Parse log entries (native QB64PE logging)
            const logMatch = trimmed.match(/^(TRACE|INFO|WARN|ERROR):\s*(.+)$/);
            if (logMatch) {
                logs.push({
                    level: logMatch[1] as LogEntry['level'],
                    message: logMatch[2],
                    section: currentSection || undefined,
                    timestamp: new Date().toISOString()
                });
                
                if (logMatch[1] === 'ERROR') {
                    success = false;
                    failedSteps++;
                }
                continue;
            }

            // Parse step completion
            if (trimmed.includes('Step') && trimmed.includes('completed')) {
                totalSteps++;
            }

            // Parse success/failure indicators
            if (trimmed.startsWith('FAILED:') || trimmed.includes('ERROR')) {
                success = false;
                failedSteps++;
            }

            // Add to current section
            if (currentSection && trimmed) {
                sections[currentSection].push(trimmed);
            }
        }

        return {
            sections,
            logs,
            summary: {
                success,
                totalSteps,
                failedSteps
            }
        };
    }

    /**
     * Generate debugging template with advanced logging
     */
    public generateAdvancedDebuggingTemplate(
        programName: string,
        analysisSteps: string[],
        config?: Partial<LoggingConfiguration>
    ): string {
        const cfg = { ...this.defaultConfig, ...config };
        
        return `${cfg.consoleDirective}
OPTION _EXPLICIT

' Advanced Debugging Template for ${programName}
' Generated with QB64PE Logging Service
' Date: ${new Date().toISOString()}

CONST DEBUG_MODE = 1
CONST PROGRAM_NAME$ = "${programName}"
CONST LOG_LEVEL = 2 ' INFO level

DIM program_start_time AS DOUBLE
DIM current_step AS INTEGER
DIM total_errors AS INTEGER

' Initialize logging
program_start_time = TIMER
_LOGINFO "Starting " + PROGRAM_NAME$ + " analysis"
PRINT "=== PROGRAM INITIALIZATION ==="
PRINT "Program: " + PROGRAM_NAME$
PRINT "Start Time: " + STR$(program_start_time)
PRINT "Debug Mode: " + STR$(DEBUG_MODE)

${this.generateStructuredAnalysisSteps(analysisSteps)}

' Results summary with native logging
PRINT "=== EXECUTION SUMMARY ==="
IF total_errors = 0 THEN
    _LOGINFO "Analysis completed successfully"
    PRINT "SUCCESS: All " + STR$(current_step) + " steps completed"
ELSE
    _LOGERROR "Analysis failed with " + STR$(total_errors) + " errors"
    PRINT "FAILED: " + STR$(total_errors) + " errors in " + STR$(current_step) + " steps"
END IF

DIM execution_time AS DOUBLE
execution_time = TIMER - program_start_time
PRINT "Execution Time: " + STR$(execution_time) + " seconds"
_LOGINFO "Total execution time: " + STR$(execution_time) + " seconds"

' Auto-exit for automation
IF DEBUG_MODE = 1 THEN
    PRINT "Auto-exiting in " + STR$(${cfg.autoExitTimeout}) + " seconds..."
    _DELAY ${cfg.autoExitTimeout}
    SYSTEM
END IF

' Cleanup and exit
_LOGINFO "Program cleanup completed"
END`;
    }

    /**
     * Generate shell command for output capture
     */
    public generateOutputCaptureCommand(
        programPath: string,
        outputPath: string = 'analysis_output.txt'
    ): string {
        return `"${programPath}" > "${outputPath}" 2>&1`;
    }

    /**
     * Generate file monitoring commands for cross-platform use
     */
    public generateFileMonitoringCommands(logFile: string): Record<string, string> {
        return {
            windows: `powershell -Command "Get-Content -Path '${logFile}' -Wait -Tail 10"`,
            linux: `tail -f "${logFile}"`,
            macos: `tail -f "${logFile}"`,
            batch: `powershell -Command "while($true) { Clear-Host; Get-Content '${logFile}' | Select-Object -Last 20; Start-Sleep 2 }"`
        };
    }

    private generateLoggingHeader(config: LoggingConfiguration): string {
        return `
' Native QB64PE Logging Functions
' Logging Level: ${config.logLevel}
' Auto-generated by QB64PE Logging Service

`;
    }

    private insertAfterDirectives(code: string, header: string): string {
        const lines = code.split('\n');
        let insertIndex = 0;
        
        // Find the end of compiler directives
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('$') || 
                lines[i].trim().startsWith('OPTION') ||
                lines[i].trim() === '') {
                insertIndex = i + 1;
            } else {
                break;
            }
        }
        
        lines.splice(insertIndex, 0, header);
        return lines.join('\n');
    }

    private addStructuredSections(code: string, config: LoggingConfiguration): string {
        const structuredOutput = this.generateStructuredOutput(config.outputSections, config.enableNativeLogging);
        
        // Insert before END statement
        const endIndex = code.lastIndexOf('END');
        if (endIndex !== -1) {
            return code.substring(0, endIndex) + structuredOutput + '\n' + code.substring(endIndex);
        }
        
        return code + structuredOutput;
    }

    private addAutoExitMechanism(code: string, config: LoggingConfiguration): string {
        const autoExit = `
' Auto-exit mechanism for automation
IF DEBUG_MODE = 1 THEN
    PRINT "Auto-exiting in " + STR$(${config.autoExitTimeout}) + " seconds..."
    _DELAY ${config.autoExitTimeout}
    SYSTEM
END IF
`;
        
        // Insert before final END
        const endIndex = code.lastIndexOf('END');
        if (endIndex !== -1) {
            return code.substring(0, endIndex) + autoExit + '\n' + code.substring(endIndex);
        }
        
        return code + autoExit;
    }

    private addErrorHandling(code: string, config: LoggingConfiguration): string {
        const errorHandling = `
' Error handling and cleanup
ON ERROR GOTO ErrorHandler
GOTO ProgramEnd

ErrorHandler:
_LOGERROR "Runtime error: " + STR$(ERR) + " at line " + STR$(ERL)
PRINT "FATAL ERROR: " + STR$(ERR) + " at line " + STR$(ERL)
RESUME ProgramEnd

ProgramEnd:
_LOGINFO "Program execution completed"
`;
        
        // Insert before final END
        const endIndex = code.lastIndexOf('END');
        if (endIndex !== -1) {
            return code.substring(0, endIndex) + errorHandling + '\n' + code.substring(endIndex);
        }
        
        return code + errorHandling;
    }

    private generateStructuredAnalysisSteps(steps: string[]): string {
        let output = '';
        
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            const sectionName = step.toUpperCase().replace(/\s+/g, ' ');
            
            output += `
' Step ${stepNumber}: ${step}
current_step = ${stepNumber}
PRINT "=== STEP ${stepNumber}: ${sectionName} ==="
_LOGINFO "Starting step ${stepNumber}: ${step.toLowerCase()}"

' TODO: Implement ${step.toLowerCase()} logic here
PRINT "Processing ${step.toLowerCase()}..."

' Example error detection
' IF error_condition THEN
'     total_errors = total_errors + 1
'     _LOGERROR "Step ${stepNumber} failed: " + error_message$
'     PRINT "ERROR: Step ${stepNumber} failed"
' ELSE
'     _LOGINFO "Step ${stepNumber} completed successfully"
'     PRINT "SUCCESS: Step ${stepNumber} completed"
' END IF
`;
        });
        
        return output;
    }
}

export default QB64PELoggingService;

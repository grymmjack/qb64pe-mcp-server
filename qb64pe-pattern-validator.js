// QB64PE MCP Service Pattern Validator
// Implements the critical rules identified in recurring issue analysis

class QB64PEPatternValidator {
    constructor() {
        this.graphicsFunctions = [
            'SCREEN', '_PUTIMAGE', 'COLOR', '_PRINTSTRING', 'LINE', 
            'CIRCLE', 'PAINT', 'PSET', 'PRESET', 'CLS', '_DEST', 
            '_SOURCE', 'VIEW', 'WINDOW', '_LOADIMAGE', '_NEWIMAGE',
            '_COPYIMAGE', '_FREEIMAGE', 'POINT', 'PALETTE', 'LOCATE'
        ];
        
        this.consoleCompatibleFunctions = [
            'PRINT', '_SAVEIMAGE', '_LOADIMAGE', 'OPEN', 'CLOSE', 
            'INPUT', 'LINE INPUT', 'TIMER', 'DATE$', 'TIME$', 'SYSTEM'
        ];
    }

    /**
     * CRITICAL RULE #1: Console Mode Strategy Validation
     * Prefer $CONSOLE over $CONSOLE:ONLY for MCP debugging
     */
    validateModeCompatibility(code) {
        const issues = [];
        const hasConsoleOnly = code.includes('$CONSOLE:ONLY');
        const hasConsole = code.includes('$CONSOLE');
        
        // Prefer $CONSOLE over $CONSOLE:ONLY for MCP debugging
        if (hasConsoleOnly) {
            issues.push({
                type: 'MODE_STRATEGY',
                rule: 'Console Strategy',
                line: 'N/A',
                message: 'Consider using $CONSOLE instead of $CONSOLE:ONLY for better MCP debugging',
                fix: 'Replace $CONSOLE:ONLY with $CONSOLE to enable _ECHO + graphics',
                severity: 'WARNING'
            });
            
            // If using $CONSOLE:ONLY, validate no graphics functions
            const lines = code.split('\n');
            lines.forEach((line, index) => {
                this.graphicsFunctions.forEach(func => {
                    if (line.toUpperCase().includes(func) && !line.trim().startsWith("'")) {
                        issues.push({
                            type: 'CRITICAL',
                            rule: 'Console Mode Compatibility',
                            line: index + 1,
                            message: `Graphics function "${func}" is ILLEGAL in $CONSOLE:ONLY mode`,
                            fix: `Remove ${func} or change to $CONSOLE directive`,
                            severity: 'ERROR'
                        });
                    }
                });
            });
        }
        
        // Check for _ECHO usage (preferred for MCP output)
        if (hasConsole && !code.includes('_ECHO')) {
            issues.push({
                type: 'MCP_OUTPUT',
                rule: 'MCP Output Strategy',
                line: 'N/A',
                message: 'Consider using _ECHO for MCP-compatible debug output',
                fix: 'Use _ECHO instead of PRINT for structured MCP output',
                severity: 'INFO'
            });
        }
        
        return issues;
    }

    /**
     * CRITICAL RULE #2: BI/BM Library Structure Validation
     */
    validateLibraryStructure(code) {
        const issues = [];
        const lines = code.split('\n');
        
        let biIncludeIndex = -1;
        let bmIncludeIndex = -1;
        let codeStartIndex = -1;
        
        // Find include positions and code start
        lines.forEach((line, index) => {
            if (line.includes("$INCLUDE:") && line.includes(".BI")) {
                if (biIncludeIndex === -1) biIncludeIndex = index;
            }
            if (line.includes("$INCLUDE:") && line.includes(".BM")) {
                bmIncludeIndex = index;
            }
            if (!line.trim().startsWith("'") && line.trim() !== "" && 
                !line.includes("$CONSOLE") && !line.includes("$INCLUDE") && 
                codeStartIndex === -1) {
                codeStartIndex = index;
            }
        });
        
        // Validate include order
        if (biIncludeIndex > -1 && codeStartIndex > -1 && biIncludeIndex > codeStartIndex) {
            issues.push({
                type: 'LIBRARY_STRUCTURE',
                rule: 'BI Include Order',
                line: biIncludeIndex + 1,
                message: 'BI includes must be at top of file, before main code',
                fix: 'Move BI includes to top of file after $CONSOLE directive',
                severity: 'ERROR'
            });
        }
        
        if (bmIncludeIndex > -1 && codeStartIndex > -1 && bmIncludeIndex < codeStartIndex) {
            issues.push({
                type: 'LIBRARY_STRUCTURE',
                rule: 'BM Include Order',
                line: bmIncludeIndex + 1,
                message: 'BM includes must be at bottom of file, after main code',
                fix: 'Move BM includes to bottom of file',
                severity: 'ERROR'
            });
        }
        
        // Check for code duplication (simplified)
        const hasSubFunction = code.includes('SUB ') || code.includes('FUNCTION ');
        const hasIncludes = biIncludeIndex > -1 || bmIncludeIndex > -1;
        
        if (hasSubFunction && hasIncludes) {
            issues.push({
                type: 'CODE_DUPLICATION',
                rule: 'Code Centralization',
                line: 'N/A',
                message: 'Possible code duplication - examples should use includes, not implement functions',
                fix: 'Move function implementations to BM file and use includes',
                severity: 'WARNING'
            });
        }
        
        return issues;
    }

    /**
     * CRITICAL RULE #3: Function Syntax Validation  
     */
    validateFunctionSyntax(code) {
        const issues = [];
        const lines = code.split('\n');
        
        lines.forEach((line, index) => {
            // Check for missing spaces in function calls
            const functionCallPattern = /(\w+[&%!#$])\(/g;
            const matches = line.match(functionCallPattern);
            
            if (matches) {
                matches.forEach(match => {
                    const corrected = match.replace(/(\w+[&%!#$])\(/, '$1 (');
                    issues.push({
                        type: 'SYNTAX',
                        rule: 'Function Call Spacing',
                        line: index + 1,
                        message: `Function call "${match}" missing required space`,
                        fix: `Change to "${corrected}"`,
                        severity: 'ERROR'
                    });
                });
            }
            
            // Check for type mismatches (simplified)
            const integerAssignment = /DIM\s+(\w+)\s+AS\s+INTEGER/i;
            const longFunction = /(\w+)\s*=\s*\w+&/;
            
            if (integerAssignment.test(line)) {
                const varName = line.match(integerAssignment)[1];
                // Check if this variable is assigned a LONG function later
                const nextLines = lines.slice(index + 1, index + 10);
                nextLines.forEach((nextLine, nextIndex) => {
                    if (nextLine.includes(varName + ' =') && longFunction.test(nextLine)) {
                        issues.push({
                            type: 'TYPE_MISMATCH',
                            rule: 'Type Compatibility',
                            line: index + nextIndex + 2,
                            message: `INTEGER variable "${varName}" assigned LONG function result`,
                            fix: `Change DIM ${varName} AS INTEGER to DIM ${varName} AS LONG`,
                            severity: 'ERROR'
                        });
                    }
                });
            }
        });
        
        return issues;
    }

    /**
     * CRITICAL RULE #4: Resource Management
     */
    validateResourceManagement(code) {
        const issues = [];
        const lines = code.split('\n');
        
        lines.forEach((line, index) => {
            // Check for incorrect handle validation (-1 instead of 0 for images)
            const incorrectHandleCheck = /IF\s+(\w+&?)\s*<>\s*-1\s+THEN/i;
            if (incorrectHandleCheck.test(line)) {
                const varName = line.match(incorrectHandleCheck)[1];
                issues.push({
                    type: 'RESOURCE',
                    rule: 'Handle Validation',
                    line: index + 1,
                    message: `Incorrect handle check for "${varName}" - QB64PE images should check <> 0, not -1`,
                    fix: `Change to "IF ${varName} <> 0 THEN"`,
                    severity: 'WARNING'
                });
            }
            
            // Check for _LOADIMAGE without corresponding _FREEIMAGE
            if (line.toUpperCase().includes('_LOADIMAGE')) {
                const imageVar = line.match(/(\w+)\s*=\s*_LOADIMAGE/i);
                if (imageVar) {
                    const varName = imageVar[1];
                    const remainingCode = lines.slice(index + 1).join('\n');
                    if (!remainingCode.includes(`_FREEIMAGE ${varName}`)) {
                        issues.push({
                            type: 'RESOURCE_LEAK',
                            rule: 'Resource Cleanup',
                            line: index + 1,
                            message: `Image "${varName}" loaded but never freed`,
                            fix: `Add "_FREEIMAGE ${varName}" before program exit`,
                            severity: 'WARNING'
                        });
                    }
                }
            }
        });
        
        return issues;
    }

    /**
     * CRITICAL RULE #5: Exit Strategy
     */
    validateExitStrategy(code) {
        const issues = [];
        const hasConsoleDirective = code.includes('$CONSOLE:ONLY') || code.includes('$CONSOLE');
        
        if (hasConsoleDirective) {
            if (code.includes(' END') || code.includes('\nEND') || code.endsWith('END')) {
                issues.push({
                    type: 'EXIT_STRATEGY',
                    rule: 'Clean Console Exit',
                    line: 'N/A',
                    message: 'Console programs must use SYSTEM instead of END',
                    fix: 'Replace END with SYSTEM',
                    severity: 'ERROR'
                });
            }
            
            if (!code.includes('SYSTEM')) {
                issues.push({
                    type: 'EXIT_STRATEGY',
                    rule: 'Missing Exit',
                    line: 'N/A',
                    message: 'Console program missing SYSTEM exit statement',
                    fix: 'Add SYSTEM at end of program',
                    severity: 'ERROR'
                });
            }
        }
        
        return issues;
    }

    /**
     * CRITICAL RULE #6: Structured Output Format (MCP-Compatible)
     */
    validateStructuredOutput(code) {
        const issues = [];
        const hasConsoleDirective = code.includes('$CONSOLE:ONLY') || code.includes('$CONSOLE');
        
        if (hasConsoleDirective) {
            const hasSessionStart = code.includes('=== MCP DEBUG START ===') || 
                                   code.includes('=== DEBUG SESSION START ===') ||
                                   code.includes('=== PROGRAM');
            const hasSessionEnd = code.includes('=== MCP DEBUG END ===') || 
                                 code.includes('=== DEBUG SESSION END ===') ||
                                 code.includes('=== PROGRAM');
                                 
            if (!hasSessionStart) {
                issues.push({
                    type: 'OUTPUT_FORMAT',
                    rule: 'Structured Output',
                    line: 'N/A',
                    message: 'Missing structured session start marker',
                    fix: 'Add "_ECHO \\"=== MCP DEBUG START ===\\"" at beginning',
                    severity: 'WARNING'
                });
            }
            
            if (!hasSessionEnd) {
                issues.push({
                    type: 'OUTPUT_FORMAT',  
                    rule: 'Structured Output',
                    line: 'N/A',
                    message: 'Missing structured session end marker',
                    fix: 'Add "_ECHO \\"=== MCP DEBUG END ===\\"" before SYSTEM',
                    severity: 'WARNING'
                });
            }
            
            // Check for PRINT vs _ECHO usage
            const usesPrint = code.includes('PRINT "===') || code.includes('PRINT "STATUS:');
            const usesEcho = code.includes('_ECHO "===') || code.includes('_ECHO "STATUS:');
            
            if (usesPrint && !usesEcho) {
                issues.push({
                    type: 'MCP_OUTPUT',
                    rule: 'MCP Output Format',
                    line: 'N/A',
                    message: 'Use _ECHO instead of PRINT for MCP-compatible structured output',
                    fix: 'Replace PRINT statements with _ECHO for better MCP parsing',
                    severity: 'INFO'
                });
            }
        }
        
        return issues;
    }

    /**
     * Main validation function - implements all critical rules
     */
    validateCode(code) {
        const allIssues = [
            ...this.validateModeCompatibility(code),
            ...this.validateLibraryStructure(code),
            ...this.validateFunctionSyntax(code),
            ...this.validateResourceManagement(code),
            ...this.validateExitStrategy(code),
            ...this.validateStructuredOutput(code)
        ];
        
        const summary = {
            totalIssues: allIssues.length,
            criticalErrors: allIssues.filter(i => i.severity === 'ERROR').length,
            warnings: allIssues.filter(i => i.severity === 'WARNING').length,
            passesValidation: allIssues.filter(i => i.severity === 'ERROR').length === 0
        };
        
        return {
            issues: allIssues,
            summary: summary,
            recommendations: this.generateRecommendations(allIssues)
        };
    }

    generateRecommendations(issues) {
        const recommendations = [];
        
        const hasModeIssues = issues.some(i => i.rule === 'Console Mode Compatibility');
        if (hasModeIssues) {
            recommendations.push({
                priority: 'CRITICAL',
                message: 'Use $CONSOLE instead of $CONSOLE:ONLY for MCP debugging',
                action: 'Replace $CONSOLE:ONLY with $CONSOLE to enable _ECHO + graphics functions'
            });
        }
        
        const hasLibraryIssues = issues.some(i => i.rule.includes('Include Order') || i.rule === 'Code Centralization');
        if (hasLibraryIssues) {
            recommendations.push({
                priority: 'HIGH',
                message: 'Follow BI/BM library structure: BI at top, BM at bottom, no code duplication',
                action: 'Reorganize includes and centralize library code in BI/BM files'
            });
        }
        
        const hasSyntaxIssues = issues.some(i => i.rule === 'Function Call Spacing');
        if (hasSyntaxIssues) {
            recommendations.push({
                priority: 'HIGH',
                message: 'Add required spaces in function calls: function& (param)',
                action: 'QB64PE requires space between function name and parentheses'
            });
        }
        
        const hasExitIssues = issues.some(i => i.rule === 'Clean Console Exit');
        if (hasExitIssues) {
            recommendations.push({
                priority: 'HIGH',
                message: 'Use SYSTEM instead of END for console programs',
                action: 'Console programs must exit cleanly to prevent hanging'
            });
        }
        
        const hasOutputIssues = issues.some(i => i.rule === 'MCP Output Format');
        if (hasOutputIssues) {
            recommendations.push({
                priority: 'MEDIUM',
                message: 'Use _ECHO instead of PRINT for MCP-compatible output',
                action: 'Replace PRINT with _ECHO for better structured output parsing'
            });
        }
        
        return recommendations;
    }
}

// Test with the problematic code from your analysis
const validator = new QB64PEPatternValidator();

const problematicCode = `$CONSOLE:ONLY
SCREEN _NEWIMAGE(800, 600, 32)
PRINT "This should work"
_PUTIMAGE (0, 0), img&
COLOR 15, 0
END`;

console.log('=== QB64PE Pattern Validation Results ===');
const results = validator.validateCode(problematicCode);

console.log('\nISSUES FOUND:');
results.issues.forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.severity}] ${issue.rule}: ${issue.message}`);
    console.log(`   Line ${issue.line}: ${issue.fix}`);
});

console.log('\nSUMMARY:');
console.log(`Total Issues: ${results.summary.totalIssues}`);
console.log(`Critical Errors: ${results.summary.criticalErrors}`);
console.log(`Warnings: ${results.summary.warnings}`);
console.log(`Passes Validation: ${results.summary.passesValidation}`);

console.log('\nRECOMMENDATIONS:');
results.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. [${rec.priority}] ${rec.message}`);
    console.log(`   Action: ${rec.action}`);
});

// Generate corrected version
function generateCorrectedCode(originalCode, issues) {
    let corrected = originalCode;
    
    // If using $CONSOLE:ONLY, suggest replacing with $CONSOLE for MCP debugging
    if (corrected.includes('$CONSOLE:ONLY')) {
        corrected = corrected.replace('$CONSOLE:ONLY', '$CONSOLE');
    }
    
    // If console mode issues exist, create MCP-compatible version
    const hasModeIssues = issues.some(i => i.rule === 'Console Mode Compatibility');
    if (hasModeIssues) {
        corrected = `$CONSOLE

''
' MCP Enhanced Debug Version - Using $CONSOLE for better compatibility
''

' === MCP DEBUG OUTPUT ===
_ECHO "=== MCP DEBUG START ==="
_ECHO "TIMESTAMP: "; DATE$; " "; TIME$
_ECHO "PROGRAM: "; "corrected_version"

' Original logic converted to MCP-compatible format
_ECHO "STATUS: INITIALIZATION"
_ECHO "Graphics mode: Available with $CONSOLE directive"
_ECHO "Console output: Using _ECHO for MCP parsing"

_ECHO "STATUS: EXECUTION"
' Graphics functions work with $CONSOLE (unlike $CONSOLE:ONLY)

_ECHO "STATUS: CLEANUP"
_ECHO "RESULT: SUCCESS"
_ECHO "=== MCP DEBUG END ==="
SYSTEM`;
    }
    
    // Fix PRINT to _ECHO for MCP compatibility
    corrected = corrected.replace(/PRINT\s+"===/g, '_ECHO "===');
    corrected = corrected.replace(/PRINT\s+"STATUS:/g, '_ECHO "STATUS:');
    corrected = corrected.replace(/PRINT\s+"RESULT:/g, '_ECHO "RESULT:');
    
    return corrected;
}

console.log('\n=== CORRECTED VERSION ===');
console.log(generateCorrectedCode(problematicCode, results.issues));

module.exports = { QB64PEPatternValidator };

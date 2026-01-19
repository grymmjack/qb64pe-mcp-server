"use strict";
/**
 * QB64PE File Structure Validation Service
 *
 * Validates QB64_GJ_LIB .BI/.BM file structure conventions
 * Ensures proper separation of declarations and implementations
 *
 * @author grymmjack
 * @version 1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStructureService = void 0;
class FileStructureService {
    /**
     * Validate .BI file structure
     * Should contain: TYPE definitions, CONST declarations, DIM SHARED, function declarations
     * Should NOT contain: SUB/FUNCTION implementations
     */
    validateBIFile(content) {
        const issues = [];
        const lines = content.split("\n");
        let inSubFunction = false;
        let subFunctionName = "";
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            // Skip comments and blank lines
            if (line.startsWith("''") ||
                line.startsWith("'") ||
                line.length === 0) {
                continue;
            }
            // Check for SUB/FUNCTION implementation start
            if (/^SUB\s+\w+/i.test(line) ||
                /^FUNCTION\s+\w+[%&$!#]?\s*(\(|$)/i.test(line)) {
                const match = line.match(/^(SUB|FUNCTION)\s+(\w+[%&$!#]?)/i);
                if (match) {
                    subFunctionName = match[2];
                    inSubFunction = true;
                    // This is an implementation, not just a declaration
                    if (!line.includes("DECLARE")) {
                        issues.push({
                            line: lineNum,
                            content: line,
                            issue: `SUB/FUNCTION implementation found in .BI file`,
                            suggestion: `Move '${subFunctionName}' implementation to .BM file. .BI should only have DECLARE statements or type definitions.`,
                            severity: "error",
                        });
                    }
                }
            }
            // Check for END SUB/END FUNCTION
            if (/^END\s+(SUB|FUNCTION)/i.test(line)) {
                if (inSubFunction) {
                    issues.push({
                        line: lineNum,
                        content: line,
                        issue: `Complete SUB/FUNCTION implementation in .BI file`,
                        suggestion: `All implementations should be in .BM file. Keep only declarations in .BI.`,
                        severity: "error",
                    });
                }
                inSubFunction = false;
                subFunctionName = "";
            }
            // Check for implementation code inside SUB/FUNCTION
            if (inSubFunction &&
                !line.startsWith("'") &&
                !/^(SUB|FUNCTION|END|DIM)/i.test(line)) {
                issues.push({
                    line: lineNum,
                    content: line,
                    issue: `Implementation code found in .BI file`,
                    suggestion: `Move this code to ${subFunctionName} in .BM file`,
                    severity: "error",
                });
            }
            // Warn about DECLARE statements (optional in QB64PE)
            if (/^DECLARE\s+(SUB|FUNCTION)/i.test(line)) {
                issues.push({
                    line: lineNum,
                    content: line,
                    issue: `DECLARE statement found (optional in QB64PE)`,
                    suggestion: `DECLARE statements are optional in QB64PE. Consider removing for cleaner code.`,
                    severity: "info",
                });
            }
        }
        const summary = this.calculateSummary(issues);
        return {
            isValid: summary.errors === 0,
            fileType: ".BI",
            issues,
            summary,
            recommendations: this.generateBIRecommendations(issues),
        };
    }
    /**
     * Validate .BM file structure
     * Should contain: SUB/FUNCTION implementations only
     * Should NOT contain: TYPE definitions, CONST (except LOCAL ones), DIM SHARED
     */
    validateBMFile(content) {
        const issues = [];
        const lines = content.split("\n");
        let inSubFunction = false;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            // Skip comments, blank lines, and $INCLUDEONCE
            if (line.startsWith("''") ||
                line.startsWith("'") ||
                line.length === 0 ||
                line.startsWith("$INCLUDEONCE")) {
                continue;
            }
            // Track when inside SUB/FUNCTION
            if (/^SUB\s+\w+/i.test(line) ||
                /^FUNCTION\s+\w+/i.test(line)) {
                inSubFunction = true;
            }
            if (/^END\s+(SUB|FUNCTION)/i.test(line)) {
                inSubFunction = false;
            }
            // Check for TYPE definitions (should be in .BI)
            if (/^TYPE\s+\w+/i.test(line) && !inSubFunction) {
                issues.push({
                    line: lineNum,
                    content: line,
                    issue: `TYPE definition found in .BM file`,
                    suggestion: `Move TYPE definitions to .BI file. .BM should only contain SUB/FUNCTION implementations.`,
                    severity: "error",
                });
            }
            // Check for DIM SHARED (should be in .BI)
            if (/^DIM\s+SHARED/i.test(line) && !inSubFunction) {
                issues.push({
                    line: lineNum,
                    content: line,
                    issue: `DIM SHARED found in .BM file`,
                    suggestion: `Move all DIM SHARED declarations to .BI file. This is CRITICAL for QB64_GJ_LIB architecture.`,
                    severity: "error",
                });
            }
            // Check for CONST declarations (global ones should be in .BI)
            if (/^CONST\s+[A-Z_]+\s*=/i.test(line) && !inSubFunction) {
                issues.push({
                    line: lineNum,
                    content: line,
                    issue: `Global CONST found in .BM file`,
                    suggestion: `Move global CONST declarations to .BI file. Local constants inside SUB/FUNCTION are OK.`,
                    severity: "warning",
                });
            }
            // Check for non-SUB/FUNCTION code at file level
            if (!inSubFunction &&
                !line.startsWith("'") &&
                !line.startsWith("$") &&
                !/^(SUB|FUNCTION|END)/i.test(line)) {
                // Allow blank lines and certain keywords
                if (!/^(DIM|CONST|TYPE|DECLARE)/i.test(line) &&
                    line.length > 0) {
                    issues.push({
                        line: lineNum,
                        content: line,
                        issue: `Code outside SUB/FUNCTION in .BM file`,
                        suggestion: `.BM files should ONLY contain SUB/FUNCTION implementations. Move this to .BI or inside a function.`,
                        severity: "error",
                    });
                }
            }
        }
        const summary = this.calculateSummary(issues);
        return {
            isValid: summary.errors === 0,
            fileType: ".BM",
            issues,
            summary,
            recommendations: this.generateBMRecommendations(issues),
        };
    }
    /**
     * Validate any QB64PE file structure
     * Auto-detects file type based on extension or content
     */
    validateFile(filename, content) {
        if (filename.endsWith(".BI")) {
            return this.validateBIFile(content);
        }
        else if (filename.endsWith(".BM")) {
            return this.validateBMFile(content);
        }
        else {
            return {
                isValid: true,
                fileType: "other",
                issues: [],
                summary: { totalIssues: 0, errors: 0, warnings: 0, info: 0 },
                recommendations: [
                    "File does not appear to be part of .BI/.BM architecture.",
                ],
            };
        }
    }
    /**
     * Calculate issue summary
     */
    calculateSummary(issues) {
        return {
            totalIssues: issues.length,
            errors: issues.filter((i) => i.severity === "error").length,
            warnings: issues.filter((i) => i.severity === "warning").length,
            info: issues.filter((i) => i.severity === "info").length,
        };
    }
    /**
     * Generate recommendations for .BI files
     */
    generateBIRecommendations(issues) {
        const recommendations = [];
        const hasImplementations = issues.some((i) => i.issue.includes("implementation") && i.severity === "error");
        const hasDeclarations = issues.some((i) => i.issue.includes("DECLARE"));
        if (hasImplementations) {
            recommendations.push("Move all SUB/FUNCTION implementations to corresponding .BM file");
            recommendations.push(".BI files should contain: TYPE definitions, CONST declarations, DIM SHARED variables");
        }
        if (hasDeclarations) {
            recommendations.push("Consider removing DECLARE statements (optional in QB64PE)");
        }
        if (recommendations.length === 0) {
            recommendations.push(".BI file structure looks good!");
        }
        return recommendations;
    }
    /**
     * Generate recommendations for .BM files
     */
    generateBMRecommendations(issues) {
        const recommendations = [];
        const hasDimShared = issues.some((i) => i.issue.includes("DIM SHARED"));
        const hasTypes = issues.some((i) => i.issue.includes("TYPE"));
        const hasConsts = issues.some((i) => i.issue.includes("CONST"));
        if (hasDimShared) {
            recommendations.push("CRITICAL: Move all DIM SHARED declarations to .BI file to avoid compilation errors");
        }
        if (hasTypes) {
            recommendations.push("Move TYPE definitions to .BI file");
        }
        if (hasConsts) {
            recommendations.push("Move global CONST declarations to .BI file (local constants inside functions are OK)");
        }
        if (recommendations.length === 0) {
            recommendations.push(".BM file structure looks good!");
        }
        return recommendations;
    }
    /**
     * Check if content follows QB64_GJ_LIB conventions
     */
    followsGJLibConventions(biContent, bmContent) {
        const issues = [];
        const suggestions = [];
        const biResult = this.validateBIFile(biContent);
        const bmResult = this.validateBMFile(bmContent);
        if (!biResult.isValid) {
            issues.push(`.BI file has ${biResult.summary.errors} structural errors`);
            suggestions.push(...biResult.recommendations);
        }
        if (!bmResult.isValid) {
            issues.push(`.BM file has ${bmResult.summary.errors} structural errors`);
            suggestions.push(...bmResult.recommendations);
        }
        // Check for $INCLUDEONCE in both files
        if (!biContent.includes("$INCLUDEONCE")) {
            issues.push(".BI file missing $INCLUDEONCE directive");
            suggestions.push("Add '$INCLUDEONCE at top of .BI file");
        }
        if (!bmContent.includes("$INCLUDEONCE")) {
            issues.push(".BM file missing $INCLUDEONCE directive");
            suggestions.push("Add '$INCLUDEONCE at top of .BM file");
        }
        return {
            follows: issues.length === 0,
            issues,
            suggestions,
        };
    }
}
exports.FileStructureService = FileStructureService;
//# sourceMappingURL=file-structure-service.js.map
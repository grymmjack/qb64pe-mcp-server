/**
 * QB64PE File Structure Validation Service
 *
 * Validates QB64_GJ_LIB .BI/.BM file structure conventions
 * Ensures proper separation of declarations and implementations
 *
 * @author grymmjack
 * @version 1.0
 */
interface FileStructureIssue {
    line: number;
    content: string;
    issue: string;
    suggestion: string;
    severity: "error" | "warning" | "info";
}
interface FileStructureValidationResult {
    isValid: boolean;
    fileType: ".BI" | ".BM" | "other";
    issues: FileStructureIssue[];
    summary: {
        totalIssues: number;
        errors: number;
        warnings: number;
        info: number;
    };
    recommendations: string[];
}
export declare class FileStructureService {
    /**
     * Validate .BI file structure
     * Should contain: TYPE definitions, CONST declarations, DIM SHARED, function declarations
     * Should NOT contain: SUB/FUNCTION implementations
     */
    validateBIFile(content: string): FileStructureValidationResult;
    /**
     * Validate .BM file structure
     * Should contain: SUB/FUNCTION implementations only
     * Should NOT contain: TYPE definitions, CONST (except LOCAL ones), DIM SHARED
     */
    validateBMFile(content: string): FileStructureValidationResult;
    /**
     * Validate any QB64PE file structure
     * Auto-detects file type based on extension or content
     */
    validateFile(filename: string, content: string): FileStructureValidationResult;
    /**
     * Calculate issue summary
     */
    private calculateSummary;
    /**
     * Generate recommendations for .BI files
     */
    private generateBIRecommendations;
    /**
     * Generate recommendations for .BM files
     */
    private generateBMRecommendations;
    /**
     * Check if content follows QB64_GJ_LIB conventions
     */
    followsGJLibConventions(biContent: string, bmContent: string): {
        follows: boolean;
        issues: string[];
        suggestions: string[];
    };
}
export {};
//# sourceMappingURL=file-structure-service.d.ts.map
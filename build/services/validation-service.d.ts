/**
 * Centralized validation service for common input patterns
 * Provides reusable validators for code, file paths, parameters, and more
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
export interface CodeValidationOptions {
    maxLength?: number;
    minLength?: number;
    allowEmpty?: boolean;
    checkEncoding?: boolean;
}
export interface PathValidationOptions {
    mustExist?: boolean;
    allowRelative?: boolean;
    allowedExtensions?: string[];
    platform?: "windows" | "unix" | "auto";
}
export declare class ValidationService {
    /**
     * Validate QB64PE code input
     */
    validateCode(code: string | undefined, options?: CodeValidationOptions): ValidationResult;
    /**
     * Validate file path input
     */
    validatePath(path: string | undefined, options?: PathValidationOptions): ValidationResult;
    /**
     * Validate required string parameter
     */
    validateRequiredString(value: any, paramName: string, options?: {
        minLength?: number;
        maxLength?: number;
    }): ValidationResult;
    /**
     * Validate number parameter with range
     */
    validateNumber(value: any, paramName: string, options?: {
        min?: number;
        max?: number;
        integer?: boolean;
    }): ValidationResult;
    /**
     * Validate array parameter
     */
    validateArray(value: any, paramName: string, options?: {
        minLength?: number;
        maxLength?: number;
        itemValidator?: (item: any) => ValidationResult;
    }): ValidationResult;
    /**
     * Validate enum/choice parameter
     */
    validateEnum(value: any, paramName: string, allowedValues: string[]): ValidationResult;
    /**
     * Combine multiple validation results
     */
    combineResults(...results: ValidationResult[]): ValidationResult;
    private detectPathPlatform;
    private isAbsolutePath;
}
//# sourceMappingURL=validation-service.d.ts.map
"use strict";
/**
 * Centralized validation service for common input patterns
 * Provides reusable validators for code, file paths, parameters, and more
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
class ValidationService {
    /**
     * Validate QB64PE code input
     */
    validateCode(code, options = {}) {
        const { maxLength = 100000, // 100KB default max
        minLength = 0, allowEmpty = false, checkEncoding = true, } = options;
        const errors = [];
        const warnings = [];
        // Check for null/undefined
        if (code === undefined || code === null) {
            errors.push("Code must be provided");
            return { isValid: false, errors, warnings };
        }
        // Check for empty code
        if (code.trim().length === 0) {
            if (!allowEmpty) {
                errors.push("Code cannot be empty");
            }
            return { isValid: allowEmpty, errors, warnings };
        }
        // Check minimum length
        if (code.length < minLength) {
            errors.push(`Code is too short (${code.length} chars, minimum ${minLength})`);
        }
        // Check maximum length
        if (code.length > maxLength) {
            errors.push(`Code is too long (${code.length} chars, maximum ${maxLength})`);
        }
        // Warn about very large code
        if (code.length > maxLength * 0.8) {
            warnings.push(`Code is very large (${code.length} chars) - consider splitting into modules`);
        }
        // Check for encoding issues
        if (checkEncoding) {
            try {
                // Check for non-printable characters (excluding common whitespace)
                const nonPrintable = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/;
                if (nonPrintable.test(code)) {
                    warnings.push("Code contains non-printable characters - may cause issues");
                }
            }
            catch (err) {
                warnings.push("Unable to validate encoding");
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Validate file path input
     */
    validatePath(path, options = {}) {
        const { allowRelative = true, allowedExtensions = [], platform = "auto", } = options;
        const errors = [];
        const warnings = [];
        // Check for null/undefined
        if (path === undefined || path === null) {
            errors.push("Path must be provided");
            return { isValid: false, errors, warnings };
        }
        // Check for empty path
        if (path.trim().length === 0) {
            errors.push("Path cannot be empty");
            return { isValid: false, errors, warnings };
        }
        const trimmedPath = path.trim();
        // Detect platform
        const detectedPlatform = platform === "auto" ? this.detectPathPlatform(trimmedPath) : platform;
        // Check for invalid characters based on platform
        if (detectedPlatform === "windows") {
            const invalidChars = /[<>"|?*\x00-\x1F]/;
            if (invalidChars.test(trimmedPath)) {
                errors.push('Path contains invalid Windows characters: < > " | ? *');
            }
            // Check for reserved names
            const baseName = trimmedPath.split(/[/\\]/).pop() || "";
            const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i;
            if (reservedNames.test(baseName)) {
                errors.push(`Path contains reserved Windows name: ${baseName}`);
            }
        }
        else {
            // Unix-like systems
            const invalidChars = /[\x00]/;
            if (invalidChars.test(trimmedPath)) {
                errors.push("Path contains null characters");
            }
        }
        // Check path format
        const isAbsolute = this.isAbsolutePath(trimmedPath, detectedPlatform);
        if (!isAbsolute && !allowRelative) {
            errors.push("Relative paths are not allowed - use absolute path");
        }
        // Warn about mixed separators
        if (trimmedPath.includes("/") && trimmedPath.includes("\\")) {
            warnings.push("Path contains mixed separators (/ and \\) - may cause issues");
        }
        // Check file extension if specified
        if (allowedExtensions.length > 0) {
            const hasValidExtension = allowedExtensions.some((ext) => trimmedPath.toLowerCase().endsWith(ext.toLowerCase()));
            if (!hasValidExtension) {
                errors.push(`Path must end with one of: ${allowedExtensions.join(", ")}`);
            }
        }
        // Warn about spaces in path
        if (trimmedPath.includes(" ")) {
            warnings.push("Path contains spaces - may need quoting in some contexts");
        }
        // Warn about very long paths
        const maxPathLength = detectedPlatform === "windows" ? 260 : 4096;
        if (trimmedPath.length > maxPathLength * 0.8) {
            warnings.push(`Path is very long (${trimmedPath.length} chars) - may exceed system limits`);
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Validate required string parameter
     */
    validateRequiredString(value, paramName, options = {}) {
        const { minLength = 1, maxLength = 10000 } = options;
        const errors = [];
        const warnings = [];
        if (value === undefined || value === null) {
            errors.push(`${paramName} is required`);
            return { isValid: false, errors, warnings };
        }
        if (typeof value !== "string") {
            errors.push(`${paramName} must be a string (received ${typeof value})`);
            return { isValid: false, errors, warnings };
        }
        const trimmed = value.trim();
        if (trimmed.length < minLength) {
            errors.push(`${paramName} is too short (${trimmed.length} chars, minimum ${minLength})`);
        }
        if (trimmed.length > maxLength) {
            errors.push(`${paramName} is too long (${trimmed.length} chars, maximum ${maxLength})`);
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Validate number parameter with range
     */
    validateNumber(value, paramName, options = {}) {
        const { min = -Infinity, max = Infinity, integer = false } = options;
        const errors = [];
        const warnings = [];
        if (value === undefined || value === null) {
            errors.push(`${paramName} is required`);
            return { isValid: false, errors, warnings };
        }
        const num = Number(value);
        if (isNaN(num)) {
            errors.push(`${paramName} must be a valid number`);
            return { isValid: false, errors, warnings };
        }
        if (integer && !Number.isInteger(num)) {
            errors.push(`${paramName} must be an integer`);
        }
        if (num < min) {
            errors.push(`${paramName} must be at least ${min}`);
        }
        if (num > max) {
            errors.push(`${paramName} must be at most ${max}`);
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Validate array parameter
     */
    validateArray(value, paramName, options = {}) {
        const { minLength = 0, maxLength = 1000, itemValidator } = options;
        const errors = [];
        const warnings = [];
        if (!Array.isArray(value)) {
            errors.push(`${paramName} must be an array`);
            return { isValid: false, errors, warnings };
        }
        if (value.length < minLength) {
            errors.push(`${paramName} must contain at least ${minLength} item(s)`);
        }
        if (value.length > maxLength) {
            errors.push(`${paramName} must contain at most ${maxLength} item(s)`);
        }
        // Validate individual items if validator provided
        if (itemValidator) {
            value.forEach((item, index) => {
                const itemResult = itemValidator(item);
                if (!itemResult.isValid) {
                    errors.push(`${paramName}[${index}]: ${itemResult.errors.join(", ")}`);
                }
                warnings.push(...itemResult.warnings.map((w) => `${paramName}[${index}]: ${w}`));
            });
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Validate enum/choice parameter
     */
    validateEnum(value, paramName, allowedValues) {
        const errors = [];
        const warnings = [];
        if (value === undefined || value === null) {
            errors.push(`${paramName} is required`);
            return { isValid: false, errors, warnings };
        }
        if (!allowedValues.includes(value)) {
            errors.push(`${paramName} must be one of: ${allowedValues.join(", ")} (received: ${value})`);
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Combine multiple validation results
     */
    combineResults(...results) {
        const errors = [];
        const warnings = [];
        for (const result of results) {
            errors.push(...result.errors);
            warnings.push(...result.warnings);
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    // Helper methods
    detectPathPlatform(path) {
        // Check for Windows-style paths (C:\ or \\)
        if (/^[A-Za-z]:[\\/]/.test(path) || /^\\\\/.test(path)) {
            return "windows";
        }
        // Check for Unix-style absolute paths
        if (path.startsWith("/")) {
            return "unix";
        }
        // Default to Unix for relative paths (more permissive)
        return "unix";
    }
    isAbsolutePath(path, platform) {
        if (platform === "windows") {
            // Windows: C:\ or \\ (UNC path)
            return /^[A-Za-z]:[\\/]/.test(path) || /^\\\\/.test(path);
        }
        else {
            // Unix: starts with /
            return path.startsWith("/");
        }
    }
}
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation-service.js.map
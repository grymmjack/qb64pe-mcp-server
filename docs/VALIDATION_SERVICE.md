# Validation Service Documentation

## Overview

The `ValidationService` provides centralized, reusable validation functions for common input patterns in the QB64PE MCP server. This service helps ensure data integrity and provides consistent error messages across all tools.

## Location

- **Source**: `src/services/validation-service.ts`
- **Build Output**: `build/services/validation-service.js`
- **Test**: `test-validation-service.js`

## Features

### Code Validation

Validates QB64PE code input with configurable length limits and encoding checks.

```typescript
validateCode(
  code: string | undefined,
  options?: {
    maxLength?: number;      // Default: 100000 (100KB)
    minLength?: number;      // Default: 0
    allowEmpty?: boolean;    // Default: false
    checkEncoding?: boolean; // Default: true
  }
): ValidationResult
```

**Example Usage:**

```javascript
const result = validator.validateCode(userCode, {
  minLength: 10,
  maxLength: 50000,
});

if (!result.isValid) {
  console.error("Validation errors:", result.errors);
}
```

### Path Validation

Validates file paths with platform-specific rules and extension checking.

```typescript
validatePath(
  path: string | undefined,
  options?: {
    mustExist?: boolean;           // Not implemented yet
    allowRelative?: boolean;        // Default: true
    allowedExtensions?: string[];   // Default: []
    platform?: 'windows' | 'unix' | 'auto'; // Default: 'auto'
  }
): ValidationResult
```

**Features:**

- Platform detection (Windows vs Unix)
- Invalid character checking
- Reserved name detection (Windows: CON, PRN, etc.)
- Extension validation
- Path length warnings
- Mixed separator detection

**Example Usage:**

```javascript
const result = validator.validatePath(filePath, {
  allowRelative: false,
  allowedExtensions: [".bas", ".bi"],
});
```

### String Parameter Validation

Validates required string parameters with length constraints.

```typescript
validateRequiredString(
  value: any,
  paramName: string,
  options?: {
    minLength?: number; // Default: 1
    maxLength?: number; // Default: 10000
  }
): ValidationResult
```

**Example Usage:**

```javascript
const result = validator.validateRequiredString(fileName, "fileName", {
  minLength: 3,
  maxLength: 255,
});
```

### Number Validation

Validates numeric parameters with range and integer constraints.

```typescript
validateNumber(
  value: any,
  paramName: string,
  options?: {
    min?: number;      // Default: -Infinity
    max?: number;      // Default: Infinity
    integer?: boolean; // Default: false
  }
): ValidationResult
```

**Example Usage:**

```javascript
const result = validator.validateNumber(lineNumber, "lineNumber", {
  min: 1,
  max: 10000,
  integer: true,
});
```

### Array Validation

Validates array parameters with length constraints and optional item validation.

```typescript
validateArray(
  value: any,
  paramName: string,
  options?: {
    minLength?: number;
    maxLength?: number;
    itemValidator?: (item: any) => ValidationResult;
  }
): ValidationResult
```

**Example Usage:**

```javascript
const result = validator.validateArray(fileList, "files", {
  minLength: 1,
  maxLength: 10,
  itemValidator: (item) => validator.validatePath(item, {}),
});
```

### Enum/Choice Validation

Validates that a value is one of a set of allowed values.

```typescript
validateEnum(
  value: any,
  paramName: string,
  allowedValues: string[]
): ValidationResult
```

**Example Usage:**

```javascript
const result = validator.validateEnum(platform, "platform", [
  "windows",
  "linux",
  "macos",
]);
```

### Combined Validation

Combines multiple validation results into a single result.

```typescript
combineResults(...results: ValidationResult[]): ValidationResult
```

**Example Usage:**

```javascript
const codeResult = validator.validateCode(code);
const pathResult = validator.validatePath(outputPath);
const dialectResult = validator.validateEnum(dialect, "dialect", [
  "qbasic",
  "quickbasic",
]);

const combined = validator.combineResults(
  codeResult,
  pathResult,
  dialectResult,
);

if (!combined.isValid) {
  throw new Error(`Validation failed: ${combined.errors.join(", ")}`);
}
```

## ValidationResult Interface

All validation methods return a `ValidationResult` object:

```typescript
interface ValidationResult {
  isValid: boolean; // True if no errors
  errors: string[]; // Array of error messages
  warnings: string[]; // Array of warning messages
}
```

## Integration with Tools

The validation service is available through the `ServiceContainer`:

```typescript
export function registerMyTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  server.registerTool(
    "my_tool",
    {
      /* schema */
    },
    async (params) => {
      // Validate inputs
      const codeValidation = services.validationService.validateCode(
        params.code,
        { minLength: 10 },
      );

      if (!codeValidation.isValid) {
        return createMCPError(
          new Error(codeValidation.errors.join(", ")),
          "validating code input",
        );
      }

      // Process validated input
      // ...
    },
  );
}
```

## Best Practices

### 1. Validate Early

Validate inputs at the beginning of tool handlers before any processing:

```javascript
async ({ code, outputPath, dialect }) => {
  // Validate all inputs first
  const validation = services.validationService.combineResults(
    services.validationService.validateCode(code),
    services.validationService.validatePath(outputPath),
    services.validationService.validateEnum(
      dialect,
      "dialect",
      SUPPORTED_DIALECTS,
    ),
  );

  if (!validation.isValid) {
    return createMCPError(
      new Error(validation.errors.join("; ")),
      "validating inputs",
    );
  }

  // Process...
};
```

### 2. Provide Context in Error Messages

Use descriptive parameter names:

```javascript
// Good
validateRequiredString(fileName, "fileName", { minLength: 3 });

// Less helpful
validateRequiredString(fileName, "param", { minLength: 3 });
```

### 3. Use Warnings for Non-Critical Issues

Warnings don't fail validation but inform users of potential issues:

```javascript
const result = validator.validatePath(path);
if (result.warnings.length > 0) {
  console.warn("Path warnings:", result.warnings.join(", "));
}
```

### 4. Combine Related Validations

For complex inputs, validate all parameters together:

```javascript
const allValidations = [
  validator.validateCode(code, { maxLength: 50000 }),
  validator.validatePath(outputPath, { allowRelative: false }),
  validator.validateEnum(format, "format", ["json", "xml", "text"]),
];

const combined = validator.combineResults(...allValidations);
```

## Testing

Run the validation service test suite:

```bash
npm run build
node test-validation-service.js
```

The test suite covers:

- Code validation (empty, too short, too long, encoding issues)
- Path validation (Windows/Unix paths, invalid characters, extensions)
- String validation (type checking, length constraints)
- Number validation (range, integer constraints)
- Array validation (length, item validation)
- Enum validation (allowed values)
- Combined validation (multiple validations)

## Platform-Specific Behavior

### Windows Paths

- Detects Windows paths by `C:\` or `\\` prefix
- Checks for invalid characters: `< > " | ? *`
- Detects reserved names: `CON`, `PRN`, `AUX`, `NUL`, `COM1-9`, `LPT1-9`
- Max path length warning at 208 chars (80% of 260 limit)

### Unix Paths

- Detects Unix paths by `/` prefix
- Checks for null characters only
- Max path length warning at 3276 chars (80% of 4096 limit)

### Auto-Detection

When `platform: 'auto'` (default), the service automatically detects the platform based on path format.

## Future Enhancements

Planned improvements:

- File existence checking (`mustExist` option)
- Pattern/regex matching for string validation
- Email/URL validation helpers
- Custom validator composition
- Async validation support (for file system checks)
- Internationalized error messages

## Related Documentation

- [MCP Helpers](../src/utils/mcp-helpers.ts) - Response formatting utilities
- [Tool Types](../src/utils/tool-types.ts) - Shared type definitions
- [Service Architecture](./REFINED_ARCHITECTURE_FINAL_SUMMARY.md) - Overall system design

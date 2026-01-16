# Testing Guide

## Overview

This project uses Jest as the testing framework with TypeScript support via ts-jest.

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Run specific test file

```bash
npm test -- validation-service.test.ts
```

## Test Structure

Tests are organized in the `tests/` directory, mirroring the source structure:

```
tests/
  ├── services/         # Service tests
  │   └── validation-service.test.ts
  └── utils/            # Utility tests
      └── mcp-helpers.test.ts
```

## Current Test Coverage

### Validation Service (43 tests)

- ✅ Code validation (empty, length limits, encoding)
- ✅ Path validation (Windows/Unix, characters, extensions)
- ✅ String parameter validation
- ✅ Number validation (range, integers)
- ✅ Array validation (length, item validators)
- ✅ Enum/choice validation
- ✅ Combined validation results

### MCP Helpers (14 tests)

- ✅ createMCPResponse (objects, arrays, nested data)
- ✅ createMCPTextResponse (plain text, multiline)
- ✅ createMCPError (error objects, strings, unknown types)
- ✅ Response structure validation

## Writing Tests

### Basic Test Structure

```typescript
import { ValidationService } from "../../src/services/validation-service";

describe("MyService", () => {
  let service: MyService;

  beforeEach(() => {
    service = new MyService();
  });

  describe("myMethod", () => {
    it("should handle valid input", () => {
      const result = service.myMethod("valid");
      expect(result.isValid).toBe(true);
    });

    it("should reject invalid input", () => {
      const result = service.myMethod("invalid");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Expected error message");
    });
  });
});
```

### Testing Async Functions

```typescript
it("should fetch data asynchronously", async () => {
  const result = await service.fetchData();
  expect(result).toBeDefined();
});
```

### Mocking Dependencies

```typescript
jest.mock("../../src/services/wiki-service");

describe("MyService", () => {
  it("should use mocked service", () => {
    const wikiService = new QB64PEWikiService();
    wikiService.search = jest.fn().mockResolvedValue([]);
    // ... test code
  });
});
```

## Test Best Practices

### 1. Descriptive Test Names

✅ Good: `should reject code above maximum length`
❌ Bad: `test1`

### 2. Arrange-Act-Assert Pattern

```typescript
it("should validate input", () => {
  // Arrange
  const input = "test data";

  // Act
  const result = validator.validate(input);

  // Assert
  expect(result.isValid).toBe(true);
});
```

### 3. Test One Thing at a Time

```typescript
// ✅ Good - focused test
it("should reject empty code", () => {
  const result = validator.validateCode("");
  expect(result.isValid).toBe(false);
});

// ❌ Bad - testing multiple things
it("should validate code", () => {
  expect(validator.validateCode("")).toBe(false);
  expect(validator.validateCode("x".repeat(10000))).toBe(false);
  expect(validator.validateCode('PRINT "hi"')).toBe(true);
});
```

### 4. Use beforeEach for Setup

```typescript
describe("MyTests", () => {
  let service: MyService;

  beforeEach(() => {
    service = new MyService();
  });

  // Tests use the fresh instance
});
```

### 5. Group Related Tests

```typescript
describe("validatePath", () => {
  describe("Windows paths", () => {
    // Windows-specific tests
  });

  describe("Unix paths", () => {
    // Unix-specific tests
  });
});
```

## Coverage Goals

Target coverage levels:

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

View coverage report:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Adding New Tests

When adding new features:

1. Create test file alongside the feature
2. Follow naming convention: `*.test.ts`
3. Write tests before or during development (TDD)
4. Ensure all edge cases are covered
5. Run tests to verify

## Continuous Integration

Tests run automatically on:

- Pre-commit (optional hook)
- Pull requests
- Main branch pushes

## Troubleshooting

### Tests timing out

Increase timeout in jest.config.js:

```javascript
testTimeout: 10000, // 10 seconds
```

### Module resolution issues

Check tsconfig.json moduleResolution settings

### Import errors

Ensure paths use `.js` extension for imports even in TypeScript files

## Future Test Coverage

Planned test suites:

- [ ] Service integration tests
- [ ] Tool registration tests
- [ ] End-to-end MCP communication tests
- [ ] Wiki service tests (with mocked HTTP)
- [ ] Compiler service tests
- [ ] Porting service tests

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [TypeScript with Jest](https://kulshekhar.github.io/ts-jest/)

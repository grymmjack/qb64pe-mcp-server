/**
 * Test validation service functionality
 */

import { ValidationService } from "./build/services/validation-service.js";

console.log("🧪 Testing Validation Service\n");
console.log("=".repeat(60));

const validator = new ValidationService();

// Test 1: Code Validation
console.log("\n📝 Test 1: Code Validation");
console.log("-".repeat(60));

const testCases = [
  {
    name: "Valid code",
    code: 'PRINT "Hello World"',
    options: {},
  },
  {
    name: "Empty code (not allowed)",
    code: "   ",
    options: { allowEmpty: false },
  },
  {
    name: "Code too short",
    code: "DIM x",
    options: { minLength: 10 },
  },
  {
    name: "Code too long",
    code: 'PRINT "x"'.repeat(20000),
    options: { maxLength: 1000 },
  },
  {
    name: "Large code warning",
    code: 'PRINT "x"\n'.repeat(10000),
    options: {},
  },
];

testCases.forEach((test) => {
  console.log(`\nTest: ${test.name}`);
  const result = validator.validateCode(test.code, test.options);
  console.log(`  Valid: ${result.isValid}`);
  if (result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(", ")}`);
  }
  if (result.warnings.length > 0) {
    console.log(`  Warnings: ${result.warnings.join(", ")}`);
  }
});

// Test 2: Path Validation
console.log("\n\n📂 Test 2: Path Validation");
console.log("-".repeat(60));

const pathTests = [
  {
    name: "Valid Windows absolute path",
    path: "C:\\QB64pe\\programs\\test.bas",
    options: {},
  },
  {
    name: "Valid Unix absolute path",
    path: "/usr/local/qb64pe/programs/test.bas",
    options: {},
  },
  {
    name: "Valid relative path",
    path: "./programs/test.bas",
    options: { allowRelative: true },
  },
  {
    name: "Invalid relative path (not allowed)",
    path: "./programs/test.bas",
    options: { allowRelative: false },
  },
  {
    name: "Invalid Windows characters",
    path: "C:\\QB64pe\\programs\\test|file.bas",
    options: {},
  },
  {
    name: "Reserved Windows name",
    path: "C:\\QB64pe\\CON.bas",
    options: {},
  },
  {
    name: "Path with spaces",
    path: "C:\\Program Files\\QB64pe\\test.bas",
    options: {},
  },
  {
    name: "Mixed separators",
    path: "C:\\QB64pe/programs\\test.bas",
    options: {},
  },
  {
    name: "Wrong extension",
    path: "/usr/local/qb64pe/test.txt",
    options: { allowedExtensions: [".bas", ".bi"] },
  },
];

pathTests.forEach((test) => {
  console.log(`\nTest: ${test.name}`);
  const result = validator.validatePath(test.path, test.options);
  console.log(`  Valid: ${result.isValid}`);
  if (result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(", ")}`);
  }
  if (result.warnings.length > 0) {
    console.log(`  Warnings: ${result.warnings.join(", ")}`);
  }
});

// Test 3: String Parameter Validation
console.log("\n\n🔤 Test 3: String Parameter Validation");
console.log("-".repeat(60));

const stringTests = [
  { name: "Valid string", value: "test.bas", paramName: "filename" },
  { name: "Empty string", value: "   ", paramName: "filename" },
  { name: "Undefined", value: undefined, paramName: "filename" },
  { name: "Wrong type", value: 123, paramName: "filename" },
  {
    name: "Too short",
    value: "ab",
    paramName: "filename",
    options: { minLength: 5 },
  },
  {
    name: "Too long",
    value: "x".repeat(100),
    paramName: "filename",
    options: { maxLength: 50 },
  },
];

stringTests.forEach((test) => {
  console.log(`\nTest: ${test.name}`);
  const result = validator.validateRequiredString(
    test.value,
    test.paramName,
    test.options || {},
  );
  console.log(`  Valid: ${result.isValid}`);
  if (result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(", ")}`);
  }
});

// Test 4: Number Validation
console.log("\n\n🔢 Test 4: Number Validation");
console.log("-".repeat(60));

const numberTests = [
  { name: "Valid number", value: 42, paramName: "lineNumber" },
  { name: "Invalid (NaN)", value: "abc", paramName: "lineNumber" },
  {
    name: "Below minimum",
    value: -5,
    paramName: "lineNumber",
    options: { min: 0 },
  },
  {
    name: "Above maximum",
    value: 1000,
    paramName: "lineNumber",
    options: { max: 100 },
  },
  {
    name: "Not an integer",
    value: 3.14,
    paramName: "lineNumber",
    options: { integer: true },
  },
  {
    name: "Valid integer in range",
    value: 50,
    paramName: "lineNumber",
    options: { min: 1, max: 100, integer: true },
  },
];

numberTests.forEach((test) => {
  console.log(`\nTest: ${test.name}`);
  const result = validator.validateNumber(
    test.value,
    test.paramName,
    test.options || {},
  );
  console.log(`  Valid: ${result.isValid}`);
  if (result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(", ")}`);
  }
});

// Test 5: Array Validation
console.log("\n\n📋 Test 5: Array Validation");
console.log("-".repeat(60));

const arrayTests = [
  { name: "Valid array", value: ["a", "b", "c"], paramName: "files" },
  { name: "Not an array", value: "abc", paramName: "files" },
  {
    name: "Too few items",
    value: ["a"],
    paramName: "files",
    options: { minLength: 3 },
  },
  {
    name: "Too many items",
    value: ["a", "b", "c", "d", "e"],
    paramName: "files",
    options: { maxLength: 3 },
  },
  {
    name: "With item validator",
    value: ["test.bas", "invalid|file.bas", "program.bas"],
    paramName: "files",
    options: {
      itemValidator: (item) => validator.validatePath(item, {}),
    },
  },
];

arrayTests.forEach((test) => {
  console.log(`\nTest: ${test.name}`);
  const result = validator.validateArray(
    test.value,
    test.paramName,
    test.options || {},
  );
  console.log(`  Valid: ${result.isValid}`);
  if (result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(", ")}`);
  }
  if (result.warnings.length > 0) {
    console.log(`  Warnings: ${result.warnings.join(", ")}`);
  }
});

// Test 6: Enum Validation
console.log("\n\n🎯 Test 6: Enum Validation");
console.log("-".repeat(60));

const enumTests = [
  {
    name: "Valid choice",
    value: "windows",
    paramName: "platform",
    allowed: ["windows", "linux", "macos"],
  },
  {
    name: "Invalid choice",
    value: "android",
    paramName: "platform",
    allowed: ["windows", "linux", "macos"],
  },
  {
    name: "Undefined",
    value: undefined,
    paramName: "platform",
    allowed: ["windows", "linux", "macos"],
  },
];

enumTests.forEach((test) => {
  console.log(`\nTest: ${test.name}`);
  const result = validator.validateEnum(
    test.value,
    test.paramName,
    test.allowed,
  );
  console.log(`  Valid: ${result.isValid}`);
  if (result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(", ")}`);
  }
});

// Test 7: Combined Validation
console.log("\n\n🔗 Test 7: Combined Validation");
console.log("-".repeat(60));

console.log("\nValidating multiple parameters for a porting request:");
const codeResult = validator.validateCode('PRINT "Hello"', {
  minLength: 5,
  maxLength: 10000,
});
const dialectResult = validator.validateEnum("qbasic", "dialect", [
  "qbasic",
  "quickbasic",
  "gwbasic",
]);
const outputPathResult = validator.validatePath("./output/ported.bas", {
  allowRelative: true,
});

const combined = validator.combineResults(
  codeResult,
  dialectResult,
  outputPathResult,
);

console.log(`  Overall Valid: ${combined.isValid}`);
console.log(`  Total Errors: ${combined.errors.length}`);
console.log(`  Total Warnings: ${combined.warnings.length}`);
if (combined.errors.length > 0) {
  console.log(`  Errors: ${combined.errors.join(", ")}`);
}
if (combined.warnings.length > 0) {
  console.log(`  Warnings: ${combined.warnings.join(", ")}`);
}

console.log("\n" + "=".repeat(60));
console.log("✅ Validation Service Tests Complete\n");

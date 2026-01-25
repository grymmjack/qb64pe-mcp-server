/**
 * Test REDIM _PRESERVE warning in .BI files (session problem fix)
 */

const {
  FileStructureService,
} = require("../../build/services/file-structure-service.js");

console.log("Testing REDIM _PRESERVE Detection in .BI Files...\n");

const service = new FileStructureService();

// Test case 1: The problematic pattern from the session
const biContent1 = `
$INCLUDEONCE

DIM SHARED PAL(0 TO 255) AS _UNSIGNED LONG

REDIM _PRESERVE SHARED PAL(0 TO i%-1)
`.trim();

console.log("Test 1: REDIM _PRESERVE SHARED in .BI file");
console.log("-".repeat(60));
console.log(biContent1);
console.log("-".repeat(60));

const result1 = service.validateBIFile(biContent1);

console.log(`\nValidation Results:`);
console.log(`Valid: ${result1.isValid}`);
console.log(`Errors: ${result1.summary.errors}`);
console.log(`Warnings: ${result1.summary.warnings}\n`);

if (result1.issues.length > 0) {
  const redimIssues = result1.issues.filter((i) =>
    i.issue.includes("REDIM _PRESERVE"),
  );
  if (redimIssues.length > 0) {
    console.log("✅ DETECTED REDIM _PRESERVE Issue:");
    redimIssues.forEach((issue, index) => {
      console.log(`\nIssue ${index + 1}:`);
      console.log(`  Line: ${issue.line}`);
      console.log(`  Code: ${issue.content}`);
      console.log(`  Issue: ${issue.issue}`);
      console.log(`  Suggestion: ${issue.suggestion}`);
      console.log(`  Severity: ${issue.severity}`);
    });
  } else {
    console.log("❌ FAILED - REDIM _PRESERVE not detected!");
  }
} else {
  console.log("❌ FAILED - No issues detected!");
}

console.log("\n" + "=".repeat(60) + "\n");

// Test case 2: Normal .BI file without REDIM (should pass)
const biContent2 = `
$INCLUDEONCE

TYPE VideoMode
    width AS INTEGER
    height AS INTEGER
END TYPE

DIM SHARED currentMode AS VideoMode
`.trim();

console.log("Test 2: Normal .BI file without REDIM _PRESERVE");
console.log("-".repeat(60));
console.log(biContent2);
console.log("-".repeat(60));

const result2 = service.validateBIFile(biContent2);

console.log(`\nValidation Results:`);
console.log(`Valid: ${result2.isValid}`);
console.log(`Issues: ${result2.issues.length}`);

const redimIssues2 = result2.issues.filter((i) =>
  i.issue.includes("REDIM _PRESERVE"),
);
if (redimIssues2.length === 0) {
  console.log("✅ PASSED - No false positives for normal .BI file");
} else {
  console.log("❌ FAILED - False positive detected");
}

console.log("\n" + "=".repeat(60) + "\n");
console.log("Test Summary:");
console.log("- REDIM _PRESERVE SHARED detection in .BI files: IMPLEMENTED ✓");
console.log("- Prevents arrays from being silently shrunk in include files");
console.log("- High-priority fix for session problem: array_resizing");

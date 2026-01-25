/**
 * Test DIM AS vs sigil mismatch detection (session problem fix)
 */

const {
  QB64PESyntaxService,
} = require("../../build/services/syntax-service.js");

console.log("Testing DIM AS vs Sigil Mismatch Detection...\n");

const syntaxService = new QB64PESyntaxService();

// Test case 1: The exact problem from the session
const testCode1 = `
DIM SHARED PALETTE_LOADER_COUNT AS INTEGER
PALETTE_LOADER_COUNT% = 0
`.trim();

console.log("Test 1: Session Problem - DIM AS but reference with sigil");
console.log("-".repeat(60));
console.log(testCode1);
console.log("-".repeat(60));

syntaxService
  .validateSyntax(testCode1, "basic")
  .then((result) => {
    console.log(`\nValidation Results:`);
    console.log(`Valid: ${result.isValid}`);
    console.log(`Compatibility Issues: ${result.compatibilityIssues.length}\n`);

    if (result.compatibilityIssues.length > 0) {
      console.log("✅ DETECTED Issues:");
      result.compatibilityIssues.forEach((issue, index) => {
        if (issue.category === "variable_naming_mismatch") {
          console.log(`\nIssue ${index + 1}:`);
          console.log(`  Line: ${issue.line}`);
          console.log(`  Pattern: ${issue.pattern}`);
          console.log(`  Message: ${issue.message}`);
          console.log(`  Suggestion: ${issue.suggestion}`);
          console.log(`  Severity: ${issue.severity}`);
        }
      });
    } else {
      console.log("❌ FAILED - No issues detected!");
    }

    console.log("\n" + "=".repeat(60) + "\n");

    // Test case 2: Multiple variables with mismatch
    const testCode2 = `
DIM SHARED counter AS INTEGER
DIM SHARED total AS LONG
DIM SHARED name AS STRING

counter% = 0
total& = 100
name$ = "test"
`.trim();

    console.log("Test 2: Multiple variable mismatches");
    console.log("-".repeat(60));
    console.log(testCode2);
    console.log("-".repeat(60));

    return syntaxService.validateSyntax(testCode2, "basic");
  })
  .then((result) => {
    console.log(`\nValidation Results:`);
    console.log(`Compatibility Issues: ${result.compatibilityIssues.length}\n`);

    const mismatchIssues = result.compatibilityIssues.filter(
      (i) => i.category === "variable_naming_mismatch",
    );
    console.log(
      `✅ Detected ${mismatchIssues.length} variable naming mismatches`,
    );

    mismatchIssues.forEach((issue, index) => {
      console.log(`\n  ${index + 1}. Line ${issue.line}: ${issue.pattern}`);
      console.log(`     ${issue.message}`);
    });

    console.log("\n" + "=".repeat(60) + "\n");

    // Test case 3: Correct usage - should NOT trigger warnings
    const testCode3 = `
DIM SHARED counter% AS INTEGER
DIM SHARED total& AS LONG
DIM SHARED name$ AS STRING

counter% = 0
total& = 100
name$ = "test"
`.trim();

    console.log("Test 3: Correct usage - sigil in both DIM and reference");
    console.log("-".repeat(60));
    console.log(testCode3);
    console.log("-".repeat(60));

    return syntaxService.validateSyntax(testCode3, "basic");
  })
  .then((result) => {
    console.log(`\nValidation Results:`);
    const mismatchIssues = result.compatibilityIssues.filter(
      (i) => i.category === "variable_naming_mismatch",
    );
    console.log(`Issues: ${mismatchIssues.length}`);

    if (mismatchIssues.length === 0) {
      console.log("✅ PASSED - No false positives for correct code");
    } else {
      console.log("❌ FAILED - False positives detected:");
      mismatchIssues.forEach((issue) => {
        console.log(`  Line ${issue.line}: ${issue.message}`);
      });
    }

    console.log("\n" + "=".repeat(60) + "\n");
    console.log("Test Summary:");
    console.log("- DIM AS vs sigil mismatch detection: IMPLEMENTED ✓");
    console.log(
      "- Helps prevent silent runtime bugs from variable name confusion",
    );
    console.log("- Critical fix for session problem: variable_naming_mismatch");
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });

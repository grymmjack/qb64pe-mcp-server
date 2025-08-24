// Test QB64PE image handle validation correction
const { QB64PEPatternValidator } = require('./qb64pe-pattern-validator.js');

console.log('🔍 Testing QB64PE Image Handle Validation Correction\n');

const validator = new QB64PEPatternValidator();

// Test case with incorrect image handle validation
const testCode = `$CONSOLE
DIM img AS LONG
img = _LOADIMAGE("test.png")
IF img <> -1 THEN
    _PUTIMAGE (0, 0), img
    _FREEIMAGE img
END IF
SYSTEM`;

console.log('Code with incorrect image handle validation:');
console.log(testCode);
console.log('\n' + '='.repeat(50));

const results = validator.validateCode(testCode);

console.log('\nValidation Results:');
console.log(`Total Issues: ${results.summary.totalIssues}`);
console.log(`Critical Errors: ${results.summary.criticalErrors}`);
console.log(`Warnings: ${results.summary.warnings}`);

console.log('\nDetected Issues:');
results.issues.forEach((issue, index) => {
    const icon = issue.severity === 'ERROR' ? '❌' : 
                issue.severity === 'WARNING' ? '⚠️' : 'ℹ️';
    console.log(`${index + 1}. ${icon} [${issue.severity}] ${issue.rule}: ${issue.message}`);
    if (issue.fix) {
        console.log(`   Fix: ${issue.fix}`);
    }
});

// Check if handle validation issue was detected
const handleValidationIssue = results.issues.find(issue => 
    issue.rule === 'Handle Validation' && 
    issue.message.includes('should check <> 0, not -1')
);

if (handleValidationIssue) {
    console.log('\n✅ SUCCESS: Correctly detected QB64PE image handle validation issue!');
    console.log('The validator now properly identifies that QB64PE images should check <> 0, not -1');
} else {
    console.log('\n❌ ISSUE: Handle validation pattern not detected correctly');
}

console.log('\n📋 CORRECTED QB64PE IMAGE HANDLE PATTERN:');
console.log(`$CONSOLE
DIM img AS LONG
img = _LOADIMAGE("test.png")
IF img <> 0 THEN          ' ✅ Correct for QB64PE images
    _PUTIMAGE (0, 0), img
    _FREEIMAGE img
END IF
SYSTEM`);

console.log('\n🎯 KEY POINT: QB64PE image handles return 0 on failure, so only check <> 0');

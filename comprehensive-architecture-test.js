// Comprehensive test of refined QB64PE MCP service architecture
// Tests all updated rules including BI/BM structure and _ECHO usage

const { QB64PEPatternValidator } = require('./qb64pe-pattern-validator.js');

console.log('🔍 QB64PE MCP SERVICE ARCHITECTURE VALIDATION');
console.log('Testing refined rules with BI/BM structure and _ECHO patterns\n');

const validator = new QB64PEPatternValidator();

// Updated test cases based on refined architecture
const architectureTestCases = [
    {
        name: 'IMPROVED: $CONSOLE Strategy (Preferred for MCP)',
        description: 'Tests the improved console strategy using $CONSOLE',
        code: `$CONSOLE
_ECHO "=== MCP DEBUG START ==="
_ECHO "Graphics mode: "; "Available"
SCREEN _NEWIMAGE(800, 600, 32)
_PUTIMAGE (0, 0), img&
_ECHO "STATUS: SUCCESS"
_ECHO "=== MCP DEBUG END ==="
SYSTEM`,
        expectedErrors: []
    },
    
    {
        name: 'CORRECT: BI/BM Library Structure',
        description: 'Proper include order with BI at top, BM at bottom',
        code: `$CONSOLE

'$INCLUDE:'ASEPRITE.BI'

_ECHO "=== MCP DEBUG START ==="
DIM data AS ASEPRITE_DATA
result& = aseprite_load& ("test.aseprite")
_ECHO "Layers loaded: "; result&
_ECHO "=== MCP DEBUG END ==="
SYSTEM

'$INCLUDE:'ASEPRITE.BM'`,
        expectedErrors: []
    },
    
    {
        name: 'ERROR: Wrong Include Order',
        description: 'BM includes before code (should be at bottom)',
        code: `$CONSOLE
'$INCLUDE:'ASEPRITE.BM'

_ECHO "=== MCP DEBUG START ==="
DIM data AS ASEPRITE_DATA
_ECHO "=== MCP DEBUG END ==="
SYSTEM

'$INCLUDE:'ASEPRITE.BI'`,
        expectedErrors: ['BM Include Order', 'BI Include Order']
    },
    
    {
        name: 'ERROR: Code Duplication in Example',
        description: 'Example file implementing functions instead of using includes',
        code: `$CONSOLE
'$INCLUDE:'LIBRARY.BI'

SUB library_function()
    ' This should be in BM file, not duplicated here
END SUB

_ECHO "Test"
SYSTEM

'$INCLUDE:'LIBRARY.BM'`,
        expectedErrors: ['Code Centralization']
    },
    
    {
        name: 'WARNING: Using PRINT instead of _ECHO',
        description: 'Should use _ECHO for MCP-compatible output',
        code: `$CONSOLE
PRINT "=== DEBUG START ==="
PRINT "STATUS: LOADING"
SCREEN _NEWIMAGE(800, 600, 32)
PRINT "=== DEBUG END ==="
SYSTEM`,
        expectedErrors: ['MCP Output Format']
    },
    
    {
        name: 'LEGACY: $CONSOLE:ONLY Issues',
        description: 'Still catches $CONSOLE:ONLY problems but suggests $CONSOLE',
        code: `$CONSOLE:ONLY
SCREEN _NEWIMAGE(800, 600, 32)
_PUTIMAGE (0, 0), img&
PRINT "Debug output"
END`,
        expectedErrors: ['Console Strategy', 'Console Mode Compatibility', 'Clean Console Exit']
    }
];

// Run architecture validation tests
let totalTests = 0;
let passedTests = 0;

architectureTestCases.forEach((testCase, index) => {
    console.log(`\n📋 ARCHITECTURE TEST ${index + 1}: ${testCase.name}`);
    console.log(`Description: ${testCase.description}`);
    console.log(`Expected Issues: [${testCase.expectedErrors.join(', ')}]`);
    
    const results = validator.validateCode(testCase.code);
    
    console.log(`\n📊 Results:`);
    console.log(`Total Issues: ${results.summary.totalIssues}`);
    console.log(`Critical Errors: ${results.summary.criticalErrors}`);
    console.log(`Warnings: ${results.summary.warnings}`);
    
    // Check if detected issues match expected errors
    const detectedRules = [...new Set(results.issues.map(i => i.rule))];
    const hasExpectedErrors = testCase.expectedErrors.length === 0 ? 
        results.summary.totalIssues === 0 :
        testCase.expectedErrors.every(expected => 
            detectedRules.some(detected => detected.includes(expected) || expected.includes(detected))
        );
    
    console.log(`\n🔍 Detected Issues:`);
    if (results.issues.length === 0) {
        console.log('✅ No issues detected');
    } else {
        results.issues.forEach((issue, i) => {
            const icon = issue.severity === 'ERROR' ? '❌' : 
                        issue.severity === 'WARNING' ? '⚠️' : 'ℹ️';
            console.log(`  ${icon} [${issue.severity}] ${issue.rule}: ${issue.message}`);
        });
    }
    
    // Test validation
    totalTests++;
    if (hasExpectedErrors) {
        console.log(`\n✅ ARCHITECTURE TEST PASSED: Correctly detected expected patterns`);
        passedTests++;
    } else {
        console.log(`\n❌ ARCHITECTURE TEST FAILED: Pattern detection mismatch`);
        console.log(`Expected: [${testCase.expectedErrors.join(', ')}]`);
        console.log(`Detected: [${detectedRules.join(', ')}]`);
    }
    
    console.log(`\n${'='.repeat(70)}`);
});

// Final architecture summary
console.log(`\n🎯 ARCHITECTURE VALIDATION SUMMARY`);
console.log(`Tests Passed: ${passedTests}/${totalTests}`);
console.log(`Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);

if (passedTests === totalTests) {
    console.log(`\n🎉 ALL ARCHITECTURE TESTS PASSED!`);
    console.log(`✅ Refined MCP service rules correctly implemented`);
    console.log(`✅ BI/BM library structure validation working`);
    console.log(`✅ $CONSOLE strategy properly preferred over $CONSOLE:ONLY`);
    console.log(`✅ _ECHO usage correctly encouraged for MCP compatibility`);
} else {
    console.log(`\n⚠️  Some architecture tests failed - rules need refinement`);
}

// Demonstrate the improved MCP template
console.log(`\n🏗️  IMPROVED MCP TEMPLATE DEMONSTRATION`);
console.log(`\n✅ Correct MCP-Compatible QB64PE Program Structure:`);

const improvedTemplate = `$CONSOLE

''
' ASEPRITE_VIEWER.BAS - MCP Enhanced Example
''

'$INCLUDE:'ASEPRITE.BI'
$CONSOLE

' === MCP DEBUG OUTPUT ===
_ECHO "=== MCP DEBUG START ==="
_ECHO "PROGRAM: ASEPRITE_VIEWER"
_ECHO "LIBRARY: ASEPRITE"
_ECHO "TIMESTAMP: "; DATE$; " "; TIME$

' === MAIN LOGIC WITH _ECHO MONITORING ===
_ECHO "STATUS: INITIALIZATION"
DIM aseprite_data AS ASEPRITE_FILE

_ECHO "STATUS: LOADING"
result& = aseprite_load& ("example.aseprite")
IF result& <> 0 THEN
    _ECHO "Aseprite file loaded successfully"
    _ECHO "LAYERS_TOTAL: "; aseprite_data.layer_count
    
    _ECHO "STATUS: GRAPHICS_SETUP"
    SCREEN _NEWIMAGE(800, 600, 32)  ' ✅ Works with $CONSOLE
    
    _ECHO "STATUS: RENDERING"
    composite_img& = aseprite_create_composite& (aseprite_data)
    IF composite_img& <> 0 THEN
        _PUTIMAGE (0, 0), composite_img&   ' ✅ Graphics work
        _FREEIMAGE composite_img&
        _ECHO "STATUS: RENDER_SUCCESS"
    ELSE
        _ECHO "ERROR: RENDER_FAILED"
    END IF
    
    _ECHO "STATUS: CLEANUP"
    aseprite_cleanup aseprite_data
ELSE
    _ECHO "ERROR: FILE_LOAD_FAILED"
END IF

_ECHO "RESULT: SUCCESS"
_ECHO "=== MCP DEBUG END ==="
SYSTEM

'$INCLUDE:'ASEPRITE.BM'`;

console.log(improvedTemplate);

console.log(`\n📋 KEY ARCHITECTURAL IMPROVEMENTS:`);
console.log(`1. ✅ Uses $CONSOLE (not $CONSOLE:ONLY) for graphics + MCP debugging`);
console.log(`2. ✅ Proper BI/BM include order: headers at top, implementations at bottom`);
console.log(`3. ✅ Uses _ECHO for all MCP output (better than PRINT)`);
console.log(`4. ✅ Structured MCP session markers for parsing`);
console.log(`5. ✅ Graphics functions work alongside console output`);
console.log(`6. ✅ No code duplication - uses centralized library includes`);
console.log(`7. ✅ Clean exit with SYSTEM statement`);
console.log(`8. ✅ Proper resource management with handle validation`);

console.log(`\n🚀 NEXT STEPS FOR MCP SERVICE INTEGRATION:`);
console.log(`1. Update all MCP tools to use $CONSOLE strategy`);
console.log(`2. Enforce BI/BM include order validation`);
console.log(`3. Replace PRINT with _ECHO for structured output`);
console.log(`4. Prevent code duplication in examples`);
console.log(`5. Apply these patterns to all generated code`);

console.log(`\n✨ This refined architecture eliminates the console/graphics conflicts while maintaining proper QB64PE library structure!`);

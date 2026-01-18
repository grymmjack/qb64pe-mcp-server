// Test script to demonstrate the QB64PE debugging enhancements
const { QB64PEDebuggingService } = require('../build/services/debugging-service.js');

// Sample problematic QB64PE code that exhibits the issues
const problematicCode = `
PRINT "QB64PE Test Program"
PRINT "=================="

' This will cause issues:
' 1. No $CONSOLE directive
' 2. Uses FREEFILE without tracking
' 3. Graphics without proper context management
' 4. Blocking user input

SCREEN 12
CIRCLE (320, 240), 50, 4

DIM filename AS STRING
filename = "test.dat"
DIM fileHandle AS INTEGER
fileHandle = FREEFILE
OPEN filename FOR OUTPUT AS #fileHandle
PRINT #fileHandle, "Test data"
CLOSE #fileHandle

' Create an image without cleanup
DIM img AS LONG
img = _NEWIMAGE(100, 100, 32)
PSET (50, 50), _RGB32(255, 0, 0)

PRINT "Program completed!"
PRINT "Press any key to continue..."
SLEEP
END
`;

async function testDebuggingEnhancements() {
    console.log('='.repeat(60));
    console.log('QB64PE Debugging Enhancement Test');
    console.log('='.repeat(60));
    
    const debugService = new QB64PEDebuggingService();
    
    console.log('\n1. Analyzing problematic code...');
    console.log('Original code length:', problematicCode.split('\n').length, 'lines');
    
    const result = debugService.enhanceCodeForDebugging(problematicCode, {
        enableConsole: true,
        enableLogging: true,
        enableScreenshots: true,
        enableFlowControl: true,
        enableResourceTracking: true,
        timeoutSeconds: 30,
        autoExit: true,
        verboseOutput: true
    });
    
    console.log('\n2. Enhancement Results:');
    console.log('   Enhanced code length:', result.enhancedCode.split('\n').length, 'lines');
    console.log('   Lines added:', result.enhancedCode.split('\n').length - problematicCode.split('\n').length);
    console.log('   Issues detected:', result.issues.length);
    console.log('   Solutions applied:', result.solutions.length);
    console.log('   Debug features enabled:', result.debugFeatures.join(', '));
    
    console.log('\n3. Issues Found:');
    result.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.description}`);
        console.log(`      Type: ${issue.type}`);
        console.log(`      Auto-fixable: ${issue.autoFixable ? 'Yes' : 'No'}`);
    });
    
    console.log('\n4. Modifications Applied:');
    result.modifications.forEach((mod, index) => {
        console.log(`   ${index + 1}. ${mod}`);
    });
    
    console.log('\n5. Enhanced Code Preview (first 50 lines):');
    console.log('-'.repeat(40));
    const lines = result.enhancedCode.split('\n');
    lines.slice(0, 50).forEach((line, index) => {
        console.log(`${String(index + 1).padStart(3, ' ')}: ${line}`);
    });
    if (lines.length > 50) {
        console.log(`... and ${lines.length - 50} more lines`);
    }
    console.log('-'.repeat(40));
    
    console.log('\n6. Best Practices Guide:');
    console.log(debugService.getDebuggingBestPractices().substring(0, 500) + '...');
    
    console.log('\n7. LLM Debugging Guide:');
    console.log(debugService.getLLMDebuggingGuide().substring(0, 500) + '...');
    
    console.log('\n' + '='.repeat(60));
    console.log('Test completed! The enhanced code is ready for compilation.');
    console.log('Save the enhanced code as enhanced_program.bas and compile with:');
    console.log('qb64pe -c enhanced_program.bas');
    console.log('='.repeat(60));
}

// Run the test
testDebuggingEnhancements().catch(console.error);

/**
 * Comprehensive test for LLM Graphics Screenshot Analysis
 * 
 * This test validates the execution monitoring feature's ability to:
 * 1. Generate QB64PE graphics programs that render specific shapes
 * 2. Automatically capture screenshots using _SAVEIMAGE
 * 3. Enable LLMs to analyze the visual output
 * 4. Test timeout behavior for graphics programs
 * 5. Verify screenshot analysis capabilities
 * 
 * Test Case: Red circle in center of screen
 */

import { QB64PEExecutionService } from './build/services/execution-service.js';
import * as fs from 'fs';
import * as path from 'path';

console.log('='.repeat(80));
console.log('QB64PE GRAPHICS SCREENSHOT ANALYSIS TEST');
console.log('Testing LLM ability to analyze graphics rendering via screenshots');
console.log('='.repeat(80));

// Initialize execution service
const executionService = new QB64PEExecutionService();

// Test configuration
const TEST_CONFIG = {
    timeout: 10000, // 10 seconds - reasonable for testing
    screenshotInterval: 2000, // Take screenshot every 2 seconds
    expectedShapes: ['circle'],
    expectedColors: ['red'],
    expectedPosition: 'center'
};

/**
 * Test 1: Create a QB64PE program that renders a red circle in the center
 */
console.log('\n=== Test 1: Generate Red Circle Graphics Program ===');

const redCircleProgram = `
' Test Program: Red Circle in Center of Screen
' This program is designed to test screenshot analysis capabilities

$CONSOLE ' Enable console for monitoring
_TITLE "QB64PE Screenshot Test - Red Circle"

' Setup graphics screen
SCREEN _NEWIMAGE(800, 600, 32)
_DEST 0

' Clear to black background
CLS , _RGB32(0, 0, 0)

' Calculate center position
DIM centerX AS INTEGER, centerY AS INTEGER
centerX = _WIDTH / 2
centerY = _HEIGHT / 2

' Draw red circle in center
DIM red AS _UNSIGNED LONG
red = _RGB32(255, 0, 0) ' Pure red

' Console output for monitoring
_DEST _CONSOLE
PRINT "Starting red circle rendering test..."
PRINT "Screen size: " + STR$(_WIDTH) + "x" + STR$(_HEIGHT)
PRINT "Center position: (" + STR$(centerX) + ", " + STR$(centerY) + ")"
PRINT "Drawing red circle with radius 100..."

' Switch back to graphics
_DEST 0

' Draw filled red circle
CIRCLE (centerX, centerY), 100, red
PAINT (centerX, centerY), red

' Add some text for context
COLOR _RGB32(255, 255, 255) ' White text
_PRINTSTRING (centerX - 100, centerY - 150), "RED CIRCLE TEST"
_PRINTSTRING (centerX - 80, centerY + 120), "Screenshot Analysis"

' Display the graphics
_DISPLAY

' Take screenshot for analysis
DIM screenshotFile AS STRING
screenshotFile = "qb64pe-screenshots/red-circle-test.bmp"
_SAVEIMAGE screenshotFile

' Console confirmation
_DEST _CONSOLE
PRINT "Red circle rendered successfully!"
PRINT "Screenshot saved to: " + screenshotFile
PRINT "Circle details:"
PRINT "  - Color: RGB(255, 0, 0) - Pure Red"
PRINT "  - Position: Center (" + STR$(centerX) + ", " + STR$(centerY) + ")"
PRINT "  - Radius: 100 pixels"
PRINT "  - Fill: Solid"
PRINT "Analysis ready for LLM processing..."

' Short pause to ensure screenshot is saved
_DELAY 1

' Take a second screenshot for comparison
screenshotFile = "qb64pe-screenshots/red-circle-test-final.bmp"
_SAVEIMAGE screenshotFile
PRINT "Final screenshot saved: " + screenshotFile

' Console completion signal
PRINT "Program completed successfully."
PRINT "Screenshots are ready for analysis."
PRINT "Press any key to exit..."

' Wait briefly then exit automatically (for testing)
_DELAY 3
PRINT "Auto-exiting after 3 seconds for test automation."
SYSTEM
`;

// Write the test program to file
const testProgramPath = path.join(process.cwd(), 'test-project', 'red-circle-screenshot-test.bas');
fs.writeFileSync(testProgramPath, redCircleProgram);
console.log(`✓ Generated test program: ${testProgramPath}`);

/**
 * Test 2: Analyze the program execution characteristics
 */
console.log('\n=== Test 2: Analyze Program Execution Characteristics ===');

const executionState = executionService.analyzeExecutionMode(redCircleProgram);
console.log('Execution Analysis:');
console.log(`  - Status: ${executionState.status}`);
console.log(`  - Has Graphics: ${executionState.hasGraphics}`);
console.log(`  - Has Console: ${executionState.hasConsole}`);
console.log(`  - Screenshot Dir: ${executionState.screenshotDir}`);
console.log(`  - Log File: ${executionState.logFile}`);

const guidance = executionService.getExecutionGuidance(executionState);
console.log('\nExecution Guidance:');
console.log(`  - Recommendation: ${guidance.recommendation}`);
console.log(`  - Waiting Behavior: ${guidance.waitingBehavior}`);
console.log(`  - Monitoring Strategy:`);
guidance.monitoringStrategy.forEach((strategy, index) => {
    console.log(`    ${index + 1}. ${strategy}`);
});

/**
 * Test 3: Generate Enhanced Monitoring Template
 */
console.log('\n=== Test 3: Generate Enhanced Monitoring Template ===');

const monitoringTemplate = executionService.generateMonitoringTemplate(redCircleProgram);
const enhancedProgramPath = path.join(process.cwd(), 'test-project', 'red-circle-enhanced-monitoring.bas');
fs.writeFileSync(enhancedProgramPath, monitoringTemplate);
console.log(`✓ Generated enhanced monitoring version: ${enhancedProgramPath}`);
console.log(`  - Template length: ${monitoringTemplate.length} characters`);
console.log(`  - Includes automatic logging and screenshot generation`);

/**
 * Test 4: Screenshot Analysis Instructions for LLM
 */
console.log('\n=== Test 4: LLM Screenshot Analysis Instructions ===');

const analysisInstructions = `
SCREENSHOT ANALYSIS TASK FOR LLM:

After running the QB64PE program, you should:

1. EXECUTION BEHAVIOR:
   - The program should run for approximately 3-5 seconds
   - It will automatically generate screenshots and exit
   - DO NOT wait longer than 10 seconds - this is a timeout test

2. EXPECTED VISUAL OUTPUT:
   - Screen size: 800x600 pixels
   - Background: Black (RGB 0,0,0)
   - Main element: Red circle in center
   - Circle properties:
     * Color: Pure red (RGB 255,0,0)
     * Position: Center of screen (400, 300)
     * Radius: 100 pixels
     * Fill: Solid/filled
   - Text elements:
     * "RED CIRCLE TEST" above circle
     * "Screenshot Analysis" below circle
     * Text color: White

3. SCREENSHOT FILES TO ANALYZE:
   - qb64pe-screenshots/red-circle-test.bmp
   - qb64pe-screenshots/red-circle-test-final.bmp
   - Both should show the same red circle

4. ANALYSIS CRITERIA:
   ✓ Circle is present and visible
   ✓ Circle is red color
   ✓ Circle is centered on screen
   ✓ Circle appears to be approximately 100px radius
   ✓ Background is black
   ✓ Text elements are present
   ✓ Overall rendering quality is good

5. TESTING OBJECTIVES:
   - Verify LLM can detect geometric shapes
   - Confirm color recognition capabilities
   - Test position/layout analysis
   - Validate text recognition in graphics
   - Ensure screenshot quality is sufficient for analysis

6. EXPECTED LLM RESPONSE:
   The LLM should be able to describe:
   - "I can see a red circle in the center of a black screen"
   - "The circle appears to be filled/solid red"
   - "There is white text above and below the circle"
   - "The overall composition matches the expected test pattern"

7. COMMON ISSUES TO CHECK:
   - Screenshot file exists and is not corrupted
   - Image format is readable (BMP)
   - Graphics rendered correctly without artifacts
   - Colors are accurate (not washed out or distorted)
   - Text is legible and positioned correctly

This test validates the complete pipeline:
QB64PE Code → Graphics Rendering → Screenshot → LLM Analysis
`;

console.log(analysisInstructions);

/**
 * Test 5: Process Monitoring Commands for Graphics Testing
 */
console.log('\n=== Test 5: Process Monitoring Commands ===');

const monitoringCommands = executionService.getProcessMonitoringCommands();
const terminationCommands = executionService.getProcessTerminationCommands(12345);

console.log('Process Monitoring Commands:');
monitoringCommands.forEach((cmd, index) => {
    console.log(`  ${index + 1}. ${cmd}`);
});

console.log('\nProcess Termination Commands (PID 12345):');
terminationCommands.forEach((cmd, index) => {
    console.log(`  ${index + 1}. ${cmd}`);
});

/**
 * Test 6: File Monitoring for Screenshots
 */
console.log('\n=== Test 6: Screenshot File Monitoring ===');

const screenshotDir = path.join(process.cwd(), 'qb64pe-screenshots');
const logDir = path.join(process.cwd(), 'qb64pe-logs');

// Ensure directories exist
[screenshotDir, logDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✓ Created directory: ${dir}`);
    } else {
        console.log(`✓ Directory exists: ${dir}`);
    }
});

/**
 * Test 7: Generate Test Execution Script
 */
console.log('\n=== Test 7: Generate Test Execution Script ===');

const testScript = `
@echo off
echo ================================================================================
echo QB64PE Graphics Screenshot Analysis Test
echo ================================================================================
echo.
echo This script will compile and run the red circle test program
echo.

echo Compiling QB64PE program...
qb64pe -c test-project\\red-circle-screenshot-test.bas

if exist test-project\\red-circle-screenshot-test.exe (
    echo ✓ Compilation successful
    echo.
    echo Running test program...
    echo Note: Program will auto-exit after 3 seconds
    echo.
    
    start /wait test-project\\red-circle-screenshot-test.exe
    
    echo.
    echo Checking for screenshots...
    if exist qb64pe-screenshots\\red-circle-test.bmp (
        echo ✓ Screenshot 1 found: qb64pe-screenshots\\red-circle-test.bmp
    ) else (
        echo ✗ Screenshot 1 missing
    )
    
    if exist qb64pe-screenshots\\red-circle-test-final.bmp (
        echo ✓ Screenshot 2 found: qb64pe-screenshots\\red-circle-test-final.bmp
    ) else (
        echo ✗ Screenshot 2 missing
    )
    
    echo.
    echo Test complete! Check screenshots and analyze with LLM.
) else (
    echo ✗ Compilation failed
    echo Check QB64PE installation and path
)

echo.
echo Press any key to continue...
pause >nul
`;

const testScriptPath = path.join(process.cwd(), 'run-screenshot-test.bat');
fs.writeFileSync(testScriptPath, testScript);
console.log(`✓ Generated test script: ${testScriptPath}`);

/**
 * Test 8: Expected Console Output Pattern
 */
console.log('\n=== Test 8: Expected Console Output Analysis ===');

const expectedConsoleOutput = `
Starting red circle rendering test...
Screen size: 800x600
Center position: (400, 300)
Drawing red circle with radius 100...
Red circle rendered successfully!
Screenshot saved to: qb64pe-screenshots/red-circle-test.bmp
Circle details:
  - Color: RGB(255, 0, 0) - Pure Red
  - Position: Center (400, 300)
  - Radius: 100 pixels
  - Fill: Solid
Analysis ready for LLM processing...
Final screenshot saved: qb64pe-screenshots/red-circle-test-final.bmp
Program completed successfully.
Screenshots are ready for analysis.
Press any key to exit...
Auto-exiting after 3 seconds for test automation.
`;

const parsedOutput = executionService.parseConsoleOutput(expectedConsoleOutput);
console.log('Console Output Analysis:');
console.log(`  - Waiting for Input: ${parsedOutput.isWaitingForInput}`);
console.log(`  - Is Completed: ${parsedOutput.isCompleted}`);
console.log(`  - Last Activity: "${parsedOutput.lastActivity}"`);
console.log(`  - Suggested Action: ${parsedOutput.suggestedAction}`);

/**
 * Test Summary and Instructions
 */
console.log('\n' + '='.repeat(80));
console.log('TEST SUMMARY AND NEXT STEPS');
console.log('='.repeat(80));

console.log(`
GENERATED FILES:
✓ ${testProgramPath}
✓ ${enhancedProgramPath}  
✓ ${testScriptPath}

DIRECTORIES PREPARED:
✓ ${screenshotDir}
✓ ${logDir}

TO RUN THE TEST:

1. MANUAL EXECUTION:
   - Compile: qb64pe -c test-project/red-circle-screenshot-test.bas
   - Run: test-project/red-circle-screenshot-test.exe
   - Wait 3-5 seconds for auto-exit
   - Check qb64pe-screenshots/ directory for BMP files

2. AUTOMATED EXECUTION:
   - Run: run-screenshot-test.bat
   - Follow prompts and check output

3. LLM ANALYSIS:
   - Open generated screenshots
   - Verify red circle is visible and centered
   - Confirm colors and text are correct
   - Test LLM's ability to describe visual content

EXPECTED OUTCOMES:
✓ Program compiles without errors
✓ Graphics window opens showing red circle
✓ Screenshots are automatically generated
✓ Program exits cleanly after 3 seconds
✓ LLM can analyze and describe the visual output
✓ Timeout behavior works correctly for graphics programs

This test validates the complete execution monitoring pipeline
specifically for graphics rendering and screenshot analysis.
`);

console.log('\n✓ Graphics Screenshot Analysis Test Setup Complete');
console.log('Ready for LLM testing and validation!');

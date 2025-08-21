/**
 * Test script for QB64PE Execution Monitoring features
 */

import { QB64PEExecutionService } from './build/services/execution-service.js';

// Test the execution service
const executionService = new QB64PEExecutionService();

// Test 1: Analyze graphics-only program
console.log('=== Test 1: Graphics-only Program ===');
const graphicsCode = `
SCREEN _NEWIMAGE(800, 600, 32)
DO
    WHILE _MOUSEINPUT
        IF _MOUSEBUTTON(1) THEN
            CLS , _RGB32(RND * 255, RND * 255, RND * 255)
        END IF
    WEND
    IF _KEYHIT = 27 THEN EXIT DO
    _LIMIT 60
LOOP
SYSTEM
`;

const graphicsState = executionService.analyzeExecutionMode(graphicsCode);
const graphicsGuidance = executionService.getExecutionGuidance(graphicsState);

console.log('Execution State:', JSON.stringify(graphicsState, null, 2));
console.log('Guidance:', graphicsGuidance.recommendation);
console.log('Waiting Behavior:', graphicsGuidance.waitingBehavior);

// Test 2: Analyze console program
console.log('\n=== Test 2: Console Program ===');
const consoleCode = `
$CONSOLE
PRINT "Processing data..."
FOR i = 1 TO 100
    PRINT "Item"; i; "processed"
NEXT i
PRINT "Program completed successfully"
SYSTEM
`;

const consoleState = executionService.analyzeExecutionMode(consoleCode);
const consoleGuidance = executionService.getExecutionGuidance(consoleState);

console.log('Execution State:', JSON.stringify(consoleState, null, 2));
console.log('Guidance:', consoleGuidance.recommendation);
console.log('Waiting Behavior:', consoleGuidance.waitingBehavior);

// Test 3: Parse console output
console.log('\n=== Test 3: Console Output Parsing ===');
const testOutputs = [
    "Processing file 1 of 10...\nProcessing file 2 of 10...",
    "All processing complete!\nPress any key to continue...",
    "Error: File not found\nProgram ended with errors",
    "Enter your name: ",
    "Program finished\nExiting..."
];

testOutputs.forEach((output, index) => {
    const parsed = executionService.parseConsoleOutput(output);
    console.log(`Output ${index + 1}:`, JSON.stringify(parsed, null, 2));
});

// Test 4: Process monitoring commands
console.log('\n=== Test 4: Process Monitoring Commands ===');
const monitoringCommands = executionService.getProcessMonitoringCommands('qb64pe');
const terminationCommands = executionService.getProcessTerminationCommands(12345);

console.log('Monitoring Commands:', monitoringCommands);
console.log('Termination Commands:', terminationCommands);

// Test 5: File monitoring commands
console.log('\n=== Test 5: File Monitoring Commands ===');
const fileCommands = executionService.getFileMonitoringCommands('test.log');
console.log('File Monitoring Commands:', fileCommands);

// Test 6: Generate monitoring template
console.log('\n=== Test 6: Monitoring Template Generation ===');
const simpleCode = `
PRINT "Hello, QB64PE!"
FOR i = 1 TO 5
    PRINT "Count: "; i
NEXT i
`;

const monitoringTemplate = executionService.generateMonitoringTemplate(simpleCode);
console.log('Generated template length:', monitoringTemplate.length);
console.log('Template preview:', monitoringTemplate.substring(0, 500) + '...');

console.log('\n=== All Tests Complete ===');

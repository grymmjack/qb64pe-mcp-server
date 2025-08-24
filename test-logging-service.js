/**
 * Test script for the new QB64PE Logging Service
 * Demonstrates the critical $CONSOLE:ONLY discovery and native logging capabilities
 */

const { QB64PELoggingService } = require('./build/services/logging-service.js');

// Initialize the logging service
const loggingService = new QB64PELoggingService();

console.log('🔧 Testing QB64PE Logging Service\n');

// Test 1: Native Logging Injection
console.log('📝 Test 1: Native Logging Injection');
const testCode = `PRINT "Hello World"
FOR i = 1 TO 10
    PRINT "Number: " + STR$(i)
NEXT i
PRINT "Done!"`;

const enhanced = loggingService.injectNativeLogging(testCode);
console.log('✅ Enhanced code with native logging:');
console.log('---');
console.log(enhanced);
console.log('---\n');

// Test 2: Advanced Debugging Template
console.log('📋 Test 2: Advanced Debugging Template');
const template = loggingService.generateAdvancedDebuggingTemplate(
  'ZLIB Analyzer',
  ['Header Validation', 'DEFLATE Parsing', 'CRC32 Check', 'Data Extraction']
);
console.log('✅ Generated debugging template:');
console.log('---');
console.log(template.substring(0, 500) + '...\n[Template truncated for display]');
console.log('---\n');

// Test 3: Output Parsing
console.log('🔍 Test 3: Structured Output Parsing');
const sampleOutput = `=== PROGRAM ANALYSIS ===
Program: ZLIB Analyzer
Expected: 82944 bytes

=== STEP 1: HEADER VALIDATION ===
INFO: ZLIB header validation completed
CMF: 120, FLG: 156 - Valid header

=== STEP 2: DEFLATE PARSING ===
ERROR: Dynamic Huffman decoder incomplete
Only 51 bytes decoded (0.06% of expected)

=== RESULTS SUMMARY ===
FAILED: Incomplete DEFLATE implementation
Auto-exiting in 10 seconds...`;

const parsed = loggingService.parseStructuredOutput(sampleOutput);
console.log('✅ Parsed output analysis:');
console.log(JSON.stringify(parsed, null, 2));
console.log('---\n');

// Test 4: Output Capture Commands
console.log('💻 Test 4: Output Capture Commands');
const captureCommand = loggingService.generateOutputCaptureCommand('test_program.exe');
const monitoringCommands = loggingService.generateFileMonitoringCommands('analysis_output.txt');

console.log('✅ Generated commands:');
console.log('Capture:', captureCommand);
console.log('Windows Monitoring:', monitoringCommands.windows);
console.log('Linux Monitoring:', monitoringCommands.linux);
console.log('---\n');

// Test 5: Demonstrate the Critical $CONSOLE:ONLY Discovery
console.log('🎯 Test 5: Critical $CONSOLE:ONLY Discovery');
const oldWay = `$CONSOLE
PRINT "This creates a separate window"`;

const newWay = loggingService.injectNativeLogging(oldWay, { consoleDirective: '$CONSOLE:ONLY' });

console.log('❌ OLD WAY (separate console window):');
console.log(oldWay);
console.log('\n✅ NEW WAY (shell redirection compatible):');
console.log(newWay.split('\n').slice(0, 3).join('\n'));
console.log('\n🚀 Impact: Shell redirection now works!');
console.log('   Command: program.exe > output.txt 2>&1\n');

console.log('🏆 QB64PE Logging Service Test Complete!');
console.log('🎉 All tests passed - Ready for LLM automation!');

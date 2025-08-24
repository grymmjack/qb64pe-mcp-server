/**
 * Test script for the new ECHO functionality in QB64PE Logging Service
 * Demonstrates simplified console output without _DEST management
 */

const { QB64PELoggingService } = require('./build/services/logging-service.js');

// Initialize the logging service
const loggingService = new QB64PELoggingService();

console.log('🔧 Testing QB64PE ECHO Functionality\n');

// Test 1: Generate ECHO Functions
console.log('📝 Test 1: Generate ECHO Functions');
const echoFunctions = loggingService.generateEchoFunctions();
console.log('✅ Generated ECHO helper functions:');
console.log('---');
console.log(echoFunctions);
console.log('---\n');

// Test 2: Inject ECHO with Native Logging
console.log('📋 Test 2: Enhanced Code with ECHO and Native Logging');
const testCode = `PRINT "Hello World"
FOR i = 1 TO 10
    PRINT "Number: " + STR$(i)
NEXT i`;

const enhanced = loggingService.injectNativeLogging(testCode, { enableEchoOutput: true });
console.log('✅ Enhanced code with ECHO functions:');
console.log('---');
console.log(enhanced.split('\n').slice(0, 20).join('\n') + '\n...');
console.log('---\n');

// Test 3: ECHO-only (no native logging)
console.log('📟 Test 3: ECHO Functions Only (No Native Logging)');
const echoOnly = loggingService.injectNativeLogging(testCode, { 
    enableEchoOutput: true, 
    enableNativeLogging: false 
});
console.log('✅ ECHO-only enhanced code:');
console.log('---');
console.log(echoOnly.split('\n').slice(0, 15).join('\n') + '\n...');
console.log('---\n');

// Test 4: Advanced Template with ECHO
console.log('🎯 Test 4: Advanced Template with ECHO Functions');
const template = loggingService.generateAdvancedDebuggingTemplate(
  'ECHO Test Program',
  ['Console Output Test', 'ECHO Functionality Test'],
  { enableEchoOutput: true }
);

console.log('✅ Generated template with ECHO:');
console.log('---');
console.log(template.split('\n').slice(0, 25).join('\n') + '\n...');
console.log('---\n');

// Test 5: Structured Output with ECHO
console.log('📊 Test 5: Structured Output with ECHO');
const structuredOutput = loggingService.generateStructuredOutput(
  ['ECHO Test Section', 'Output Verification'],
  true,
  { enableEchoOutput: true }
);

console.log('✅ Structured output using ECHO:');
console.log('---');
console.log(structuredOutput);
console.log('---\n');

console.log('🎉 ECHO Functionality Test Complete!');
console.log('✨ LLMs can now use ECHO functions for simplified console output!');
console.log('📝 Benefits:');
console.log('   - No _DEST management required');
console.log('   - Automatic console output handling');
console.log('   - Integrated with native logging when enabled');
console.log('   - Clean, simple API for LLM-generated code');

#!/usr/bin/env node
/**
 * Test script for graphics detection using dynamic keyword lookup
 */

import { QB64PEExecutionService } from '../src/services/execution-service';

const service = new QB64PEExecutionService();

// Test cases
const testCases = [
  {
    name: 'Graphics program with SCREEN',
    code: 'SCREEN 12\nPRINT "Hello"',
    expectedGraphics: true
  },
  {
    name: 'Graphics program with _NEWIMAGE',
    code: 'handle& = _NEWIMAGE(640, 480, 32)\nSCREEN handle&',
    expectedGraphics: true
  },
  {
    name: 'Graphics program with _PRINTSTRING',
    code: '_PRINTSTRING (100, 100), "Hello"',
    expectedGraphics: true
  },
  {
    name: 'Graphics program with _MAPTRIANGLE',
    code: '_MAPTRIANGLE (0, 0)-(100, 100)-(50, 150), image&',
    expectedGraphics: true
  },
  {
    name: 'Console-only program',
    code: '$CONSOLE:ONLY\nPRINT "Hello World"',
    expectedGraphics: false
  },
  {
    name: 'Console with no graphics',
    code: 'DIM x AS INTEGER\nx = 5\nPRINT x',
    expectedGraphics: false
  },
  {
    name: 'Graphics with COLOR',
    code: 'COLOR 15, 1\nPRINT "Colored text"',
    expectedGraphics: true
  },
  {
    name: 'Graphics with CIRCLE',
    code: 'CIRCLE (100, 100), 50, 14',
    expectedGraphics: true
  },
  {
    name: 'Graphics with LINE',
    code: 'LINE (0, 0)-(100, 100), 12',
    expectedGraphics: true
  },
  {
    name: 'Advanced graphics with _SETALPHA',
    code: '_SETALPHA 128, , image&',
    expectedGraphics: true
  }
];

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║       Graphics Detection Test Suite                      ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

for (const test of testCases) {
  const result = service.analyzeExecutionMode(test.code);
  const detected = result.hasGraphics;
  const success = detected === test.expectedGraphics;
  
  if (success) {
    console.log(`✅ PASS: ${test.name}`);
    console.log(`   Expected graphics: ${test.expectedGraphics}, Detected: ${detected}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${test.name}`);
    console.log(`   Expected graphics: ${test.expectedGraphics}, Detected: ${detected}`);
    console.log(`   Code: ${test.code.substring(0, 50)}...`);
    failed++;
  }
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════════\n');

if (failed > 0) {
  console.log('❌ Some tests failed!');
  process.exit(1);
} else {
  console.log('✅ All tests passed!');
  process.exit(0);
}

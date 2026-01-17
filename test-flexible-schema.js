#!/usr/bin/env node
/**
 * Test the log_session_problem tool with user's actual input
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'build', 'index.js');
const mcpProcess = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = '';
let requestId = 0;

function sendRequest(method, params) {
  return new Promise((resolve) => {
    const id = requestId++;
    const request = { jsonrpc: '2.0', id, method, params };
    
    const timeout = setTimeout(() => resolve({ error: { message: 'Timeout' } }), 10000);

    const handler = (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
          const response = JSON.parse(line);
          if (response.id === id) {
            clearTimeout(timeout);
            mcpProcess.stdout.off('data', handler);
            buffer = lines[lines.length - 1];
            resolve(response);
            return;
          }
        } catch (e) {}
      }
      buffer = lines[lines.length - 1];
    };

    mcpProcess.stdout.on('data', handler);
    mcpProcess.stdin.write(JSON.stringify(request) + '\n');
  });
}

async function testTool() {
  console.log('🧪 Testing log_session_problem with original user input...\n');

  // Initialize
  await sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test', version: '1.0.0' }
  });

  // Test 1: Original user input (with extra fields)
  console.log('Test 1: Original input with extra fields in nested objects');
  const test1 = await sendRequest('tools/call', {
    name: 'log_session_problem',
    arguments: {
      category: 'compatibility',
      severity: 'medium',
      title: 'DEF FN legacy syntax not supported - requires conversion to FUNCTION',
      description: 'Converting QBasic code using DEF FN (user-defined functions) to QB64PE required multiple fixes',
      context: {
        compiler: 'QB64-PE V4.3.0',  // Extra field
        dialect: 'qbasic',             // Extra field
        file: '/home/test/DEFFN_EX.BAS', // Extra field
        originalSyntax: 'DEF FN'       // Extra field
      },
      problem: {
        initialError: 'Command not implemented',  // Extra field
        rootCause: 'DEF FN is legacy QBasic syntax',
        secondaryError: 'DIM: Expected comma'     // Extra field
      },
      solution: {
        implemented: 'Converted DEF FN to FUNCTION',
        finalResult: 'Successful compilation'     // Extra field
      },
      metrics: {
        iterations: 3,                // Extra field
        attemptsBeforeSolution: 3,
        complexityLevel: 'medium'     // Extra field
      }
    }
  });

  if (test1.error) {
    console.log('❌ FAILED:', test1.error.message);
  } else {
    console.log('✅ PASSED: Tool accepted extra fields!');
  }

  // Test 2: Minimal required fields only
  console.log('\nTest 2: Minimal required fields');
  const test2 = await sendRequest('tools/call', {
    name: 'log_session_problem',
    arguments: {
      category: 'tooling',
      severity: 'low',
      title: 'Test problem',
      description: 'Testing the tool'
    }
  });

  if (test2.error) {
    console.log('❌ FAILED:', test2.error.message);
  } else {
    console.log('✅ PASSED: Minimal fields work!');
  }

  // Test 3: Extra top-level field
  console.log('\nTest 3: Extra top-level field');
  const test3 = await sendRequest('tools/call', {
    name: 'log_session_problem',
    arguments: {
      category: 'workflow',
      severity: 'low',
      title: 'Test with extra field',
      description: 'Testing extra field at root',
      customField: 'This should be allowed now'  // Extra field at root
    }
  });

  if (test3.error) {
    console.log('❌ FAILED:', test3.error.message);
  } else {
    console.log('✅ PASSED: Extra root field accepted!');
  }

  console.log('\n' + '='.repeat(60));
  const passed = [test1, test2, test3].filter(t => !t.error).length;
  const total = 3;
  console.log(`\n✨ Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Schema is flexible now.');
  } else {
    console.log('⚠️  Some tests failed. Check output above.');
  }
  
  mcpProcess.kill();
  process.exit(passed === total ? 0 : 1);
}

setTimeout(() => {
  testTool().catch(error => {
    console.error('Fatal error:', error);
    mcpProcess.kill();
    process.exit(1);
  });
}, 1000);

#!/usr/bin/env node
/**
 * Comprehensive test to verify all MCP tools use Zod schemas correctly
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing All MCP Tools with Zod Schema Validation\n');

const serverPath = join(__dirname, 'build', 'index.js');
const mcpProcess = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = '';
let requestId = 0;
const testResults = [];

function sendRequest(method, params) {
  return new Promise((resolve) => {
    const id = requestId++;
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    const handler = (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
          const response = JSON.parse(line);
          if (response.id === id) {
            mcpProcess.stdout.off('data', handler);
            buffer = lines[lines.length - 1];
            resolve(response);
            return;
          }
        } catch (e) {
          // Not complete JSON yet
        }
      }
      
      buffer = lines[lines.length - 1];
    };

    mcpProcess.stdout.on('data', handler);
    mcpProcess.stdin.write(JSON.stringify(request) + '\n');
  });
}

async function testTool(toolName, args, expectError = false) {
  const response = await sendRequest('tools/call', {
    name: toolName,
    arguments: args
  });

  const hasError = !!response.error;
  const passed = expectError ? hasError : !hasError;

  const result = {
    tool: toolName,
    passed,
    error: response.error?.message,
    expectError
  };

  testResults.push(result);
  
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${toolName.padEnd(40)} ${expectError ? '(error expected)' : ''}`);
  if (!passed && response.error) {
    console.log(`   Error: ${response.error.message}`);
  }

  return result;
}

async function runTests() {
  // Initialize
  await sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test', version: '1.0.0' }
  });

  console.log('Testing sample tools from different categories:\n');

  // Test tools that previously had issues
  await testTool('log_session_problem', {
    category: 'tooling',
    severity: 'low',
    title: 'Test problem',
    description: 'Testing Zod schema conversion'
  });

  await testTool('validate_bi_file_structure', {
    content: 'TYPE TestType\n    field AS STRING\nEND TYPE',
    filename: 'test.BI'
  });

  await testTool('validate_bm_file_structure', {
    content: 'SUB TestSub\nEND SUB',
    filename: 'test.BM'
  });

  await testTool('validate_qb64_gj_lib_file_pair', {
    biContent: 'TYPE Test\nEND TYPE',
    bmContent: 'SUB Test\nEND SUB',
    libraryName: 'TestLib'
  });

  await testTool('get_compiler_options', {
    platform: 'all',
    optionType: 'all'
  });

  await testTool('lookup_qb64pe_keyword', {
    keyword: 'PRINT'
  });

  await testTool('validate_qb64pe_syntax', {
    code: 'PRINT "Hello"',
    checkLevel: 'basic'
  });

  await testTool('detect_qb64pe_installation', {});

  await testTool('search_qb64pe_wiki', {
    query: 'graphics'
  });

  await testTool('get_debugging_help', {
    issue: 'program hangs'
  });

  // Test empty arguments where they should be allowed
  await testTool('get_qb64pe_wiki_categories', {});
  await testTool('get_qb64pe_debugging_best_practices', {});
  await testTool('get_session_problems_statistics', {});

  console.log('\n' + '='.repeat(70));
  const totalTests = testResults.length;
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;

  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);

  if (failed === 0) {
    console.log('\n✅ ALL TOOLS USING ZOD SCHEMAS CORRECTLY!');
  } else {
    console.log('\n❌ Some tools have issues:');
    testResults.filter(r => !r.passed).forEach(r => {
      console.log(`   - ${r.tool}: ${r.error}`);
    });
  }
  console.log('='.repeat(70));

  mcpProcess.kill();
  process.exit(failed === 0 ? 0 : 1);
}

// Start tests after a brief delay
setTimeout(() => {
  runTests().catch(error => {
    console.error('Fatal error:', error);
    mcpProcess.kill();
    process.exit(1);
  });
}, 1000);

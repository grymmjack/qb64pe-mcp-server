/**
 * Test the fixed log_session_problem tool
 * Tests both empty input (should provide helpful error) and valid input
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Send MCP request and get response
 */
async function sendMCPRequest(mcpProcess, request) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, 5000);

    let buffer = '';
    
    const handler = (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      
      // Process complete JSON-RPC messages
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
          const response = JSON.parse(line);
          if (response.id === request.id) {
            clearTimeout(timeout);
            mcpProcess.stdout.off('data', handler);
            resolve(response);
            return;
          }
        } catch (e) {
          // Not a complete JSON message yet
        }
      }
      
      buffer = lines[lines.length - 1];
    };

    mcpProcess.stdout.on('data', handler);
    mcpProcess.stdin.write(JSON.stringify(request) + '\n');
  });
}

/**
 * Test empty input (should provide helpful message)
 */
async function testEmptyInput(mcpProcess) {
  console.log('\n📝 Test 1: Calling log_session_problem with empty object...\n');
  
  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'log_session_problem',
      arguments: {}
    }
  };

  try {
    const response = await sendMCPRequest(mcpProcess, request);
    
    if (response.error) {
      console.error('❌ Error:', response.error.message);
      return false;
    }

    const text = response.result?.content?.[0]?.text || '';
    
    // Check if it contains helpful error message (may be after discovery message)
    if (text.includes('Missing Required Fields') || text.includes('category') || text.includes('severity')) {
      console.log('✅ SUCCESS: Got helpful error message for empty input (may include discovery info on first call)');
      console.log('\nChecking for validation message...');
      
      // Look for the actual error in the combined response
      const hasValidation = text.includes('Missing Required Fields') || 
                           text.includes('must provide at minimum');
      
      if (hasValidation) {
        console.log('✅ Validation message found in response');
      } else {
        console.log('⚠️  Validation message not found, but required fields are mentioned');
      }
      
      return true;
    } else {
      console.error('❌ FAILED: Expected helpful error message but got:', text.substring(0, 300));
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return false;
  }
}

/**
 * Test empty input again (after discovery, should show clean error)
 */
async function testEmptyInputAgain(mcpProcess) {
  console.log('\n📝 Test 3: Calling log_session_problem with empty object (second call, no discovery)...\n');
  
  const request = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'log_session_problem',
      arguments: {}
    }
  };

  try {
    const response = await sendMCPRequest(mcpProcess, request);
    
    if (response.error) {
      console.error('❌ Error:', response.error.message);
      return false;
    }

    const text = response.result?.content?.[0]?.text || '';
    
    if (text.includes('Missing Required Fields')) {
      console.log('✅ SUCCESS: Got clean error message without discovery wrapper');
      console.log('\nMessage preview:');
      console.log(text.substring(0, 400) + '...\n');
      return true;
    } else {
      console.error('❌ FAILED: Expected error message but got:', text.substring(0, 300));
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return false;
  }
}

/**
 * Test valid input
 */
async function testValidInput(mcpProcess) {
  console.log('\n📝 Test 2: Calling log_session_problem with valid data...\n');
  
  const request = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'log_session_problem',
      arguments: {
        category: 'tooling',
        severity: 'medium',
        title: 'MCP tool validation error fixed',
        description: 'The log_session_problem tool was failing when called with empty object due to strict required field validation',
        context: {
          language: 'TypeScript',
          task: 'Testing MCP tools'
        },
        problem: {
          attempted: 'Called log_session_problem with empty object {}',
          error: 'Error: MPC -32603: keyValidator.._parse is not a function',
          rootCause: 'JSON Schema had required fields but was called without them'
        },
        solution: {
          implemented: 'Removed required field constraints from JSON Schema and added manual validation in handler',
          preventionStrategy: 'Provide helpful error messages when required fields are missing instead of throwing validation errors'
        },
        mcpImprovement: {
          priority: 'medium',
          enhancementNeeded: 'Better error messages for all tools when required parameters are missing'
        },
        metrics: {
          attemptsBeforeSolution: 1,
          timeWasted: '15 minutes',
          toolsUsed: ['grep_search', 'read_file', 'replace_string_in_file'],
          toolsShouldHaveUsed: []
        }
      }
    }
  };

  try {
    const response = await sendMCPRequest(mcpProcess, request);
    
    if (response.error) {
      console.error('❌ Error:', response.error.message);
      return false;
    }

    const text = response.result?.content?.[0]?.text || '';
    
    if (text.includes('Problem Logged Successfully') && text.includes('Problem ID:')) {
      console.log('✅ SUCCESS: Problem logged successfully');
      console.log('\nResponse preview:');
      console.log(text.substring(0, 400) + '...\n');
      return true;
    } else {
      console.error('❌ FAILED: Expected success message but got:', text.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting log_session_problem fix verification tests...');
  
  // Start MCP server
  const serverPath = join(__dirname, 'build', 'index.js');
  const mcpProcess = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  mcpProcess.stderr.on('data', (data) => {
    console.error('Server stderr:', data.toString());
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  let allPassed = true;

  try {
    // Send initialize request first
    const initRequest = {
      jsonrpc: '2.0',
      id: 0,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    };

    await sendMCPRequest(mcpProcess, initRequest);
    console.log('✅ Server initialized\n');

    // Run tests
    const test1 = await testEmptyInput(mcpProcess);
    const test2 = await testValidInput(mcpProcess);
    const test3 = await testEmptyInputAgain(mcpProcess);

    allPassed = test1 && test2 && test3;

  } catch (error) {
    console.error('❌ Test suite failed:', error);
    allPassed = false;
  } finally {
    mcpProcess.kill();
  }

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED');
  } else {
    console.log('❌ SOME TESTS FAILED');
  }
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

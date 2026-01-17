#!/usr/bin/env node

/**
 * Quick manual test of the log_session_problem tool
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Quick Test: log_session_problem tool\n');

const serverPath = join(__dirname, 'build', 'index.js');
const mcpProcess = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = '';
let requestId = 0;

mcpProcess.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const response = JSON.parse(line);
      console.log('\n📥 Response:', JSON.stringify(response, null, 2), '\n');
    } catch (e) {
      // Incomplete JSON
    }
  }
  
  buffer = lines[lines.length - 1];
});

// Initialize
setTimeout(() => {
  console.log('1️⃣  Initializing server...');
  mcpProcess.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: requestId++,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test', version: '1.0.0' }
    }
  }) + '\n');
}, 500);

// Test with empty object
setTimeout(() => {
  console.log('2️⃣  Testing with empty object {}...');
  mcpProcess.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/call',
    params: {
      name: 'log_session_problem',
      arguments: {}
    }
  }) + '\n');
}, 1500);

// Test with partial data
setTimeout(() => {
  console.log('3️⃣  Testing with partial data (missing required fields)...');
  mcpProcess.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/call',
    params: {
      name: 'log_session_problem',
      arguments: {
        category: 'syntax',
        title: 'Test problem'
        // Missing severity and description
      }
    }
  }) + '\n');
}, 2500);

// Test with complete data
setTimeout(() => {
  console.log('4️⃣  Testing with complete valid data...');
  mcpProcess.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/call',
    params: {
      name: 'log_session_problem',
      arguments: {
        category: 'tooling',
        severity: 'low',
        title: 'Quick test problem',
        description: 'Testing the fixed tool',
        context: { language: 'TypeScript' }
      }
    }
  }) + '\n');
}, 3500);

// Clean exit
setTimeout(() => {
  console.log('\n✅ Test complete!');
  mcpProcess.kill();
  process.exit(0);
}, 5000);

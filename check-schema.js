#!/usr/bin/env node
/**
 * Check the actual MCP schema for log_session_problem
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
    
    const timeout = setTimeout(() => resolve(null), 5000);

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

async function checkSchema() {
  // Initialize
  await sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'schema-check', version: '1.0.0' }
  });

  // Get tools list
  const listResponse = await sendRequest('tools/list', {});
  
  if (!listResponse || !listResponse.result) {
    console.error('No response from tools/list');
    mcpProcess.kill();
    process.exit(1);
  }
  
  const logTool = listResponse.result.tools.find(t => t.name === 'log_session_problem');
  
  console.log('\n=== log_session_problem Tool Info ===\n');
  console.log('Tool Name:', logTool.name);
  console.log('Title:', logTool.title);
  console.log('\n=== Input Schema ===\n');
  console.log(JSON.stringify(logTool.inputSchema, null, 2));
  
  mcpProcess.kill();
  process.exit(0);
}

setTimeout(() => {
  checkSchema().catch(error => {
    console.error('Error:', error);
    mcpProcess.kill();
    process.exit(1);
  });
}, 1000);

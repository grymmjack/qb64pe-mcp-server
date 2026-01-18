#!/usr/bin/env node
/**
 * Show the ACTUAL schema Claude Desktop would see
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Checking ACTUAL schema that Claude Desktop sees...\n');

const serverPath = join(__dirname, '..', '..', 'build', 'index.js');
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

async function showSchema() {
  await sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'schema-viewer', version: '1.0.0' }
  });

  const listResponse = await sendRequest('tools/list', {});
  
  if (!listResponse || !listResponse.result) {
    console.log('❌ Could not get tools list');
    mcpProcess.kill();
    process.exit(1);
  }
  
  const tool = listResponse.result.tools.find(t => t.name === 'log_session_problem');
  
  if (!tool) {
    console.log('❌ Tool not found');
    mcpProcess.kill();
    process.exit(1);
  }

  console.log('Tool Name:', tool.name);
  console.log('Description:', tool.description);
  console.log('\n📋 Schema Properties:\n');
  
  // Check if context/problem/solution/etc are flexible
  const props = tool.inputSchema.properties;
  
  ['context', 'problem', 'solution', 'mcpImprovement', 'metrics'].forEach(field => {
    if (props[field]) {
      const schema = props[field];
      const isFlexible = !schema.properties && (schema.additionalProperties === true || schema.type === 'object');
      const icon = isFlexible ? '✅' : '❌';
      console.log(`${icon} ${field}: ${isFlexible ? 'FLEXIBLE (accepts any fields)' : 'STRICT (defined fields only)'}`);
      
      if (schema.additionalProperties !== undefined) {
        console.log(`   additionalProperties: ${schema.additionalProperties}`);
      }
      if (schema.type) {
        console.log(`   type: ${schema.type}`);
      }
    }
  });

  console.log('\n📄 Full context schema:');
  console.log(JSON.stringify(props.context, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Schema Status:');
  
  const allFlexible = ['context', 'problem', 'solution', 'mcpImprovement', 'metrics'].every(field => {
    const schema = props[field];
    return !schema.properties && (schema.additionalProperties === true || schema.type === 'object');
  });
  
  if (allFlexible) {
    console.log('✅ ALL nested objects are FLEXIBLE');
    console.log('✅ Schema will accept any fields in nested objects');
    console.log('\n🔄 If Claude is still rejecting, RESTART Claude Desktop to reload schema!');
  } else {
    console.log('❌ Some objects are still STRICT');
    console.log('⚠️  Need to rebuild or check source files');
  }
  
  mcpProcess.kill();
  process.exit(0);
}

setTimeout(() => {
  showSchema().catch(error => {
    console.error('Fatal error:', error);
    mcpProcess.kill();
    process.exit(1);
  });
}, 1000);

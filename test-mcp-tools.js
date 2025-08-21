// Test MCP Server Tools
const fs = require('fs');

// Simple test to verify tool availability
const testInput = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list"
};

console.log('Testing MCP Server tool availability...\n');
console.log('Input:', JSON.stringify(testInput, null, 2));

// Test with echo and pipe to server
const { spawn } = require('child_process');

const server = spawn('node', ['build/index.js'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    cwd: process.cwd()
});

// Send the request
server.stdin.write(JSON.stringify(testInput) + '\n');
server.stdin.end();

// Collect output
let output = '';
server.stdout.on('data', (data) => {
    output += data.toString();
});

server.on('close', (code) => {
    console.log('\nServer output:');
    try {
        const lines = output.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        if (lastLine.startsWith('{')) {
            const response = JSON.parse(lastLine);
            
            if (response.result && response.result.tools) {
                const portingTools = response.result.tools.filter(tool => 
                    tool.name.includes('port_') || 
                    tool.name.includes('porting') || 
                    tool.name.includes('qbasic')
                );
                
                console.log('\nPorting tools found:');
                portingTools.forEach(tool => {
                    console.log(`- ${tool.name}: ${tool.description}`);
                });
                
                console.log(`\nTotal tools available: ${response.result.tools.length}`);
                console.log(`Porting-related tools: ${portingTools.length}`);
                
                if (portingTools.length > 0) {
                    console.log('\n✅ Porting tools successfully integrated!');
                } else {
                    console.log('\n❌ No porting tools found.');
                }
            }
        } else {
            console.log('Raw output:', output);
        }
    } catch (error) {
        console.error('Error parsing output:', error);
        console.log('Raw output:', output);
    }
});

#!/usr/bin/env node

/**
 * Script to update all tool registration files to use registerToolWithDiscovery
 */

const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../src/tools');
const toolFiles = [
  { file: 'keyword-tools.ts', category: 'keywords' },
  { file: 'compiler-tools.ts', category: 'compiler' },
  { file: 'compatibility-tools.ts', category: 'compatibility' },
  { file: 'execution-tools.ts', category: 'execution' },
  { file: 'installation-tools.ts', category: 'installation' },
  { file: 'porting-tools.ts', category: 'porting' },
  { file: 'graphics-tools.ts', category: 'graphics' },
  { file: 'debugging-tools.ts', category: 'debugging' },
  { file: 'feedback-tools.ts', category: 'feedback' },
];

console.log('Updating tool registration files...\n');

for (const { file, category } of toolFiles) {
  const filePath = path.join(toolsDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} - file not found`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already updated
  if (content.includes('registerToolWithDiscovery')) {
    console.log(`✓ ${file} - already updated`);
    continue;
  }
  
  // Add registerToolWithDiscovery to imports
  if (content.includes('} from "../utils/mcp-helpers.js";')) {
    content = content.replace(
      /import \{([^}]+)\} from "\.\.\/utils\/mcp-helpers\.js";/,
      (match, imports) => {
        if (!imports.includes('registerToolWithDiscovery')) {
          const trimmedImports = imports.trim();
          return `import {${trimmedImports},\n  registerToolWithDiscovery,\n} from "../utils/mcp-helpers.js";`;
        }
        return match;
      }
    );
  }
  
  // Replace server.registerTool with registerToolWithDiscovery
  // This regex finds server.registerTool calls and adds the category parameter
  content = content.replace(
    /server\.registerTool\(\s*\n\s*"([^"]+)",/g,
    `registerToolWithDiscovery(\n    server,\n    "$1",`
  );
  
  // Add category parameter before closing the function call
  // Find all registerToolWithDiscovery calls and add category if missing
  const lines = content.split('\n');
  const updatedLines = [];
  let inRegisterCall = false;
  let bracketCount = 0;
  let parenCount = 0;
  let registerCallStart = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('registerToolWithDiscovery(')) {
      inRegisterCall = true;
      registerCallStart = i;
      bracketCount = 0;
      parenCount = 1; // Start with 1 for the opening paren
    }
    
    if (inRegisterCall) {
      // Count parentheses and brackets
      for (const char of line) {
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (char === '{') bracketCount++;
        if (char === '}') bracketCount--;
      }
      
      // Check if this is the closing line of the registerToolWithDiscovery call
      if (parenCount === 0 && bracketCount === 0) {
        // Check if category parameter is already there
        if (!line.includes(`"${category}"`)) {
          // Add category before the closing parenthesis
          const modifiedLine = line.replace(/\);$/, `,\n    "${category}"\n  );`);
          updatedLines.push(modifiedLine);
        } else {
          updatedLines.push(line);
        }
        inRegisterCall = false;
      } else {
        updatedLines.push(line);
      }
    } else {
      updatedLines.push(line);
    }
  }
  
  content = updatedLines.join('\n');
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${file} - updated successfully`);
}

console.log('\n✅ All tool files have been updated!');

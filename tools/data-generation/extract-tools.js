const fs = require('fs');

const content = fs.readFileSync('src/index.ts', 'utf8');
const lines = content.split('\n');

const tools = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('registerTool(') && i + 1 < lines.length) {
    const nextLine = lines[i + 1];
    const match = nextLine.match(/["']([^"']+)["']/);
    if (match) {
      tools.push(match[1]);
    }
  }
}

console.log(tools.sort().join('\n'));

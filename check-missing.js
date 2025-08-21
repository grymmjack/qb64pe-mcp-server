const { KeywordsService } = require('./build/services/keywords-service.js');
const fs = require('fs');
const path = require('path');

const service = new KeywordsService();

// Load original keywords
const originalPath = path.join(__dirname, 'docs/resources/QB64PE_Keywords.json');
const originalData = JSON.parse(fs.readFileSync(originalPath, 'utf-8'));
const originalKeywords = originalData.keywords;

const enhancedKeywords = service.getAllKeywords();

console.log(`Original keywords: ${Object.keys(originalKeywords).length}`);
console.log(`Enhanced keywords: ${Object.keys(enhancedKeywords).length}`);

// Find missing keywords
const missing = [];
for (const originalName of Object.keys(originalKeywords)) {
  // Try multiple variations of the name
  const variations = [
    originalName, // Original with suffixes
    originalName.replace(' (function)', '').replace(' (statement)', '').replace(' (boolean)', ''), // Clean name
    originalName.replace(' (function)', '').replace(' (statement)', '') // Keep (boolean)
  ];
  
  let found = false;
  for (const variation of variations) {
    if (enhancedKeywords[variation]) {
      found = true;
      break;
    }
  }
  
  if (!found) {
    missing.push(originalName);
  }
}

console.log(`\nMissing keywords (${missing.length}):`);
missing.forEach(name => {
  console.log(`- ${name}: ${originalKeywords[name].substring(0, 80)}...`);
});

// Find duplicates or issues
console.log('\nSample of successfully processed keywords:');
const processed = Object.keys(enhancedKeywords).slice(0, 20);
processed.forEach(name => {
  const keyword = enhancedKeywords[name];
  console.log(`${name} (${keyword.type}) - ${keyword.version}`);
});

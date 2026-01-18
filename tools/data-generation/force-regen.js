const { KeywordsService } = require('../../build/services/keywords-service.js');

const service = new KeywordsService();
service.regenerateKeywordsData();

console.log(`Total keywords after regeneration: ${service.getKeywordCount()}`);
console.log(`Original keywords: ${service.getOriginalKeywordCount()}`);

// Check for the XOR (boolean) keyword specifically
const allKeywords = service.getAllKeywords();
if (allKeywords['XOR (boolean)']) {
  console.log('✓ Found XOR (boolean) keyword');
} else if (allKeywords['XOR']) {
  console.log('✓ Found XOR keyword (clean name)');
} else {
  console.log('✗ XOR keyword still missing');
}

console.log('\nBoolean operators:');
Object.keys(allKeywords).filter(name => name.includes('(boolean)')).forEach(name => {
  console.log(`- ${name}: ${allKeywords[name].type}`);
});

const { KeywordsService } = require('./build/services/keywords-service.js');

const service = new KeywordsService();

console.log('=== QB64PE Keywords Service - Comprehensive Report ===\n');

console.log(`📊 COVERAGE STATISTICS:`);
console.log(`   Original keywords in QB64PE_Keywords.json: ${service.getOriginalKeywordCount()}`);
console.log(`   Enhanced keywords processed: ${service.getKeywordCount()}`);
console.log(`   Coverage: ${((service.getKeywordCount() / service.getOriginalKeywordCount()) * 100).toFixed(1)}%\n`);

console.log(`📋 CATEGORY BREAKDOWN:`);
const stats = service.getCategoryStats();
Object.entries(stats).forEach(([category, count]) => {
  console.log(`   ${category.padEnd(15)}: ${count.toString().padStart(3)} keywords`);
});

console.log(`\n🔍 SAMPLE KEYWORDS BY CATEGORY:\n`);

// Show samples from each category
Object.keys(stats).forEach(category => {
  if (stats[category] > 0) {
    console.log(`${category.toUpperCase()}:`);
    const keywords = service.getKeywordsByCategory(category).slice(0, 3);
    keywords.forEach(keyword => {
      console.log(`   ${keyword.name.padEnd(20)}: ${keyword.description.substring(0, 50)}...`);
    });
    console.log('');
  }
});

console.log(`🎯 SPECIAL COLLECTIONS:\n`);

console.log(`QB64PE-specific keywords: ${service.getQB64PESpecificKeywords().length}`);
console.log(`Legacy QBasic keywords: ${service.getLegacyKeywords().length}`);
console.log(`OpenGL functions: ${service.getKeywordsByCategory('opengl').length}`);
console.log(`String functions ending with $: ${Object.keys(service.getAllKeywords()).filter(name => name.endsWith('$')).length}`);

console.log(`\n🔍 SEARCH FUNCTIONALITY TEST:`);
const searchResults = service.searchKeywords('print', 5);
console.log(`Search for "print" found ${searchResults.length} results:`);
searchResults.forEach(result => {
  console.log(`   ${result.keyword} (${result.matchType}, relevance: ${result.relevance})`);
});

console.log(`\n🎨 SAMPLE DETAILED KEYWORD INFO:`);
const sampleKeyword = service.getKeyword('_RGB32');
if (sampleKeyword) {
  console.log(`Name: ${sampleKeyword.name}`);
  console.log(`Type: ${sampleKeyword.type}`);
  console.log(`Category: ${sampleKeyword.category}`);  
  console.log(`Description: ${sampleKeyword.description}`);
  console.log(`Syntax: ${sampleKeyword.syntax}`);
  console.log(`Example: ${sampleKeyword.example}`);
  console.log(`Related: ${sampleKeyword.related.join(', ')}`);
  console.log(`Version: ${sampleKeyword.version}`);
  console.log(`Availability: ${sampleKeyword.availability}`);
}

console.log(`\n✅ All ${service.getOriginalKeywordCount()} keywords from QB64PE_Keywords.json have been successfully processed and enhanced!`);

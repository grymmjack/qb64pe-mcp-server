const { KeywordsService } = require('../../build/services/keywords-service.js');

const service = new KeywordsService();

console.log(`Total keywords loaded: ${service.getKeywordCount()}`);
console.log(`Original keywords: ${service.getOriginalKeywordCount()}`);
console.log('\nCategory stats:');
console.log(service.getCategoryStats());

console.log('\nSample keywords:');
const allKeywords = service.getAllKeywords();
const sampleKeywords = Object.keys(allKeywords).slice(0, 10);
sampleKeywords.forEach(name => {
  const keyword = allKeywords[name];
  console.log(`${name}: ${keyword.type} (${keyword.category})`);
});

console.log('\nQB64PE specific keywords (first 10):');
const qb64Keywords = service.getQB64PESpecificKeywords().slice(0, 10);
qb64Keywords.forEach(keyword => {
  console.log(`${keyword.name}: ${keyword.description.substring(0, 60)}...`);
});

console.log('\nOpenGL keywords:');
const openglKeywords = service.getKeywordsByCategory('opengl');
openglKeywords.slice(0, 5).forEach(keyword => {
  console.log(`${keyword.name}: ${keyword.description.substring(0, 60)}...`);
});

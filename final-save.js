const { KeywordsService } = require('./build/services/keywords-service.js');

const service = new KeywordsService();
service.regenerateKeywordsData();

console.log(`✅ Enhanced keywords data regenerated and saved!`);
console.log(`📊 Total keywords: ${service.getKeywordCount()} out of ${service.getOriginalKeywordCount()}`);
console.log(`📈 Coverage: ${((service.getKeywordCount() / service.getOriginalKeywordCount()) * 100).toFixed(1)}%`);

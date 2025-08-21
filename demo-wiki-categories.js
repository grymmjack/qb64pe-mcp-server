#!/usr/bin/env node

/**
 * Demo script to showcase the new wiki category search functionality
 */

const { KeywordsService } = require('./build/services/keywords-service.js');

async function demonstrateWikiCategories() {
  console.log('🎯 QB64PE Wiki Categories Demo');
  console.log('================================\n');

  const keywordsService = new KeywordsService();

  // 1. Show all available wiki categories
  console.log('📋 Available Wiki Categories:');
  const wikiCategories = keywordsService.getWikiCategories();
  const categoryCounts = keywordsService.getWikiCategoryCounts();
  
  Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a) // Sort by keyword count descending
    .slice(0, 10) // Show top 10 categories
    .forEach(([category, count]) => {
      console.log(`  • ${category}: ${count} keywords`);
    });

  console.log(`\n📊 Total: ${Object.keys(wikiCategories).length} categories, ${Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)} total keywords\n`);

  // 2. Demonstrate category-specific searches
  console.log('🔍 Demo: Searching "Colors and Transparency" category');
  const colorKeywords = keywordsService.getKeywordsByWikiCategory('Colors and Transparency');
  console.log(`Found ${colorKeywords.length} keywords in this category:`);
  colorKeywords.slice(0, 10).forEach(keyword => {
    const info = keywordsService.getKeyword(keyword);
    const typeLabel = info ? `[${info.type}]` : '[unknown]';
    console.log(`  • ${keyword} ${typeLabel}`);
  });
  
  console.log('\n🔍 Demo: Searching "Mathematical Functions and Operations" category');
  const mathKeywords = keywordsService.getKeywordsByWikiCategory('Mathematical Functions and Operations');
  console.log(`Found ${mathKeywords.length} keywords in this category:`);
  mathKeywords.slice(0, 8).forEach(keyword => {
    const info = keywordsService.getKeyword(keyword);
    const typeLabel = info ? `[${info.type}]` : '[unknown]';
    console.log(`  • ${keyword} ${typeLabel}`);
  });

  console.log('\n🔍 Demo: Searching "Sounds and Music" category');
  const soundKeywords = keywordsService.getKeywordsByWikiCategory('Sounds and Music');
  console.log(`Found ${soundKeywords.length} keywords in this category:`);
  soundKeywords.slice(0, 8).forEach(keyword => {
    const info = keywordsService.getKeyword(keyword);
    const typeLabel = info ? `[${info.type}]` : '[unknown]';
    console.log(`  • ${keyword} ${typeLabel}`);
  });

  console.log('\n🔍 Demo: Searching "Program Flow and Loops" category');
  const flowKeywords = keywordsService.getKeywordsByWikiCategory('Program Flow and Loops');
  console.log(`Found ${flowKeywords.length} keywords in this category:`);
  flowKeywords.slice(0, 8).forEach(keyword => {
    const info = keywordsService.getKeyword(keyword);
    const typeLabel = info ? `[${info.type}]` : '[unknown]';
    console.log(`  • ${keyword} ${typeLabel}`);
  });

  // 3. Show some interesting category statistics
  console.log('\n📈 Category Statistics:');
  const topCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  console.log('  Top 5 largest categories:');
  topCategories.forEach(([category, count], index) => {
    console.log(`    ${index + 1}. ${category}: ${count} keywords`);
  });

  // 4. Show examples of different keyword types in categories
  console.log('\n🏷️  Keyword Type Examples by Category:');
  
  const exampleCategories = [
    'Mathematical Functions and Operations',
    'File Input and Output',
    'Graphics and Imaging:',
    'String Text Manipulation and Conversion'
  ];

  exampleCategories.forEach(category => {
    const keywords = keywordsService.getKeywordsByWikiCategory(category);
    const typeCounts = {};
    keywords.forEach(keyword => {
      const info = keywordsService.getKeyword(keyword);
      if (info) {
        typeCounts[info.type] = (typeCounts[info.type] || 0) + 1;
      }
    });
    
    console.log(`  ${category}:`);
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`    - ${type}: ${count}`);
    });
  });

  console.log('\n✨ New MCP Tools Available:');
  console.log('  • search_qb64pe_keywords_by_wiki_category');
  console.log('  • get_qb64pe_wiki_categories');
  console.log('  • Enhanced search_qb64pe_keywords');
  
  console.log('\n🎉 Wiki category search integration complete!');
}

// Run the demo
demonstrateWikiCategories().catch(console.error);

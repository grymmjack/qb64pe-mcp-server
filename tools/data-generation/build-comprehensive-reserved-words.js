#!/usr/bin/env node
/**
 * Extract ALL keywords from MCP tools and build comprehensive reserved words list
 * This script uses the MCP server's own tools to self-improve the syntax validator
 */

async function buildReservedWordsList() {
  console.log('🔍 Querying QB64PE MCP server for comprehensive keyword data...\n');
  
  // Import the MCP tools
  const { KeywordsService } = require('../../build/services/keywords-service.js');
  const keywordsService = new KeywordsService();
  
  // Get ALL keywords (returns Record<string, KeywordInfo>)
  const allKeywordsObj = keywordsService.getAllKeywords();
  const allKeywords = Object.keys(allKeywordsObj);
  
  console.log(`📊 Found ${allKeywords.length} total keywords in QB64PE\n`);
  
  // Organize by category
  const categories = {
    statements: [],
    functions: [],
    metacommands: [],
    operators: [],
    types: [],
    constants: [],
    keywords: [],
    opengl: [],
    legacy: []
  };
  
  // Sort into categories
  for (const keyword of allKeywords) {
    const info = allKeywordsObj[keyword];
    if (info && info.category) {
      // Use the category field directly
      const cat = info.category.toLowerCase();
      if (categories[cat]) {
        categories[cat].push(keyword);
      } else {
        // Default to keywords
        categories.keywords.push(keyword);
      }
    } else {
      // No category - add to keywords
      categories.keywords.push(keyword);
    }
  }
  
  console.log('📋 Category breakdown:');
  for (const [cat, words] of Object.entries(categories)) {
    if (words.length > 0) {
      console.log(`  ${cat.padEnd(15)}: ${words.length.toString().padStart(4)} keywords`);
    }
  }
  console.log('');
  
  // Identify reserved words (those that can conflict with variable names)
  const reservedWords = new Set();
  
  // Add statements that are common conflict sources
  for (const keyword of categories.statements) {
    const upper = keyword.toUpperCase();
    // Add common graphics/function keywords that users might try as variables
    if (['POS', 'SCREEN', 'PALETTE', 'POINT', 'CSRLIN', 'STEP', 
         'WIDTH', 'HEIGHT', 'COLOR', 'INPUT', 'OUTPUT', 'TIMER',
         'DATE', 'TIME', 'DATA', 'ERROR', 'LINE', 'CIRCLE', 
         'LOCATE', 'VIEW', 'WINDOW', 'END', 'STOP', 'RETURN'].includes(upper)) {
      reservedWords.add(upper);
    }
  }
  
  // Add ALL functions (they are the most common conflicts)
  for (const keyword of categories.functions) {
    reservedWords.add(keyword.toUpperCase());
  }
  
  // Add data types
  for (const keyword of categories.types) {
    reservedWords.add(keyword.toUpperCase());
  }
  
  // Add constants
  for (const keyword of categories.constants) {
    reservedWords.add(keyword.toUpperCase());
  }
  
  // Add operators
  for (const keyword of categories.operators) {
    reservedWords.add(keyword.toUpperCase());
  }
  
  // Sort reserved words and clean up problematic characters
  const sortedReserved = Array.from(reservedWords)
    .filter(w => {
      // Filter out keywords with ANY problematic characters that would break TypeScript
      const cleanWord = w.trim();
      const isValid = cleanWord.length > 0 && 
             cleanWord.length <= 30 && // Reasonable length limit
             !cleanWord.includes(' ') && // No spaces
             !cleanWord.includes("'") && // No single quotes
             !cleanWord.includes('"') && // No double quotes
             !cleanWord.includes('`') && // No backticks
             !cleanWord.includes('(') && // No parentheses
             !cleanWord.includes(')') && // No parentheses
             !cleanWord.includes('[') && // No brackets
             !cleanWord.includes(']') && // No brackets
             !cleanWord.includes('{') && // No braces
             !cleanWord.includes('}') && // No braces
             !cleanWord.includes('|') && // No pipes
             !cleanWord.includes('\\') && // No backslashes
             !cleanWord.includes('+') && // No plus
             !cleanWord.includes('-') && // No minus
             !cleanWord.includes('*') && // No asterisk
             !cleanWord.includes('/') && // No slash
             !cleanWord.includes('=') && // No equals
             !cleanWord.includes('<') && // No less than
             !cleanWord.includes('>') && // No greater than
             !cleanWord.includes('!') && // No exclamation
             !cleanWord.includes('@') && // No at
             !cleanWord.includes('#') && // No hash
             !cleanWord.includes('$') && // No dollar (except at end for strings)
             !cleanWord.includes('%') && // No percent (except at end for integers)
             !cleanWord.includes('^') && // No caret
             !cleanWord.includes('&') && // No ampersand (except at end for longs)
             !cleanWord.includes('~') && // No tilde
             !cleanWord.includes(':') && // No colon
             !cleanWord.includes(';') && // No semicolon
             !cleanWord.includes(',') && // No comma
             !cleanWord.includes('.') && // No period
             !cleanWord.includes('?') && // No question mark
             /^[A-Z0-9_$%&!#]+$/.test(cleanWord); // Only valid QB64PE identifier characters
      
      // Debug: log filtered words
      if (!isValid) {
        console.log(`❌ Filtering out: "${cleanWord}" (contains invalid chars)`);
      }
      
      return isValid;
    })
    .sort();
  
  console.log(`⚠️  Identified ${sortedReserved.length} reserved words that should not be used as variable names\n`);
  
  // Debug: show first 10 and last 10 reserved words
  console.log('🔍 First 10 reserved words:', sortedReserved.slice(0, 10));
  console.log('🔍 Last 10 reserved words:', sortedReserved.slice(-10));
  console.log('');
  
  // Generate TypeScript code
  const tsCode = `// ============================================================================
// COMPREHENSIVE QB64PE RESERVED WORDS LIST
// ============================================================================
// Auto-generated from QB64PE MCP Server keyword database
// Generated: ${new Date().toISOString()}
// Total Keywords: ${allKeywords.length}
// Reserved Words: ${sortedReserved.length}
//
// This list includes ALL QB64PE keywords that could conflict with variable names
// ============================================================================

export const QB64PE_RESERVED_WORDS: ReadonlySet<string> = new Set([
${sortedReserved.map(w => `  '${w}'`).join(',\n')}
]);

export const QB64PE_ALL_KEYWORDS: ReadonlySet<string> = new Set([
${allKeywords
  .filter(k => {
    const upper = k.toUpperCase();
    // Filter out keywords that would break TypeScript syntax
    return !upper.includes("'") && !upper.includes('"') && !upper.includes('(') && !upper.includes(')') && !upper.includes(' ');
  })
  .map(k => `  '${k.toUpperCase()}'`)
  .sort()
  .join(',\n')}
]);

// Category-specific keyword sets for advanced validation
export const QB64PE_KEYWORDS_BY_CATEGORY = {
  statements: new Set([
${categories.statements
  .filter(k => !k.includes("'") && !k.includes('"') && !k.includes('(') && !k.includes(')') && !k.includes(' '))
  .map(k => `    '${k.toUpperCase()}'`)
  .sort()
  .join(',\n')}
  ]),
  
  functions: new Set([
${categories.functions
  .filter(k => !k.includes("'") && !k.includes('"') && !k.includes('(') && !k.includes(')') && !k.includes(' '))
  .map(k => `    '${k.toUpperCase()}'`)
  .sort()
  .join(',\n')}
  ]),
  
  metacommands: new Set([
${categories.metacommands
  .filter(k => !k.includes("'") && !k.includes('"') && !k.includes('(') && !k.includes(')') && !k.includes(' '))
  .map(k => `    '${k.toUpperCase()}'`)
  .sort()
  .join(',\n')}
  ]),
  
  operators: new Set([
${categories.operators
  .filter(k => !k.includes("'") && !k.includes('"') && !k.includes('(') && !k.includes(')') && !k.includes(' '))
  .map(k => `    '${k.toUpperCase()}'`)
  .sort()
  .join(',\n')}
  ]),
  
  types: new Set([
${categories.types
  .filter(k => !k.includes("'") && !k.includes('"') && !k.includes('(') && !k.includes(')') && !k.includes(' '))
  .map(k => `    '${k.toUpperCase()}'`)
  .sort()
  .join(',\n')}
  ]),
  
  constants: new Set([
${categories.constants
  .filter(k => !k.includes("'") && !k.includes('"') && !k.includes('(') && !k.includes(')') && !k.includes(' '))
  .map(k => `    '${k.toUpperCase()}'`)
  .sort()
  .join(',\n')}
  ])
};

/**
 * Check if a word is a reserved keyword
 */
export function isReservedWord(word: string): boolean {
  return QB64PE_RESERVED_WORDS.has(word.toUpperCase());
}

/**
 * Check if a word is any QB64PE keyword
 */
export function isQB64Keyword(word: string): boolean {
  return QB64PE_ALL_KEYWORDS.has(word.toUpperCase());
}

/**
 * Get suggested alternative names for a reserved word
 */
export function getReservedWordAlternatives(word: string): string[] {
  const base = word.toLowerCase();
  return [
    \`\${base}_var\`,
    \`\${base}_value\`,
    \`my_\${base}\`,
    \`\${base}1\`,
    \`user_\${base}\`
  ];
}
`;
  
  // Write to file
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, 'src', 'constants', 'reserved-words.ts');
  
  // Create directory if it doesn't exist
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, tsCode);
  
  console.log(`✅ Generated comprehensive reserved words list:`);
  console.log(`   ${outputPath}`);
  console.log(`   ${sortedReserved.length} reserved words`);
  console.log(`   ${allKeywords.length} total keywords\n`);
  
  // Show some examples
  console.log('📝 Sample reserved words to avoid:');
  const samples = sortedReserved.slice(0, 20);
  console.log('   ' + samples.join(', '));
  console.log(`   ... and ${sortedReserved.length - 20} more\n`);
  
  console.log('🎯 Usage in syntax-service.ts:');
  console.log('   import { QB64PE_RESERVED_WORDS, isReservedWord } from \'../constants/reserved-words\';');
  console.log('   if (isReservedWord(varName)) { /* warn user */ }\n');
  
  return {
    reservedWords: sortedReserved,
    allKeywords: allKeywords,
    categories: categories
  };
}

// Run if called directly
if (require.main === module) {
  buildReservedWordsList()
    .then(() => {
      console.log('✨ Reserved words list generation complete!\n');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error generating reserved words list:', err);
      process.exit(1);
    });
}

module.exports = { buildReservedWordsList };

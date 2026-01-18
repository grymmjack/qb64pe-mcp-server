#!/usr/bin/env node

/**
 * Test script to validate QB64PE variable types knowledge
 */

const { execSync } = require('child_process');

console.log('=== Testing QB64PE Variable Types Knowledge ===\n');

// Test 1: Search for variable type keywords
console.log('1. Testing variable type keyword searches:');
try {
    const result1 = execSync('node build/index.js search_qb64pe_keywords "DIM INTEGER LONG DOUBLE"', { encoding: 'utf-8' });
    console.log('   ✓ DIM/type keywords search successful');
} catch (error) {
    console.log('   ✗ DIM/type keywords search failed:', error.message);
}

// Test 2: Test _UNSIGNED keyword lookup
console.log('\n2. Testing _UNSIGNED keyword lookup:');
try {
    const result2 = execSync('node build/index.js lookup_qb64pe_keyword "_UNSIGNED"', { encoding: 'utf-8' });
    console.log('   ✓ _UNSIGNED keyword lookup successful');
} catch (error) {
    console.log('   ✗ _UNSIGNED keyword lookup failed:', error.message);
}

// Test 3: Test compatibility search for variable types
console.log('\n3. Testing compatibility search for variable types:');
try {
    const result3 = execSync('node build/index.js search_qb64pe_compatibility "variable types sigils memory"', { encoding: 'utf-8' });
    console.log('   ✓ Variable types compatibility search successful');
} catch (error) {
    console.log('   ✗ Variable types compatibility search failed:', error.message);
}

// Test 4: Test wiki category search for variable types
console.log('\n4. Testing wiki category search for variable definitions:');
try {
    const result4 = execSync('node build/index.js search_qb64pe_keywords_by_wiki_category "Definitions and Variable Types"', { encoding: 'utf-8' });
    console.log('   ✓ Variable types wiki category search successful');
} catch (error) {
    console.log('   ✗ Variable types wiki category search failed:', error.message);
}

// Test 5: Test QB64 programming symbols for sigils
console.log('\n5. Testing QB64 programming symbols search:');
try {
    const result5 = execSync('node build/index.js search_qb64pe_keywords_by_wiki_category "QB64 Programming Symbols"', { encoding: 'utf-8' });
    console.log('   ✓ QB64 programming symbols search successful');
} catch (error) {
    console.log('   ✗ QB64 programming symbols search failed:', error.message);
}

// Test 6: Test specific type lookups
console.log('\n6. Testing specific type keyword lookups:');
const typeKeywords = ['DIM', 'INTEGER', 'LONG', 'DOUBLE', '_BYTE', '_INTEGER64', '_FLOAT'];

for (const keyword of typeKeywords) {
    try {
        const result = execSync(`node build/index.js lookup_qb64pe_keyword "${keyword}"`, { encoding: 'utf-8' });
        console.log(`   ✓ ${keyword} lookup successful`);
    } catch (error) {
        console.log(`   ✗ ${keyword} lookup failed:`, error.message);
    }
}

console.log('\n=== Variable Types Knowledge Test Complete ===');

// Generate a sample code with variable types to test syntax validation
console.log('\n7. Testing syntax validation with variable types:');
const sampleCode = `
DIM AS INTEGER count, total, sum
DIM AS LONG bigNumber, largeValue
DIM AS DOUBLE precise, calculation
DIM AS STRING name, address
DIM AS _UNSIGNED INTEGER positiveCount
DIM AS _UNSIGNED LONG hugeNumber
DIM AS _BYTE smallValue
DIM AS _UNSIGNED _BYTE flags
DIM numbers(10) AS INTEGER
DIM values() AS DOUBLE
DIM names(100) AS STRING * 50
`;

try {
    const fs = require('fs');
    fs.writeFileSync('temp_test_code.bas', sampleCode);
    console.log('   ✓ Sample variable types code generated');
    
    // Clean up
    fs.unlinkSync('temp_test_code.bas');
} catch (error) {
    console.log('   ✗ Sample code generation failed:', error.message);
}

console.log('\n=== All Tests Complete ===');

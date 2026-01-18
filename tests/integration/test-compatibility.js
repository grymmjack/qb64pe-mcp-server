#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import the built services
const { QB64PECompatibilityService } = require('../../build/services/compatibility-service.js');

async function testCompatibilityRules() {
  console.log('Testing QB64PE Compatibility Rules...\n');
  
  try {
    // Create compatibility service
    const compatibilityService = new QB64PECompatibilityService();
    
    // Read our test file
    const testFilePath = path.join(__dirname, '../fixtures/bas-files/source-order-test.bas');
    const testContent = fs.readFileSync(testFilePath, 'utf8');
    
    console.log('Test file content:');
    console.log('==================');
    console.log(testContent);
    console.log('\n==================\n');
    
    // Debug: check what rules were loaded
    console.log('Loaded compatibility rules:');
    console.log('==========================');
    const rules = compatibilityService.compatibilityRules || [];
    rules.forEach((rule, index) => {
      console.log(`${index + 1}. ${rule.category}: ${rule.pattern.source}`);
    });
    console.log('\n');
    
    // Debug: test simpler patterns
    console.log('Testing simpler patterns:');
    console.log('=========================');
    
    // Test for TYPE keyword after PRINT (simpler pattern)
    const simpleTypePattern = /PRINT.*[\s\S]*TYPE\s+\w+/gi;
    const simpleTypeMatches = testContent.match(simpleTypePattern);
    console.log('Simple TYPE after PRINT pattern matches:', simpleTypeMatches);
    
    // Test for CONST keyword after PRINT (simpler pattern)
    const simpleConstPattern = /PRINT.*[\s\S]*CONST\s+\w+/gi;
    const simpleConstMatches = testContent.match(simpleConstPattern);
    console.log('Simple CONST after PRINT pattern matches:', simpleConstMatches);
    
    // Test individual parts
    const printExists = /PRINT/.test(testContent);
    const typeExists = /TYPE\s+\w+/.test(testContent);
    const constExists = /CONST\s+\w+/.test(testContent);
    console.log('PRINT exists:', printExists);
    console.log('TYPE exists:', typeExists);
    console.log('CONST exists:', constExists);
    console.log('\n');
    
    // Analyze compatibility
    const issues = await compatibilityService.validateCompatibility(testContent);
    
    console.log('Compatibility Analysis Results:');
    console.log('===============================');
    console.log(JSON.stringify({ issues }, null, 2));
    
    // Check if our new source organization rules detected issues
    const sourceOrderIssues = issues.filter(issue => 
      issue.message.includes('TYPE definition') || 
      issue.message.includes('CONST declaration') ||
      issue.message.includes('after main program code')
    );
    
    if (sourceOrderIssues.length > 0) {
      console.log('\n✅ Source organization rules working correctly!');
      console.log('Detected issues:');
      sourceOrderIssues.forEach(issue => {
        console.log(`  - ${issue.message}`);
      });
    } else {
      console.log('\n❌ Source organization rules may need adjustment');
    }
    
  } catch (error) {
    console.error('Error during compatibility testing:', error);
    process.exit(1);
  }
}

testCompatibilityRules();

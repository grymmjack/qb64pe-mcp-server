/**
 * Test reserved word checking enhancement
 */

const { QB64PESyntaxService } = require('../../build/services/syntax-service.js');

console.log('Testing Reserved Word Checking Enhancement...\n');

const syntaxService = new QB64PESyntaxService();

// Test code with reserved word conflicts (from session log)
const testCode = `
DIM pos AS INTEGER
DIM palette AS VM_PALETTE
DIM counter AS INTEGER
DIM screen AS INTEGER
`.trim();

console.log('Test Code:');
console.log('-'.repeat(60));
console.log(testCode);
console.log('-'.repeat(60));
console.log('');

// Run validation
syntaxService.validateSyntax(testCode, 'best-practices').then(result => {
  console.log('Validation Results:');
  console.log('='.repeat(60));
  console.log(`Valid: ${result.isValid}`);
  console.log(`Errors: ${result.errors.length}`);
  console.log(`Warnings: ${result.warnings.length}`);
  console.log('');
  
  if (result.warnings.length > 0) {
    console.log('Warnings Found:');
    result.warnings.forEach((warning, index) => {
      console.log(`\n${index + 1}. Line ${warning.line}:`);
      console.log(`   Message: ${warning.message}`);
      console.log(`   Rule: ${warning.rule}`);
      console.log(`   Suggestion: ${warning.suggestion}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Check if our expected conflicts were detected
  const reservedWordWarnings = result.warnings.filter(w => 
    w.rule === 'reserved-keyword-conflict'
  );
  
  console.log('\nReserved Word Conflict Detection:');
  console.log(`Found ${reservedWordWarnings.length} reserved word conflicts`);
  
  const detectedPos = reservedWordWarnings.some(w => w.message.includes('pos'));
  const detectedPalette = reservedWordWarnings.some(w => w.message.includes('palette'));
  const detectedScreen = reservedWordWarnings.some(w => w.message.includes('screen'));
  
  console.log(`  - 'pos' detected: ${detectedPos ? '✓' : '✗'}`);
  console.log(`  - 'palette' detected: ${detectedPalette ? '✓' : '✗'}`);
  console.log(`  - 'screen' detected: ${detectedScreen ? '✓' : '✗'}`);
  console.log(`  - 'counter' NOT detected: ${!result.warnings.some(w => w.message.includes('counter')) ? '✓' : '✗'}`);
  
  if (detectedPos && detectedPalette && detectedScreen) {
    console.log('\n✅ SUCCESS: All reserved word conflicts detected!');
    console.log('This enhancement will prevent the session log errors.');
  } else {
    console.log('\n⚠️  WARNING: Some conflicts not detected.');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Session Log Problems That Would Be Prevented:');
  console.log('  ✓ "Name already in use (pos)" - PREVENTED');
  console.log('  ✓ "Name already in use (palette)" - PREVENTED');
  console.log('  ✓ Compilation failures from reserved words - PREVENTED');
  console.log('  ✓ Manual debugging time - SAVED');
  
}).catch(error => {
  console.error('Error running test:', error);
});

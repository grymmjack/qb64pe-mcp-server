/**
 * Test enhanced DEF FN conversion based on logged session problem
 * Tests the fix for problem-1768681376591-e3ij0g
 */

const { QB64PEPortingService } = require('../../build/services/porting-service.js');

async function testDefFnConversion() {
  console.log('Testing enhanced DEF FN conversion...\n');
  
  const portingService = new QB64PEPortingService();
  
  // Test case 1: Single-line DEF FN with type suffix (from session log)
  const singleLineCode = `' Factorial function using DEF FN
DEF FNFACTORIAL#(n#)
  DIM result# AS DOUBLE
  result# = 1
  FOR i = 1 TO n#
    result# = result# * i
  NEXT i
  FNFACTORIAL# = result#
END DEF

' Main program
DIM num# AS DOUBLE
num# = 5
PRINT "Factorial of"; num#; "is"; FNFACTORIAL#(num#)
`;

  console.log('=== Test 1: Multi-line DEF FN with type suffixes ===');
  console.log('Original code:');
  console.log(singleLineCode);
  console.log('\n---\n');
  
  const result1 = await portingService.portQBasicToQB64PE(singleLineCode);
  
  console.log('Converted code:');
  console.log(result1.portedCode);
  console.log('\nTransformations applied:');
  result1.transformations.forEach(t => console.log(`  - ${t}`));
  console.log(`\nCompatibility: ${result1.compatibility}`);
  
  // Verify key transformations
  const tests1 = {
    'Removed FN prefix': !result1.portedCode.includes('FNFACTORIAL#'),
    'Created function': result1.portedCode.includes('Function FACTORIAL'),
    'Fixed DIM statement': !result1.portedCode.includes('result# AS DOUBLE'),
    'Type suffix converted': result1.portedCode.includes('AS DOUBLE')
  };
  
  console.log('\nVerifications:');
  Object.entries(tests1).forEach(([name, pass]) => {
    console.log(`  ${pass ? '✓' : '✗'} ${name}`);
  });
  
  // Test case 2: Simple single-line DEF FN
  console.log('\n\n=== Test 2: Simple single-line DEF FN ===');
  const simpleCode = `DEF FNDouble#(x#) = x# * 2
PRINT FNDouble#(5)`;
  
  console.log('Original code:');
  console.log(simpleCode);
  console.log('\n---\n');
  
  const result2 = await portingService.portQBasicToQB64PE(simpleCode);
  
  console.log('Converted code:');
  console.log(result2.portedCode);
  console.log('\nTransformations applied:');
  result2.transformations.forEach(t => console.log(`  - ${t}`));
  
  const tests2 = {
    'Function created': result2.portedCode.includes('Function Double'),
    'FN prefix removed from call': !result2.portedCode.includes('FNDouble'),
    'Type suffix handled': result2.portedCode.includes('AS DOUBLE')
  };
  
  console.log('\nVerifications:');
  Object.entries(tests2).forEach(([name, pass]) => {
    console.log(`  ${pass ? '✓' : '✗'} ${name}`);
  });
  
  // Test case 3: Multiple DEF FN statements
  console.log('\n\n=== Test 3: Multiple DEF FN statements ===');
  const multipleCode = `DEF FNSquare%(x%) = x% * x%
DEF FNCube&(x&) = x& * x& * x&
PRINT FNSquare%(4)
PRINT FNCube&(3)`;
  
  console.log('Original code:');
  console.log(multipleCode);
  console.log('\n---\n');
  
  const result3 = await portingService.portQBasicToQB64PE(multipleCode);
  
  console.log('Converted code:');
  console.log(result3.portedCode);
  console.log('\nTransformations applied:');
  result3.transformations.forEach(t => console.log(`  - ${t}`));
  
  const tests3 = {
    'Both functions created': result3.portedCode.includes('Function Square') && result3.portedCode.includes('Function Cube'),
    'Integer type handled': result3.portedCode.includes('AS INTEGER'),
    'Long type handled': result3.portedCode.includes('AS LONG'),
    'FN prefixes removed': !result3.portedCode.includes('FNSquare') && !result3.portedCode.includes('FNCube')
  };
  
  console.log('\nVerifications:');
  Object.entries(tests3).forEach(([name, pass]) => {
    console.log(`  ${pass ? '✓' : '✗'} ${name}`);
  });
  
  // Summary
  console.log('\n\n=== Summary ===');
  const allTests = { ...tests1, ...tests2, ...tests3 };
  const passed = Object.values(allTests).filter(v => v).length;
  const total = Object.values(allTests).length;
  
  console.log(`Tests passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('✓ All tests passed! The DEF FN enhancement is working correctly.');
    console.log('\nThis fix addresses session problem: problem-1768681376591-e3ij0g');
    console.log('- Converts multi-line DEF FN...END DEF blocks');
    console.log('- Handles type suffixes (#!@$%&) properly');
    console.log('- Fixes DIM statements mixing suffixes with AS declarations');
    console.log('- Removes FN prefix from function calls');
    return true;
  } else {
    console.log('✗ Some tests failed. Please review the implementation.');
    return false;
  }
}

testDefFnConversion().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});

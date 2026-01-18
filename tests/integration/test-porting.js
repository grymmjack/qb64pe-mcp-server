// Simple test for the porting functionality
const { QB64PEPortingService } = require('../../build/services/porting-service.js');

const portingService = new QB64PEPortingService();

const testCode = `DEFINT A-Z
DECLARE SUB Test
DEF FnRan(x) = INT(RND(1) * x) + 1
GOSUB InitVars
PRINT "Test"
END

InitVars:
PRINT "Init"
RETURN`;

async function testPorting() {
    try {
        console.log('Testing QBasic to QB64PE porting...\n');
        console.log('Original QBasic code:');
        console.log('='.repeat(50));
        console.log(testCode);
        console.log('='.repeat(50));
        
        const result = await portingService.portQBasicToQB64PE(testCode);
        
        console.log('\nPorting Results:');
        console.log('='.repeat(50));
        console.log('Compatibility Level:', result.compatibility);
        console.log('Transformations Applied:', result.transformations.length);
        console.log('Warnings:', result.warnings.length);
        console.log('Errors:', result.errors.length);
        
        console.log('\nTransformations:');
        result.transformations.forEach((t, i) => console.log(`${i + 1}. ${t}`));
        
        if (result.warnings.length > 0) {
            console.log('\nWarnings:');
            result.warnings.forEach((w, i) => console.log(`${i + 1}. ${w}`));
        }
        
        if (result.errors.length > 0) {
            console.log('\nErrors:');
            result.errors.forEach((e, i) => console.log(`${i + 1}. ${e}`));
        }
        
        console.log('\nPorted QB64PE code:');
        console.log('='.repeat(50));
        console.log(result.portedCode);
        console.log('='.repeat(50));
        
        console.log('\nSummary:', result.summary);
        
    } catch (error) {
        console.error('Error during porting:', error);
    }
}

testPorting();

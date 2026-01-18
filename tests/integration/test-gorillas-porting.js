// Test with the GORILLAS.BAS file
const { QB64PEPortingService } = require('../../build/services/porting-service.js');
const fs = require('fs');

const portingService = new QB64PEPortingService();

async function testGorillasPoreting() {
    try {
        console.log('Testing GORILLAS.BAS porting...\n');
        
        // Read the original QBasic GORILLAS.BAS
        const gorilasCode = fs.readFileSync('./porting-service-source-files/qbasic-original/GORILLAS.BAS', 'utf8');
        
        console.log('Original GORILLAS.BAS lines:', gorilasCode.split('\n').length);
        
        const result = await portingService.portQBasicToQB64PE(gorilasCode);
        
        console.log('\nPorting Results:');
        console.log('='.repeat(50));
        console.log('Compatibility Level:', result.compatibility);
        console.log('Transformations Applied:', result.transformations.length);
        console.log('Warnings:', result.warnings.length);
        console.log('Errors:', result.errors.length);
        console.log('Original lines:', result.originalCode.split('\n').length);
        console.log('Ported lines:', result.portedCode.split('\n').length);
        
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
        
        console.log('\nSummary:', result.summary);
        
        // Save the ported code for comparison
        fs.writeFileSync('./ported-gorillas-output.bas', result.portedCode);
        console.log('\nPorted code saved to: ported-gorillas-output.bas');
        
        // Compare with manually ported version
        const manualPort = fs.readFileSync('./porting-service-source-files/qb64pe-ported/GORILLAS.BAS', 'utf8');
        console.log('\nManual port lines:', manualPort.split('\n').length);
        
    } catch (error) {
        console.error('Error during porting:', error);
    }
}

testGorillasPoreting();

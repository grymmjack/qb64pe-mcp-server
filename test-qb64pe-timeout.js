/**
 * Test QB64PE Installation Service with Timeout Protection
 */

import { QB64PEInstallationService } from './build/services/installation-service.js';

console.log('='.repeat(60));
console.log('QB64PE INSTALLATION SERVICE TEST WITH TIMEOUTS');
console.log('Testing async operations with hang protection');
console.log('='.repeat(60));

async function runTest() {
    const startTime = Date.now();
    
    try {
        console.log('\n=== Test 1: Installation Service Creation ===');
        const installationService = new QB64PEInstallationService();
        console.log('✅ Installation service created successfully');
        
        console.log('\n=== Test 2: Basic Methods ===');
        const commonPaths = installationService.getCommonInstallPaths();
        console.log(`✅ Common paths retrieved: ${commonPaths.length} paths`);
        
        const config = installationService.getPathConfiguration();
        console.log(`✅ PATH configuration generated for platform: ${config.platform}`);
        
        console.log('\n=== Test 3: Path Validation (filesystem only) ===');
        const userPath = 'C:\\Users\\grymmjack\\git\\QB64pe';
        const validation = await installationService.validatePath(userPath);
        console.log(`✅ Path validation completed: ${validation.valid ? 'VALID' : 'INVALID'}`);
        if (validation.version) {
            console.log(`   Version: ${validation.version}`);
        }
        
        console.log('\n=== Test 4: Installation Detection (with timeouts) ===');
        console.log('⏱️  Starting installation detection...');
        
        const detection = await installationService.detectInstallation();
        
        console.log('✅ Installation detection completed!');
        console.log(`   Installed: ${detection.isInstalled}`);
        console.log(`   In PATH: ${detection.inPath}`);
        console.log(`   Platform: ${detection.platform}`);
        if (detection.installPath) {
            console.log(`   Path: ${detection.installPath}`);
        }
        if (detection.version) {
            console.log(`   Version: ${detection.version}`);
        }
        
        console.log('\n=== Test 5: LLM Guidance Generation ===');
        const guidance = installationService.generateInstallationGuidance(detection);
        console.log(`✅ Guidance generated: ${guidance.length} characters`);
        console.log('First 200 characters:');
        console.log(guidance.substring(0, 200) + '...');
        
        const elapsedTime = Date.now() - startTime;
        console.log(`\n⏱️  Total test time: ${elapsedTime}ms`);
        
        if (elapsedTime < 30000) {
            console.log('✅ Test completed within reasonable time (< 30s)');
        } else {
            console.log('⚠️  Test took longer than expected');
        }
        
        console.log('\n🎉 All tests passed successfully!');
        
    } catch (error) {
        const elapsedTime = Date.now() - startTime;
        console.error(`❌ Test failed after ${elapsedTime}ms:`, error.message);
        
        if (error.message.includes('timeout') || error.message.includes('timed out')) {
            console.log('🛡️  Timeout protection worked - prevented hanging!');
        }
        
        process.exit(1);
    }
}

// Add overall timeout protection
const testTimeout = setTimeout(() => {
    console.error('\n❌ Test suite timed out after 60 seconds');
    console.log('🛡️  Overall timeout protection activated');
    process.exit(1);
}, 60000);

runTest().then(() => {
    clearTimeout(testTimeout);
    console.log('\n✅ Test suite completed successfully');
    
    // Force exit to prevent hanging due to lingering timeouts
    setTimeout(() => {
        console.log('🔄 Forcing clean exit...');
        process.exit(0);
    }, 100);
    
}).catch((error) => {
    clearTimeout(testTimeout);
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
});

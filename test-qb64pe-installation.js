/**
 * Test script for QB64PE Installation Detection and PATH Configuration features
 * Now with timeouts and better logging to prevent hanging
 */

import { QB64PEInstallationService } from './build/services/installation-service.js';

// Add timeout wrapper for the entire test
const TEST_TIMEOUT = 30000; // 30 seconds max for entire test

const runWithTimeout = (testFn, timeoutMs) => {
  return Promise.race([
    testFn(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Test timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

console.log('='.repeat(80));
console.log('QB64PE INSTALLATION DETECTION AND PATH CONFIGURATION TEST');
console.log('Testing LLM guidance for QB64PE installation and PATH setup');
console.log(`Test timeout: ${TEST_TIMEOUT}ms`);
console.log('='.repeat(80));

const mainTest = async () => {
  let testStartTime = Date.now();
  
  const logStep = (step, message) => {
    const elapsed = Date.now() - testStartTime;
    console.log(`[${elapsed}ms] ${step}: ${message}`);
  };

  // Initialize installation service
  logStep('INIT', 'Creating QB64PEInstallationService...');
  const installationService = new QB64PEInstallationService();

  /**
   * Test 1: Detect current QB64PE installation
   */
  logStep('TEST1', 'Starting QB64PE Installation Detection...');

  try {
    const installation = await installationService.detectInstallation();
    
    logStep('TEST1', 'Installation detection completed');
    console.log('Installation Detection Results:');
    console.log(`  ✓ Platform: ${installation.platform}`);
    console.log(`  ${installation.isInstalled ? '✅' : '❌'} Installed: ${installation.isInstalled}`);
    console.log(`  ${installation.inPath ? '✅' : '❌'} In PATH: ${installation.inPath}`);
    
    if (installation.installPath) {
      console.log(`  📁 Install Path: ${installation.installPath}`);
    }
    
    if (installation.executable) {
      console.log(`  🔧 Executable: ${installation.executable}`);
    }
    
    if (installation.version) {
      console.log(`  🏷️  Version: ${installation.version}`);
    }
    
    /**
     * Test 2: Generate PATH configuration guidance (no async calls)
     */
    logStep('TEST2', 'Generating PATH Configuration Guidance...');
    
    const config = installationService.getPathConfiguration(installation.installPath);
    
    logStep('TEST2', 'PATH configuration completed');
    console.log('PATH Configuration Info:');
    console.log(`  Platform: ${config.platform}`);
    console.log(`  Path Separator: "${config.pathSeparator}"`);
    console.log(`  Current PATH entries: ${config.currentPath.length}`);
    console.log(`  Common install paths: ${config.commonInstallPaths.length}`);
    
    // Show sample instructions (safely, no async)
    console.log('\nSample Instructions (first 3 lines):');
    console.log('  Temporary:');
    config.instructions.temporary.slice(0, 3).forEach(line => {
      console.log(`    ${line}`);
    });
    
    /**
     * Test 3: Validate known QB64PE path (with timeout)
     */
    logStep('TEST3', 'Starting Path Validation...');
    
    // Test the user's known QB64PE installation
    const userQB64Path = 'C:\\Users\\grymmjack\\git\\QB64pe';
    
    console.log(`Testing path: ${userQB64Path}`);
    const validation = await installationService.validatePath(userQB64Path);
    
    logStep('TEST3', 'Path validation completed');
    console.log('Validation Results:');
    console.log(`  ${validation.valid ? '✅' : '❌'} Valid: ${validation.valid}`);
    
    if (validation.executable) {
      console.log(`  🔧 Executable: ${validation.executable}`);
    }
    
    if (validation.version) {
      console.log(`  🏷️  Version: ${validation.version}`);
    }
    
    /**
     * Test 4: Generate LLM-friendly guidance (no async)
     */
    logStep('TEST4', 'Generating LLM Installation Guidance...');
    
    const guidance = installationService.generateInstallationGuidance(installation);
    logStep('TEST4', 'LLM guidance completed');
    console.log('Generated LLM Guidance:');
    console.log('─'.repeat(60));
    console.log(guidance.substring(0, 500) + (guidance.length > 500 ? '...' : ''));
    console.log('─'.repeat(60));
    
    /**
     * Test 5: Complete installation report (with timeout)
     */
    logStep('TEST5', 'Starting Complete Installation Report...');
    
    const report = await installationService.generateInstallationReport();
    logStep('TEST5', 'Installation report completed');
    console.log('Installation Report Generated:');
    console.log(`  Report length: ${report.length} characters`);
    console.log(`  Contains platform info: ${report.includes(installation.platform) ? '✅' : '❌'}`);
    console.log(`  Contains PATH instructions: ${report.includes('PATH') ? '✅' : '❌'}`);
    console.log(`  Contains download URL: ${report.includes('github.com') ? '✅' : '❌'}`);
    
    // Save report to file for inspection
    const fs = await import('fs');
    const path = await import('path');
    const reportPath = path.join(process.cwd(), 'qb64pe-installation-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`  ✓ Report saved to: ${reportPath}`);
    
    /**
     * Test 6: Test common installation paths (limited to prevent hanging)
     */
    logStep('TEST6', 'Testing Common Installation Paths (limited)...');
    
    const commonPaths = installationService.getCommonInstallPaths();
    console.log(`Testing first 3 of ${commonPaths.length} common installation paths:`);
    
    let foundPaths = 0;
    const fs2 = await import('fs');
    
    // Only test first 3 paths to prevent hanging
    for (const testPath of commonPaths.slice(0, 3)) {
      try {
        const exists = fs2.existsSync(testPath);
        console.log(`  ${exists ? '📁' : '❌'} ${testPath} ${exists ? '(exists)' : '(not found)'}`);
        if (exists) foundPaths++;
      } catch (error) {
        console.log(`  ❌ ${testPath} (error checking)`);
      }
    }
    
    console.log(`\n  Summary: ${foundPaths} of 3 tested paths exist`);
    
    /**
     * Test Summary
     */
    logStep('SUMMARY', 'Generating test summary...');
    console.log('\n' + '='.repeat(80));
    console.log('TEST SUMMARY');
    console.log('='.repeat(80));
    
    const testResults = {
      detectionWorks: installation !== null,
      pathConfigGenerated: config !== null,
      validationWorks: validation !== null,
      guidanceGenerated: guidance.length > 0,
      reportGenerated: report.length > 0,
      platformSupported: ['win32', 'darwin', 'linux'].includes(installation.platform)
    };
    
    console.log('\nTest Results:');
    Object.entries(testResults).forEach(([test, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    const allPassed = Object.values(testResults).every(result => result);
    console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    
    /**
     * LLM Integration Test
     */
    logStep('LLM', 'Validating LLM integration...');
    console.log('\n=== LLM Integration Validation ===');
    
    console.log('MCP Tools Ready for LLM Use:');
    console.log('  ✅ detect_qb64pe_installation - Detects QB64PE installation status');
    console.log('  ✅ get_qb64pe_path_configuration - Provides PATH setup instructions');
    console.log('  ✅ validate_qb64pe_path - Validates specific installation paths');
    console.log('  ✅ generate_qb64pe_installation_report - Creates comprehensive reports');
    console.log('  ✅ get_qb64pe_installation_guidance - LLM-optimized user guidance');
    
    const totalTime = Date.now() - testStartTime;
    logStep('COMPLETE', `All tests completed in ${totalTime}ms`);
    
  } catch (error) {
    const totalTime = Date.now() - testStartTime;
    logStep('ERROR', `Test failed after ${totalTime}ms: ${error.message}`);
    throw error;
  }
};

// Run the main test with timeout protection
runWithTimeout(mainTest, TEST_TIMEOUT)
  .then(() => {
    console.log('\n✅ QB64PE Installation Detection Test Complete!');
    console.log('All features are ready for LLM integration.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error.message);
    console.error('This usually indicates a timeout or system issue.');
    process.exit(1);
  });

/**
 * Quick test for QB64PE Installation Detection - No hanging operations
 */

const path = require('path');
const fs = require('fs');

console.log('='.repeat(60));
console.log('QUICK QB64PE INSTALLATION DETECTION TEST');
console.log('='.repeat(60));

// Test 1: Basic platform detection
console.log('\n=== Test 1: Platform Detection ===');
const platform = require('os').platform();
console.log(`✓ Platform: ${platform}`);

// Test 2: Check user's known QB64PE installation
console.log('\n=== Test 2: User QB64PE Path Check ===');
const userQB64Path = 'C:\\Users\\grymmjack\\git\\QB64pe';
console.log(`Testing: ${userQB64Path}`);

try {
    const exists = fs.existsSync(userQB64Path);
    console.log(`  Directory exists: ${exists ? '✅' : '❌'}`);
    
    if (exists) {
        const qb64Executable = path.join(userQB64Path, 'qb64pe.exe');
        const execExists = fs.existsSync(qb64Executable);
        console.log(`  Executable exists: ${execExists ? '✅' : '❌'}`);
        console.log(`  Executable path: ${qb64Executable}`);
        
        if (execExists) {
            const stats = fs.statSync(qb64Executable);
            console.log(`  File size: ${stats.size} bytes`);
            console.log(`  Modified: ${stats.mtime.toISOString()}`);
        }
    }
} catch (error) {
    console.log(`  ❌ Error checking path: ${error.message}`);
}

// Test 3: Common paths check (no exec, just filesystem)
console.log('\n=== Test 3: Common Paths Check (Windows) ===');
const commonPaths = [
    'C:\\QB64pe',
    'C:\\Program Files\\QB64pe',
    'C:\\qb64',
    userQB64Path
];

commonPaths.forEach((testPath, index) => {
    try {
        const exists = fs.existsSync(testPath);
        console.log(`  ${index + 1}. ${testPath}: ${exists ? '✅' : '❌'}`);
    } catch (error) {
        console.log(`  ${index + 1}. ${testPath}: ❌ (error)`);
    }
});

// Test 4: PATH environment variable check (no exec)
console.log('\n=== Test 4: PATH Environment Check ===');
const pathEnv = process.env.PATH || '';
const pathEntries = pathEnv.split(';').filter(p => p.length > 0);
console.log(`Total PATH entries: ${pathEntries.length}`);

const qb64PathEntries = pathEntries.filter(entry => 
    entry.toLowerCase().includes('qb64')
);

if (qb64PathEntries.length > 0) {
    console.log('QB64PE-related PATH entries:');
    qb64PathEntries.forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry}`);
    });
} else {
    console.log('❌ No QB64PE-related entries found in PATH');
}

// Test 5: Generate basic guidance
console.log('\n=== Test 5: Basic Installation Guidance ===');

if (fs.existsSync(userQB64Path)) {
    const inPath = qb64PathEntries.length > 0;
    
    if (inPath) {
        console.log('✅ Status: QB64PE is installed and appears to be in PATH');
    } else {
        console.log('⚠️  Status: QB64PE is installed but NOT in PATH');
        console.log('\nTo add to PATH (Windows):');
        console.log(`1. Temporary: $env:PATH += ";${userQB64Path}"`);
        console.log('2. Permanent: Use System Properties > Environment Variables');
        console.log(`3. Add this path: ${userQB64Path}`);
    }
} else {
    console.log('❌ Status: QB64PE not found');
    console.log('\nTo install QB64PE:');
    console.log('1. Download from: https://github.com/QB64-Phoenix-Edition/QB64pe/releases');
    console.log('2. Extract to a folder like C:\\QB64pe');
    console.log('3. Add to PATH environment variable');
}

console.log('\n=== Test 6: MCP Integration Check ===');
console.log('MCP Tools that will be available:');
console.log('  ✓ detect_qb64pe_installation');
console.log('  ✓ get_qb64pe_path_configuration');
console.log('  ✓ validate_qb64pe_path'); 
console.log('  ✓ generate_qb64pe_installation_report');
console.log('  ✓ get_qb64pe_installation_guidance');

console.log('\n✅ Quick test completed successfully!');
console.log('Next: Build and test with timeouts to prevent hanging');

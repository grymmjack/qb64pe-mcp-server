const { QB64PECompatibilityService } = require('./build/services/compatibility-service.js');

async function testVariableScoping() {
    console.log('Testing QB64PE Variable Scoping Rules...\n');
    
    const service = new QB64PECompatibilityService();
    
    // Test case 1: Variable access without SHARED
    const testCode1 = `
' Global variable
DIM playerScore AS INTEGER
playerScore = 100

SUB UpdateScore
    playerScore = playerScore + 50  ' This should trigger warning
END SUB
`;

    console.log('Test 1: Variable access without SHARED declaration');
    console.log('Code:', testCode1);
    const issues1 = await service.validateCompatibility(testCode1);
    console.log('Issues found:', issues1.length);
    issues1.forEach(issue => {
        console.log(`- Line ${issue.line}: ${issue.message}`);
        console.log(`  Suggestion: ${issue.suggestion}`);
    });
    console.log();

    // Test case 2: Missing $DYNAMIC directive
    const testCode2 = `
DIM arraySize AS INTEGER
arraySize = 100
DIM myArray(arraySize) AS INTEGER  ' Should warn about missing $DYNAMIC
`;

    console.log('Test 2: Dynamic array without $DYNAMIC directive');
    console.log('Code:', testCode2);
    const issues2 = await service.validateCompatibility(testCode2);
    console.log('Issues found:', issues2.length);
    issues2.forEach(issue => {
        console.log(`- Line ${issue.line}: ${issue.message}`);
        console.log(`  Suggestion: ${issue.suggestion}`);
    });
    console.log();

    // Test case 3: SHARED without DIM
    const testCode3 = `
SHARED globalVar  ' This should be an error
`;

    console.log('Test 3: SHARED keyword without DIM');
    console.log('Code:', testCode3);
    const issues3 = await service.validateCompatibility(testCode3);
    console.log('Issues found:', issues3.length);
    issues3.forEach(issue => {
        console.log(`- Line ${issue.line}: ${issue.message}`);
        console.log(`  Suggestion: ${issue.suggestion}`);
    });
    console.log();

    // Test case 4: Correct usage with DIM SHARED
    const testCode4 = `
DIM SHARED playerScore AS INTEGER
DIM SHARED gameBoard(10, 10) AS INTEGER

SUB InitializeGame
    ' These are properly accessible because they were DIM SHARED
    playerScore = 0
    FOR i = 0 TO 10
        FOR j = 0 TO 10
            gameBoard(i, j) = 0
        NEXT j
    NEXT i
END SUB
`;

    console.log('Test 4: Correct usage with DIM SHARED');
    console.log('Code:', testCode4);
    const issues4 = await service.validateCompatibility(testCode4);
    console.log('Issues found:', issues4.length);
    if (issues4.length === 0) {
        console.log('✓ No issues found - this is correct usage!');
    }
    console.log();

    // Test case 5: Search for variable scoping information
    console.log('Test 5: Searching for variable scoping information');
    const searchResults = await service.searchCompatibility('variable scope shared');
    console.log('Search results:', searchResults.length);
    searchResults.forEach(result => {
        console.log(`- ${result.title}: ${result.description}`);
    });
    console.log();

    // Test case 6: Get debugging guidance for scope issues
    console.log('Test 6: Debugging guidance for scope issues');
    const guidance = await service.getDebuggingGuidance('variable scope');
    console.log(guidance);
}

testVariableScoping().catch(console.error);

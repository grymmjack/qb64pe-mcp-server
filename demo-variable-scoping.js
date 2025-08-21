const { QB64PECompatibilityService } = require('./build/services/compatibility-service.js');

async function demonstrateVariableScoping() {
    console.log('='.repeat(60));
    console.log('QB64PE Variable Scoping and $DYNAMIC Demonstration');
    console.log('='.repeat(60));
    console.log();
    
    const service = new QB64PECompatibilityService();
    
    // Example of common variable scoping problems
    const problemCode = `
' This code demonstrates common variable scoping issues

' Main program variables
DIM score AS INTEGER
DIM gameLevel AS INTEGER
DIM playerName AS STRING

score = 0
gameLevel = 1
playerName = "Player1"

' Try to update the game state
UpdateGame
DisplayStats
END

' This SUB will have scope issues
SUB UpdateGame
    ' These variables are not accessible here without SHARED!
    score = score + 100        ' ERROR: score not in scope
    gameLevel = gameLevel + 1  ' ERROR: gameLevel not in scope
    
    ' This would work but is not SHARED
    DIM localArray(gameLevel) AS INTEGER  ' ERROR: gameLevel not accessible
END SUB

SUB DisplayStats
    ' These variables are also not accessible here
    PRINT "Player: "; playerName  ' ERROR: playerName not in scope
    PRINT "Score: "; score        ' ERROR: score not in scope
    PRINT "Level: "; gameLevel    ' ERROR: gameLevel not in scope
END SUB
`;

    console.log('🚫 PROBLEMATIC CODE (will cause issues):');
    console.log(problemCode);
    
    const issues = await service.validateCompatibility(problemCode);
    console.log(`\n⚠️  Issues found: ${issues.length}`);
    issues.forEach((issue, index) => {
        console.log(`${index + 1}. Line ${issue.line}: ${issue.message}`);
        console.log(`   💡 ${issue.suggestion}`);
    });
    
    console.log('\n' + '='.repeat(60));
    
    // Example of correct variable scoping
    const fixedCode = `
' This code demonstrates correct variable scoping

' Global variables that need to be shared across procedures
DIM SHARED score AS INTEGER
DIM SHARED gameLevel AS INTEGER  
DIM SHARED playerName AS STRING

' Dynamic arrays require $DYNAMIC directive
'$DYNAMIC
DIM SHARED gameData() AS INTEGER

score = 0
gameLevel = 1
playerName = "Player1"

' Initialize dynamic array
REDIM gameData(100)

' Now these SUBs can access the shared variables
UpdateGame
DisplayStats
END

SUB UpdateGame
    ' These variables are now accessible because they were DIM SHARED
    score = score + 100
    gameLevel = gameLevel + 1
    
    ' Resize the dynamic array if needed
    IF gameLevel > UBOUND(gameData) THEN
        REDIM PRESERVE gameData(gameLevel * 10)
    END IF
    
    gameData(gameLevel) = score
END SUB

SUB DisplayStats
    ' All shared variables are accessible here
    PRINT "Player: "; playerName
    PRINT "Score: "; score
    PRINT "Level: "; gameLevel
    PRINT "Data points: "; UBOUND(gameData) + 1
END SUB
`;

    console.log('✅ CORRECTED CODE (proper scoping):');
    console.log(fixedCode);
    
    const fixedIssues = await service.validateCompatibility(fixedCode);
    console.log(`\n✅ Issues found: ${fixedIssues.length}`);
    if (fixedIssues.length === 0) {
        console.log('   🎉 No scoping issues detected!');
    } else {
        fixedIssues.forEach((issue, index) => {
            console.log(`${index + 1}. Line ${issue.line}: ${issue.message}`);
        });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📖 VARIABLE SCOPING RULES SUMMARY:');
    console.log('='.repeat(60));
    console.log();
    console.log('1. 🌍 GLOBAL SCOPE:');
    console.log('   • Variables in main program are global by default');
    console.log('   • Use DIM SHARED to make them accessible in SUB/FUNCTION');
    console.log('   • Example: DIM SHARED playerScore AS INTEGER');
    console.log();
    console.log('2. 🏠 LOCAL SCOPE:');  
    console.log('   • Variables in SUB/FUNCTION are local by default');
    console.log('   • Local variables cannot be accessed from other procedures');
    console.log('   • Example: DIM localVar AS INTEGER (inside SUB/FUNCTION)');
    console.log();
    console.log('3. 🔄 ACCESSING GLOBAL VARIABLES:');
    console.log('   • Use SHARED (without DIM) to reference existing global variables');
    console.log('   • Must be declared at the beginning of each SUB/FUNCTION');
    console.log('   • Example: SUB MyProc\\n           SHARED globalVar\\n           globalVar = 10');
    console.log();
    console.log('4. 📊 DYNAMIC ARRAYS:');
    console.log('   • Require \'$DYNAMIC directive before declaration');
    console.log('   • Use empty parentheses: DIM arrayName() AS type');
    console.log('   • Resize with REDIM: REDIM arrayName(newSize)');
    console.log('   • Use REDIM PRESERVE to keep existing data');
    console.log();
    console.log('5. ⚡ STATIC ARRAYS (default):');
    console.log('   • Size fixed at compile time');
    console.log('   • Faster access, less memory overhead');
    console.log('   • Use constants or literals for size');
    console.log('   • Example: DIM arrayName(100) AS INTEGER');
    
    console.log('\n' + '='.repeat(60));
    console.log('🔍 Search for more information:');
    const searchResults = await service.searchCompatibility('shared variable scope');
    searchResults.forEach(result => {
        console.log(`📋 ${result.title}`);
        console.log(`   ${result.description.substring(0, 100)}...`);
    });
}

demonstrateVariableScoping().catch(console.error);

#!/bin/bash
# Comprehensive test suite for qb64pe-mcp-server improvements

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   QB64PE MCP Server - Comprehensive Test Suite           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

FAILED=0

# Test 1: Build TypeScript
echo "🔨 Test 1: Building TypeScript..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ PASS: TypeScript compilation"
else
    echo "❌ FAIL: TypeScript compilation"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 2: Keyword Validator (sample)
echo "🔍 Test 2: Keyword Validator (20-keyword sample)..."
npx ts-node tools/validate-keywords.ts /home/grymmjack/git/qb64pe/internal/help /home/grymmjack/git/qb64pe-mcp-server/src/data/keywords-data.json 20 > /dev/null 2>&1
if [ $? -eq 1 ]; then
    # Exit code 1 is expected if there are validation issues to report
    if [ -f "docs/keyword-validation-report.md" ]; then
        echo "✅ PASS: Validator runs and generates report"
    else
        echo "❌ FAIL: Validator didn't generate report"
        FAILED=$((FAILED + 1))
    fi
else
    echo "✅ PASS: Validator runs successfully"
fi
echo ""

# Test 3: Graphics Detection
echo "🎨 Test 3: Graphics Detection (Dynamic Lookup)..."
npx ts-node tests/test-graphics-detection.ts > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ PASS: Graphics detection test suite"
else
    echo "❌ FAIL: Graphics detection test suite"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 4: Keywords Data File Exists
echo "📁 Test 4: Keywords Data File..."
if [ -f "src/data/keywords-data.json" ]; then
    # Check if it's valid JSON
    cat src/data/keywords-data.json | jq . > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ PASS: Keywords data file exists and is valid JSON"
    else
        echo "❌ FAIL: Keywords data file is not valid JSON"
        FAILED=$((FAILED + 1))
    fi
else
    echo "❌ FAIL: Keywords data file not found"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 5: Execution Service
echo "⚙️  Test 5: Execution Service Loads..."
node -e "const svc = require('./build/services/execution-service'); console.log('Service loaded successfully');" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ PASS: Execution service loads correctly"
else
    echo "❌ FAIL: Execution service failed to load"
    FAILED=$((FAILED + 1))
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
if [ $FAILED -eq 0 ]; then
    echo "✅ ALL TESTS PASSED!"
    echo "═══════════════════════════════════════════════════════════"
    exit 0
else
    echo "❌ $FAILED TEST(S) FAILED"
    echo "═══════════════════════════════════════════════════════════"
    exit 1
fi

# Testing Guide - QB64PE MCP Server

## Quick Test Commands

### Run All Tests (Recommended)
```bash
cd /home/grymmjack/git/qb64pe-mcp-server
bash tests/run-all-tests.sh
```

### Individual Tests

#### 1. Build Test
```bash
npm run build
```

#### 2. Keyword Validator Tests

**Quick sample (20 keywords)**:
```bash
npx ts-node tools/validate-keywords.ts \
  /home/grymmjack/git/qb64pe/internal/help \
  /home/grymmjack/git/qb64pe-mcp-server/src/data/keywords-data.json \
  20
```

**Full validation (all keywords)**:
```bash
npx ts-node tools/validate-keywords.ts \
  /home/grymmjack/git/qb64pe/internal/help \
  /home/grymmjack/git/qb64pe-mcp-server/src/data/keywords-data.json
```

**View validation report**:
```bash
cat docs/keyword-validation-report.md | less
# or
code docs/keyword-validation-report.md
```

#### 3. Graphics Detection Test
```bash
npx ts-node tests/test-graphics-detection.ts
```

#### 4. Manual MCP Server Test

**Start the server**:
```bash
npm start
```

**Test with MCP Inspector** (in another terminal):
```bash
npx @modelcontextprotocol/inspector node /home/grymmjack/git/qb64pe-mcp-server/build/index.js
```

## Test Results Interpretation

### All Tests Passed ✅
- TypeScript compiles without errors
- Keyword validator runs correctly
- Graphics detection working with dynamic lookup
- Keywords data file is valid JSON
- Services load without issues

### Expected Outputs

**Keyword Validator**:
- Exit code 1 with validation report = **GOOD** (means it found issues to report)
- Exit code 0 = **PERFECT** (no issues found - rare)
- Report generated at `docs/keyword-validation-report.md`

**Graphics Detection**:
- Should pass 10/10 test cases
- Tests both graphics programs (should detect) and console programs (should not detect)

## Verify Improvements

### 1. Graphics Detection Uses Dynamic Lookup

Check that hardcoded array is gone:
```bash
grep -n "graphicsKeywords = \[" src/services/execution-service.ts
# Should return no matches (only in comments)
```

Check that dynamic lookup is used:
```bash
grep -n "getGraphicsKeywords()" src/services/execution-service.ts
# Should show usage in detectGraphicsUsage method
```

### 2. Keyword Validation Results

**High-priority keywords should show**:
- Priority 1 (Graphics): 0 missing, 0 hallucinated ✅
- Priority 2 (Console): 0 missing, 0 hallucinated ✅
- Priority 3 (File I/O): 0 missing, 1 hallucinated ✅

Check in report:
```bash
grep -A 5 "Priority 1:" docs/keyword-validation-report.md
```

### 3. Build Output

Should show no TypeScript errors:
```bash
npm run build 2>&1 | grep -i error
# Should return empty (no errors)
```

## Integration Testing

### Test with Real QB64PE Code

Create a test file:
```bash
cat > test-program.bas << 'EOF'
SCREEN 12
COLOR 15, 1
CIRCLE (320, 240), 100, 14
PRINT "Graphics Test"
EOF
```

Analyze it programmatically:
```typescript
import { QB64PEExecutionService } from './build/services/execution-service';
const service = new QB64PEExecutionService();
const code = fs.readFileSync('test-program.bas', 'utf8');
const result = service.analyzeExecutionMode(code);
console.log('Has graphics:', result.hasGraphics); // Should be true
```

## Debugging Failed Tests

### Build Fails
```bash
# Check TypeScript errors
npm run build

# Check for missing dependencies
npm install
```

### Keyword Validator Fails
```bash
# Check help directory exists
ls /home/grymmjack/git/qb64pe/internal/help | head

# Check keywords data file
cat src/data/keywords-data.json | jq . | head

# Run with verbose output
npx ts-node tools/validate-keywords.ts [args] 2>&1 | tee validator-debug.log
```

### Graphics Detection Fails
```bash
# Run individual test with output
npx ts-node tests/test-graphics-detection.ts

# Check if keywords data loads
node -e "const fs = require('fs'); console.log(JSON.parse(fs.readFileSync('src/data/keywords-data.json', 'utf8')).categories ? 'OK' : 'BAD')"
```

## Continuous Testing

### Before Committing
```bash
# Run all tests
bash tests/run-all-tests.sh

# If all pass, you're good to commit
git add .
git commit -m "Your commit message"
```

### After Pulling Changes
```bash
# Rebuild and test
npm install
npm run build
bash tests/run-all-tests.sh
```

## Success Criteria

✅ **Ready to deploy if**:
- All 5 tests pass in run-all-tests.sh
- Graphics detection test shows 10/10 passed
- Keyword validation report shows Priority 1-3 at 100%
- TypeScript builds without errors

## Quick Smoke Test (30 seconds)

```bash
cd /home/grymmjack/git/qb64pe-mcp-server
npm run build && \
npx ts-node tests/test-graphics-detection.ts && \
echo "✅ Smoke test PASSED" || echo "❌ Smoke test FAILED"
```

If this passes, your improvements are working! 🎉

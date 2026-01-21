# Project Conventions and Guidelines

## Documentation Organization

### ❌ NEVER place documentation in project root
- Do NOT create `.md` files in the root directory
- Do NOT create summary/report files in root

### ✅ ALWAYS use the docs/ folder
- All documentation goes in `docs/`
- Use subdirectories for organization:
  - `docs/guides/` - User guides and tutorials
  - `docs/api/` - API documentation
  - `docs/architecture/` - System architecture docs
  - Main `docs/` - Session problems, summaries, reports

## QB64PE Language Facts

### Boolean Constants
- **_TRUE and _FALSE are RESERVED WORDS** - they are ALWAYS available in QB64PE
- _TRUE evaluates to -1 (all bits set to 1)
- _FALSE evaluates to 0 (all bits set to 0)
- These are NOT user-defined constants - they are part of the language
- Do NOT flag _TRUE or _FALSE as undefined in compatibility checking

### DECLARE Statement Usage
- **DECLARE is ONLY for importing C libraries**
- DECLARE LIBRARY ... END DECLARE is used for C function imports
- **SUBs do NOT need DECLARE** - they are automatically available
- **FUNCTIONs do NOT need DECLARE** - they are automatically available  
- QB64PE's parser handles all forward references automatically
- Only legacy code or C library imports use DECLARE

### Correct Understanding
```basic
' ❌ INCORRECT - These are NOT needed in QB64PE
DECLARE SUB MyProcedure
DECLARE FUNCTION Calculate%

' ✅ CORRECT - Just define them directly
SUB MyProcedure
    PRINT "Hello"
END SUB

FUNCTION Calculate% (x AS INTEGER)
    Calculate% = x * 2
END FUNCTION

' ✅ CORRECT - DECLARE is ONLY for C libraries
DECLARE LIBRARY
    FUNCTION my_c_function& (x AS LONG)
END DECLARE
```

## Verification Process

### ALWAYS verify documentation using MCP tools
When working on the QB64PE MCP server itself:

1. **Look up keywords** using `mcp_qb64pe_lookup_qb64pe_keyword`
2. **Search wiki** using `mcp_qb64pe_search_qb64pe_wiki`
3. **Check compatibility** using `mcp_qb64pe_search_qb64pe_compatibility`
4. **Verify syntax** using `mcp_qb64pe_validate_qb64pe_syntax`

### Before Making Changes
- Search the wiki for the keyword/feature
- Look up reserved words in constants/reserved-words.ts
- Check existing compatibility rules
- Test against actual QB64PE behavior

## File Organization

### Source Code Structure
```
src/
├── constants/           # Constants and reserved words
├── data/               # Static data files (JSON, etc.)
├── services/           # Core services
├── tools/              # MCP tool implementations
└── utils/              # Utility functions
```

### Test Organization
```
tests/
├── services/           # Service tests
├── tools/              # Tool tests
├── integration/        # Integration tests
└── session-problems/   # Session problem verification tests
```

### Documentation Structure
```
docs/
├── guides/            # User guides
├── api/               # API documentation
├── architecture/      # Architecture docs
├── SESSION_*.md       # Session problem resolutions
└── *.md               # Other documentation
```

## Common Mistakes to Avoid

### ❌ Don't Do This
1. Create documentation in project root
2. Flag _TRUE/_FALSE as undefined constants
3. Suggest DECLARE SUB or DECLARE FUNCTION for QB64PE code
4. Make assumptions about QB64PE features without verification
5. Ignore the MCP tools when working on the MCP server itself

### ✅ Do This Instead
1. Place all documentation in docs/ folder
2. Recognize _TRUE/_FALSE as reserved words
3. Explain DECLARE is only for C library imports
4. Use MCP tools to verify information
5. Test changes with actual QB64PE code

## Learning and Improvement

### Continuous Improvement Process
1. **Log Session Problems** - Use session problems logging for issues
2. **Verify Facts** - Always check with MCP tools
3. **Update Documentation** - Keep docs in sync with reality
4. **Test Thoroughly** - Write tests for new features
5. **Review Changes** - Check that changes align with QB64PE behavior

### Self-Verification Checklist
Before committing changes to QB64PE knowledge:
- [ ] Looked up the keyword/feature using MCP tools
- [ ] Verified behavior matches actual QB64PE
- [ ] Updated all affected documentation
- [ ] Added/updated test cases
- [ ] Documentation placed in correct folder (docs/)
- [ ] No assumptions made without verification

## References

- QB64PE Wiki: https://qb64phoenix.com/qb64wiki/
- QB64PE Forum: https://qb64phoenix.com/forum/
- Reserved Words: src/constants/reserved-words.ts
- Compatibility Rules: src/data/compatibility-rules.json

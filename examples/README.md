# QB64PE Code Examples

This folder contains example QB64PE code demonstrating common compatibility issues and their solutions.

## Boolean Constants Examples

### [boolean-constants-example.bas](./boolean-constants-example.bas)
❌ **Incorrect** - Shows common mistakes:
- Using undefined `TRUE` and `FALSE` constants
- Including unnecessary `DECLARE SUB` statements

Running this through the MCP compatibility checker will flag these issues.

### [boolean-constants-fixed.bas](./boolean-constants-fixed.bas)
✅ **Correct (Option 1)** - Shows best practice with constants:
- Defines `CONST TRUE = -1` and `CONST FALSE = 0` at the top
- Removes unnecessary `DECLARE SUB` statements
- Uses the defined constants throughout the code

### [boolean-constants-literal.bas](./boolean-constants-literal.bas)
✅ **Correct (Option 2)** - Shows alternative approach:
- Uses literal values `-1` for true and `0` for false
- Removes unnecessary `DECLARE SUB` statements
- No need to define constants if you prefer numeric literals

## Testing These Examples

To test these examples with the QB64PE MCP server compatibility checker:

```bash
# From the qb64pe-mcp-server directory
npm run build
npm test -- --testPathPattern="compatibility-service"
```

Or use the MCP tools to validate the code:
- `mcp_qb64pe_validate_qb64pe_compatibility` - Check for compatibility issues
- `mcp_qb64pe_search_qb64pe_compatibility` - Search for specific compatibility guidance

## Key Takeaways

1. **TRUE/FALSE are not built-in** - QB64PE doesn't define these constants by default
2. **Use -1 for true, 0 for false** - This is the BASIC convention
3. **Define constants if you prefer** - `CONST TRUE = -1, FALSE = 0`
4. **No DECLARE SUB needed** - QB64PE automatically handles SUB forward references
5. **Only DECLARE FUNCTION** - Functions need declaration to specify return type

## Related Documentation

- [Session Problem Resolution](../docs/SESSION_PROBLEM_2026-01-21.md) - Detailed explanation of these issues
- [Compatibility Rules](../src/data/compatibility-rules.json) - Full list of validation rules
- [Compatibility Service](../src/services/compatibility-service.ts) - Implementation details

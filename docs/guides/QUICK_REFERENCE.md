# QB64PE MCP Server - Quick Reference Card
**Version:** 1.0.0 (Enhanced)  
**Total Tools:** 59 (+8 new)  
**Last Updated:** January 17, 2026

---

## 🆕 NEW: Session Problems Tools

| Tool | Purpose | Use When |
|------|---------|----------|
| `log_session_problem` | Track development problems | Encounter any issue during coding |
| `get_session_problems_report` | Generate analysis report | Need to review session or export |
| `get_session_problems_statistics` | View metrics & patterns | Want to measure efficiency |
| `clear_session_problems` | Reset log | Starting new project/session |

**Quick Example:**
```json
// Log a problem
{"category": "syntax", "severity": "high", "title": "DIM SHARED in wrong file"}

// Get summary
{"format": "summary"}
```

---

## 🆕 NEW: File Structure Validation Tools

| Tool | Purpose | Critical For |
|------|---------|--------------|
| `validate_bi_file_structure` | Check .BI header files | Ensuring declarations only |
| `validate_bm_file_structure` | Check .BM implementation files | Preventing DIM SHARED errors |
| `validate_qb64_gj_lib_file_pair` | Check .BI/.BM together | Pre-compilation validation |
| `quick_check_qb64_file_structure` | Fast check any file | Quick error spotting |

**Quick Example:**
```json
// Before compiling
{"filename": "MYLIB.BM", "content": "..."}

// Result: ❌ DIM SHARED found in .BM - CRITICAL ERROR
```

---

## Common Error Prevention

### ❌ "Statement cannot be placed between SUB/FUNCTIONs"
**Cause:** DIM SHARED in .BM file  
**Solution:** Use `validate_bm_file_structure` before compile  
**Fix:** Move all DIM SHARED to .BI file

### ❌ "Cannot return UDT from FUNCTION"  
**Cause:** FUNCTION with User-Defined Type return  
**Solution:** MCP syntax validation now detects this  
**Fix:** Convert to SUB with BYREF parameter

### ❌ Reserved keyword conflicts (pos, palette, screen)
**Cause:** Variable name matches QB64PE reserved word  
**Solution:** Use `validate_qb64pe_syntax`  
**Fix:** Rename variable (e.g., pos → color_pos)

---

## Development Workflow

### 📝 Before Coding
```
1. Review: get_session_problems_report
2. Clear: clear_session_problems
3. Plan based on previous patterns
```

### 💻 During Development
```
1. Validate syntax: validate_qb64pe_syntax
2. Check structure: quick_check_qb64_file_structure
3. Log issues: log_session_problem
```

### ✅ Before Compiling
```
1. Validate .BI: validate_bi_file_structure
2. Validate .BM: validate_bm_file_structure
3. Check pair: validate_qb64_gj_lib_file_pair
```

### 📊 After Session
```
1. Statistics: get_session_problems_statistics
2. Export: get_session_problems_report format=markdown
3. Review patterns and improvements
```

---

## QB64_GJ_LIB File Rules

### ✅ .BI Files (Headers)
- TYPE definitions
- CONST declarations
- DIM SHARED variables
- $INCLUDEONCE

### ✅ .BM Files (Implementation)
- SUB/FUNCTION implementations ONLY
- $INCLUDEONCE
- Local DIM/CONST (inside functions)

### ❌ Common Mistakes
- DIM SHARED in .BM → **CRITICAL ERROR**
- SUB/FUNCTION code in .BI → **ERROR**
- Global CONST in .BM → **WARNING**

---

## Problem Categories

| Category | Examples |
|----------|----------|
| syntax | FUNCTION AS, reserved words, type sigils |
| compatibility | QB4.5 vs QB64PE differences |
| tooling | IDE issues, compiler problems |
| api | Function signatures, parameters |
| documentation | Missing info, unclear examples |
| deployment | Build, distribution issues |
| performance | Slow code, optimization |

## Severity Levels

| Level | When to Use |
|-------|-------------|
| critical | Blocks all work, data loss risk |
| high | Major impact, significant time waste |
| medium | Moderate impact, workaround exists |
| low | Minor annoyance, easy fix |

---

## Metrics Tracked

- ⏱️ Time wasted on problems
- 🔄 Attempts before solution
- 🛠️ Tools used vs should have used
- 📊 Pattern frequency
- 📈 Category & severity distribution

---

## Best Practices

### ✅ DO
- Validate before compiling
- Log problems as they occur
- Use specific error categories
- Include metrics when possible
- Review patterns regularly

### ❌ DON'T
- Skip validation to save time
- Batch log problems (log immediately)
- Guess at solutions (use tools)
- Ignore recurring patterns
- Delete logs without exporting

---

## Integration with Existing Tools

These new tools complement:
- `validate_qb64pe_syntax` - Now enhanced with UDT detection
- `search_qb64pe_compatibility` - For QB4.5/QB64PE differences
- `get_debugging_help` - For troubleshooting
- `generate_programming_feedback` - For code improvement

---

## Quick Stats

**Services:** 16 total (14 existing + 2 new)  
**Tools:** 59 total (51 existing + 8 new)  
**New Code:** 1,591 lines TypeScript  
**Build Size:** 49 KB compiled JavaScript  

---

## Success Indicators

✅ No DIM SHARED placement errors  
✅ File structure validated pre-compile  
✅ UDT return types caught immediately  
✅ Session patterns identified  
✅ Development efficiency improved  

---

*For detailed documentation, see NEW_TOOLS_README.md*  
*For implementation details, see IMPROVEMENTS_2026-01-17.md*  
*For complete summary, see MCP_SERVER_AUTONOMOUS_SUMMARY.md*

# QB64PE Graphics Guide - Quick Access Summary

## For LLM Agents

### 🎯 Primary Tool
```
#get_qb64pe_graphics_guide
```
**Purpose**: Access comprehensive QB64PE graphics guide specifically written for LLMs

### 🔧 Key Sections
```
#get_qb64pe_graphics_guide putimage      → _PUTIMAGE usage & stretching issues
#get_qb64pe_graphics_guide troubleshooting → Common graphics problems & solutions  
#get_qb64pe_graphics_guide examples      → Code patterns & implementations
```

### ⚠️ Critical Issue Solved
**_PUTIMAGE Stretching Problem**: LLMs frequently use wrong syntax causing accidental image stretching

**❌ WRONG** (stretches image):
```basic
_PUTIMAGE (100, 100)-(300, 300), imageHandle
```

**✅ CORRECT** (original size):
```basic  
_PUTIMAGE (100, 100), imageHandle
```

### 🚀 Integration Workflow

1. **Before graphics work**: `#get_qb64pe_graphics_guide putimage`
2. **For specific keywords**: `#mcp_qb64pe_lookup_qb64pe_keyword _PUTIMAGE`
3. **Troubleshooting**: `#get_qb64pe_graphics_guide troubleshooting`
4. **Code review**: Use guide to validate graphics code

### 📋 Guide Coverage
- **5 _PUTIMAGE syntax forms** with behavior explanation
- **Image lifecycle management** (_NEWIMAGE, _LOADIMAGE, _FREEIMAGE)
- **Memory management** best practices  
- **Drawing commands** (LINE, CIRCLE, PAINT, etc.)
- **Screen management** (SCREEN, _DEST, _SOURCE)
- **Error patterns** and solutions
- **LLM-specific examples** and workflows

### 🔗 Related Tools
```
#mcp_qb64pe_search_qb64pe_keywords_by_wiki_category Graphics and Imaging:
#mcp_qb64pe_generate_qb64pe_screenshot_analysis_template  
#mcp_qb64pe_analyze_qb64pe_graphics_screenshot
```

---

**Result**: LLMs now have comprehensive graphics guidance to avoid common mistakes and implement proper QB64PE graphics code.

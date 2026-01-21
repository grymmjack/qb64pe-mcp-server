#!/usr/bin/env node
/**
 * QB64PE Keyword Validator
 * 
 * Parses official QB64PE IDE help files and validates against keywords-data.json
 * to ensure accuracy and completeness of the MCP server keyword database.
 * 
 * Priority order (high-impact first, OpenGL last):
 * 1. Graphics/Screen keywords (SCREEN, _NEWIMAGE, _DISPLAY, etc.)
 * 2. Console/Text keywords (PRINT, INPUT, etc.)
 * 3. File I/O keywords (OPEN, CLOSE, etc.)
 * 4. General keywords
 * 5. OpenGL keywords (gl_* - lowest priority)
 */

import * as fs from 'fs';
import * as path from 'path';

interface HelpFileInfo {
  filename: string;
  keyword: string;
  filePath: string;
  content: string;
  syntax?: string;
  parameters?: string[];
  description?: string;
  priority: number; // 1=highest, 5=lowest
}

interface KeywordValidationResult {
  keyword: string;
  status: 'ok' | 'missing' | 'hallucinated' | 'parameter_mismatch';
  priority: number;
  details?: string;
  helpFile?: string;
  inKeywordsData: boolean;
  inHelpFiles: boolean;
}

interface ValidationReport {
  totalHelpFiles: number;
  totalKeywordsInData: number;
  validationResults: KeywordValidationResult[];
  missing: KeywordValidationResult[];
  hallucinated: KeywordValidationResult[];
  parameterMismatches: KeywordValidationResult[];
  ok: KeywordValidationResult[];
}

class QB64PEKeywordValidator {
  private helpDir: string;
  private keywordsDataPath: string;
  private keywordsData: any;
  private helpFiles: HelpFileInfo[] = [];

  constructor(helpDir: string, keywordsDataPath: string) {
    this.helpDir = helpDir;
    this.keywordsDataPath = keywordsDataPath;
    this.keywordsData = JSON.parse(fs.readFileSync(keywordsDataPath, 'utf8'));
  }

  /**
   * Decode help filename to extract keyword name
   * Examples:
   * - _NEWIMAGE__11111111.txt -> _NEWIMAGE
   * - PRINT_11111.txt -> PRINT
   * - SCREEN_111111.txt -> SCREEN
   * - %24CONSOLE_%241111111.txt -> $CONSOLE
   * - _BLEND__11111.txt -> _BLEND
   * - SCREEN_(function)__111111_(00000000).txt -> SCREEN
   */
  private decodeFilename(filename: string): string | null {
    // Remove .txt extension
    let base = filename.replace(/\.txt$/, '');
    
    // Handle URL-encoded characters (e.g., %24 = $, %25 = %)
    try {
      base = decodeURIComponent(base);
    } catch (e) {
      // If decode fails, use as-is
    }
    
    // Filter out documentation pages (not actual keywords)
    const docPatterns = [
      /^Template:/,
      /^Apostrophe/,
      /^Colon/,
      /^Parenthesis/,
      /^Dollar_Sign/,
      /^Question_mark/,
      /^Quotation_mark/,
      /^Underscore$/,
      /^Equal$/,
      /^Semicolon/,
      /^Comma/,
      /^Greater_Than/,
      /^Less_Than/,
      /^Not_Equal/,
      /^Keyword_Reference/,
      /^QB64_FAQ/,
      /^QB64_Help_Menu/,
      /^Quick_Reference/,
      /^Variable_Types$/,
      /^Data_types$/,
      /^ERROR_Codes$/,
      /^Mathematical_Operations$/,
      /^Keywords_currently_not_supported/,
      /^\^_\^$/,  // Exponentiation operator page
      /^[*+/\\-]_[!Q-]$/,  // Operator pages
      /^&[BHO]_&/,  // Number prefix pages
    ];
    
    if (docPatterns.some(pattern => pattern.test(base))) {
      return null; // Skip documentation pages
    }
    
    // Remove variant markers like _(function), _(statement), etc.
    base = base.replace(/_\([^)]+\)/g, '');
    
    // Remove encoding patterns in correct order:
    // 1. Try double underscore pattern FIRST (most QB64PE keywords use this)
    let match = base.match(/^(.+?)__/);
    if (match) {
      return match[1];
    }
    
    // 2. Then try: keyword followed by _ then $ or digits at the end
    match = base.match(/^(.+?)_[\$\d]+$/);
    if (match) {
      return match[1];
    }
    
    // If no pattern matched, check if it's a compound keyword with underscores we should keep
    // Some keywords like DO...LOOP, FOR...NEXT have special encoding
    if (base.includes('...')) {
      // These are compound statement keywords, keep as-is
      return base;
    }
    
    // Return as-is (might already be clean)
    return base;
  }

  /**
   * Determine priority based on keyword name and category
   * 1 = Graphics/Screen (highest priority)
   * 2 = Console/Text
   * 3 = File I/O
   * 4 = General
   * 5 = OpenGL (lowest priority)
   */
  private determinePriority(keyword: string): number {
    const upper = keyword.toUpperCase();
    
    // OpenGL - lowest priority
    if (upper.startsWith('GL') && upper.length > 2 && upper[2] !== '_') {
      return 5;
    }
    
    // Graphics/Screen - highest priority
    const graphicsKeywords = [
      'SCREEN', '_NEWIMAGE', '_LOADIMAGE', '_DISPLAY', '_PUTIMAGE',
      '_PRINTSTRING', 'PSET', 'PRESET', 'LINE', 'CIRCLE', 'PAINT',
      'DRAW', 'GET', 'PUT', 'POINT', 'COLOR', 'PALETTE', 'CLS',
      '_FONT', '_PRINTMODE', '_FREEIMAGE', '_COPYIMAGE', '_SAVEIMAGE',
      '_SCREENIMAGE', '_MAPTRIANGLE', '_SETALPHA', '_BLEND', '_DONTBLEND',
      'PCOPY', 'VIEW', 'WINDOW', '_CLEARCOLOR', '_PRINTWIDTH',
      '_UPRINTSTRING', 'LOCATE', '_WIDTH', '_HEIGHT', '_RESIZE'
    ];
    if (graphicsKeywords.includes(upper)) {
      return 1;
    }
    
    // Console/Text
    const consoleKeywords = [
      'PRINT', 'INPUT', 'WRITE', 'READ', '_CONSOLE', '_CONSOLETITLE',
      '_CONSOLECURSOR', '_CONSOLEFONT', 'CSRLIN', 'POS', 'LPOS',
      'LPRINT', 'WIDTH', '_ECHO', '_CONTROLCHR', 'TAB', 'SPC'
    ];
    if (consoleKeywords.includes(upper)) {
      return 2;
    }
    
    // File I/O
    const fileKeywords = [
      'OPEN', 'CLOSE', 'EOF', 'LOF', 'LOC', 'SEEK', 'GET', 'PUT',
      'FIELD', 'LSET', 'RSET', 'WRITE', 'INPUT', 'LINE INPUT',
      '_FILEEXISTS', '_DIREXISTS', 'KILL', 'NAME', 'FILES',
      'MKDIR', 'RMDIR', 'CHDIR', '_CWD', '_READFILE', '_WRITEFILE'
    ];
    if (fileKeywords.includes(upper)) {
      return 3;
    }
    
    // General - default priority
    return 4;
  }

  /**
   * Parse help file content to extract syntax and parameters
   */
  private parseHelpFile(filePath: string, keyword: string): HelpFileInfo {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    const info: HelpFileInfo = {
      filename,
      keyword,
      filePath,
      content,
      priority: this.determinePriority(keyword),
      parameters: []
    };
    
    // Extract syntax section
    const syntaxMatch = content.match(/{{PageSyntax}}([\s\S]*?)(?:{{Page|$)/);
    if (syntaxMatch) {
      info.syntax = syntaxMatch[1].trim();
      
      // Extract parameters from syntax
      const paramMatches = info.syntax.matchAll(/{{Parameter\|([^}]+)}}/g);
      for (const match of paramMatches) {
        if (!info.parameters!.includes(match[1])) {
          info.parameters!.push(match[1]);
        }
      }
    }
    
    // Extract description
    const descMatch = content.match(/{{PageDescription}}([\s\S]*?)(?:{{Page|$)/);
    if (descMatch) {
      info.description = descMatch[1].trim().substring(0, 200); // First 200 chars
    }
    
    return info;
  }

  /**
   * Load and parse all help files
   */
  loadHelpFiles(sampleSize?: number): void {
    console.log(`\n🔍 Scanning help directory: ${this.helpDir}`);
    
    const files = fs.readdirSync(this.helpDir)
      .filter(f => f.endsWith('.txt') && !f.startsWith('links.'));
    
    console.log(`Found ${files.length} help files`);
    
    // Process sample or all files
    const filesToProcess = sampleSize ? files.slice(0, sampleSize) : files;
    console.log(`Processing ${filesToProcess.length} files${sampleSize ? ' (sample)' : ''}...`);
    
    for (const file of filesToProcess) {
      const filePath = path.join(this.helpDir, file);
      const keyword = this.decodeFilename(file);
      
      if (keyword) {
        try {
          const helpInfo = this.parseHelpFile(filePath, keyword);
          this.helpFiles.push(helpInfo);
        } catch (error) {
          console.warn(`⚠️  Failed to parse ${file}: ${error}`);
        }
      }
    }
    
    // Sort by priority
    this.helpFiles.sort((a, b) => a.priority - b.priority);
    
    console.log(`✅ Loaded ${this.helpFiles.length} help files`);
    console.log(`   Priority 1 (Graphics/Screen): ${this.helpFiles.filter(h => h.priority === 1).length}`);
    console.log(`   Priority 2 (Console/Text): ${this.helpFiles.filter(h => h.priority === 2).length}`);
    console.log(`   Priority 3 (File I/O): ${this.helpFiles.filter(h => h.priority === 3).length}`);
    console.log(`   Priority 4 (General): ${this.helpFiles.filter(h => h.priority === 4).length}`);
    console.log(`   Priority 5 (OpenGL): ${this.helpFiles.filter(h => h.priority === 5).length}`);
  }

  /**
   * Get all keywords from keywords-data.json
   */
  private getAllKeywordsFromData(): Set<string> {
    const keywords = new Set<string>();
    
    // Iterate through all categories
    for (const [categoryName, categoryData] of Object.entries(this.keywordsData.categories)) {
      const category = categoryData as any;
      if (category.keywords && Array.isArray(category.keywords)) {
        for (const kw of category.keywords) {
          if (typeof kw === 'string') {
            keywords.add(kw.toUpperCase());
          }
        }
      }
    }
    
    return keywords;
  }

  /**
   * Validate keywords against help files
   */
  validate(): ValidationReport {
    console.log(`\n📊 Validating keywords...`);
    
    const keywordsFromData = this.getAllKeywordsFromData();
    const keywordsFromHelp = new Set(this.helpFiles.map(h => h.keyword.toUpperCase()));
    
    const results: KeywordValidationResult[] = [];
    
    // Check for missing keywords (in help but not in data)
    for (const helpFile of this.helpFiles) {
      const keyword = helpFile.keyword.toUpperCase();
      const inData = keywordsFromData.has(keyword);
      
      results.push({
        keyword: helpFile.keyword,
        status: inData ? 'ok' : 'missing',
        priority: helpFile.priority,
        helpFile: helpFile.filename,
        inKeywordsData: inData,
        inHelpFiles: true,
        details: inData ? undefined : 'Found in help files but missing from keywords-data.json'
      });
    }
    
    // Check for hallucinated keywords (in data but not in help)
    for (const keyword of keywordsFromData) {
      if (!keywordsFromHelp.has(keyword)) {
        // Try to find similar keywords to determine if it's a real hallucination
        const similar = Array.from(keywordsFromHelp).find(k => 
          k.includes(keyword) || keyword.includes(k)
        );
        
        results.push({
          keyword,
          status: 'hallucinated',
          priority: this.determinePriority(keyword),
          inKeywordsData: true,
          inHelpFiles: false,
          details: similar 
            ? `Not found in help files (similar: ${similar})`
            : 'Not found in help files - possible hallucination'
        });
      }
    }
    
    const report: ValidationReport = {
      totalHelpFiles: this.helpFiles.length,
      totalKeywordsInData: keywordsFromData.size,
      validationResults: results.sort((a, b) => a.priority - b.priority),
      missing: results.filter(r => r.status === 'missing').sort((a, b) => a.priority - b.priority),
      hallucinated: results.filter(r => r.status === 'hallucinated').sort((a, b) => a.priority - b.priority),
      parameterMismatches: results.filter(r => r.status === 'parameter_mismatch').sort((a, b) => a.priority - b.priority),
      ok: results.filter(r => r.status === 'ok').sort((a, b) => a.priority - b.priority)
    };
    
    console.log(`✅ Validation complete`);
    console.log(`   Total help files: ${report.totalHelpFiles}`);
    console.log(`   Total keywords in data: ${report.totalKeywordsInData}`);
    console.log(`   OK: ${report.ok.length}`);
    console.log(`   Missing: ${report.missing.length}`);
    console.log(`   Hallucinated: ${report.hallucinated.length}`);
    
    return report;
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(report: ValidationReport): string {
    const lines: string[] = [];
    
    lines.push('# QB64PE Keyword Validation Report');
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push('');
    
    // Summary
    lines.push('## Summary');
    lines.push('');
    lines.push(`- **Total help files processed**: ${report.totalHelpFiles}`);
    lines.push(`- **Total keywords in keywords-data.json**: ${report.totalKeywordsInData}`);
    lines.push(`- **Valid keywords**: ${report.ok.length}`);
    lines.push(`- **Missing keywords**: ${report.missing.length}`);
    lines.push(`- **Hallucinated keywords**: ${report.hallucinated.length}`);
    lines.push(`- **Parameter mismatches**: ${report.parameterMismatches.length}`);
    lines.push('');
    
    // Priority breakdown
    lines.push('## Priority Breakdown');
    lines.push('');
    for (let priority = 1; priority <= 5; priority++) {
      const priorityName = ['Graphics/Screen', 'Console/Text', 'File I/O', 'General', 'OpenGL'][priority - 1];
      const count = report.validationResults.filter(r => r.priority === priority).length;
      const missing = report.missing.filter(r => r.priority === priority).length;
      const hallucinated = report.hallucinated.filter(r => r.priority === priority).length;
      
      lines.push(`### Priority ${priority}: ${priorityName}`);
      lines.push(`- Total: ${count}`);
      lines.push(`- Missing: ${missing}`);
      lines.push(`- Hallucinated: ${hallucinated}`);
      lines.push('');
    }
    
    // Missing keywords
    if (report.missing.length > 0) {
      lines.push('## Missing Keywords');
      lines.push('');
      lines.push('Keywords found in help files but missing from keywords-data.json:');
      lines.push('');
      lines.push('| Priority | Keyword | Help File | Details |');
      lines.push('|----------|---------|-----------|---------|');
      
      for (const result of report.missing) {
        const priorityName = ['Graphics/Screen', 'Console/Text', 'File I/O', 'General', 'OpenGL'][result.priority - 1];
        lines.push(`| ${result.priority} (${priorityName}) | \`${result.keyword}\` | ${result.helpFile} | ${result.details || ''} |`);
      }
      lines.push('');
    }
    
    // Hallucinated keywords
    if (report.hallucinated.length > 0) {
      lines.push('## Hallucinated Keywords');
      lines.push('');
      lines.push('Keywords in keywords-data.json but not found in help files:');
      lines.push('');
      lines.push('| Priority | Keyword | Details |');
      lines.push('|----------|---------|---------|');
      
      for (const result of report.hallucinated) {
        const priorityName = ['Graphics/Screen', 'Console/Text', 'File I/O', 'General', 'OpenGL'][result.priority - 1];
        lines.push(`| ${result.priority} (${priorityName}) | \`${result.keyword}\` | ${result.details || ''} |`);
      }
      lines.push('');
    }
    
    // OK keywords (sample)
    if (report.ok.length > 0) {
      lines.push('## Valid Keywords (Sample)');
      lines.push('');
      lines.push('Sample of keywords that are correctly present in both help files and keywords-data.json:');
      lines.push('');
      
      // Show first 20 from each priority
      for (let priority = 1; priority <= 5; priority++) {
        const priorityOk = report.ok.filter(r => r.priority === priority);
        if (priorityOk.length > 0) {
          const priorityName = ['Graphics/Screen', 'Console/Text', 'File I/O', 'General', 'OpenGL'][priority - 1];
          lines.push(`### Priority ${priority}: ${priorityName} (${priorityOk.length} total)`);
          lines.push('');
          const sample = priorityOk.slice(0, 20);
          lines.push(sample.map(r => `- \`${r.keyword}\``).join('\n'));
          if (priorityOk.length > 20) {
            lines.push(`- ... and ${priorityOk.length - 20} more`);
          }
          lines.push('');
        }
      }
    }
    
    return lines.join('\n');
  }
}

// Main execution
const helpDir = process.argv[2] || '/home/grymmjack/git/qb64pe/internal/help';
const keywordsDataPath = process.argv[3] || path.join(__dirname, '../src/data/keywords-data.json');
const sampleSize = process.argv[4] ? parseInt(process.argv[4]) : undefined;

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║       QB64PE Keyword Validator                            ║');
console.log('╚═══════════════════════════════════════════════════════════╝');

const validator = new QB64PEKeywordValidator(helpDir, keywordsDataPath);

// Load help files
validator.loadHelpFiles(sampleSize);

// Validate
const report = validator.validate();

// Generate markdown report
const markdown = validator.generateMarkdownReport(report);

// Save report
const reportPath = path.join(__dirname, '../docs/keyword-validation-report.md');
fs.writeFileSync(reportPath, markdown);

console.log(`\n📄 Report saved to: ${reportPath}`);
console.log('');

// Exit with error code if there are issues
if (report.missing.length > 0 || report.hallucinated.length > 0) {
  console.log('⚠️  Validation found issues. Review the report for details.');
  process.exit(1);
} else {
  console.log('✅ All keywords validated successfully!');
  process.exit(0);
}

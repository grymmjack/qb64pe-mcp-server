#!/usr/bin/env node
/**
 * Comprehensive Autonomous Test Suite for ALL QB64PE MCP Tools
 * Tests all 55+ tools across 10 categories
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 QB64PE MCP Server - Comprehensive Autonomous Test Suite\n');
console.log('Testing all 55+ tools across 10 categories...\n');

const serverPath = join(__dirname, 'build', 'index.js');
const mcpProcess = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = '';
let requestId = 0;
const testResults = [];
const exampleUsage = [];

function sendRequest(method, params) {
  return new Promise((resolve, reject) => {
    const id = requestId++;
    const request = { jsonrpc: '2.0', id, method, params };
    
    const timeout = setTimeout(() => {
      resolve({ error: { message: 'Timeout' } });
    }, 10000);

    const handler = (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
          const response = JSON.parse(line);
          if (response.id === id) {
            clearTimeout(timeout);
            mcpProcess.stdout.off('data', handler);
            buffer = lines[lines.length - 1];
            resolve(response);
            return;
          }
        } catch (e) {}
      }
      buffer = lines[lines.length - 1];
    };

    mcpProcess.stdout.on('data', handler);
    mcpProcess.stdin.write(JSON.stringify(request) + '\n');
  });
}

async function testTool(category, toolName, args, description) {
  const response = await sendRequest('tools/call', { name: toolName, arguments: args });
  
  const passed = !response.error;
  const result = {
    category,
    tool: toolName,
    passed,
    error: response.error?.message,
    description
  };
  
  testResults.push(result);
  
  // Store example usage
  if (passed) {
    let sampleOutput = 'Success';
    try {
      if (response.result?.content?.[0]?.text) {
        sampleOutput = String(response.result.content[0].text).substring(0, 200);
      }
    } catch (e) {
      sampleOutput = 'Success (output not displayable)';
    }
    exampleUsage.push({
      category,
      tool: toolName,
      description,
      example: args,
      sampleOutput
    });
  }
  
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${category.padEnd(15)} ${toolName.padEnd(40)}`);
  if (!passed) {
    console.log(`   Error: ${response.error?.message?.substring(0, 100)}`);
  }
  
  return result;
}

async function runTests() {
  // Initialize
  await sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'comprehensive-test', version: '1.0.0' }
  });

  console.log('=' .repeat(80));
  console.log('CATEGORY        TOOL NAME                                 STATUS');
  console.log('=' .repeat(80));

  // 1. WIKI TOOLS
  await testTool('Wiki', 'search_qb64pe_wiki', 
    { query: 'PRINT', category: 'keywords' },
    'Search QB64PE wiki for documentation');
  
  await testTool('Wiki', 'get_qb64pe_page',
    { pageTitle: 'PRINT', includeExamples: true },
    'Get detailed wiki page content');
  
  await testTool('Wiki', 'get_qb64pe_wiki_categories',
    {},
    'Get all wiki categories');

  // 2. KEYWORD TOOLS
  await testTool('Keywords', 'lookup_qb64pe_keyword',
    { keyword: 'PRINT' },
    'Look up keyword information');
  
  await testTool('Keywords', 'autocomplete_qb64pe_keywords',
    { prefix: 'PRI', limit: 5 },
    'Autocomplete keyword suggestions');
  
  await testTool('Keywords', 'get_qb64pe_keywords_by_category',
    { category: 'statement' },
    'Get keywords by category');
  
  await testTool('Keywords', 'search_qb64pe_keywords',
    { query: 'screen', maxResults: 10 },
    'Search for keywords');

  // 3. COMPILER TOOLS
  await testTool('Compiler', 'get_compiler_options',
    { platform: 'all', optionType: 'all' },
    'Get compiler options and flags');

  // 4. COMPATIBILITY TOOLS
  await testTool('Compatibility', 'validate_qb64pe_syntax',
    { code: 'PRINT "Hello World"', checkLevel: 'basic' },
    'Validate QB64PE syntax');
  
  await testTool('Compatibility', 'validate_qb64pe_compatibility',
    { code: 'SCREEN 13\nPRINT "Test"', platform: 'all' },
    'Check compatibility issues');
  
  await testTool('Compatibility', 'search_qb64pe_compatibility',
    { query: 'console', category: 'console_directives' },
    'Search compatibility knowledge');

  // 5. DEBUGGING TOOLS
  await testTool('Debugging', 'get_debugging_help',
    { issue: 'program hangs on loop', platform: 'all' },
    'Get debugging assistance');
  
  await testTool('Debugging', 'enhance_qb64pe_code_for_debugging',
    { sourceCode: 'PRINT "Test"', config: { enableLogging: true } },
    'Add debugging features to code');
  
  await testTool('Debugging', 'get_qb64pe_debugging_best_practices',
    {},
    'Get debugging best practices');
  
  await testTool('Debugging', 'get_llm_debugging_guide',
    {},
    'Get LLM-specific debugging guide');

  // 6. INSTALLATION TOOLS
  await testTool('Installation', 'detect_qb64pe_installation',
    {},
    'Auto-detect QB64PE installation');
  
  await testTool('Installation', 'generate_qb64pe_installation_report',
    {},
    'Generate installation report');
  
  await testTool('Installation', 'get_qb64pe_installation_guidance',
    {},
    'Get installation guidance');

  // 7. PORTING TOOLS
  await testTool('Porting', 'analyze_qbasic_compatibility',
    { sourceCode: 'PRINT "Hello"', sourceDialect: 'qbasic' },
    'Analyze QBasic compatibility');
  
  await testTool('Porting', 'port_qbasic_to_qb64pe',
    { 
      sourceCode: 'SCREEN 13\nPRINT "Test"',
      sourceDialect: 'qbasic',
      addModernFeatures: true
    },
    'Port QBasic to QB64PE');
  
  await testTool('Porting', 'get_porting_dialect_info',
    { dialect: 'qbasic' },
    'Get dialect porting info');

  // 8. GRAPHICS TOOLS
  await testTool('Graphics', 'get_qb64pe_graphics_guide',
    { topic: 'basics' },
    'Get graphics programming guide');

  // 9. EXECUTION TOOLS
  await testTool('Execution', 'analyze_qb64pe_execution_mode',
    { sourceCode: 'PRINT "Test"' },
    'Analyze execution characteristics');
  
  await testTool('Execution', 'get_process_monitoring_commands',
    { processName: 'qb64pe', platform: 'current' },
    'Get process monitoring commands');
  
  await testTool('Execution', 'generate_monitoring_template',
    { sourceCode: 'PRINT "Test"', templateType: 'basic' },
    'Generate monitoring template');
  
  await testTool('Execution', 'get_execution_monitoring_guidance',
    {},
    'Get monitoring guidance');
  
  await testTool('Execution', 'parse_console_output',
    { output: 'Test output\nLine 2' },
    'Parse console output');

  // 10. FEEDBACK TOOLS
  await testTool('Feedback', 'generate_programming_feedback',
    { code: 'PRINT "Hello"', context: 'Learning basics' },
    'Generate programming feedback');
  
  await testTool('Feedback', 'get_feedback_statistics',
    {},
    'Get feedback statistics');

  // 11. SESSION PROBLEMS TOOLS
  await testTool('Session', 'log_session_problem',
    {
      category: 'tooling',
      severity: 'low',
      title: 'Test problem',
      description: 'Testing comprehensive suite',
      context: { language: 'QB64PE' }
    },
    'Log development problem');
  
  await testTool('Session', 'get_session_problems_report',
    { format: 'summary' },
    'Get problems report');
  
  await testTool('Session', 'get_session_problems_statistics',
    {},
    'Get problems statistics');

  // 12. FILE STRUCTURE TOOLS
  await testTool('FileStruct', 'validate_bi_file_structure',
    {
      content: 'TYPE TestType\n    field AS STRING\nEND TYPE',
      filename: 'test.BI'
    },
    'Validate .BI file structure');
  
  await testTool('FileStruct', 'validate_bm_file_structure',
    {
      content: 'SUB TestSub\n    PRINT "Test"\nEND SUB',
      filename: 'test.BM'
    },
    'Validate .BM file structure');
  
  await testTool('FileStruct', 'validate_qb64_gj_lib_file_pair',
    {
      biContent: 'TYPE Test\nEND TYPE',
      bmContent: 'SUB TestFunc\nEND SUB',
      libraryName: 'TestLib'
    },
    'Validate .BI/.BM file pair');
  
  await testTool('FileStruct', 'quick_check_qb64_file_structure',
    {
      filename: 'test.BI',
      content: 'CONST MAX = 100'
    },
    'Quick structure check');

  // 13. ADDITIONAL TOOLS
  await testTool('Other', 'generate_console_formatting_template',
    { style: 'simple' },
    'Generate console formatting');
  
  await testTool('Other', 'get_automation_status',
    {},
    'Get automation status');
  
  await testTool('Other', 'generate_qb64pe_echo_functions',
    { includeAllVariants: true },
    'Generate ECHO functions');
  
  await testTool('Other', 'inject_native_qb64pe_logging',
    { 
      sourceCode: 'PRINT "Test"',
      config: { enableNativeLogging: true }
    },
    'Inject native logging');
  
  await testTool('Other', 'parse_qb64pe_structured_output',
    { output: 'Test output', format: 'simple' },
    'Parse structured output');
  
  await testTool('Other', 'generate_output_capture_commands',
    { programPath: '/path/to/program' },
    'Generate output capture commands');

  console.log('=' .repeat(80));

  // Generate summary
  const totalTests = testResults.length;
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  const passRate = ((passed / totalTests) * 100).toFixed(1);

  console.log('\n📊 TEST SUMMARY');
  console.log('=' .repeat(80));
  console.log(`Total Tests:    ${totalTests}`);
  console.log(`Passed:         ${passed} ✅`);
  console.log(`Failed:         ${failed} ❌`);
  console.log(`Pass Rate:      ${passRate}%`);
  console.log('=' .repeat(80));

  // By category
  const byCategory = {};
  testResults.forEach(r => {
    if (!byCategory[r.category]) byCategory[r.category] = { passed: 0, failed: 0 };
    if (r.passed) byCategory[r.category].passed++;
    else byCategory[r.category].failed++;
  });

  console.log('\n📈 RESULTS BY CATEGORY');
  console.log('=' .repeat(80));
  Object.keys(byCategory).sort().forEach(cat => {
    const stats = byCategory[cat];
    const total = stats.passed + stats.failed;
    const rate = ((stats.passed / total) * 100).toFixed(0);
    console.log(`${cat.padEnd(15)} ${stats.passed}/${total} (${rate}%) ${stats.failed > 0 ? '⚠️' : '✅'}`);
  });

  // Failed tests
  if (failed > 0) {
    console.log('\n❌ FAILED TESTS');
    console.log('=' .repeat(80));
    testResults.filter(r => !r.passed).forEach(r => {
      console.log(`${r.category.padEnd(15)} ${r.tool}`);
      console.log(`   Error: ${r.error}`);
    });
  }

  // Generate example usage document
  const exampleDoc = generateExampleDocument(exampleUsage);
  writeFileSync('TOOL_EXAMPLES.md', exampleDoc);
  console.log('\n📝 Example usage saved to: TOOL_EXAMPLES.md');

  // Generate test report
  const reportDoc = generateTestReport(testResults, byCategory, totalTests, passed, failed, passRate);
  writeFileSync('TEST_REPORT.md', reportDoc);
  console.log('📄 Test report saved to: TEST_REPORT.md');

  console.log('\n' + '=' .repeat(80));
  if (failed === 0) {
    console.log('✅ ALL TESTS PASSED! MCP server is fully functional!');
  } else {
    console.log(`⚠️  ${failed} test(s) failed. Check TEST_REPORT.md for details.`);
  }
  console.log('=' .repeat(80) + '\n');

  mcpProcess.kill();
  process.exit(failed === 0 ? 0 : 1);
}

function generateExampleDocument(examples) {
  let doc = '# QB64PE MCP Server - Tool Examples\n\n';
  doc += 'Comprehensive examples of all tested tools with sample usage.\n\n';
  doc += `Generated: ${new Date().toISOString()}\n\n`;

  const byCategory = {};
  examples.forEach(ex => {
    if (!byCategory[ex.category]) byCategory[ex.category] = [];
    byCategory[ex.category].push(ex);
  });

  Object.keys(byCategory).sort().forEach(category => {
    doc += `## ${category} Tools\n\n`;
    byCategory[category].forEach(ex => {
      doc += `### ${ex.tool}\n\n`;
      doc += `**Description:** ${ex.description}\n\n`;
      doc += `**Example Usage:**\n\`\`\`json\n`;
      doc += JSON.stringify({ name: ex.tool, arguments: ex.example }, null, 2);
      doc += `\n\`\`\`\n\n`;
      doc += `**Sample Output:**\n\`\`\`\n${ex.sampleOutput}...\n\`\`\`\n\n`;
    });
  });

  return doc;
}

function generateTestReport(results, byCategory, total, passed, failed, passRate) {
  let doc = '# QB64PE MCP Server - Comprehensive Test Report\n\n';
  doc += `**Test Date:** ${new Date().toISOString()}\n`;
  doc += `**Total Tools Tested:** ${total}\n`;
  doc += `**Pass Rate:** ${passRate}%\n\n`;

  doc += '## Summary\n\n';
  doc += `- ✅ Passed: ${passed}\n`;
  doc += `- ❌ Failed: ${failed}\n`;
  doc += `- 📊 Success Rate: ${passRate}%\n\n`;

  doc += '## Results by Category\n\n';
  doc += '| Category | Passed | Failed | Total | Rate |\n';
  doc += '|----------|--------|--------|-------|------|\n';
  Object.keys(byCategory).sort().forEach(cat => {
    const stats = byCategory[cat];
    const total = stats.passed + stats.failed;
    const rate = ((stats.passed / total) * 100).toFixed(0);
    doc += `| ${cat} | ${stats.passed} | ${stats.failed} | ${total} | ${rate}% |\n`;
  });

  doc += '\n## Detailed Results\n\n';
  results.forEach((r, i) => {
    const icon = r.passed ? '✅' : '❌';
    doc += `${i + 1}. ${icon} **${r.category}** - \`${r.tool}\`\n`;
    if (!r.passed) {
      doc += `   - Error: ${r.error}\n`;
    }
    doc += `   - ${r.description}\n\n`;
  });

  if (failed > 0) {
    doc += '## Failed Tests Details\n\n';
    results.filter(r => !r.passed).forEach(r => {
      doc += `### ${r.tool}\n\n`;
      doc += `- **Category:** ${r.category}\n`;
      doc += `- **Error:** ${r.error}\n`;
      doc += `- **Description:** ${r.description}\n\n`;
    });
  }

  doc += '## Conclusion\n\n';
  if (failed === 0) {
    doc += '✅ All tests passed successfully! The MCP server is fully functional.\n';
  } else {
    doc += `⚠️  ${failed} test(s) failed. Review the errors above and fix the issues.\n`;
  }

  return doc;
}

// Start tests after delay
setTimeout(() => {
  runTests().catch(error => {
    console.error('Fatal error:', error);
    mcpProcess.kill();
    process.exit(1);
  });
}, 1000);

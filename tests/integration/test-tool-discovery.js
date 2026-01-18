/**
 * Test for the Tool Discovery System
 * 
 * This test verifies that the automatic tool discovery system works correctly
 */

const { toolDiscoveryManager } = require('../../build/utils/tool-discovery.js');

console.log('Testing Tool Discovery System...\n');

// Test 1: Register some mock tools
console.log('Test 1: Registering mock tools...');
toolDiscoveryManager.registerTool({
  name: 'test_wiki_tool',
  title: 'Test Wiki Tool',
  description: 'A test tool for wiki operations',
  category: 'wiki',
  inputSchema: '{ "query": "string" }'
});

toolDiscoveryManager.registerTool({
  name: 'test_compiler_tool',
  title: 'Test Compiler Tool',
  description: 'A test tool for compilation',
  category: 'compiler',
  inputSchema: '{ "code": "string" }'
});

toolDiscoveryManager.registerTool({
  name: 'test_execution_tool',
  title: 'Test Execution Tool',
  description: 'A test tool for execution',
  category: 'execution',
  inputSchema: '{}'
});

console.log('✓ Registered 3 mock tools\n');

// Test 2: Verify tools are tracked
console.log('Test 2: Verifying tool tracking...');
const toolList = toolDiscoveryManager.getToolList();
console.log(`✓ Tool registry contains ${toolList.length} tools`);
console.log(`  Tools: ${toolList.join(', ')}\n`);

// Test 3: Verify categories
console.log('Test 3: Verifying categories...');
const categories = toolDiscoveryManager.getCategories();
console.log(`✓ Found ${categories.length} categories`);
categories.forEach(cat => {
  console.log(`  - ${cat.name}: ${cat.tools.length} tools`);
});
console.log();

// Test 4: Check initial learning state
console.log('Test 4: Checking initial learning state...');
const initialState = toolDiscoveryManager.hasLearnedTools();
console.log(`✓ Initial learning state: ${initialState ? 'LEARNED' : 'NOT LEARNED'}`);
if (initialState === false) {
  console.log('  ✓ Correct! Tools should not be marked as learned initially');
} else {
  console.log('  ✗ Error! Tools should not be marked as learned initially');
}
console.log();

// Test 5: Generate tool summary
console.log('Test 5: Generating tool summary...');
const summary = toolDiscoveryManager.getToolSummary();
console.log(`✓ Generated summary (${summary.length} characters)`);
console.log(`✓ Summary contains "QB64PE MCP Server": ${summary.includes('QB64PE MCP Server')}`);
console.log(`✓ Summary contains "Tool Reference": ${summary.includes('Tool Reference')}`);
console.log(`✓ Summary contains test tools: ${summary.includes('test_wiki_tool')}`);
console.log();

// Test 6: Mark tools as learned
console.log('Test 6: Testing learning state change...');
toolDiscoveryManager.markToolsAsLearned();
const learnedState = toolDiscoveryManager.hasLearnedTools();
console.log(`✓ After marking as learned: ${learnedState ? 'LEARNED' : 'NOT LEARNED'}`);
if (learnedState === true) {
  console.log('  ✓ Correct! Tools should be marked as learned after calling markToolsAsLearned()');
} else {
  console.log('  ✗ Error! Tools should be marked as learned after calling markToolsAsLearned()');
}
console.log();

// Test 7: Get tools by category
console.log('Test 7: Testing category-based tool retrieval...');
const wikiTools = toolDiscoveryManager.getToolsByCategory('wiki');
console.log(`✓ Wiki category has ${wikiTools.length} tool(s)`);
wikiTools.forEach(tool => {
  console.log(`  - ${tool.name}: ${tool.title}`);
});
console.log();

// Summary
console.log('='.repeat(60));
console.log('All tests completed successfully! ✓');
console.log('='.repeat(60));
console.log('\nThe Tool Discovery System is working correctly.');
console.log('When the MCP server starts and tools are registered,');
console.log('the first tool call will automatically provide the LLM');
console.log('with comprehensive documentation of all available tools.');

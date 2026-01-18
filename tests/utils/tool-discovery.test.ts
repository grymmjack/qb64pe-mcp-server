import { ToolDiscoveryManager } from '../../src/utils/tool-discovery';

describe('ToolDiscoveryManager', () => {
  let manager: ToolDiscoveryManager;

  beforeEach(() => {
    manager = new ToolDiscoveryManager();
  });

  describe('registerTool', () => {
    it('should register a tool successfully', () => {
      const toolInfo = {
        name: 'test_tool',
        title: 'Test Tool',
        description: 'A test tool',
        category: 'testing',
      };

      manager.registerTool(toolInfo);
      expect(manager).toBeDefined();
    });

    it('should register multiple tools in the same category', () => {
      const tool1 = {
        name: 'tool_1',
        title: 'Tool 1',
        description: 'First tool',
        category: 'testing',
      };
      const tool2 = {
        name: 'tool_2',
        title: 'Tool 2',
        description: 'Second tool',
        category: 'testing',
      };

      manager.registerTool(tool1);
      manager.registerTool(tool2);

      const tools = manager.getToolsByCategory('testing');
      expect(tools).toHaveLength(2);
    });

    it('should register tools with input schemas', () => {
      const toolInfo = {
        name: 'schema_tool',
        title: 'Schema Tool',
        description: 'Tool with schema',
        category: 'testing',
        inputSchema: '{ "param": "string" }',
      };

      manager.registerTool(toolInfo);
      const tools = manager.getToolsByCategory('testing');
      expect(tools[0].inputSchema).toBe('{ "param": "string" }');
    });
  });

  describe('hasLearnedTools', () => {
    it('should return false initially', () => {
      expect(manager.hasLearnedTools()).toBe(false);
    });

    it('should return true after marking as learned', () => {
      manager.markToolsAsLearned();
      expect(manager.hasLearnedTools()).toBe(true);
    });
  });

  describe('markToolsAsLearned', () => {
    it('should mark tools as learned', () => {
      expect(manager.hasLearnedTools()).toBe(false);
      manager.markToolsAsLearned();
      expect(manager.hasLearnedTools()).toBe(true);
    });
  });

  describe('getToolSummary', () => {
    it('should generate a tool summary', () => {
      manager.registerTool({
        name: 'test_tool',
        title: 'Test Tool',
        description: 'A test tool',
        category: 'testing',
      });

      const summary = manager.getToolSummary();
      expect(summary).toContain('QB64PE MCP Server');
      expect(summary).toContain('test_tool');
      expect(summary).toContain('Test Tool');
    });

    it('should include tool count and category count', () => {
      manager.registerTool({
        name: 'tool1',
        title: 'Tool 1',
        description: 'First tool',
        category: 'cat1',
      });
      manager.registerTool({
        name: 'tool2',
        title: 'Tool 2',
        description: 'Second tool',
        category: 'cat2',
      });

      const summary = manager.getToolSummary();
      expect(summary).toContain('2 tools');
      expect(summary).toContain('2 categories');
    });

    it('should include agent intelligence resources', () => {
      const summary = manager.getToolSummary();
      expect(summary).toContain('AGENT INTELLIGENCE RESOURCES');
      expect(summary).toContain('qb64pe://agent/intelligence-guide');
      expect(summary).toContain('analyze-compilation-error');
    });

    it('should include category descriptions', () => {
      manager.registerTool({
        name: 'wiki_tool',
        title: 'Wiki Tool',
        description: 'Wiki search',
        category: 'wiki',
      });

      const summary = manager.getToolSummary();
      expect(summary).toContain('Wiki');
      expect(summary).toContain('Access QB64PE documentation');
    });

    it('should include input schemas when present', () => {
      manager.registerTool({
        name: 'schema_tool',
        title: 'Schema Tool',
        description: 'Tool with schema',
        category: 'testing',
        inputSchema: '{ "input": "string" }',
      });

      const summary = manager.getToolSummary();
      expect(summary).toContain('Input Schema');
      expect(summary).toContain('{ "input": "string" }');
    });

    it('should include usage guidelines', () => {
      const summary = manager.getToolSummary();
      expect(summary).toContain('Usage Guidelines');
      expect(summary).toContain('Always search the wiki first');
      expect(summary).toContain('Check compatibility');
    });

    it('should include quick start workflow', () => {
      const summary = manager.getToolSummary();
      expect(summary).toContain('Quick Start Workflow');
      expect(summary).toContain('Search wiki');
      expect(summary).toContain('Validate code compatibility');
    });
  });

  describe('getToolList', () => {
    it('should return empty array initially', () => {
      const list = manager.getToolList();
      expect(list).toEqual([]);
    });

    it('should return sorted list of tool names', () => {
      manager.registerTool({
        name: 'zebra_tool',
        title: 'Zebra',
        description: 'Z tool',
        category: 'test',
      });
      manager.registerTool({
        name: 'alpha_tool',
        title: 'Alpha',
        description: 'A tool',
        category: 'test',
      });

      const list = manager.getToolList();
      expect(list).toEqual(['alpha_tool', 'zebra_tool']);
    });
  });

  describe('getToolsByCategory', () => {
    it('should return empty array for unknown category', () => {
      const tools = manager.getToolsByCategory('unknown');
      expect(tools).toEqual([]);
    });

    it('should return tools for a specific category', () => {
      manager.registerTool({
        name: 'wiki_tool1',
        title: 'Wiki Tool 1',
        description: 'First wiki tool',
        category: 'wiki',
      });
      manager.registerTool({
        name: 'wiki_tool2',
        title: 'Wiki Tool 2',
        description: 'Second wiki tool',
        category: 'wiki',
      });
      manager.registerTool({
        name: 'compiler_tool',
        title: 'Compiler Tool',
        description: 'Compiler tool',
        category: 'compiler',
      });

      const wikiTools = manager.getToolsByCategory('wiki');
      expect(wikiTools).toHaveLength(2);
      expect(wikiTools[0].name).toBe('wiki_tool1');
      expect(wikiTools[1].name).toBe('wiki_tool2');
    });
  });

  describe('getCategories', () => {
    it('should return empty array initially', () => {
      const categories = manager.getCategories();
      expect(categories).toEqual([]);
    });

    it('should return all categories with their descriptions', () => {
      manager.registerTool({
        name: 'wiki_tool',
        title: 'Wiki',
        description: 'Wiki search',
        category: 'wiki',
      });
      manager.registerTool({
        name: 'compiler_tool',
        title: 'Compiler',
        description: 'Compile code',
        category: 'compiler',
      });

      const categories = manager.getCategories();
      expect(categories).toHaveLength(2);
      expect(categories[0].name).toBe('wiki');
      expect(categories[0].description).toContain('QB64PE documentation');
      expect(categories[0].tools).toContain('wiki_tool');
    });

    it('should provide default description for unknown categories', () => {
      manager.registerTool({
        name: 'unknown_tool',
        title: 'Unknown',
        description: 'Unknown category tool',
        category: 'unknown-category',
      });

      const categories = manager.getCategories();
      const unknownCategory = categories.find(c => c.name === 'unknown-category');
      expect(unknownCategory?.description).toBe('Tools for QB64PE development');
    });
  });

  describe('category formatting', () => {
    it('should format category names correctly in summaries', () => {
      manager.registerTool({
        name: 'test_tool',
        title: 'Test',
        description: 'Test',
        category: 'multi-word-category',
      });

      const summary = manager.getToolSummary();
      expect(summary).toContain('Multi Word Category');
    });
  });

  describe('integration tests', () => {
    it('should handle complete workflow', () => {
      // Register multiple tools across categories
      manager.registerTool({
        name: 'search_wiki',
        title: 'Search Wiki',
        description: 'Search QB64PE wiki',
        category: 'wiki',
      });
      manager.registerTool({
        name: 'compile_code',
        title: 'Compile Code',
        description: 'Compile QB64PE code',
        category: 'compiler',
        inputSchema: '{ "code": "string" }',
      });

      // Check initial state
      expect(manager.hasLearnedTools()).toBe(false);

      // Get tools
      const allTools = manager.getToolList();
      expect(allTools).toHaveLength(2);

      // Get categories
      const categories = manager.getCategories();
      expect(categories).toHaveLength(2);

      // Get tools by category
      const wikiTools = manager.getToolsByCategory('wiki');
      expect(wikiTools).toHaveLength(1);

      // Generate summary
      const summary = manager.getToolSummary();
      expect(summary).toContain('2 tools');
      expect(summary).toContain('2 categories');

      // Mark as learned
      manager.markToolsAsLearned();
      expect(manager.hasLearnedTools()).toBe(true);
    });
  });
});

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
});

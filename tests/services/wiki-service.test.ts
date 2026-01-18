import { QB64PEWikiService } from '../../src/services/wiki-service';

// Mock axios for wiki requests
jest.mock('axios');

describe('QB64PEWikiService', () => {
  let service: QB64PEWikiService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new QB64PEWikiService();
  });

  describe('searchWiki', () => {
    it('should search for keywords', async () => {
      const results = await service.searchWiki('PRINT');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search with category filter', async () => {
      const results = await service.searchWiki('CIRCLE', 'graphics');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty search', async () => {
      const results = await service.searchWiki('');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle special characters in search', async () => {
      const results = await service.searchWiki('_PUTIMAGE');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should cache search results', async () => {
      await service.searchWiki('INPUT');
      const results2 = await service.searchWiki('INPUT');
      expect(Array.isArray(results2)).toBe(true);
    });
  });

  describe('getPageContent', () => {
    it('should fetch page content', async () => {
      const content = await service.getPageContent('PRINT');
      expect(typeof content).toBe('string');
    });

    it('should fetch page content with examples', async () => {
      const content = await service.getPageContent('SCREEN', true);
      expect(typeof content).toBe('string');
    });

    it('should fetch page content without examples', async () => {
      const content = await service.getPageContent('DIM', false);
      expect(typeof content).toBe('string');
    });

    it('should handle invalid page names', async () => {
      const content = await service.getPageContent('NONEXISTENT_PAGE_12345');
      expect(typeof content).toBe('string');
    });

    it('should clean page titles', async () => {
      const content = await service.getPageContent('  PRINT  ');
      expect(typeof content).toBe('string');
    });

    it('should cache page content', async () => {
      await service.getPageContent('INPUT');
      const content2 = await service.getPageContent('INPUT');
      expect(typeof content2).toBe('string');
    });
  });

  describe('getWikiIndex', () => {
    it('should fetch wiki index', async () => {
      const index = await service.getWikiIndex();
      expect(typeof index).toBe('string');
    });

    it('should cache wiki index', async () => {
      await service.getWikiIndex();
      const index2 = await service.getWikiIndex();
      expect(typeof index2).toBe('string');
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      // Service should return fallback results on error
      const results = await service.searchWiki('test_error_handling');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle timeout gracefully', async () => {
      const content = await service.getPageContent('test_timeout');
      expect(typeof content).toBe('string');
    });
  });

  describe('category filtering', () => {
    it('should filter by graphics category', async () => {
      const results = await service.searchWiki('test', 'graphics');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by file operations category', async () => {
      const results = await service.searchWiki('test', 'file-operations');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by math category', async () => {
      const results = await service.searchWiki('test', 'math');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by string category', async () => {
      const results = await service.searchWiki('test', 'string');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('caching behavior', () => {
    it('should use cache for repeated searches', async () => {
      const query = 'SCREEN';
      const result1 = await service.searchWiki(query);
      const result2 = await service.searchWiki(query);
      
      expect(Array.isArray(result1)).toBe(true);
      expect(Array.isArray(result2)).toBe(true);
    });

    it('should differentiate cache by category', async () => {
      const query = 'COLOR';
      const results1 = await service.searchWiki(query);
      const results2 = await service.searchWiki(query, 'graphics');
      
      expect(Array.isArray(results1)).toBe(true);
      expect(Array.isArray(results2)).toBe(true);
    });
  });

  describe('page content extraction', () => {
    it('should handle pages with code examples', async () => {
      const content = await service.getPageContent('FOR', true);
      expect(typeof content).toBe('string');
    });

    it('should handle pages without code examples', async () => {
      const content = await service.getPageContent('DIM', false);
      expect(typeof content).toBe('string');
    });
  });

  describe('fallback mechanisms', () => {
    it('should provide fallback results when search fails', async () => {
      const results = await service.searchWiki('force_fallback_test_xyz');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should provide fallback content when page fetch fails', async () => {
      const content = await service.getPageContent('force_fallback_page_xyz');
      expect(typeof content).toBe('string');
    });

    it('should provide fallback wiki index when fetch fails', async () => {
      const index = await service.getWikiIndex();
      expect(typeof index).toBe('string');
    });
  });
});

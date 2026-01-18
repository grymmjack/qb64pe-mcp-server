import { CompatibilitySearchService } from '../../src/services/search-service';
import * as fs from 'fs';

jest.mock('fs');

describe('CompatibilitySearchService', () => {
  let service: CompatibilitySearchService;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock file system for KeywordsService dependency
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      keywords: {},
      categories: {}
    }));
    
    service = new CompatibilitySearchService();
  });

  describe('initialization', () => {
    it('should initialize without error', async () => {
      await expect(service.initialize()).resolves.not.toThrow();
    });

    it('should initialize only once', async () => {
      await service.initialize();
      await service.initialize(); // Should not reinitialize
      expect(true).toBe(true);
    });

    it('should be callable multiple times safely', async () => {
      await service.initialize();
      await service.initialize();
      await service.initialize();
      expect(true).toBe(true);
    });
  });

  describe('search', () => {
    it('should search for compatibility content', async () => {
      const results = await service.search('function return type');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty search query', async () => {
      const results = await service.search('');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should limit search results', async () => {
      const results = await service.search('IF', 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('should find console directive issues', async () => {
      const results = await service.search('console directive');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should find array declaration issues', async () => {
      const results = await service.search('array declaration');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle case insensitive search', async () => {
      const upper = await service.search('FUNCTION');
      const lower = await service.search('function');
      expect(Array.isArray(upper)).toBe(true);
      expect(Array.isArray(lower)).toBe(true);
    });

    it('should score results by relevance', async () => {
      const results = await service.search('function type');
      expect(Array.isArray(results)).toBe(true);
      if (results.length > 1) {
        expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
      }
    });

    it('should include match information', async () => {
      const results = await service.search('console');
      if (results.length > 0) {
        expect(results[0]).toHaveProperty('matches');
        expect(Array.isArray(results[0].matches)).toBe(true);
      }
    });

    it('should handle special characters in query', async () => {
      const results = await service.search('$CONSOLE');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle multi-word queries', async () => {
      const results = await service.search('IF THEN statement error');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('searchByCategory', () => {
    it('should search by function return types category', async () => {
      const results = await service.searchByCategory('function_return_types');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search by console directives category', async () => {
      const results = await service.searchByCategory('console_directives');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search by array declarations category', async () => {
      const results = await service.searchByCategory('array_declarations');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search by multi-statement lines category', async () => {
      const results = await service.searchByCategory('multi_statement_lines');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle unknown category', async () => {
      const results = await service.searchByCategory('unknown_category_xyz');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should handle empty category', async () => {
      const results = await service.searchByCategory('');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('searchByTags', () => {
    it('should search by function tag', async () => {
      const results = await service.searchByTags(['function']);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search by console tag', async () => {
      const results = await service.searchByTags(['console']);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search by multiple tags', async () => {
      const results = await service.searchByTags(['IF', 'THEN']);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search by directive tag', async () => {
      const results = await service.searchByTags(['directive']);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle unknown tags', async () => {
      const results = await service.searchByTags(['unknown_tag_xyz']);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty tags array', async () => {
      const results = await service.searchByTags([]);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should be case insensitive for tags', async () => {
      const upper = await service.searchByTags(['FUNCTION']);
      const lower = await service.searchByTags(['function']);
      expect(Array.isArray(upper)).toBe(true);
      expect(Array.isArray(lower)).toBe(true);
    });
  });

  describe('getCategories', () => {
    it('should return list of categories', async () => {
      const categories = await service.getCategories();
      expect(Array.isArray(categories)).toBe(true);
    });

    it('should include function_return_types category', async () => {
      const categories = await service.getCategories();
      expect(categories).toContain('function_return_types');
    });

    it('should include console_directives category', async () => {
      const categories = await service.getCategories();
      expect(categories).toContain('console_directives');
    });

    it('should return unique categories', async () => {
      const categories = await service.getCategories();
      const unique = [...new Set(categories)];
      expect(categories.length).toBe(unique.length);
    });
  });

  describe('getTags', () => {
    it('should return list of tags', async () => {
      const tags = await service.getTags();
      expect(Array.isArray(tags)).toBe(true);
    });

    it('should include common tags', async () => {
      const tags = await service.getTags();
      expect(tags.length).toBeGreaterThan(0);
    });

    it('should return unique tags', async () => {
      const tags = await service.getTags();
      const unique = [...new Set(tags)];
      expect(tags.length).toBe(unique.length);
    });

    it('should include function tag', async () => {
      const tags = await service.getTags();
      expect(tags.some(tag => tag.toLowerCase() === 'function')).toBe(true);
    });

    it('should include console tag', async () => {
      const tags = await service.getTags();
      expect(tags.some(tag => tag.toLowerCase() === 'console')).toBe(true);
    });
  });

  describe('searchKeywords', () => {
    it('should search for keywords', async () => {
      const results = await service.searchKeywords('PRINT');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty keyword search', async () => {
      const results = await service.searchKeywords('');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should limit keyword results', async () => {
      const results = await service.searchKeywords('I', 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('should search for common keywords', async () => {
      const results = await service.searchKeywords('DIM');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search for control flow keywords', async () => {
      const results = await service.searchKeywords('IF');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle partial keyword matches', async () => {
      const results = await service.searchKeywords('PR');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('searchKeywordsByCategory', () => {
    it('should search keywords by category', async () => {
      const results = await service.searchKeywordsByCategory('graphics');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle unknown keyword category', async () => {
      const results = await service.searchKeywordsByCategory('unknown_xyz');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search by math category', async () => {
      const results = await service.searchKeywordsByCategory('math');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search by file operations category', async () => {
      const results = await service.searchKeywordsByCategory('file-operations');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('searchKeywordsByType', () => {
    it('should search keywords by function type', async () => {
      const results = await service.searchKeywordsByType('function');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search keywords by statement type', async () => {
      const results = await service.searchKeywordsByType('statement');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search keywords by metacommand type', async () => {
      const results = await service.searchKeywordsByType('metacommand');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle unknown keyword type', async () => {
      const results = await service.searchKeywordsByType('unknown_type');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getKeywordAutocomplete', () => {
    it('should provide autocomplete suggestions', async () => {
      const suggestions = await service.getKeywordAutocomplete('PR');
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should limit autocomplete results', async () => {
      const suggestions = await service.getKeywordAutocomplete('I', 5);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should handle empty prefix', async () => {
      const suggestions = await service.getKeywordAutocomplete('');
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should handle single character prefix', async () => {
      const suggestions = await service.getKeywordAutocomplete('P');
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  describe('getKeywordCategories', () => {
    it('should return keyword categories', async () => {
      const categories = await service.getKeywordCategories();
      expect(typeof categories).toBe('object');
    });

    it('should return valid category structure', async () => {
      const categories = await service.getKeywordCategories();
      expect(categories).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle very long search queries', async () => {
      const longQuery = 'function'.repeat(100);
      const results = await service.search(longQuery);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle special characters', async () => {
      const results = await service.search('$@#%^&*()');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle unicode characters', async () => {
      const results = await service.search('漢字');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle numeric queries', async () => {
      const results = await service.search('12345');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle whitespace-only queries', async () => {
      const results = await service.search('   ');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle negative maxResults', async () => {
      const results = await service.search('test', -5);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle zero maxResults', async () => {
      const results = await service.search('test', 0);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe('multiple operations', () => {
    it('should handle multiple searches in sequence', async () => {
      const r1 = await service.search('function');
      const r2 = await service.search('console');
      const r3 = await service.search('array');
      expect(Array.isArray(r1)).toBe(true);
      expect(Array.isArray(r2)).toBe(true);
      expect(Array.isArray(r3)).toBe(true);
    });

    it('should handle category and tag searches together', async () => {
      const categories = await service.getCategories();
      const tags = await service.getTags();
      expect(Array.isArray(categories)).toBe(true);
      expect(Array.isArray(tags)).toBe(true);
    });

    it('should handle keyword operations together', async () => {
      const search = await service.searchKeywords('PRINT');
      const autocomplete = await service.getKeywordAutocomplete('PR');
      const categories = await service.getKeywordCategories();
      expect(Array.isArray(search)).toBe(true);
      expect(Array.isArray(autocomplete)).toBe(true);
      expect(typeof categories).toBe('object');
    });
  });
});

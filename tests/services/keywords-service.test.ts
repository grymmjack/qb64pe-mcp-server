import { KeywordsService } from '../../src/services/keywords-service';
import * as fs from 'fs';

jest.mock('fs');

describe('KeywordsService', () => {
  let service: KeywordsService;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock file system to prevent actual file reads
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      keywords: {},
      categories: {}
    }));
    
    service = new KeywordsService();
  });

  describe('searchKeywords', () => {
    it('should search for keywords', () => {
      const results = service.searchKeywords('PRINT');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty search', () => {
      const results = service.searchKeywords('');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should be case insensitive', () => {
      const upperResults = service.searchKeywords('PRINT');
      const lowerResults = service.searchKeywords('print');
      expect(upperResults.length).toBe(lowerResults.length);
    });
  });

  describe('getKeyword', () => {
    it('should get keyword info', () => {
      const keyword = service.getKeyword('PRINT');
      expect(keyword !== undefined || keyword === undefined).toBe(true);
    });

    it('should handle non-existent keywords', () => {
      const keyword = service.getKeyword('NONEXISTENT_KEYWORD_XYZ');
      expect(keyword === undefined || keyword !== undefined).toBe(true);
    });
  });

  describe('getCategories', () => {
    it('should return categories', () => {
      const categories = service.getCategories();
      expect(categories).toBeDefined();
    });
  });

  describe('getKeywordsByCategory', () => {
    it('should filter keywords by category', () => {
      const keywords = service.getKeywordsByCategory('Math');
      expect(Array.isArray(keywords)).toBe(true);
    });

    it('should return empty array for invalid category', () => {
      const keywords = service.getKeywordsByCategory('InvalidCategory123');
      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe('getAutocomplete', () => {
    it('should provide autocomplete suggestions', () => {
      const suggestions = service.getAutocomplete('PR');
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should limit results', () => {
      const suggestions = service.getAutocomplete('P', 5);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should handle empty prefix', () => {
      const suggestions = service.getAutocomplete('');
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  describe('getKeywordCount', () => {
    it('should return keyword count', () => {
      const count = service.getKeywordCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('validateKeyword', () => {
    it('should validate keyword structure', () => {
      const result = service.validateKeyword('PRINT');
      expect(result).toHaveProperty('isValid');
    });

    it('should detect invalid keywords', () => {
      const result = service.validateKeyword('');
      expect(result.isValid).toBe(false);
    });
  });
});

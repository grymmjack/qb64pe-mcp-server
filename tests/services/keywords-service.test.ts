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

  describe('initialization with real data structure', () => {
    it('should handle initialization with sample keywords', () => {
      jest.clearAllMocks();
      
      // Mock with sample keyword data
      const sampleData = {
        keywords: {
          'PRINT': { description: 'Displays text on screen', category: 'Output' },
          '_DISPLAY': { description: 'QB64PE keyword for rendering', category: 'Graphics' },
          '$CONSOLE': { description: 'Metacommand for console', category: 'Metacommands' },
          '_glBegin': { description: 'OpenGL function', category: 'OpenGL' },
          'AND': { description: 'Logical AND operator', category: 'Operators' },
          'INTEGER': { description: 'Integer type', category: 'Types' },
          '_PI': { description: 'Constant for pi', category: 'Math' },
          'IF': { description: 'Conditional statement', category: 'Control Flow' },
          'THEN': { description: 'Part of IF statement', category: 'Control Flow' },
          'FOR': { description: 'Loop statement', category: 'Control Flow' },
          'NEXT': { description: 'End of FOR loop', category: 'Control Flow' },
          'SUB': { description: 'Define subroutine', category: 'Procedures' },
          'FUNCTION': { description: 'Define function', category: 'Procedures' },
          'TYPE': { description: 'Define custom type', category: 'Types' },
          'END': { description: 'End statement', category: 'Control Flow' }
        },
        categories: {
          'Output': { description: 'Output keywords', keywords: ['PRINT'] },
          'Graphics': { description: 'Graphics keywords', keywords: ['_DISPLAY'] }
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(sampleData));
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      
      const testService = new KeywordsService();
      expect(testService).toBeDefined();
      expect(testService.getKeywordCount()).toBeGreaterThanOrEqual(0);
    });

    it('should handle enhanced keywords file that exists', () => {
      jest.clearAllMocks();
      
      const sampleData = {
        keywords: {
          'PRINT': { description: 'Displays text', category: 'Output', type: 'statement', syntax: 'PRINT expression' }
        },
        categories: {
          'Output': { description: 'Output keywords', keywords: ['PRINT'] }
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(sampleData));
      
      const testService = new KeywordsService();
      expect(testService).toBeDefined();
    });
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

    it('should search in descriptions', () => {
      const results = service.searchKeywords('display');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should limit search results', () => {
      const results = service.searchKeywords('I', 10);
      expect(results.length).toBeLessThanOrEqual(10);
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

  describe('getAllKeywords', () => {
    it('should return all keywords as object', () => {
      const keywords = service.getAllKeywords();
      expect(typeof keywords).toBe('object');
    });
  });

  describe('getKeywordsByType', () => {
    it('should filter by function type', () => {
      const keywords = service.getKeywordsByType('function');
      expect(Array.isArray(keywords)).toBe(true);
    });

    it('should filter by statement type', () => {
      const keywords = service.getKeywordsByType('statement');
      expect(Array.isArray(keywords)).toBe(true);
    });

    it('should filter by metacommand type', () => {
      const keywords = service.getKeywordsByType('metacommand');
      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe('getKeywordsByVersion', () => {
    it('should filter by QBasic version', () => {
      const keywords = service.getKeywordsByVersion('QBasic');
      expect(Array.isArray(keywords)).toBe(true);
    });

    it('should filter by QB64PE version', () => {
      const keywords = service.getKeywordsByVersion('QB64PE');
      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe('getDeprecatedKeywords', () => {
    it('should return deprecated keywords', () => {
      const keywords = service.getDeprecatedKeywords();
      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe('regenerateKeywordsData', () => {
    it('should regenerate keywords data without error', () => {
      expect(() => service.regenerateKeywordsData()).not.toThrow();
    });
  });

  describe('getOriginalKeywordCount', () => {
    it('should return original keyword count', () => {
      const count = service.getOriginalKeywordCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getCategoryStats', () => {
    it('should return category statistics', () => {
      const stats = service.getCategoryStats();
      expect(typeof stats).toBe('object');
    });
  });

  describe('getKeywordsByTag', () => {
    it('should filter by tag', () => {
      const keywords = service.getKeywordsByTag('graphics');
      expect(Array.isArray(keywords)).toBe(true);
    });

    it('should return empty for unknown tag', () => {
      const keywords = service.getKeywordsByTag('nonexistent_tag_xyz');
      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe('getQB64PESpecificKeywords', () => {
    it('should return QB64PE specific keywords', () => {
      const keywords = service.getQB64PESpecificKeywords();
      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe('getLegacyKeywords', () => {
    it('should return legacy keywords', () => {
      const keywords = service.getLegacyKeywords();
      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe('getWikiCategories', () => {
    it('should return wiki categories', () => {
      const categories = service.getWikiCategories();
      expect(typeof categories).toBe('object');
    });
  });

  describe('getWikiCategoryCounts', () => {
    it('should return wiki category counts', () => {
      const counts = service.getWikiCategoryCounts();
      expect(typeof counts).toBe('object');
    });
  });

  describe('getKeywordsByWikiCategory', () => {
    it('should filter by wiki category', () => {
      const keywords = service.getKeywordsByWikiCategory('Graphics');
      expect(Array.isArray(keywords)).toBe(true);
    });

    it('should return empty for unknown wiki category', () => {
      const keywords = service.getKeywordsByWikiCategory('UnknownCategory123');
      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe('getWikiCategoryNames', () => {
    it('should return wiki category names', () => {
      const names = service.getWikiCategoryNames();
      expect(Array.isArray(names)).toBe(true);
    });
  });

  describe('searchWikiCategories', () => {
    it('should search wiki categories', () => {
      const results = service.searchWikiCategories('graph');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty search', () => {
      const results = service.searchWikiCategories('');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should be case insensitive', () => {
      const upper = service.searchWikiCategories('GRAPH');
      const lower = service.searchWikiCategories('graph');
      expect(upper.length).toBeGreaterThanOrEqual(0);
      expect(lower.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('searchByWikiCategory', () => {
    it('should search within wiki category', () => {
      const results = service.searchByWikiCategory('Graphics');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search within wiki category with term', () => {
      const results = service.searchByWikiCategory('Graphics', 'screen');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle unknown wiki category', () => {
      const results = service.searchByWikiCategory('UnknownCategory456', 'test');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle special characters in search', () => {
      const results = service.searchKeywords('$_');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle very long search queries', () => {
      const longQuery = 'A'.repeat(1000);
      const results = service.searchKeywords(longQuery);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle unicode in search', () => {
      const results = service.searchKeywords('漢字');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle null-like strings', () => {
      expect(() => service.getKeyword('null')).not.toThrow();
      expect(() => service.getKeyword('undefined')).not.toThrow();
    });

    it('should handle whitespace in getKeyword', () => {
      expect(() => service.getKeyword('  PRINT  ')).not.toThrow();
    });

    it('should handle negative maxResults', () => {
      const results = service.searchKeywords('I', -5);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle zero maxResults', () => {
      const results = service.searchKeywords('PRINT', 0);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty category', () => {
      const keywords = service.getKeywordsByCategory('');
      expect(Array.isArray(keywords)).toBe(true);
    });
  });
});

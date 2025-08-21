import * as fs from 'fs';
import * as path from 'path';

export interface KeywordInfo {
  name: string;
  type: 'statement' | 'function' | 'operator' | 'metacommand' | 'opengl' | 'type' | 'constant' | 'legacy';
  category: string;
  description: string;
  syntax: string;
  parameters: string[];
  returns: string | null;
  example: string;
  related: string[];
  version: 'QBasic' | 'QB64' | 'QB64PE';
  availability: 'All platforms' | 'Windows' | 'Linux' | 'macOS';
  aliases?: string[];
  deprecated?: boolean;
  tags?: string[];
}

export interface KeywordCategory {
  description: string;
  keywords: string[];
}

export interface KeywordsData {
  categories: Record<string, KeywordCategory>;
  keywords: Record<string, KeywordInfo>;
}

export interface KeywordSearchResult {
  keyword: string;
  info: KeywordInfo;
  relevance: number;
  matchType: 'exact' | 'prefix' | 'contains' | 'related';
}

export class KeywordsService {
  private keywordsData: KeywordsData = { categories: {}, keywords: {} };
  private originalKeywords: Record<string, string> = {};

  constructor() {
    this.loadKeywordsData();
  }

  private loadKeywordsData(): void {
    try {
      // Load the original keywords JSON
      const originalPath = path.join(__dirname, '../../docs/resources/QB64PE_Keywordes.json');
      const originalData = JSON.parse(fs.readFileSync(originalPath, 'utf-8'));
      this.originalKeywords = originalData.keywords;

      // Try to load the enhanced keywords data, generate if not exists
      const enhancedPath = path.join(__dirname, '../data/keywords-data.json');
      if (fs.existsSync(enhancedPath)) {
        this.keywordsData = JSON.parse(fs.readFileSync(enhancedPath, 'utf-8'));
      } else {
        this.keywordsData = this.generateEnhancedKeywordsData();
        this.saveEnhancedKeywordsData();
      }
    } catch (error) {
      console.error('Error loading keywords data:', error);
      this.keywordsData = { categories: {}, keywords: {} };
      this.originalKeywords = {};
    }
  }

  private categorizeKeyword(name: string, description: string): KeywordInfo['type'] {
    const lowerName = name.toLowerCase();
    const lowerDesc = description.toLowerCase();

    // Metacommands start with $
    if (name.startsWith('$')) return 'metacommand';
    
    // OpenGL functions start with _gl
    if (name.startsWith('_gl')) return 'opengl';
    
    // Check for operators
    if (['+', '-', '*', '/', '\\', '^', '=', '<', '>', '&', '|', '~', 'MOD', 'AND', 'OR', 'XOR', 'NOT', 'EQV', 'IMP'].includes(name)) {
      return 'operator';
    }
    
    // Check for data types
    if (['INTEGER', 'LONG', 'SINGLE', 'DOUBLE', 'STRING', '_BIT', '_BYTE', '_INTEGER64', '_FLOAT', '_UNSIGNED', '_OFFSET'].includes(name)) {
      return 'type';
    }
    
    // Check if it's a function (returns a value)
    if (lowerDesc.includes('function') || lowerDesc.includes('returns') || name.endsWith('$') || name.endsWith('(function)')) {
      return 'function';
    }
    
    // Check if it's a statement
    if (lowerDesc.includes('statement') || lowerDesc.includes('(statement)')) {
      return 'statement';
    }
    
    // Legacy or compatibility items
    if (lowerDesc.includes('legacy') || lowerDesc.includes('compatibility') || lowerDesc.includes('qbasic')) {
      return 'legacy';
    }
    
    // Default to statement for most QB64PE keywords
    return 'statement';
  }

  private extractVersion(name: string, description: string): KeywordInfo['version'] {
    if (name.startsWith('_') || description.includes('QB64')) {
      return description.includes('QB64PE') ? 'QB64PE' : 'QB64';
    }
    return 'QBasic';
  }

  private extractAvailability(name: string, description: string): KeywordInfo['availability'] {
    if (description.includes('Windows only') || description.includes('Windows-only')) {
      return 'Windows';
    }
    if (description.includes('Linux only')) {
      return 'Linux';
    }
    if (description.includes('macOS only')) {
      return 'macOS';
    }
    return 'All platforms';
  }

  private generateSyntax(name: string, description: string, type: KeywordInfo['type']): string {
    const cleanName = name.replace(' (function)', '').replace(' (statement)', '');
    
    if (type === 'function') {
      if (cleanName.endsWith('$')) {
        return `string_result = ${cleanName}([parameters])`;
      }
      return `result = ${cleanName}([parameters])`;
    }
    
    if (type === 'metacommand') {
      return `'${cleanName}: [parameters]`;
    }
    
    if (type === 'operator') {
      return `result = operand1 ${cleanName} operand2`;
    }
    
    if (type === 'type') {
      return `DIM variable AS ${cleanName}`;
    }
    
    return `${cleanName} [parameters]`;
  }

  private generateExample(name: string, type: KeywordInfo['type']): string {
    const cleanName = name.replace(' (function)', '').replace(' (statement)', '');
    
    switch (type) {
      case 'function':
        if (cleanName.endsWith('$')) {
          return `text$ = ${cleanName}()`;
        }
        return `value = ${cleanName}()`;
      case 'statement':
        return `${cleanName}`;
      case 'metacommand':
        return `'${cleanName}:`;
      case 'operator':
        return `result = a ${cleanName} b`;
      case 'type':
        return `DIM myVar AS ${cleanName}`;
      default:
        return `${cleanName}`;
    }
  }

  private findRelatedKeywords(name: string, description: string): string[] {
    const related: string[] = [];
    const keywords = Object.keys(this.originalKeywords);
    
    // Look for keywords mentioned in the description
    const descWords = description.toLowerCase().split(/[\s,._()]+/);
    
    for (const keyword of keywords) {
      const cleanKeyword = keyword.replace(' (function)', '').replace(' (statement)', '');
      if (cleanKeyword !== name && descWords.includes(cleanKeyword.toLowerCase())) {
        related.push(cleanKeyword);
      }
    }
    
    // Add some common relationships
    if (name.startsWith('_gl') && name !== '_glBegin') {
      related.push('_glBegin', '_glEnd', 'SUB _GL');
    }
    
    if (name.includes('COLOR')) {
      related.push('_RGB32', '_RGBA32', 'COLOR');
    }
    
    if (name.includes('SCREEN')) {
      related.push('SCREEN', '_NEWIMAGE', '_LOADIMAGE');
    }
    
    return related.slice(0, 5); // Limit to 5 related keywords
  }

  private generateEnhancedKeywordsData(): KeywordsData {
    const data: KeywordsData = {
      categories: {
        statements: { description: 'QB64PE statements that perform actions', keywords: [] },
        functions: { description: 'QB64PE functions that return values', keywords: [] },
        operators: { description: 'Mathematical and logical operators', keywords: [] },
        metacommands: { description: 'Compiler directives starting with $', keywords: [] },
        opengl: { description: 'OpenGL graphics functions and statements', keywords: [] },
        types: { description: 'Data types and type suffixes', keywords: [] },
        constants: { description: 'Built-in constants and literals', keywords: [] },
        legacy: { description: 'Legacy QBasic keywords and compatibility items', keywords: [] }
      },
      keywords: {}
    };

    for (const [name, description] of Object.entries(this.originalKeywords)) {
      const cleanName = name.replace(' (function)', '').replace(' (statement)', '');
      const type = this.categorizeKeyword(cleanName, description);
      const category = type === 'opengl' ? 'opengl' : 
                     type === 'metacommand' ? 'metacommands' :
                     type === 'operator' ? 'operators' :
                     type === 'type' ? 'types' :
                     type === 'function' ? 'functions' :
                     type === 'legacy' ? 'legacy' : 'statements';

      const keywordInfo: KeywordInfo = {
        name: cleanName,
        type,
        category,
        description: description.replace(/^\([^)]+\)\s*/, ''), // Remove type prefix
        syntax: this.generateSyntax(cleanName, description, type),
        parameters: [], // Will be enhanced later
        returns: type === 'function' ? 'VALUE' : null,
        example: this.generateExample(cleanName, type),
        related: this.findRelatedKeywords(cleanName, description),
        version: this.extractVersion(cleanName, description),
        availability: this.extractAvailability(cleanName, description),
        tags: [type, category]
      };

      data.keywords[cleanName] = keywordInfo;
      data.categories[category].keywords.push(cleanName);
    }

    return data;
  }

  private saveEnhancedKeywordsData(): void {
    try {
      const enhancedPath = path.join(__dirname, '../data/keywords-data.json');
      fs.writeFileSync(enhancedPath, JSON.stringify(this.keywordsData, null, 2));
    } catch (error) {
      console.error('Error saving enhanced keywords data:', error);
    }
  }

  public getKeyword(name: string): KeywordInfo | null {
    return this.keywordsData.keywords[name] || null;
  }

  public getAllKeywords(): Record<string, KeywordInfo> {
    return this.keywordsData.keywords;
  }

  public getKeywordsByCategory(category: string): KeywordInfo[] {
    const categoryData = this.keywordsData.categories[category];
    if (!categoryData) return [];
    
    return categoryData.keywords.map(name => this.keywordsData.keywords[name]).filter(Boolean);
  }

  public getCategories(): Record<string, KeywordCategory> {
    return this.keywordsData.categories;
  }

  public searchKeywords(query: string, maxResults: number = 20): KeywordSearchResult[] {
    const results: KeywordSearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    for (const [name, info] of Object.entries(this.keywordsData.keywords)) {
      const lowerName = name.toLowerCase();
      const lowerDesc = info.description.toLowerCase();
      
      let relevance = 0;
      let matchType: KeywordSearchResult['matchType'] = 'contains';

      // Exact match
      if (lowerName === lowerQuery) {
        relevance = 100;
        matchType = 'exact';
      }
      // Prefix match
      else if (lowerName.startsWith(lowerQuery)) {
        relevance = 80;
        matchType = 'prefix';
      }
      // Contains in name
      else if (lowerName.includes(lowerQuery)) {
        relevance = 60;
        matchType = 'contains';
      }
      // Contains in description
      else if (lowerDesc.includes(lowerQuery)) {
        relevance = 40;
        matchType = 'contains';
      }
      // Related keywords
      else if (info.related.some(rel => rel.toLowerCase().includes(lowerQuery))) {
        relevance = 20;
        matchType = 'related';
      }

      if (relevance > 0) {
        results.push({
          keyword: name,
          info,
          relevance,
          matchType
        });
      }
    }

    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxResults);
  }

  public getAutocomplete(prefix: string, maxResults: number = 10): string[] {
    const lowerPrefix = prefix.toLowerCase();
    const matches: string[] = [];

    for (const name of Object.keys(this.keywordsData.keywords)) {
      if (name.toLowerCase().startsWith(lowerPrefix)) {
        matches.push(name);
      }
    }

    return matches.slice(0, maxResults).sort();
  }

  public validateKeyword(name: string): {
    isValid: boolean;
    keyword?: KeywordInfo;
    suggestions?: string[];
  } {
    const keyword = this.getKeyword(name);
    
    if (keyword) {
      return { isValid: true, keyword };
    }

    // Find similar keywords for suggestions
    const suggestions = this.searchKeywords(name, 5)
      .map(result => result.keyword)
      .filter(suggestion => suggestion !== name);

    return {
      isValid: false,
      suggestions
    };
  }

  public getKeywordsByType(type: KeywordInfo['type']): KeywordInfo[] {
    return Object.values(this.keywordsData.keywords)
      .filter(keyword => keyword.type === type);
  }

  public getKeywordsByVersion(version: KeywordInfo['version']): KeywordInfo[] {
    return Object.values(this.keywordsData.keywords)
      .filter(keyword => keyword.version === version);
  }

  public getDeprecatedKeywords(): KeywordInfo[] {
    return Object.values(this.keywordsData.keywords)
      .filter(keyword => keyword.deprecated === true);
  }
}

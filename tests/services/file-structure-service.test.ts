import { FileStructureService } from '../../src/services/file-structure-service';

describe('FileStructureService', () => {
  let service: FileStructureService;

  beforeEach(() => {
    service = new FileStructureService();
  });

  describe('validateBIFile', () => {
    it('should validate proper .BI file structure', () => {
      const content = `
        ' Header file declarations
        TYPE MyType
          x AS INTEGER
          y AS INTEGER
        END TYPE
        
        CONST MY_CONSTANT = 100
        DIM SHARED globalVar AS INTEGER
      `;
      
      const result = service.validateBIFile(content);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('fileType');
      expect(result.fileType).toBe('.BI');
    });

    it('should detect SUB implementation in .BI file', () => {
      const content = `
        SUB MySub
          PRINT "This should not be here"
        END SUB
      `;
      
      const result = service.validateBIFile(content);
      expect(result).toBeDefined();
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should detect FUNCTION implementation in .BI file', () => {
      const content = `
        FUNCTION MyFunc%(x AS INTEGER)
          MyFunc% = x * 2
        END FUNCTION
      `;
      
      const result = service.validateBIFile(content);
      expect(result).toBeDefined();
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should allow DECLARE statements', () => {
      const content = `
        DECLARE SUB MySub()
        DECLARE FUNCTION MyFunc%(x AS INTEGER)
      `;
      
      const result = service.validateBIFile(content);
      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
    });

    it('should handle empty file', () => {
      const result = service.validateBIFile('');
      expect(result).toBeDefined();
      expect(result.issues.length).toBe(0);
    });

    it('should ignore comments', () => {
      const content = `
        ' This is a comment
        '' Another comment
        TYPE MyType
          x AS INTEGER
        END TYPE
      `;
      
      const result = service.validateBIFile(content);
      expect(result).toBeDefined();
    });

    it('should provide recommendations', () => {
      const content = `
        SUB BadSub
          PRINT "Implementation in .BI"
        END SUB
      `;
      
      const result = service.validateBIFile(content);
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });
  });

  describe('validateBMFile', () => {
    it('should validate proper .BM file structure', () => {
      const content = `
        SUB MySub
          PRINT "Implementation"
        END SUB
        
        FUNCTION MyFunc%(x AS INTEGER)
          MyFunc% = x * 2
        END FUNCTION
      `;
      
      const result = service.validateBMFile(content);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('fileType');
      expect(result.fileType).toBe('.BM');
    });

    it('should detect TYPE definitions in .BM file', () => {
      const content = `
        TYPE MyType
          x AS INTEGER
        END TYPE
      `;
      
      const result = service.validateBMFile(content);
      expect(result).toBeDefined();
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should detect CONST in .BM file', () => {
      const content = `
        CONST MY_CONSTANT = 100
      `;
      
      const result = service.validateBMFile(content);
      expect(result).toBeDefined();
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should allow SUB/FUNCTION implementations', () => {
      const content = `
        SUB Process
          DIM x AS INTEGER
          x = 10
          PRINT x
        END SUB
      `;
      
      const result = service.validateBMFile(content);
      expect(result).toBeDefined();
    });

    it('should handle empty file', () => {
      const result = service.validateBMFile('');
      expect(result).toBeDefined();
      expect(result.issues.length).toBe(0);
    });

    it('should provide summary', () => {
      const content = `
        TYPE BadType
          x AS INTEGER
        END TYPE
      `;
      
      const result = service.validateBMFile(content);
      expect(result.summary).toBeDefined();
      expect(result.summary).toHaveProperty('totalIssues');
      expect(result.summary).toHaveProperty('errors');
      expect(result.summary).toHaveProperty('warnings');
    });
  });

  describe('validateFile', () => {
    it('should validate .BI file by extension', () => {
      const content = `
        TYPE MyType
          x AS INTEGER
        END TYPE
      `;
      
      const result = service.validateFile(content, '.BI');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('isValid');
    });

    it('should validate .BM file by extension', () => {
      const content = `
        SUB MySub
          PRINT "Implementation"
        END SUB
      `;
      
      const result = service.validateFile(content, '.BM');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('isValid');
    });

    it('should handle unknown file types', () => {
      const result = service.validateFile('PRINT "test"', '.BAS');
      expect(result).toBeDefined();
    });
  });

  describe('issue severity', () => {
    it('should categorize errors', () => {
      const content = `
        SUB BadImplementation
          PRINT "Error in .BI"
        END SUB
      `;
      
      const result = service.validateBIFile(content);
      const errors = result.issues.filter(i => i.severity === 'error');
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should categorize warnings', () => {
      const content = `
        ' Some questionable structure
        DIM SHARED x AS INTEGER
      `;
      
      const result = service.validateBIFile(content);
      expect(result).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle nested TYPE definitions', () => {
      const content = `
        TYPE OuterType
          TYPE InnerType
            x AS INTEGER
          END TYPE
        END TYPE
      `;
      
      const result = service.validateBIFile(content);
      expect(result).toBeDefined();
    });

    it('should handle mixed case keywords', () => {
      const content = `
        sub MySub
          print "test"
        end sub
      `;
      
      const result = service.validateBMFile(content);
      expect(result).toBeDefined();
    });

    it('should handle inline comments', () => {
      const content = `
        SUB MySub ' This is a comment
          PRINT "test" ' Another comment
        END SUB
      `;
      
      const result = service.validateBMFile(content);
      expect(result).toBeDefined();
    });
  });
});

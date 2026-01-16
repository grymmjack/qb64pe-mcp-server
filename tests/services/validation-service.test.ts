/**
 * Unit tests for ValidationService
 */

import { ValidationService } from "../../src/services/validation-service";

describe("ValidationService", () => {
  let validator: ValidationService;

  beforeEach(() => {
    validator = new ValidationService();
  });

  describe("validateCode", () => {
    it("should accept valid code", () => {
      const result = validator.validateCode('PRINT "Hello World"');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject undefined code", () => {
      const result = validator.validateCode(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Code must be provided");
    });

    it("should reject empty code when not allowed", () => {
      const result = validator.validateCode("   ", { allowEmpty: false });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Code cannot be empty");
    });

    it("should accept empty code when allowed", () => {
      const result = validator.validateCode("   ", { allowEmpty: true });
      expect(result.isValid).toBe(true);
    });

    it("should reject code below minimum length", () => {
      const result = validator.validateCode("DIM x", { minLength: 10 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("too short");
    });

    it("should reject code above maximum length", () => {
      const result = validator.validateCode("x".repeat(2000), {
        maxLength: 1000,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("too long");
    });

    it("should warn about very large code", () => {
      const result = validator.validateCode("x".repeat(85000));
      expect(result.isValid).toBe(true);
      expect(result.warnings[0]).toContain("very large");
    });

    it("should warn about non-printable characters", () => {
      const result = validator.validateCode('PRINT \x00"test"', {
        checkEncoding: true,
      });
      expect(result.warnings[0]).toContain("non-printable");
    });
  });

  describe("validatePath", () => {
    describe("Windows paths", () => {
      it("should accept valid Windows absolute path", () => {
        const result = validator.validatePath("C:\\QB64pe\\test.bas");
        expect(result.isValid).toBe(true);
      });

      it("should reject paths with invalid Windows characters", () => {
        const result = validator.validatePath("C:\\QB64pe\\test|file.bas");
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain("invalid Windows characters");
      });

      it("should reject reserved Windows names", () => {
        const result = validator.validatePath("C:\\QB64pe\\CON.bas");
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain("reserved Windows name");
      });
    });

    describe("Unix paths", () => {
      it("should accept valid Unix absolute path", () => {
        const result = validator.validatePath("/usr/local/qb64pe/test.bas");
        expect(result.isValid).toBe(true);
      });

      it("should accept relative Unix path when allowed", () => {
        const result = validator.validatePath("./programs/test.bas", {
          allowRelative: true,
        });
        expect(result.isValid).toBe(true);
      });

      it("should reject relative path when not allowed", () => {
        const result = validator.validatePath("./test.bas", {
          allowRelative: false,
        });
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain("Relative paths are not allowed");
      });
    });

    it("should reject undefined path", () => {
      const result = validator.validatePath(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Path must be provided");
    });

    it("should reject empty path", () => {
      const result = validator.validatePath("   ");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Path cannot be empty");
    });

    it("should validate file extensions", () => {
      const result = validator.validatePath("/test/file.txt", {
        allowedExtensions: [".bas", ".bi"],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("must end with one of");
    });

    it("should warn about spaces in path", () => {
      const result = validator.validatePath(
        "C:\\Program Files\\QB64pe\\test.bas",
      );
      expect(result.isValid).toBe(true);
      expect(result.warnings[0]).toContain("spaces");
    });

    it("should warn about mixed separators", () => {
      const result = validator.validatePath("C:\\QB64pe/programs\\test.bas");
      expect(result.isValid).toBe(true);
      expect(result.warnings[0]).toContain("mixed separators");
    });
  });

  describe("validateRequiredString", () => {
    it("should accept valid string", () => {
      const result = validator.validateRequiredString("test.bas", "filename");
      expect(result.isValid).toBe(true);
    });

    it("should reject undefined value", () => {
      const result = validator.validateRequiredString(undefined, "filename");
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("is required");
    });

    it("should reject non-string value", () => {
      const result = validator.validateRequiredString(123, "filename");
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("must be a string");
    });

    it("should reject string below minimum length", () => {
      const result = validator.validateRequiredString("ab", "filename", {
        minLength: 5,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("too short");
    });

    it("should reject string above maximum length", () => {
      const result = validator.validateRequiredString(
        "x".repeat(100),
        "filename",
        {
          maxLength: 50,
        },
      );
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("too long");
    });
  });

  describe("validateNumber", () => {
    it("should accept valid number", () => {
      const result = validator.validateNumber(42, "lineNumber");
      expect(result.isValid).toBe(true);
    });

    it("should reject undefined value", () => {
      const result = validator.validateNumber(undefined, "lineNumber");
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("is required");
    });

    it("should reject NaN", () => {
      const result = validator.validateNumber("abc", "lineNumber");
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("must be a valid number");
    });

    it("should reject number below minimum", () => {
      const result = validator.validateNumber(-5, "lineNumber", { min: 0 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("at least 0");
    });

    it("should reject number above maximum", () => {
      const result = validator.validateNumber(1000, "lineNumber", { max: 100 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("at most 100");
    });

    it("should reject non-integer when integer required", () => {
      const result = validator.validateNumber(3.14, "lineNumber", {
        integer: true,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("must be an integer");
    });

    it("should accept integer in valid range", () => {
      const result = validator.validateNumber(50, "lineNumber", {
        min: 1,
        max: 100,
        integer: true,
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe("validateArray", () => {
    it("should accept valid array", () => {
      const result = validator.validateArray(["a", "b", "c"], "files");
      expect(result.isValid).toBe(true);
    });

    it("should reject non-array value", () => {
      const result = validator.validateArray("abc", "files");
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("must be an array");
    });

    it("should reject array below minimum length", () => {
      const result = validator.validateArray(["a"], "files", { minLength: 3 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("at least 3");
    });

    it("should reject array above maximum length", () => {
      const result = validator.validateArray(
        ["a", "b", "c", "d", "e"],
        "files",
        {
          maxLength: 3,
        },
      );
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("at most 3");
    });

    it("should validate array items when validator provided", () => {
      const itemValidator = (item: any) => {
        if (typeof item !== "string") {
          return { isValid: false, errors: ["Must be string"], warnings: [] };
        }
        return { isValid: true, errors: [], warnings: [] };
      };

      const result = validator.validateArray([1, "test", 3], "items", {
        itemValidator,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateEnum", () => {
    it("should accept valid choice", () => {
      const result = validator.validateEnum("windows", "platform", [
        "windows",
        "linux",
        "macos",
      ]);
      expect(result.isValid).toBe(true);
    });

    it("should reject invalid choice", () => {
      const result = validator.validateEnum("android", "platform", [
        "windows",
        "linux",
        "macos",
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("must be one of");
    });

    it("should reject undefined value", () => {
      const result = validator.validateEnum(undefined, "platform", [
        "windows",
        "linux",
        "macos",
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("is required");
    });
  });

  describe("combineResults", () => {
    it("should combine valid results", () => {
      const result1 = { isValid: true, errors: [], warnings: [] };
      const result2 = { isValid: true, errors: [], warnings: [] };
      const combined = validator.combineResults(result1, result2);

      expect(combined.isValid).toBe(true);
      expect(combined.errors).toHaveLength(0);
    });

    it("should combine results with errors", () => {
      const result1 = { isValid: false, errors: ["Error 1"], warnings: [] };
      const result2 = { isValid: false, errors: ["Error 2"], warnings: [] };
      const combined = validator.combineResults(result1, result2);

      expect(combined.isValid).toBe(false);
      expect(combined.errors).toHaveLength(2);
      expect(combined.errors).toContain("Error 1");
      expect(combined.errors).toContain("Error 2");
    });

    it("should combine results with warnings", () => {
      const result1 = { isValid: true, errors: [], warnings: ["Warning 1"] };
      const result2 = { isValid: true, errors: [], warnings: ["Warning 2"] };
      const combined = validator.combineResults(result1, result2);

      expect(combined.isValid).toBe(true);
      expect(combined.warnings).toHaveLength(2);
    });

    it("should be invalid if any result has errors", () => {
      const result1 = { isValid: true, errors: [], warnings: [] };
      const result2 = { isValid: false, errors: ["Error"], warnings: [] };
      const combined = validator.combineResults(result1, result2);

      expect(combined.isValid).toBe(false);
    });
  });
});

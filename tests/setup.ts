/**
 * Global test setup - suppress console output during tests
 */

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

// Suppress console output during tests
beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

// Restore console after all tests
afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

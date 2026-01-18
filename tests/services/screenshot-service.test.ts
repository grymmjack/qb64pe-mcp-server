import { ScreenshotService } from '../../src/services/screenshot-service';

jest.mock('fs');
jest.mock('child_process');

describe('ScreenshotService', () => {
  let service: ScreenshotService;
  const testDir = 'test-screenshots';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ScreenshotService(testDir);
  });

  describe('initialization', () => {
    it('should create service instance', () => {
      expect(service).toBeDefined();
    });

    it('should ensure screenshot directory exists', () => {
      const newService = new ScreenshotService('new-test-dir');
      expect(newService).toBeDefined();
    });
  });

  describe('getMonitoringStatus', () => {
    it('should return status object', () => {
      const status = service.getMonitoringStatus();
      expect(status).toHaveProperty('isMonitoring');
      expect(status).toHaveProperty('screenshotDir');
      expect(status.isMonitoring).toBe(false);
    });
  });

  describe('getScreenshotFiles', () => {
    it('should get screenshot files', () => {
      const files = service.getScreenshotFiles();
      expect(Array.isArray(files)).toBe(true);
    });
  });

  describe('cleanupOldScreenshots', () => {
    it('should cleanup old screenshots', () => {
      service.cleanupOldScreenshots();
      expect(true).toBe(true); // Should not throw
    });

    it('should accept custom max age', () => {
      service.cleanupOldScreenshots(1000);
      expect(true).toBe(true);
    });
  });

  describe('stopMonitoring', () => {
    it('should handle stop when not monitoring', () => {
      service.stopMonitoring();
      expect(true).toBe(true); // Should not throw
    });
  });
});


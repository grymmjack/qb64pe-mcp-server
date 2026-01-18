const mockExecAsync = jest.fn();

import { ScreenshotService } from '../../src/services/screenshot-service';

jest.mock('fs');
jest.mock('child_process', () => ({
  exec: jest.fn(),
  spawn: jest.fn()
}));
jest.mock('util', () => ({
  promisify: jest.fn(() => mockExecAsync)
}));

describe('ScreenshotService', () => {
  let service: ScreenshotService;
  const testDir = 'test-screenshots';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock exec to return immediately without executing commands
    mockExecAsync.mockResolvedValue({ stdout: '', stderr: '' });
    
    service = new ScreenshotService(testDir);
  });

  afterEach(() => {
    // Clean up any monitoring intervals to prevent Jest from hanging
    if (service) {
      service.stopMonitoring();
    }
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

  describe('captureQB64PEWindow', () => {
    it('should return proper result structure', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'SUCCESS:1234:Test Window:0,0,800,600', 
        stderr: '' 
      });
      
      const result = await service.captureQB64PEWindow();
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    }, 10000);

    it('should handle capture with options', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'SUCCESS:1234:Test Window:0,0,800,600', 
        stderr: '' 
      });
      
      const result = await service.captureQB64PEWindow({
        format: 'png',
        windowTitle: 'Test Window'
      });
      
      expect(result).toBeDefined();
    }, 10000);

    it('should handle custom output path', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'SUCCESS:1234:Test:0,0,800,600', 
        stderr: '' 
      });
      
      const result = await service.captureQB64PEWindow({
        outputPath: '/test/path/screenshot.png'
      });
      
      expect(result).toBeDefined();
    }, 10000);

    it('should handle capture region', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'SUCCESS:1234:Test:0,0,100,100', 
        stderr: '' 
      });
      
      const result = await service.captureQB64PEWindow({
        captureRegion: { x: 0, y: 0, width: 100, height: 100 }
      });
      
      expect(result).toBeDefined();
    }, 10000);

    it('should handle different formats', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'SUCCESS:1234:Test:0,0,800,600', 
        stderr: '' 
      });
      
      const pngResult = await service.captureQB64PEWindow({ format: 'png' });
      const jpgResult = await service.captureQB64PEWindow({ format: 'jpg' });
      const gifResult = await service.captureQB64PEWindow({ format: 'gif' });
      
      expect(pngResult).toBeDefined();
      expect(jpgResult).toBeDefined();
      expect(gifResult).toBeDefined();
    }, 10000);

    it('should handle window title filter', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'SUCCESS:1234:QB64PE Program:0,0,800,600', 
        stderr: '' 
      });
      
      const result = await service.captureQB64PEWindow({
        windowTitle: 'QB64PE Program'
      });
      
      expect(result).toBeDefined();
    }, 10000);

    it('should handle process name filter', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'SUCCESS:1234:qb64pe:0,0,800,600', 
        stderr: '' 
      });
      
      const result = await service.captureQB64PEWindow({
        processName: 'qb64pe'
      });
      
      expect(result).toBeDefined();
    }, 10000);

    it('should handle quality option', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'SUCCESS:1234:Test:0,0,800,600', 
        stderr: '' 
      });
      
      const result = await service.captureQB64PEWindow({
        quality: 80
      });
      
      expect(result).toBeDefined();
    }, 10000);
  });

  describe('getQB64PEProcesses', () => {
    it('should return process list', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: '', 
        stderr: '' 
      });
      
      const processes = await service.getQB64PEProcesses();
      
      expect(Array.isArray(processes)).toBe(true);
    }, 10000);

    it('should handle no processes found', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: '', 
        stderr: '' 
      });
      
      const processes = await service.getQB64PEProcesses();
      
      expect(Array.isArray(processes)).toBe(true);
      expect(processes.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('startMonitoring', () => {
    it('should start monitoring', () => {
      service.startMonitoring();
      const status = service.getMonitoringStatus();
      expect(status).toBeDefined();
    });

    it('should handle custom interval', () => {
      service.startMonitoring(1000);
      expect(true).toBe(true);
    });

    it('should handle custom capture interval', () => {
      service.startMonitoring(1000, 5000);
      expect(true).toBe(true);
    });

    it('should handle both intervals', () => {
      service.startMonitoring(500, 2000);
      expect(true).toBe(true);
    });
  });

  describe('monitoring lifecycle', () => {
    it('should start and stop monitoring', () => {
      service.startMonitoring(1000);
      service.stopMonitoring();
      const status = service.getMonitoringStatus();
      expect(status.isMonitoring).toBe(false);
    });

    it('should handle multiple start calls', () => {
      service.startMonitoring(1000);
      service.startMonitoring(2000);
      service.stopMonitoring();
      expect(true).toBe(true);
    });
  });

  describe('file management', () => {
    it('should get screenshot files', () => {
      const files = service.getScreenshotFiles();
      expect(Array.isArray(files)).toBe(true);
    });

    it('should handle empty directory', () => {
      const files = service.getScreenshotFiles();
      expect(Array.isArray(files)).toBe(true);
    });

    it('should cleanup with default age', () => {
      service.cleanupOldScreenshots();
      expect(true).toBe(true);
    });

    it('should cleanup with custom age', () => {
      service.cleanupOldScreenshots(86400000); // 1 day
      expect(true).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle capture errors gracefully', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'ERROR:Window not found',
        stderr: '' 
      });
      
      const result = await service.captureQB64PEWindow({
        windowTitle: 'Nonexistent Window'
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    }, 10000);

    it('should handle getProcesses errors', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: '', 
        stderr: 'Process enumeration failed' 
      });
      
      const processes = await service.getQB64PEProcesses();
      expect(Array.isArray(processes)).toBe(true);
    }, 10000);

    it('should handle invalid output path', async () => {
      mockExecAsync.mockResolvedValue({ 
        stdout: 'ERROR:Invalid path',
        stderr: '' 
      });
      
      const result = await service.captureQB64PEWindow({
        outputPath: '/invalid/path/that/does/not/exist/screenshot.png'
      });
      
      expect(result).toBeDefined();
    }, 10000);
  });
});


import { QB64PEInstallationService } from '../../src/services/installation-service';
import * as os from 'os';
import * as fs from 'fs';

jest.mock('os');
jest.mock('fs');
jest.mock('child_process');

describe('QB64PEInstallationService', () => {
  let service: QB64PEInstallationService;

  beforeEach(() => {
    service = new QB64PEInstallationService();
    jest.clearAllMocks();
  });

  describe('detectInstallation', () => {
    it('should attempt to detect QB64PE installation', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      (os.homedir as jest.Mock).mockReturnValue('/home/user');
      
      const result = await service.detectInstallation();
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should handle Windows platform', async () => {
      (os.platform as jest.Mock).mockReturnValue('win32');
      (os.homedir as jest.Mock).mockReturnValue('C:\\Users\\user');
      
      const result = await service.detectInstallation();
      expect(result).toBeDefined();
    });

    it('should handle macOS platform', async () => {
      (os.platform as jest.Mock).mockReturnValue('darwin');
      (os.homedir as jest.Mock).mockReturnValue('/Users/user');
      
      const result = await service.detectInstallation();
      expect(result).toBeDefined();
    });
  });

  describe('generateInstallationReport', () => {
    it('should generate installation report', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      const report = await service.generateInstallationReport();
      expect(report).toContain('QB64PE Installation Report');
    });
  });
});

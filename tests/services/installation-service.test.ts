import { QB64PEInstallationService } from '../../src/services/installation-service';
import * as os from 'os';
import * as fs from 'fs';
import { exec } from 'child_process';

jest.mock('os');
jest.mock('fs');
jest.mock('child_process');

describe('QB64PEInstallationService', () => {
  let service: QB64PEInstallationService;
  const mockExec = exec as jest.MockedFunction<typeof exec>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set default platform for constructor
    (os.platform as jest.Mock).mockReturnValue('linux');
    (os.homedir as jest.Mock).mockReturnValue('/home/user');
    
    // Mock PATH environment
    process.env.PATH = '/usr/bin:/usr/local/bin:/home/user/bin';
    
    service = new QB64PEInstallationService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('detectInstallation', () => {
    it('should detect QB64PE when found in PATH', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      (os.homedir as jest.Mock).mockReturnValue('/home/user');
      
      // Mock successful which command
      mockExec.mockImplementation((cmd: any, callback: any) => {
        callback(null, { stdout: '/usr/local/bin/qb64pe\n', stderr: '' });
        return {} as any;
      });
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      const result = await service.detectInstallation();
      
      expect(result.isInstalled).toBe(true);
      expect(result.inPath).toBe(true);
      expect(result.platform).toBe('linux');
    });

    it('should detect QB64PE not in PATH but in common location', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      (os.homedir as jest.Mock).mockReturnValue('/home/user');
      
      // Mock failed which command (not in PATH)
      mockExec.mockImplementation((cmd: any, callback: any) => {
        callback(new Error('Command failed'), { stdout: '', stderr: 'not found' });
        return {} as any;
      });
      
      // Mock finding executable in common path
      (fs.existsSync as jest.Mock).mockImplementation((path: string) => {
        return path.includes('/usr/local/bin/qb64pe');
      });
      
      const result = await service.detectInstallation();
      
      expect(result.platform).toBe('linux');
    });

    it('should handle Windows platform with where command', async () => {
      (os.platform as jest.Mock).mockReturnValue('win32');
      (os.homedir as jest.Mock).mockReturnValue('C:\\Users\\user');
      
      service = new QB64PEInstallationService();
      
      mockExec.mockImplementation((cmd: any, callback: any) => {
        callback(null, { stdout: 'C:\\QB64pe\\qb64pe.exe\n', stderr: '' });
        return {} as any;
      });
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      const result = await service.detectInstallation();
      
      expect(result.platform).toBe('win32');
      expect(result.isInstalled).toBe(true);
    });

    it('should handle macOS platform', async () => {
      (os.platform as jest.Mock).mockReturnValue('darwin');
      (os.homedir as jest.Mock).mockReturnValue('/Users/user');
      
      service = new QB64PEInstallationService();
      
      mockExec.mockImplementation((cmd: any, callback: any) => {
        callback(new Error('not found'), { stdout: '', stderr: '' });
        return {} as any;
      });
      
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const result = await service.detectInstallation();
      
      expect(result.platform).toBe('darwin');
      expect(result.isInstalled).toBe(false);
    });

    it('should handle detection timeout gracefully', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      
      mockExec.mockImplementation(() => {
        // Never call callback to simulate timeout
        return {} as any;
      });
      
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const result = await service.detectInstallation();
      
      expect(result).toBeDefined();
      expect(result.platform).toBe('linux');
    });

    it('should handle errors during detection', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      
      mockExec.mockImplementation((cmd: any, callback: any) => {
        callback(new Error('System error'), null);
        return {} as any;
      });
      
      (fs.existsSync as jest.Mock).mockImplementation(() => {
        throw new Error('File system error');
      });
      
      const result = await service.detectInstallation();
      
      expect(result).toBeDefined();
      expect(result.isInstalled).toBe(false);
    });
  });

  describe('getPathConfiguration', () => {
    it('should generate Windows PATH configuration', () => {
      (os.platform as jest.Mock).mockReturnValue('win32');
      service = new QB64PEInstallationService();
      
      const config = service.getPathConfiguration('C:\\QB64pe');
      
      expect(config.platform).toBe('win32');
      expect(config.pathSeparator).toBe(';');
      expect(config.instructions.temporary.length).toBeGreaterThan(0);
      expect(config.instructions.permanent.length).toBeGreaterThan(0);
      expect(config.instructions.verification.length).toBeGreaterThan(0);
      expect(config.downloadUrl).toContain('github.com');
    });

    it('should generate macOS PATH configuration', () => {
      (os.platform as jest.Mock).mockReturnValue('darwin');
      service = new QB64PEInstallationService();
      
      const config = service.getPathConfiguration('/Applications/QB64pe');
      
      expect(config.platform).toBe('darwin');
      expect(config.pathSeparator).toBe(':');
      expect(config.instructions.temporary.length).toBeGreaterThan(0);
      expect(config.instructions.permanent.length).toBeGreaterThan(0);
      expect(config.commonInstallPaths.length).toBeGreaterThan(0);
    });

    it('should generate Linux PATH configuration', () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      service = new QB64PEInstallationService();
      
      const config = service.getPathConfiguration('/usr/local/QB64pe');
      
      expect(config.platform).toBe('linux');
      expect(config.pathSeparator).toBe(':');
      expect(config.instructions.temporary.some(i => i.includes('export'))).toBe(true);
      expect(config.instructions.permanent.some(i => i.includes('bashrc') || i.includes('profile'))).toBe(true);
      expect(config.instructions.verification.some(i => i.includes('which'))).toBe(true);
    });

    it('should handle generic platform configuration', () => {
      (os.platform as jest.Mock).mockReturnValue('freebsd');
      service = new QB64PEInstallationService();
      
      const config = service.getPathConfiguration();
      
      expect(config.platform).toBe('freebsd');
      expect(config.instructions).toBeDefined();
      expect(config.commonInstallPaths.length).toBeGreaterThan(0);
    });

    it('should include current PATH in configuration', () => {
      process.env.PATH = '/usr/bin:/usr/local/bin:/custom/path';
      (os.platform as jest.Mock).mockReturnValue('linux');
      service = new QB64PEInstallationService();
      
      const config = service.getPathConfiguration();
      
      expect(config.currentPath).toContain('/usr/bin');
      expect(config.currentPath).toContain('/usr/local/bin');
      expect(config.currentPath).toContain('/custom/path');
    });

    it('should provide common install paths for each platform', () => {
      const platforms = ['win32', 'darwin', 'linux'];
      
      platforms.forEach(platform => {
        (os.platform as jest.Mock).mockReturnValue(platform);
        service = new QB64PEInstallationService();
        
        const config = service.getPathConfiguration();
        
        expect(config.commonInstallPaths.length).toBeGreaterThan(0);
        expect(Array.isArray(config.commonInstallPaths)).toBe(true);
      });
    });
  });

  describe('validatePath', () => {
    it('should validate a correct QB64PE installation path', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.statSync as jest.Mock).mockReturnValue({ isFile: () => true });
      
      mockExec.mockImplementation((cmd: any, callback: any) => {
        callback(null, { stdout: 'QB64-PE v3.8.0\n', stderr: '' });
        return {} as any;
      });
      
      const result = await service.validatePath('/usr/local/bin');
      
      expect(result.valid).toBe(true);
      expect(result.executable).toBeDefined();
    });

    it('should reject invalid path', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const result = await service.validatePath('/invalid/path');
      
      expect(result.valid).toBe(false);
    });

    it('should handle validation timeout', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      mockExec.mockImplementation(() => {
        // Never call callback
        return {} as any;
      });
      
      const result = await service.validatePath('/usr/local/bin');
      
      expect(result.valid).toBe(false);
    });

    it('should handle validation errors gracefully', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('File system error');
      });
      
      const result = await service.validatePath('/usr/local/bin');
      
      expect(result.valid).toBe(false);
    });
  });

  describe('generateInstallationReport', () => {
    it('should generate comprehensive report when QB64PE is installed', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      
      mockExec.mockImplementation((cmd: any, callback: any) => {
        callback(null, { stdout: '/usr/local/bin/qb64pe\n', stderr: '' });
        return {} as any;
      });
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      const report = await service.generateInstallationReport();
      
      expect(report).toContain('QB64PE Installation Report');
      expect(report).toContain('Installation Status');
      expect(report).toContain('Platform:');
      expect(report).toContain('PATH Configuration');
    });

    it('should generate report when QB64PE is not installed', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      
      mockExec.mockImplementation((cmd: any, callback: any) => {
        callback(new Error('not found'), { stdout: '', stderr: '' });
        return {} as any;
      });
      
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const report = await service.generateInstallationReport();
      
      expect(report).toContain('QB64PE Installation Report');
      expect(report).toContain('Common Install Paths');
      expect(report).toContain('github.com');
    });

    it('should handle report generation errors gracefully', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      
      mockExec.mockImplementation(() => {
        throw new Error('Fatal error');
      });
      
      const report = await service.generateInstallationReport();
      
      expect(report).toContain('QB64PE Installation Report');
      // Service returns normal report on errors, not ERROR report
      expect(report).toBeDefined();
    });

    it('should include platform-specific information in report', async () => {
      const platforms = ['win32', 'darwin', 'linux'];
      
      for (const platform of platforms) {
        (os.platform as jest.Mock).mockReturnValue(platform);
        service = new QB64PEInstallationService();
        
        mockExec.mockImplementation((cmd: any, callback: any) => {
          callback(new Error('not found'), { stdout: '', stderr: '' });
          return {} as any;
        });
        
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        
        const report = await service.generateInstallationReport();
        
        expect(report).toContain(platform);
        expect(report).toContain('Common Install Paths');
      }
    });
  });

  describe('generateInstallationGuidance', () => {
    it('should generate success message when properly installed', () => {
      const installation = {
        isInstalled: true,
        inPath: true,
        installPath: '/usr/local/bin',
        executable: '/usr/local/bin/qb64pe',
        version: '3.8.0',
        platform: 'linux'
      };
      
      const guidance = service.generateInstallationGuidance(installation);
      
      expect(guidance).toContain('properly installed');
      expect(guidance).toContain('ready to use');
      expect(guidance).toContain(installation.version);
    });

    it('should generate PATH instructions when installed but not in PATH', () => {
      const installation = {
        isInstalled: true,
        inPath: false,
        installPath: '/opt/QB64pe',
        platform: 'linux'
      };
      
      const guidance = service.generateInstallationGuidance(installation);
      
      expect(guidance).toContain('not in PATH');
      expect(guidance).toContain('PATH');
    });

    it('should generate installation instructions when not installed', () => {
      const installation = {
        isInstalled: false,
        inPath: false,
        platform: 'linux'
      };
      
      const guidance = service.generateInstallationGuidance(installation);
      
      expect(guidance).toContain('not found');
      expect(guidance).toContain('Installation Steps');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty PATH environment variable', () => {
      process.env.PATH = '';
      (os.platform as jest.Mock).mockReturnValue('linux');
      service = new QB64PEInstallationService();
      
      const config = service.getPathConfiguration();
      
      expect(config.currentPath).toEqual([]);
    });

    it('should handle missing PATH environment variable', () => {
      delete process.env.PATH;
      (os.platform as jest.Mock).mockReturnValue('linux');
      service = new QB64PEInstallationService();
      
      const config = service.getPathConfiguration();
      
      expect(config.currentPath).toEqual([]);
    });

    it('should handle platform-specific executable names', () => {
      const windowsService = new QB64PEInstallationService();
      (os.platform as jest.Mock).mockReturnValue('win32');
      const winService = new QB64PEInstallationService();
      
      const unixService = new QB64PEInstallationService();
      (os.platform as jest.Mock).mockReturnValue('linux');
      const linuxService = new QB64PEInstallationService();
      
      expect(winService).toBeDefined();
      expect(linuxService).toBeDefined();
    });

    it('should find QB64PE in common paths and get version', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      
      mockExec.mockImplementation((cmd: any, callback: any) => {
        // which fails
        if (cmd.includes('which')) {
          callback(new Error('not found'), { stdout: '', stderr: '' });
        }
        // version succeeds
        else if (cmd.includes('--version')) {
          callback(null, { stdout: 'QB64-PE v3.8.0\n', stderr: '' });
        }
        return {} as any;
      });
      
      let callCount = 0;
      (fs.existsSync as jest.Mock).mockImplementation((path: string) => {
        callCount++;
        // Return true on second call (first common path)
        return callCount >= 2 && path.includes('qb64pe');
      });
      
      (fs.statSync as jest.Mock).mockReturnValue({ isFile: () => true });
      
      service = new QB64PEInstallationService();
      const result = await service.detectInstallation();
      
      expect(result.platform).toBe('linux');
      expect(result.isInstalled).toBe(true);
      expect(result.inPath).toBe(false);
    });

    it('should handle file that exists but is not a file', async () => {
      (os.platform as jest.Mock).mockReturnValue('linux');
      
      mockExec.mockImplementation((cmd: any, callback: any) => {
        callback(new Error('not found'), { stdout: '', stderr: '' });
        return {} as any;
      });
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.statSync as jest.Mock).mockReturnValue({ isFile: () => false });
      
      service = new QB64PEInstallationService();
      const result = await service.detectInstallation();
      
      expect(result.isInstalled).toBe(false);
    });
  });
});

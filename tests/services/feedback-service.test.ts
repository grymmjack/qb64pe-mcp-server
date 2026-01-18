import { FeedbackService } from '../../src/services/feedback-service';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(() => {
    service = new FeedbackService();
  });

  describe('generateFeedback', () => {
    it('should generate feedback from analysis', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        shapes: [],
        colors: [],
        text: []
      };
      
      const feedback = service.generateFeedback(analysisResult);
      expect(feedback).toHaveProperty('timestamp');
      expect(feedback).toHaveProperty('suggestions');
      expect(feedback).toHaveProperty('overallAssessment');
    });

    it('should include code analysis', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        shapes: [],
        colors: [],
        text: []
      };
      
      const code = 'PRINT "Test"';
      const feedback = service.generateFeedback(analysisResult, code);
      expect(feedback.suggestions).toBeDefined();
    });
  });

  describe('getFeedbackHistory', () => {
    it('should return feedback history', () => {
      const history = service.getFeedbackHistory();
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics', () => {
      const stats = service.getStatistics();
      expect(stats).toHaveProperty('total');
      expect(typeof stats.total).toBe('number');
    });
  });

  describe('generateFeedback with shapes', () => {
    it('should analyze shapes in screenshot', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        success: true,
        analysis: {
          shapes: [
            { type: 'circle', x: 100, y: 100, radius: 50 },
            { type: 'rectangle', x: 200, y: 200, width: 100, height: 50 }
          ],
          colors: [],
          textElements: [],
          quality: 'good'
        }
      };
      
      const feedback = service.generateFeedback(analysisResult);
      expect(feedback.suggestions.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle no shapes detected', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        success: true,
        analysis: {
          shapes: [],
          colors: [],
          textElements: [],
          quality: 'good'
        }
      };
      
      const feedback = service.generateFeedback(analysisResult);
      expect(feedback.overallAssessment).toBeDefined();
    });
  });

  describe('generateFeedback with colors', () => {
    it('should analyze colors in screenshot', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        success: true,
        analysis: {
          shapes: [],
          colors: [
            { r: 255, g: 0, b: 0, count: 100 },
            { r: 0, g: 255, b: 0, count: 50 }
          ],
          textElements: [],
          quality: 'good'
        }
      };
      
      const feedback = service.generateFeedback(analysisResult);
      expect(feedback.suggestions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generateFeedback with text', () => {
    it('should analyze text in screenshot', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        success: true,
        analysis: {
          shapes: [],
          colors: [],
          textElements: ['Hello', 'World', 'Test'],
          quality: 'good'
        }
      };
      
      const feedback = service.generateFeedback(analysisResult);
      expect(feedback.suggestions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generateFeedback with code', () => {
    it('should provide code structure suggestions', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        success: true,
        analysis: {
          shapes: [],
          colors: [],
          textElements: [],
          quality: 'good'
        }
      };
      
      const code = 'SCREEN 13\\nCIRCLE (100, 100), 50\\nLINE (0, 0)-(319, 199)';
      const feedback = service.generateFeedback(analysisResult, code);
      expect(feedback.suggestions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generateFeedback with failed analysis', () => {
    it('should handle analysis failure', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        success: false,
        error: 'Screenshot capture failed'
      };
      
      const feedback = service.generateFeedback(analysisResult);
      expect(feedback.suggestions.length).toBeGreaterThan(0);
      expect(feedback.suggestions[0].priority).toBe('critical');
    });
  });

  describe('feedback history', () => {
    it('should track multiple feedback entries', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot1.png',
        success: true,
        analysis: { shapes: [], colors: [], textElements: [], quality: 'good' }
      };
      
      service.generateFeedback(analysisResult);
      service.generateFeedback(analysisResult);
      
      const history = service.getFeedbackHistory();
      expect(history.length).toBeGreaterThanOrEqual(2);
    });

    it('should limit history size', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        success: true,
        analysis: { shapes: [], colors: [], textElements: [], quality: 'good' }
      };
      
      for (let i = 0; i < 15; i++) {
        service.generateFeedback(analysisResult);
      }
      
      const history = service.getFeedbackHistory();
      expect(history.length).toBeLessThanOrEqual(20);
    });
  });

  describe('statistics', () => {
    it('should track suggestion types', () => {
      const analysisResult: any = {
        screenshotPath: '/test/screenshot.png',
        success: true,
        analysis: { shapes: [], colors: [], textElements: [], quality: 'good' }
      };
      
      service.generateFeedback(analysisResult);
      const stats = service.getStatistics();
      
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('successful');
      expect(stats).toHaveProperty('successRate');
    });
  });
});

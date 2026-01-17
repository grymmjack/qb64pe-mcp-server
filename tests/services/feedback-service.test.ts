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
});

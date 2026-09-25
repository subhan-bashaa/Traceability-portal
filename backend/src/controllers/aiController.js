import { aiService } from '../services/aiService.js';

export const aiController = {
  /**
   * POST /api/ai/traceability-summary
   */
  async getTraceabilitySummary(req, res, next) {
    try {
      const { serialNumber } = req.body;
      const result = await aiService.generateTraceabilitySummary(serialNumber);

      return res.status(200).json({
        success: true,
        summary: result.summary,
        cached: result.cached,
        provider: result.provider,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default aiController;

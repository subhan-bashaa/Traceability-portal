import { traceabilityService } from '../services/traceabilityService.js';

export const traceabilityController = {
  /**
   * GET /api/traceability/:serialNumber
   */
  async getTraceability(req, res, next) {
    try {
      const { serialNumber } = req.params;
      const data = await traceabilityService.getTraceabilityBySerialNumber(serialNumber);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Product with the given serial number was not found',
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default traceabilityController;

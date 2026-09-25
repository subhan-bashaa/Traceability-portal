import { productService } from '../services/productService.js';

export const productController = {
  /**
   * GET /api/products/stats/dashboard
   */
  async getStats(req, res, next) {
    try {
      const stats = await productService.getDashboardStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
  /**
   * GET /api/products
   */
  async getAll(req, res, next) {
    try {
      const products = await productService.getAllProducts(req.query);
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id
   */
  async getById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${req.params.id} was not found`,
        });
      }
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id/components
   */
  async getComponents(req, res, next) {
    try {
      const components = await productService.getComponentsByProductId(req.params.id);
      res.status(200).json({
        success: true,
        data: components,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id/route-history
   */
  async getRouteHistory(req, res, next) {
    try {
      const history = await productService.getRouteHistoryByProductId(req.params.id);
      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id/defects
   */
  async getDefects(req, res, next) {
    try {
      const defects = await productService.getDefectsByProductId(req.params.id);
      res.status(200).json({
        success: true,
        data: defects,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id/inspections
   */
  async getInspections(req, res, next) {
    try {
      const inspections = await productService.getInspectionsByProductId(req.params.id);
      res.status(200).json({
        success: true,
        data: inspections,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id/shipment
   */
  async getShipment(req, res, next) {
    try {
      const shipment = await productService.getShipmentByProductId(req.params.id);
      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: `No shipment record found for product ID ${req.params.id}`,
        });
      }
      res.status(200).json({
        success: true,
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default productController;

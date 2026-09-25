import { query, isConnectionError } from '../config/db.js';
import { sampleFallbackProducts } from '../utils/seedFallback.js';

export const productService = {
  /**
   * Get real-time dashboard KPI counts directly from NeonDB
   */
  async getDashboardStats() {
    try {
      const [productsRes, inProdRes, passedRes, dispatchedRes] = await Promise.all([
        query('SELECT count(*)::int as count FROM products;'),
        query("SELECT count(*)::int as count FROM products WHERE status = 'In Production';"),
        query("SELECT count(DISTINCT product_id)::int as count FROM inspections WHERE result = 'Passed' OR result = 'PASSED';"),
        query("SELECT count(*)::int as count FROM shipments WHERE status = 'Dispatched' OR status = 'In Transit' OR status = 'Delivered';")
      ]);

      const totalProducts = productsRes.rows[0]?.count || 0;
      const inProduction = inProdRes.rows[0]?.count || 0;
      const qualityPassed = passedRes.rows[0]?.count || 0;
      const dispatched = dispatchedRes.rows[0]?.count || 0;
      const passRatePercent = totalProducts > 0 ? Math.round((qualityPassed / totalProducts) * 1000) / 10 : 0;

      return {
        totalProducts,
        inProduction,
        qualityPassed,
        dispatched,
        passRatePercent,
      };
    } catch (err) {
      console.error('Error fetching dashboard stats from NeonDB:', err);
      return {
        totalProducts: 0,
        inProduction: 0,
        qualityPassed: 0,
        dispatched: 0,
        passRatePercent: 0,
      };
    }
  },
  /**
   * Get list of all registered products
   */
  async getAllProducts(options = {}) {
    const limit = Math.min(parseInt(options.limit, 10) || 50, 100);
    const offset = Math.max(parseInt(options.offset, 10) || 0, 0);

    try {
      const res = await query(
        'SELECT id, serial_number, product_code, product_name, batch_number, manufacturing_date, status, created_at FROM products ORDER BY id ASC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return res.rows;
    } catch (err) {
      if (isConnectionError(err)) {
        return Object.values(sampleFallbackProducts).map((p) => p.product);
      }
      throw err;
    }
  },

  /**
   * Get product by numerical ID
   */
  async getProductById(id) {
    try {
      const res = await query(
        'SELECT id, serial_number, product_code, product_name, batch_number, manufacturing_date, status, created_at FROM products WHERE id = $1',
        [id]
      );
      return res.rows[0] || null;
    } catch (err) {
      if (isConnectionError(err)) {
        const match = Object.values(sampleFallbackProducts).find((p) => p.product.id === id);
        return match ? match.product : null;
      }
      throw err;
    }
  },

  /**
   * Get components for product ID
   */
  async getComponentsByProductId(id) {
    try {
      const res = await query(
        'SELECT id, component_name, component_code, lot_number, supplier, quantity FROM components WHERE product_id = $1 ORDER BY id ASC',
        [id]
      );
      return res.rows;
    } catch (err) {
      if (isConnectionError(err)) {
        const match = Object.values(sampleFallbackProducts).find((p) => p.product.id === id);
        return match ? match.components : [];
      }
      throw err;
    }
  },

  /**
   * Get route / production history for product ID
   */
  async getRouteHistoryByProductId(id) {
    try {
      const res = await query(
        `SELECT rl.id, rl.operation_name, rl.start_time, rl.end_time, rl.result,
                s.station_code, s.station_name, s.line_name,
                o.employee_code, o.name AS operator_name, o.role AS operator_role
         FROM route_logs rl
         LEFT JOIN stations s ON rl.station_id = s.id
         LEFT JOIN operators o ON rl.operator_id = o.id
         WHERE rl.product_id = $1
         ORDER BY rl.start_time ASC`,
        [id]
      );
      return res.rows;
    } catch (err) {
      if (isConnectionError(err)) {
        const match = Object.values(sampleFallbackProducts).find((p) => p.product.id === id);
        return match ? match.productionHistory : [];
      }
      throw err;
    }
  },

  /**
   * Get defects for product ID
   */
  async getDefectsByProductId(id) {
    try {
      const res = await query(
        `SELECT d.id, d.defect_code, d.description, d.severity, d.detected_at, d.status,
                s.station_code, s.station_name
         FROM defects d
         LEFT JOIN stations s ON d.station_id = s.id
         WHERE d.product_id = $1
         ORDER BY d.detected_at ASC`,
        [id]
      );
      return res.rows;
    } catch (err) {
      if (isConnectionError(err)) {
        const match = Object.values(sampleFallbackProducts).find((p) => p.product.id === id);
        return match ? match.defects : [];
      }
      throw err;
    }
  },

  /**
   * Get inspections for product ID
   */
  async getInspectionsByProductId(id) {
    try {
      const res = await query(
        `SELECT id, inspector_name, inspection_type, voltage, current, temperature, result, inspected_at
         FROM inspections
         WHERE product_id = $1
         ORDER BY inspected_at ASC`,
        [id]
      );
      return res.rows;
    } catch (err) {
      if (isConnectionError(err)) {
        const match = Object.values(sampleFallbackProducts).find((p) => p.product.id === id);
        return match ? match.inspections : [];
      }
      throw err;
    }
  },

  /**
   * Get shipment for product ID
   */
  async getShipmentByProductId(id) {
    try {
      const res = await query(
        `SELECT id, shipment_id, carton_number, destination, shipment_date, status
         FROM shipments
         WHERE product_id = $1
         LIMIT 1`,
        [id]
      );
      return res.rows[0] || null;
    } catch (err) {
      if (isConnectionError(err)) {
        const match = Object.values(sampleFallbackProducts).find((p) => p.product.id === id);
        return match ? match.shipment : null;
      }
      throw err;
    }
  },
};

export default productService;

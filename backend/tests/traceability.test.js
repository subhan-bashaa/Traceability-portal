import request from 'supertest';
import app from '../src/app.js';

describe('Traceability APIs', () => {
  describe('GET /api/traceability/:serialNumber', () => {
    it('should return complete traceability dossier for valid serial SN-2026-001245', async () => {
      const res = await request(app).get('/api/traceability/SN-2026-001245');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('product');
      expect(res.body.data.product.serial_number).toBe('SN-2026-001245');
      expect(Array.isArray(res.body.data.components)).toBe(true);
      expect(res.body.data.components.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body.data.productionHistory)).toBe(true);
      expect(Array.isArray(res.body.data.defects)).toBe(true);
      expect(Array.isArray(res.body.data.rework)).toBe(true);
      expect(Array.isArray(res.body.data.inspections)).toBe(true);
      expect(res.body.data.shipment).toBeDefined();
    });

    it('should return defect and rework details for SN-2026-001246', async () => {
      const res = await request(app).get('/api/traceability/SN-2026-001246');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.defects.length).toBeGreaterThan(0);
      expect(res.body.data.defects[0].defect_code).toBe('D-104');
      expect(res.body.data.rework.length).toBeGreaterThan(0);
    });

    it('should return 404 when product serial is not registered', async () => {
      const res = await request(app).get('/api/traceability/SN-UNKNOWN-999999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Product with the given serial number was not found');
    });

    it('should return 400 when serial number format is invalid', async () => {
      const res = await request(app).get('/api/traceability/$$$INVALID$$$');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid serial number format');
    });
  });

  describe('GET /api/products and sub-resources', () => {
    it('should return a list of registered products', async () => {
      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 400 when ID parameter is non-numeric', async () => {
      const res = await request(app).get('/api/products/not-a-number');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});

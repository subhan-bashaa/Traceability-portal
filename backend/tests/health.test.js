import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/health', () => {
  it('should return 200 OK with status and database connection info', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('database');
  });
});

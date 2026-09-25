import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { cacheService } from '../src/services/cacheService.js';
import { providerManager } from '../src/services/providerManager.js';

describe('AI Traceability Summary APIs (POST /api/ai/traceability-summary)', () => {
  beforeEach(async () => {
    // Flush cache before each test
    await cacheService.flush();
    jest.restoreAllMocks();
  });

  it('should return a successful AI summary on cache miss and then cache the result', async () => {
    const mockSummaryText = 'Unit SN-2026-001245 completed all manufacturing phases flawlessly with zero defects and is dispatched to Rotterdam.';

    // Mock AI provider manager to ensure NO real external API call is made
    const providerSpy = jest.spyOn(providerManager, 'generateAIResponse').mockResolvedValue({
      provider: 'groq',
      text: mockSummaryText,
    });

    // 1. First call: Cache MISS
    const res1 = await request(app)
      .post('/api/ai/traceability-summary')
      .send({ serialNumber: 'SN-2026-001245' });

    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);
    expect(res1.body.summary).toBe(mockSummaryText);
    expect(res1.body.cached).toBe(false);
    expect(providerSpy).toHaveBeenCalledTimes(1);

    // 2. Second call: Cache HIT
    const res2 = await request(app)
      .post('/api/ai/traceability-summary')
      .send({ serialNumber: 'SN-2026-001245' });

    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);
    expect(res2.body.summary).toBe(mockSummaryText);
    expect(res2.body.cached).toBe(true);
    // Provider should NOT be called again because of cache hit
    expect(providerSpy).toHaveBeenCalledTimes(1);
  });

  it('should return 404 when requested serial number does not exist', async () => {
    const res = await request(app)
      .post('/api/ai/traceability-summary')
      .send({ serialNumber: 'SN-UNKNOWN-999999' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not found in manufacturing records');
  });

  it('should return 400 when serial number is missing or malformed', async () => {
    const resEmpty = await request(app)
      .post('/api/ai/traceability-summary')
      .send({});

    expect(resEmpty.status).toBe(400);
    expect(resEmpty.body.success).toBe(false);

    const resInvalid = await request(app)
      .post('/api/ai/traceability-summary')
      .send({ serialNumber: '@@@BAD_SERIAL@@@' });

    expect(resInvalid.status).toBe(400);
    expect(resInvalid.body.success).toBe(false);
  });

  it('should handle provider fallback gracefully when primary provider fails', async () => {
    const fallbackText = 'Post-rework summary: Unit SN-2026-001246 was remediated under IPC-7711 standards and cleared for shipment.';

    // Mock fallback provider execution
    jest.spyOn(providerManager, 'generateAIResponse').mockResolvedValue({
      provider: 'gemini',
      text: fallbackText,
    });

    const res = await request(app)
      .post('/api/ai/traceability-summary')
      .send({ serialNumber: 'SN-2026-001246' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBe(fallbackText);
    expect(res.body.provider).toBe('gemini');
  });
});

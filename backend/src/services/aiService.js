import { traceabilityService } from './traceabilityService.js';
import { providerManager } from './providerManager.js';
import { cacheService } from './cacheService.js';
import { env } from '../config/env.js';

export const aiService = {
  /**
   * Generate an automated, factual manufacturing quality summary
   * Integrates caching, traceability data extraction, and AI provider fallback.
   */
  async generateTraceabilitySummary(serialNumber) {
    const cleanSerial = serialNumber.trim().toUpperCase();
    const cacheKey = `traceability-ai:${cleanSerial}`;

    // 1. Check cache first
    const cachedSummary = await cacheService.get(cacheKey);
    if (cachedSummary) {
      return {
        success: true,
        summary: cachedSummary,
        cached: true,
        cacheKey,
      };
    }

    // 2. Fetch full traceability dataset from PostgreSQL
    const traceData = await traceabilityService.getTraceabilityBySerialNumber(cleanSerial);
    if (!traceData) {
      const error = new Error(`Product with serial number "${cleanSerial}" not found in manufacturing records.`);
      error.status = 404;
      throw error;
    }

    // 3. Build strictly factual structured prompt
    const { product, components, productionHistory, defects, rework, inspections, shipment } = traceData;

    const prompt = `
MANUFACTURING TRACEABILITY DATA SHEET:
- Product: ${product.product_name} (${product.product_code})
- Serial Number: ${product.serial_number}
- Batch: ${product.batch_number}
- Manufacturing Date: ${product.manufacturing_date}
- Current Status: ${product.status}

COMPONENTS (${components.length} Traced Sub-assemblies):
${components.map((c) => `  * ${c.component_name} (Code: ${c.component_code}, Lot: ${c.lot_number}, Supplier: ${c.supplier})`).join('\n')}

PRODUCTION ROUTE (${productionHistory.length} Stations):
${productionHistory.map((s) => `  * Operation: ${s.operation_name} at Station ${s.station_name || s.station_code} | Result: ${s.result}`).join('\n')}

DEFECTS DETECTED (${defects.length} Flags):
${defects.length === 0 ? '  * Zero manufacturing defects recorded.' : defects.map((d) => `  * Defect ${d.defect_code}: ${d.description} (Severity: ${d.severity}, Status: ${d.status})`).join('\n')}

REWORK ACTIONS (${rework.length} Remediations):
${rework.length === 0 ? '  * No rework required. Passed first time.' : rework.map((r) => `  * Defect: ${r.defect_code} | Action: ${r.action_taken} | Result: ${r.result}`).join('\n')}

INSPECTIONS & PARAMETRIC READINGS:
${inspections.map((i) => `  * ${i.inspection_type}: Result=${i.result}, Voltage=${i.voltage || 'N/A'}V, Current=${i.current || 'N/A'}mA, Temp=${i.temperature || 'N/A'}°C`).join('\n')}

SHIPMENT / LOGISTICS:
${shipment ? `  * Shipment ID: ${shipment.shipment_id}, Carton: ${shipment.carton_number}, Destination: ${shipment.destination}, Status: ${shipment.status}` : '  * Awaiting shipment packaging.'}

TASK:
Provide a professional, 2-to-3 sentence executive manufacturing summary of this specific unit's journey from assembly to dispatch. Mention whether any defects occurred, how they were resolved (if applicable), and outgoing clearance status. Summarize ONLY the above facts.
`.trim();

    // 4. Generate response through AI Provider Manager
    const aiResponse = await providerManager.generateAIResponse(prompt);
    const summaryText = aiResponse.text;

    // 5. Store in cache with TTL
    await cacheService.set(cacheKey, summaryText, env.AI_CACHE_TTL);

    return {
      success: true,
      summary: summaryText,
      cached: false,
      provider: aiResponse.provider,
    };
  },
};

export default aiService;

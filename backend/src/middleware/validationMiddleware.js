/**
 * Input validation middleware for manufacturing traceability requests
 */

const SERIAL_REGEX = /^[A-Za-z0-9_-]{3,64}$/;

/**
 * Validate serial number parameter (route param :serialNumber)
 */
export function validateSerialParam(req, res, next) {
  const { serialNumber } = req.params;

  if (!serialNumber || typeof serialNumber !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Serial number parameter is required.',
    });
  }

  const cleanSerial = serialNumber.trim().toUpperCase();

  if (!SERIAL_REGEX.test(cleanSerial)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid serial number format. Expected alphanumeric characters, hyphens, or underscores (3-64 characters).',
    });
  }

  req.params.serialNumber = cleanSerial;
  next();
}

/**
 * Validate serial number in request body (e.g. POST /api/ai/traceability-summary)
 */
export function validateSerialBody(req, res, next) {
  const { serialNumber } = req.body || {};

  if (!serialNumber || typeof serialNumber !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Field "serialNumber" is required in request body.',
    });
  }

  const cleanSerial = serialNumber.trim().toUpperCase();

  if (!SERIAL_REGEX.test(cleanSerial)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid serial number format. Expected alphanumeric characters, hyphens, or underscores (3-64 characters).',
    });
  }

  req.body.serialNumber = cleanSerial;
  next();
}

/**
 * Validate numeric ID parameter (route param :id)
 */
export function validateIdParam(req, res, next) {
  const { id } = req.params;
  const numId = parseInt(id, 10);

  if (isNaN(numId) || numId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Product ID must be a positive integer.',
    });
  }

  req.params.id = numId;
  next();
}

export default {
  validateSerialParam,
  validateSerialBody,
  validateIdParam,
};

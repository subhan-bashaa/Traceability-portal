import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fynd_traceability_super_secret_jwt_key_2026';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authController = {
  /**
   * Register a new user
   * POST /api/auth/signup
   */
  async signup(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // 1. Strict Validation
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Full name is required (minimum 2 characters).',
        });
      }

      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: 'A valid email address is required.',
        });
      }

      if (!password || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters.',
        });
      }

      // Restrict role: normal signups can only be 'buyer' or 'field_engineer'
      const assignedRole = role === 'field_engineer' ? 'field_engineer' : 'buyer';

      // 2. Check if user already exists
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      // 3. Hash password securely with bcrypt
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // 4. Insert user into NeonDB
      const insertQuery = `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at
      `;
      const result = await pool.query(insertQuery, [name.trim(), cleanEmail, passwordHash, assignedRole]);
      const newUser = result.rows[0];

      // 5. Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      console.error('[AUTH SIGNUP ERROR]', err);
      return res.status(500).json({
        success: false,
        message: 'Unable to process account registration. Please try again.',
      });
    }
  },

  /**
   * Authenticate user
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.',
        });
      }

      // 1. Fetch user from NeonDB
      const query = 'SELECT id, name, email, password_hash, role FROM users WHERE email = $1';
      const result = await pool.query(query, [cleanEmail]);

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const user = result.rows[0];

      // 2. Compare password hash
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      // 3. Issue JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error('[AUTH LOGIN ERROR]', err);
      return res.status(500).json({
        success: false,
        message: 'Unable to connect to the authentication server. Please try again.',
      });
    }
  },

  /**
   * Get current authenticated user profile
   * GET /api/auth/me
   */
  async getMe(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Authorization token missing.',
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
      const result = await pool.query(query, [decoded.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User session not found.',
        });
      }

      return res.status(200).json({
        success: true,
        user: result.rows[0],
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }
  },

  /**
   * Terminate session
   * POST /api/auth/logout
   */
  async logout(req, res) {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  },
};

export default authController;

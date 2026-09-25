import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ShieldAlert, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import PasswordInput from './PasswordInput';
import { useAuth } from '../../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm({ onSwitchToLogin }) {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer', // Default role
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your real full name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid business email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirming your password is required.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your manufacturing role.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time clearance of field errors
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    // Also re-check confirm password matching if password changes
    if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
    } else if (name === 'password' && formData.confirmPassword && value === formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submission

    if (!validate()) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      const res = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      if (res?.token) {
        navigate('/dashboard');
      }
    } catch (err) {
      setFormError(err.message || 'Unable to register account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
      {/* Global Form Error */}
      {formError && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{formError}</div>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1">
        <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-700">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="signup-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Subhan Basha"
          disabled={isSubmitting}
          autoComplete="name"
          className={`w-full pl-3.5 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-100 ${
            errors.name
              ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
              : 'border-slate-200 bg-slate-50/60 text-slate-800 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100'
          }`}
        />
        {errors.name && (
          <div className="flex items-center gap-1 text-[11px] text-rose-600 mt-1 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.name}</span>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700">
          Business Email <span className="text-rose-500">*</span>
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@example.com"
          disabled={isSubmitting}
          autoComplete="email"
          className={`w-full pl-3.5 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-100 ${
            errors.email
              ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
              : 'border-slate-200 bg-slate-50/60 text-slate-800 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100'
          }`}
        />
        {errors.email && (
          <div className="flex items-center gap-1 text-[11px] text-rose-600 mt-1 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Password with Eye Toggle */}
      <PasswordInput
        id="signup-password"
        name="password"
        label="Password (min 8 characters)"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create secure password"
        error={errors.password}
        required
        disabled={isSubmitting}
        autoComplete="new-password"
      />

      {/* Confirm Password with Eye Toggle */}
      <PasswordInput
        id="signup-confirm-password"
        name="confirmPassword"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Re-enter password"
        error={errors.confirmPassword}
        required
        disabled={isSubmitting}
        autoComplete="new-password"
      />

      {/* Role Selection Dropdown */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="signup-role" className="block text-xs font-semibold text-slate-700">
            Manufacturing Role <span className="text-rose-500">*</span>
          </label>
        </div>
        <select
          id="signup-role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/60 text-slate-800 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100 transition-all"
        >
          <option value="buyer">Buyer (OEM / Enterprise Purchaser)</option>
          <option value="field_engineer">Field Engineer (Quality & Diagnostics)</option>
        </select>
        <p className="text-[10px] text-slate-400">
          Admin access is restricted and provisioned securely by system administrators.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-900/30"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>

      {/* Footer Switch to Login */}
      <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={isSubmitting}
          className="text-slate-900 hover:underline font-semibold transition"
        >
          Login
        </button>
      </div>
    </form>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, Info } from 'lucide-react';
import PasswordInput from './PasswordInput';
import { useAuth } from '../../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({ onSwitchToSignup }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format (e.g., name@company.com).';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Global Form Error Banner */}
      {formError && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{formError}</div>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1">
        <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700">
          Email <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="login-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={isSubmitting}
            autoComplete="email"
            className={`w-full pl-3.5 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-100 ${
              errors.email
                ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-200 bg-slate-50/60 text-slate-800 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100'
            }`}
          />
        </div>
        {errors.email && (
          <div className="flex items-center gap-1 text-[11px] text-rose-600 mt-1 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Password Field with Eye Toggle */}
      <PasswordInput
        id="login-password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        error={errors.password}
        required
        disabled={isSubmitting}
        autoComplete="current-password"
      />

      {/* Forgot Password Link */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setShowForgotNotice((prev) => !prev)}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium transition"
        >
          Forgot password?
        </button>
      </div>

      {/* Informational notice for forgot password */}
      {showForgotNotice && (
        <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2 animate-fadeIn">
          <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
          <span>
            For security compliance, passwords are managed by your plant administrator. Contact your MES system administrator to reset credentials.
          </span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-900/30"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Logging in...</span>
          </>
        ) : (
          <span>Login</span>
        )}
      </button>

      {/* Footer Switch to Sign Up */}
      <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          disabled={isSubmitting}
          className="text-slate-900 hover:underline font-semibold transition"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}

import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordInput({
  id,
  name,
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  required = false,
  disabled = false,
  autoComplete = 'current-password',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      </div>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm rounded-lg border transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-100 ${
            error
              ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
              : 'border-slate-200 bg-slate-50/60 text-slate-800 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100'
          }`}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          tabIndex={-1}
          disabled={disabled}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition rounded"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-[11px] text-rose-600 mt-1 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

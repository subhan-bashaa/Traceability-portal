import React, { useEffect, useRef } from 'react';
import { X, Layers, ShieldCheck } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, setAuthModalMode, closeAuthModal } = useAuth();
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };

    if (isAuthModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeAuthModal();
        }
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="auth-modal-title"
    >
      {/* Clean Enterprise Modal Card */}
      <div
        ref={modalRef}
        className="w-full max-w-[410px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden relative max-h-[92vh] flex flex-col animate-scaleUp"
      >
        {/* Close Button (X) */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pt-7 pb-4 px-6 text-center border-b border-slate-100 bg-slate-50/50">
          {/* Professional Brand Icon */}
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm mb-3">
            <Layers className="w-6 h-6 text-white" />
          </div>

          <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900 tracking-tight">
            TraceCore
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {authModalMode === 'login'
              ? 'Secure access to your manufacturing portal'
              : 'Create your verified enterprise account'}
          </p>

          {/* Segmented Mode Switcher */}
          <div className="mt-4 p-1 bg-slate-200/60 rounded-xl grid grid-cols-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthModalMode('login')}
              className={`py-2 rounded-lg transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('signup')}
              className={`py-2 rounded-lg transition-all ${
                authModalMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Modal Body / Active Form */}
        <div className="p-6 overflow-y-auto flex-1">
          {authModalMode === 'login' ? (
            <LoginForm onSwitchToSignup={() => setAuthModalMode('signup')} />
          ) : (
            <SignupForm onSwitchToLogin={() => setAuthModalMode('login')} />
          )}
        </div>

        {/* Security Badge Footer */}
        <div className="py-2.5 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted MES Authentication • ISO 9001 Compliant</span>
        </div>
      </div>
    </div>
  );
}

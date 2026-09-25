import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthToast() {
  const { authToast, clearToast } = useAuth();

  if (!authToast) return null;

  const isSuccess = authToast.type === 'success';
  const isError = authToast.type === 'error';

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-slideIn no-print">
      <div
        className={`p-3.5 rounded-xl shadow-lg border flex items-start gap-3 backdrop-blur-md transition-all ${
          isSuccess
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10'
            : isError
            ? 'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/10'
            : 'bg-blue-50/95 border-blue-200 text-blue-900 shadow-blue-500/10'
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-600" />}
        </div>

        <div className="flex-1 text-xs font-medium leading-relaxed">
          {authToast.message}
        </div>

        <button
          type="button"
          onClick={clearToast}
          className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 rounded"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

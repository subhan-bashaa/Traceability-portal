import React from 'react';
import { Cpu, Loader2 } from 'lucide-react';

export default function LoadingSpinner({
  message = 'Querying manufacturing execution database & component ledger...',
  subtext = 'Synchronizing genealogy, quality metrics, and test bench logs',
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-subtle my-6">
      <div className="relative flex items-center justify-center">
        {/* Radar wave pulse */}
        <div className="absolute w-20 h-20 rounded-full bg-brand-100 animate-ping opacity-50" />
        <div className="relative w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shadow-sm">
          <Cpu className="w-8 h-8 animate-pulse text-brand-600" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-slate-850 font-semibold text-base">
        <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
        <span>{message}</span>
      </div>

      <p className="mt-1 text-xs text-slate-500 max-w-md">{subtext}</p>

      {/* Simulated progress ticker */}
      <div className="mt-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

import React from 'react';
import { AlertOctagon, RefreshCw, QrCode, Search, CheckCircle } from 'lucide-react';
import { useTraceability } from '../../context/TraceabilityContext';

export default function ErrorState({
  serialNumber,
  errorMessage,
  onRetry,
  onSelectSerial,
}) {
  const { setIsScannerOpen } = useTraceability();

  const suggestedSerials = [
    { serial: 'SN-2026-001245', note: 'Flawless production run' },
    { serial: 'SN-2026-001246', note: 'Defect detection & rework flow' },
    { serial: 'SN-2026-001247', note: 'Active in-production unit' },
  ];

  return (
    <div className="bg-white rounded-xl border border-rose-200/90 p-8 md:p-10 text-center shadow-subtle my-6 max-w-2xl mx-auto">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
        <AlertOctagon className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        Serial Number Not Found
      </h3>

      {serialNumber && (
        <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-md font-mono text-sm text-slate-700 font-semibold border border-slate-200">
          {serialNumber}
        </div>
      )}

      <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        {errorMessage ||
          'This serial number is not registered in the manufacturing database. Please verify the serial number or re-scan the label.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan Barcode Instead</span>
        </button>
      </div>
    </div>
  );
}

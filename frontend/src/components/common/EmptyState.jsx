import React from 'react';
import { Search, QrCode, ArrowRight, ShieldCheck, Box } from 'lucide-react';
import { useTraceability } from '../../context/TraceabilityContext';

export default function EmptyState({ onSelectSerial }) {
  const { setIsScannerOpen } = useTraceability();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-8 md:p-12 text-center shadow-subtle my-6 max-w-3xl mx-auto">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-5">
        <Box className="w-8 h-8 text-brand-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        Ready for Product Traceability Verification
      </h3>
      <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
        Input any production serial number or scan the QR code to pull comprehensive digital thread data,
        including component lot genealogy, QA station readings, defect rework logs, and dispatch manifests.
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm"
        >
          <QrCode className="w-4 h-4" />
          <span>Open Barcode / QR Scanner</span>
        </button>
      </div>
    </div>
  );
}

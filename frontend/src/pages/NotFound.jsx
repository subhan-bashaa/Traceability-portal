import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Search, Layers } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-6">
        <FileQuestion className="w-8 h-8 text-brand-600" />
      </div>

      <span className="font-mono text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full mb-3">
        Error 404 • Ledger Route Undefined
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        Trace Record Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        The requested portal page or traceability route does not exist or has been archived by the MES controller.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span>Traceability Search</span>
        </Link>
      </div>
    </div>
  );
}

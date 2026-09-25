import React, { useState } from 'react';
import { Search, QrCode, ArrowRight, X, Sparkles } from 'lucide-react';
import { useTraceability } from '../../context/TraceabilityContext';
import { useAuth } from '../../context/AuthContext';

export default function SearchBar({
  onSearch,
  initialValue = '',
  size = 'default',
  showSamples = true,
  placeholder = 'Enter product serial number (e.g. SN-2026-001245)...',
  className = '',
}) {
  const [query, setQuery] = useState(initialValue);
  const { setIsScannerOpen } = useTraceability();
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleScanClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    setIsScannerOpen(true);
  };

  const handleSampleClick = (serial) => {
    setQuery(serial);
    onSearch(serial);
  };

  const isLarge = size === 'large';

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className={`flex items-center w-full bg-white rounded-xl border border-slate-300 shadow-sm focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 transition-all ${
            isLarge ? 'p-2' : 'p-1.5'
          }`}
        >
          <div className="pl-3 pr-2 text-slate-400">
            <Search className={isLarge ? 'w-6 h-6 text-brand-600' : 'w-5 h-5 text-slate-400'} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder={placeholder}
            className={`w-full bg-transparent border-none outline-none font-mono text-slate-800 placeholder-slate-400 tracking-wider ${
              isLarge ? 'text-base md:text-lg py-2' : 'text-sm py-1.5'
            }`}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              type="button"
              onClick={handleScanClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Scan Barcode / QR Code"
            >
              <QrCode className="w-4 h-4 text-brand-600" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            <button
              type="submit"
              disabled={!query.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition"
            >
              <span>Trace History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] text-slate-400">
          Enter an assigned product serial number or scan the QR code to pull manufacturing records.
        </span>
      </div>
    </div>
  );
}

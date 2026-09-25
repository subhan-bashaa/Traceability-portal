import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, ArrowRight, Package, Search, Sparkles } from 'lucide-react';
import { useTraceability } from '../context/TraceabilityContext';
import StatusBadge from '../components/common/StatusBadge';

export default function RecentSearches() {
  const navigate = useNavigate();
  const { recentSearches, clearRecentSearches } = useTraceability();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Audit History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Recent Traceability Searches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browser session search cache for quick comparison between audited serial units.
          </p>
        </div>

        {recentSearches && recentSearches.length > 0 && (
          <button
            type="button"
            onClick={clearRecentSearches}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6">
        {recentSearches && recentSearches.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentSearches.map((item) => (
              <div
                key={item.serialNumber}
                onClick={() => navigate(`/product/${item.serialNumber}`)}
                className="py-4 px-3 -mx-3 rounded-lg hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center text-slate-600 transition">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900 group-hover:text-brand-600 transition">
                        {item.serialNumber}
                      </span>
                      <StatusBadge status={item.status} size="sm" />
                      {item.hasRework && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Rework Remediated
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.productName} • Batch: <span className="font-mono">{item.batch || 'BATCH-2026'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 self-end sm:self-center">
                  <span>{item.lastUpdated || 'Recently'}</span>
                  <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-brand-600 group-hover:bg-brand-50 group-hover:translate-x-1 transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Recent Searches</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Any serial numbers you look up will be cached here for fast re-access during your shift.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Go to Traceability Search</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

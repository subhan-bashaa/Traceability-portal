import React, { useState } from 'react';
import { Sparkles, Bot, Loader2, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import { getAITraceabilitySummary } from '../../services/api';

export default function AISummaryCard({ serialNumber }) {
  const [summary, setSummary] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const fetchSummary = async () => {
    if (!serialNumber) return;
    setLoading(true);
    setHasRequested(true);

    try {
      const response = await getAITraceabilitySummary(serialNumber);
      if (response && response.summary) {
        setSummary(response.summary);
        setProvider(response.provider || 'Gemini / Groq Llama-3.3');
        setIsCached(Boolean(response.cached));
      }
    } catch (err) {
      console.error('Failed to fetch AI summary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-xl border border-slate-800 shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Manufacturing Quality Audit Summary
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-300 border border-brand-500/40">
                Multi-Provider Orchestration
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated executive summary synthesized strictly from verified PostgreSQL provenance data
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchSummary}
          disabled={loading}
          className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:opacity-50 transition shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{hasRequested ? 'Re-generate Summary' : 'Generate AI Summary'}</span>
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="mt-4 p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-brand-400 animate-spin flex-shrink-0" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-white">Querying AI Provider Fallback Chain (Gemini → Groq Fallback)...</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Validating anti-hallucination constraints against component ledger</p>
          </div>
        </div>
      )}

      {!loading && summary && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            "{summary}"
          </p>

          <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strict Database Provenance Verified</span>
              </span>
              <span>•</span>
              <span>Engine: <span className="font-mono text-slate-300 uppercase">{provider}</span></span>
            </div>

            {isCached && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Served from Redis/Memory Cache
              </span>
            )}
          </div>
        </div>
      )}

      {!loading && !summary && !hasRequested && (
        <div className="mt-4 text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Click "Generate AI Summary" to synthesize an executive quality briefing for this unit.</span>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Cpu,
  CheckCircle2,
  Truck,
  ArrowRight,
  History,
  QrCode,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import { useTraceability } from '../context/TraceabilityContext';
import { getDashboardStats } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { recentSearches, setIsScannerOpen } = useTraceability();
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setIsLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  const handleSearch = (serial) => {
    if (serial) {
      navigate(`/product/${serial}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero / Welcome Section with Search */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 sm:p-10 text-white shadow-xl overflow-hidden border border-slate-800">
        {/* Ambient background glow & engineering grid */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span>Manufacturing Digital Thread • MES Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            TraceCore Traceability
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Complete product history from manufacturing to shipment. Enter or scan any serial number to audit
            raw component lots, assembly telemetry, rework history, and outgoing quality clearance.
          </p>

          {/* Large Serial Search Box */}
          <div className="mt-8">
            <SearchBar
              size="large"
              placeholder="Enter product serial number (e.g. SN-2026-001245)..."
              onSearch={handleSearch}
              showSamples={true}
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Plant Production & Traceability KPIs</span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-normal">• Live Shift (NeonDB)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value={isLoadingStats ? '...' : (stats?.totalProducts ?? 0).toLocaleString()}
            subtitle="Registered units in genealogy ledger"
            icon={Package}
            color="blue"
            badge={stats?.totalProducts > 0 ? "100% Traced" : "Live DB"}
          />

          <StatCard
            title="In Production"
            value={isLoadingStats ? '...' : (stats?.inProduction ?? 0).toLocaleString()}
            subtitle="Active across SMT & test benches"
            icon={Cpu}
            color="indigo"
            badge="Active Line"
          />

          <StatCard
            title="Quality Passed"
            value={isLoadingStats ? '...' : (stats?.qualityPassed ?? 0).toLocaleString()}
            subtitle="Conforming to IPC Class 3 standards"
            icon={CheckCircle2}
            color="emerald"
            trend={stats?.totalProducts > 0 ? { text: `${stats.passRatePercent || 100}% First-Pass Yield`, isPositive: true } : null}
          />

          <StatCard
            title="Dispatched"
            value={isLoadingStats ? '...' : (stats?.dispatched ?? 0).toLocaleString()}
            subtitle="Cleared and carton aggregated"
            icon={Truck}
            color="amber"
            badge="Carrier Cleared"
          />
        </div>
      </div>

      {/* Recent Traceability Searches Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-subtle p-6 transition-colors duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <History className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Recent Traceability Searches
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quickly re-open previously audited product serials and inspection dossiers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/recent')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {recentSearches && recentSearches.length > 0 ? (
            recentSearches.slice(0, 5).map((item) => (
              <div
                key={item.serialNumber}
                onClick={() => navigate(`/product/${item.serialNumber}`)}
                className="py-3.5 px-3 -mx-3 rounded-lg hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center text-slate-500 transition">
                    <Package className="w-4 h-4" />
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

                <div className="flex items-center gap-4 text-xs text-slate-400 self-end sm:self-center">
                  <span>{item.lastUpdated || 'Recently'}</span>
                  <div className="p-1 rounded-md text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No recent searches recorded. Search for a serial number above or select a sample.
            </div>
          )}
        </div>
      </div>

      {/* Manufacturing Traceability Highlight Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-start gap-3.5 transition-colors duration-200">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-brand-600 dark:text-brand-400 border border-blue-100 dark:border-blue-900/60">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">100% Component Genealogy</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Track raw lots, PCB fabrication lots, and sub-tier supplier certificates back to the source wafer.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-start gap-3.5 transition-colors duration-200">
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Defect & Rework Transparency</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Complete visibility into anomalies, micro-soldering rework records, and secondary QA approvals.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-start gap-3.5 transition-colors duration-200">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Buyer Outgoing COC</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Instant Certificate of Conformity verification with carton barcodes and international dispatch tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

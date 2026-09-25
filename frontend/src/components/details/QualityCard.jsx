import React from 'react';
import { Gauge, CheckCircle2, XCircle, User, Clock, ShieldCheck, Zap, Thermometer, Activity } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function QualityCard({ quality }) {
  if (!quality) return null;

  const getMetricIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('volt')) return <Zap className="w-4 h-4 text-amber-500" />;
    if (n.includes('curr') || n.includes('drain')) return <Activity className="w-4 h-4 text-blue-500" />;
    if (n.includes('temp')) return <Thermometer className="w-4 h-4 text-rose-500" />;
    return <Gauge className="w-4 h-4 text-brand-600" />;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Quality Assurance & Electrical Parametric Measurements
            </h3>
            <p className="text-xs text-slate-500">
              In-circuit test bench readings, voltage rails, and environmental stress telemetry
            </p>
          </div>
        </div>
        <StatusBadge status={quality.inspectionStatus} size="md" />
      </div>

      {/* Inspector Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 p-3.5 rounded-lg bg-slate-50/70 border border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">Lead QA Inspector</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
            <User className="w-3.5 h-3.5 text-slate-500" />
            {quality.inspector}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">Inspection Timestamp</span>
          <span className="font-mono text-slate-800 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {quality.inspectionTime}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">Bench Test Standard</span>
          <span className="font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {quality.overallCompliance || 'IPC-A-610 Class 3'}
          </span>
        </div>
      </div>

      {/* Parametric Test Bench Readings */}
      <div>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Bench Measurement Matrix:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quality.metrics &&
            quality.metrics.map((metric, idx) => {
              const isPass = metric.status === 'PASS';
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-brand-200 transition flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      {getMetricIcon(metric.name)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{metric.name}</p>
                      <p className="text-base font-mono font-bold text-slate-900 mt-0.5">
                        {metric.value}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">Spec: {metric.target}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${
                      isPass
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {metric.status}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

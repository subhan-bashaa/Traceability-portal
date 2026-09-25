import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Clock, User, Cpu } from 'lucide-react';

export default function ProductionTimeline({ journey = [] }) {
  if (!journey || journey.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 mb-6">
        <p className="text-sm text-slate-500">No production journey stages recorded yet.</p>
      </div>
    );
  }

  const getStatusIcon = (result) => {
    switch (result) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (result) => {
    switch (result) {
      case 'completed':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Stage Passed
          </span>
        );
      case 'warning':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Anomaly Flagged
          </span>
        );
      case 'failed':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Defect Triggered
          </span>
        );
      case 'in-progress':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Running Active
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Pending
          </span>
        );
    }
  };

  const getNodeColors = (result) => {
    switch (result) {
      case 'completed':
        return 'bg-emerald-100 border-emerald-500 text-emerald-600 ring-4 ring-emerald-50';
      case 'warning':
        return 'bg-amber-100 border-amber-500 text-amber-600 ring-4 ring-amber-50';
      case 'failed':
        return 'bg-rose-100 border-rose-500 text-rose-600 ring-4 ring-rose-50';
      case 'in-progress':
        return 'bg-blue-100 border-brand-500 text-brand-600 ring-4 ring-blue-50 animate-pulse';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Production Journey (Manufacturing Execution Ledger)
            </h3>
            <p className="text-xs text-slate-500">
              Station by station timeline with operator signatures and execution status
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono font-medium">
          {journey.length} Discrete Operations
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="mt-8 relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 space-y-6">
        {journey.map((item, index) => {
          return (
            <div key={index} className="relative group">
              {/* Bullet circle */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center bg-white transition-all ${getNodeColors(
                  item.result
                )}`}
              >
                {getStatusIcon(item.result)}
              </div>

              {/* Card content */}
              <div className="bg-slate-50/70 hover:bg-slate-50 transition-colors border border-slate-200/70 rounded-xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center justify-center">
                      {item.step || index + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.stage}</h4>
                  </div>
                  <div>{getStatusBadge(item.result)}</div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
                      Workstation
                    </span>
                    <span className="font-medium text-slate-700 flex items-center gap-1.5 mt-0.5">
                      <Cpu className="w-3.5 h-3.5 text-brand-600" />
                      {item.station}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
                      Certified Operator
                    </span>
                    <span className="font-medium text-slate-700 flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {item.operator}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
                      Execution Window
                    </span>
                    <span className="font-mono text-slate-700 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.startTime} → {item.endTime}
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <div className="mt-3 pt-3 border-t border-slate-200/40 text-xs text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700">Audit Notes:</span> {item.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

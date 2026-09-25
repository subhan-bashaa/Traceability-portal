import React from 'react';
import { RotateCcw, CheckCircle2, User, Clock, ShieldCheck, Wrench } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function ReworkCard({ reworkHistory = [] }) {
  if (!reworkHistory || reworkHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 border border-slate-200">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Rework & Remediation History
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                First-Pass Yield 100%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              This unit passed all manufacturing and boundary-scan gates on first pass with zero rework required.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-amber-200/90 shadow-subtle p-6 mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Rework & Remediation History
            </h3>
            <p className="text-xs text-slate-500">
              IPC-7711/7721 certified rework actions, operator logs, and secondary qualification
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-mono font-bold">
          {reworkHistory.length} Rework Event
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {reworkHistory.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-amber-200/80 bg-slate-50/70 hover:bg-slate-50 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900">{item.defect}</h4>
              </div>
              <StatusBadge status={item.result} size="sm" />
            </div>

            <div className="mt-3">
              <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
                Remediation Action Executed
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/70 font-mono">
                {item.reworkAction}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
                  Certified Specialist
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {item.operator}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
                  Completion Timestamp
                </span>
                <span className="font-mono text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {item.timestamp}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
                  QA Sign-off Officer
                </span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {item.reworkSignoffOfficer || 'Verified & Signed'}
                </span>
              </div>
            </div>

            {item.postReworkInspection && (
              <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Post-Rework Re-Test Verification:</span>{' '}
                  {item.postReworkInspection}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

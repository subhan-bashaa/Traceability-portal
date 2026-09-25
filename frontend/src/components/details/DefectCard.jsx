import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Clock, MapPin, AlertCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function DefectCard({ defects = [] }) {
  if (!defects || defects.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-emerald-200/80 shadow-subtle p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Defects & Non-Conformance Log
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                0 Defects Flagged
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero manufacturing defects or component anomalies recorded throughout the production lifecycle.
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
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Defects & Non-Conformance Log
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of assembly flags, in-circuit test anomalies, and disposition statuses
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-mono font-bold">
          {defects.length} Defect Recorded
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {defects.map((defect, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 hover:bg-amber-50/40 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {defect.defectCode}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{defect.description}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Severity: {defect.severity}
                </span>
                <StatusBadge status={defect.status} size="sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">Detected Station:</span>
                <span className="text-slate-800">{defect.station}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">Timestamp:</span>
                <span className="font-mono text-slate-800">{defect.detectedTime}</span>
              </div>
            </div>

            {defect.remedy && (
              <div className="mt-3 pt-2.5 border-t border-amber-100/60 text-xs text-amber-900">
                <span className="font-bold">Corrective Routing:</span> {defect.remedy}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

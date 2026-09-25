import React from 'react';
import { ClipboardCheck, CheckCircle2, User, Calendar, Shield, Award, FileCheck } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function InspectionCard({ finalInspection }) {
  if (!finalInspection) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Final Outgoing Inspection & Certificate of Conformity
            </h3>
            <p className="text-xs text-slate-500">
              End-of-line quality clearance, regulatory standards, and authority sign-off
            </p>
          </div>
        </div>
        <StatusBadge status={finalInspection.result} size="md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
        <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
            Certifying Officer
          </span>
          <p className="mt-1 text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {finalInspection.inspector}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
            Inspection Date & Time
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {finalInspection.inspectionDate}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
            Approval Status
          </span>
          <p className="mt-1 text-xs font-bold text-emerald-700 flex items-center gap-1.5 truncate">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            {finalInspection.approvalStatus}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
            Certificate Number
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-brand-700 flex items-center gap-1.5 truncate">
            <Award className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            {finalInspection.certificateNumber}
          </p>
        </div>
      </div>

      {finalInspection.standards && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500">Certified Standards:</span>
            {finalInspection.standards.map((std, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px] font-medium"
              >
                {std}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Digital Cryptographic Audit Seal Verified</span>
          </div>
        </div>
      )}

      {finalInspection.comments && (
        <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Inspector Sign-off Comments:</span> {finalInspection.comments}
        </div>
      )}
    </div>
  );
}

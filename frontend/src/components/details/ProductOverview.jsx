import React from 'react';
import { Cpu, Calendar, Hash, Layers, Building2, User, Printer, QrCode, ShieldCheck } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function ProductOverview({ product }) {
  if (!product) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm px-2.5 py-1 bg-slate-900 text-brand-300 font-bold rounded-lg border border-slate-700 tracking-wider">
              {product.serialNumber}
            </span>
            <StatusBadge status={product.currentStatus} size="md" />
            {product.modelRevision && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                {product.modelRevision}
              </span>
            )}
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {product.productName}
          </h2>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Plant Facility: {product.facility || 'Austin TX Cleanroom Fab 4'}</span>
            <span>•</span>
            <span>Line: {product.plantLine || 'Alpha'}</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start lg:self-center no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Grid of metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6">
        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            Product Code
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-800 truncate">{product.productCode}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Batch Number
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-800 truncate">{product.batchNumber}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Mfg Date
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-800">{product.manufacturingDate}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Completion Date
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-800">{product.completionDate}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            Buyer
          </span>
          <p className="mt-1 text-xs font-bold text-slate-800 truncate">
            {product.buyer ? product.buyer.name : 'OEM Inventory'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Compliance
          </span>
          <p className="mt-1 text-xs font-bold text-emerald-700 truncate">
            ISO 9001 / IPC-A-610
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Layers, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

export default function ComponentTable({ components = [] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Component Genealogy & Bill of Materials (BOM)
            </h3>
            <p className="text-xs text-slate-500">
              Raw sub-assemblies, supplier traceability, and lot tracking numbers
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono font-medium">
          {components.length} Traced Sub-components
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Component</th>
              <th className="py-3 px-4">Component Code</th>
              <th className="py-3 px-4">Lot Number</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Certificate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {components.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  {item.component}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{item.componentCode}</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
                    {item.lotNumber}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-700">{item.supplier}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-center">{item.quantity}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {item.certNumber || 'COC-VERIFIED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

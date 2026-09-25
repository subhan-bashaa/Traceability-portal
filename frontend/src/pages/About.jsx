import React from 'react';
import { Layers, ShieldCheck, Cpu, Code2, Server, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const steps = [
    { title: '1. Serial Number', desc: 'Unique identifier laser-etched onto the PCB and 2D Data Matrix code on carton.' },
    { title: '2. Product Overview', desc: 'Hardware revision, build batch, manufacturing facility, and buyer purchase order.' },
    { title: '3. Component Genealogy', desc: 'Lot-level traceability for every sub-tier component, IC, PCB, and raw material.' },
    { title: '4. Production Journey', desc: 'Time-stamped operations across SMT, wave soldering, boundary scan, and packaging.' },
    { title: '5. Quality & Telemetry', desc: 'Voltage rails, operating currents, junction temperatures, and RF parametric data.' },
    { title: '6. Defects & Rework', desc: 'Full non-conformance records, microscopic rework actions, and secondary validation.' },
    { title: '7. Final Inspection', desc: 'Lead inspector sign-off, digital cryptographic seal, and Certificate of Conformity.' },
    { title: '8. Shipment Logistics', desc: 'Carton aggregation, pallet numbering, destination hub, and carrier tracking.' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5 text-brand-600" />
          <span>Architecture & Traceability Standards</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          About TraceCore Traceability
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
          TraceCore Traceability is an enterprise-grade manufacturing digital thread portal. It provides buyers,
          quality auditors, and systems engineers with end-to-end provenance—guaranteeing that every delivered
          unit meets strict aerospace, automotive, or industrial quality thresholds.
        </p>
      </div>

      {/* The 8-Stage Digital Thread Flow */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
          End-to-End Traceability Pipeline
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          The sequential verification lifecycle for each manufactured unit:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <span className="text-xs font-bold text-brand-600 block mb-1">{st.title}</span>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Backend API Preparation Architecture */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Backend Integration Architecture (Node.js + Express Ready)
            </h2>
            <p className="text-xs text-slate-500">
              Axios service layer pre-configured in <code className="font-mono text-brand-700 bg-slate-100 px-1.5 py-0.5 rounded">src/services/api.js</code>
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          The portal is structured with clean separation of concerns. While currently powered by high-fidelity
          mock data for instant offline testing and hackathon walkthroughs, the Axios client automatically targets
          the future Express backend endpoint:
        </p>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
          <p className="text-emerald-400 font-bold mb-1">// API Route Contract</p>
          <p><span className="text-blue-400">GET</span> /api/traceability/:serialNumber</p>
          <p><span className="text-blue-400">GET</span> /api/stats</p>
          <p><span className="text-blue-400">GET</span> /api/recent-searches</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Simulated Network Latency (350ms)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Automatic Mock Fallback When Offline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configurable with <code className="font-mono bg-slate-100 px-1 rounded">VITE_API_URL</code></span>
          </div>
        </div>
      </div>

      {/* Quick launch */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-brand-600 to-blue-700 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md">
        <div>
          <h3 className="text-base font-bold">Ready to test the digital thread?</h3>
          <p className="text-xs text-blue-100 mt-1">Audit verified serial numbers in the search console.</p>
        </div>
        <Link
          to="/search"
          className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-brand-700 hover:bg-blue-50 text-xs font-bold transition shadow-sm"
        >
          <span>Open Search Console</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

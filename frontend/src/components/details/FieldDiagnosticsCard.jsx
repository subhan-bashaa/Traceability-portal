import React, { useState } from 'react';
import { Wrench, AlertTriangle, ShieldCheck, Activity, Search, CheckCircle2, ChevronDown, ChevronUp, Stethoscope } from 'lucide-react';

export default function FieldDiagnosticsCard({ product }) {
  const [fieldVoltage, setFieldVoltage] = useState('');
  const [fieldTemp, setFieldTemp] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  if (!product) return null;

  const hasRework = product.reworkHistory && product.reworkHistory.length > 0;
  const hasDefects = product.defects && product.defects.length > 0;

  const baselineVoltage = parseFloat(product.quality?.metrics?.[0]?.value) || 12.0;
  const baselineTemp = parseFloat(product.quality?.metrics?.[2]?.value) || 42.0;

  const handleRunDiagnostic = (e) => {
    e.preventDefault();
    const v = parseFloat(fieldVoltage);
    const t = parseFloat(fieldTemp);

    const issues = [];
    if (!isNaN(v)) {
      const vDelta = Math.abs(v - baselineVoltage);
      if (vDelta > 1.0) {
        issues.push(`Voltage deviation of ${vDelta.toFixed(2)}V detected (Baseline: ${baselineVoltage}V, Field: ${v}V). Possible power stage or regulator degradation.`);
      }
    }
    if (!isNaN(t)) {
      if (t > 65.0) {
        issues.push(`Thermal elevation detected (${t}°C vs Factory Baseline ${baselineTemp}°C). Thermal interface pad (TIM) or heatsink re-application recommended.`);
      }
    }

    if (hasRework) {
      issues.push(`Unit was reworked in factory (${product.reworkHistory[0]?.defect}). Inspect solder joints on reworked IC pins under magnifying loupe.`);
    }

    setDiagnosticResult({
      status: issues.length === 0 ? 'NOMINAL' : 'ADVISORY',
      issues,
      recommendation:
        issues.length === 0
          ? 'Operating within nominal factory tolerances. No electronic degradation detected.'
          : 'Component inspection & field service recommended based on factory baseline divergence.',
    });
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-500/40 p-6 text-white shadow-xl space-y-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Field Engineer Diagnostics Console</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40">
                ACTIVE MODE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              RMA root cause analysis, factory baseline comparison, and rework joint investigation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Unit Status:</span>
          <span className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs ${hasRework ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
            {hasRework ? 'Reworked Unit' : 'Clean Assembly'}
          </span>
        </div>
      </div>

      {/* Field Diagnostic Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Card 1: Factory Calibration Baseline */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Factory Calibration</span>
          </span>
          <div className="space-y-1 font-mono text-[11px] text-slate-300">
            <p>• Baseline Voltage: <strong className="text-white">{baselineVoltage} V</strong></p>
            <p>• Baseline Current: <strong className="text-white">{product.quality?.metrics?.[1]?.value || '342 mA'}</strong></p>
            <p>• Baseline Temp: <strong className="text-white">{baselineTemp} °C</strong></p>
          </div>
        </div>

        {/* Card 2: Defect & Rework Risk Profile */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Rework & Stress Risk</span>
          </span>
          {hasRework ? (
            <div className="space-y-1 text-slate-300 text-[11px]">
              <p className="text-amber-300 font-semibold font-mono">⚠️ Remediated Solder Joint</p>
              <p className="text-[10px] text-slate-400 truncate">{product.reworkHistory[0]?.defect}</p>
              <p className="text-[10px] text-slate-400">Action: {product.reworkHistory[0]?.reworkAction?.slice(0, 50)}...</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero rework logged on plant line</span>
            </div>
          )}
        </div>

        {/* Card 3: Supplier Lot Recall Status */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supplier Lot Recall Audit</span>
          </span>
          <div className="space-y-1 text-[11px] text-slate-300 font-mono">
            <p>• Components Traced: <strong className="text-white">{product.components?.length || 0}</strong></p>
            <p className="text-emerald-400">✓ All lots verified genuine</p>
            <p className="text-emerald-400">✓ No open supplier recalls</p>
          </div>
        </div>
      </div>

      {/* Interactive Field Delta Telemetry Tool */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-amber-400" />
          <span>On-Site Multimeter / Sensor Comparator</span>
        </h4>
        <form onSubmit={handleRunDiagnostic} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Measured Field Voltage (V):</label>
            <input
              type="number"
              step="0.01"
              value={fieldVoltage}
              onChange={(e) => setFieldVoltage(e.target.value)}
              placeholder={`e.g. ${baselineVoltage}`}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Measured Field Temp (°C):</label>
            <input
              type="number"
              step="0.1"
              value={fieldTemp}
              onChange={(e) => setFieldTemp(e.target.value)}
              placeholder={`e.g. ${baselineTemp}`}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-1.5 px-4 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition font-sans shadow-md"
            >
              Analyze Field Divergence
            </button>
          </div>
        </form>

        {diagnosticResult && (
          <div className={`mt-3 p-3 rounded-lg border text-xs space-y-1.5 animate-in fade-in ${diagnosticResult.status === 'NOMINAL' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/40 border-amber-500/40 text-amber-200'}`}>
            <div className="flex items-center gap-2 font-bold">
              {diagnosticResult.status === 'NOMINAL' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
              <span>Diagnostic Assessment: {diagnosticResult.status}</span>
            </div>
            {diagnosticResult.issues.length > 0 && (
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300 pl-1">
                {diagnosticResult.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            )}
            <p className="text-[11px] font-medium pt-1 text-slate-300">{diagnosticResult.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

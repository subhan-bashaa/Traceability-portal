import React from 'react';
import {
  Factory,
  Wrench,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function JourneyStepper({ stages = [] }) {
  const getIcon = (id) => {
    switch (id) {
      case 'manufactured':
        return Factory;
      case 'assembly':
        return Wrench;
      case 'testing':
        return Activity;
      case 'quality':
        return ClipboardCheck;
      case 'rework':
        return RotateCcw;
      case 'final_inspection':
        return CheckCircle2;
      case 'dispatched':
        return Truck;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle mb-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[700px] relative px-2">
        {stages.map((stage, idx) => {
          const Icon = getIcon(stage.id);
          const isCompleted = stage.status === 'completed';
          const isWarning = stage.status === 'warning';
          const isFailed = stage.status === 'failed';
          const isInProgress = stage.status === 'in-progress';
          const isPending = stage.status === 'pending';

          // Node styling
          let circleBg = 'bg-slate-100 text-slate-400 border-slate-300';
          let textColor = 'text-slate-500';
          let badgeText = 'Pending';
          let badgeClass = 'bg-slate-100 text-slate-500';

          if (isCompleted) {
            circleBg = 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/20';
            textColor = 'text-slate-900 font-semibold';
            badgeText = 'Passed';
            badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          } else if (isWarning) {
            circleBg = 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/20';
            textColor = 'text-amber-900 font-semibold';
            badgeText = 'Flagged';
            badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
          } else if (isFailed) {
            circleBg = 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/20';
            textColor = 'text-rose-900 font-semibold';
            badgeText = 'Failed';
            badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (isInProgress) {
            circleBg = 'bg-brand-600 text-white border-brand-700 animate-pulse shadow-sm shadow-brand-500/20';
            textColor = 'text-brand-900 font-bold';
            badgeText = 'Active Now';
            badgeClass = 'bg-blue-50 text-brand-700 border-blue-200';
          }

          // Connector line
          const isLast = idx === stages.length - 1;
          const nextStage = stages[idx + 1];
          const isLineActive = isCompleted && nextStage && (nextStage.status === 'completed' || nextStage.status === 'in-progress' || nextStage.status === 'warning');

          return (
            <div key={stage.id} className="flex-1 flex items-center relative">
              <div className="flex flex-col items-center text-center relative z-10 mx-auto">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${circleBg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="mt-2.5">
                  <p className={`text-xs tracking-tight ${textColor}`}>{stage.label}</p>
                  <span className={`inline-block mt-0.5 text-[10px] px-1.5 py-0.2 font-mono font-medium rounded border ${badgeClass}`}>
                    {stage.timestamp || badgeText}
                  </span>
                </div>
              </div>

              {/* Connecting line to next stage */}
              {!isLast && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 z-0 transition-colors ${
                    isLineActive ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

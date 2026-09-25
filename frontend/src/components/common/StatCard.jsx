import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, badge }) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      text: 'text-brand-600 dark:text-brand-400',
      border: 'border-blue-100 dark:border-blue-900/60',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/60',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/60',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/60',
    },
  }[color] || {
    bg: 'bg-slate-50 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-100 dark:border-slate-700',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorStyles.bg} ${colorStyles.text} border ${colorStyles.border}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span className={`font-medium ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {trend.text}
            </span>
          )}
          {badge && (
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px] border border-slate-200/80 dark:border-slate-700">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

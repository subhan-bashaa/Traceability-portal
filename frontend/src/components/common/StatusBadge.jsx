import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export default function StatusBadge({ status, size = 'md', showIcon = true }) {
  const norm = (status || '').toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Clock;

  if (norm.includes('pass') || norm.includes('completed') || norm.includes('dispatched') || norm.includes('resolved') || norm.includes('delivered')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = CheckCircle2;
  } else if (norm.includes('transit') || norm.includes('shipping') || norm.includes('shipment')) {
    colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
    Icon = Truck;
  } else if (norm.includes('warn') || norm.includes('medium') || norm.includes('rework') || norm.includes('remediat')) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = AlertTriangle;
  } else if (norm.includes('fail') || norm.includes('high') || norm.includes('critical') || norm.includes('defect') || norm.includes('error')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = XCircle;
  } else if (norm.includes('progress') || norm.includes('production') || norm.includes('testing')) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
    Icon = RefreshCw;
  } else if (norm.includes('approv') || norm.includes('certif')) {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    Icon = ShieldCheck;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  }[size] || 'text-xs px-2.5 py-1 font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colorClasses} tracking-wide transition-colors`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{status}</span>
    </span>
  );
}

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, History, Info, Layers, ShieldCheck, ChevronRight, X, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useTraceability } from '../../context/TraceabilityContext';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { recentSearches } = useTraceability();
  const { user, isAuthenticated, openLoginModal, openSignupModal, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Traceability Search', to: '/search', icon: Search },
    { name: 'Recent Searches', to: '/recent', icon: History, count: recentSearches.length },
    { name: 'About Architecture', to: '/about', icon: Info },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800 bg-slate-950/40">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:bg-brand-500 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">TraceCore</span>
                <span className="text-sm font-light text-brand-400">Traceability</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Buyer Portal v2.6</p>
            </div>
          </NavLink>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30 font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}

        </div>

        {/* Sidebar Auth / Session Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/50 flex items-center justify-center text-brand-300 text-xs font-bold flex-shrink-0">
                  {user.name?.slice(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
                  <p className="text-[10px] text-brand-400 capitalize">{user.role?.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onClose();
                  navigate('/');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  openLoginModal();
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  openSignupModal();
                  onClose();
                }}
                className="w-full py-1.5 px-3 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800/80 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                <span>Create Account</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800/80">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-300 truncate">ISO 9001:2015 Audit</p>
              <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ledger Verifiable
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

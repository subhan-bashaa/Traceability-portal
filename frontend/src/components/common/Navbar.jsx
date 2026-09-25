import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, QrCode, Layers, ShieldCheck, User, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useTraceability } from '../../context/TraceabilityContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onMenuToggle }) {
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsScannerOpen } = useTraceability();
  const { user, isAuthenticated, openLoginModal, openSignupModal, logout } = useAuth();

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (navSearch.trim()) {
      navigate(`/product/${navSearch.trim().toUpperCase()}`);
      setNavSearch('');
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Manufacturing Dashboard';
    if (path === '/search') return 'Traceability Search Console';
    if (path.startsWith('/product/')) return 'Product Traceability Dossier';
    if (path === '/recent') return 'Audit & Search History';
    if (path === '/about') return 'Traceability Architecture & Standards';
    return 'Traceability Portal';
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center justify-between px-4 sm:px-6 transition-colors duration-200">
      {/* Left side: Hamburger (mobile) + Page breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="lg:hidden w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center text-white">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              TraceCore Traceability • MES & Genealogy Ledger
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Quick Search + Scan QR + ThemeToggle + Status + User / Auth */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick inline search (visible on md+) */}
        <form onSubmit={handleNavSearch} className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value.toUpperCase())}
            placeholder="Quick search serial..."
            className="w-44 lg:w-56 pl-9 pr-3 py-1.5 text-xs font-mono bg-slate-100/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50 transition-all placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </form>

        {/* Scan Barcode Button */}
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              openLoginModal();
              return;
            }
            setIsScannerOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 transition"
          title="Scan barcode or QR code"
        >
          <QrCode className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="hidden sm:inline">Scan</span>
        </button>

        {/* Live MES Feed indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MES Live</span>
        </div>

        {/* Dark Mode & Bright Mode Toggle in Portal Navbar */}
        <ThemeToggle />

        {/* Auth Section */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800/80 flex items-center justify-center text-brand-700 dark:text-brand-300 text-xs font-bold shadow-xs">
              {getUserInitials(user.name)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[120px]">
                {user.name}
              </p>
              <p className="text-[10px] text-brand-600 dark:text-brand-400 font-medium capitalize">
                {user.role === 'buyer' ? 'Verified Buyer' : user.role?.replace('_', ' ')}
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition ml-1"
              title="Sign out of traceability portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={openLoginModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50/70 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-700 transition"
            >
              <LogIn className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={openSignupModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

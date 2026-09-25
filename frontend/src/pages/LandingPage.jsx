import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BarChart3,
  QrCode,
  FileCheck,
  ChevronRight,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTraceability } from '../context/TraceabilityContext';
import ThemeToggle from '../components/common/ThemeToggle';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, openLoginModal, openSignupModal, showToast } = useAuth();
  const { setIsScannerOpen } = useTraceability();

  const [serialQuery, setSerialQuery] = useState('');
  const [activeTab, setActiveTab] = useState('traceability');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (showToast) showToast('Please sign in to access manufacturing traceability.', 'info');
      openLoginModal();
      return;
    }
    if (serialQuery.trim()) {
      navigate(`/product/${serialQuery.trim().toUpperCase()}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleAccessPortal = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openLoginModal();
    }
  };

  const handleScanClick = () => {
    if (!isAuthenticated) {
      if (showToast) showToast('Please sign in to access the camera scanner.', 'info');
      openLoginModal();
      return;
    }
    setIsScannerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-100 selection:text-brand-900 dark:selection:bg-brand-900 dark:selection:text-brand-100 flex flex-col transition-colors duration-200">
      {/* 1. Official Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              {/* TraceCore Logo icon */}
              <div className="w-9 h-9 rounded-xl bg-slate-950 dark:bg-slate-800 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-brand-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">TraceCore</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full border border-brand-200/50 dark:border-brand-800/60">
                  Traceability
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action: Leftside Dark/Bright Mode Toggle + Sign In */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Leftside Dark Mode & Bright Mode Toggle */}
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Signed in as <strong className="text-slate-900 dark:text-white">{user?.name}</strong>
                </span>
                <Link
                  to="/dashboard"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-950 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 rounded-full shadow-sm transition"
                >
                  Open Dashboard ➔
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700/80 hover:bg-slate-800 active:scale-95 rounded-full shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Sign in</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section: TraceCore Digital Thread Platform */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Description & CTAs */}
            <div className="lg:col-span-7 space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Enterprise Manufacturing Digital Thread</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.08]">
                End-to-End Buyer Traceability
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Verify raw component lots, audit factory floor SMT telemetry, track defect resolutions, and ensure certified outgoing quality clearance.
              </p>

              {/* Primary Action Button */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleAccessPortal}
                  className="px-6 py-3.5 rounded-full bg-slate-950 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 group"
                >
                  <span>{isAuthenticated ? 'Go to Factory Dashboard' : 'Explore Platform'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleScanClick}
                  className="px-5 py-3.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-sm shadow-xs transition flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Scan Serial QR</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual Workstation & Interactive Prompt Box */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Ambient Soft Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-100/60 dark:from-brand-900/30 to-purple-100/60 dark:to-purple-900/30 rounded-3xl blur-2xl -z-10" />

                {/* Primary Card: Interactive Manufacturing Prompt Box */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative overflow-hidden transition-colors duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">Live Provenance Ledger</h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">NeonDB • Multi-Station SMT</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Node
                    </span>
                  </div>

                  {/* Mock Traceability Prompt Form */}
                  <form onSubmit={handleHeroSearch} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Search Physical Serial Number</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">e.g. SN-2026-001245</span>
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={serialQuery}
                          onChange={(e) => setSerialQuery(e.target.value.toUpperCase())}
                          placeholder="Enter product serial number..."
                          className="w-full pl-9 pr-3 py-3 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Gradient Generate Button matching the screenshot */}
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Trace Dossier</span>
                    </button>
                  </form>

                  {/* Telemetry Micro Badges */}
                  <div className="pt-2 grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-[11px] font-medium">IPC-A-610 Class 3</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-[11px] font-medium">Gemini 3.6 Synthesis</span>
                    </div>
                  </div>
                </div>

                {/* Floating Certificate Pill */}
                <div className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-800 py-2.5 px-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hidden sm:flex items-center gap-3 animate-slideIn">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100 leading-tight">COC Verification</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400">ISO 9001:2015 Approved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Client & Partner Proof Logos Banner */}
      <section className="py-12 bg-white dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-8">
            Trusted by global manufacturing and enterprise brands
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="text-base sm:text-lg font-serif tracking-widest text-slate-700 dark:text-slate-300">west elm</span>
            <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 uppercase">LOW COST GLASSES</span>
            <span className="text-sm sm:text-base font-serif font-bold text-slate-800 dark:text-slate-200">KALYAN SILKS</span>
            <div className="flex items-center gap-1 font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
              <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">🛍</span>
              <span>JioMart</span>
            </div>
            <span className="text-xs sm:text-sm font-mono tracking-widest uppercase font-semibold text-slate-700 dark:text-slate-300">FOXCONN</span>
            <span className="text-sm font-sans font-bold text-slate-800 dark:text-slate-200">STMicroelectronics</span>
          </div>
        </div>
      </section>

      {/* 4. Core Solutions Pill Showcase */}
      <section id="solutions" className="py-20 bg-slate-50/60 dark:bg-slate-900/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs">
              <span>Traceability Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              One platform for your entire manufacturing genealogy
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Transform siloed factory logs, test bench readings, and shipping manifests into a single verifiable digital ledger.
            </p>
          </div>

          {/* Solutions Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">BOM Component Genealogy</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Trace exact silicon wafer lots, passive sub-assemblies, and RF modules back to individual suppliers with full lot-code recall precision.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">SMT & Wave Route Telemetry</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Audit every pick-and-place operation, nitrogen wave thermal profile, and automated optical inspection result with certified operator IDs.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gemini AI Executive Summary</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically generate human-readable quality briefs for buyers and engineers without manual reporting overhead.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to inspect your manufacturing digital thread?
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Sign in to your authorized account or enter your serial number to access live plant records.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
              <button
                type="button"
                onClick={openLoginModal}
                className="px-6 py-3 rounded-full bg-white text-slate-950 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition shadow-sm"
              >
                Sign in to Traceability Portal
              </button>
              <button
                type="button"
                onClick={openSignupModal}
                className="px-5 py-3 rounded-full bg-slate-900 text-white border border-slate-800 hover:bg-slate-850 font-medium text-xs sm:text-sm transition"
              >
                Create Buyer Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 mt-auto py-12 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">TraceCore Systems</span>
            <span>•</span>
            <span>ISO 9001:2015 & IPC Class 3 Certified</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <Link to="/about" className="hover:text-slate-600 dark:hover:text-slate-300 transition">Architecture</Link>
            <span>•</span>
            <button type="button" onClick={openLoginModal} className="hover:text-slate-600 dark:hover:text-slate-300 transition">
              Portal Sign In
            </button>
            <span>•</span>
            <span>© {new Date().getFullYear()} TraceCore Manufacturing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

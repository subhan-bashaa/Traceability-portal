import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TraceabilityProvider } from './context/TraceabilityContext';
import { AuthProvider } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import BarcodeScannerModal from './components/common/BarcodeScannerModal';
import AuthModal from './components/auth/AuthModal';
import AuthToast from './components/common/AuthToast';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TraceabilitySearch from './pages/TraceabilitySearch';
import ProductDetails from './pages/ProductDetails';
import RecentSearches from './pages/RecentSearches';
import About from './pages/About';
import NotFound from './pages/NotFound';

/**
 * Enterprise MES Portal Layout (with Sidebar, Navbar, and Footer)
 */
function PortalLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Navbar */}
        <Navbar onMenuToggle={() => setIsSidebarOpen(true)} />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Enterprise Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-4 text-xs text-slate-500 dark:text-slate-400 no-print transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">TraceCore Traceability Portal</span>
              <span>•</span>
              <span>MES v2.6.4</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">ISO 9001:2015 Compliant</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-400">
              <Link to="/" className="hover:text-slate-600 dark:hover:text-slate-200 transition">TraceCore Home</Link>
              <span>•</span>
              <Link to="/about" className="hover:text-slate-600 dark:hover:text-slate-200 transition">About Architecture</Link>
              <span>•</span>
              <Link to="/search" className="hover:text-slate-600 dark:hover:text-slate-200 transition">Search Console</Link>
              <span>•</span>
              <span>© {new Date().getFullYear()} TraceCore Manufacturing Systems</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TraceabilityProvider>
          <BrowserRouter>
          <Routes>
            {/* 1. Public TraceCore Website Landing Page (First Impression) */}
            <Route path="/" element={<LandingPage />} />

            {/* 2. Internal Manufacturing Portal (Authenticated / Accessible) */}
            <Route
              path="/dashboard"
              element={
                <PortalLayout>
                  <Dashboard />
                </PortalLayout>
              }
            />
            <Route
              path="/search"
              element={
                <PortalLayout>
                  <TraceabilitySearch />
                </PortalLayout>
              }
            />
            <Route
              path="/product/:serialNumber"
              element={
                <PortalLayout>
                  <ProductDetails />
                </PortalLayout>
              }
            />
            <Route
              path="/recent"
              element={
                <PortalLayout>
                  <RecentSearches />
                </PortalLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PortalLayout>
                  <About />
                </PortalLayout>
              }
            />
            <Route
              path="*"
              element={
                <PortalLayout>
                  <NotFound />
                </PortalLayout>
              }
            />
          </Routes>

          {/* Global Interactive Modals and Feedback Toasts */}
          <BarcodeScannerModal />
          <AuthModal />
          <AuthToast />
        </BrowserRouter>
      </TraceabilityProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}

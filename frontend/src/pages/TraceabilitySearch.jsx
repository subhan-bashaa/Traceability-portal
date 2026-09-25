import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, QrCode, Sparkles, Filter, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { getTraceabilityBySerialNumber } from '../services/api';
import { useTraceability } from '../context/TraceabilityContext';

export default function TraceabilitySearch() {
  const navigate = useNavigate();
  const { setIsScannerOpen } = useTraceability();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [lastSearchedSerial, setLastSearchedSerial] = useState('');

  const executeSearch = async (serial) => {
    if (!serial) return;
    setSearchTerm(serial);
    setLastSearchedSerial(serial);
    setIsLoading(true);
    setSearchError(null);

    try {
      const result = await getTraceabilityBySerialNumber(serial);
      if (result && result.data) {
        // Successful match - navigate directly to product dossier
        navigate(`/product/${result.data.serialNumber}`);
      }
    } catch (err) {
      console.warn('Trace search error:', err);
      const message =
        err.response?.data?.message ||
        `Serial number "${serial}" was not found in the MES manufacturing ledger.`;
      setSearchError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSerial = (serial) => {
    executeSearch(serial);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5 text-brand-600" />
              <span>Traceability Search Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Product Dossier Lookup
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter a complete serial number or scan the QR code printed on the PCB or packaging label.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <QrCode className="w-4 h-4 text-brand-400" />
            <span>Launch Scanner</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="mt-6">
          <SearchBar
            size="large"
            placeholder="Search by Serial Number (e.g. SN-2026-001245)..."
            onSearch={executeSearch}
            showSamples={true}
          />
        </div>
      </div>

      {/* Dynamic State Feedback: Loading, Error, or Empty Guide */}
      {isLoading ? (
        <LoadingSpinner
          message={`Querying MES Ledger for serial "${lastSearchedSerial}"...`}
          subtext="Validating SMT station logs, AOI test images, and supplier lot genealogy"
        />
      ) : searchError ? (
        <ErrorState
          serialNumber={lastSearchedSerial}
          errorMessage={searchError}
          onRetry={() => executeSearch(lastSearchedSerial)}
          onSelectSerial={handleSelectSerial}
        />
      ) : (
        <EmptyState onSelectSerial={handleSelectSerial} />
      )}
    </div>
  );
}

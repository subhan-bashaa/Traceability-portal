import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, QrCode, Share2, Printer, CheckCircle2, AlertTriangle, Layers, LogIn, ShieldAlert, Wrench } from 'lucide-react';
import { getTraceabilityBySerialNumber } from '../services/api';
import { useTraceability } from '../context/TraceabilityContext';
import { useAuth } from '../context/AuthContext';

// Detail Components
import JourneyStepper from '../components/details/JourneyStepper';
import ProductOverview from '../components/details/ProductOverview';
import AISummaryCard from '../components/details/AISummaryCard';
import ComponentTable from '../components/details/ComponentTable';
import ProductionTimeline from '../components/details/ProductionTimeline';
import QualityCard from '../components/details/QualityCard';
import DefectCard from '../components/details/DefectCard';
import ReworkCard from '../components/details/ReworkCard';
import InspectionCard from '../components/details/InspectionCard';
import ShipmentCard from '../components/details/ShipmentCard';
import FieldDiagnosticsCard from '../components/details/FieldDiagnosticsCard';

// Common feedback components
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';

export default function ProductDetails() {
  const { serialNumber } = useParams();
  const navigate = useNavigate();
  const { addRecentSearch, setIsScannerOpen } = useTraceability();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(user?.role === 'field_engineer');

  useEffect(() => {
    if (user?.role === 'field_engineer') {
      setShowDiagnostics(true);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getTraceabilityBySerialNumber(serialNumber);
        if (isMounted) {
          setProduct(response.data);
          addRecentSearch(response.data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch traceability dossier:', err);
          setError(
            err.response?.data?.message ||
              `Serial number "${serialNumber}" is not recorded in the production database.`
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (serialNumber) {
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [serialNumber]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <LoadingSpinner
          message={`Retrieving complete traceability dossier for ${serialNumber}...`}
          subtext="Fetching BOM lot numbers, SMT optical inspections, and outbound dispatch records"
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <ErrorState
          serialNumber={serialNumber}
          errorMessage={error}
          onRetry={() => window.location.reload()}
          onSelectSerial={(serial) => navigate(`/product/${serial}`)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Action Bar (Back, Quick Serial Chips, Actions) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Back to Search</span>
          </Link>

        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setShowDiagnostics((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs ${
              showDiagnostics
                ? 'bg-amber-500 text-slate-950 font-bold border border-amber-600'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
            <span>{showDiagnostics ? 'Diagnostics Console Active' : 'Field Diagnostics Mode'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Scan Another</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* 1. Top Traceability Journey Stepper */}
      <JourneyStepper stages={product.stepperStages} />

      {/* 2. Product Overview Card */}
      <ProductOverview product={product} />

      {/* Field Engineer Diagnostics Card (Active when toggled or signed in as Field Engineer) */}
      {showDiagnostics && (
        <FieldDiagnosticsCard product={product} />
      )}

      {/* 3. AI Manufacturing Summary Card */}
      <AISummaryCard serialNumber={product.serialNumber} />

      {/* 4. Component Genealogy & BOM Table */}
      <ComponentTable components={product.components} />

      {/* 5. Production Journey (Vertical Timeline) */}
      <ProductionTimeline journey={product.productionJourney} />

      {/* 6. Quality & Measurements Card */}
      <QualityCard quality={product.quality} />

      {/* 7. Defects Card */}
      <DefectCard defects={product.defects} />

      {/* 8. Rework History Card */}
      <ReworkCard reworkHistory={product.reworkHistory} />

      {/* 9. Final Inspection & Certification Card */}
      <InspectionCard finalInspection={product.finalInspection} />

      {/* 10. Shipment & Dispatch Card */}
      <ShipmentCard shipment={product.shipment} />
    </div>
  );
}

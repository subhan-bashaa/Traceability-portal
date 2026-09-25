import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleSearches } from '../data/mockTraceabilityData';

const TraceabilityContext = createContext(null);

const STORAGE_KEY = 'fynd_traceability_recent_searches';

export function TraceabilityProvider({ children }) {
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return sampleSearches;
  });

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch {
      // ignore
    }
  }, [recentSearches]);

  const addRecentSearch = (productData) => {
    if (!productData || !productData.serialNumber) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.serialNumber !== productData.serialNumber);
      const newEntry = {
        serialNumber: productData.serialNumber,
        productName: productData.productName,
        status: productData.currentStatus,
        defectCount: productData.defects ? productData.defects.length : 0,
        hasRework: productData.reworkHistory && productData.reworkHistory.length > 0,
        batch: productData.batchNumber,
        lastUpdated: 'Just now',
        timestamp: new Date().toISOString(),
      };
      return [newEntry, ...filtered].slice(0, 10);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <TraceabilityContext.Provider
      value={{
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        isScannerOpen,
        setIsScannerOpen,
      }}
    >
      {children}
    </TraceabilityContext.Provider>
  );
}

export function useTraceability() {
  const context = useContext(TraceabilityContext);
  if (!context) {
    throw new Error('useTraceability must be used within a TraceabilityProvider');
  }
  return context;
}

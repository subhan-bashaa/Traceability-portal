import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, QrCode, Camera, Check, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { useTraceability } from '../../context/TraceabilityContext';
import { useAuth } from '../../context/AuthContext';

export default function BarcodeScannerModal() {
  const { isScannerOpen, setIsScannerOpen } = useTraceability();
  const { isAuthenticated, openLoginModal, showToast } = useAuth();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scannedSerial, setScannedSerial] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);

  // Sample serials from seed database for 1-click test
  const sampleSerials = [
    { code: 'SN-2026-001245', name: 'IoT Edge Gateway v4' },
    { code: 'SN-2026-003891', name: 'Industrial Controller X9' },
    { code: 'SN-2026-007812', name: 'Smart Energy Meter G3' },
  ];

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Start live webcam stream
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setScannedSerial(null);
    setIsDetecting(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser or connection.');
      return;
    }

    try {
      // Prefer back camera on mobile or default webcam on laptop
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
      }

      // BarcodeDetector API for live QR & barcode reading
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new window.BarcodeDetector({
            formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'ean_8', 'data_matrix'],
          });

          scanIntervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const detected = barcodes[0].rawValue?.trim().toUpperCase();
                  if (detected) {
                    handleSelectCode(detected);
                  }
                }
              } catch (detectErr) {
                // frame detection error, continue next tick
              }
            }
          }, 300);
        } catch (detectorInitErr) {
          console.warn('BarcodeDetector format error, manual/fallback active', detectorInitErr);
        }
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. You can type or select a sample serial below.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application.');
      } else {
        setCameraError(`Camera could not be opened: ${err.message || 'Unknown error'}`);
      }
      setCameraActive(false);
    }
  };

  // Guard against unauthenticated camera access
  useEffect(() => {
    if (isScannerOpen && !isAuthenticated) {
      setIsScannerOpen(false);
      if (showToast) showToast('Please sign in to access the camera scanner.', 'info');
      openLoginModal();
    }
  }, [isScannerOpen, isAuthenticated, openLoginModal, setIsScannerOpen, showToast]);

  // Manage camera lifecycle when modal opens/closes
  useEffect(() => {
    if (isScannerOpen && isAuthenticated) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isScannerOpen, isAuthenticated]);

  if (!isScannerOpen || !isAuthenticated) return null;

  const handleSelectCode = (serial) => {
    const cleanSerial = serial.trim().toUpperCase();
    setScannedSerial(cleanSerial);
    setIsDetecting(false);
    stopCamera();

    // Visual scan confirmation before navigating to dossier
    setTimeout(() => {
      setIsScannerOpen(false);
      navigate(`/product/${cleanSerial}`);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsScannerOpen(false);
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/60">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Camera QR / Barcode Scanner</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Point your camera at a serial barcode or QR code</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsScannerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="p-6">
          <div className="relative w-full h-64 bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800">
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                cameraActive ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Overlaid Viewfinder Grid & Corner Brackets */}
            {cameraActive && (
              <div className="absolute inset-8 border-2 border-dashed border-brand-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-brand-400" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-brand-400" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-brand-400" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-brand-400" />

                {/* Animated scanning red laser line */}
                {isDetecting && !scannedSerial && (
                  <div className="absolute inset-x-0 h-0.5 bg-rose-500 shadow-[0_0_14px_#f43f5e] animate-pulse transition-all duration-500" />
                )}
              </div>
            )}

            {/* Success Decoded Banner */}
            {scannedSerial && (
              <div className="z-20 flex flex-col items-center bg-slate-900/95 px-6 py-4 rounded-xl border border-emerald-500/80 text-emerald-400 shadow-2xl animate-in zoom-in-95">
                <Check className="w-9 h-9 mb-1 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Decoded Serial Number</span>
                <span className="font-mono text-lg font-bold text-white mt-1">{scannedSerial}</span>
                <span className="text-[11px] text-emerald-400 mt-1">Loading Manufacturing Dossier...</span>
              </div>
            )}

            {/* Camera Error or Permission Request Banner */}
            {!cameraActive && !scannedSerial && (
              <div className="z-10 text-center px-6 max-w-sm">
                {cameraError ? (
                  <div className="space-y-3">
                    <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                    <p className="text-xs text-amber-200 font-medium leading-relaxed">{cameraError}</p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Camera</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400 animate-spin">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-slate-300">Initializing live webcam stream...</p>
                    <p className="text-[11px] text-slate-500">Please click "Allow" when the browser asks for camera access</p>
                  </div>
                )}
              </div>
            )}

            {/* HUD Status Bar */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-400 font-mono pointer-events-none z-10">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{cameraActive ? 'LIVE WEBCAM CONNECTED' : 'CAMERA STANDBY'}</span>
              </span>
              <span>1080P • OPTICAL FEED</span>
            </div>
          </div>

          {/* Quick Click Sample Serial Badges */}
          <div className="mt-4">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Or Click Sample Barcode Serial To Test:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {sampleSerials.map((sample) => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => handleSelectCode(sample.code)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 text-left transition group"
                >
                  <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {sample.code}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{sample.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Keyboard Serial Input */}
          <div className="mt-4">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Optical Barcode Scanner / Manual Input:
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.manualSerial.value.trim().toUpperCase();
                if (input) handleSelectCode(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                name="manualSerial"
                type="text"
                placeholder="Type or scan serial (e.g. SN-2026-001245)..."
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition shadow-xs flex-shrink-0"
              >
                Scan Code
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Webcam & USB barcode wedge scanners supported</span>
          <button
            type="button"
            onClick={() => setIsScannerOpen(false)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

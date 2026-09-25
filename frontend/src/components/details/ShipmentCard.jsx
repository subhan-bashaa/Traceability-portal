import React from 'react';
import { Truck, Package, MapPin, Calendar, ExternalLink, Box, Navigation } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function ShipmentCard({ shipment }) {
  if (!shipment) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Shipment, Packaging & Logistics Dispatch
            </h3>
            <p className="text-xs text-slate-500">
              Carton aggregation, international airway bill, and carrier tracking
            </p>
          </div>
        </div>
        <StatusBadge status={shipment.shipmentStatus} size="md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
        <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
            Shipment ID
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <Package className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {shipment.shipmentId}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
            Carton / Pallet
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <Box className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {shipment.cartonNumber} {shipment.palletNumber ? `(${shipment.palletNumber})` : ''}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
            Shipment Date
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {shipment.shipmentDate}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
            Carrier & Tracking
          </span>
          <p className="mt-1 text-xs font-bold text-brand-700 flex items-center gap-1.5 truncate">
            <Navigation className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            {shipment.carrier || 'Standard Freight'}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-sky-50/40 border border-sky-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800">Dispatch Destination:</span>{' '}
            <span className="text-slate-700">{shipment.destination}</span>
            {shipment.estimatedDelivery && (
              <p className="text-[11px] text-slate-500 mt-0.5">
                Estimated Delivery Window: <span className="font-semibold text-slate-700">{shipment.estimatedDelivery}</span>
              </p>
            )}
          </div>
        </div>

        {shipment.trackingNumber && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="font-mono text-[11px] px-2.5 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-700">
              {shipment.trackingNumber}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

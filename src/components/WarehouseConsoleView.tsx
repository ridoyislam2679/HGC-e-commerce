import React, { useState } from 'react';
import { Warehouse, Scale, AlertTriangle, CheckCircle2, Package, ArrowRight, ShieldCheck, Clock, Layers } from 'lucide-react';

export const WarehouseConsoleView: React.FC = () => {
  // Digital Scale Intake Form
  const [selectedProduct, setSelectedProduct] = useState<string>('Bogura Red Potato');
  const [farmerSupplier, setFarmerSupplier] = useState<string>('Md. Anisur Rahman (Shibganj)');
  const [sourceWeight, setSourceWeight] = useState<number>(100); // kg
  const [scaleMeasuredWeight, setScaleMeasuredWeight] = useState<number>(99.2); // kg
  const [sortingDiscardLoss, setSortingDiscardLoss] = useState<number>(3.6); // kg
  const [rawPurchaseRate, setRawPurchaseRate] = useState<number>(22); // ৳
  const [transportCoolie, setTransportCoolie] = useState<number>(200); // ৳
  const [generatedBatch, setGeneratedBatch] = useState<string | null>(null);

  // Calculations
  const rawCost = sourceWeight * rawPurchaseRate;
  const totalLandedCost = rawCost + transportCoolie;
  const sellableLotWeight = Math.max(0.1, scaleMeasuredWeight - sortingDiscardLoss);
  const effectiveCostPerKg = totalLandedCost / sellableLotWeight;
  const discardPercent = ((sourceWeight - sellableLotWeight) / sourceWeight) * 100;

  const handleGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const batchCode = `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedBatch(batchCode);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (Matching WareVix screenshot) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">
              Welcome to WareVix Depot Intake
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              Zone B · Morning Shift
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Warehouse operations, digital scale weight verification, sorting loss adjustment, and batch lot allocation
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700">
            Scanner Online · v2.4
          </span>
        </div>
      </div>

      {/* 4 Metric Tiles (Matching WareVix screenshot: Inbound GRNs 48, Store Items 32, Order Received 18, Dispatch Ready 09) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 block">Inbound GRNs Today</span>
            <span className="text-2xl font-bold font-mono text-purple-900 mt-1 block">48</span>
            <span className="text-[10px] text-emerald-600 font-semibold">↑ 8% from yesterday</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 block">Stored Bin Items</span>
            <span className="text-2xl font-bold font-mono text-amber-900 mt-1 block">32</span>
            <span className="text-[10px] text-emerald-600 font-semibold">↑ 6% capacity</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 block">Orders Received</span>
            <span className="text-2xl font-bold font-mono text-blue-900 mt-1 block">18</span>
            <span className="text-[10px] text-gray-400">Picking in queue</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 block">Dispatch Ready</span>
            <span className="text-2xl font-bold font-mono text-emerald-900 mt-1 block">09</span>
            <span className="text-[10px] text-emerald-600 font-semibold">100% verified</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Work Area: Digital Scale Produce Intake & Sorting Loss Adjuster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scale Intake Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                Live Digital Scale produce Intake & Sorting Loss Adjuster
              </h3>
              <p className="text-xs text-gray-500">
                Record farm intake, inspect quality, subtract inedible discard, and auto-calculate batch landed cost
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              Scale ID: DIGI-001
            </span>
          </div>

          <form onSubmit={handleGenerateBatch} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Incoming Agricultural Produce *</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
                >
                  <option value="Bogura Red Potato">Bogura Red Potato (বগুড়ার লাল আলু)</option>
                  <option value="Ripe Tomatoes">Ripe Tomatoes (গাছপাকা টমেটো)</option>
                  <option value="Fresh Broccoli">Fresh Green Broccoli (ব্রকলি)</option>
                  <option value="Organic Green Chilies">Organic Green Chilies (কাঁচা মরিচ)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Farmer / Supplier *</label>
                <input
                  type="text"
                  value={farmerSupplier}
                  onChange={(e) => setFarmerSupplier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Source Weighed (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sourceWeight}
                  onChange={(e) => setSourceWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Digital Scale Intake (KG) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={scaleMeasuredWeight}
                  onChange={(e) => setScaleMeasuredWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/40 font-mono font-bold text-emerald-950"
                />
              </div>

              <div>
                <label className="block font-semibold text-rose-700 mb-1">Sorting Discard Loss (KG) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={sortingDiscardLoss}
                  onChange={(e) => setSortingDiscardLoss(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-rose-50/40 font-mono font-bold text-rose-950"
                />
                <span className="text-[10px] text-gray-400">Mud, rotten, spoiled pieces</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Purchase Rate (৳ / KG)</label>
                <input
                  type="number"
                  value={rawPurchaseRate}
                  onChange={(e) => setRawPurchaseRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Inbound Freight + Coolie (৳)</label>
                <input
                  type="number"
                  value={transportCoolie}
                  onChange={(e) => setTransportCoolie(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              Confirm Intake & Generate Batch Lot Barcode
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {generatedBatch && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs font-mono space-y-1">
              <span className="text-emerald-800 font-bold block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Batch Lot Created: {generatedBatch}
              </span>
              <p className="text-emerald-950">
                Net Sellable Stock: <strong>{sellableLotWeight.toFixed(2)} KG</strong> · Recalculated Cost Basis: <strong>৳{effectiveCostPerKg.toFixed(2)} / KG</strong>
              </p>
            </div>
          )}
        </div>

        {/* Right: Calculations & Warehouse Utilization Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-sm space-y-4 text-xs">
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Landed Cost Allocation Summary
            </h4>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Total Purchase Cost:</span>
                <span>৳{rawCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Inbound Freight & Labor:</span>
                <span>৳{transportCoolie.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Total Capital Outlay:</span>
                <span className="font-bold text-white">৳{totalLandedCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800 text-rose-300">
                <span>Discard Loss Weight:</span>
                <span>{sortingDiscardLoss.toFixed(2)} KG ({discardPercent.toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-emerald-300 text-sm">
                <span>Effective Cost / Sellable KG:</span>
                <span>৳{effectiveCostPerKg.toFixed(2)} / kg</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-normal border-t border-gray-800 pt-2">
              Note: Sorting loss is not charged as a customer sale. It is absorbed into the batch unit cost basis so retail gross margins reflect true procurement costs.
            </p>
          </div>

          {/* Warehouse Alerts (Matching WareVix alerts) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Depot Warnings & Activity
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <strong>Expiry Warning:</strong> Batch #LOT-EXP-104 (Raw Milk) expires in 2 days. Prioritized for FEFO picking.
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                <strong>Rack Capacity:</strong> Zone B, Rack 04 at 88% capacity. Recommended transfer to Zone C.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

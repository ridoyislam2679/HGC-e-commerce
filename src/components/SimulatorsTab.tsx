import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldAlert, CheckCircle2, DollarSign, Scale, Truck, TrendingUp, Info } from 'lucide-react';

export const SimulatorsTab: React.FC = () => {
  const [activeSimulator, setActiveSimulator] = useState<'sorting' | 'double_entry' | 'delivery' | 'investor'>('sorting');

  // Simulator 1: Sorting Loss State
  const [rawWeight, setRawWeight] = useState<number>(50); // kg
  const [rawPricePerKg, setRawPricePerKg] = useState<number>(20); // ৳
  const [transportCost, setTransportCost] = useState<number>(80); // ৳
  const [loadingCoolieCost, setLoadingCoolieCost] = useState<number>(30); // ৳
  const [transitLoss, setTransitLoss] = useState<number>(0.2); // kg
  const [sortingDiscard, setSortingDiscard] = useState<number>(1.8); // kg (bad leaves, rotten, mud)
  const [targetMarkupPct, setTargetMarkupPct] = useState<number>(30); // %

  // Calculations for Simulator 1
  const rawPurchaseTotal = rawWeight * rawPricePerKg;
  const totalLandedCost = rawPurchaseTotal + transportCost + loadingCoolieCost;
  const receivedWeight = Math.max(0, rawWeight - transitLoss);
  const sellableWeight = Math.max(0.1, receivedWeight - sortingDiscard);
  const totalLossKg = rawWeight - sellableWeight;
  const lossPercentage = (totalLossKg / rawWeight) * 100;
  const effectiveCostPerKg = totalLandedCost / sellableWeight;
  const recommendedRetailPrice = effectiveCostPerKg * (1 + targetMarkupPct / 100);
  const grossProfitPerKg = recommendedRetailPrice - effectiveCostPerKg;
  const grossMarginPct = (grossProfitPerKg / recommendedRetailPrice) * 100;

  // Simulator 2: Double-Entry Transaction Selector
  const [selectedTxType, setSelectedTxType] = useState<string>('cod_delivery');

  const doubleEntryScenarios: Record<
    string,
    {
      title: string;
      narration: string;
      lines: Array<{ code: string; name: string; type: string; debit: number; credit: number; memo: string }>;
      goldenRuleExplanation: string;
    }
  > = {
    cod_delivery: {
      title: 'Customer COD Order Delivered & Collected (৳1,500.00)',
      narration: 'To record delivery of Order #ORD-2026-0042 and collection of cash by delivery representative.',
      lines: [
        { code: '1015', name: 'Delivery Man Cash in Hand', type: 'Asset (Debit +)', debit: 1500.0, credit: 0, memo: 'Cash held by Delivery Man in field' },
        { code: '4010', name: 'Grocery Sales Revenue', type: 'Revenue (Credit +)', debit: 0, credit: 1460.0, memo: 'Goods sold value' },
        { code: '4020', name: 'Delivery Charge Revenue', type: 'Revenue (Credit +)', debit: 0, credit: 40.0, memo: 'Delivery shipping fee' },
        { code: '5010', name: 'Cost of Goods Sold (COGS)', type: 'Expense (Debit +)', debit: 1140.0, credit: 0, memo: 'Historical batch cost recognized' },
        { code: '1050', name: 'Inventory Asset - Fresh Produce', type: 'Asset (Credit -)', debit: 0, credit: 1140.0, memo: 'Physical stock relieved from warehouse' },
      ],
      goldenRuleExplanation:
        'Revenue is recognized upon delivery, while Cash in Transit (1015) is charged to the delivery man until physical depot handover.',
    },
    farmer_purchase: {
      title: 'Farm-Gate Potato Procurement (500kg @ ৳20 + ৳1,100 Freight)',
      narration: 'Procurement of 500kg Bogura potato from Farmer Md. Anisur Rahman with 50% cash deposit.',
      lines: [
        { code: '1050', name: 'Inventory Asset - Fresh Produce', type: 'Asset (Debit +)', debit: 11100.0, credit: 0, memo: 'Total Landed Cost capitalized' },
        { code: '1010', name: 'Cash in Hand (Depot Vault)', type: 'Asset (Credit -)', debit: 0, credit: 5000.0, memo: '50% advance cash paid to farmer' },
        { code: '2010', name: 'Accounts Payable - Farmer Anisur', type: 'Liability (Credit +)', debit: 0, credit: 5000.0, memo: 'Remaining 50% payable upon grading' },
        { code: '1010', name: 'Cash in Hand (Depot Vault)', type: 'Asset (Credit -)', debit: 0, credit: 1100.0, memo: 'Cash paid to truck driver & coolie' },
      ],
      goldenRuleExplanation:
        'Inbound transportation and coolie costs are capitalized into Inventory Asset (1050) as part of Landed Cost, NOT expensed immediately.',
    },
    loan_repayment: {
      title: 'Investor Loan Principal Repayment (৳50,000.00)',
      narration: 'Partial settlement of Type A Loan #LOAN-2026-001 principal to Investor Engr. Karim.',
      lines: [
        { code: '2030', name: 'Investor Loan Principal Liability', type: 'Liability (Debit -)', debit: 50000.0, credit: 0, memo: 'Reduces balance sheet debt obligation' },
        { code: '1020', name: 'Bank Current Account (BRAC Bank)', type: 'Asset (Credit -)', debit: 0, credit: 50000.0, memo: 'Bank transfer disbursement' },
      ],
      goldenRuleExplanation:
        'CRITICAL RULE: Principal repayment directly reduces the Liability account (2030). It is NEVER booked as an operating expense, which would falsely deflate net profit.',
    },
    mudharabah_profit: {
      title: 'Mudharabah Profit Allocation & Distribution (৳15,000.00)',
      narration: 'Monthly 15% profit distribution to Type B Equity Partner from audited net earnings.',
      lines: [
        { code: '3050', name: 'Retained Earnings / Profit Allocation', type: 'Equity (Debit -)', debit: 15000.0, credit: 0, memo: 'Allocation of audited realized earnings' },
        { code: '1020', name: 'Bank Current Account (BRAC Bank)', type: 'Asset (Credit -)', debit: 0, credit: 15000.0, memo: 'Fund transfer to partner personal bank' },
      ],
      goldenRuleExplanation:
        'Profit distribution is an appropriation of equity/profit. It does not touch loan principal or inventory asset accounts.',
    },
  };

  // Simulator 3: Delivery Representative Commission
  const [baseSalary, setBaseSalary] = useState<number>(12000);
  const [completedDeliveries, setCompletedDeliveries] = useState<number>(140);
  const [deliveryBonusRate, setDeliveryBonusRate] = useState<number>(15); // ৳ per order
  const [directMarketingSales, setDirectMarketingSales] = useState<number>(45000); // ৳
  const [marketingCommissionRate, setMarketingCommissionRate] = useState<number>(2.0); // %
  const [penalties, setPenalties] = useState<number>(0);

  const deliveryBonusTotal = completedDeliveries * deliveryBonusRate;
  const marketingBonusTotal = directMarketingSales * (marketingCommissionRate / 100);
  const totalMonthlyRemuneration = baseSalary + deliveryBonusTotal + marketingBonusTotal - penalties;

  return (
    <div className="space-y-6">
      {/* Simulator Switcher */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm flex flex-wrap gap-1 text-xs">
        <button
          onClick={() => setActiveSimulator('sorting')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeSimulator === 'sorting'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          1. Produce Sorting Loss & Landed Cost
        </button>
        <button
          onClick={() => setActiveSimulator('double_entry')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeSimulator === 'double_entry'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          2. Double-Entry Balanced Journal
        </button>
        <button
          onClick={() => setActiveSimulator('delivery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeSimulator === 'delivery'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          3. Delivery Salary & COD Handover
        </button>
        <button
          onClick={() => setActiveSimulator('investor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeSimulator === 'investor'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          4. Dual Investor Models (Loan vs Mudharabah)
        </button>
      </div>

      {/* SIMULATOR 1: SORTING LOSS & EFFECTIVE LANDED COST */}
      {activeSimulator === 'sorting' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                Fresh Produce Procurement Parameters
              </h3>
              <p className="text-xs text-gray-500">
                Adjust raw purchase weight, inbound expenses, and sorting loss discards
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Purchased Weight at Farm/Market:</span>
                  <span className="font-mono text-emerald-700">{rawWeight.toFixed(2)} KG</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={rawWeight}
                  onChange={(e) => setRawWeight(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Purchase Rate per KG:</span>
                  <span className="font-mono text-emerald-700">৳{rawPricePerKg.toFixed(2)} / kg</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="1"
                  value={rawPricePerKg}
                  onChange={(e) => setRawPricePerKg(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Inbound Transport (৳)</label>
                  <input
                    type="number"
                    value={transportCost}
                    onChange={(e) => setTransportCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Loading/Coolie (৳)</label>
                  <input
                    type="number"
                    value={loadingCoolieCost}
                    onChange={(e) => setLoadingCoolieCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Transit Moisture Loss (KG)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={transitLoss}
                    onChange={(e) => setTransitLoss(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Sorting Discard Loss (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sortingDiscard}
                    onChange={(e) => setSortingDiscard(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Target Gross Retail Markup %:</span>
                  <span className="font-mono text-emerald-700">{targetMarkupPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="1"
                  value={targetMarkupPct}
                  onChange={(e) => setTargetMarkupPct(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Results & Math Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="text-sm font-bold text-gray-900">Calculated Landed Cost & Sellable Unit Basis</h4>
                <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                  Loss %: {lossPercentage.toFixed(2)}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-semibold block">Total Incurred Cost</span>
                  <span className="text-base font-bold font-mono text-gray-900">৳{totalLandedCost.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Base + Freight + Coolie</span>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-semibold block">Net Sellable Stock</span>
                  <span className="text-base font-bold font-mono text-emerald-900">{sellableWeight.toFixed(2)} KG</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">Physical retail balance</span>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-amber-800 font-semibold block">Effective Cost / KG</span>
                  <span className="text-base font-bold font-mono text-amber-950">৳{effectiveCostPerKg.toFixed(2)}</span>
                  <span className="text-[10px] text-amber-700 block mt-0.5">True economic cost basis</span>
                </div>

                <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-sm">
                  <span className="text-[10px] text-emerald-100 font-semibold block">Retail Price ({targetMarkupPct}%)</span>
                  <span className="text-base font-bold font-mono text-white">৳{recommendedRetailPrice.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-200 block mt-0.5">৳{grossProfitPerKg.toFixed(2)} profit / kg</span>
                </div>
              </div>

              {/* Step-by-Step Mathematical Explanation */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-2 font-mono">
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  Core PHP Business Rule Execution:
                </div>
                <div className="space-y-1 text-gray-700 text-[11px] leading-relaxed">
                  <div>1. Total Landed Cost = ({rawWeight}kg × ৳{rawPricePerKg}) + ৳{transportCost} + ৳{loadingCoolieCost} = <strong>৳{totalLandedCost.toFixed(2)}</strong></div>
                  <div>2. Sellable Stock = {rawWeight}kg - {transitLoss}kg transit - {sortingDiscard}kg sorting discard = <strong>{sellableWeight.toFixed(2)} KG</strong></div>
                  <div>3. Effective Unit Cost = ৳{totalLandedCost.toFixed(2)} ÷ {sellableWeight.toFixed(2)}kg = <strong className="text-emerald-700">৳{effectiveCostPerKg.toFixed(3)} / kg</strong></div>
                  <div>4. Gross Margin = (৳{recommendedRetailPrice.toFixed(2)} - ৳{effectiveCostPerKg.toFixed(2)}) ÷ ৳{recommendedRetailPrice.toFixed(2)} = <strong>{grossMarginPct.toFixed(2)}%</strong></div>
                </div>
              </div>

              {/* Strict Business Rule Alert */}
              <div className="bg-emerald-900 text-emerald-100 p-4 rounded-xl text-xs flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-white block mb-0.5">Golden Rule: Sorting Loss Is Never Recorded as a Sale</strong>
                  The {totalLossKg.toFixed(2)} KG discard is absorbed into the {sellableWeight.toFixed(2)} KG sellable lot.
                  When customer buys 1 KG, COGS is recorded as ৳{effectiveCostPerKg.toFixed(2)}, preserving accurate business gross margin without false volume accounting.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 2: DOUBLE-ENTRY BALANCED JOURNAL */}
      {activeSimulator === 'double_entry' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Double-Entry Balanced General Ledger Simulator
              </h3>
              <p className="text-xs text-gray-500">
                Every financial transaction generates matching debit and credit journal lines. Total Debit strictly equals Total Credit.
              </p>
            </div>

            {/* Scenario Selector */}
            <select
              value={selectedTxType}
              onChange={(e) => setSelectedTxType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="cod_delivery">1. Customer COD Order Delivered (৳1,500)</option>
              <option value="farmer_purchase">2. Farmer Potato Purchase (৳11,100)</option>
              <option value="loan_repayment">3. Investor Loan Principal Repaid (৳50,000)</option>
              <option value="mudharabah_profit">4. Mudharabah Profit Distributed (৳15,000)</option>
            </select>
          </div>

          {/* Active Scenario Card */}
          <div className="space-y-4">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
              <h4 className="font-bold text-sm text-emerald-950">
                {doubleEntryScenarios[selectedTxType].title}
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                {doubleEntryScenarios[selectedTxType].narration}
              </p>
            </div>

            {/* Journal Lines Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-mono text-[11px] bg-gray-50">
                    <th className="py-2 px-3">Account Code</th>
                    <th className="py-2 px-3">Account Name</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-right">Debit (Dr) ৳</th>
                    <th className="py-2 px-3 text-right">Credit (Cr) ৳</th>
                    <th className="py-2 px-3">Memo / Line Narration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {doubleEntryScenarios[selectedTxType].lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80">
                      <td className="py-2.5 px-3 font-bold text-emerald-800">{line.code}</td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-gray-900">{line.name}</td>
                      <td className="py-2.5 px-3 text-[11px] text-gray-500">{line.type}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                        {line.debit > 0 ? `৳${line.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                        {line.credit > 0 ? `৳${line.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-gray-600 text-[11px]">{line.memo}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-emerald-600 bg-emerald-50/60 font-mono font-bold text-xs text-emerald-950">
                    <td colSpan={3} className="py-2.5 px-3 text-right uppercase tracking-wider font-sans">
                      Balanced Voucher Totals:
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-900">
                      ৳
                      {doubleEntryScenarios[selectedTxType].lines
                        .reduce((acc, l) => acc + l.debit, 0)
                        .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-900">
                      ৳
                      {doubleEntryScenarios[selectedTxType].lines
                        .reduce((acc, l) => acc + l.credit, 0)
                        .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-800 font-sans text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      100% Balanced (Debit ≡ Credit)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Golden Rule Note */}
            <div className="bg-gray-900 text-white p-4 rounded-xl text-xs space-y-1">
              <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                ERP Accounting Guard Enforced:
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                {doubleEntryScenarios[selectedTxType].goldenRuleExplanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 3: DELIVERY SALARY & CASH HANDOVER */}
      {activeSimulator === 'delivery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                Delivery Compensation Model
              </h3>
              <p className="text-xs text-gray-500">
                Fixed monthly base salary + completed delivery bonus + direct field sales commission
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Fixed Monthly Salary (৳)</label>
                <input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Completed Deliveries this Month:</span>
                  <span className="font-mono text-emerald-700">{completedDeliveries} Orders</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="5"
                  value={completedDeliveries}
                  onChange={(e) => setCompletedDeliveries(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Commission per Delivery (৳)</label>
                <input
                  type="number"
                  value={deliveryBonusRate}
                  onChange={(e) => setDeliveryBonusRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Field Direct Orders Generated (৳ Total Sales)
                </label>
                <input
                  type="number"
                  value={directMarketingSales}
                  onChange={(e) => setDirectMarketingSales(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-gray-400">Orders acquired personally by delivery man</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Marketing Commission %:</span>
                  <span className="font-mono text-emerald-700">{marketingCommissionRate}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.5"
                  value={marketingCommissionRate}
                  onChange={(e) => setMarketingCommissionRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Remuneration Breakdown & 3-Tier Handover */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">
                Monthly Payroll Statement & Handover Pipeline
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-semibold block">Fixed Base Salary</span>
                  <span className="text-base font-bold font-mono text-gray-900">৳{baseSalary.toFixed(2)}</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-semibold block">Delivery Bonus</span>
                  <span className="text-base font-bold font-mono text-emerald-950">৳{deliveryBonusTotal.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-600 block">{completedDeliveries} × ৳{deliveryBonusRate}</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-semibold block">Direct Sales Comm.</span>
                  <span className="text-base font-bold font-mono text-emerald-950">৳{marketingBonusTotal.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-600 block">{marketingCommissionRate}% of sales</span>
                </div>
                <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-sm">
                  <span className="text-[10px] text-emerald-100 font-semibold block">Net Total Payout</span>
                  <span className="text-base font-bold font-mono text-white">৳{totalMonthlyRemuneration.toFixed(2)}</span>
                </div>
              </div>

              {/* 3-Stage Cash Handover Visual State Machine */}
              <div className="pt-2">
                <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Three-Tier Physical Cash Handover Pipeline
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 block">Stage 1: Field Collection</span>
                    <strong className="text-gray-900 block mt-1">Delivery Rep In Hand</strong>
                    <p className="text-[11px] text-gray-600 mt-1">
                      Status: <code className="text-amber-800 font-semibold">pending_collection</code>. Cash sits on agent profile.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-800 block">Stage 2: Depot Settlement</span>
                    <strong className="text-gray-900 block mt-1">Admin / Cashier Vault</strong>
                    <p className="text-[11px] text-gray-600 mt-1">
                      Handover code signed off. Delivery rep balance cleared to zero.
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 block">Stage 3: Corporate Deposit</span>
                    <strong className="text-gray-900 block mt-1">Bank / Merchant Account</strong>
                    <p className="text-[11px] text-gray-600 mt-1">
                      General Manager confirms aggregate cash deposit in BRAC Bank.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 4: DUAL INVESTOR MODELS */}
      {activeSimulator === 'investor' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Dual Investor Architecture Comparison: Type A (Loan) vs Type B (Mudharabah)
            </h3>
            <p className="text-xs text-gray-500">
              Strict legal, accounting, and balance-sheet separation between debt liabilities and equity partnerships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type A: Loan-Based */}
            <div className="border border-blue-200 bg-blue-50/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  Type A: Loan-Based Financing
                </span>
                <span className="text-xs font-mono text-blue-900 font-semibold">Balance Sheet Liability (2030)</span>
              </div>
              <h4 className="text-base font-bold text-gray-900">Fixed Debt & Amortized Principal Repayment</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Investor injects principal under a contract with a fixed term and repayment schedule.
                Repayments return capital to the investor without granting equity rights.
              </p>
              <div className="bg-white p-3 rounded-xl border border-blue-200 text-xs font-mono space-y-1">
                <div className="text-blue-950 font-bold">Accounting Mandates:</div>
                <div className="text-[11px] text-gray-700">• Inflow: Dr Bank (1020), Cr Loan Liability (2030)</div>
                <div className="text-[11px] text-gray-700">• Principal Return: Dr Loan Liability (2030), Cr Bank (1020)</div>
                <div className="text-[11px] text-red-700 font-semibold">• NEVER charged to Operating Expenses (COGS/Expense)</div>
              </div>
            </div>

            {/* Type B: Mudharabah Profit-Sharing */}
            <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Type B: Mudharabah Profit-Sharing
                </span>
                <span className="text-xs font-mono text-emerald-900 font-semibold">Equity / Capital (3020)</span>
              </div>
              <h4 className="text-base font-bold text-gray-900">Risk Capital with Contractual Profit Split</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Investor provides business capital in exchange for an agreed profit-sharing percentage (e.g. 15% of Net Audited Profit).
                Capital remains in the business while profits are distributed periodically.
              </p>
              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs font-mono space-y-1">
                <div className="text-emerald-950 font-bold">Accounting Mandates:</div>
                <div className="text-[11px] text-gray-700">• Inflow: Dr Bank (1020), Cr Investor Capital (3020)</div>
                <div className="text-[11px] text-gray-700">• Profit Distribution: Dr Retained Earnings, Cr Bank (1020)</div>
                <div className="text-[11px] text-amber-800 font-semibold">• Unrealized inventory stock profit is STRICTLY excluded</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

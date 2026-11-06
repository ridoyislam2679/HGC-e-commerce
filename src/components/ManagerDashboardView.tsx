import React, { useState } from 'react';
import { CustomerOrder, INITIAL_ORDERS } from '../data/storeData';
import { LayoutDashboard, TrendingUp, ShoppingCart, AlertTriangle, Users, Package, Clock, CheckCircle2, ChevronRight, Filter, Download, ArrowUpRight } from 'lucide-react';

interface ManagerDashboardViewProps {
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: CustomerOrder['deliveryStatus']) => void;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'month' | 'year'>('month');

  // KPI calculations
  const totalSalesRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0) + 242000;
  const totalCompletedOrders = orders.filter((o) => o.deliveryStatus === 'delivered').length + 840;
  const pendingOrders = orders.filter((o) => o.deliveryStatus === 'pending' || o.deliveryStatus === 'processing');

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions (Matching eMart screenshot) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">
              Store Manager ERP Console
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Live Depot: Bogura Sadar
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time multi-channel overview: Web orders, field delivery representative sales, and warehouse inventory
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50 focus:outline-none"
          >
            <option value="today">Today's Performance</option>
            <option value="month">November 2026 (Monthly)</option>
            <option value="year">FY 2026-2027</option>
          </select>
          <button className="px-3 py-2 rounded-xl bg-gray-900 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-gray-800">
            <Download className="w-3.5 h-3.5" /> Export P&L
          </button>
        </div>
      </div>

      {/* KPI Cards Strip (Matching eMart / Store screenshot metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Sales */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total Sales</span>
            <span className="inline-flex items-center text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3" /> +18%
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
            ৳{totalSalesRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-400">Cash & online receipts</p>
        </div>

        {/* Orders Today */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Orders Today</span>
            <span className="inline-flex items-center text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
            {orders.length + 38} Orders
          </div>
          <p className="text-[11px] text-gray-400">{pendingOrders.length} pending picking</p>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-700">
            <span>Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-900">
            8 Items
          </div>
          <p className="text-[11px] text-gray-400">Reorder trigger hit</p>
        </div>

        {/* In Stock Count */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>In Stock Catalog</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
            320 Items
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">96.4% available</p>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total Customers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
            1,420
          </div>
          <p className="text-[11px] text-gray-400">Across 7 Upazilas</p>
        </div>
      </div>

      {/* Sales Overview & Inventory Status Split (Matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart Box (Left 8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Sales & Earning Overview</h3>
              <p className="text-xs text-gray-500">Monthly revenue trend vs direct delivery agent sales</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Peak Month: Oct (৳84,200)
            </span>
          </div>

          {/* SVG Visual Sales Curve */}
          <div className="h-48 w-full relative flex items-end justify-between gap-2 pt-6 px-2 font-mono text-[10px] text-gray-400">
            {[
              { m: 'Jan', v: 35, s: '৳35K' },
              { m: 'Feb', v: 48, s: '৳48K' },
              { m: 'Mar', v: 62, s: '৳62K' },
              { m: 'Apr', v: 55, s: '৳55K' },
              { m: 'May', v: 70, s: '৳70K' },
              { m: 'Jun', v: 68, s: '৳68K' },
              { m: 'Jul', v: 75, s: '৳75K' },
              { m: 'Aug', v: 60, s: '৳60K' },
              { m: 'Sep', v: 80, s: '৳80K' },
              { m: 'Oct', v: 95, s: '৳95K' },
              { m: 'Nov', v: 88, s: '৳88K' },
              { m: 'Dec', v: 92, s: '৳92K' },
            ].map((item) => (
              <div key={item.m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div
                  className="w-full bg-emerald-100 group-hover:bg-emerald-600 rounded-t transition-all relative"
                  style={{ height: `${item.v}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white px-1.5 py-0.5 rounded text-[9px] pointer-events-none transition-opacity">
                    {item.s}
                  </span>
                </div>
                <span>{item.m}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                Total Sales Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Delivery Agent Commission (৳32,400)
              </span>
            </div>
            <span className="text-[11px] text-gray-400">Updated in real-time</span>
          </div>
        </div>

        {/* Inventory Status Donut Box (Right 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Inventory Health Status</h3>
            <p className="text-xs text-gray-500">Depot stock balance distribution</p>
          </div>

          {/* Visual Bar Distribution */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  In Stock (320 items)
                </span>
                <span className="font-mono font-bold text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full w-[92%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Low Stock Alert (12 items)
                </span>
                <span className="font-mono font-bold text-gray-900">5%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full w-[5%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-rose-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Out of Stock (5 items)
                </span>
                <span className="font-mono font-bold text-gray-900">3%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-2 rounded-full w-[3%]"></div>
              </div>
            </div>
          </div>

          {/* Shipment Status Quick Metrics */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-xs space-y-2">
            <span className="font-bold text-gray-900 block text-xs">Today's Fulfillment Rate</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-gray-500 block">Delivered</span>
                <span className="font-bold text-emerald-700 text-sm">74%</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-gray-500 block">Out for Delivery</span>
                <span className="font-bold text-blue-700 text-sm">18%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Live Processing Table (Matching screenshot table) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Recent Customer Orders</h3>
            <p className="text-xs text-gray-500">Live order queue with delivery status transition controls</p>
          </div>
          <span className="text-xs font-mono bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            Total {orders.length} Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-mono text-[11px]">
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Customer & Location</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4 text-right">Amount (৳)</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-center">Change State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-gray-900 block">{order.customerName}</strong>
                    <span className="text-[11px] text-gray-500 block">{order.phone} · {order.upazila}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                    {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-right text-gray-900">
                    ৳{order.grandTotal.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.deliveryStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.deliveryStatus === 'out_for_delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : order.deliveryStatus === 'processing'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.deliveryStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <span className={order.paymentStatus === 'paid' ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'COD Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={order.deliveryStatus}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                      className="px-2 py-1 rounded border border-gray-200 text-[11px] font-semibold bg-white focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="packing">Packing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

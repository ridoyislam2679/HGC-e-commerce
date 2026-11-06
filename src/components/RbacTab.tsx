import React, { useState } from 'react';
import { RBAC_MATRIX, RbacPermission } from '../data/architectureData';
import { ShieldCheck, Check, X, Filter, Search, Lock } from 'lucide-react';

export const RbacTab: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const modules = ['All', 'Catalog', 'Procurement', 'Warehouse', 'Orders', 'Payments', 'Accounting', 'Investors', 'HR'];

  const filteredPermissions = RBAC_MATRIX.filter((item) => {
    const matchesModule = selectedModule === 'All' || item.module === selectedModule;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Role-Based Access Control (RBAC) Permission Matrix
            </h3>
            <p className="text-xs text-gray-500">
              Granular permission matrix enforced at backend controller middleware layer across 8 distinct user roles
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search capability or permission slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Module Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1" />
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedModule === mod
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/90 border-b border-gray-200 text-gray-600 font-mono text-[11px]">
                <th className="py-3 px-4 font-sans font-bold">Module & Capability</th>
                <th className="py-3 px-2 text-center">Super Admin</th>
                <th className="py-3 px-2 text-center">Admin</th>
                <th className="py-3 px-2 text-center">Manager</th>
                <th className="py-3 px-2 text-center">Wh. Mgr</th>
                <th className="py-3 px-2 text-center">Delivery</th>
                <th className="py-3 px-2 text-center">Accountant</th>
                <th className="py-3 px-2 text-center">Investor</th>
                <th className="py-3 px-2 text-center">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredPermissions.map((item) => (
                <tr key={item.slug} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-[11px] font-mono text-gray-400">
                      [{item.module}] <code className="text-emerald-700">{item.slug}</code>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.superAdmin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.manager ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.warehouseManager ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.deliveryMan ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.accountant ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.investor ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.customer ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Rule Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 text-xs text-gray-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Backend Verification Rule:</strong> Permissions are strictly enforced by <code className="font-mono text-emerald-700">RoleMiddleware.php</code> before executing any controller method. Hiding UI buttons in HTML is never relied upon as a security boundary.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Layers, Database, ShieldCheck, Cpu, Download, FileText, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCopyAllSql: () => void;
  sqlCopied: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onCopyAllSql, sqlCopied }) => {
  const navItems = [
    { id: 'architecture', label: '1. Architecture & MVC', icon: Cpu },
    { id: 'database', label: '2. Database (52 Tables)', icon: Database },
    { id: 'simulators', label: '3. Business Simulators', icon: Layers },
    { id: 'rbac', label: '4. RBAC Matrix', icon: ShieldCheck },
    { id: 'api', label: '5. Android REST API', icon: Layers },
    { id: 'roadmap', label: '6. 14-Phase Roadmap', icon: CheckCircle2 },
    { id: 'docs', label: '7. Master Blueprint Doc', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-emerald-100 shadow-sm">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-emerald-100 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between font-mono">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-800 text-emerald-200 font-semibold uppercase tracking-wider text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Phase 0: Architecture Master Specification
          </span>
          <span className="hidden md:inline text-emerald-300">
            Tech Stack: Core PHP 8.2+ | PDO | MySQL 8 InnoDB | Pure OOP (Strictly Zero Laravel)
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Timezone: <strong className="text-white">Asia/Dhaka</strong></span>
          <span>Currency: <strong className="text-white">BDT (৳)</strong></span>
          <span className="hidden sm:inline bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-300">Target: Local Upazila → Multi-Branch ERP</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <span className="font-extrabold text-lg tracking-tight">AB</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">AmarBazar ERP</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  আমেরবাজার
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Grocery E-Commerce, Multi-Warehouse Inventory & Accounting System
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyAllSql}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                sqlCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              {sqlCopied ? 'SQL Copied (52 Tables)!' : 'Copy Master schema.sql'}
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className="hidden sm:flex px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              Master Blueprint
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar border-t border-gray-100 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

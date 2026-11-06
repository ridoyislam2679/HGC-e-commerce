import React, { useState, useMemo } from 'react';
import { SCHEMA_TABLES, MODULE_CATEGORIES, TableDefinition } from '../data/schemaData';
import { Search, Database, Copy, Check, Key, Filter, ChevronRight, Hash } from 'lucide-react';

interface DatabaseTabProps {
  onCopyTableSql: (tableName: string) => void;
  copiedTable: string | null;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ onCopyTableSql, copiedTable }) => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTable, setActiveTable] = useState<TableDefinition>(SCHEMA_TABLES[0]);

  const filteredTables = useMemo(() => {
    return SCHEMA_TABLES.filter((table) => {
      const matchesModule = selectedModule === 'All' || table.module === selectedModule;
      const matchesSearch =
        searchQuery === '' ||
        table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.columns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesModule && matchesSearch;
    });
  }, [selectedModule, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Controls & Statistics */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              Relational Database ERD & Schema Explorer
            </h3>
            <p className="text-xs text-gray-500">
              52 normalized tables designed for MySQL 8 & MariaDB with strict InnoDB foreign keys and transactional integrity
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search table or column (e.g. batch, sorting, loan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Module Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1" />
          {MODULE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedModule(category)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedModule === category
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Table List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 text-xs">
            <span className="font-bold text-gray-700">Tables ({filteredTables.length} of {SCHEMA_TABLES.length})</span>
            <span className="text-gray-400 font-mono">Engine: InnoDB</span>
          </div>

          <div className="space-y-1 max-h-[620px] overflow-y-auto pr-1">
            {filteredTables.map((table) => {
              const isSelected = activeTable.name === table.name;
              return (
                <button
                  key={table.name}
                  onClick={() => setActiveTable(table)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'hover:bg-emerald-50/60 text-gray-700 border border-transparent'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-mono font-bold truncate flex items-center gap-1.5">
                      <Hash className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                      {table.name}
                    </div>
                    <div className={`text-[11px] truncate ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                      {table.module} • {table.columns.length} columns
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-gray-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Table Detail & Column Specification */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {activeTable.module}
                  </span>
                  <span className="text-xs font-mono text-gray-500">Charset: utf8mb4_unicode_ci</span>
                </div>
                <h3 className="text-xl font-bold font-mono text-gray-900 mt-1">
                  TABLE `{activeTable.name}`
                </h3>
                <p className="text-xs text-gray-600 mt-1">{activeTable.description}</p>
              </div>

              <button
                onClick={() => onCopyTableSql(activeTable.name)}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all shrink-0 ${
                  copiedTable === activeTable.name
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {copiedTable === activeTable.name ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    SQL Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy CREATE TABLE SQL
                  </>
                )}
              </button>
            </div>

            {/* Column Schema Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-mono text-[11px] bg-gray-50/80">
                    <th className="py-2.5 px-3">Column Name</th>
                    <th className="py-2.5 px-3">Data Type</th>
                    <th className="py-2.5 px-2 text-center">Nullable</th>
                    <th className="py-2.5 px-2 text-center">Key / Index</th>
                    <th className="py-2.5 px-3">Purpose & Business Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans">
                  {activeTable.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-gray-900">
                        {col.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-700">
                        {col.type}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-xs">
                        {col.nullable ? (
                          <span className="text-amber-600 font-semibold">NULL</span>
                        ) : (
                          <span className="text-gray-400">NOT NULL</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {col.key === 'PK' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Key className="w-2.5 h-2.5" /> PK
                          </span>
                        )}
                        {col.key === 'FK' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            FK
                          </span>
                        )}
                        {col.key === 'UK' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                            UNIQUE
                          </span>
                        )}
                        {col.key === 'INDEX' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                            INDEX
                          </span>
                        )}
                        {!col.key && <span className="text-gray-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-gray-600 text-[11px] leading-relaxed">
                        {col.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Golden Rules Banner */}
          <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-5 text-xs space-y-2 border border-emerald-800">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Architectural Constraints Enforced by this Schema
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-emerald-200">
              <div>
                <strong className="text-white block mb-0.5">• High-Precision Decimals for Money</strong>
                All financial columns use <code className="text-emerald-300">DECIMAL(14,2)</code> to eliminate floating-point rounding errors in Taka.
              </div>
              <div>
                <strong className="text-white block mb-0.5">• Fractional Weights for Produce</strong>
                Vegetables and loose goods use <code className="text-emerald-300">DECIMAL(12,3)</code> to record down to single grams (0.001 kg).
              </div>
              <div>
                <strong className="text-white block mb-0.5">• Foreign Key Referential Integrity</strong>
                Prevents accidental deletion of customers with pending orders, suppliers with open balances, or products with stock movements.
              </div>
              <div>
                <strong className="text-white block mb-0.5">• Immutable History & Auditing</strong>
                Changes to orders, stock balances, and journal entries are recorded in dedicated audit and movement tables.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CORE_PHP_DIRECTORY_TREE, DirectoryNode } from '../data/architectureData';
import { Folder, FolderOpen, FileCode, CheckCircle2, ShieldCheck, ArrowRight, Server, Terminal, Lock } from 'lucide-react';

export const ArchitectureTab: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('app/Core/Database.php');
  const [selectedDesc, setSelectedDesc] = useState<string>(
    'Centralized PDO Singleton connection provider with automated prepared statements and MySQL transaction management (beginTransaction, commit, rollBack).'
  );

  const renderTree = (node: DirectoryNode, path = '') => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isFolder = node.type === 'folder';

    return (
      <div key={currentPath} className="ml-3 sm:ml-4 border-l border-emerald-100 pl-2 py-0.5">
        <div
          onClick={() => {
            setSelectedFile(currentPath);
            setSelectedDesc(node.description);
          }}
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-xs font-mono transition-colors ${
            selectedFile === currentPath
              ? 'bg-emerald-100 text-emerald-900 font-semibold'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {isFolder ? (
            <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          ) : (
            <FileCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </div>
        {node.children && (
          <div className="space-y-0.5">
            {node.children.map((child) => renderTree(child, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Summary */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold">
            <Server className="w-3.5 h-3.5" />
            Requirement Compliance: 100% Core PHP / Raw PHP (Zero Laravel)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Custom Modular Core PHP Architecture
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Architected specifically for grocery distribution, direct farmer procurement, and field delivery
            in Bangladesh. Combines an ultra-lightweight custom MVC router, centralized PDO prepared statements,
            balanced double-entry general ledger, and stateless Android REST API integration.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-700/60 text-xs font-mono">
          <div>
            <div className="text-emerald-300">Target Runtime</div>
            <div className="text-base font-bold text-white">PHP 8.2+ & MySQL 8</div>
          </div>
          <div>
            <div className="text-emerald-300">Local Environment</div>
            <div className="text-base font-bold text-white">XAMPP / Apache</div>
          </div>
          <div>
            <div className="text-emerald-300">Database Engine</div>
            <div className="text-base font-bold text-white">InnoDB / Transactions</div>
          </div>
          <div>
            <div className="text-emerald-300">Frontend Admin</div>
            <div className="text-base font-bold text-white">Bootstrap 5 + Vanilla JS</div>
          </div>
        </div>
      </div>

      {/* Visual Request Lifecycle Diagram */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Single Entry Point & Custom MVC Request Flow
            </h3>
            <p className="text-xs text-gray-500">
              How a customer browser or Android mobile request travels securely through the Core PHP engine
            </p>
          </div>
          <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded">
            No index.php clutter in URLs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
          {/* Step 1 */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">1. Inbound Request</span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">Apache .htaccess</h4>
              <p className="text-xs text-gray-600 mt-1">
                Rewrites all friendly URLs (`/shop`, `/api/v1/orders`) to `public/index.php`.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-mono bg-white p-1.5 rounded border border-gray-200 text-gray-500">
              mod_rewrite on
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">2. Initialization</span>
              <h4 className="font-bold text-emerald-950 text-sm mt-1">public/index.php</h4>
              <p className="text-xs text-gray-600 mt-1">
                Boots PSR-4 autoloader, loads `.env`, sets timezone to `Asia/Dhaka`, starts session.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-mono bg-white p-1.5 rounded border border-emerald-200 text-emerald-800">
              date_default_timezone_set
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">3. Dispatcher</span>
              <h4 className="font-bold text-emerald-950 text-sm mt-1">Core/Router.php</h4>
              <p className="text-xs text-gray-600 mt-1">
                Matches HTTP Verb + Regex pattern. Extracts route params (/orders/:id).
              </p>
            </div>
            <div className="mt-3 text-[11px] font-mono bg-white p-1.5 rounded border border-emerald-200 text-emerald-800">
              Router::get(), ::post()
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">4. Security Guards</span>
              <h4 className="font-bold text-emerald-950 text-sm mt-1">Middleware</h4>
              <p className="text-xs text-gray-600 mt-1">
                CSRF check on POST, session authentication, and RBAC role permission verification.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-mono bg-white p-1.5 rounded border border-emerald-200 text-emerald-800">
              AuthMiddleware & CSRF
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">5. Business Logic</span>
              <h4 className="font-bold text-emerald-950 text-sm mt-1">Controllers & Services</h4>
              <p className="text-xs text-gray-600 mt-1">
                Executes business logic (Sorting loss, Double-entry journal, COD verification).
              </p>
            </div>
            <div className="mt-3 text-[11px] font-mono bg-white p-1.5 rounded border border-emerald-200 text-emerald-800">
              Pure PHP Services
            </div>
          </div>

          {/* Step 6 */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">6. Persistence</span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">Core/Database.php</h4>
              <p className="text-xs text-gray-600 mt-1">
                Centralized PDO prepared statement execution with InnoDB transactional isolation.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-mono bg-white p-1.5 rounded border border-gray-200 text-gray-500">
              PDO Prepared & Tx
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Directory Explorer & Code Responsibilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Directory Tree */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Folder className="w-4 h-4 text-emerald-600" />
              Interactive Project Directory Structure
            </h3>
            <span className="text-[10px] font-mono text-gray-500">Click any file to inspect</span>
          </div>

          <div className="h-[440px] overflow-y-auto pr-2 text-xs font-mono space-y-1">
            {renderTree(CORE_PHP_DIRECTORY_TREE)}
          </div>
        </div>

        {/* Right: Selected File Inspector & Design Patterns */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-mono font-bold text-gray-900">{selectedFile}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                Core Architectural Component
              </span>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 leading-relaxed font-mono">
              <strong>Role & Responsibility:</strong>
              <p className="mt-1 font-sans text-gray-700 text-sm leading-normal">{selectedDesc}</p>
            </div>

            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Key Architectural Rules for this File:</h4>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Strictly no Laravel helper functions (`request()`, `dd()`, `env()`); use pure PHP native OOP methods.</li>
                <li>All dynamic SQL variables must be bound via PDO positional (`?`) or named (`:param`) parameters.</li>
                <li>Financial and stock balance updates must be wrapped in `Database::transaction(callable)`.</li>
                <li>Zero HTML markup or visual styling inside controllers or services.</li>
              </ul>
            </div>
          </div>

          {/* Strict Core PHP Guarantees */}
          <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Strict Core PHP Implementation Principles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <strong className="text-emerald-300 block mb-1">1. Zero Framework Lock-In</strong>
                <p className="text-gray-300 text-[11px]">
                  Any developer with standard PHP 8, PDO, and MySQL skills can read, debug, and enhance the code
                  without learning framework magic.
                </p>
              </div>
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <strong className="text-emerald-300 block mb-1">2. 100% Prepared Statements</strong>
                <p className="text-gray-300 text-[11px]">
                  String concatenation in SQL queries is strictly prohibited. Eliminates SQL injection vulnerabilities entirely.
                </p>
              </div>
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <strong className="text-emerald-300 block mb-1">3. Database Transactions</strong>
                <p className="text-gray-300 text-[11px]">
                  Order placement, sorting loss recording, and payment handover use ACID transactions to guarantee zero orphaned records.
                </p>
              </div>
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <strong className="text-emerald-300 block mb-1">4. Bangladesh Market Ready</strong>
                <p className="text-gray-300 text-[11px]">
                  Native Upazila delivery tiers, BDT ৳ currency formatting, Asia/Dhaka timezone, and dual Bangla/English string support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

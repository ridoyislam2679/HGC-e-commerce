import React, { useState } from 'react';
import { IMPLEMENTATION_ROADMAP, RoadmapPhase } from '../data/architectureData';
import { CheckCircle2, ChevronDown, ChevronUp, Terminal, Monitor, HardDrive, ShieldCheck, ArrowRight } from 'lucide-react';

export const RoadmapTab: React.FC = () => {
  const [expandedPhase, setExpandedPhase] = useState<number>(1);

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              14-Phase Step-by-Step Implementation Roadmap
            </h3>
            <p className="text-xs text-gray-500">
              Rigorous phase-by-phase execution plan ensuring zero broken dependencies, complete testing, and XAMPP compatibility
            </p>
          </div>
          <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
            Current: Phase 0 Completed
          </span>
        </div>
      </div>

      {/* XAMPP Local Development Guide Card */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Monitor className="w-4 h-4" />
          XAMPP (Windows 10) Local Development Setup Instructions
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {/* Step A */}
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 space-y-2">
            <span className="text-emerald-400 font-bold block">1. Folder Placement</span>
            <p className="text-gray-300 text-[11px] font-sans">
              Clone or extract code directly inside XAMPP document root:
            </p>
            <div className="bg-black/50 p-2 rounded text-[11px] text-gray-300">
              C:\xampp\htdocs\grocery-erp
            </div>
            <p className="text-[10px] text-gray-400 font-sans">
              The public webroot will be <code>/public</code>.
            </p>
          </div>

          {/* Step B */}
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 space-y-2">
            <span className="text-emerald-400 font-bold block">2. Apache VirtualHost</span>
            <p className="text-gray-300 text-[11px] font-sans">
              Add to <code>C:\xampp\apache\conf\extra\httpd-vhosts.conf</code>:
            </p>
            <pre className="bg-black/50 p-2 rounded text-[10px] text-emerald-300 leading-tight">
{`<VirtualHost *:80>
  ServerName amar-bazar.local
  DocumentRoot "C:/xampp/htdocs/grocery-erp/public"
  <Directory "C:/xampp/htdocs/grocery-erp/public">
    AllowOverride All
    Require all granted
  </Directory>
</VirtualHost>`}
            </pre>
          </div>

          {/* Step C */}
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 space-y-2">
            <span className="text-emerald-400 font-bold block">3. Hosts File & DB Import</span>
            <p className="text-gray-300 text-[11px] font-sans">
              Add to <code>C:\Windows\System32\drivers\etc\hosts</code>:
            </p>
            <div className="bg-black/50 p-2 rounded text-[11px] text-gray-300">
              127.0.0.1 amar-bazar.local
            </div>
            <p className="text-[11px] text-gray-300 font-sans mt-1">
              Create database <code className="text-emerald-300">grocery_erp_db</code> in phpMyAdmin and import <code className="text-emerald-300">database/schema.sql</code>.
            </p>
          </div>
        </div>
      </div>

      {/* 14 Phases Accordion */}
      <div className="space-y-3">
        {IMPLEMENTATION_ROADMAP.map((phase) => {
          const isExpanded = expandedPhase === phase.phase;
          return (
            <div
              key={phase.phase}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded ? 'border-emerald-300 shadow-md ring-1 ring-emerald-500/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                onClick={() => setExpandedPhase(isExpanded ? 0 : phase.phase)}
                className="p-5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      phase.phase === 1
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {phase.phase}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{phase.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{phase.scope}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      phase.phase === 1
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {phase.phase === 1 ? 'Ready to Start' : 'Queued'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-100 space-y-3 text-xs">
                  <div>
                    <strong className="text-gray-900 block mb-1">Scope & Key Responsibilities:</strong>
                    <p className="text-gray-600 leading-relaxed text-xs">{phase.scope}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <strong className="text-gray-700 text-[11px] block mb-1">Key Files Created / Modified:</strong>
                      <div className="space-y-1 font-mono text-[11px] text-emerald-800">
                        {phase.keyFiles.map((f) => (
                          <div key={f}>• {f}</div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <strong className="text-gray-700 text-[11px] block mb-1">Database Changes / DDL:</strong>
                      <p className="text-[11px] text-gray-600 font-mono leading-relaxed">{phase.databaseChanges}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl text-[11px] text-emerald-950">
                    <strong className="block mb-0.5">Automated Testing & Acceptance Criteria:</strong>
                    {phase.testingVerification}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

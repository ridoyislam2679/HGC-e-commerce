import React, { useState } from 'react';
import { ANDROID_API_ENDPOINTS, ApiEndpoint } from '../data/architectureData';
import { Smartphone, Lock, Check, Copy, Code2, Globe } from 'lucide-react';

export const ApiTab: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ANDROID_API_ENDPOINTS[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              Android Mobile REST API Specification (/api/v1/)
            </h3>
            <p className="text-xs text-gray-500">
              Stateless REST endpoints engineered for Android native customer and delivery representative mobile applications
            </p>
          </div>
          <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
            Auth: Authorization: Bearer &lt;sha256_token&gt;
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <strong className="text-gray-900 block mb-1">Single Codebase Backend</strong>
            <p className="text-[11px] text-gray-600">
              Web portal and Android app share the identical PHP Service layer, database tables, and business rules.
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <strong className="text-gray-900 block mb-1">SHA-256 Hashed Tokens</strong>
            <p className="text-[11px] text-gray-600">
              Only cryptographically hashed tokens are stored in <code className="font-mono text-emerald-700">api_tokens</code> table.
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <strong className="text-gray-900 block mb-1">Consistent JSON Envelopes</strong>
            <p className="text-[11px] text-gray-600">
              All responses return standardized <code className="font-mono text-emerald-700">&#123; success, data, error &#125;</code> payloads.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column API Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider pb-3 mb-2 border-b border-gray-100">
            Available Endpoints ({ANDROID_API_ENDPOINTS.length})
          </h4>

          <div className="space-y-1.5">
            {ANDROID_API_ENDPOINTS.map((ep) => {
              const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
              return (
                <button
                  key={`${ep.method}-${ep.path}`}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all border ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                      : 'hover:bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        ep.method === 'POST'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono font-bold text-gray-900 text-xs truncate">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{ep.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Endpoint Detail */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    selectedEndpoint.method === 'POST'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="text-sm font-mono font-bold text-gray-900">
                  {selectedEndpoint.path}
                </span>
              </div>

              {selectedEndpoint.authRequired ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-100 text-amber-900">
                  <Lock className="w-3 h-3" /> Bearer Auth
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-green-100 text-green-900">
                  <Globe className="w-3 h-3" /> Public
                </span>
              )}
            </div>

            <p className="text-xs text-gray-700">{selectedEndpoint.summary}</p>

            {/* Request Payload */}
            {selectedEndpoint.requestSample && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                  <span>JSON Request Body</span>
                  <button
                    onClick={() => handleCopy(selectedEndpoint.requestSample || '')}
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy JSON
                  </button>
                </div>
                <pre className="bg-gray-900 text-emerald-300 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {selectedEndpoint.requestSample}
                </pre>
              </div>
            )}

            {/* Response Payload */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                <span>JSON Response (200 OK)</span>
                <button
                  onClick={() => handleCopy(selectedEndpoint.responseSample)}
                  className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy JSON
                </button>
              </div>
              <pre className="bg-gray-900 text-emerald-300 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                {selectedEndpoint.responseSample}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

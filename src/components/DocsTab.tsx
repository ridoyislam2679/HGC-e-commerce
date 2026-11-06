import React, { useState } from 'react';
import { FileText, Copy, Check, Download, Database } from 'lucide-react';

interface DocsTabProps {
  onCopyAllSql: () => void;
  sqlCopied: boolean;
}

export const DocsTab: React.FC<DocsTabProps> = ({ onCopyAllSql, sqlCopied }) => {
  const [copiedDoc, setCopiedDoc] = useState<boolean>(false);

  const blueprintSnippet = `# MASTER ARCHITECTURAL BLUEPRINT & SPECIFICATION
## AmarBazar Grocery E-commerce, Inventory, Delivery & Business Management ERP
**Platform Architecture:** Core PHP 8.2+ (Pure OOP, Custom MVC, PDO Prepared Statements, MySQL 8 InnoDB, Bootstrap 5)  
**Target Market:** Bangladesh Local Commerce (Starting 1 Upazila, architected for multi-Upazila/multi-warehouse scalability)  
**Timezone:** Asia/Dhaka | Base Currency: Bangladeshi Taka (BDT, ৳)  
**Framework Policy:** Strictly Zero PHP Frameworks (No Laravel, Symfony, or CodeIgniter). Clean, maintainable OOP code.

---

### Key System Workflows Defined:
1. Fresh Vegetable Sorting Loss & Effective Cost Basis (Loss is NEVER a sale or COGS).
2. Double-Entry Accounting with balanced Journal Entries (Debit strictly equals Credit).
3. Delivery Representative Compensation: Base Salary + Order Delivery Bounty + Field Marketing Sales Commission.
4. Three-Stage COD Cash Handover (Delivery Agent -> Admin Depot -> General Manager -> Bank Deposit).
5. Dual Investor Models: Loan Liability Amortization vs Mudharabah Equity Profit Sharing.
6. Android Mobile REST API (/api/v1/) with SHA-256 Bearer Token authentication.
7. XAMPP Local Development on Windows 10 & Production VPS Apache Deployment.`;

  const copyBlueprint = () => {
    navigator.clipboard.writeText(blueprintSnippet);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Generated Project Files & Master Artifacts
            </h3>
            <p className="text-xs text-gray-500">
              The project specification and database DDL are written directly to your project workspace files
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyBlueprint}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                copiedDoc ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copiedDoc ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedDoc ? 'Copied!' : 'Copy Summary'}
            </button>
            <button
              onClick={onCopyAllSql}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                sqlCopied ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              {sqlCopied ? 'schema.sql Copied!' : 'Copy schema.sql (52 Tables)'}
            </button>
          </div>
        </div>

        {/* File Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-800">/docs/ARCHITECTURE_MASTER_BLUEPRINT.md</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">19 Sections</span>
            </div>
            <p className="text-xs text-gray-600">
              Complete, comprehensive architectural master blueprint answering all 19 specifications required in PART 34.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-800">/database/schema.sql</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">52 Tables</span>
            </div>
            <p className="text-xs text-gray-600">
              Production MySQL 8 DDL with InnoDB storage engine, foreign key cascades, unique indices, and double-entry chart of accounts.
            </p>
          </div>
        </div>

        {/* Blueprint Preview */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Architecture Document Executive Excerpt:
          </h4>
          <pre className="bg-gray-900 text-emerald-300 p-5 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-gray-800">
            {blueprintSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};

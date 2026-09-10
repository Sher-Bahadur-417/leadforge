import React from 'react';
import { 
  Workflow, 
  FileSpreadsheet, 
  Download, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Database
} from 'lucide-react';

interface HeaderProps {
  sheetConnected: boolean;
  sheetExistingCount: number;
  n8nConnected: boolean;
  onOpenN8nModal: () => void;
  onOpenJsonModal: () => void;
  onExportCsv: () => void;
  leadsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  sheetConnected,
  sheetExistingCount,
  n8nConnected,
  onOpenN8nModal,
  onOpenJsonModal,
  onExportCsv,
  leadsCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AI Lead Finder & Qualification
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                n8n Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live Google Search Grounding &bull; Zero Hallucinations &bull; Google Sheets Sync
            </p>
          </div>
        </div>

        {/* Center: Real-time Integration Status Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Grounding Engine Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">Gemini 3.8 Flash Search</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          {/* Google Sheets Sync Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
            sheetConnected 
              ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300' 
              : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
          }`}>
            <FileSpreadsheet className={`w-3.5 h-3.5 ${sheetConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>Google Sheets:</span>
            <span>{sheetConnected ? `Connected (${sheetExistingCount} cached)` : 'Not Connected'}</span>
          </div>

          {/* n8n Webhook Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
            n8nConnected 
              ? 'bg-purple-950/50 border-purple-800/60 text-purple-300' 
              : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
          }`}>
            <Workflow className={`w-3.5 h-3.5 ${n8nConnected ? 'text-purple-400' : 'text-slate-500'}`} />
            <span>n8n Webhook:</span>
            <span>{n8nConnected ? 'Live' : 'Optional'}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* n8n Blueprint Architecture Modal */}
          <button
            id="btn-open-n8n-modal"
            onClick={onOpenN8nModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
            title="View full n8n cold-email & meeting booking workflow"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>n8n Blueprint</span>
          </button>

          {/* Structured JSON Export (Section 16) */}
          <button
            id="btn-open-json-modal"
            onClick={onOpenJsonModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            title="View output in Section 16 format"
          >
            <span>JSON Spec</span>
          </button>

          {/* CSV Export */}
          <button
            id="btn-export-csv"
            onClick={onExportCsv}
            disabled={leadsCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white shadow-sm transition-all cursor-pointer"
            title="Download verified leads as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV ({leadsCount})</span>
          </button>
        </div>

      </div>
    </header>
  );
};

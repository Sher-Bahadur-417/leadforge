import React from 'react';
import { Sparkles, Download, FileSpreadsheet, Workflow, Layers, CheckCircle2 } from 'lucide-react';

interface LeadForgeHeaderProps {
  leadsCount: number;
  sheetConnected: boolean;
  onOpenSheetModal: () => void;
  onOpenN8nModal: () => void;
  onExportCsv: () => void;
}

export const LeadForgeHeader: React.FC<LeadForgeHeaderProps> = ({
  leadsCount,
  sheetConnected,
  onOpenSheetModal,
  onOpenN8nModal,
  onExportCsv,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                Lead<span className="text-cyan-400">Forge</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                AI Lead Gen
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400">
              Find leads. Qualify. Automate.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Leads Count Badge */}
          {leadsCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                <strong className="text-white font-mono">{leadsCount}</strong> leads ready
              </span>
            </div>
          )}

          {/* Google Sheets Sync Status Button */}
          <button
            type="button"
            id="btn-sheet-sync-status"
            onClick={onOpenSheetModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              sheetConnected
                ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className={`w-3.5 h-3.5 ${sheetConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{sheetConnected ? 'Sheet Connected' : 'Connect Sheet'}</span>
            {sheetConnected && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </button>

          {/* n8n Automation Modal Button */}
          <button
            type="button"
            id="btn-open-n8n"
            onClick={onOpenN8nModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
            title="View n8n cold email outreach workflow"
          >
            <Workflow className="w-3.5 h-3.5 text-purple-400" />
            <span>Outreach Flow</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            id="btn-export-csv"
            onClick={onExportCsv}
            disabled={leadsCount === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};

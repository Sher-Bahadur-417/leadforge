import React from 'react';
import { 
  Search, 
  CheckCircle2, 
  CopyMinus, 
  PlusCircle, 
  Layers, 
  Loader2, 
  Pause, 
  Check, 
  RotateCcw 
} from 'lucide-react';
import { ExecutionReport, BatchCheckpoint } from '../types/lead';

interface ProgressDashboardProps {
  report: ExecutionReport;
  checkpoint: BatchCheckpoint;
  targetLeads: number;
  isRunning: boolean;
  isPaused: boolean;
  onReset: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  report,
  checkpoint,
  targetLeads,
  isRunning,
  isPaused,
  onReset,
}) => {
  const percentComplete = targetLeads > 0 
    ? Math.min(100, Math.round((report.added / targetLeads) * 100))
    : 0;

  const totalBatches = targetLeads > 0 ? Math.ceil(targetLeads / 25) : 1;
  const currentBatchNum = checkpoint.batchIndex > 0 ? checkpoint.batchIndex : (report.added > 0 ? totalBatches : 1);

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Generation & Qualification Progress
          </h3>

          {/* Status Badge */}
          {isRunning && !isPaused && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              Finding & Verifying...
            </span>
          )}
          {isPaused && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">
              <Pause className="w-3 h-3" />
              Paused
            </span>
          )}
          {!isRunning && report.status === 'completed' && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Check className="w-3 h-3" />
              Goal Reached
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400">
            <strong className="text-cyan-400 font-mono font-bold text-sm">{report.added}</strong> of{' '}
            <strong className="text-white font-mono text-sm">{targetLeads}</strong> leads added ({percentComplete}%)
          </div>

          {!isRunning && report.added > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Reset metrics and start a new search"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentComplete >= 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500'
            }`}
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* The 5 Simple Progress Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        {/* 1. Leads Found */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Leads Found</span>
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{report.processed.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Discovered from web & maps</p>
        </div>

        {/* 2. Valid Leads */}
        <div className="bg-slate-950 border border-cyan-900/40 bg-cyan-950/10 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Valid Leads</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300 font-mono">{report.added.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Real & verified businesses</p>
        </div>

        {/* 3. Duplicates Removed */}
        <div className="bg-slate-950 border border-amber-900/40 bg-amber-950/10 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Duplicates Removed</span>
            <CopyMinus className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">{report.duplicates.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Filtered automatically</p>
        </div>

        {/* 4. Leads Added */}
        <div className="bg-slate-950 border border-emerald-900/50 bg-emerald-950/20 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Leads Added</span>
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-300 font-mono">{report.added.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-500/80">In your verified list</p>
        </div>

        {/* 5. Current Batch */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Current Batch</span>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300 font-mono">
            Batch #{currentBatchNum} <span className="text-xs text-slate-500 font-normal">/ {totalBatches}</span>
          </div>
          <p className="text-[10px] text-slate-500">
            {isRunning ? 'Processing chunk...' : report.status === 'completed' ? 'All batches finished' : 'Ready'}
          </p>
        </div>
      </div>
    </div>
  );
};

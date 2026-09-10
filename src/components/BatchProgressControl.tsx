import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { BatchCheckpoint, ExecutionReport } from '../types/lead';

interface BatchProgressControlProps {
  isRunning: boolean;
  isPaused: boolean;
  checkpoint: BatchCheckpoint;
  report: ExecutionReport;
  targetLeads: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const BatchProgressControl: React.FC<BatchProgressControlProps> = ({
  isRunning,
  isPaused,
  checkpoint,
  report,
  targetLeads,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}) => {
  const percentComplete = targetLeads > 0 
    ? Math.min(100, Math.round((report.added / targetLeads) * 100))
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-4">
      {/* Top Row: Status Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Batch Qualification Engine
            </h2>

            {/* Status Badge */}
            {isRunning && !isPaused && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                Active Batch Processing
              </span>
            )}
            {isPaused && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">
                <Pause className="w-3 h-3" />
                Paused at Checkpoint
              </span>
            )}
            {!isRunning && report.status === 'completed' && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                Run Completed
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Processes in resilient batches with live deduplication against history and connected Google Sheets.
          </p>
        </div>

        {/* Action Button Toolbar */}
        <div className="flex items-center gap-2">
          {!isRunning && !isPaused && (
            <button
              id="btn-start-run"
              onClick={onStart}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Discovery Run</span>
            </button>
          )}

          {isRunning && !isPaused && (
            <button
              id="btn-pause-run"
              onClick={onPause}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              id="btn-resume-run"
              onClick={onResume}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Run</span>
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              id="btn-stop-run"
              onClick={onStop}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          )}

          {!isRunning && report.added > 0 && (
            <button
              id="btn-reset-run"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Reset metrics and clear leads list"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Numerical Metrics */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Progress to Goal:</span>
            <span className="font-mono font-bold text-cyan-400">
              {report.added.toLocaleString()} / {targetLeads.toLocaleString()} Leads Qualified
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">
              Batch: <strong className="text-white">{checkpoint.batchIndex}</strong>
            </span>
            <span className="text-cyan-400 font-bold">{percentComplete}%</span>
          </div>
        </div>

        {/* Visual Progress Bar Track */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentComplete >= 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Checkpoint Resilience Notice */}
      {checkpoint.batchIndex > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>
              Last checkpoint saved at <strong>{checkpoint.timestamp || 'Ready'}</strong>.
              If interrupted, discovery resumes from offset #{checkpoint.cumulativeAdded + 1}.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Duplicates Filtered: <strong className="text-amber-400">{report.duplicates}</strong></span>
            <span>Invalid Filtered: <strong className="text-rose-400">{report.invalid}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

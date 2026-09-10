import React, { useRef, useEffect, useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Trash2, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ActivityLogEntry } from '../types/lead';

interface TerminalLogProps {
  logs: ActivityLogEntry[];
  onClear: () => void;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl font-mono text-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Live Search & Verification Log</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
            {logs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            title="Clear Log"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Log Output Stream */}
      {isExpanded && (
        <div
          ref={scrollRef}
          className="p-4 max-h-56 overflow-y-auto space-y-1.5 bg-slate-950/90 text-slate-300 select-text"
        >
          {logs.length === 0 ? (
            <div className="text-slate-600 py-3 text-center italic">
              Terminal ready. Set target criteria and press "Start Discovery Run" to initiate live Google Search Grounding.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-600 text-[10px] select-none whitespace-nowrap">
                  {log.timestamp}
                </span>

                {log.level === 'success' && (
                  <span className="text-emerald-400 font-semibold">[SUCCESS]</span>
                )}
                {log.level === 'warn' && (
                  <span className="text-amber-400 font-semibold">[DEDUP]</span>
                )}
                {log.level === 'error' && (
                  <span className="text-rose-400 font-semibold">[INVALID]</span>
                )}
                {log.level === 'info' && (
                  <span className="text-cyan-400 font-semibold">[SEARCH]</span>
                )}

                <span className={`flex-1 break-words ${
                  log.level === 'success' ? 'text-slate-200' :
                  log.level === 'warn' ? 'text-amber-200/90' :
                  log.level === 'error' ? 'text-rose-200/90' :
                  'text-slate-300'
                }`}>
                  {log.message}
                  {log.details && (
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      {log.details}
                    </span>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

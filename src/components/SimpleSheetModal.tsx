import React, { useState } from 'react';
import { X, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { extractSpreadsheetId } from '../services/googleSheetsClient';

interface SimpleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetId: string;
  sheetTab: string;
  onSave: (sheetId: string, sheetTab: string) => void;
  onTestConnection: () => Promise<void>;
  sheetConnected: boolean;
  sheetConnecting: boolean;
  sheetMessage: { type: 'success' | 'error' | 'info'; text: string } | null;
}

export const SimpleSheetModal: React.FC<SimpleSheetModalProps> = ({
  isOpen,
  onClose,
  sheetId,
  sheetTab,
  onSave,
  onTestConnection,
  sheetConnected,
  sheetConnecting,
  sheetMessage,
}) => {
  const [localSheetId, setLocalSheetId] = useState(sheetId);
  const [localTab, setLocalTab] = useState(sheetTab || 'Sheet1');

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    onSave(localSheetId, localTab);
    await onTestConnection();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Google Sheets Integration</h2>
              <p className="text-slate-400 text-xs">
                Auto-sync qualified leads directly into your Google Sheet.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Google Spreadsheet Link or Sheet ID
            </label>
            <input
              type="text"
              value={localSheetId}
              onChange={(e) => setLocalSheetId(e.target.value)}
              placeholder="Paste link: https://docs.google.com/spreadsheets/d/..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              You can paste the entire browser URL or just the Spreadsheet ID.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Sheet Tab Name
            </label>
            <input
              type="text"
              value={localTab}
              onChange={(e) => setLocalTab(e.target.value)}
              placeholder="Sheet1"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Feedback Message */}
          {sheetMessage && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                sheetMessage.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-800 text-rose-300'
              }`}
            >
              {sheetMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              )}
              <span>{sheetMessage.text}</span>
            </div>
          )}

          {/* How It Works Explanation */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <span className="font-semibold text-slate-300 block">How LeadForge syncs with Google Sheets:</span>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Each verified lead is appended automatically as it is qualified.</li>
              <li>Columns match your cold outreach system: <code>Business, Email, Issue or Pitch, Email Sent</code>.</li>
              <li>Existing rows in your sheet are read to prevent duplicate outreach.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {sheetConnected ? 'Status: Active & Synced' : 'Status: Not connected'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndTest}
              disabled={sheetConnecting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {sheetConnecting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{sheetConnecting ? 'Testing...' : 'Save & Connect'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

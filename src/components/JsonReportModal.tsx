import React, { useState } from 'react';
import { X, Copy, Download, Check, Code } from 'lucide-react';
import { LeadRecord, ExecutionReport } from '../types/lead';

interface JsonReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ExecutionReport;
  leads: LeadRecord[];
}

export const JsonReportModal: React.FC<JsonReportModalProps> = ({
  isOpen,
  onClose,
  report,
  leads,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Clean output conforming strictly to Section 16 format (omitting any internal _details)
  const formattedOutput = {
    run: {
      status: report.status,
      target: report.target,
      processed: report.processed,
      added: report.added,
      duplicates: report.duplicates,
      invalid: report.invalid,
      failed: report.failed,
    },
    leads: leads.map((lead) => ({
      Name: lead.Name,
      Company: lead.Company,
      Business: lead.Business,
      Email: lead.Email,
      Phone: lead.Phone,
      City: lead.City,
      Country: lead.Country,
      'Contact Person': lead['Contact Person'],
      Industry: lead.Industry,
      'Issue or Pitch': lead['Issue or Pitch'],
      Website: lead.Website,
      'Source URL': lead['Source URL'],
      'Lead Score': lead['Lead Score'],
      'Lead Status': lead['Lead Status'],
      'Date Found': lead['Date Found'],
      'Processing Status': lead['Processing Status'],
      'Email Sent': lead['Email Sent'],
    })),
  };

  const jsonString = JSON.stringify(formattedOutput, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Section 16 Structured JSON Output</h2>
              <p className="text-slate-400 text-[11px]">
                Valid JSON with run summary statistics and standardized lead records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              type="button"
              onClick={downloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-6 overflow-y-auto">
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-[11px] overflow-x-auto max-h-[550px] leading-relaxed select-text">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-slate-500 text-[11px]">
          <span>{leads.length} leads in export &bull; Email Sent = NO guaranteed</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

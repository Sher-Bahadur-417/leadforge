import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Zap, 
  ShieldCheck, 
  Star, 
  Copy, 
  Check, 
  Code
} from 'lucide-react';
import { LeadRecord } from '../types/lead';

interface LeadDetailModalProps {
  lead: LeadRecord | null;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  if (!lead) return null;

  const score = lead['Lead Score'];
  const scoreClass =
    score >= 90
      ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
      : score >= 70
      ? 'bg-cyan-950 text-cyan-400 border-cyan-700'
      : score >= 50
      ? 'bg-amber-950 text-amber-400 border-amber-700'
      : 'bg-slate-800 text-slate-400 border-slate-700';

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(lead, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{lead.Business}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${scoreClass}`}>
                  Score: {score}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {lead.Industry || 'Business'} &bull; {lead.City}, {lead.Country}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Toggle JSON View"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {showJson ? (
            <div className="relative">
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(lead, null, 2)}
              </pre>
              <button
                type="button"
                onClick={copyJson}
                className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Key Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Contact Person</span>
                  <div className="text-slate-200 font-medium text-sm">
                    {lead['Contact Person'] || <span className="text-slate-500 italic">No specific public person listed</span>}
                  </div>
                  <div className="text-[10px] text-slate-400">Company Field: {lead.Company}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Verified Email</span>
                  <div className="font-mono text-sm text-blue-300 break-all">
                    {lead.Email || <span className="text-slate-500 italic font-sans text-xs">Left empty (No verified public email)</span>}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {lead.Email ? 'Normalized, RFC validated, public domain' : 'Zero hallucination guarantee'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Official Website</span>
                  {lead.Website ? (
                    <a
                      href={lead.Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 text-xs truncate"
                    >
                      <span>{lead.Website}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-slate-500 italic text-xs">No website found</span>
                  )}
                  <div className="text-[10px] text-slate-500">Entity verified</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Public Source Link</span>
                  {lead['Source URL'] ? (
                    <a
                      href={lead['Source URL']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 text-xs truncate"
                    >
                      <span className="truncate">{lead['Source URL']}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-slate-500 text-xs">Google Search Grounding index</span>
                  )}
                  <div className="text-[10px] text-slate-500">Public search listing evidence</div>
                </div>
              </div>

              {/* Detected Bottleneck Opportunity & n8n Pitch */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Personalized Issue & n8n Value Proposition Pitch</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 text-xs leading-relaxed">
                  {lead['Issue or Pitch']}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>
                    Crafted with realistic, cautious phrasing and mapped to n8n cold-outreach templates.
                  </span>
                </div>
              </div>

              {/* Compatibility Check with Existing Outreach Automation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-300 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Existing n8n Automation Field Mapping</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Name:</span>
                    <span className="text-slate-200">{lead.Name || '-'}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Company:</span>
                    <span className="text-slate-200">{lead.Company || '-'}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Business:</span>
                    <span className="text-slate-200">{lead.Business || '-'}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Email:</span>
                    <span className="text-blue-300">{lead.Email || '-'}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Email Sent:</span>
                    <span className="text-amber-400">{lead['Email Sent']}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Processing Status:</span>
                    <span className="text-emerald-400">{lead['Processing Status']}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Date Discovered: {lead['Date Found']} &bull; Status: {lead['Lead Status']}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Lead' : 'Copy JSON'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

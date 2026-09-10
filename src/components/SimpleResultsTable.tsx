import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Mail, 
  Copy, 
  Check, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Eye, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { LeadRecord } from '../types/lead';

interface SimpleResultsTableProps {
  leads: LeadRecord[];
  sheetConnected: boolean;
  onOpenSheetModal: () => void;
  onExportCsv: () => void;
  onSelectLead: (lead: LeadRecord) => void;
}

export const SimpleResultsTable: React.FC<SimpleResultsTableProps> = ({
  leads,
  sheetConnected,
  onOpenSheetModal,
  onExportCsv,
  onSelectLead,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [emailOnly, setEmailOnly] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredLeads = leads.filter((lead) => {
    if (emailOnly && !lead.Email) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      lead.Business.toLowerCase().includes(term) ||
      lead.Email.toLowerCase().includes(term) ||
      lead.City.toLowerCase().includes(term) ||
      lead.Country.toLowerCase().includes(term) ||
      lead.Website.toLowerCase().includes(term) ||
      lead['Issue or Pitch'].toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900/90">
        {/* Left: Title & Google Sheets Sync Status */}
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Verified Results</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              {filteredLeads.length} {filteredLeads.length === 1 ? 'Lead' : 'Leads'}
            </span>
          </h3>

          {/* Google Sheets Sync Status Pill */}
          <button
            type="button"
            onClick={onOpenSheetModal}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              sheetConnected
                ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileSpreadsheet className={`w-3.5 h-3.5 ${sheetConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{sheetConnected ? 'Google Sheets Synced' : 'Connect Google Sheet'}</span>
            {sheetConnected && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>

        {/* Right: Search, Email Filter & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              id="input-table-search"
              placeholder="Filter by business, email, city, problem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* With Email Only Toggle */}
          <button
            type="button"
            onClick={() => setEmailOnly(!emailOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              emailOnly
                ? 'bg-blue-950 border-blue-700 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>With Email</span>
          </button>

          {/* Export Button */}
          <button
            type="button"
            id="btn-table-export"
            onClick={onExportCsv}
            disabled={leads.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Results Table: Business | Email | Website | Location | Problem | Score | Status */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4 min-w-[170px]">Business</th>
              <th className="py-3 px-4 min-w-[170px]">Email</th>
              <th className="py-3 px-4 min-w-[140px]">Website</th>
              <th className="py-3 px-4 min-w-[130px]">Location</th>
              <th className="py-3 px-4 min-w-[280px]">Detected Problem / Pitch</th>
              <th className="py-3 px-4 text-center">Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center text-slate-500">
                  {leads.length === 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-400">No leads generated yet.</p>
                      <p className="text-xs text-slate-500">
                        Choose your niche and location above, then click <strong>"Start Finding Leads"</strong>.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs">No leads match your filter search.</p>
                  )}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, idx) => {
                const score = lead['Lead Score'];
                const scoreBadgeClass =
                  score >= 90
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-700/80'
                    : score >= 70
                    ? 'bg-cyan-950 text-cyan-400 border-cyan-700/80'
                    : score >= 50
                    ? 'bg-amber-950 text-amber-400 border-amber-700/80'
                    : 'bg-slate-800 text-slate-400 border-slate-700';

                // Extract problem sentence from 'Issue or Pitch'
                const problemText = lead['Issue or Pitch'].includes('| Pitch:')
                  ? lead['Issue or Pitch'].split('| Pitch:')[0].trim()
                  : lead['Issue or Pitch'];

                return (
                  <tr
                    key={`${lead.Business}-${idx}`}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* 1. Business */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors text-sm">
                        {lead.Business}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lead.Company && lead.Company !== lead.Business ? lead.Company : lead.Industry}
                      </div>
                    </td>

                    {/* 2. Email */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {lead.Email ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-blue-300 bg-blue-950/50 border border-blue-900/60 px-2.5 py-0.5 rounded-md text-xs">
                            {lead.Email}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyEmail(lead.Email, e)}
                            className="text-slate-500 hover:text-white p-1 rounded transition-colors"
                            title="Copy email"
                          >
                            {copiedEmail === lead.Email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">
                          No public email
                        </span>
                      )}
                    </td>

                    {/* 3. Website */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {lead.Website ? (
                        <a
                          href={lead.Website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-cyan-400 hover:underline flex items-center gap-1 text-xs"
                        >
                          <span className="max-w-[130px] truncate">{lead.Website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No website</span>
                      )}
                    </td>

                    {/* 4. Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 text-xs font-medium">
                      {lead.City}, {lead.Country}
                    </td>

                    {/* 5. Problem */}
                    <td className="py-3.5 px-4">
                      <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                        {problemText}
                      </p>
                    </td>

                    {/* 6. Score */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${scoreBadgeClass}`}>
                        {score}
                      </span>
                    </td>

                    {/* 7. Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          Email Sent: {lead['Email Sent']}
                        </span>
                        {lead['Processing Status'] && (
                          <div className="text-[10px] text-slate-400">
                            {lead['Processing Status']}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="View Full Lead Details & Pitch"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

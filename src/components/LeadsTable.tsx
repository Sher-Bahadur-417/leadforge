import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Mail, 
  Phone, 
  Building2, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Check,
  Eye,
  Filter
} from 'lucide-react';
import { LeadRecord } from '../types/lead';

interface LeadsTableProps {
  leads: LeadRecord[];
  onSelectLead: (lead: LeadRecord) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onSelectLead }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScore, setFilterScore] = useState<number>(0);
  const [filterEmailOnly, setFilterEmailOnly] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredLeads = leads.filter((lead) => {
    if (filterEmailOnly && !lead.Email) return false;
    if (filterScore > 0 && lead['Lead Score'] < filterScore) return false;
    if (!searchQuery) return true;

    const q = searchQuery.toLowerCase();
    return (
      lead.Business.toLowerCase().includes(q) ||
      lead.Company.toLowerCase().includes(q) ||
      lead.Name.toLowerCase().includes(q) ||
      lead.City.toLowerCase().includes(q) ||
      lead.Email.toLowerCase().includes(q) ||
      lead['Issue or Pitch'].toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Verified Qualified Leads</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
              {filteredLeads.length} of {leads.length}
            </span>
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search business, city, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 sm:w-60"
            />
          </div>

          {/* Email Only Filter */}
          <button
            type="button"
            onClick={() => setFilterEmailOnly(!filterEmailOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filterEmailOnly
                ? 'bg-blue-950 border-blue-700 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>With Email</span>
          </button>

          {/* Score Filter */}
          <select
            value={filterScore}
            onChange={(e) => setFilterScore(parseInt(e.target.value) || 0)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="0">Score: All</option>
            <option value="70">Score: &ge; 70 (Good)</option>
            <option value="85">Score: &ge; 85 (High)</option>
            <option value="90">Score: &ge; 90 (Top)</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Business & Company</th>
              <th className="py-3 px-4">Contact & Location</th>
              <th className="py-3 px-4">Verified Email</th>
              <th className="py-3 px-4">Website & Source</th>
              <th className="py-3 px-4 min-w-[280px]">Detected Bottleneck & n8n Pitch</th>
              <th className="py-3 px-4">Outreach Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  {leads.length === 0
                    ? 'No leads collected yet. Configure your search parameters above and start a discovery batch.'
                    : 'No leads match the current filters.'}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, idx) => {
                const score = lead['Lead Score'];
                const scoreBadgeClass =
                  score >= 90
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80'
                    : score >= 70
                    ? 'bg-cyan-950/80 text-cyan-400 border-cyan-700/80'
                    : score >= 50
                    ? 'bg-amber-950/80 text-amber-400 border-amber-700/80'
                    : 'bg-slate-800 text-slate-400 border-slate-700';

                return (
                  <tr
                    key={`${lead.Business}-${lead.City}-${idx}`}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Score */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold border ${scoreBadgeClass}`}>
                        {score}
                      </span>
                    </td>

                    {/* Business & Company */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {lead.Business}
                      </div>
                      {lead.Company && lead.Company !== lead.Business && (
                        <div className="text-[11px] text-slate-400">{lead.Company}</div>
                      )}
                      <div className="text-[10px] text-slate-500">{lead.Industry}</div>
                    </td>

                    {/* Contact Person & Location */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-200 font-medium">
                        {lead['Contact Person'] || <span className="text-slate-500 italic">Unspecified</span>}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lead.City}, {lead.Country}
                      </div>
                      {lead.Phone && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{lead.Phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {lead.Email ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-blue-300 bg-blue-950/40 border border-blue-900/60 px-2 py-0.5 rounded text-[11px]">
                            {lead.Email}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => copyToClipboard(lead.Email, e)}
                            className="text-slate-500 hover:text-white p-1 rounded transition-colors"
                            title="Copy email"
                          >
                            {copiedEmail === lead.Email ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">
                          No public email found
                        </span>
                      )}
                    </td>

                    {/* Website & Source URL */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {lead.Website ? (
                          <a
                            href={lead.Website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <span className="max-w-[120px] truncate">{lead.Website.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[10px]">No website</span>
                        )}

                        {lead['Source URL'] && (
                          <a
                            href={lead['Source URL']}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[10px]"
                            title={lead['Source URL']}
                          >
                            <span className="max-w-[120px] truncate">Source Listing</span>
                            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Issue / Pitch */}
                    <td className="py-3 px-4">
                      <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                        {lead['Issue or Pitch']}
                      </p>
                    </td>

                    {/* Outreach Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                          Email Sent: {lead['Email Sent']}
                        </span>
                        <div className="text-[10px] text-slate-500">
                          {lead['Processing Status']}
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="View Full Lead Audit & Pitch"
                      >
                        <Eye className="w-3.5 h-3.5" />
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

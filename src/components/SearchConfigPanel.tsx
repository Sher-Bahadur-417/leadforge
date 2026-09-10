import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Globe, 
  Tag, 
  Sliders, 
  FileSpreadsheet, 
  Workflow, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { SearchConfig } from '../types/lead';

interface SearchConfigPanelProps {
  config: SearchConfig;
  onChange: (updated: Partial<SearchConfig>) => void;
  isRunning: boolean;
  onTestSheetConnection: () => Promise<void>;
  sheetConnecting: boolean;
  sheetMessage: { type: 'success' | 'error' | 'info'; text: string } | null;
  onTestN8nWebhook: () => Promise<void>;
  n8nTesting: boolean;
  n8nMessage: { type: 'success' | 'error' | 'info'; text: string } | null;
}

const AVAILABLE_SOURCES = [
  'Google Search',
  'Google Maps / Business Listings',
  'Business Websites',
  'Public Business Directories',
  'Public Company / Contact Pages',
];

const TARGET_PRESETS = [25, 50, 100, 250, 500, 1000];

export const SearchConfigPanel: React.FC<SearchConfigPanelProps> = ({
  config,
  onChange,
  isRunning,
  onTestSheetConnection,
  sheetConnecting,
  sheetMessage,
  onTestN8nWebhook,
  n8nTesting,
  n8nMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'integrations'>('search');

  const toggleSource = (source: string) => {
    if (config.selected_sources.includes(source)) {
      if (config.selected_sources.length > 1) {
        onChange({ selected_sources: config.selected_sources.filter((s) => s !== source) });
      }
    } else {
      onChange({ selected_sources: [...config.selected_sources, source] });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Top Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === 'search'
              ? 'border-cyan-500 text-cyan-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search & Target Criteria</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === 'integrations'
              ? 'border-cyan-500 text-cyan-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Connected Destinations (Sheets & n8n)</span>
          {(config.google_sheet_id || config.n8n_webhook_url) && (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          )}
        </button>
      </div>

      <div className="p-5 lg:p-6 space-y-6">
        {activeTab === 'search' ? (
          <>
            {/* Primary Business Scope Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Niche Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Niche / Business Type <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-niche"
                    type="text"
                    disabled={isRunning}
                    placeholder="e.g. Cafes, Boutique Hotels, Dental Clinics, Commercial HVAC"
                    value={config.niche}
                    onChange={(e) => onChange({ niche: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-60"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Fully dynamic. Supports any industry worldwide.</p>
              </div>

              {/* City / Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  City / Location <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    id="input-city"
                    type="text"
                    disabled={isRunning}
                    placeholder="e.g. Lahore, Austin, Manchester, Dubai"
                    value={config.city}
                    onChange={(e) => onChange({ city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-60"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Target city, metropolitan area, or state.</p>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Country <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    id="input-country"
                    type="text"
                    disabled={isRunning}
                    placeholder="e.g. Pakistan, United States, United Kingdom, Canada"
                    value={config.country}
                    onChange={(e) => onChange({ country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-60"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Target country for geographical precision.</p>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Keywords & Search Refinements
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="input-keywords"
                  type="text"
                  disabled={isRunning}
                  placeholder="e.g. cafe, coffee shop, specialty roaster, espresso bar, dine-in"
                  value={config.keywords}
                  onChange={(e) => onChange({ keywords: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-60"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Comma-separated search vectors used for multi-query Google Search Grounding.
              </p>
            </div>

            {/* Target Leads & Batching Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Target Leads */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Target Leads (Max 1,000)
                  </label>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {config.target_leads.toLocaleString()} leads
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  disabled={isRunning}
                  value={config.target_leads}
                  onChange={(e) => onChange({ target_leads: parseInt(e.target.value) || 50 })}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2 disabled:opacity-60"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TARGET_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={isRunning}
                      onClick={() => onChange({ target_leads: preset })}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                        config.target_leads === preset
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Batch Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Batch Size
                  </label>
                  <span className="text-xs font-medium text-slate-400">
                    {Math.ceil(config.target_leads / config.batch_size)} batches total
                  </span>
                </div>
                <select
                  id="select-batch-size"
                  disabled={isRunning}
                  value={config.batch_size}
                  onChange={(e) => onChange({ batch_size: parseInt(e.target.value) || 25 })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all cursor-pointer disabled:opacity-60"
                >
                  <option value="10">10 leads / batch (Rapid checkpointing)</option>
                  <option value="20">20 leads / batch (Balanced)</option>
                  <option value="25">25 leads / batch (Recommended)</option>
                  <option value="50">50 leads / batch (High throughput)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Checkpoint saved to disk and Google Sheets after every batch.
                </p>
              </div>

              {/* Minimum Lead Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Minimum Lead Score
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                    config.minimum_lead_score >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    config.minimum_lead_score >= 60 ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    &ge; {config.minimum_lead_score} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  disabled={isRunning}
                  value={config.minimum_lead_score}
                  onChange={(e) => onChange({ minimum_lead_score: parseInt(e.target.value) || 0 })}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2 disabled:opacity-60"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 (All leads)</span>
                  <span>50 (Average)</span>
                  <span>70 (Good)</span>
                  <span>80+ (Excellent)</span>
                </div>
              </div>
            </div>

            {/* Selected Lead Sources */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Public Lead Sources (Multi-Source Verification)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SOURCES.map((source) => {
                  const isSelected = config.selected_sources.includes(source);
                  return (
                    <button
                      key={source}
                      type="button"
                      disabled={isRunning}
                      onClick={() => toggleSource(source)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-700/80 text-cyan-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Check className={`w-3 h-3 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                      <span>{source}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500">
                Grounds findings against live public business directories and search indexes. Each lead records its verified source URL.
              </p>
            </div>
          </>
        ) : (
          /* Integrations Tab: Google Sheets & n8n */
          <div className="space-y-6">
            {/* Google Sheets Integration Section */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      Google Sheets Integration
                    </h3>
                    <p className="text-xs text-slate-400">
                      Feeds existing leads into duplicate engine and auto-appends validated leads with <code className="text-emerald-400 bg-emerald-950/60 px-1 py-0.5 rounded">Email Sent = NO</code>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-test-sheet"
                  disabled={sheetConnecting || !config.google_sheet_id}
                  onClick={onTestSheetConnection}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${sheetConnecting ? 'animate-spin' : ''}`} />
                  <span>{sheetConnecting ? 'Reading Sheet...' : 'Test & Read Existing Rows'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Google Spreadsheet URL or Sheet ID
                  </label>
                  <input
                    id="input-sheet-id"
                    type="text"
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XR.../edit or raw ID"
                    value={config.google_sheet_id || ''}
                    onChange={(e) => onChange({ google_sheet_id: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Tab Name (Default: Sheet1)
                  </label>
                  <input
                    id="input-sheet-tab"
                    type="text"
                    placeholder="Sheet1"
                    value={config.google_sheet_tab || 'Sheet1'}
                    onChange={(e) => onChange({ google_sheet_tab: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Google OAuth Access Token / API Key (Optional if public or authorized)</span>
                  <span className="text-[11px] text-slate-500">Read & Append access</span>
                </label>
                <input
                  id="input-sheet-token"
                  type="password"
                  placeholder="Bearer ya29.a0AfH6SM... (Leave empty for demo or public sheet test)"
                  value={config.google_access_token || ''}
                  onChange={(e) => onChange({ google_access_token: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {sheetMessage && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  sheetMessage.type === 'success' ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' :
                  sheetMessage.type === 'error' ? 'bg-rose-950/60 border border-rose-800 text-rose-300' :
                  'bg-blue-950/60 border border-blue-800 text-blue-300'
                }`}>
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{sheetMessage.text}</span>
                </div>
              )}
            </div>

            {/* n8n Webhook Integration Section */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Direct n8n Webhook Trigger (Optional)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Dispatches verified leads payload in real-time as each batch completes
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-test-n8n"
                  disabled={n8nTesting || !config.n8n_webhook_url}
                  onClick={onTestN8nWebhook}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all cursor-pointer"
                >
                  <Zap className={`w-3 h-3 ${n8nTesting ? 'animate-bounce' : ''}`} />
                  <span>{n8nTesting ? 'Sending Ping...' : 'Test Ping Webhook'}</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  n8n Webhook URL
                </label>
                <input
                  id="input-n8n-webhook"
                  type="url"
                  placeholder="https://n8n.yourdomain.com/webhook/ai-leads-intake"
                  value={config.n8n_webhook_url || ''}
                  onChange={(e) => onChange({ n8n_webhook_url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              {n8nMessage && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  n8nMessage.type === 'success' ? 'bg-purple-950/60 border border-purple-800 text-purple-300' :
                  n8nMessage.type === 'error' ? 'bg-rose-950/60 border border-rose-800 text-rose-300' :
                  'bg-blue-950/60 border border-blue-800 text-blue-300'
                }`}>
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{n8nMessage.text}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

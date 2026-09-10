import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Tag, 
  Users, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { SearchConfig } from '../types/lead';

interface LeadSearchFormProps {
  config: SearchConfig;
  onChange: (updated: Partial<SearchConfig>) => void;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  sheetConnected: boolean;
  onOpenSheetModal: () => void;
}

const PRESET_LEAD_COUNTS = [10, 50, 100, 500, 1000];

const SAMPLE_NICHES = [
  'Cafes',
  'Dentists',
  'Real Estate Agencies',
  'Fitness Gyms',
  'Accounting Firms',
  'Law Offices',
];

export const LeadSearchForm: React.FC<LeadSearchFormProps> = ({
  config,
  onChange,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
  sheetConnected,
  onOpenSheetModal,
}) => {
  const [locationInput, setLocationInput] = useState(
    config.city && config.country ? `${config.city}, ${config.country}` : 'Lahore, Pakistan'
  );

  const handleLocationChange = (val: string) => {
    setLocationInput(val);
    const parts = val.split(',').map((p) => p.trim());
    if (parts.length >= 2) {
      onChange({ city: parts[0], country: parts.slice(1).join(', ') });
    } else {
      onChange({ city: val.trim(), country: config.country || 'Pakistan' });
    }
  };

  const handleSelectSample = (niche: string) => {
    onChange({ niche });
  };

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 lg:p-7 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Find Real Business Leads
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter your target niche and location. LeadForge finds real businesses, verified contacts, and detects automation opportunities.
          </p>
        </div>

        {/* Quick Sheet Status Indicator */}
        <button
          type="button"
          onClick={onOpenSheetModal}
          className={`self-start sm:self-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${
            sheetConnected
              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>{sheetConnected ? 'Google Sheet Synced' : 'Optional: Connect Sheet'}</span>
        </button>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Niche */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Niche / Business Type <span className="text-cyan-400">*</span>
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              id="input-niche"
              disabled={isRunning}
              value={config.niche}
              onChange={(e) => onChange({ niche: e.target.value })}
              placeholder="e.g. Cafes, Dentists, Gyms..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-60"
            />
          </div>

          {/* Quick Clickable Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-500">Popular:</span>
            {SAMPLE_NICHES.slice(0, 4).map((sample) => (
              <button
                key={sample}
                type="button"
                disabled={isRunning}
                onClick={() => handleSelectSample(sample)}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                  config.niche.toLowerCase() === sample.toLowerCase()
                    ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Location */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Location (City, Country) <span className="text-cyan-400">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              id="input-location"
              disabled={isRunning}
              value={locationInput}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="e.g. Lahore, Pakistan or New York, USA"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-60"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Searches verified local businesses and maps in this city.
          </p>
        </div>

        {/* 3. Keywords (Optional) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Keywords <span className="text-slate-500 font-normal lowercase">(optional)</span>
            </label>
          </div>
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              id="input-keywords"
              disabled={isRunning}
              value={config.keywords}
              onChange={(e) => onChange({ keywords: e.target.value })}
              placeholder="e.g. specialty coffee, roaster, espresso"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-60"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Refines search focus to specific business specialties.
          </p>
        </div>
      </div>

      {/* Number of Leads Quick Select */}
      <div className="space-y-2 pt-2 border-t border-slate-800/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Number of Leads Required</span>
          </label>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {config.target_leads.toLocaleString()} Leads
          </span>
        </div>

        {/* Quick Select Buttons */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {PRESET_LEAD_COUNTS.map((count) => {
            const isSelected = config.target_leads === count;
            return (
              <button
                key={count}
                type="button"
                id={`btn-count-${count}`}
                disabled={isRunning}
                onClick={() => onChange({ target_leads: count })}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                } disabled:opacity-50`}
              >
                {count.toLocaleString()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button Bar */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Strict no-hallucination guarantee: Only real businesses with verified public records.</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Main Start / Pause / Stop Controls */}
          {!isRunning && !isPaused && (
            <button
              type="button"
              id="btn-start-finding"
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Finding Leads</span>
            </button>
          )}

          {isRunning && !isPaused && (
            <button
              type="button"
              id="btn-pause-finding"
              onClick={onPause}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              type="button"
              id="btn-resume-finding"
              onClick={onResume}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume</span>
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              type="button"
              id="btn-stop-finding"
              onClick={onStop}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 transition-all cursor-pointer"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

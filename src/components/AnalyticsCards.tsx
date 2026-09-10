import React from 'react';
import { 
  Users, 
  CheckCircle, 
  CopyMinus, 
  AlertOctagon, 
  Star, 
  Mail, 
  Globe, 
  Zap, 
  Layers
} from 'lucide-react';
import { ExecutionReport } from '../types/lead';

interface AnalyticsCardsProps {
  report: ExecutionReport;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ report }) => {
  const emailRate = report.added > 0 ? Math.round((report.withEmailCount / report.added) * 100) : 0;
  const websiteRate = report.added > 0 ? Math.round((report.withWebsiteCount / report.added) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Total Discovered */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total Discovered</span>
          <Users className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="text-xl font-bold text-white font-mono">{report.processed.toLocaleString()}</div>
        <div className="text-[10px] text-slate-500">Target: {report.target.toLocaleString()}</div>
      </div>

      {/* 2. Total Validated & Added */}
      <div className="bg-slate-900 border border-emerald-900/60 bg-emerald-950/20 rounded-xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-emerald-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total Qualified</span>
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-xl font-bold text-emerald-300 font-mono">{report.added.toLocaleString()}</div>
        <div className="text-[10px] text-emerald-500">Passed strict verification</div>
      </div>

      {/* 3. Duplicates Removed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-amber-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Duplicates Dropped</span>
          <CopyMinus className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-xl font-bold text-amber-300 font-mono">{report.duplicates.toLocaleString()}</div>
        <div className="text-[10px] text-slate-500">Fuzzy & domain matching</div>
      </div>

      {/* 4. Average Score */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-cyan-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Lead Score</span>
          <Star className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-xl font-bold text-cyan-300 font-mono">
          {report.added > 0 ? report.avgScore : 0} <span className="text-xs text-slate-500 font-normal">/ 100</span>
        </div>
        <div className="text-[10px] text-slate-500">
          {report.avgScore >= 80 ? 'Excellent tier' : report.avgScore >= 60 ? 'Good tier' : 'Moderate'}
        </div>
      </div>

      {/* 5. Verified Public Emails */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-blue-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Verified Emails</span>
          <Mail className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div className="text-xl font-bold text-blue-300 font-mono">{report.withEmailCount.toLocaleString()}</div>
        <div className="text-[10px] text-slate-500">{emailRate}% of qualified leads</div>
      </div>

      {/* 6. Automation Pitches Generated */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-purple-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">n8n Pitches</span>
          <Zap className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div className="text-xl font-bold text-purple-300 font-mono">
          {report.withAutomationOpportunityCount.toLocaleString()}
        </div>
        <div className="text-[10px] text-slate-500">{report.batchesCompleted} batches finished</div>
      </div>
    </div>
  );
};

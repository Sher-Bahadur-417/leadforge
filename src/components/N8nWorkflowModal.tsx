import React, { useState } from 'react';
import { 
  X, 
  Workflow, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Mail, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Code
} from 'lucide-react';
import { generateN8nWorkflowTemplate } from '../services/n8nWorkflowGenerator';

interface N8nWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetId?: string;
  sheetTab?: string;
}

export const N8nWorkflowModal: React.FC<N8nWorkflowModalProps> = ({
  isOpen,
  onClose,
  sheetId,
  sheetTab,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'json'>('architecture');

  if (!isOpen) return null;

  const workflowJson = generateN8nWorkflowTemplate({
    sheetId: sheetId || 'YOUR_GOOGLE_SHEET_ID',
    sheetTab: sheetTab || 'Sheet1',
  });

  const jsonString = JSON.stringify(workflowJson, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJsonFile = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'n8n-cold-email-reply-meeting-flow.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                n8n Cold-Email, Reply-Handling & Meeting Booking Automation
              </h2>
              <p className="text-slate-400 text-[11px]">
                Architect blueprint & ready-to-import n8n workflow file connecting your verified leads.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-800 bg-slate-950/40">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 font-semibold text-xs rounded-t-lg transition-all border-b-2 cursor-pointer ${
                activeTab === 'architecture'
                  ? 'border-purple-500 text-purple-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Visual Architecture Pipeline
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`px-4 py-2 font-semibold text-xs rounded-t-lg transition-all border-b-2 cursor-pointer ${
                activeTab === 'json'
                  ? 'border-purple-500 text-purple-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              n8n Workflow JSON (Importable)
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Workflow JSON'}</span>
            </button>
            <button
              type="button"
              onClick={downloadJsonFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'architecture' ? (
            <div className="space-y-6">
              {/* Pipeline Flow Diagram */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  End-To-End Automation Architecture (Section 11)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-800/60 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>1. AI Lead Discovery</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Finds real businesses via Google Search Grounding. Validates email, website, deduplicates, and scores leads.
                    </p>
                    <div className="text-[10px] text-cyan-500 font-mono">Output: Validated Lead</div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-800/60 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>2. Google Sheets Hub</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Saves verified row with <code>Email Sent = "NO"</code>. Mapped to Name, Company, Business, Email, Issue or Pitch.
                    </p>
                    <div className="text-[10px] text-emerald-500 font-mono">Status: Email Sent = NO</div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-800/60 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <Mail className="w-4 h-4" />
                      <span>3. n8n Cold Outreach</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Polls sheet every 2 hours. Throttles to 10/hr. Sends personalized email with custom pitch. Updates to <code>Email Sent = "YES"</code>.
                    </p>
                    <div className="text-[10px] text-blue-500 font-mono">Gmail / Outlook Node</div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-800/60 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Calendar className="w-4 h-4" />
                      <span>4. Reply Agent & Booking</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Watches replies with Gmail Trigger. Gemini classifies sentiment. If interested, auto-sends Cal.com meeting booking link!
                    </p>
                    <div className="text-[10px] text-purple-500 font-mono">Gemini AI + Cal.com</div>
                  </div>
                </div>
              </div>

              {/* Exact Fields Expected By Existing Outreach System */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Exact Field Names Preserved (Section 3 & 11)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  The existing outreach system strictly relies on these exact case-sensitive column headers:
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold">Name</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold">Company</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold">Business</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold">Email</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold">Issue or Pitch</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-emerald-800 text-emerald-300 font-bold">Email Sent ("NO")</span>
                </div>
              </div>

              {/* Step-by-step Import Guide */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold text-white">How to import into n8n:</h4>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400 leading-relaxed">
                  <li>Click <strong>"Download .json"</strong> above or copy the workflow JSON.</li>
                  <li>Open your n8n workspace, navigate to <strong>Workflows &rarr; Add Workflow</strong>.</li>
                  <li>Click the top-right menu (three dots) &rarr; select <strong>"Import from File"</strong> (or press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">Ctrl+V</kbd>).</li>
                  <li>Configure your Google Sheets and Gmail credentials on the respective nodes.</li>
                  <li>Activate the workflow to start automated cold outreach on new leads!</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Pre-configured n8n workflow ready to import directly into your instance:</span>
                <span className="font-mono text-purple-400">10 nodes &bull; Valid n8n v2 format</span>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-purple-300 font-mono text-[11px] max-h-[500px] overflow-y-auto leading-relaxed">
                {jsonString}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

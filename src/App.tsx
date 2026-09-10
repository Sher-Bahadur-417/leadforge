import React, { useState, useEffect, useRef } from 'react';
import { 
  LeadRecord, 
  SearchConfig, 
  BatchCheckpoint, 
  ExecutionReport, 
  ActivityLogEntry 
} from './types/lead';
import { LeadForgeHeader } from './components/LeadForgeHeader';
import { LeadSearchForm } from './components/LeadSearchForm';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SimpleResultsTable } from './components/SimpleResultsTable';
import { SimpleSheetModal } from './components/SimpleSheetModal';
import { TerminalLog } from './components/TerminalLog';
import { LeadDetailModal } from './components/LeadDetailModal';
import { N8nWorkflowModal } from './components/N8nWorkflowModal';
import { JsonReportModal } from './components/JsonReportModal';
import { isDuplicateLead, normalizeDomain } from './services/duplicateDetection';
import { extractSpreadsheetId, leadToRowValues, parseSheetRowsToLeads, SHEET_COLUMNS } from './services/googleSheetsClient';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_CONFIG: SearchConfig = {
  niche: 'Cafes',
  country: 'Pakistan',
  city: 'Lahore',
  keywords: 'cafe, coffee shop, specialty roaster, espresso bar',
  target_leads: 50,
  minimum_lead_score: 60,
  batch_size: 25,
  selected_sources: [
    'Google Search',
    'Google Maps / Business Listings',
    'Business Websites',
    'Public Business Directories',
  ],
  google_sheet_id: '',
  google_sheet_tab: 'Sheet1',
  google_access_token: '',
  n8n_webhook_url: '',
};

const INITIAL_REPORT: ExecutionReport = {
  status: 'idle',
  target: 50,
  processed: 0,
  added: 0,
  duplicates: 0,
  invalid: 0,
  failed: 0,
  avgScore: 0,
  withEmailCount: 0,
  withWebsiteCount: 0,
  withAutomationOpportunityCount: 0,
  batchesCompleted: 0,
};

const INITIAL_CHECKPOINT: BatchCheckpoint = {
  batchIndex: 0,
  totalBatches: 2,
  leadsInBatch: 0,
  cumulativeAdded: 0,
  timestamp: '',
  status: 'idle',
};

export default function App() {
  const [config, setConfig] = useState<SearchConfig>(() => {
    const saved = localStorage.getItem('ai_lead_finder_config');
    if (saved) {
      try { return { ...DEFAULT_CONFIG, ...JSON.parse(saved) }; } catch { }
    }
    return DEFAULT_CONFIG;
  });

  const [leads, setLeads] = useState<LeadRecord[]>(() => {
    const saved = localStorage.getItem('ai_lead_finder_leads');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return [];
  });

  const [report, setReport] = useState<ExecutionReport>(() => {
    const saved = localStorage.getItem('ai_lead_finder_report');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return INITIAL_REPORT;
  });

  const [checkpoint, setCheckpoint] = useState<BatchCheckpoint>(() => {
    const saved = localStorage.getItem('ai_lead_finder_checkpoint');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return INITIAL_CHECKPOINT;
  });

  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Modals
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [isN8nModalOpen, setIsN8nModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [showTerminalLog, setShowTerminalLog] = useState(false);

  // Integrations state
  const [sheetConnecting, setSheetConnecting] = useState(false);
  const [sheetConnected, setSheetConnected] = useState(false);
  const [sheetExistingLeads, setSheetExistingLeads] = useState<Partial<LeadRecord>[]>([]);
  const [sheetMessage, setSheetMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const [n8nTesting, setN8nTesting] = useState(false);
  const [n8nConnected, setN8nConnected] = useState(false);
  const [n8nMessage, setN8nMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // References to handle async loops & cancellation
  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);
  const leadsRef = useRef(leads);
  const reportRef = useRef(report);

  useEffect(() => { leadsRef.current = leads; }, [leads]);
  useEffect(() => { reportRef.current = report; }, [report]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('ai_lead_finder_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('ai_lead_finder_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('ai_lead_finder_report', JSON.stringify(report));
  }, [report]);

  useEffect(() => {
    localStorage.setItem('ai_lead_finder_checkpoint', JSON.stringify(checkpoint));
  }, [checkpoint]);

  const addLog = (level: ActivityLogEntry['level'], message: string, details?: string) => {
    const newEntry: ActivityLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      details,
    };
    setLogs((prev) => [...prev.slice(-300), newEntry]);
  };

  const handleConfigChange = (updated: Partial<SearchConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  // 1. Google Sheets Connection Tester & Row Fetcher
  const handleTestSheetConnection = async () => {
    const rawId = config.google_sheet_id;
    if (!rawId) {
      setSheetMessage({ type: 'error', text: 'Please enter a Google Spreadsheet URL or Sheet ID.' });
      return;
    }
    const cleanId = extractSpreadsheetId(rawId);
    setSheetConnecting(true);
    setSheetMessage(null);
    addLog('info', `Connecting to Google Sheet ID: ${cleanId}...`);

    try {
      const res = await fetch('/api/sheets/fetch-rows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: cleanId,
          accessToken: config.google_access_token?.trim() || undefined,
          range: `${config.google_sheet_tab || 'Sheet1'}!A1:Q1000`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to read Google Sheet.');
      }

      const parsed = parseSheetRowsToLeads(data.values || []);
      setSheetExistingLeads(parsed);
      setSheetConnected(true);
      setSheetMessage({
        type: 'success',
        text: `Connected! Found ${parsed.length} existing rows in sheet. Added to duplicate prevention index.`,
      });
      addLog('success', `Google Sheet synced: ${parsed.length} existing business records cached for deduplication.`);
    } catch (err: any) {
      setSheetConnected(false);
      setSheetMessage({
        type: 'error',
        text: `Sheet Connection Error: ${err.message}. Ensure sheet has public read/write or provide OAuth token.`,
      });
      addLog('error', `Google Sheet connection failed`, err.message);
    } finally {
      setSheetConnecting(false);
    }
  };

  // 2. n8n Webhook Test
  const handleTestN8nWebhook = async () => {
    if (!config.n8n_webhook_url) {
      setN8nMessage({ type: 'error', text: 'Please enter an n8n webhook URL.' });
      return;
    }
    setN8nTesting(true);
    setN8nMessage(null);
    addLog('info', `Sending test handshake to n8n webhook...`);

    try {
      const res = await fetch('/api/n8n/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: config.n8n_webhook_url,
          metadata: { test: true, environment: 'lead-finder' },
          leads: [
            {
              Name: 'Test Contact',
              Company: 'Test Automation Co',
              Business: 'Test Automation Co',
              Email: 'test@automation.example',
              'Issue or Pitch': 'Manual inquiries and booking requests may require automation.',
              'Email Sent': 'NO',
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Webhook responded with status ${data.statusCode}`);
      }

      setN8nConnected(true);
      setN8nMessage({
        type: 'success',
        text: `n8n Webhook acknowledged successfully (HTTP ${data.statusCode})!`,
      });
      addLog('success', `n8n webhook test confirmed. Ready for real-time lead feeds.`);
    } catch (err: any) {
      setN8nConnected(false);
      setN8nMessage({
        type: 'error',
        text: `n8n Webhook Error: ${err.message}`,
      });
      addLog('error', `n8n webhook dispatch error`, err.message);
    } finally {
      setN8nTesting(false);
    }
  };

  // 3. Main Discovery & Batch Qualification Engine
  const startDiscoveryRun = async () => {
    if (!config.niche || !config.country || !config.city) {
      addLog('error', 'Niche, Country, and City are required before starting.');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    isRunningRef.current = true;
    isPausedRef.current = false;

    // Reset report if starting fresh
    let currentAdded = leadsRef.current.length;
    const target = config.target_leads;

    addLog('info', `Initiating Discovery Run: Target ${target} leads for "${config.niche}" in ${config.city}, ${config.country}.`);
    addLog('info', `Multi-source grounding active: ${config.selected_sources.join(', ')}.`);

    setReport((prev) => ({
      ...prev,
      status: 'running',
      target: config.target_leads,
    }));

    let batchNum = checkpoint.batchIndex > 0 ? checkpoint.batchIndex : 1;

    while (isRunningRef.current && currentAdded < target) {
      // Check pause
      if (isPausedRef.current) {
        addLog('warn', `Discovery paused at batch #${batchNum}. Checkpoint saved.`);
        setIsRunning(false);
        setIsPaused(true);
        setReport((prev) => ({ ...prev, status: 'paused' }));
        return;
      }

      const remainingNeeded = target - currentAdded;
      const currentBatchSize = Math.min(config.batch_size, remainingNeeded);

      addLog('info', `Processing Batch #${batchNum}: Requesting ${currentBatchSize} verified businesses via Google Search Grounding...`);

      // Gather current known entities to prevent duplicate retrieval
      const existingBusinesses = [
        ...leadsRef.current.map((l) => l.Business),
        ...sheetExistingLeads.map((s) => s.Business || '').filter(Boolean),
      ];
      const existingDomains = [
        ...leadsRef.current.map((l) => l.Website),
        ...sheetExistingLeads.map((s) => s.Website || '').filter(Boolean),
      ];
      const existingEmails = [
        ...leadsRef.current.map((l) => l.Email),
        ...sheetExistingLeads.map((s) => s.Email || '').filter(Boolean),
      ];

      try {
        const response = await fetch('/api/leads/search-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            niche: config.niche,
            country: config.country,
            city: config.city,
            keywords: config.keywords,
            batchSize: currentBatchSize,
            minimumLeadScore: config.minimum_lead_score,
            selectedSources: config.selected_sources,
            existingBusinesses,
            existingDomains,
            existingEmails,
            batchOffset: currentAdded,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Batch request returned HTTP ${response.status}`);
        }

        const data = await response.json();
        const batchLeads: LeadRecord[] = data.leads || [];
        const rawFound = data.stats?.rawDiscovered || batchLeads.length;
        const dupCount = data.stats?.duplicatesRemoved || 0;
        const invCount = data.stats?.invalidRemoved || 0;

        addLog('info', `Batch #${batchNum} raw results: Discovered ${rawFound} listings, filtered ${dupCount} duplicates, ${invCount} invalid.`);

        // Client-side second pass deduplication against all accumulated leads
        const newlyQualifiedLeads: LeadRecord[] = [];
        for (const lead of batchLeads) {
          const dupCheck = isDuplicateLead(lead, leadsRef.current);
          if (dupCheck.isDup) {
            addLog('warn', `Deduplication: Dropped "${lead.Business}" - ${dupCheck.reason}`);
            setReport((r) => ({ ...r, duplicates: r.duplicates + 1 }));
            continue;
          }
          newlyQualifiedLeads.push(lead);
        }

        if (newlyQualifiedLeads.length > 0) {
          // If Google Sheet connected, auto-append this batch
          if (config.google_sheet_id && sheetConnected) {
            try {
              const cleanId = extractSpreadsheetId(config.google_sheet_id);
              const rowValues = newlyQualifiedLeads.map((l) => leadToRowValues(l));
              const appendRes = await fetch('/api/sheets/append-rows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  spreadsheetId: cleanId,
                  accessToken: config.google_access_token?.trim() || undefined,
                  range: `${config.google_sheet_tab || 'Sheet1'}!A1`,
                  rows: rowValues,
                }),
              });
              if (appendRes.ok) {
                newlyQualifiedLeads.forEach((l) => (l['Processing Status'] = 'Synced to Sheets'));
                addLog('success', `Appended ${newlyQualifiedLeads.length} rows directly to Google Sheet with Email Sent = "NO".`);
              }
            } catch (sheetErr: any) {
              addLog('error', `Google Sheets append error in batch #${batchNum}`, sheetErr.message);
            }
          }

          // If n8n Webhook connected, auto-dispatch this batch
          if (config.n8n_webhook_url && n8nConnected) {
            try {
              await fetch('/api/n8n/dispatch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  webhookUrl: config.n8n_webhook_url,
                  metadata: { batch: batchNum, niche: config.niche, city: config.city },
                  leads: newlyQualifiedLeads,
                }),
              });
              addLog('success', `Dispatched batch #${batchNum} (${newlyQualifiedLeads.length} leads) to n8n intake webhook.`);
            } catch (n8nErr: any) {
              addLog('error', `n8n webhook dispatch error in batch #${batchNum}`, n8nErr.message);
            }
          }

          // Append to state
          const updatedAllLeads = [...leadsRef.current, ...newlyQualifiedLeads];
          setLeads(updatedAllLeads);
          currentAdded = updatedAllLeads.length;

          // Re-calculate live analytics
          const totalScore = updatedAllLeads.reduce((acc, l) => acc + l['Lead Score'], 0);
          const withEmail = updatedAllLeads.filter((l) => Boolean(l.Email)).length;
          const withWebsite = updatedAllLeads.filter((l) => Boolean(l.Website)).length;
          const withPitch = updatedAllLeads.filter((l) => Boolean(l['Issue or Pitch'])).length;

          setReport((prev) => ({
            ...prev,
            processed: prev.processed + rawFound,
            added: updatedAllLeads.length,
            duplicates: prev.duplicates + dupCount,
            invalid: prev.invalid + invCount,
            avgScore: Math.round(totalScore / updatedAllLeads.length),
            withEmailCount: withEmail,
            withWebsiteCount: withWebsite,
            withAutomationOpportunityCount: withPitch,
            batchesCompleted: batchNum,
          }));

          // Update Checkpoint
          const newCheckpoint: BatchCheckpoint = {
            batchIndex: batchNum,
            totalBatches: Math.ceil(target / config.batch_size),
            leadsInBatch: newlyQualifiedLeads.length,
            cumulativeAdded: currentAdded,
            timestamp: new Date().toLocaleTimeString(),
            status: 'running',
          };
          setCheckpoint(newCheckpoint);

          addLog(
            'success',
            `Batch #${batchNum} completed! Added ${newlyQualifiedLeads.length} verified leads (${currentAdded}/${target} total).`
          );
        } else {
          addLog('warn', `Batch #${batchNum} returned 0 new unique leads. Advancing search vectors.`);
        }

        batchNum++;

        // If not finished, wait 1.2 seconds before the next batch to respect rate limits
        if (currentAdded < target && isRunningRef.current && !isPausedRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      } catch (err: any) {
        addLog('error', `Batch #${batchNum} failed`, err.message);
        setReport((prev) => ({ ...prev, failed: prev.failed + 1 }));
        
        // Resilience: continue to next batch or pause
        addLog('warn', `Checkpoint preserved. Pausing engine to prevent cascading errors.`);
        setIsRunning(false);
        setIsPaused(true);
        isRunningRef.current = false;
        return;
      }
    }

    // Run finished
    setIsRunning(false);
    isRunningRef.current = false;
    setReport((prev) => ({ ...prev, status: 'completed' }));
    setCheckpoint((prev) => ({ ...prev, status: 'completed' }));
    addLog(
      'success',
      `Discovery Run Completed! Successfully verified and qualified ${currentAdded} real businesses for n8n cold outreach.`
    );
  };

  const handlePause = () => {
    isPausedRef.current = true;
    setIsPaused(true);
    addLog('info', 'Pausing discovery engine at next checkpoint boundary...');
  };

  const handleResume = () => {
    isPausedRef.current = false;
    setIsPaused(false);
    setIsRunning(true);
    isRunningRef.current = true;
    startDiscoveryRun();
  };

  const handleStop = () => {
    isRunningRef.current = false;
    isPausedRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    setReport((prev) => ({ ...prev, status: 'idle' }));
    addLog('warn', 'Discovery run stopped by user. Current validated leads remain safely preserved.');
  };

  const handleReset = () => {
    if (isRunning) return;
    setLeads([]);
    setReport(INITIAL_REPORT);
    setCheckpoint(INITIAL_CHECKPOINT);
    setLogs([]);
    localStorage.removeItem('ai_lead_finder_leads');
    localStorage.removeItem('ai_lead_finder_report');
    localStorage.removeItem('ai_lead_finder_checkpoint');
    addLog('info', 'System reset: Cleaned lead cache and performance metrics.');
  };

  // 4. CSV Exporter
  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headerRow = SHEET_COLUMNS.join(',');
    const dataRows = leads.map((lead) => {
      return SHEET_COLUMNS.map((col) => {
        const val = lead[col];
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(',');
    });

    const csvContent = [headerRow, ...dataRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `n8n-leads-${config.niche.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addLog('success', `Exported ${leads.length} validated leads as CSV.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. Logo + LeadForge + Tagline Header */}
      <LeadForgeHeader
        leadsCount={leads.length}
        sheetConnected={sheetConnected}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onOpenN8nModal={() => setIsN8nModalOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 2. Lead Search Form (Only important fields: Niche, Location, Keywords, 10/50/100/500/1000, Start button) */}
        <LeadSearchForm
          config={config}
          onChange={handleConfigChange}
          isRunning={isRunning}
          isPaused={isPaused}
          onStart={startDiscoveryRun}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          sheetConnected={sheetConnected}
          onOpenSheetModal={() => setIsSheetModalOpen(true)}
        />

        {/* 3. Progress Section (Leads found, Valid leads, Duplicates removed, Leads added, Progress bar, Current batch) */}
        {(isRunning || isPaused || report.processed > 0 || leads.length > 0) && (
          <ProgressDashboard
            report={report}
            checkpoint={checkpoint}
            targetLeads={config.target_leads}
            isRunning={isRunning}
            isPaused={isPaused}
            onReset={handleReset}
          />
        )}

        {/* 4. Results: Simple Table (Business | Email | Website | Location | Problem | Score | Status + Search/filter, Export, Sheet sync) */}
        <SimpleResultsTable
          leads={leads}
          sheetConnected={sheetConnected}
          onOpenSheetModal={() => setIsSheetModalOpen(true)}
          onExportCsv={handleExportCsv}
          onSelectLead={(lead) => setSelectedLead(lead)}
        />

        {/* Optional Collapsible AI Activity Feed */}
        <div className="border border-slate-800/80 rounded-2xl bg-slate-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowTerminalLog(!showTerminalLog)}
            className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live AI Verification Activity ({logs.length} events logged)</span>
            </span>
            {showTerminalLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTerminalLog && (
            <div className="border-t border-slate-800 p-4">
              <TerminalLog logs={logs} onClear={() => setLogs([])} />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <SimpleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        sheetId={config.google_sheet_id}
        sheetTab={config.google_sheet_tab}
        onSave={(sheetId, sheetTab) => handleConfigChange({ google_sheet_id: sheetId, google_sheet_tab: sheetTab })}
        onTestConnection={handleTestSheetConnection}
        sheetConnected={sheetConnected}
        sheetConnecting={sheetConnecting}
        sheetMessage={sheetMessage}
      />

      <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      
      <N8nWorkflowModal
        isOpen={isN8nModalOpen}
        onClose={() => setIsN8nModalOpen(false)}
        sheetId={config.google_sheet_id}
        sheetTab={config.google_sheet_tab}
      />

      <JsonReportModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        report={report}
        leads={leads}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span className="font-semibold text-slate-400">LeadForge</span>
        <span className="hidden sm:inline">&bull;</span>
        <span>Find leads. Qualify. Automate.</span>
        <span className="hidden sm:inline">&bull;</span>
        <span>Strict Zero-Hallucination Verified Data</span>
      </footer>
    </div>
  );
}

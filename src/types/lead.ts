export interface LeadRecord {
  Name: string;
  Company: string;
  Business: string;
  Email: string;
  Phone: string;
  City: string;
  Country: string;
  'Contact Person': string;
  Industry: string;
  'Issue or Pitch': string;
  Website: string;
  'Source URL': string;
  'Lead Score': number;
  'Lead Status': 'New' | 'Qualified' | 'Pending Review' | 'Rejected';
  'Date Found': string;
  'Processing Status': 'Validated' | 'Duplicate Removed' | 'Invalid Dropped' | 'Synced to Sheets' | 'Dispatched to n8n';
  'Email Sent': 'NO' | 'YES';
  _details?: {
    problem: string;
    pitch: string;
    verificationEvidence: string;
  };
}

export interface SearchConfig {
  niche: string;
  country: string;
  city: string;
  keywords: string;
  target_leads: number;
  minimum_lead_score: number;
  batch_size: number;
  selected_sources: string[];
  google_sheet_id?: string;
  google_sheet_tab?: string;
  google_access_token?: string;
  n8n_webhook_url?: string;
}

export interface BatchCheckpoint {
  batchIndex: number;
  totalBatches: number;
  leadsInBatch: number;
  cumulativeAdded: number;
  timestamp: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  lastError?: string;
}

export interface ExecutionReport {
  status: 'idle' | 'running' | 'completed' | 'paused' | 'failed';
  target: number;
  processed: number;
  added: number;
  duplicates: number;
  invalid: number;
  failed: number;
  avgScore: number;
  withEmailCount: number;
  withWebsiteCount: number;
  withAutomationOpportunityCount: number;
  batchesCompleted: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  details?: string;
}

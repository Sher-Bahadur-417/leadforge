import { LeadRecord } from '../types/lead';

export const SHEET_COLUMNS: (keyof LeadRecord)[] = [
  'Name',
  'Company',
  'Business',
  'Email',
  'Phone',
  'City',
  'Country',
  'Contact Person',
  'Industry',
  'Issue or Pitch',
  'Website',
  'Source URL',
  'Lead Score',
  'Lead Status',
  'Date Found',
  'Processing Status',
  'Email Sent',
];

/**
 * Extracts Google Spreadsheet ID from a standard URL or raw ID
 */
export function extractSpreadsheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Converts a LeadRecord into an array of values matching the header column sequence.
 */
export function leadToRowValues(lead: LeadRecord): (string | number)[] {
  return SHEET_COLUMNS.map((col) => {
    const val = lead[col];
    if (val === undefined || val === null) return '';
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return val;
    return String(val);
  });
}

/**
 * Parses raw 2D array of rows from Google Sheets into lightweight records for deduplication.
 */
export function parseSheetRowsToLeads(values: (string | number)[][]): Partial<LeadRecord>[] {
  if (!values || values.length <= 1) return [];

  const headers = values[0].map((h) => String(h).trim().toLowerCase());
  const rows = values.slice(1);

  const colIndex = {
    name: headers.indexOf('name'),
    business: headers.indexOf('business') !== -1 ? headers.indexOf('business') : headers.indexOf('company'),
    email: headers.indexOf('email'),
    website: headers.indexOf('website'),
    city: headers.indexOf('city'),
    country: headers.indexOf('country'),
  };

  return rows.map((row) => {
    return {
      Name: colIndex.name !== -1 ? String(row[colIndex.name] || '') : '',
      Business: colIndex.business !== -1 ? String(row[colIndex.business] || '') : '',
      Email: colIndex.email !== -1 ? String(row[colIndex.email] || '').trim().toLowerCase() : '',
      Website: colIndex.website !== -1 ? String(row[colIndex.website] || '') : '',
      City: colIndex.city !== -1 ? String(row[colIndex.city] || '') : '',
      Country: colIndex.country !== -1 ? String(row[colIndex.country] || '') : '',
    };
  });
}

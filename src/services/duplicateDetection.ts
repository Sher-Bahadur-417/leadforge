import { LeadRecord } from '../types/lead';

/**
 * Normalizes domain by removing protocol, www, subpaths, and query strings.
 */
export function normalizeDomain(urlStr: string): string {
  if (!urlStr) return '';
  try {
    let clean = urlStr.trim().toLowerCase();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const parsed = new URL(clean);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return urlStr
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .split('?')[0]
      .toLowerCase()
      .trim();
  }
}

/**
 * Normalizes business names by removing company types, punctuation, and extra whitespace.
 */
export function normalizeBusinessName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(inc|incorporated|llc|ltd|limited|corp|corporation|co|company|pvt|gmbh|sa|bv|holdings|group)\b/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Levenshtein distance for fuzzy matching business names.
 */
export function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  if (!a.length || !b.length) return 0.0;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  const distance = matrix[b.length][a.length];
  const maxLength = Math.max(a.length, b.length);
  return 1.0 - distance / maxLength;
}

/**
 * Checks whether a candidate lead is a duplicate of any existing lead.
 */
export function isDuplicateLead(
  candidate: LeadRecord,
  existingLeads: LeadRecord[],
  fuzzyThreshold = 0.85
): { isDup: boolean; reason?: string } {
  const candEmail = candidate.Email.trim().toLowerCase();
  const candDomain = normalizeDomain(candidate.Website);
  const candNormName = normalizeBusinessName(candidate.Business);
  const candCity = (candidate.City || '').trim().toLowerCase();

  for (const existing of existingLeads) {
    // 1. Same normalized email
    const existEmail = existing.Email.trim().toLowerCase();
    if (candEmail && existEmail && candEmail === existEmail) {
      return { isDup: true, reason: `Matches existing email (${candEmail})` };
    }

    // 2. Same normalized website domain
    const existDomain = normalizeDomain(existing.Website);
    if (candDomain && existDomain && candDomain === existDomain) {
      return { isDup: true, reason: `Matches existing domain (${candDomain})` };
    }

    // 3. Same business name + same location (exact or high fuzzy match)
    const existNormName = normalizeBusinessName(existing.Business);
    const existCity = (existing.City || '').trim().toLowerCase();

    const isSameLocation = !candCity || !existCity || candCity === existCity;

    if (isSameLocation) {
      if (candNormName && existNormName && candNormName === existNormName) {
        return { isDup: true, reason: `Matches exact business name in ${candidate.City}` };
      }

      if (candNormName.length > 5 && existNormName.length > 5) {
        const similarity = levenshteinSimilarity(candNormName, existNormName);
        if (similarity >= fuzzyThreshold) {
          return {
            isDup: true,
            reason: `Fuzzy matches "${existing.Business}" (${Math.round(similarity * 100)}% match)`,
          };
        }
      }
    }
  }

  return { isDup: false };
}

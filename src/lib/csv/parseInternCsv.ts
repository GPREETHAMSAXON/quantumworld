export interface ParsedInternRow {
  fullName: string;
  email: string;
}

export interface ParseInternCsvResult {
  rows: ParsedInternRow[];
  skipped: number;
}

function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields.map((f) => f.trim());
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Parses a "name,email" CSV (with or without a header row). Rows missing a
 * name or a valid email are dropped and counted in `skipped` rather than
 * failing the whole import.
 */
export function parseInternCsv(text: string): ParseInternCsvResult {
  const lines = text
    .split(/\r\n|\n|\r/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return { rows: [], skipped: 0 };

  let startIndex = 0;
  const firstFields = splitCsvLine(lines[0]).map((f) => f.toLowerCase());
  if (firstFields.includes('name') || firstFields.includes('full_name') || firstFields.includes('email')) {
    startIndex = 1;
  }

  const rows: ParsedInternRow[] = [];
  let skipped = 0;

  for (let i = startIndex; i < lines.length; i++) {
    const fields = splitCsvLine(lines[i]);
    const [name, email] = fields;
    if (!name?.trim() || !email?.trim() || !EMAIL_RE.test(email.trim())) {
      skipped++;
      continue;
    }
    rows.push({ fullName: name.trim(), email: email.trim().toLowerCase() });
  }

  return { rows, skipped };
}

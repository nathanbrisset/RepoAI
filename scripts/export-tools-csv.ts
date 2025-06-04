import { tools } from '../lib/data.tsx';
import fs from 'fs';
import path from 'path';

function escapeCSV(value: string) {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

const headers = [
  'name',
  'id',
  'description',
  'url',
  'categories',
  'subcategory',
  'tags',
  'rating',
  'visits',
  'dateAdded',
  'isPremium',
];

const rows = [headers.join(',')];

for (const tool of tools) {
  rows.push([
    escapeCSV(tool.name),
    escapeCSV(tool.id),
    escapeCSV(tool.description),
    escapeCSV(tool.url),
    escapeCSV((tool.categories || []).join('; ')),
    escapeCSV(tool.subcategory || ''),
    escapeCSV((tool.tags || []).join('; ')),
    escapeCSV(tool.rating !== undefined ? String(tool.rating) : ''),
    escapeCSV(tool.visits !== undefined ? String(tool.visits) : ''),
    escapeCSV(tool.dateAdded || ''),
    escapeCSV(tool.isPremium !== undefined ? String(tool.isPremium) : ''),
  ].join(','));
}

const outputPath = path.join(process.cwd(), 'tools-list.csv');
fs.writeFileSync(outputPath, rows.join('\n'));

console.log(`Exported ${tools.length} tools to tools-list.csv`); 
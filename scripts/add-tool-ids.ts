import fs from 'fs';

// Slugify function to create URL-friendly IDs from tool names
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const input = fs.readFileSync('lib/data.tsx', 'utf-8');

// Split on tool objects (naive, but matches your format)
const toolRegex = /\{[^\{\}]*name: "([^"]+)"[\s\S]*?\}/g;
let match;
let lastIndex = 0;
let output = '';

while ((match = toolRegex.exec(input)) !== null) {
  const toolBlock = match[0];
  const name = match[1];
  const id = slugify(name);
  // If id already exists, skip
  if (/id:/.test(toolBlock)) {
    output += input.slice(lastIndex, toolRegex.lastIndex);
    lastIndex = toolRegex.lastIndex;
    continue;
  }
  // Insert id after the opening {
  const updatedBlock = toolBlock.replace(/\{/, `{
  id: "${id}",`);
  output += input.slice(lastIndex, match.index) + updatedBlock;
  lastIndex = toolRegex.lastIndex;
}
output += input.slice(lastIndex);

fs.writeFileSync('lib/data.with-ids.tsx', output);
console.log('Added id fields to all tools. See lib/data.with-ids.tsx'); 
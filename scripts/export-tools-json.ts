import { mockTools } from '../lib/data.tsx';
import fs from 'fs';
import path from 'path';

// Remove any non-serializable fields (like icon components)
const serializableTools = mockTools.map(({ ...tool }) => {
  // Remove any fields that are functions or React elements if present
  // (in your current data, mockTools should be serializable)
  return tool;
});

const outputPath = path.join(process.cwd(), 'tools.json');
fs.writeFileSync(outputPath, JSON.stringify(serializableTools, null, 2));
console.log('Exported tools to tools.json'); 
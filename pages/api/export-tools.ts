import type { NextApiRequest, NextApiResponse } from 'next';
import { mockTools } from '../../lib/data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Remove any non-serializable fields if needed (your mockTools should be serializable)
  const serializableTools = mockTools.map(tool => {
    // Optionally remove or transform fields here
    return tool;
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=tools.json');
  res.status(200).json(serializableTools);
} 
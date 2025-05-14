const fs = require('fs');

// Read both files
const originalData = fs.readFileSync('/Users/nathanbrisset/RepoAI/data.tsx', 'utf8');
const newData = fs.readFileSync('/Users/nathanbrisset/Desktop/data_final_no_duplicate_urls.tsx', 'utf8');

// Function to extract tools array from content
function extractTools(content) {
    const tools = [];
    let currentTool = null;
    
    content.split('\n').forEach(line => {
        if (line.includes('{')) {
            currentTool = {};
        } else if (line.includes('},')) {
            if (currentTool && Object.keys(currentTool).length > 0) {
                tools.push({...currentTool});
            }
            currentTool = null;
        } else if (currentTool !== null) {
            const match = line.match(/^\s*(\w+):\s*['"]?(.*?)['"]?,?\s*$/);
            if (match) {
                const [_, key, value] = match;
                if (value.startsWith('[')) {
                    try {
                        currentTool[key] = JSON.parse(value.replace(/'/g, '"'));
                    } catch {
                        currentTool[key] = value;
                    }
                } else {
                    currentTool[key] = value.replace(/^['"]|['"]$/g, '');
                }
            }
        }
    });
    
    return tools.filter(tool => tool.name && tool.url); // Only keep tools with name and url
}

// Extract tools from both files
const originalTools = extractTools(originalData);
const newTools = extractTools(newData);

console.log(`Found ${originalTools.length} tools in original file`);
console.log(`Found ${newTools.length} tools in new file`);

// Combine tools, preferring new data when URLs match
const urlMap = new Map();
originalTools.forEach(tool => urlMap.set(tool.url, tool));
newTools.forEach(tool => urlMap.set(tool.url, tool));

// Convert back to array and sort by dateAdded
const mergedTools = Array.from(urlMap.values())
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

console.log(`Combined into ${mergedTools.length} unique tools`);

// Create the new file content
const newFileContent = `import React from 'react';
import {
  Code,
  ImageIcon,
  MessageSquare,
  Mic,
  PenTool,
  Briefcase,
  Brain,
  Video,
  LineChart,
  Database,
  BarChart,
} from "lucide-react"
import type { Tool, Category } from "./types"

// Categories with icons
export const categories: Category[] = [
  {
    name: "Text Generation",
    description: "AI tools for generating text content, including copywriting, content creation, and text completion.",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    name: "Image Generation",
    description: "Create images, art, and designs using AI-powered tools.",
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    name: "Coding",
    description: "AI assistants and tools to help with programming, code generation, and debugging.",
    icon: <Code className="h-4 w-4" />,
  },
  {
    name: "Audio & Speech",
    description: "Tools for voice synthesis, transcription, and audio processing.",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    name: "Design",
    description: "AI-powered design tools for UI/UX, graphic design, and creative work.",
    icon: <PenTool className="h-4 w-4" />,
  },
  {
    name: "Productivity",
    description: "Tools to enhance workflow, automate tasks, and improve efficiency.",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    name: "Research",
    description: "AI tools for data analysis, research assistance, and knowledge discovery.",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    name: "Video",
    description: "Tools for video generation, editing, and enhancement using AI.",
    icon: <Video className="h-4 w-4" />,
  },
  {
    name: "Analytics",
    description: "AI-powered analytics tools for data insights and business intelligence.",
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    name: "Data Processing",
    description: "Tools for data extraction, transformation, and processing with AI.",
    icon: <Database className="h-4 w-4" />,
  },
  {
    name: "Marketing",
    description: "AI-powered tools for content creation, marketing automation, and campaign optimization.",
    icon: <BarChart className="h-4 w-4" />,
  },
]

// Combined tools data
export const tools: Tool[] = ${JSON.stringify(mergedTools, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/'/g, "'")
    .replace(/"/g, "'")};
`

// Write the merged content to a new file
fs.writeFileSync('/Users/nathanbrisset/RepoAI/data_merged.tsx', newFileContent);
console.log('Merged data written to data_merged.tsx'); 
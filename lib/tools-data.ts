import type { Tool } from "./types";

export const tools: Tool[] = [
  {
    name: "Jasper",
    description: "AI content generation platform for marketing and business writing.",
    url: "https://www.jasper.ai",
    id: "jasper",
    image: "/tool-screenshots/jasper.png",
    logo: "/logo/jasper.png",
    categories: ["marketing", "text"],
    subcategory: "content-generation",
    tags: ["AI", "content", "marketing", "writing"],
    rating: 4.5,
    visits: 5000000,
    dateAdded: "2021-06-15",
    isPremium: 'Free',
    features: [
      "Content Generation: Creates high-quality marketing copy and blog posts.",
      "Tone Customization: Adjusts writing style to match brand voice.",
      "SEO Optimization: Ensures content is optimized for search engines.",
      "Team Collaboration: Enables multiple users to work on content together.",
      "Art Generation: Creates custom images to complement written content."
    ]
  },
  // ... (repeat for all other tools, omitting any icon or JSX fields)
]; 
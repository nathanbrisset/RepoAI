import React from 'react'
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
  CheckCircle,
  Palette,
} from "lucide-react"
import type { Tool, Category } from "./types"

// Categories with icons
export const categories: Category[] = [
  {
    id: "text",
    name: "Text Generation",
    description: "AI tools for generating, editing, and enhancing text content.",
    about: "Text Generation AI tools leverage advanced language models to assist with a wide range of writing tasks, from copywriting and content creation to summarization, translation, and grammar correction. These tools help users produce high-quality written material efficiently and creatively, making them invaluable for marketers, students, researchers, and businesses alike.",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: "image",
    name: "Image Generation",
    description: "AI tools for creating, editing, and enhancing images.",
    about: "Image Generation AI tools enable users to create, manipulate, and enhance images using artificial intelligence. These platforms can generate art from text prompts, upscale photos, remove backgrounds, and apply creative effects, making visual content creation accessible to everyone, regardless of design experience.",
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    id: "audio",
    name: "Audio & Speech",
    description: "AI tools for audio processing, speech synthesis, and transcription.",
    about: "Audio & Speech AI tools leverage artificial intelligence to process, generate, and transform audio content, including speech synthesis and voice cloning. These innovative solutions are transforming how professionals and individuals approach their work in this domain, offering features like transcription, noise reduction, and voice generation for podcasts, videos, and more.",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    id: "video",
    name: "Video Creation",
    description: "AI tools for generating, editing, and enhancing video content.",
    about: "Video Creation AI tools automate and enhance the video production process. They can generate videos from scripts, add effects, create subtitles, and enable creative storytelling. These tools make video creation faster, more accessible, and more engaging for content creators, marketers, and educators.",
    icon: <Video className="h-4 w-4" />,
  },
  {
    id: "coding",
    name: "Coding",
    description: "AI-powered coding assistants and developer tools.",
    about: "AI-powered coding assistants and developer tools help with code generation, debugging, code review, and learning new programming languages. These tools boost productivity, reduce errors, and support developers of all skill levels in building, testing, and maintaining software more efficiently.",
    icon: <Code className="h-4 w-4" />,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "AI tools for marketing automation, content creation, and analytics.",
    about: "Marketing AI tools empower marketers to automate campaigns, personalize messaging, analyze data, and optimize content. These platforms help businesses reach their audience more effectively, improve ROI, and stay ahead in a competitive digital landscape.",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "AI tools for task automation, project management, and workflow optimization.",
    about: "Productivity AI tools streamline workflows, automate repetitive tasks, and enhance personal and team organization. From smart scheduling to automated note-taking, these solutions help users save time, stay organized, and focus on what matters most.",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    id: "data-processing",
    name: "Data Processing",
    description: "AI tools for data cleaning, transformation, analysis, and visualization.",
    about: "Data Processing AI tools empower users to extract insights, automate data workflows, and make data-driven decisions. These platforms support data cleaning, transformation, analysis, and visualization, making them essential for business intelligence, research, and analytics across industries.",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "design",
    name: "Design",
    description: "AI-powered design tools for graphic design, UI/UX, and branding.",
    about: "Design AI tools assist designers in creating stunning visuals, layouts, and prototypes quickly and efficiently. They offer features like automated layout suggestions, asset generation, and branding support, making high-quality design accessible to everyone.",
    icon: <Palette className="h-4 w-4" />,
  }
]

// Combined tools data
export const mockTools: Tool[] = [
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
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Register on Jasper and access the content dashboard.",
        links: [{ label: "Jasper", url: "https://www.jasper.ai" }]
      },
      {
        title: "Select Content Type",
        description: "Choose blog, ad copy, image, or business writing."
      },
      {
        title: "Provide Details & Prompts",
        description: "Input your topic, brand voice, and any special requirements."
      },
      {
        title: "Generate, Edit & Export",
        description: "Review content, refine as needed, and export for marketing or business use."
      }
    ]
  },
  {
    name: "Conversion.ai",
    description: "AI marketing & sales copy generation platform.",
    url: "https://www.conversion.ai",
    id: "conversion-ai",
    image: "/tool-screenshots/conversion-ai.png",
    logo: "/logo/conversion-ai.png",
    categories: ["marketing"],
    subcategory: "sales-copy",
    tags: ["AI", "marketing", "sales"],
    rating: 4.6,
    visits: 600000,
    dateAdded: "2021-10-15",
    isPremium: 'Free',
    features: [
      "AI Enrichment: Enhances lead data with AI for better personalization.",
      "Magic Segmentation: Automatically segments leads based on behavior.",
      "Real-Time Triggers: Initiates actions based on real-time user behavior.",
      "Content Generation: Generates brand-consistent and personalized content efficiently."
    ],
    howToUse: [
      {
        title: "Log In & Access Dashboard",
        description: "Create an account and open the Conversion.ai dashboard.",
        links: [{ label: "Conversion.ai", url: "https://www.conversion.ai" }]
      },
      {
        title: "Choose Campaign or Copy Type",
        description: "Select what type of marketing or sales copy you need."
      },
      {
        title: "Input Brand & Audience Info",
        description: "Enter relevant details about your product and target audience."
      },
      {
        title: "Generate & Refine Copy",
        description: "Use AI to produce, review, and personalize your marketing messages."
      }
    ]
  },
  {
    name: "CopySmith",
    description: "AI content generation for marketing platform.",
    url: "https://copysmith.ai",
    id: "copysmith",
    image: "/tool-screenshots/copysmith.png",
    logo: "/logo/copysmith.png",
    categories: ["marketing"],
    subcategory: "content-generation",
    tags: ["AI", "content", "marketing"],
    rating: 4.3,
    visits: 400000,
    dateAdded: "2021-12-15",
    isPremium: 'Free',
    features: [
      "Bulk Content Generation: Produces product descriptions and other content at scale.",
      "Centralized Content Management: Manages product content from a single platform.",
      "Collaborative Editing: Enables real-time team collaboration on content.",
      "SEO Optimization: Ensures content is optimized for search engines."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Copysmith",
        description: "Register and log in to Copysmith.",
        links: [{ label: "CopySmith", url: "https://copysmith.ai" }]
      },
      {
        title: "Choose Content Type",
        description: "Select product descriptions, ads, or other content formats."
      },
      {
        title: "Provide Product Info",
        description: "Enter details about your products and any SEO keywords."
      },
      {
        title: "Generate & Collaborate",
        description: "Review generated content and collaborate with your team."
      }
    ]
  },
  {
    name: "Copyscape",
    description: "AI-powered plagiarism detection & content validation platform.",
    url: "https://www.copyscape.com",
    id: "copyscape",
    image: "/tool-screenshots/copyscape.png",
    logo: "/logo/copyscape.png",
    categories: ["marketing"],
    subcategory: "content-validation",
    tags: ["AI", "plagiarism", "content"],
    rating: 4.4,
    visits: 350000,
    dateAdded: "2022-01-15",
    isPremium: 'Free',
    features: [
      "Plagiarism Detection: Scans the web to detect duplicate content.",
      "Premium Services: Offers advanced features like batch search and private index.",
      "API Integration: Allows integration with other platforms for automated checks.",
      "User-Friendly Interface: Simple process to check content originality."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Copyscape",
        description: "Register and log in to Copyscape.",
        links: [{ label: "Copyscape", url: "https://www.copyscape.com" }]
      },
      {
        title: "Submit Content for Check",
        description: "Paste or upload your content to scan for originality."
      },
      {
        title: "Review Results",
        description: "View flagged matches and plagiarism reports."
      },
      {
        title: "Use API for Automation",
        description: "Integrate Copyscape with your content platform via API (optional)."
      }
    ]
  },
  {
    name: "Grammarly",
    description: "AI-powered writing assistant that helps you write better by checking grammar, spelling, and style.",
    url: "https://www.grammarly.com",
    id: "grammarly",
    image: "/tool-screenshots/grammarly.png",
    logo: "/logo/grammarly.png",
    categories: ["text", "productivity"],
    subcategory: "grammar",
    tags: ["AI", "grammar", "proofreading", "editing"],
    rating: 4.7,
    visits: 12000000,
    dateAdded: "2020-09-15",
    isPremium: 'Free',
    features: [
      "Real-Time Grammar and Spelling Checks: Instantly identifies and corrects grammatical errors and typos as you type.",
      "Writing Style Improvements: Offers suggestions to improve clarity, conciseness, and tone.",
      "Plagiarism Detection: Checks content against billions of web pages to ensure originality.",
      "Tone Detection: Analyzes the tone of your writing to ensure it matches your intended message."
    ],
    howToUse: [
      {
        title: "Install & Log In",
        description: "Add Grammarly as a browser extension or use the web editor.",
        links: [{ label: "Grammarly", url: "https://www.grammarly.com" }]
      },
      {
        title: "Write or Paste Text",
        description: "Type or paste your content for real-time suggestions."
      },
      {
        title: "Review & Accept Suggestions",
        description: "Check grammar, clarity, and tone feedback, then accept or ignore changes."
      },
      {
        title: "Export or Share",
        description: "Copy, download, or share your improved writing."
      }
    ]
  },
  {
    name: "QuillBot",
    description: "AI-powered paraphrasing tool that helps you rewrite and improve your text while maintaining its meaning.",
    url: "https://quillbot.com",
    id: "quillbot",
    image: "/tool-screenshots/quillbot.png",
    logo: "/logo/quillbot.png",
    categories: ["text", "productivity"],
    subcategory: "paraphrasing",
    tags: ["AI", "paraphrasing", "rewriting", "editing"],
    rating: 4.5,
    visits: 4000000,
    dateAdded: "2021-03-20",
    isPremium: 'Free',
    features: [
      "Paraphraser: Rewrites sentences while preserving the original meaning.",
      "Grammar Checker: Detects and corrects grammatical errors in your text.",
      "Summarizer: Condenses articles, papers, or documents into key points.",
      "Citation Generator: Automatically generates citations in various styles."
    ],
    howToUse: [
      {
        title: "Go to QuillBot",
        description: "Open QuillBot in your browser.",
        links: [{ label: "QuillBot", url: "https://quillbot.com" }]
      },
      {
        title: "Paste or Write Text",
        description: "Add the text you want to paraphrase, summarize, or check."
      },
      {
        title: "Select Tool & Mode",
        description: "Choose paraphrasing, summarizing, or citation generation."
      },
      {
        title: "Review & Copy Output",
        description: "Copy or export the improved content."
      }
    ]
  },
  {
    name: "ProWritingAid",
    description: "Comprehensive writing tool that helps you improve your writing style, grammar, and readability.",
    url: "https://prowritingaid.com",
    id: "prowritingaid",
    image: "/tool-screenshots/prowritingaid.png",
    logo: "/logo/prowritingaid.png",
    categories: ["text", "productivity"],
    subcategory: "style-editing",
    tags: ["AI", "style", "editing", "readability"],
    rating: 4.3,
    visits: 1800000,
    dateAdded: "2021-06-15",
    isPremium: 'Free',
    features: [
      "Grammar Checker: Identifies and corrects grammatical errors in your writing.",
      "Style Editor: Provides suggestions to improve writing style and clarity.",
      "Readability Reports: Analyzes text to ensure it is easy to read and understand.",
      "Integrations: Works with various platforms like MS Word, Google Docs, and more."
    ],
    howToUse: [
      {
        title: "Install or Access Online",
        description: "Use the ProWritingAid web editor or install as an extension.",
        links: [{ label: "ProWritingAid", url: "https://prowritingaid.com" }]
      },
      {
        title: "Paste or Upload Text",
        description: "Add your writing to get feedback and analysis."
      },
      {
        title: "Review Suggestions & Reports",
        description: "Check style, grammar, and readability insights."
      },
      {
        title: "Edit & Export",
        description: "Apply changes and export improved documents."
      }
    ]
  },
  {
    name: "Hemingway App",
    description: "Writing tool that helps you write clear, concise, and engaging content.",
    url: "https://hemingwayapp.com",
    id: "hemingway-app",
    image: "/tool-screenshots/hemingway-app.png",
    logo: "/logo/hemingway-app.png",
    categories: ["text", "productivity"],
    subcategory: "style-editing",
    tags: ["AI", "writing", "editing", "readability"],
    rating: 4.4,
    visits: 1500000,
    dateAdded: "2021-08-15",
    isPremium: 'Free',
    features: [
      "Readability Analysis: Highlights complex sentences and suggests simplifications.",
      "Sentence Structure: Identifies long or hard-to-read sentences.",
      "Passive Voice Detection: Points out passive constructions for revision.",
      "Adverb Highlighting: Flags excessive use of adverbs to tighten prose."
    ],
    howToUse: [
      {
        title: "Open Hemingway App",
        description: "Visit the web app or use the desktop version.",
        links: [{ label: "Hemingway App", url: "https://hemingwayapp.com" }]
      },
      {
        title: "Paste or Write Content",
        description: "Add your writing to the editor."
      },
      {
        title: "Review Highlights & Suggestions",
        description: "Check color-coded feedback for readability and style."
      },
      {
        title: "Edit & Export",
        description: "Make improvements and download or copy the text."
      }
    ]
  },
  {
    name: "Mem",
    description: "AI-powered note-taking and knowledge management platform.",
    url: "https://mem.ai",
    id: "mem",
    image: "/tool-screenshots/mem.png",
    logo: "/logo/mem.png",
    categories: ["productivity"],
    subcategory: "note-taking",
    tags: ["AI", "notes", "knowledge", "organization"],
    rating: 4.4,
    visits: 1200000,
    dateAdded: "2021-11-15",
    isPremium: 'Free',
    features: [
      "AI Note-Taking: Automatically captures and organizes notes.",
      "Smart Search: Enables quick retrieval of information using natural language.",
      "Integration: Connects with calendars and other tools for seamless workflow.",
      "Collaboration: Allows sharing and collaboration on notes with team members."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Register and access Mem’s note dashboard.",
        links: [{ label: "Mem", url: "https://mem.ai" }]
      },
      {
        title: "Create or Import Notes",
        description: "Take new notes or import from other sources."
      },
      {
        title: "Search & Organize",
        description: "Use smart search and tagging to organize your knowledge."
      },
      {
        title: "Collaborate & Integrate",
        description: "Share notes or connect with calendars and tools."
      }
    ]
  },
  {
    name: "Hugo AI",
    description: "AI-powered meeting assistant for note-taking and task management.",
    url: "https://hugo.ai",
    id: "hugo-ai",
    image: "/tool-screenshots/hugo-ai.png",
    logo: "/logo/hugo-ai.png",
    categories: ["productivity"],
    subcategory: "meeting-assistant",
    tags: ["AI", "meetings", "notes", "tasks"],
    rating: 4.3,
    visits: 900000,
    dateAdded: "2021-12-15",
    isPremium: 'Free',
    features: [
      "Meeting Notes: Facilitates real-time note-taking during meetings.",
      "Agenda Templates: Provides templates to structure meeting agendas.",
      "Task Management: Assigns and tracks action items from meetings.",
      "Integration: Syncs with calendar and project management tools."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Calendar",
        description: "Register and integrate Hugo AI with your calendar.",
        links: [{ label: "Hugo AI", url: "https://hugo.ai" }]
      },
      {
        title: "Schedule & Join Meetings",
        description: "Use Hugo to take notes and track tasks live."
      },
      {
        title: "Review & Assign Tasks",
        description: "Check notes and assign or track meeting follow-ups."
      }
    ]
  },
  {
    name: "AI Dungeon",
    description: "AI-powered text adventure game and storytelling platform.",
    url: "https://aidungeon.io",
    id: "ai-dungeon",
    image: "/tool-screenshots/ai-dungeon.png",
    logo: "/logo/ai-dungeon.png",
    categories: ["text"],
    subcategory: "storytelling",
    tags: ["AI", "gaming", "storytelling", "creative"],
    rating: 4.2,
    visits: 1500000,
    dateAdded: "2022-01-15",
    isPremium: 'Free',
    features: [
      "Interactive Storytelling: Generates dynamic narratives based on user input.",
      "Custom Adventures: Allows creation of personalized story scenarios.",
      "Multiplayer Mode: Enables collaborative storytelling with others.",
      "AI-Driven Characters: Features characters that respond intelligently to interactions."
    ],
    howToUse: [
      {
        title: "Sign Up or Log In",
        description: "Create an account at AI Dungeon.",
        links: [{ label: "AI Dungeon", url: "https://aidungeon.io" }]
      },
      {
        title: "Start or Join Adventure",
        description: "Pick or create a scenario and begin your interactive story."
      },
      {
        title: "Interact and Guide Story",
        description: "Type actions or dialogue to shape the narrative."
      },
      {
        title: "Share and Replay",
        description: "Share your stories or replay to explore different outcomes."
      }
    ]
  },
  {
    name: "Stable Diffusion",
    description: "Open-source AI model for generating high-quality images from text descriptions.",
    url: "https://stability.ai",
    id: "stable-diffusion",
    image: "/tool-screenshots/stable-diffusion.png",
    logo: "/logo/stable-diffusion.png",
    categories: ["image"],
    subcategory: "open-source",
    tags: ["AI", "open-source", "art", "creative"],
    rating: 4.5,
    visits: 6000000,
    dateAdded: "2022-08-22",
    isPremium: 'Free',
    features: [
      "Text-to-Image Generation: Transforms descriptive text prompts into high-quality images.",
      "Image-to-Image Translation: Modifies existing images based on new prompts or styles.",
      "Custom Model Training: Allows fine-tuning for specific artistic styles or subjects.",
      "Open-Source Accessibility: Provides flexibility for developers and artists to customize and integrate."
    ],
    howToUse: [
      {
        title: "Access Stable Diffusion",
        description: "Visit Stability AI or use a local/hosted instance for image generation.",
        links: [{ label: "Stable Diffusion", url: "https://stability.ai" }]
      },
      {
        title: "Input Prompt or Image",
        description: "Provide a text prompt for generation, or upload an image for translation."
      },
      {
        title: "Configure Settings",
        description: "Adjust parameters such as style, resolution, or seed (if available)."
      },
      {
        title: "Generate & Download",
        description: "Generate the image and download or use in creative projects."
      }
    ]
  },
  {
    name: "Canva AI",
    description: "AI-powered graphic design platform for creating professional images and templates.",
    url: "https://canva.com",
    id: "canva-ai",
    image: "/tool-screenshots/canva-ai.png",
    logo: "/logo/canva-ai.png",
    categories: ["image", "design"],
    subcategory: "graphic-design",
    tags: ["AI", "design", "graphics", "templates"],
    rating: 4.6,
    visits: 8000000,
    dateAdded: "2023-01-15",
    isPremium: 'Free',
    features: [
      "AI-Powered Design Suggestions: Provides design recommendations based on user input.",
      "Magic Write: Generates text content for various design needs.",
      "Text-to-Image Tool: Creates images from text prompts.",
      "Background Remover: Automatically removes backgrounds from images."
    ],
    howToUse: [
      {
        title: "Sign Up & Open Canva AI",
        description: "Create an account and access Canva's AI tools via the dashboard.",
        links: [{ label: "Canva AI", url: "https://canva.com" }]
      },
      {
        title: "Start or Upload Design",
        description: "Choose a template, start a new design, or upload your own image."
      },
      {
        title: "Use AI Features",
        description: "Apply Magic Write, text-to-image, or background removal tools."
      },
      {
        title: "Export or Share",
        description: "Download, print, or share your finished design."
      }
    ]
  },
  {
    name: "Artbreeder",
    description: "AI platform for genetic image merging and creative image generation.",
    url: "https://artbreeder.com",
    id: "artbreeder",
    image: "/tool-screenshots/artbreeder.png",
    logo: "/logo/artbreeder.png",
    categories: ["image"],
    subcategory: "image-blending",
    tags: ["AI", "image blending", "art"],
    rating: 4.3,
    visits: 1800000,
    dateAdded: "2021-08-01",
    isPremium: 'Free',
    features: [
      "Image Blending: Combines multiple images to create new artworks.",
      "Gene Editing: Adjusts specific attributes like age, gender, and mood.",
      "High-Resolution Downloads: Provides high-quality image outputs.",
      "Collaborative Creation: Allows users to work together on image projects."
    ],
    howToUse: [
      {
        title: "Sign Up & Start Breeding",
        description: "Register on Artbreeder and start creating by blending images.",
        links: [{ label: "Artbreeder", url: "https://artbreeder.com" }]
      },
      {
        title: "Blend or Edit Genes",
        description: "Mix images or adjust gene sliders for attributes like age, gender, or style."
      },
      {
        title: "Download or Collaborate",
        description: "Export your creation or collaborate with others in the community."
      }
    ]
  },
  {
    name: "Lensa AI",
    description: "AI-powered portrait and photo editing app.",
    url: "https://lensa-ai.com",
    id: "lensa-ai",
    image: "/tool-screenshots/lensa-ai.png",
    logo: "/logo/lensa-ai.png",
    categories: ["image"],
    subcategory: "portrait",
    tags: ["AI", "portrait", "editing"],
    rating: 4.5,
    visits: 4000000,
    dateAdded: "2022-11-01",
    isPremium: 'Free',
    features: [
      "Magic Avatars: Transforms selfies into stylized portraits.",
      "Skin Retouching: Enhances facial features and removes blemishes.",
      "Background Editing: Changes or blurs image backgrounds.",
      "Artistic Filters: Applies various filters for creative effects."
    ],
    howToUse: [
      {
        title: "Download Lensa AI",
        description: "Get the Lensa AI app from App Store or Google Play.",
        links: [{ label: "Lensa AI", url: "https://lensa-ai.com" }]
      },
      {
        title: "Upload or Take a Photo",
        description: "Select a selfie or portrait to edit."
      },
      {
        title: "Apply AI Edits",
        description: "Use Magic Avatars, retouching, or background tools as desired."
      },
      {
        title: "Save & Share",
        description: "Save the edited image or share directly to social media."
      }
    ]
  },
  {
    name: "StarryAI",
    description: "AI platform for generating art and NFTs.",
    url: "https://starryai.com",
    id: "starryai",
    image: "/tool-screenshots/starryai.png",
    logo: "/logo/starryai.png",
    categories: ["image"],
    subcategory: "nft-art",
    tags: ["AI", "art", "NFTs", "creativity"],
    rating: 4.4,
    visits: 2000000,
    dateAdded: "2022-06-01",
    isPremium: 'Free',
    features: [
      "Text-to-Art Generation: Creates artworks from textual prompts.",
      "Style Customization: Offers various art styles to choose from.",
      "Upscaling: Enhances image resolution.",
      "Prompt Builder: Assists in crafting effective prompts for desired outputs."
    ],
    howToUse: [
      {
        title: "Access StarryAI",
        description: "Visit StarryAI to begin generating art or NFTs.",
        links: [{ label: "StarryAI", url: "https://starryai.com" }]
      },
      {
        title: "Enter Prompt & Select Style",
        description: "Input a textual prompt and choose an art style."
      },
      {
        title: "Generate & Upscale",
        description: "Create the artwork, upscale for higher resolution if needed."
      },
      {
        title: "Download or Mint NFT",
        description: "Export the image or mint as an NFT."
      }
    ]
  },
  {
    name: "Jasper Art",
    description: "AI tool for generating content marketing images.",
    url: "https://www.jasper.ai/art",
    id: "jasper-art",
    image: "/tool-screenshots/jasper-art.png",
    logo: "/logo/jasper-art.png",
    categories: ["image", "marketing"],
    subcategory: "marketing",
    tags: ["AI", "marketing", "content", "art"],
    rating: 4.3,
    visits: 1500000,
    dateAdded: "2022-04-01",
    isPremium: 'Free',
    features: [
      "AI Image Generation: Produces images based on text descriptions.",
      "Style Variations: Offers different artistic styles for outputs.",
      "High-Quality Outputs: Generates professional-grade images.",
      "Integration with Jasper Suite: Works seamlessly with other Jasper AI tools."
    ],
    howToUse: [
      {
        title: "Sign Up & Use Jasper Art",
        description: "Create an account and start generating images with Jasper Art.",
        links: [{ label: "Jasper Art", url: "https://www.jasper.ai/art" }]
      },
      {
        title: "Describe the Image",
        description: "Enter a descriptive text prompt and select the desired style."
      },
      {
        title: "Generate & Refine",
        description: "Review generated images and refine your prompt or style."
      },
      {
        title: "Download or Use in Jasper",
        description: "Export the image or use in Jasper's content marketing suite."
      }
    ]
  },
  {
    name: "Deep Nostalgia",
    description: "AI tool for animating photos from still images.",
    url: "https://myheritage.com/deep-nostalgia",
    id: "deep-nostalgia",
    image: "/tool-screenshots/deep-nostalgia.png",
    logo: "/logo/deep-nostalgia.png",
    categories: ["image", "video"],
    subcategory: "animation",
    tags: ["AI", "animation", "photo"],
    rating: 4.3,
    visits: 2500000,
    dateAdded: "2022-01-01",
    isPremium: 'Free',
    features: [
      "Photo Animation: Brings old photos to life with realistic movements.",
      "Facial Expression Enhancement: Adds subtle expressions to static images.",
      "AI Restoration: Improves the quality of aged photographs.",
      "Sharing Options: Easily shares animated photos on social platforms."
    ],
    howToUse: [
      {
        title: "Access Deep Nostalgia",
        description: "Go to the Deep Nostalgia tool on MyHeritage.",
        links: [{ label: "Deep Nostalgia", url: "https://myheritage.com/deep-nostalgia" }]
      },
      {
        title: "Upload a Photo",
        description: "Select a still image to animate."
      },
      {
        title: "Animate & Enhance",
        description: "Let AI animate and optionally enhance facial features."
      },
      {
        title: "Save or Share",
        description: "Download the animated result or share it online."
      }
    ]
  },
  {
    name: "FaceApp",
    description: "AI-powered app for facial transformations and edits.",
    url: "https://faceapp.com",
    id: "faceapp",
    image: "/tool-screenshots/faceapp.png",
    logo: "/logo/faceapp.png",
    categories: ["image"],
    subcategory: "face-editing",
    tags: ["AI", "faces", "editing"],
    rating: 4.4,
    visits: 3500000,
    dateAdded: "2021-12-01",
    isPremium: 'Free',
    features: [
      "Age Transformation: Shows aging or rejuvenated versions of faces.",
      "Gender Swap: Alters facial features to appear as a different gender.",
      "Smile Enhancement: Adds smiles to photos.",
      "Hairstyle and Color Changes: Modifies hair appearance."
    ],
    howToUse: [
      {
        title: "Download FaceApp",
        description: "Get FaceApp from App Store or Google Play.",
        links: [{ label: "FaceApp", url: "https://faceapp.com" }]
      },
      {
        title: "Upload or Take a Photo",
        description: "Select a face photo to edit."
      },
      {
        title: "Apply AI Effects",
        description: "Choose from aging, gender swap, smile, or hair edit features."
      },
      {
        title: "Save & Share",
        description: "Download or post the edited image."
      }
    ]
  },
  {
    name: "Amazon CodeWhisperer",
    description: "AI coding companion that provides code recommendations based on natural language comments.",
    url: "https://aws.amazon.com/codewhisperer/",
    id: "amazon-codewhisperer",
    image: "/tool-screenshots/amazon-codewhisperer.png",
    logo: "/logo/amazon-codewhisperer.png",
    categories: ["coding"],
    subcategory: "Code Generation",
    tags: ["AI", "code_generation", "AWS", "natural_language"],
    rating: 4.4,
    visits: 800000,
    dateAdded: "2022-06-22",
    isPremium: "Freemium",
    features: [
      "Real-Time Code Suggestions: Context-aware completions while coding.",
      "AWS Service Integration: Tailored snippets for AWS services.",
      "Security Scanning: Detects potential vulnerabilities.",
      "Open Source Attribution: References similar open-source code."
    ],
    howToUse: [
      {
        title: "Install CodeWhisperer",
        description: "Add CodeWhisperer extension to your IDE (VS Code, JetBrains, etc).",
        links: [{ label: "Amazon CodeWhisperer", url: "https://aws.amazon.com/codewhisperer/" }]
      },
      {
        title: "Start Coding",
        description: "Write code and receive context-aware suggestions."
      },
      {
        title: "Leverage AWS Snippets",
        description: "Use suggested code for AWS integrations."
      },
      {
        title: "Review Security Feedback",
        description: "Check for any flagged vulnerabilities or suggestions."
      }
    ]
  },
  {
    name: "DeepCode (Snyk Code)",
    description: "AI-driven code review and bug detection platform for improved code quality.",
    url: "https://snyk.io/product/snyk-code",
    id: "deepcode",
    image: "/tool-screenshots/deepcode.png",
    logo: "/logo/deepcode.png",
    categories: ["coding"],
    subcategory: "code-review",
    tags: ["AI", "review", "bug fixing"],
    rating: 4.5,
    visits: 1800000,
    dateAdded: "2021-08-20",
    isPremium: 'Free',
    features: [
      "AI-Powered Code Analysis: Analyzes code to detect security vulnerabilities and coding issues.",
      "Automatic Fix Suggestions: Provides recommendations to fix identified problems.",
      "Integration with Snyk: Works alongside Snyk's other security tools for comprehensive protection.",
      "Support for Multiple Languages: Analyzes code written in various programming languages."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Repo",
        description: "Register on Snyk, connect your code repository.",
        links: [{ label: "DeepCode (Snyk Code)", url: "https://snyk.io/product/snyk-code" }]
      },
      {
        title: "Run Code Analysis",
        description: "Let DeepCode scan your codebase for issues."
      },
      {
        title: "Review & Fix",
        description: "Examine AI-generated feedback and apply suggested fixes."
      }
    ]
  },
  {
    name: "CodeT5",
    description: "Multi-language code understanding and generation model.",
    url: "https://github.com/salesforce/CodeT5",
    id: "codet5",
    image: "/tool-screenshots/codet5.png",
    logo: "/logo/codet5.png",
    categories: ["coding"],
    subcategory: "code-generation",
    tags: ["AI", "T5", "models"],
    rating: 4.2,
    visits: 500000,
    dateAdded: "2022-08-15",
    isPremium: 'Free',
    features: [
      "Code Understanding and Generation: Excels at tasks like code summarization and translation.",
      "Identifier-Aware Pretraining: Understands the role of identifiers in code for better context.",
      "Support for Multiple Programming Languages: Trained on diverse codebases to handle various languages.",
      "Transformer-Based Architecture: Utilizes advanced machine learning models for code tasks."
    ],
    howToUse: [
      {
        title: "Explore CodeT5 on GitHub",
        description: "Access documentation and code samples for model usage.",
        links: [{ label: "CodeT5", url: "https://github.com/salesforce/CodeT5" }]
      },
      {
        title: "Install & Load Model",
        description: "Clone the repo, install requirements, and load the model as instructed."
      },
      {
        title: "Generate or Summarize Code",
        description: "Use APIs or command-line tools for code generation or summarization tasks."
      }
    ]
  },
  {
    name: "ChatCode",
    description: "Interactive AI coding chatbot for developer support.",
    url: "https://chatcodeai.vercel.app/",
    id: "chatcode",
    image: "/tool-screenshots/chatcode.png",
    logo: "/logo/chatcode.png",
    categories: ["coding"],
    subcategory: "chatbot",
    tags: ["AI", "chatbot", "developer support"],
    rating: 4.3,
    visits: 800000,
    dateAdded: "2022-11-01",
    isPremium: 'Free',
    features: [
      "Collaborative Coding Environment: Allows multiple users to code together in real-time.",
      "Audio and Video Communication: Facilitates discussions among collaborators.",
      "Support for Multiple Languages: Enables coding in over 10 different programming languages.",
      "Shared Code Execution: Users can execute code within the shared environment."
    ],
    howToUse: [
      {
        title: "Visit ChatCode",
        description: "Access the ChatCode platform in your browser.",
        links: [{ label: "ChatCode", url: "https://chatcodeai.vercel.app/" }]
      },
      {
        title: "Create or Join Session",
        description: "Start a new coding session or join an existing one."
      },
      {
        title: "Collaborate & Code",
        description: "Write code, chat, and even make calls within the platform."
      }
    ]
  },
  {
    name: "PyCaret",
    description: "AutoML platform for machine learning and coding pipelines.",
    url: "https://pycaret.org",
    id: "pycaret",
    image: "/tool-screenshots/pycaret.png",
    logo: "/logo/pycaret.png",
    categories: ["coding", "data-processing"],
    subcategory: "automl",
    tags: ["AI", "AutoML", "Python"],
    rating: 4.5,
    visits: 1200000,
    dateAdded: "2022-12-01",
    isPremium: 'Free',
    features: [
      "Automated Machine Learning: Simplifies the process of training and deploying models.",
      "Feature Engineering: Provides tools for preprocessing and transforming data.",
      "Model Comparison: Allows easy comparison of different machine learning models.",
      "Low-Code Interface: Designed for users with minimal coding experience."
    ],
    howToUse: [
      {
        title: "Visit PyCaret",
        description: "Go to the PyCaret website for docs and installation guides.",
        links: [{ label: "PyCaret", url: "https://pycaret.org" }]
      },
      {
        title: "Install & Import",
        description: "Install PyCaret via pip and import in your Python scripts."
      },
      {
        title: "Run AutoML Pipeline",
        description: "Use PyCaret modules to load data, preprocess, compare, and deploy models."
      }
    ]
  },
  {
    name: "DataRobot Code",
    description: "AI platform for code optimization and deployment.",
    url: "https://www.datarobot.com",
    id: "datarobot-code",
    image: "/tool-screenshots/datarobot-code.png",
    logo: "/logo/datarobot-code.png",
    categories: ["coding", "data-processing"],
    subcategory: "optimization",
    tags: ["AI", "deployment", "automation"],
    rating: 4.4,
    visits: 900000,
    dateAdded: "2023-01-01",
    isPremium: 'Free',
    features: [
      "Automated Feature Engineering: Discovers and creates new features from datasets.",
      "Model Deployment: Simplifies the process of deploying machine learning models.",
      "Time Series Analysis: Provides tools for forecasting and analyzing time-based data.",
      "Integration with Python: Offers a Python client for advanced users."
    ],
    howToUse: [
      {
        title: "Sign Up & Use DataRobot",
        description: "Create an account to access DataRobot Code tools.",
        links: [{ label: "DataRobot Code", url: "https://www.datarobot.com" }]
      },
      {
        title: "Upload Data & Optimize",
        description: "Import your data and let the AI optimize code and models."
      },
      {
        title: "Deploy & Integrate",
        description: "Deploy optimized solutions or integrate with your projects."
      }
    ]
  },
  {
    name: "CodeGen",
    description: "Transformer models for code synthesis and generation.",
    url: "https://github.com/salesforce/CodeGen",
    id: "codegen",
    image: "/tool-screenshots/codegen.png",
    logo: "/logo/codegen.png",
    categories: ["coding"],
    subcategory: "code-generation",
    tags: ["AI", "deep learning", "models"],
    rating: 4.2,
    visits: 600000,
    dateAdded: "2023-02-01",
    isPremium: 'Free',
    features: [
      "AI-Powered Code Generation: Generates code snippets based on natural language prompts.",
      "Support for Multiple Languages: Handles code generation in various programming languages.",
      "Transformer-Based Model: Utilizes advanced machine learning architectures for code synthesis.",
      "Open-Source Availability: Accessible for customization and integration into workflows."
    ],
    howToUse: [
      {
        title: "Explore CodeGen on GitHub",
        description: "Visit the CodeGen repository for documentation, models, and usage.",
        links: [{ label: "CodeGen", url: "https://github.com/salesforce/CodeGen" }]
      },
      {
        title: "Clone & Install",
        description: "Clone the repo and install required dependencies."
      },
      {
        title: "Generate Code",
        description: "Use the provided scripts or API to generate code from prompts."
      }
    ]
  },
  {
    name: "Kogito",
    description: "Enterprise automation platform with AI capabilities.",
    url: "https://kogito.kie.org",
    id: "kogito",
    image: "/tool-screenshots/kogito.png",
    logo: "/logo/kogito.png",
    categories: ["coding"],
    subcategory: "automation",
    tags: ["AI", "automation", "business"],
    rating: 4.1,
    visits: 300000,
    dateAdded: "2023-04-01",
    isPremium: 'Free',
    features: [
      "Business Process Automation: Helps in modeling and automating business workflows.",
      "Cloud-Native Architecture: Designed for deployment in cloud environments.",
      "Integration with Java: Works seamlessly with Java applications.",
      "Support for BPMN and DMN: Handles Business Process Model and Notation (BPMN) and Decision Model and Notation (DMN)."
    ],
    howToUse: [
      {
        title: "Access Kogito Documentation",
        description: "Review the official Kogito docs for setup and deployment guidance.",
        links: [{ label: "Kogito", url: "https://kogito.kie.org" }]
      },
      {
        title: "Model Business Processes",
        description: "Use BPMN/DMN editors to design your workflows and decisions."
      },
      {
        title: "Integrate with Java Apps",
        description: "Embed Kogito services into your Java or cloud-native applications."
      },
      {
        title: "Deploy and Monitor",
        description: "Deploy to cloud platforms and monitor automation processes."
      }
    ]
  },
  {
    name: "Jina AI",
    description: "Neural search framework for building AI-powered search systems.",
    url: "https://jina.ai",
    id: "jina-ai",
    image: "/tool-screenshots/jina-ai.png",
    logo: "/logo/jina-ai.png",
    categories: ["coding"],
    subcategory: "search",
    tags: ["AI", "search", "neural networks"],
    rating: 4.4,
    visits: 400000,
    dateAdded: "2023-05-01",
    isPremium: 'Free',
    features: [
      "Neural Search Framework: Enables building search systems powered by neural networks.",
      "Modular Architecture: Allows customization and extension of components.",
      "Support for Multimodal Data: Handles text, images, and other data types.",
      "Scalability: Designed to scale with large datasets and high traffic."
    ],
    howToUse: [
      {
        title: "Explore Jina Documentation",
        description: "Visit the official docs for installation and starter guides.",
        links: [{ label: "Jina AI", url: "https://jina.ai" }]
      },
      {
        title: "Build Neural Search Flows",
        description: "Define flows and executors for text, image, or audio search.",
      },
      {
        title: "Deploy & Scale",
        description: "Run your search solution on local servers or cloud infrastructure."
      }
    ]
  },
  {
    name: "Yellowbrick",
    description: "Visual analysis and diagnostic tools for machine learning models.",
    url: "https://www.scikit-yb.org",
    id: "yellowbrick",
    image: "/tool-screenshots/yellowbrick.png",
    logo: "/logo/yellowbrick.png",
    categories: ["coding", "data-processing"],
    subcategory: "visualization",
    tags: ["AI", "visualization", "machine learning"],
    rating: 4.2,
    visits: 250000,
    dateAdded: "2023-06-01",
    isPremium: 'Free',
    features: [
      "Visual Analysis of Machine Learning Models: Provides visualizations to understand model performance.",
      "Integration with Scikit-Learn: Works alongside popular Python machine learning libraries.",
      "Diagnostic Tools: Offers tools to diagnose issues like overfitting.",
      "Feature Visualization: Helps in understanding the importance and impact of features."
    ],
    howToUse: [
      {
        title: "Install Yellowbrick",
        description: "Add Yellowbrick to your Python environment using pip.",
        links: [{ label: "Yellowbrick", url: "https://www.scikit-yb.org" }]
      },
      {
        title: "Import & Visualize",
        description: "Import Yellowbrick in your code and call visualizers on scikit-learn models."
      },
      {
        title: "Analyze & Interpret Results",
        description: "Review plots for diagnostics, feature importance, and model evaluation."
      }
    ]
  },
  {
    name: "Semantic Kernel",
    description: "Microsoft's framework for integrating AI models into applications.",
    url: "https://github.com/microsoft/semantic-kernel",
    id: "semantic-kernel",
    image: "/tool-screenshots/semantic-kernel.png",
    logo: "/logo/semantic-kernel.png",
    categories: ["coding"],
    subcategory: "ai-integration",
    tags: ["AI", "Microsoft", "integration"],
    rating: 4.3,
    visits: 350000,
    dateAdded: "2023-07-01",
    isPremium: 'Free',
    features: [
      "Integration of AI Models: Combines various AI models into applications.",
      "Support for Plugins: Allows extension with custom functionalities.",
      "Contextual Memory: Maintains context across interactions.",
      "Flexible Deployment: Can be integrated into different environments and platforms."
    ],
    howToUse: [
      {
        title: "Explore Semantic Kernel GitHub",
        description: "Visit the GitHub repo for code samples and documentation.",
        links: [{ label: "Semantic Kernel", url: "https://github.com/microsoft/semantic-kernel" }]
      },
      {
        title: "Integrate AI Models",
        description: "Follow the guides to add AI models and plugins to your application."
      },
      {
        title: "Deploy & Extend",
        description: "Deploy in your environment and extend with contextual memory and plugins."
      }
    ]
  },
  {
    name: "ML.NET",
    description: "Machine learning framework for .NET developers.",
    url: "https://dotnet.microsoft.com/apps/machinelearning-ai/ml-dotnet",
    id: "ml-net",
    image: "/tool-screenshots/ml-net.png",
    logo: "/logo/ml-net.png",
    categories: ["coding"],
    subcategory: "machine-learning",
    tags: ["AI", "machine learning", ".NET"],
    rating: 4.4,
    visits: 450000,
    dateAdded: "2023-08-01",
    isPremium: 'Free',
    features: [
      "Machine Learning for .NET: Brings machine learning capabilities to .NET applications.",
      "Model Training and Deployment: Facilitates the entire machine learning lifecycle.",
      "Support for Various Algorithms: Includes classification, regression, clustering, and more.",
      "Integration with Visual Studio: Provides tools within the Visual Studio environment."
    ],
    howToUse: [
      {
        title: "Install ML.NET",
        description: "Install ML.NET via NuGet in your .NET project.",
        links: [{ label: "ML.NET", url: "https://dotnet.microsoft.com/apps/machinelearning-ai/ml-dotnet" }]
      },
      {
        title: "Train Models",
        description: "Use ML.NET APIs to train, evaluate, and deploy machine learning models."
      },
      {
        title: "Integrate & Deploy",
        description: "Add predictions and ML features to your .NET applications."
      }
    ]
  },
  {
    name: "Hugging Face Transformers",
    description: "Library for state-of-the-art Natural Language Processing.",
    url: "https://huggingface.co/docs/transformers",
    id: "hugging-face-transformers",
    image: "/tool-screenshots/hugging-face-transformers.png",
    logo: "/logo/hugging-face-transformers.png",
    categories: ["coding"],
    subcategory: "nlp",
    tags: ["AI", "NLP", "transformers"],
    rating: 4.7,
    visits: 2000000,
    dateAdded: "2023-09-01",
    isPremium: 'Free',
    features: [
      "Pretrained Models: Access to a wide range of pretrained models for NLP tasks.",
      "Easy Integration: Simple APIs for incorporating models into applications.",
      "Support for Multiple Frameworks: Compatible with TensorFlow and PyTorch.",
      "Community Contributions: Active community providing models and support."
    ],
    howToUse: [
      {
        title: "Install Transformers",
        description: "Install via pip and explore documentation and model hub.",
        links: [{ label: "Hugging Face Transformers", url: "https://huggingface.co/docs/transformers" }]
      },
      {
        title: "Load Pretrained Models",
        description: "Use simple APIs to load models for tasks like text classification, translation, and more."
      },
      {
        title: "Fine-Tune or Deploy",
        description: "Fine-tune models on your data or deploy to production environments."
      }
    ]
  },
  {
    name: "Keras Tuner",
    description: "Hyperparameter tuning library for Keras models.",
    url: "https://keras.io/keras_tuner",
    id: "keras-tuner",
    image: "/tool-screenshots/keras-tuner.png",
    logo: "/logo/keras-tuner.png",
    categories: ["coding"],
    subcategory: "machine-learning",
    tags: ["AI", "machine learning", "hyperparameter tuning"],
    rating: 4.3,
    visits: 300000,
    dateAdded: "2023-10-01",
    isPremium: 'Free',
    features: [
      "Hyperparameter Optimization: Automates the search for optimal model parameters.",
      "Integration with Keras: Works seamlessly with Keras models.",
      "Support for Various Search Algorithms: Includes random search, Bayesian optimization, and more.",
      "Scalability: Can be used for tuning models on large datasets."
    ],
    howToUse: [
      {
        title: "Install Keras Tuner",
        description: "Add keras-tuner to your Python environment.",
        links: [{ label: "Keras Tuner", url: "https://keras.io/keras_tuner" }]
      },
      {
        title: "Define Search Space",
        description: "Specify hyperparameters and search algorithms in your model pipeline."
      },
      {
        title: "Run Tuning",
        description: "Execute the search and select the best model configuration."
      }
    ]
  },
  {
    name: "ElevenLabs",
    description: "An AI voice synthesis platform known for its high-quality, lifelike voice generation, supporting multiple languages and accents.",
    url: "https://elevenlabs.io",
    id: "elevenlabs",
    image: "/tool-screenshots/elevenlabs.png",
    logo: "/logo/elevenlabs.png",
    categories: ["audio"],
    subcategory: "voice-generation",
    tags: ["AI", "voice cloning", "multilingual", "dubbing"],
    rating: 4.8,
    visits: 2500000,
    dateAdded: "2023-01-15",
    isPremium: 'Free',
    features: [
      "Ultra-Realistic Text-to-Speech: Generates lifelike speech in over 30 languages with natural intonation.",
      "Voice Cloning: Allows users to create high-fidelity replicas of voices using minimal audio samples.",
      "Custom Voice Design: Offers tools to fine-tune voice attributes like stability and clarity.",
      "Developer-Friendly API: Provides integration capabilities for various applications."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Register at ElevenLabs and access the web studio or API.",
        links: [{ label: "ElevenLabs", url: "https://elevenlabs.io" }]
      },
      {
        title: "Select Voice or Clone New",
        description: "Choose from the library or create a custom cloned voice."
      },
      {
        title: "Generate Speech",
        description: "Input text, adjust settings, and generate lifelike voice output."
      },
      {
        title: "Download or Integrate",
        description: "Export audio files or use the API for application integration."
      }
    ]
  },
  {
    name: "Murf.ai",
    description: "Provides AI-generated voiceovers with realistic voices and features like grammar assistance and voice editors, suitable for various applications.",
    url: "https://murf.ai",
    id: "murf-ai",
    image: "/tool-screenshots/murf-ai.png",
    logo: "/logo/murf-ai.png",
    categories: ["audio"],
    subcategory: "voice-generation",
    tags: ["AI", "voiceover", "presentations", "text-to-speech"],
    rating: 4.6,
    visits: 1800000,
    dateAdded: "2023-02-20",
    isPremium: 'Free',
    features: [
      "Diverse Voice Library: Access to over 200 realistic voices across 20+ languages.",
      "Voice Cloning: Enables creation of custom voices for personalized content.",
      "AI Voice Changer: Transforms recorded voices into professional-sounding narrations.",
      "Seamless Integrations: Compatible with platforms like Canva and Google Slides."
    ],
    howToUse: [
      {
        title: "Create Account & Access Studio",
        description: "Register and log in to Murf Studio.",
        links: [{ label: "Murf.ai", url: "https://murf.ai" }]
      },
      {
        title: "Upload or Input Script",
        description: "Paste text or upload scripts for voiceover generation."
      },
      {
        title: "Select Voice & Customize",
        description: "Choose a voice, adjust pitch, speed, and add emphasis."
      },
      {
        title: "Generate & Download",
        description: "Produce the voiceover and export audio files for use."
      }
    ]
  },
  {
    name: "Lovo",
    description: "An AI voiceover platform offering a wide range of voices and languages, designed for content creators and businesses.",
    url: "https://lovo.ai",
    id: "lovo",
    image: "/tool-screenshots/lovo.png",
    logo: "/logo/lovo.png",
    categories: ["audio"],
    subcategory: "voice-generation",
    tags: ["AI", "voice editing", "narration", "content creation"],
    rating: 4.5,
    visits: 1500000,
    dateAdded: "2023-03-10",
    isPremium: 'Free',
    features: [
      "Extensive Voice Options: Offers 500+ AI voices in over 100 languages.",
      "Voice Cloning: Allows users to create unique, branded voices.",
      "Genny AI: An intuitive tool for generating voiceovers from text.",
      "Auto Subtitle Generator: Automatically creates subtitles for videos."
    ],
    howToUse: [
      {
        title: "Sign Up & Use Genny Studio",
        description: "Register and log in to Lovo's Genny Studio.",
        links: [{ label: "Lovo", url: "https://lovo.ai" }]
      },
      {
        title: "Input Script",
        description: "Type or paste your script for voice generation."
      },
      {
        title: "Select Voice & Language",
        description: "Pick from hundreds of voices and languages, and preview."
      },
      {
        title: "Generate & Download",
        description: "Produce, edit, and export the final audio or subtitles."
      }
    ]
  },
  {
    name: "Voice.ai",
    description: "A voice cloning tool that allows users to transform their voice into various characters or styles in real-time.",
    url: "https://voice.ai",
    id: "voice-ai",
    image: "/tool-screenshots/voice-ai.png",
    logo: "/logo/voice-ai.png",
    categories: ["audio"],
    subcategory: "voice-generation",
    tags: ["AI", "voice changer", "streaming", "real-time"],
    rating: 4.3,
    visits: 1200000,
    dateAdded: "2023-04-05",
    isPremium: 'Free',
    features: [
      "Real-Time Voice Changer: Modifies voice in real-time across various applications.",
      "Wide App Compatibility: Works with platforms like Zoom, Discord, and Skype.",
      "Voice Universe: A collection of diverse voice options for users.",
      "Audio Editing Tools: Includes features like vocal remover and echo reducer."
    ],
    howToUse: [
      {
        title: "Download & Install Voice.ai",
        description: "Get the desktop app from the Voice.ai website.",
        links: [{ label: "Voice.ai", url: "https://voice.ai" }]
      },
      {
        title: "Configure App & Audio Devices",
        description: "Set up microphone and select target voices or effects."
      },
      {
        title: "Enable Real-Time Voice Changing",
        description: "Activate the voice changer in your preferred apps."
      }
    ]
  },
  {
    name: "Uberduck",
    description: "An AI voice platform that enables users to create custom voiceovers and songs using a variety of AI-generated voices.",
    url: "https://uberduck.ai",
    id: "uberduck",
    image: "/tool-screenshots/uberduck.png",
    logo: "/logo/uberduck.png",
    categories: ["audio"],
    subcategory: "voice-generation",
    tags: ["AI", "voiceovers", "music synthesis", "custom voices"],
    rating: 4.4,
    visits: 1000000,
    dateAdded: "2023-05-01",
    isPremium: 'Free',
    features: [
      "Text-to-Speech & Singing: Converts text into speech, singing, or rapping.",
      "Voice Cloning: Creates custom voices for various applications.",
      "API Access: Provides developers with tools for integration.",
      "Music Studio: A platform for creating complete songs using AI vocals."
    ],
    howToUse: [
      {
        title: "Register & Log In",
        description: "Create an account at Uberduck and access the platform.",
        links: [{ label: "Uberduck", url: "https://uberduck.ai" }]
      },
      {
        title: "Select Voice/Mode",
        description: "Choose from TTS, singing, or custom voice creation.",
      },
      {
        title: "Input Script or Lyrics",
        description: "Type or paste your text or lyrics for generation."
      },
      {
        title: "Generate & Export",
        description: "Produce audio and download or share your voice creation."
      }
    ]
  },
  {
    name: "Descript",
    description: "An all-in-one audio and video editing tool that includes features like transcription, screen recording, and multitrack editing.",
    url: "https://descript.com",
    id: "descript",
    image: "/tool-screenshots/descript.png",
    logo: "/logo/descript.png",
    categories: ["audio", "video"],
    subcategory: "audio-video-editing",
    tags: ["AI", "podcasting", "transcription", "editing", "video-editing"],
    rating: 4.7,
    visits: 2000000,
    dateAdded: "2023-01-01",
    isPremium: 'Free',
    features: [
      "Overdub: AI-powered voice cloning for seamless edits.",
      "Studio Sound: Enhances audio quality by removing noise and echo.",
      "Text-Based Editing: Edit audio and video by editing the transcribed text.",
      "Multi-Track Editing: Supports editing multiple audio and video tracks simultaneously.",
      "Screen Recording: Record and edit screen content easily."
    ],
    howToUse: [
      {
        title: "Download & Install Descript",
        description: "Get Descript for your OS or use the web app.",
        links: [{ label: "Descript", url: "https://descript.com" }]
      },
      {
        title: "Import Media",
        description: "Add audio, video, or screen recordings for editing."
      },
      {
        title: "Edit by Text",
        description: "Transcribe, cut, or overdub by editing the transcript."
      },
      {
        title: "Export & Publish",
        description: "Download the finished project or publish online."
      }
    ]
  },
  {
    name: "Adobe Podcast Enhance",
    description: "An AI-powered tool by Adobe that enhances podcast audio by removing background noise and improving sound quality.",
    url: "https://podcast.adobe.com",
    id: "adobe-podcast-enhance",
    image: "/tool-screenshots/adobe-podcast-enhance.png",
    logo: "/logo/adobe-podcast-enhance.png",
    categories: ["audio"],
    subcategory: "audio-editing",
    tags: ["AI", "noise removal", "speech clarity", "enhancement"],
    rating: 4.6,
    visits: 1500000,
    dateAdded: "2023-02-15",
    isPremium: 'Free',
    features: [
      "Enhance Speech: Improves audio quality to sound studio-recorded.",
      "Mic Check: Analyzes microphone setup for optimal recording.",
      "Web-Based Editing: Record, edit, and enhance audio directly in the browser.",
      "Bulk Upload: Process multiple files simultaneously."
    ],
    howToUse: [
      {
        title: "Access Adobe Podcast Enhance",
        description: "Go to the website and log in with your Adobe account.",
        links: [{ label: "Adobe Podcast Enhance", url: "https://podcast.adobe.com" }]
      },
      {
        title: "Upload Audio Files",
        description: "Add podcast or voice recordings for enhancement."
      },
      {
        title: "Apply Enhancement",
        description: "Let AI process the audio to remove noise and improve clarity."
      },
      {
        title: "Download Improved Audio",
        description: "Export the enhanced audio for publishing or further editing."
      }
    ]
  },
  {
    name: "Krisp",
    description: "An AI noise cancellation app that removes background noise and echo during calls, enhancing communication clarity.",
    url: "https://krisp.ai",
    id: "krisp",
    image: "/tool-screenshots/krisp.png",
    logo: "/logo/krisp.png",
    categories: ["audio"],
    subcategory: "audio-editing",
    tags: ["AI", "noise cancellation", "meetings", "live calls"],
    rating: 4.8,
    visits: 3000000,
    dateAdded: "2022-12-01",
    isPremium: 'Free',
    features: [
      "Noise Cancellation: Removes background noise during calls.",
      "Voice Cancellation: Eliminates other voices in the background.",
      "Meeting Transcription: Provides real-time transcription of meetings.",
      "Accent Conversion: Adjusts accents in real-time for clearer communication."
    ],
    howToUse: [
      {
        title: "Download & Install Krisp",
        description: "Go to the Krisp website and download the app for your OS.",
        links: [{ label: "Krisp", url: "https://krisp.ai" }]
      },
      {
        title: "Set Up Audio Devices",
        description: "Select Krisp as your microphone and/or speaker in your conferencing app."
      },
      {
        title: "Enable Noise Cancellation",
        description: "Toggle on noise or voice cancellation features during calls."
      },
      {
        title: "Use Transcription & Accent Tools",
        description: "Enable real-time transcription and accent conversion as needed."
      }
    ]
  },
  {
    name: "Auphonic",
    description: "An audio post-production web service that uses AI to balance levels, equalize speech, and reduce noise for podcasts and videos.",
    url: "https://auphonic.com",
    id: "auphonic",
    image: "/tool-screenshots/auphonic.png",
    logo: "/logo/auphonic.png",
    categories: ["audio"],
    subcategory: "audio-editing",
    tags: ["AI", "audio leveling", "post-production", "automation"],
    rating: 4.5,
    visits: 800000,
    dateAdded: "2023-03-20",
    isPremium: 'Free',
    features: [
      "Audio Leveling: Automatically balances audio levels.",
      "Noise & Hum Reduction: Cleans up background noise and hums.",
      "Loudness Normalization: Ensures consistent loudness across files.",
      "Multi-Track Processing: Processes multiple audio tracks simultaneously."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Auphonic",
        description: "Register on the Auphonic website to access the web app.",
        links: [{ label: "Auphonic", url: "https://auphonic.com" }]
      },
      {
        title: "Upload Audio Files",
        description: "Add your recorded audio for post-production processing."
      },
      {
        title: "Configure Processing",
        description: "Select noise reduction, leveling, and other options."
      },
      {
        title: "Download Processed Audio",
        description: "Export the finished, balanced audio for publishing."
      }
    ]
  },
  {
    name: "Izotope Cascadia",
    description: "A suite of AI-powered audio tools designed for music production, mixing, and mastering, offering advanced sound processing capabilities.",
    url: "https://izotope.com/cascadia",
    id: "izotope-cascadia",
    image: "/tool-screenshots/izotope-cascadia.png",
    logo: "/logo/izotope-cascadia.png",
    categories: ["audio"],
    subcategory: "audio-editing",
    tags: ["AI", "sound design", "audio effects", "professional"],
    rating: 4.7,
    visits: 1000000,
    dateAdded: "2023-04-10",
    isPremium: 'Free',
    features: [
      "Advanced Audio Restoration: Removes clicks, pops, and other imperfections.",
      "Spectral Editing: Visual editing of audio frequencies.",
      "Dialogue Isolation: Separates dialogue from background noise.",
      "Mastering Tools: Provides tools for finalizing audio projects."
    ],
    howToUse: [
      {
        title: "Access Izotope Cascadia Suite",
        description: "Go to the Izotope Cascadia site and download the tools or plugins.",
        links: [{ label: "Izotope Cascadia", url: "https://izotope.com/cascadia" }]
      },
      {
        title: "Install in DAW or Standalone",
        description: "Run the software standalone or install as plugins in your DAW."
      },
      {
        title: "Edit & Master Audio",
        description: "Apply restoration, spectral editing, and mastering to your tracks."
      },
      {
        title: "Export Final Audio",
        description: "Render the mastered or restored audio for distribution."
      }
    ]
  },
  {
    name: "AIVA",
    description: "AI music composer for creating emotional soundtracks and film scores.",
    url: "https://aiva.ai",
    id: "aiva",
    image: "/tool-screenshots/aiva.png",
    logo: "/logo/aiva.png",
    categories: ["audio"],
    subcategory: "music-generation",
    tags: ["AI", "soundtrack", "emotional music", "film scores"],
    rating: 4.6,
    visits: 1200000,
    dateAdded: "2023-01-20",
    isPremium: 'Free',
    features: [
      "AI Music Composition: Generates original music compositions.",
      "Customizable Styles: Allows users to set the mood and style of compositions.",
      "Sheet Music Generation: Provides sheet music for compositions.",
      "Integration with DAWs: Compatible with digital audio workstations."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Create an account at AIVA and access the dashboard.",
        links: [{ label: "AIVA", url: "https://aiva.ai" }]
      },
      {
        title: "Create a New Composition",
        description: "Select style, mood, and parameters to generate music."
      },
      {
        title: "Download Audio or Sheet Music",
        description: "Export your composition as audio or sheet music for DAW use."
      }
    ]
  },
  {
    name: "WavTool",
    description: "Browser-based AI digital audio workstation for music composition.",
    url: "https://wavtool.com",
    id: "wavtool",
    image: "/tool-screenshots/wavtool.png",
    logo: "/logo/wavtool.png",
    categories: ["audio"],
    subcategory: "music-generation",
    tags: ["AI", "browser DAW", "composition", "music creation"],
    rating: 4.3,
    visits: 700000,
    dateAdded: "2023-04-20",
    isPremium: 'Free',
    features: [
      "Online DAW: A browser-based digital audio workstation.",
      "Real-Time Collaboration: Allows multiple users to work on projects simultaneously.",
      "Plugin Support: Supports various audio plugins for enhanced functionality.",
      "Multi-Track Editing: Edit multiple audio tracks within the platform."
    ],
    howToUse: [
      {
        title: "Access WavTool Online",
        description: "Go to the WavTool website and launch the browser-based DAW.",
        links: [{ label: "WavTool", url: "https://wavtool.com" }]
      },
      {
        title: "Start a New Project",
        description: "Create a new music project or open an existing one."
      },
      {
        title: "Compose and Edit",
        description: "Use tracks, plugins, and real-time collaboration to compose, record, and edit music."
      },
      {
        title: "Export or Share",
        description: "Export your finished audio or share the project with collaborators."
      }
    ]
  },
  {
    name: "Suno",
    description: "AI-powered text-to-music generator with genre blending capabilities.",
    url: "https://suno.ai",
    id: "suno",
    image: "/tool-screenshots/suno.png",
    logo: "/logo/suno.png",
    categories: ["audio"],
    subcategory: "music-generation",
    tags: ["AI", "text-to-music", "genre blending", "composition"],
    rating: 4.4,
    visits: 800000,
    dateAdded: "2023-05-10",
    isPremium: 'Free',
    features: [
      "AI Music Generation: Creates songs based on user inputs.",
      "Genre Versatility: Supports various musical genres.",
      "Lyric Integration: Generates lyrics to accompany compositions.",
      "Rapid Composition: Produces complete songs in seconds."
    ],
    howToUse: [
      {
        title: "Visit Suno Website",
        description: "Access Suno via their platform to start generating music.",
        links: [{ label: "Suno", url: "https://suno.ai" }]
      },
      {
        title: "Describe or Select Style",
        description: "Enter a text prompt or select genre and style for your composition."
      },
      {
        title: "Generate Song",
        description: "Let the AI create music and lyrics based on your input."
      },
      {
        title: "Download or Share",
        description: "Export the composition or share it directly."
      }
    ]
  },
  {
    name: "Whisper",
    description: "OpenAI's open-source speech recognition system for accurate transcription.",
    url: "https://github.com/openai/whisper",
    id: "whisper",
    image: "/tool-screenshots/whisper.png",
    logo: "/logo/whisper.png",
    categories: ["audio"],
    subcategory: "transcription",
    tags: ["AI", "speech-to-text", "open source", "transcription"],
    rating: 4.8,
    visits: 2500000,
    dateAdded: "2022-09-20",
    isPremium: 'Free',
    features: [
      "Multilingual Transcription: Transcribes speech in over 90 languages.",
      "Open-Source: Available for public use and modification.",
      "High Accuracy: Delivers precise transcriptions even in challenging conditions.",
      "Real-Time Processing: Transcribes audio in real-time."
    ],
    howToUse: [
      {
        title: "Install Whisper",
        description: "Install Whisper from GitHub and set up the environment.",
        links: [{ label: "Whisper on GitHub", url: "https://github.com/openai/whisper" }]
      },
      {
        title: "Prepare Audio Files",
        description: "Provide audio files in supported formats."
      },
      {
        title: "Run Transcription",
        description: "Use CLI or Python interface to transcribe audio."
      },
      {
        title: "Review and Use Output",
        description: "Retrieve transcriptions in text format for further use."
      }
    ]
  },
  {
    name: "Podcastle",
    description: "All-in-one podcasting platform with AI voice cloning and editing features.",
    url: "https://podcastle.ai",
    id: "podcastle",
    image: "/tool-screenshots/podcastle.png",
    logo: "/logo/podcastle.png",
    categories: ["audio"],
    subcategory: "transcription",
    tags: ["AI", "podcasting", "voice cloning", "editing"],
    rating: 4.6,
    visits: 1000000,
    dateAdded: "2023-03-01",
    isPremium: 'Free',
    features: [
      "AI-Powered Audio Editing: Automatically removes background noise and enhances audio quality.",
      "Text-to-Speech Conversion: Transforms written content into natural-sounding speech.",
      "Multitrack Recording: Supports recording of separate audio and video tracks for each participant.",
      "Dynamic Speaker Feature: Intelligently switches focus between speakers in video recordings."
    ],
    howToUse: [
      {
        title: "Sign Up and Access Studio",
        description: "Register at Podcastle and launch the studio dashboard.",
        links: [{ label: "Podcastle", url: "https://podcastle.ai" }]
      },
      {
        title: "Record or Upload Content",
        description: "Create new podcast episodes or upload audio/video for editing."
      },
      {
        title: "Edit and Enhance",
        description: "Use AI tools for noise reduction, voice cloning, and multitrack editing."
      },
      {
        title: "Export or Publish",
        description: "Download finished files or publish to podcast platforms."
      }
    ]
  },
  {
    name: "Midjourney",
    description: "Generates high-quality images from text prompts, popular among artists.",
    url: "https://www.midjourney.com",
    id: "midjourney",
    image: "/tool-screenshots/midjourney.png",
    logo: "/logo/midjourney.png",
    categories: ["image","design"],
    subcategory: "Artistic Image Generation",
    tags: ["art", "concept_design", "high_quality"],
    rating: 4.8,
    visits: 3500000,
    dateAdded: "2022-07-12",
    isPremium: "Premium",
    features: [
      "Text-to-Image Generation: Creates detailed and artistic images from natural language prompts.",
      "Style Customization: Supports a wide range of artistic styles and visual effects.",
      "Community Gallery: Users can explore and remix public creations.",
      "Iterative Prompting: Refine and upscale images through multiple prompt variations."
    ],
    howToUse: [
      {
        title: "Join Midjourney on Discord",
        description: "Access Midjourney by joining the Discord server.",
        links: [{ label: "Midjourney", url: "https://www.midjourney.com" }]
      },
      {
        title: "Enter Text Prompts",
        description: "Use the /imagine command to create images from text."
      },
      {
        title: "Refine & Upscale",
        description: "Iteratively adjust prompts and upscale images as needed."
      },
      {
        title: "Download or Remix",
        description: "Download final images or remix public artworks."
      }
    ]
  },
  {
    name: "DALL·E",
    description: "OpenAI's model creating images from textual descriptions, integrated with ChatGPT.",
    url: "https://openai.com/dall-e",
    id: "dalle",
    image: "/tool-screenshots/dalle.png",
    logo: "/logo/dalle.png",
    categories: ["image"],
    subcategory: "Text-to-Image Generation",
    tags: ["text_to_image", "illustrations"],
    rating: 4.7,
    visits: 28700,
    dateAdded: "2021-01-05",
    isPremium: "Freemium",
    features: [
      "Text-to-Image Synthesis: Generates original images from descriptive text prompts.",
      "Inpainting: Edits and extends existing images using AI.",
      "Variations: Creates multiple versions of an image based on a single prompt.",
      "Integration with ChatGPT: Accessible directly within ChatGPT for seamless creative workflows."
    ],
    howToUse: [
      {
        title: "Access DALL·E",
        description: "Go to the DALL·E website or use via ChatGPT integration.",
        links: [
          { label: "DALL·E", url: "https://openai.com/dall-e" },
          { label: "ChatGPT", url: "https://chat.openai.com" }
        ]
      },
      {
        title: "Enter or Edit Prompts",
        description: "Write descriptive prompts or upload images for inpainting."
      },
      {
        title: "Generate Images & Variations",
        description: "Review generated images and create variations or edits."
      },
      {
        title: "Download or Integrate",
        description: "Export images or use them in creative workflows."
      }
    ]
  },
  {
    name: "Canva Magic Design",
    description: "AI-powered design assistant integrated with Canva for creating visual assets.",
    url: "https://www.canva.com/magic-design",
    id: "canva-magic-design",
    image: "/tool-screenshots/canva-magic-design.png",
    logo: "/logo/canva.png",
    categories: ["image"],
    subcategory: "Graphic Design Assistant",
    tags: ["templates", "design_assistant", "creative"],
    rating: 4.5,
    visits: 5000000,
    dateAdded: "2023-10-01",
    isPremium: "Freemium",
    features: [
      "Design Generation: Creates designs based on user input and preferences.",
      "Template Suggestions: Offers tailored templates for various needs.",
      "Content Integration: Incorporates user content into designs seamlessly.",
      "Real-Time Collaboration: Allows multiple users to work on designs simultaneously."
    ],
    howToUse: [
      {
        title: "Access Canva Magic Design",
        description: "Sign into Canva and access Magic Design from the dashboard.",
        links: [{ label: "Canva Magic Design", url: "https://www.canva.com/magic-design" }]
      },
      {
        title: "Start a New Project",
        description: "Describe your needs and get AI-generated designs and templates."
      },
      {
        title: "Customize & Collaborate",
        description: "Edit generated designs and collaborate in real-time."
      },
      {
        title: "Download or Publish",
        description: "Export designs or publish them directly from Canva."
      }
    ]
  },
  {
    name: "Recraft",
    description: "AI design tool for generating vector illustrations and UI assets.",
    url: "https://www.recraft.ai",
    id: "recraft",
    image: "/tool-screenshots/recraft.png",
    logo: "/logo/recraft.png",
    categories: ["image"],
    subcategory: "Vector Design Generation",
    tags: ["vector", "illustration", "branding_assets"],
    rating: 4.3,
    visits: 3800000,
    dateAdded: "2023-06-20",
    isPremium: "Freemium",
    features: [
      "Vector Art Generation: Produces scalable vector images from prompts.",
      "Style Transfer: Applies different artistic styles to images.",
      "Batch Processing: Handles multiple images simultaneously.",
      "Customizable Outputs: Allows adjustments to generated images."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Recraft",
        description: "Register for a free account and open the Recraft editor.",
        links: [{ label: "Recraft", url: "https://www.recraft.ai" }]
      },
      {
        title: "Create or Edit Vector Art",
        description: "Generate illustrations from prompts or upload and modify images."
      },
      {
        title: "Apply Styles & Export",
        description: "Customize styles and download assets for use in design projects."
      }
    ]
  },
  {
    name: "NightCafe",
    description: "A community-driven platform for generating artistic AI images.",
    url: "https://creator.nightcafe.studio",
    id: "nightcafe",
    image: "/tool-screenshots/nightcafe.png",
    logo: "/logo/nightcafe.png",
    categories: ["image"],
    subcategory: "Artistic Image Creation",
    tags: ["style_transfer", "AI_art", "community"],
    rating: 4.2,
    visits: 3900000,
    dateAdded: "2022-11-10",
    isPremium: "Freemium",
    features: [
      "Text-to-Image Creation: Generates images from textual descriptions.",
      "Style Transfer: Applies artistic styles to existing images.",
      "Community Features: Engages users through challenges and sharing.",
      "Print Options: Offers printing of created artworks."
    ],
    howToUse: [
      {
        title: "Sign Up & Access NightCafe",
        description: "Register for a free account at NightCafe Studio.",
        links: [{ label: "NightCafe", url: "https://creator.nightcafe.studio" }]
      },
      {
        title: "Choose Creation Mode",
        description: "Select between text-to-image generation or style transfer."
      },
      {
        title: "Enter Prompt or Upload Image",
        description: "Write a prompt for creation, or upload an image for style transfer."
      },
      {
        title: "Generate, Edit & Share",
        description: "Let AI create the image, then edit, download, print, or share in the community."
      }
    ]
  },
  {
    name: "Fotor AI",
    description: "AI-powered photo editing and image generation platform.",
    url: "https://www.fotor.com/features/ai-image-generator",
    id: "fotor-ai",
    image: "/tool-screenshots/fotor-ai.png",
    logo: "/logo/fotor.png",
    categories: ["image", "design"],
    subcategory: "Photo Editing & Generation",
    tags: ["photo_editing", "filters", "AI_portrait"],
    rating: 4.1,
    visits: 17800000,
    dateAdded: "2023-02-28",
    isPremium: "Freemium",
    features: [
      "Photo Enhancement: Improves image quality automatically.",
      "Background Removal: Eliminates backgrounds from photos.",
      "AI Retouching: Enhances portraits with AI tools.",
      "Artistic Effects: Applies creative filters to images."
    ],
    howToUse: [
      {
        title: "Go to Fotor AI Image Generator",
        description: "Access the Fotor AI web platform.",
        links: [{ label: "Fotor AI", url: "https://www.fotor.com/features/ai-image-generator" }]
      },
      {
        title: "Upload or Create Image",
        description: "Upload your photo or start from a text prompt to generate one."
      },
      {
        title: "Apply Enhancements",
        description: "Use AI tools for enhancement, retouching, or background removal."
      },
      {
        title: "Download & Share",
        description: "Export edited images or share them directly."
      }
    ]
  },
  {
    name: "Lexica Art",
    description: "Prompt search engine and gallery for AI-generated images.",
    url: "https://lexica.art",
    id: "lexica-art",
    image: "/tool-screenshots/lexica-art.png",
    logo: "/logo/lexica-art.png",
    categories: ["image"],
    subcategory: "AI Image Search & Generation",
    tags: ["prompt_reference", "gallery", "image_variants"],
    rating: 4.0,
    visits: 755900,
    dateAdded: "2022-12-05",
    isPremium: "Freemium",
    features: [
      "AI Image Search: Finds AI-generated images based on prompts.",
      "Prompt Inspiration: Provides ideas for image generation.",
      "High-Quality Outputs: Offers detailed and artistic images.",
      "User Gallery: Displays creations from the community."
    ],
    howToUse: [
      {
        title: "Visit Lexica Art",
        description: "Go to the Lexica Art website.",
        links: [{ label: "Lexica Art", url: "https://lexica.art" }]
      },
      {
        title: "Search or Browse Gallery",
        description: "Type a prompt to search the image database, or explore trending prompts and images."
      },
      {
        title: "Download or Use Prompts",
        description: "Download images or use prompts for inspiration in other AI tools."
      }
    ]
  },
  {
    name: "Playground AI",
    description: "Platform for creating and editing images using AI with various tools and filters.",
    url: "https://playgroundai.com",
    id: "playground-ai",
    image: "/tool-screenshots/playground-ai.png",
    logo: "/logo/playground-ai.png",
    categories: ["image"],
    subcategory: "Image Creation & Editing",
    tags: ["text_to_image", "inpainting", "style_filters"],
    rating: 4.0,
    visits: 171800,
    dateAdded: "2023-01-10",
    isPremium: "Freemium",
    features: [
      "Text-to-Image Generation: Creates images from textual prompts.",
      "Style Customization: Offers various artistic styles.",
      "Interactive Editing: Allows real-time adjustments to images.",
      "Community Sharing: Enables users to share and explore artworks."
    ],
    howToUse: [
      {
        title: "Access Playground AI",
        description: "Sign up for a free account at Playground AI.",
        links: [{ label: "Playground AI", url: "https://playgroundai.com" }]
      },
      {
        title: "Create or Edit Image",
        description: "Start a new image from text or edit/upload an image and apply effects."
      },
      {
        title: "Customize Styles",
        description: "Choose from a variety of filters, inpainting, and style options."
      },
      {
        title: "Export or Share",
        description: "Download, publish, or share your creation in the Playground AI community."
      }
    ]
  },
  {
    name: "ChatGPT",
    description: "General-purpose AI assistant for writing, editing, and brainstorming.",
    url: "https://chat.openai.com",
    id: "chatgpt",
    image: "/tool-screenshots/chatgpt.png",
    logo: "/logo/chatgpt.png",
    categories: ["text", "productivity"],
    subcategory: "General Writing Assistant",
    tags: ["chatbot", "content_creation", "summarization", "productivity", "brainstorming"],
    rating: 4.9,
    visits: 180000000,
    dateAdded: "2023-11-06",
    isPremium: "Freemium",
    features: [
      "Multimodal Input: Understands text, images, and voice commands.",
      "Code Interpreter: Performs data analysis, calculations, and file transformations.",
      "Memory: Remembers user preferences and past interactions (selectively).",
      "Advanced Reasoning: Excels at logic, problem-solving, and creative writing tasks."
    ],
    howToUse: [
      {
        title: "Go to ChatGPT",
        description: "Sign in or sign up on ChatGPT's website.",
        links: [{ label: "ChatGPT", url: "https://chat.openai.com" }]
      },
      {
        title: "Start a New Chat",
        description: "Type your question, prompt, or task for writing, editing, or brainstorming."
      },
      {
        title: "Use Advanced Tools",
        description: "Leverage code interpreter, data analysis, and image input features."
      },
      {
        title: "Save or Share Output",
        description: "Copy, export, or continue chats for future use."
      }
    ]
  },
  {
    name: "Claude 3",
    description: "Conversational AI with long memory and reliable, safe writing output.",
    url: "https://claude.ai",
    id: "claude-3",
    image: "/tool-screenshots/claude.png",
    logo: "/logo/claude.png",
    categories: ["text"],
    subcategory: "Research & Long-form Writing",
    tags: ["long_context", "safe_AI", "research", "creative_writing", "Q&A"],
    rating: 4.7,
    visits: 35000000,
    dateAdded: "2024-03-05",
    isPremium: "Freemium",
    features: [
      "Long Context Handling: Processes documents up to 200K tokens.",
      "Safety & Alignment: Optimized for reliable, safe responses.",
      "Creative Writing: Generates detailed, imaginative content.",
      "Helpful for Research: Answers questions based on long-form material."
    ],
    howToUse: [
      {
        title: "Sign Up or Log In",
        description: "Access Claude 3 by registering on the website.",
        links: [{ label: "Claude 3", url: "https://claude.ai" }]
      },
      {
        title: "Upload or Paste Content",
        description: "Paste large documents, ask research questions, or start creative tasks."
      },
      {
        title: "Leverage Long Context",
        description: "Use Claude for summarization, analysis, or detailed creative writing."
      },
      {
        title: "Export or Continue",
        description: "Copy results or continue long-form conversations."
      }
    ]
  },
  {
    name: "Gemini 1.5 Pro",
    description: "Google's advanced AI for factual writing and multilingual support.",
    url: "https://gemini.google.com",
    id: "gemini-1-5-pro",
    image: "/tool-screenshots/gemini-1-5-pro.png",
    logo: "/logo/gemini.png",
    categories: ["text"],
    subcategory: "Factual Writing & Multilingual",
    tags: ["translation", "academic", "factual", "multilingual", "summarization"],
    rating: 4.6,
    visits: 15000000,
    dateAdded: "2024-02-20",
    isPremium: "Freemium",
    features: [
      "Multilingual Support: Translates and understands content across languages.",
      "Accurate Summarization: Extracts key ideas from long documents.",
      "Factual Consistency: Prioritizes fact-checking and evidence-backed output.",
      "Academic Writing: Generates citations, structured arguments, and reports."
    ],
    howToUse: [
      {
        title: "Access Gemini 1.5 Pro",
        description: "Visit Gemini's website and sign in with a Google account.",
        links: [{ label: "Gemini 1.5 Pro", url: "https://gemini.google.com" }]
      },
      {
        title: "Input Documents or Prompts",
        description: "Paste text, documents, or ask multilingual questions."
      },
      {
        title: "Request Summaries or Translations",
        description: "Ask for summaries, translations, or academic writing tasks."
      },
      {
        title: "Export or Use Output",
        description: "Copy, download, or use content in your workflow."
      }
    ]
  },
  {
    name: "Writer.com",
    description: "Enterprise-grade writing assistant for brand-safe, compliant content.",
    url: "https://writer.com",
    id: "writer-com",
    image: "/tool-screenshots/writer-com.png",
    logo: "/logo/writer.png",
    categories: ["text"],
    subcategory: "Enterprise Content Governance",
    tags: ["compliance", "style_guide", "team_collaboration", "branding", "corporate"],
    rating: 4.4,
    visits: 950000,
    dateAdded: "2022-03-10",
    isPremium: "Premium",
    features: [
      "Style Guide Enforcement: Enforces brand writing rules and tone.",
      "Enterprise Privacy: Designed for regulated industries (SOC2, HIPAA).",
      "AI Writing Assistant: Edits, rephrases, and drafts high-quality content.",
      "Team Management: Permissions, analytics, and document control."
    ],
    howToUse: [
      {
        title: "Sign Up & Set Up Workspace",
        description: "Register a team or enterprise account and set up a workspace.",
        links: [{ label: "Writer.com", url: "https://writer.com" }]
      },
      {
        title: "Upload Style Guide & Content",
        description: "Add brand guidelines and documents for enforcement."
      },
      {
        title: "Edit & Collaborate",
        description: "Leverage AI for editing, compliance, and workflow management."
      },
      {
        title: "Export or Integrate",
        description: "Download content or integrate with enterprise tools."
      }
    ]
  },
  {
    name: "INK for All",
    description: "SEO content optimization assistant.",
    url: "https://inkforall.com",
    id: "ink-for-all",
    image: "/tool-screenshots/ink-for-all.png",
    logo: "/logo/ink-for-all.png",
    categories: ["text"],
    subcategory: "SEO Content Optimization",
    tags: ["SEO", "content_marketing", "blogging", "rank_optimization", "writing_assistant"],
    rating: 4.2,
    visits: 620000,
    dateAdded: "2023-09-12",
    isPremium: "Freemium",
    features: [
      "SEO Score: Real-time ranking predictions and optimization tips.",
      "AI Writer: Assists with blog writing, content generation, and outlines.",
      "Plagiarism Checker: Built-in content originality checker.",
      "Accessibility Checker: Ensures content meets inclusive standards."
    ],
    howToUse: [
      {
        title: "Register & Access INK",
        description: "Create an account and start a new content project.",
        links: [{ label: "INK for All", url: "https://inkforall.com" }]
      },
      {
        title: "Input or Generate Content",
        description: "Paste or generate blog posts, articles, or marketing copy."
      },
      {
        title: "Optimize for SEO",
        description: "Use INK's optimization and plagiarism tools."
      },
      {
        title: "Export & Publish",
        description: "Download or publish the optimized content."
      }
    ]
  },
  {
    name: "Wordtune",
    description: "AI-powered rewriting and tone enhancement assistant.",
    url: "https://www.wordtune.com",
    id: "wordtune",
    image: "/tool-screenshots/wordtune.png",
    logo: "/logo/wordtune.png",
    categories: ["text"],
    subcategory: "Text Rewriting & Refinement",
    tags: ["rephrasing", "tone_adjustment", "clarity", "grammar", "style_editing"],
    rating: 4.2,
    visits: 830000,
    dateAdded: "2020-09-25",
    isPremium: "Freemium",
    features: [
      "Rewrite Suggestions: Offers multiple tone-based rewrites (casual, formal).",
      "Summarizer: Condenses long documents or webpages instantly.",
      "AI Writing Tool: Helps generate intros, conclusions, and full drafts.",
      "Grammar & Clarity: Enhances sentence structure and readability."
    ],
    howToUse: [
      {
        title: "Sign Up & Add Extension",
        description: "Create an account and add the Wordtune browser extension or use the web editor.",
        links: [{ label: "Wordtune", url: "https://www.wordtune.com" }]
      },
      {
        title: "Paste or Write Text",
        description: "Input the content you want to rewrite or summarize."
      },
      {
        title: "Choose Rewrite or Summarize",
        description: "Select tone, style, or summarization options."
      },
      {
        title: "Export or Copy Output",
        description: "Copy results or export to use in your workflow."
      }
    ]
  },
  {
    name: "Sudowrite",
    description: "Creative writing tool for fiction authors and storytellers.",
    url: "https://www.sudowrite.com",
    id: "sudowrite",
    image: "/tool-screenshots/sudowrite.png",
    logo: "/logo/sudowrite.png",
    categories: ["text"],
    subcategory: "Creative & Fiction Writing",
    tags: ["storytelling", "novel", "fiction", "creative", "character_generation"],
    rating: 4.6,
    visits: 450000,
    dateAdded: "2021-12-05",
    isPremium: "Premium",
    features: [
      "Story Engine: Generates plot, character arcs, and scene ideas.",
      "Describe Tool: Adds vivid sensory detail to any sentence.",
      "Brainstorming: Provides creative prompts and idea expansions.",
      "Rewrite & Expand: Adjust pacing, tone, and dialogue."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Sudowrite",
        description: "Register and log in to Sudowrite's web platform.",
        links: [{ label: "Sudowrite", url: "https://www.sudowrite.com" }]
      },
      {
        title: "Start a New Project",
        description: "Begin a story, novel, or creative writing project."
      },
      {
        title: "Use AI Tools",
        description: "Generate plots, expand ideas, rewrite text, or add vivid descriptions using the Story Engine and Describe Tool."
      },
      {
        title: "Edit, Save & Export",
        description: "Refine your work and export or share your writing as needed."
      }
    ]
  },
  {
    name: "Writesonic",
    description: "All-in-one AI platform for marketing content and chatbots.",
    url: "https://writesonic.com",
    id: "writesonic",
    image: "/tool-screenshots/writesonic.png",
    logo: "/logo/writesonic.png",
    categories: ["text"],
    subcategory: "Multi-Tool for Marketing Teams",
    tags: ["AI_writer", "chatbot", "image_generation", "landing_pages", "bulk_content"],
    rating: 4.3,
    visits: 1700000,
    dateAdded: "2021-07-22",
    isPremium: "Freemium",
    features: [
      "AI Article Writer: Generates blog posts and web content in minutes.",
      "Chatsonic Assistant: Chatbot with real-time web access.",
      "Landing Page Generator: Tailors content for product launches.",
      "Bulk Content Creation: Produce multiple pieces at scale."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Register on Writesonic and access the dashboard.",
        links: [{ label: "Writesonic", url: "https://writesonic.com" }]
      },
      {
        title: "Select Content Type",
        description: "Choose from blog, ad copy, landing page, or chatbot."
      },
      {
        title: "Provide Prompts & Info",
        description: "Input your product, business, or campaign details."
      },
      {
        title: "Generate & Edit",
        description: "Review, edit, and export generated content or images."
      }
    ]
  },
  {
    name: "Anyword",
    description: "Ad copy and SEO tool with predictive performance scoring.",
    url: "https://anyword.com",
    id: "anyword",
    image: "/tool-screenshots/anyword.png",
    logo: "/logo/anyword.png",
    categories: ["text"],
    subcategory: "Predictive Ad Copywriting",
    tags: ["performance_score", "ads", "marketing_AI", "conversion_optimization", "A/B_testing"],
    rating: 4.5,
    visits: 980000,
    dateAdded: "2022-08-18",
    isPremium: "Premium",
    features: [
      "Predictive Performance Score: Forecasts content effectiveness.",
      "Ad Generator: Creates headlines, CTAs, and variations for testing.",
      "Persona Targeting: Tailors copy based on audience segments.",
      "SEO Mode: Optimizes content for rankings and readability."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Create an account and access the Anyword platform.",
        links: [{ label: "Anyword", url: "https://anyword.com" }]
      },
      {
        title: "Input Target & Goals",
        description: "Set your audience, goals, and marketing context."
      },
      {
        title: "Generate Ad Copy",
        description: "Use AI to create, test, and optimize content with predictive scores."
      },
      {
        title: "Export & Implement",
        description: "Download or use the generated copy in your campaigns."
      }
    ]
  },
  {
    name: "Notion AI",
    description: "Built-in AI assistant for summarizing and generating content within Notion.",
    url: "https://www.notion.so/product/ai",
    id: "notion-ai",
    image: "/tool-screenshots/notion-ai.png",
    logo: "/logo/notion.png",
    categories: ["text"],
    subcategory: "Note-Taking & Productivity",
    tags: ["note_taking", "task_management", "summarization", "meeting_notes", "knowledge_management"],
    rating: 4.6,
    visits: 30000000,
    dateAdded: "2023-02-01",
    isPremium: "Freemium",
    features: [
      "Writing Assistant: Generates, rewrites, and summarizes content.",
      "Task Automation: Completes repetitive content workflows.",
      "Brainstorming: Helps ideate content from prompts.",
      "Inline Suggestions: Enhances writing directly in Notion docs."
    ],
    howToUse: [
      {
        title: "Enable Notion AI",
        description: "Sign in to Notion and enable AI for your workspace.",
        links: [{ label: "Notion AI", url: "https://www.notion.so/product/ai" }]
      },
      {
        title: "Use AI Block",
        description: "Add an AI block or use slash commands to generate, summarize, or rewrite content."
      },
      {
        title: "Edit & Organize",
        description: "Edit AI outputs and organize your notes, tasks, or projects."
      }
    ]
  },
  {
    name: "Runway",
    description: "AI-powered video editor and generator with Gen-2 and text-to-video capabilities.",
    url: "https://runwayml.com",
    id: "runway",
    image: "/tool-screenshots/runway.png",
    logo: "/logo/runway.png",
    categories: ["video"],
    subcategory: "AI Video Editing & Generation",
    tags: ["video_editing", "genAI", "green_screen", "style_transfer", "inpainting"],
    rating: 4.5,
    visits: 8100000,
    dateAdded: "2022-11-01",
    isPremium: "Freemium",
    features: [
      "AI Video Editing: Provides tools for background removal, color grading, and face blurring.",
      "Text-to-Video Generation: Generates videos from static images or text prompts using the Gen-3 Alpha model.",
      "Real-Time Collaboration: Allows multiple users to work simultaneously on a single project.",
      "Comprehensive Media Tools: Offers a suite of tools for generating and manipulating images, audio, and 3D assets."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Runway",
        description: "Create an account and open the Runway web platform.",
        links: [{ label: "Runway", url: "https://runwayml.com" }]
      },
      {
        title: "Import or Create Video",
        description: "Upload media or use AI for video creation and editing."
      },
      {
        title: "Edit, Generate & Collaborate",
        description: "Use tools for editing, text-to-video, and real-time collaboration."
      },
      {
        title: "Export Results",
        description: "Download or share finished videos."
      }
    ]
  },
  {
    name: "Pictory",
    description: "Convert scripts or articles into shareable videos using AI.",
    url: "https://pictory.ai",
    id: "pictory",
    image: "/tool-screenshots/pictory.png",
    logo: "/logo/pictory.png",
    categories: ["video"],
    subcategory: "Script/Text to Video Automation",
    tags: ["text_to_video", "content_repurposing", "video_summarization", "social_media"],
    rating: 4.4,
    visits: 2400000,
    dateAdded: "2022-06-10",
    isPremium: "Freemium",
    features: [
      "Script to Video: Convert scripts into professional-quality videos with AI voices.",
      "Blog to Video: Transform blog posts into engaging videos.",
      "Auto Captioning: Automatically generate captions for videos.",
      "Video Summarization: Summarize long videos into short highlights."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Pictory",
        description: "Register at Pictory and use the dashboard to start a project.",
        links: [{ label: "Pictory", url: "https://pictory.ai" }]
      },
      {
        title: "Upload Script or Article",
        description: "Input your article, blog, or script for conversion."
      },
      {
        title: "Edit & Customize Video",
        description: "Choose scenes, captions, and AI voices."
      },
      {
        title: "Export & Share",
        description: "Download or publish your finished video."
      }
    ]
  },
  {
    name: "Fliki",
    description: "Generate videos with voiceovers from scripts, blogs, or tweets.",
    url: "https://fliki.ai",
    id: "fliki",
    image: "/tool-screenshots/fliki.png",
    logo: "/logo/fliki.png",
    categories: ["video"],
    subcategory: "Text-to-Video with Voiceover",
    tags: ["text_to_video", "voiceover", "short_form_video", "social_clips", "branding"],
    rating: 4.5,
    visits: 1900000,
    dateAdded: "2023-01-05",
    isPremium: "Freemium",
    features: [
      "Text to Video: Transform text into videos with lifelike AI voices.",
      "Multilingual Support: Supports over 75 languages and 900 voices.",
      "AI Voiceovers: Generate realistic voiceovers for videos.",
      "Script Generation: Automatically generate scripts for videos."
    ],
    howToUse: [
      {
        title: "Create Account & Access Fliki",
        description: "Sign up on Fliki and open the creative studio.",
        links: [{ label: "Fliki", url: "https://fliki.ai" }]
      },
      {
        title: "Input Script or Text",
        description: "Paste your script, blog, or tweet to begin."
      },
      {
        title: "Choose Voices & Edit",
        description: "Select voices, languages, and edit scenes or timing."
      },
      {
        title: "Generate & Export",
        description: "Create the video and export or share as needed."
      }
    ]
  },
  {
    name: "CapCut",
    description: "TikTok's official video editing tool with AI features and templates.",
    url: "https://www.capcut.com",
    id: "capcut",
    image: "/tool-screenshots/capcut.png",
    logo: "/logo/capcut.png",
    categories: ["video"],
    subcategory: "Consumer-Level AI Video Editing",
    tags: ["video_templates", "shorts", "filters", "background_removal", "mobile_editing"],
    rating: 4.4,
    visits: 45000000,
    dateAdded: "2021-03-15",
    isPremium: "Free",
    features: [
      "Advanced Editing Tools: Features like keyframe animation, chroma key, and more.",
      "AI Video Editing: Automated editing features like auto-captions and filler word removal.",
      "Social Media Integration: Direct exports to platforms like TikTok.",
      "Text-to-Speech: Convert text into speech for videos."
    ],
    howToUse: [
      {
        title: "Open CapCut",
        description: "Go to CapCut via browser or mobile app.",
        links: [{ label: "CapCut", url: "https://www.capcut.com" }]
      },
      {
        title: "Import or Record Video",
        description: "Upload video files or record directly."
      },
      {
        title: "Edit with AI Tools",
        description: "Apply filters, templates, auto-captions, and more."
      },
      {
        title: "Export & Share",
        description: "Download or share directly to social platforms."
      }
    ]
  },
  {
    name: "Lumen5",
    description: "Turn blog posts into engaging marketing videos using AI.",
    url: "https://www.lumen5.com",
    id: "lumen5",
    image: "/tool-screenshots/lumen5.png",
    logo: "/logo/lumen5.png",
    categories: ["video"],
    subcategory: "AI Marketing Video Builder",
    tags: ["promo_videos", "content_marketing", "drag_and_drop", "automation", "text_overlay"],
    rating: 4.2,
    visits: 616700,
    dateAdded: "2020-12-01",
    isPremium: "Freemium",
    features: [
      "AI-Powered Video Creation: Turn blog posts into engaging videos.",
      "Drag-and-Drop Interface: User-friendly interface for easy video creation.",
      "Extensive Media Library: Access to millions of stock photos and videos.",
      "Customizable Templates: Various templates tailored for different platforms."
    ],
    howToUse: [
      {
        title: "Create Account & Log In",
        description: "Sign up on Lumen5 and access the video builder.",
        links: [{ label: "Lumen5", url: "https://www.lumen5.com" }]
      },
      {
        title: "Input Blog or Script",
        description: "Paste a blog post or script for video generation."
      },
      {
        title: "Customize & Edit",
        description: "Adjust visuals, layout, and add branding or music."
      },
      {
        title: "Export & Share",
        description: "Download or publish your marketing video."
      }
    ]
  },
  {
    name: "Veed.io",
    description: "Online video editing platform with subtitles, AI tools, and effects.",
    url: "https://www.veed.io",
    id: "veed-io",
    image: "/tool-screenshots/veed-io.png",
    logo: "/logo/veed.png",
    categories: ["video"],
    subcategory: "Online Video Editing + AI Tools",
    tags: ["subtitling", "auto_transcription", "filters", "branding", "reels"],
    rating: 4.3,
    visits: 10900000,
    dateAdded: "2021-02-15",
    isPremium: "Freemium",
    features: [
      "Online Video Editing: Edit videos directly in the browser.",
      "Auto Subtitles: Automatically generate subtitles for videos.",
      "AI Tools: Features like text-to-video, AI avatars, and more.",
      "Collaboration Features: Collaborate with team members on video projects."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Studio",
        description: "Create an account on Veed.io and open the editor.",
        links: [{ label: "Veed.io", url: "https://www.veed.io" }]
      },
      {
        title: "Upload or Record Video",
        description: "Add video files or record directly in the browser."
      },
      {
        title: "Edit & Enhance",
        description: "Use AI tools for subtitles, avatars, effects, and more."
      },
      {
        title: "Export & Share",
        description: "Download or share finished videos online."
      }
    ]
  },
  {
    name: "Wisecut",
    description: "Auto-edit talking-head videos with jump cuts, subtitles, and background music.",
    url: "https://www.wisecut.video",
    id: "wisecut",
    image: "/tool-screenshots/wisecut.png",
    logo: "/logo/wisecut.png",
    categories: ["video"],
    subcategory: "Auto-Editing for Talking Heads",
    tags: ["jump_cut", "auto_subtitles", "music_sync", "YouTube", "e_learning"],
    rating: 4.2,
    visits: 32700,
    dateAdded: "2021-08-20",
    isPremium: "Freemium",
    features: [
      "Automatic Video Editing: Automatically edit videos by removing silences and adding music.",
      "Auto Captioning: Generate captions for videos automatically.",
      "Voice Recognition: Edit videos based on voice commands.",
      "Background Music: Add background music that adapts to the video's tone."
    ],
    howToUse: [
      {
        title: "Sign Up & Upload Video",
        description: "Register at Wisecut and upload a talking-head video.",
        links: [{ label: "Wisecut", url: "https://www.wisecut.video" }]
      },
      {
        title: "Auto-Edit with AI",
        description: "Let Wisecut remove silences, add jump cuts, music, and subtitles automatically."
      },
      {
        title: "Edit & Customize",
        description: "Fine-tune the edit, captions, and effects as needed."
      },
      {
        title: "Export & Share",
        description: "Download your video or share it on YouTube/social media."
      }
    ]
  },
  {
    name: "Animoto",
    description: "Create slideshows and marketing videos with templates and stock footage.",
    url: "https://animoto.com",
    id: "animoto",
    image: "/tool-screenshots/animoto.png",
    logo: "/logo/animoto.png",
    categories: ["video"],
    subcategory: "Template-Based Video Builder",
    tags: ["social_video", "slideshow", "ecommerce", "storyboarding", "templates"],
    rating: 4.1,
    visits: 533100,
    dateAdded: "2019-11-12",
    isPremium: "Freemium",
    features: [
      "Drag-and-Drop Interface: Easily create videos with a user-friendly interface.",
      "Customizable Templates: Various templates for different video types.",
      "Music Library: Access to a vast library of licensed music tracks.",
      "Text and Voiceover Integration: Add text overlays and voiceovers to videos."
    ],
    howToUse: [
      {
        title: "Sign Up & Start Project",
        description: "Create an Animoto account and start a new video project.",
        links: [{ label: "Animoto", url: "https://animoto.com" }]
      },
      {
        title: "Upload Media & Choose Template",
        description: "Add images, clips, or select a template for your video."
      },
      {
        title: "Customize Video",
        description: "Edit scenes, add music, text overlays, and voiceovers."
      },
      {
        title: "Export & Share",
        description: "Download or share your completed video."
      }
    ]
  },
  {
    name: "Colossyan",
    description: "Generate explainer and training videos with avatars and slides.",
    url: "https://www.colossyan.com",
    id: "colossyan",
    image: "/tool-screenshots/colossyan.png",
    logo: "/logo/colossyan.png",
    categories: ["video"],
    subcategory: "Training & Explainer Video Automation",
    tags: ["AI_presenters", "learning_videos", "HR_training", "compliance", "slides_to_video"],
    rating: 4.2,
    visits: 172000,
    dateAdded: "2023-05-10",
    isPremium: "Freemium",
    features: [
      "AI Video Generation: Create videos with AI-generated avatars.",
      "Multilingual Support: Generate videos in multiple languages.",
      "Custom Avatars: Create personalized AI avatars for videos.",
      "Script to Video: Convert scripts into videos with AI avatars."
    ],
    howToUse: [
      {
        title: "Sign Up & Start New Project",
        description: "Register on Colossyan and start a new video project.",
        links: [{ label: "Colossyan", url: "https://www.colossyan.com" }]
      },
      {
        title: "Upload Script or Slides",
        description: "Input your training script or upload presentation slides."
      },
      {
        title: "Choose Avatar and Language",
        description: "Select an AI-generated avatar and set the video language."
      },
      {
        title: "Edit, Generate & Export",
        description: "Customize scenes, preview the video, and export the finished file for training or HR use."
      }
    ]
  },
  {
    name: "Magisto",
    description: "AI-powered video creation from uploaded clips and photos.",
    url: "https://www.magisto.com",
    id: "magisto",
    image: "/tool-screenshots/magisto.png",
    logo: "/logo/magisto.png",
    categories: ["video"],
    subcategory: "Smart Video Editing from Clips",
    tags: ["mobile_editing", "AI_editing", "auto_clips", "highlight_reels", "social_sharing"],
    rating: 4.0,
    visits: 150200,
    dateAdded: "2020-04-17",
    isPremium: "Freemium",
    features: [
      "Automated Video Editing: AI-powered editing to create videos quickly.",
      "Smart Storyboard: Automatically selects the best parts of your footage.",
      "Music Integration: Add music tracks that fit the video's mood.",
      "Social Sharing: Easily share videos on various social media platforms."
    ],
    howToUse: [
      {
        title: "Sign Up & Upload Media",
        description: "Register at Magisto, then upload your video clips or photos.",
        links: [{ label: "Magisto", url: "https://www.magisto.com" }]
      },
      {
        title: "Choose Style & Music",
        description: "Select a video style and music track to match your content's mood."
      },
      {
        title: "Let AI Edit",
        description: "Magisto's AI will automatically create a video by selecting highlights and syncing with music."
      },
      {
        title: "Edit, Download & Share",
        description: "Make final tweaks, then download or share your video on social platforms."
      }
    ]
  },
  {
    name: "Databricks",
    description: "Unified data analytics platform for big data and AI workloads.",
    url: "https://www.databricks.com",
    id: "databricks",
    image: "/tool-screenshots/databricks.png",
    logo: "/logo/databricks.png",
    categories: ["data-processing"],
    subcategory: "Data Lakehouse Platform",
    tags: ["big_data", "data_engineering", "machine_learning", "spark", "lakehouse"],
    rating: 4.8,
    visits: 3850000,
    dateAdded: "2023-05-15",
    isPremium: "Premium",
    features: [
      "Unified Data Platform: Combines data engineering, data science, machine learning, and analytics into a single collaborative platform.",
      "Delta Lake: Provides reliable data lakes with ACID transaction support, scalable metadata handling, and unification of streaming and batch data.",
      "Collaborative Notebooks: Enables teams to write and run code together in real time using languages like Python, SQL, Scala, and R.",
      "MLflow Integration: Built-in support for experiment tracking, model versioning, and reproducible machine learning workflows."
    ],
    howToUse: [
      {
        title: "Start Free Trial or Request Demo",
        description: "Sign up for a Databricks account or request a demo to access the platform.",
        links: [{ label: "Databricks", url: "https://www.databricks.com" }]
      },
      {
        title: "Create Workspace & Import Data",
        description: "Set up a workspace and upload datasets or connect to cloud storage."
      },
      {
        title: "Use Collaborative Notebooks",
        description: "Write and execute code for data engineering, analysis, or machine learning in Python, SQL, Scala, or R."
      },
      {
        title: "Deploy Models & Monitor",
        description: "Deploy ML models with MLflow and monitor data pipelines and analytics."
      }
    ]
  },
  {
    name: "Tableau",
    description: "Interactive data visualization software for business intelligence.",
    url: "https://www.tableau.com",
    id: "tableau",
    image: "/tool-screenshots/tableau.png",
    logo: "/logo/tableau.png",
    categories: ["data-processing"],
    subcategory: "Data Visualization",
    tags: ["data_visualization", "business_intelligence", "dashboards", "analytics"],
    rating: 4.7,
    visits: 2500000,
    dateAdded: "2022-11-20",
    isPremium: "Premium",
    features: [
      "Interactive Dashboards: Create real-time, interactive visualizations with drag-and-drop functionality.",
      "Data Blending: Combine data from multiple sources for comprehensive analysis.",
      "Forecasting Tools: Utilize built-in forecasting to predict trends and patterns.",
      "Explain Data: Automatically generate explanations for data points to uncover insights."
    ],
    howToUse: [
      {
        title: "Download Tableau & Start Trial",
        description: "Get Tableau Desktop or use Tableau Cloud for a free trial.",
        links: [{ label: "Tableau", url: "https://www.tableau.com" }]
      },
      {
        title: "Connect Data Sources",
        description: "Import or connect to databases, spreadsheets, or cloud data."
      },
      {
        title: "Create Visualizations",
        description: "Drag and drop fields to build interactive dashboards and charts."
      },
      {
        title: "Analyze & Share",
        description: "Use forecasting and data explanations, then publish dashboards online or embed in reports."
      }
    ]
  },
  {
    name: "Microsoft Power BI",
    description: "Business analytics service providing interactive visualizations.",
    url: "https://powerbi.microsoft.com",
    id: "power-bi",
    image: "/tool-screenshots/power-bi.png",
    logo: "/logo/power-bi.png",
    categories: ["data-processing"],
    subcategory: "Business Intelligence",
    tags: ["data_analysis", "reporting", "dashboards", "microsoft"],
    rating: 4.6,
    visits: 3200000,
    dateAdded: "2022-09-10",
    isPremium: "Freemium",
    features: [
      "Data Connectivity: Connect to a wide range of data sources, including Excel, SQL Server, and cloud-based services.",
      "Custom Visualizations: Create and import custom visuals to tailor reports to specific needs.",
      "Natural Language Queries: Ask questions in natural language to get instant answers from your data.",
      "Real-Time Dashboards: Monitor data in real-time with live dashboards and alerts."
    ],
    howToUse: [
      {
        title: "Sign Up & Download Power BI",
        description: "Create a Microsoft account and download Power BI Desktop or use Power BI Service online.",
        links: [{ label: "Microsoft Power BI", url: "https://powerbi.microsoft.com" }]
      },
      {
        title: "Connect Data Sources",
        description: "Import data from Excel, SQL databases, cloud sources, etc."
      },
      {
        title: "Build Visualizations",
        description: "Drag and drop fields onto the canvas to create interactive reports and dashboards."
      },
      {
        title: "Ask Questions & Share",
        description: "Use natural language queries to explore data and publish dashboards for team access."
      }
    ]
  },
  {
    name: "Julius AI",
    description: "AI assistant for data analysis and visualization.",
    url: "https://www.julius.ai",
    id: "julius-ai",
    image: "/tool-screenshots/julius-ai.png",
    logo: "/logo/julius-ai.png",
    categories: ["data-processing"],
    subcategory: "AI Data Assistant",
    tags: ["data_analysis", "ai_assistant", "visualization", "natural_language"],
    rating: 4.4,
    visits: 80000,
    dateAdded: "2023-06-12",
    isPremium: "Freemium",
    features: [
      "Data Analysis: Perform complex data analyses using AI-driven tools.",
      "Graph & Chart Creation: Automatically generate visual representations of data.",
      "Research Assistance: Conduct research with AI support for data gathering and summarization.",
      "Mathematical Problem Solving: Solve equations and mathematical problems using AI capabilities."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Julius AI",
        description: "Register for an account and log in to the Julius AI platform.",
        links: [{ label: "Julius AI", url: "https://www.julius.ai" }]
      },
      {
        title: "Upload or Link Data",
        description: "Import your data or connect to data sources for analysis."
      },
      {
        title: "Ask Questions & Analyze",
        description: "Use natural language or select tools to explore data, generate charts, or get AI-driven insights."
      },
      {
        title: "Download & Share Results",
        description: "Export analyses or charts for reporting and collaboration."
      }
    ]
  },
  {
    name: "Simple Analytics",
    description: "Privacy-focused analytics platform that tracks website usage without cookies.",
    url: "https://simpleanalytics.com",
    id: "simple-analytics",
    image: "/tool-screenshots/simple-analytics.png",
    logo: "/logo/simple-analytics.png",
    categories: ["data-processing"],
    subcategory: "analytics",
    tags: ["AI", "analytics", "privacy"],
    rating: 4.6,
    visits: 800000,
    dateAdded: "2022-03-15",
    isPremium: 'Free',
    features: [
      "Privacy-First Tracking: Collects website analytics without using cookies, ensuring user privacy.",
      "Event and Goal Tracking: Allows setting up goals and tracking specific events on your website.",
      "Clean Dashboard: Provides an intuitive, one-page dashboard for quick insights.",
      "Data Export: Offers easy data export options for further analysis."
    ],
    howToUse: [
      {
        title: "Sign Up & Add Website",
        description: "Create a Simple Analytics account and add your website.",
        links: [{ label: "Simple Analytics", url: "https://simpleanalytics.com" }]
      },
      {
        title: "Integrate Tracking Code",
        description: "Install the provided JavaScript snippet on your website."
      },
      {
        title: "Monitor Dashboard",
        description: "View traffic, events, and goals in the clean, privacy-focused dashboard."
      },
      {
        title: "Export Data",
        description: "Download analytics data for further analysis or compliance."
      }
    ]
  },
  {
    name: "Akkio",
    description: "AI platform for building and deploying predictive models.",
    url: "https://www.akkio.com",
    id: "akkio",
    image: "/tool-screenshots/akkio.png",
    logo: "/logo/akkio.png",
    categories: ["data-processing"],
    subcategory: "Predictive Analytics",
    tags: ["machine_learning", "predictive_models", "no_code", "data_analysis"],
    rating: 4.5,
    visits: 120000,
    dateAdded: "2023-01-22",
    isPremium: "Freemium",
    features: [
      "No-Code AI Modeling: Build predictive models without coding, ideal for marketing and sales analytics.",
      "Chat Explore™: Interact with data using natural language queries.",
      "Data Preparation Tools: Clean and transform data efficiently.",
      "Generative Reports: Automatically generate insights and reports from data."
    ],
    howToUse: [
      {
        title: "Register & Log In",
        description: "Sign up for Akkio and access the platform dashboard.",
        links: [{ label: "Akkio", url: "https://www.akkio.com" }]
      },
      {
        title: "Upload Data",
        description: "Import your datasets for analysis and modeling."
      },
      {
        title: "Build Predictive Models",
        description: "Use no-code tools or Chat Explore™ to create and train AI models."
      },
      {
        title: "Deploy & Share Insights",
        description: "Deploy models in production or export reports for your team."
      }
    ]
  },
  {
    name: "MonkeyLearn",
    description: "Text analysis tool for extracting insights from text data.",
    url: "https://monkeylearn.com",
    id: "monkeylearn",
    image: "/tool-screenshots/monkeylearn.png",
    logo: "/logo/monkeylearn.png",
    categories: ["data-processing"],
    subcategory: "Text Analysis",
    tags: ["nlp", "text_analysis", "machine_learning", "data_extraction"],
    rating: 4.4,
    visits: 90000,
    dateAdded: "2022-10-30",
    isPremium: "Freemium",
    features: [
      "Text Classification: Categorize text data using machine learning.",
      "Sentiment Analysis: Determine the sentiment of text data.",
      "Custom Model Training: Train models tailored to specific needs.",
      "Data Visualization: Visualize text analysis results for easier interpretation."
    ],
    howToUse: [
      {
        title: "Create Account & Log In",
        description: "Sign up on MonkeyLearn and access the dashboard.",
        links: [{ label: "MonkeyLearn", url: "https://monkeylearn.com" }]
      },
      {
        title: "Import Text Data",
        description: "Upload documents, reviews, or other text for analysis."
      },
      {
        title: "Select or Train Models",
        description: "Use prebuilt models or train custom ones for classification or sentiment analysis."
      },
      {
        title: "Analyze & Visualize",
        description: "View analytics and visualizations, then export results as needed."
      }
    ]
  },
  {
    name: "Sisense",
    description: "Business intelligence software for complex data analysis.",
    url: "https://www.sisense.com",
    id: "sisense",
    image: "/tool-screenshots/sisense.png",
    logo: "/logo/sisense.png",
    categories: ["data-processing"],
    subcategory: "Business Intelligence",
    tags: ["data_integration", "analytics", "dashboards", "big_data"],
    rating: 4.6,
    visits: 1100000,
    dateAdded: "2022-07-14",
    isPremium: "Premium",
    features: [
      "Data Integration: Connect to various data sources, including databases and cloud services.",
      "Custom Dashboards: Create personalized dashboards to monitor key metrics.",
      "Embedded Analytics: Integrate analytics into your own applications.",
      "Scalability: Handle large datasets and scale as your data grows."
    ],
    howToUse: [
      {
        title: "Contact Sisense & Start Trial",
        description: "Request a demo or start a free trial on the Sisense website.",
        links: [{ label: "Sisense", url: "https://www.sisense.com" }]
      },
      {
        title: "Connect Data Sources",
        description: "Integrate databases, cloud services, and other sources."
      },
      {
        title: "Build Custom Dashboards",
        description: "Design dashboards and reports tailored to your business needs."
      },
      {
        title: "Deploy & Scale",
        description: "Embed analytics into apps or scale for big data workflows."
      }
    ]
  },
  {
    name: "Kanaries",
    description: "AI-powered data exploration and visualization tool.",
    url: "https://kanaries.net",
    id: "kanaries",
    image: "/tool-screenshots/kanaries.png",
    logo: "/logo/kanaries.png",
    categories: ["data-processing"],
    subcategory: "Data Exploration",
    tags: ["data_visualization", "ai_assistant", "exploratory_analysis", "charts"],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2023-04-08",
    isPremium: "Freemium",
    features: [
      "AutoVis: Automatically generate visualizations based on selected data.",
      "Data Wrangler: Automate data summarization and transformation.",
      "Data Painter: Interactively explore data through visual means.",
      "Graphic Walker: Embed visual analytics into web and mobile applications."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Kanaries",
        description: "Register and log in to the Kanaries platform.",
        links: [{ label: "Kanaries", url: "https://kanaries.net" }]
      },
      {
        title: "Import or Connect Data",
        description: "Add data files or connect to databases for exploration."
      },
      {
        title: "Auto-Visualize & Analyze",
        description: "Use AutoVis and Data Wrangler to create charts and summarize data."
      },
      {
        title: "Export & Share",
        description: "Download visualizations or embed them into applications."
      }
    ]
  },
  {
    name: "GitHub Copilot",
    description: "AI pair programmer that suggests code snippets and entire functions in real-time.",
    url: "https://github.com/features/copilot",
    id: "github-copilot",
    image: "/tool-screenshots/github-copilot.png",
    logo: "/logo/github-copilot.png",
    categories: ["coding"],
    subcategory: "Code Completion",
    tags: ["AI", "code_completion", "pair_programming", "IDE_integration"],
    rating: 4.8,
    visits: 5000000,
    dateAdded: "2021-06-29",
    isPremium: "Freemium",
    features: [
      "AI Code Completions: Suggest code snippets based on context.",
      "Natural Language Chat: Interact with codebase using conversational queries.",
      "Smart Actions: Enhance productivity with AI-driven suggestions.",
      "Pull Request Summaries: Generate summaries for code changes."
    ],
    howToUse: [
      {
        title: "Enable Copilot in IDE",
        description: "Install GitHub Copilot extension in VS Code, JetBrains, or compatible editors.",
        links: [{ label: "GitHub Copilot", url: "https://github.com/features/copilot" }]
      },
      {
        title: "Write Code",
        description: "Start coding as usual—Copilot will suggest completions and snippets."
      },
      {
        title: "Accept or Refine Suggestions",
        description: "Review and accept, reject, or edit Copilot suggestions in real time."
      },
      {
        title: "Chat & Summarize",
        description: "Use chat or summary features for deeper code understanding."
      }
    ]
  },
  {
    name: "Tabnine",
    description: "AI code completion tool that supports multiple languages and IDEs.",
    url: "https://www.tabnine.com",
    id: "tabnine",
    image: "/tool-screenshots/tabnine.png",
    logo: "/logo/tabnine.png",
    categories: ["coding"],
    subcategory: "Code Completion",
    tags: ["AI", "code_completion", "multi_language", "IDE_support"],
    rating: 4.5,
    visits: 1200000,
    dateAdded: "2019-02-15",
    isPremium: "Freemium",
    features: [
      "Context-Aware Suggestions: Provide real-time code completions.",
      "AI Chat in IDE: Assist with coding tasks through natural language.",
      "Security and Compliance: Ensure code privacy and compliance.",
      "Integration with Tools: Work seamlessly with tools like Jira."
    ],
    howToUse: [
      {
        title: "Install Tabnine Extension",
        description: "Add Tabnine to your preferred IDE (VS Code, JetBrains, etc.).",
        links: [{ label: "Tabnine", url: "https://www.tabnine.com" }]
      },
      {
        title: "Write Code",
        description: "Start coding and accept Tabnine’s real-time suggestions."
      },
      {
        title: "Use AI Chat",
        description: "Ask questions or request code help directly in your editor."
      }
    ]
  },
  {
    name: "Codeium",
    description: "AI-powered code generation tool that supports multiple programming languages.",
    url: "https://codeium.com",
    id: "codeium",
    image: "/tool-screenshots/codeium.png",
    logo: "/logo/codeium.png",
    categories: ["coding"],
    subcategory: "Code Generation",
    tags: ["AI", "code_generation", "multi_language", "IDE_integration"],
    rating: 4.4,
    visits: 300000,
    dateAdded: "2022-09-15",
    isPremium: "Freemium",
    features: [
      "AI Autocomplete: Real-time suggestions in 70+ languages.",
      "In-Editor AI Chat: Technical help inside your IDE.",
      "Broad IDE Support: Works with VS Code, JetBrains, and more.",
      "Free for Individuals: Unlimited access with no cost."
    ],
    howToUse: [
      {
        title: "Install Codeium Plugin",
        description: "Add Codeium to your IDE (VS Code, JetBrains, etc.).",
        links: [{ label: "Codeium", url: "https://codeium.com" }]
      },
      {
        title: "Start Coding",
        description: "Receive real-time code completions and suggestions."
      },
      {
        title: "Use AI Chat",
        description: "Ask technical questions or get coding help in-editor."
      }
    ]
  },
  {
    name: "Sourcery",
    description: "AI tool that refactors Python code to improve readability and performance.",
    url: "https://sourcery.ai",
    id: "sourcery",
    image: "/tool-screenshots/sourcery.png",
    logo: "/logo/sourcery.png",
    categories: ["coding"],
    subcategory: "Code Refactoring",
    tags: ["AI", "code_refactoring", "Python", "performance"],
    rating: 4.1,
    visits: 150000,
    dateAdded: "2020-07-10",
    isPremium: "Freemium",
    features: [
      "Code Refactoring: Simplifies and optimizes code.",
      "Code Quality Suggestions: Flags bad practices and bugs.",
      "Pull Request Reviews: AI feedback in GitHub PRs.",
      "Team Collaboration: Shares refactoring tips team-wide."
    ],
    howToUse: [
      {
        title: "Install Sourcery Extension",
        description: "Add Sourcery to your IDE or set up in your CI pipeline.",
        links: [{ label: "Sourcery", url: "https://sourcery.ai" }]
      },
      {
        title: "Write or Review Python Code",
        description: "Get real-time refactoring suggestions and code improvements."
      },
      {
        title: "Review Pull Requests",
        description: "Receive AI-powered feedback on GitHub or GitLab PRs."
      }
    ]
  },
  {
    name: "Figma AI",
    description: "Collaborative interface design tool with AI-powered features for design suggestions and automation.",
    url: "https://www.figma.com/",
    id: "figma-ai",
    image: "/tool-screenshots/figma-ai.png",
    logo: "/logo/figma.png",
    categories: ["design"],
    subcategory: "UI/UX Design",
    tags: ["ui_design", "ux_design", "prototyping", "collaboration", "design_systems"],
    rating: 4.6,
    visits: 40000000,
    dateAdded: "2022-06-15",
    isPremium: "Freemium",
    features: [
      "AI Content Generation: Creates text and images automatically.",
      "Text Assistance: Improves or rewrites design copy.",
      "Design Automation: Helps with layout and spacing.",
      "Image Suggestions: Recommends visuals for designs."
    ],
    howToUse: [
      {
        title: "Sign Up and Open Figma",
        description: "Create a Figma account and start a new design file.",
        links: [{ label: "Figma", url: "https://www.figma.com/" }]
      },
      {
        title: "Design Interfaces",
        description: "Use drag-and-drop tools, AI suggestions, and collaborate with your team."
      },
      {
        title: "Leverage AI Features",
        description: "Use AI to automate layouts, generate text, and suggest images."
      }
    ]
  },
  {
    name: "Uizard",
    description: "AI-powered design tool that transforms sketches and wireframes into digital designs.",
    url: "https://uizard.io/",
    id: "uizard",
    image: "/tool-screenshots/uizard.png",
    logo: "/logo/uizard.png",
    categories: ["design"],
    subcategory: "UI Design",
    tags: ["wireframing", "prototyping", "no_code", "ui_design", "collaboration"],
    rating: 4.5,
    visits: 1500000,
    dateAdded: "2022-09-10",
    isPremium: "Freemium",
    features: [
      "Autodesigner: Creates UIs from text prompts.",
      "Screenshot Scanner: Turns sketches into editable UIs.",
      "Drag-and-Drop Editor: No-code visual design.",
      "Focus Predictor: Predicts attention hotspots."
    ],
    howToUse: [
      {
        title: "Sign Up & Launch Uizard",
        description: "Create an account and open the Uizard editor.",
        links: [{ label: "Uizard", url: "https://uizard.io/" }]
      },
      {
        title: "Import Sketch or Wireframe",
        description: "Upload a sketch or start from scratch with drag-and-drop elements."
      },
      {
        title: "Auto-Design & Edit",
        description: "Use AI to transform sketches into digital designs and customize layouts."
      }
    ]
  },
  {
    name: "Looka",
    description: "AI-powered logo maker and brand identity design tool.",
    url: "https://looka.com/",
    id: "looka",
    image: "/tool-screenshots/looka.png",
    logo: "/logo/looka.png",
    categories: ["design"],
    subcategory: "Branding",
    tags: ["logo_design", "branding", "templates", "business_cards", "social_media_kits"],
    rating: 4.4,
    visits: 800000,
    dateAdded: "2021-05-20",
    isPremium: "Premium",
    features: [
      "Logo Generator: Designs logos from your preferences.",
      "Brand Kit Builder: Creates full brand identity packages.",
      "Design Customization: Edit fonts, colors, and layout.",
      "High-Res Downloads: Exports in multiple formats."
    ],
    howToUse: [
      {
        title: "Sign Up and Start a Logo",
        description: "Create a Looka account and start a new logo project.",
        links: [{ label: "Looka", url: "https://looka.com/" }]
      },
      {
        title: "Enter Brand Preferences",
        description: "Input your business name, industry, and style preferences."
      },
      {
        title: "Customize Logo",
        description: "Use the editor to adjust colors, fonts, and layouts."
      },
      {
        title: "Download or Purchase Brand Kit",
        description: "Export logo files or purchase a complete brand kit for business use."
      }
    ]
  },
  {
    name: "Designify",
    description: "AI tool for automatically enhancing product photos and removing backgrounds.",
    url: "https://www.designify.com/",
    id: "designify",
    image: "/tool-screenshots/designify.png",
    logo: "/logo/designify.png",
    categories: ["design"],
    subcategory: "Image Editing",
    tags: ["background_removal", "photo_enhancement", "ecommerce", "automation", "batch_processing"],
    rating: 4.2,
    visits: 600000,
    dateAdded: "2021-08-30",
    isPremium: "Freemium",
    features: [
      "Background Removal: Clears backgrounds automatically.",
      "Image Retouching: Enhances photos with one click.",
      "Templates: Adds styles and frames to images.",
      "Batch Editing: Process many images at once."
    ],
    howToUse: [
      {
        title: "Go to Designify",
        description: "Access the Designify website to get started.",
        links: [{ label: "Designify", url: "https://www.designify.com/" }]
      },
      {
        title: "Upload Images",
        description: "Drag and drop or select photos for enhancement."
      },
      {
        title: "Apply Enhancements",
        description: "Let AI remove backgrounds, retouch, or style images automatically."
      },
      {
        title: "Download Enhanced Images",
        description: "Save processed photos for ecommerce or marketing."
      }
    ]
  },
  {
    name: "V0 by Vercel",
    description: "AI-powered UI generator that transforms prompts into production-ready React and Tailwind components.",
    url: "https://v0.dev",
    id: "v0-vercel",
    image: "/tool-screenshots/v0-vercel.png",
    logo: "/logo/v0-vercel.png",
    categories: ["design"],
    subcategory: "Generative UI Design",
    tags: ["tailwind", "react", "shadcn", "ui_generator", "no_code", "vercel"],
    rating: 4.6,
    visits: 500000,
    dateAdded: "2023-10-10",
    isPremium: "Freemium",
    features: [
      "Component Generation: Create UI components from text prompts.",
      "Code Export: Export components as usable code.",
      "Design Customization: Adjust component styles and layouts.",
      "Integration with Frameworks: Use components with popular frameworks."
    ],
    howToUse: [
      {
        title: "Access V0 by Vercel",
        description: "Go to v0.dev and start generating UI components.",
        links: [{ label: "V0 by Vercel", url: "https://v0.dev" }]
      },
      {
        title: "Enter Prompt",
        description: "Describe the UI you want to generate using natural language."
      },
      {
        title: "Edit & Export Code",
        description: "Customize generated React + Tailwind components and export code for your project."
      }
    ]
  },
  {
    name: "Let's Enhance",
    description: "AI-powered image upscaler and enhancer for improving image quality.",
    url: "https://letsenhance.io/",
    id: "lets-enhance",
    image: "/tool-screenshots/lets-enhance.png",
    logo: "/logo/lets-enhance.png",
    categories: ["design"],
    subcategory: "Image Enhancement",
    tags: ["image_upscaling", "photo_enhancement", "ecommerce", "print_quality", "batch_processing"],
    rating: 4.3,
    visits: 700000,
    dateAdded: "2019-12-10",
    isPremium: "Freemium",
    features: [
      "AI Upscaling: Boosts image resolution.",
      "Color Correction: Fixes tones and lighting.",
      "Noise Reduction: Removes blur and grain.",
      "Preset Modes: Optimizes for print, e-com, and real estate."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Dashboard",
        description: "Register and log in to Let's Enhance.",
        links: [{ label: "Let's Enhance", url: "https://letsenhance.io/" }]
      },
      {
        title: "Upload Images",
        description: "Add the images you want to upscale or enhance."
      },
      {
        title: "Select Enhancement Options",
        description: "Choose upscaling, color correction, or preset modes."
      },
      {
        title: "Download Enhanced Files",
        description: "Export high-resolution, improved photos for print or web."
      }
    ]
  },
  {
    name: "Synthesia",
    description: "AI video generation platform that creates professional videos from text in minutes.",
    url: "https://www.synthesia.io",
    id: "synthesia",
    image: "/tool-screenshots/synthesia.png",
    logo: "/logo/synthesia.png",
    categories: ["marketing"],
    subcategory: "Video Marketing",
    tags: ["video_creation", "ai_video", "personalized_video", "training_videos"],
    rating: 4.7,
    visits: 2000000,
    dateAdded: "2020-05-05",
    isPremium: "Premium",
    features: [
      "Text-to-Video: Turn scripts into videos with AI avatars.",
      "Multilingual Voiceovers: Supports 140+ languages and accents.",
      "Custom Avatars: Personalize avatars with your own likeness.",
      "Built-in Templates: Prebuilt formats for training, promo, etc."
    ],
    howToUse: [
      {
        title: "Sign Up & Create Video",
        description: "Create a Synthesia account and start a new video project.",
        links: [{ label: "Synthesia", url: "https://www.synthesia.io" }]
      },
      {
        title: "Enter Script & Select Template",
        description: "Input your video script and pick a template or avatar."
      },
      {
        title: "Customize Video",
        description: "Adjust language, voice, backgrounds, and avatars."
      },
      {
        title: "Generate & Download",
        description: "Let Synthesia process the video, then export the final file."
      }
    ]
  },
  {
    name: "Mailchimp",
    description: "Marketing automation platform offering email marketing, landing pages, and audience management tools.",
    url: "https://mailchimp.com",
    id: "mailchimp",
    image: "/tool-screenshots/mailchimp.png",
    logo: "/logo/mailchimp.png",
    categories: ["marketing"],
    subcategory: "Email Marketing",
    tags: ["email_campaigns", "automation", "audience_management", "analytics"],
    rating: 4.6,
    visits: 25000000,
    dateAdded: "2001-10-01",
    isPremium: "Freemium",
    features: [
      "Email Automation: Create and schedule campaigns.",
      "Customer Journeys: Design multi-step email sequences.",
      "A/B Testing: Test email subject lines and content.",
      "CRM Features: Manage contacts, segments, and preferences."
    ],
    howToUse: [
      {
        title: "Sign Up & Build Campaign",
        description: "Create a Mailchimp account and start a new email or landing page campaign.",
        links: [{ label: "Mailchimp", url: "https://mailchimp.com" }]
      },
      {
        title: "Add Content & Design",
        description: "Write your message, add images, and select templates."
      },
      {
        title: "Set Audience & Schedule",
        description: "Choose segments and schedule send times."
      },
      {
        title: "Analyze Results",
        description: "Track opens, clicks, and conversions in analytics."
      }
    ]
  },
  {
    name: "ActiveCampaign",
    description: "Customer experience automation platform combining email marketing, automation, and CRM tools.",
    url: "https://www.activecampaign.com",
    id: "activecampaign",
    image: "/tool-screenshots/activecampaign.png",
    logo: "/logo/activecampaign.png",
    categories: ["marketing"],
    subcategory: "Marketing Automation",
    tags: ["email_marketing", "crm", "automation", "sales_automation"],
    rating: 4.5,
    visits: 5000000,
    dateAdded: "2003-09-01",
    isPremium: "Premium",
    features: [
      "Marketing Automation: Trigger emails based on user actions.",
      "Built-in CRM: Sync sales and marketing tasks.",
      "Site Tracking: Monitor user behavior to personalize content.",
      "Email Segmentation: Target messages to audience segments."
    ],
    howToUse: [
      {
        title: "Sign Up & Set Up Account",
        description: "Register on ActiveCampaign and connect your contacts and site.",
        links: [{ label: "ActiveCampaign", url: "https://www.activecampaign.com" }]
      },
      {
        title: "Create Automations or Campaigns",
        description: "Design email automations or single campaigns using the builder."
      },
      {
        title: "Segment Audience & Personalize",
        description: "Set up audience segments and tailor content for each."
      },
      {
        title: "Monitor & Optimize",
        description: "Track analytics and refine automations for better results."
      }
    ]
  },
  {
    name: "Adobe Marketo Engage",
    description: "Marketing automation software for lead management, email marketing, and campaign management.",
    url: "https://business.adobe.com/products/marketo/adobe-marketo.html",
    id: "adobe-marketo-engage",
    image: "/tool-screenshots/adobe-marketo-engage.png",
    logo: "/logo/adobe-marketo-engage.png",
    categories: ["marketing"],
    subcategory: "Marketing Automation",
    tags: ["lead_management", "email_marketing", "campaign_management", "analytics"],
    rating: 4.4,
    visits: 3000000,
    dateAdded: "2006-01-01",
    isPremium: "Premium",
    features: [
      "Lead Management: Capture and score leads with automation.",
      "Cross-Channel Campaigns: Email, social, ads, and more.",
      "Personalization: Tailor experiences to user behavior.",
      "Analytics: Real-time reporting on campaign performance."
    ],
    howToUse: [
      {
        title: "Request Demo or Start Trial",
        description: "Contact Adobe Marketo Engage for a demo or set up a free trial.",
        links: [{ label: "Adobe Marketo Engage", url: "https://business.adobe.com/products/marketo/adobe-marketo.html" }]
      },
      {
        title: "Import Leads & Set Up Campaigns",
        description: "Add leads and create campaigns using built-in templates."
      },
      {
        title: "Personalize & Automate",
        description: "Use automation features to tailor experiences and trigger actions."
      },
      {
        title: "Analyze & Optimize",
        description: "Review analytics and continually optimize for results."
      }
    ]
  },
  {
    name: "ClickUp AI",
    description: "AI-powered project management and productivity platform.",
    url: "https://clickup.com/ai",
    id: "clickup-ai",
    image: "/tool-screenshots/clickup-ai.png",
    logo: "/logo/clickup-ai.png",
    categories: ["productivity"],
    subcategory: "project-management",
    tags: ["AI", "automation", "project management"],
    rating: 4.6,
    visits: 2500000,
    dateAdded: "2023-11-15",
    isPremium: 'Free',
    features: [
      "Task Automation: Automatically generates and updates tasks based on prompts.",
      "AI Writer: Drafts meeting notes, project briefs, and content.",
      "Summarization: Summarizes long threads and comments.",
      "Brainstorming Assistant: Helps ideate and break down projects."
    ],
    howToUse: [
      {
        title: "Sign Up & Create Workspace",
        description: "Register for ClickUp and create a workspace for your team.",
        links: [{ label: "ClickUp AI", url: "https://clickup.com/ai" }]
      },
      {
        title: "Add Tasks & Projects",
        description: "Use AI to generate, assign, and schedule tasks."
      },
      {
        title: "Leverage AI Features",
        description: "Summarize discussions, auto-write briefs, or brainstorm new ideas."
      },
      {
        title: "Track Progress",
        description: "Monitor project status and team productivity in real time."
      }
    ]
  },
  {
    name: "Zapier",
    description: "Automation platform that connects apps and services.",
    url: "https://zapier.com",
    id: "zapier",
    image: "/tool-screenshots/zapier.png",
    logo: "/logo/zapier.png",
    categories: ["productivity"],
    subcategory: "automation",
    tags: ["AI", "automation", "integration"],
    rating: 4.7,
    visits: 5000000,
    dateAdded: "2023-10-01",
    isPremium: 'Free',
    features: [
      "App Integration: Connects 6,000+ apps to automate workflows.",
      "AI Actions: Automates tasks using natural language prompts.",
      "Multi-Step Zaps: Chains multiple tasks together in one automation.",
      "Data Formatting: Cleans and reformats data between apps."
    ],
    howToUse: [
      {
        title: "Sign Up & Start a Zap",
        description: "Register for Zapier and create your first automation (Zap).",
        links: [{ label: "Zapier", url: "https://zapier.com" }]
      },
      {
        title: "Choose Apps & Triggers",
        description: "Select the apps, events, and triggers to automate."
      },
      {
        title: "Configure Actions",
        description: "Set up what happens when triggers fire, using AI as needed."
      },
      {
        title: "Test & Activate",
        description: "Run tests and activate your Zap for live automation."
      }
    ]
  },
  {
    name: "Motion",
    description: "AI-powered calendar and task management platform.",
    url: "https://www.usemotion.com",
    id: "motion",
    image: "/tool-screenshots/motion.png",
    logo: "/logo/motion.png",
    categories: ["productivity"],
    subcategory: "calendar",
    tags: ["AI", "scheduling", "automation"],
    rating: 4.5,
    visits: 1800000,
    dateAdded: "2023-09-15",
    isPremium: 'Free',
    features: [
      "AI Scheduler: Automatically prioritizes and schedules tasks on your calendar.",
      "Meeting Booking: Handles meeting coordination with smart availability.",
      "Task Rescheduling: Dynamically shifts tasks based on deadlines.",
      "Focus Time: Protects time for deep work using calendar blocking."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Calendar",
        description: "Register on Motion and integrate your existing calendars.",
        links: [{ label: "Motion", url: "https://www.usemotion.com" }]
      },
      {
        title: "Add Tasks & Preferences",
        description: "Input tasks and set preferences for focus, deadlines, and meetings."
      },
      {
        title: "Let AI Schedule",
        description: "Allow Motion to automatically organize your calendar."
      },
      {
        title: "Adjust & Track",
        description: "Review, reschedule, and track productivity as needed."
      }
    ]
  },
  {
    name: "Fireflies.ai",
    description: "AI meeting assistant for transcription and analysis.",
    url: "https://fireflies.ai",
    id: "fireflies-ai",
    image: "/tool-screenshots/fireflies-ai.png",
    logo: "/logo/fireflies-ai.png",
    categories: ["productivity"],
    subcategory: "meetings",
    tags: ["AI", "transcription", "meetings"],
    rating: 4.6,
    visits: 2200000,
    dateAdded: "2023-08-01",
    isPremium: 'Free',
    features: [
      "Meeting Recording: Captures audio and video from meetings.",
      "Transcription: Converts speech to accurate, searchable text.",
      "AI Summaries: Provides concise highlights of meetings.",
      "Collaboration Tools: Share, comment on, and assign notes within teams."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Calendar",
        description: "Register, connect your calendar, and invite Fireflies to meetings.",
        links: [{ label: "Fireflies.ai", url: "https://fireflies.ai" }]
      },
      {
        title: "Record & Transcribe",
        description: "Let Fireflies join and record meetings, generating transcripts and summaries."
      },
      {
        title: "Review, Share & Collaborate",
        description: "Use the dashboard to highlight, comment, and distribute notes."
      }
    ]
  },
  {
    name: "Perplexity AI",
    description: "AI-powered search and answer engine with citations.",
    url: "https://www.perplexity.ai",
    id: "perplexity-ai",
    image: "/tool-screenshots/perplexity-ai.png",
    logo: "/logo/perplexity-ai.png",
    categories: ["productivity"],
    subcategory: "search",
    tags: ["AI", "search", "research"],
    rating: 4.8,
    visits: 3500000,
    dateAdded: "2023-07-15",
    isPremium: 'Free',
    features: [
      "Cited Answers: Provides real-time responses with source citations.",
      "Web Search Integration: Combines AI and live web data.",
      "Follow-Up Queries: Enables contextual back-and-forth questioning.",
      "Multimodal Inputs: Accepts both text and voice prompts."
    ],
    howToUse: [
      {
        title: "Go to Perplexity AI",
        description: "Visit the Perplexity AI website.",
        links: [{ label: "Perplexity AI", url: "https://www.perplexity.ai" }]
      },
      {
        title: "Ask a Question",
        description: "Type or speak your query for instant, cited answers."
      },
      {
        title: "Follow Up",
        description: "Ask follow-up questions for deeper research."
      },
      {
        title: "Review Sources",
        description: "Check citations for more context."
      }
    ]
  },
  {
    name: "Otter.ai",
    description: "Provides real-time transcription services with collaborative features, suitable for meetings and lectures.",
    url: "https://otter.ai",
    id: "otter",
    image: "/tool-screenshots/otter.png",
    logo: "/logo/otter.png",
    categories: ["productivity"],
    subcategory: "meetings",
    tags: ["AI", "transcription", "meetings"],
    rating: 4.5,
    visits: 2800000,
    dateAdded: "2023-06-01",
    isPremium: 'Free',
    features: [
      "Real-Time Transcription: Transcribes meetings and lectures as they happen.",
      "Speaker Identification: Labels who said what in group conversations.",
      "Automatic Summaries: Creates outlines of spoken content.",
      "Search & Highlight: Lets users find keywords and key moments."
    ],
    howToUse: [
      {
        title: "Sign Up & Invite Otter",
        description: "Create an Otter.ai account and invite Otter to meetings.",
        links: [{ label: "Otter.ai", url: "https://otter.ai" }]
      },
      {
        title: "Start Transcription",
        description: "Begin a live transcription for meetings or lectures."
      },
      {
        title: "Review & Edit",
        description: "Edit transcripts, add highlights, and assign speakers."
      },
      {
        title: "Export Results",
        description: "Download or share notes and summaries."
      }
    ]
  },
  {
    name: "Reclaim.ai",
    description: "Smart calendar assistant for task and habit management.",
    url: "https://reclaim.ai",
    id: "reclaim-ai",
    image: "/tool-screenshots/reclaim-ai.png",
    logo: "/logo/reclaim-ai.png",
    categories: ["productivity"],
    subcategory: "calendar",
    tags: ["AI", "scheduling", "automation"],
    rating: 4.6,
    visits: 1500000,
    dateAdded: "2023-05-15",
    isPremium: 'Free',
    features: [
      "Smart Calendar: Automatically finds the best time for tasks.",
      "Habit Scheduling: Maintains routines and habits within your workweek.",
      "Meeting Syncing: Avoids overlap by syncing multiple calendars.",
      "Task Prioritization: Reschedules tasks based on urgency and deadline."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Calendars",
        description: "Register for Reclaim.ai and link your calendars.",
        links: [{ label: "Reclaim.ai", url: "https://reclaim.ai" }]
      },
      {
        title: "Add Tasks & Habits",
        description: "Enter recurring habits and one-off tasks."
      },
      {
        title: "Let AI Schedule",
        description: "Allow Reclaim to prioritize and fit everything into your calendar."
      },
      {
        title: "Adjust & Track",
        description: "Review and update your schedule as needed."
      }
    ]
  },
  {
    name: "SaneBox",
    description: "AI-powered email management and organization tool.",
    url: "https://www.sanebox.com",
    id: "sanebox",
    image: "/tool-screenshots/sanebox.png",
    logo: "/logo/sanebox.png",
    categories: ["productivity"],
    subcategory: "email",
    tags: ["AI", "email", "automation"],
    rating: 4.4,
    visits: 1200000,
    dateAdded: "2023-04-01",
    isPremium: 'Free',
    features: [
      "Email Filtering: Automatically sorts unimportant emails into folders like SaneLater for better organization.",
      "SaneBlackHole: Allows users to unsubscribe from unwanted emails effortlessly.",
      "SaneReminders: Sets reminders to follow up on emails or send them at a later time.",
      "Attachment Management: Easily saves email attachments to linked cloud storage services."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Email",
        description: "Register on SaneBox and link your email account.",
        links: [{ label: "SaneBox", url: "https://www.sanebox.com" }]
      },
      {
        title: "Let SaneBox Organize",
        description: "Allow the AI to sort, filter, and organize your inbox."
      },
      {
        title: "Set Up Rules & Reminders",
        description: "Configure custom folders, unsubscribe, and add reminders for follow-up."
      },
      {
        title: "Review & Adjust",
        description: "Move emails between folders to further train your filtering."
      }
    ]
  },
  {
    name: "Codiga",
    description: "AI-powered code analysis and security platform.",
    url: "https://www.codiga.io",
    id: "codiga",
    image: "/tool-screenshots/codiga.png",
    logo: "/logo/codiga.png",
    categories: ["coding"],
    subcategory: "code-analysis",
    tags: ["AI", "coding", "security", "analysis"],
    rating: 4.4,
    visits: 300000,
    dateAdded: "2022-03-15",
    isPremium: 'Free',
    features: [
      "Real-Time Code Analysis: Detects issues while coding.",
      "Smart Code Snippets: Reusable code blocks with best practices.",
      "Security & Performance Checks: Flags unsafe or slow code.",
      "IDE/CI Integration: Works with VS Code, JetBrains, GitHub Actions, and more."
    ],
    howToUse: [
      {
        title: "Install Codiga Extension",
        description: "Add Codiga to your IDE or CI/CD pipeline.",
        links: [{ label: "Codiga", url: "https://www.codiga.io" }]
      },
      {
        title: "Scan Code in Real Time",
        description: "Write or review code to receive instant security and quality feedback."
      },
      {
        title: "Use Smart Snippets",
        description: "Integrate best-practice code blocks as you work."
      },
      {
        title: "Review Reports",
        description: "Check analytics and reports for ongoing code improvements."
      }
    ]
  },
  {
    name: "Replit Ghostwriter",
    description: "AI coding assistant integrated into the Replit development environment.",
    url: "https://replit.com/ghostwriter",
    id: "replit-ghostwriter",
    image: "/tool-screenshots/replit-ghostwriter.png",
    logo: "/logo/replit-ghostwriter.png",
    categories: ["coding"],
    subcategory: "code-completion",
    tags: ["AI", "coding", "replit", "assistant"],
    rating: 4.5,
    visits: 600000,
    dateAdded: "2022-09-15",
    isPremium: 'Free',
    features: [
      "Inline Code Completions: Fast suggestions within Replit.",
      "Code Explanation: Converts code to plain language.",
      "Prompt-Based Coding: Generates code from natural language.",
      "Refactoring Support: Helps restructure and improve code logic."
    ],
    howToUse: [
      {
        title: "Start Coding on Replit",
        description: "Use the Replit IDE and enable Ghostwriter.",
        links: [{ label: "Replit Ghostwriter", url: "https://replit.com/ghostwriter" }]
      },
      {
        title: "Leverage Inline Suggestions",
        description: "Type code and accept Ghostwriter completions or explanations."
      },
      {
        title: "Prompt for Code",
        description: "Describe coding tasks in natural language for instant code generation."
      },
      {
        title: "Refactor and Improve",
        description: "Use suggestions to clean up and optimize your code."
      }
    ]
  },
  {
    name: "Khroma",
    description: "AI color palette generator that learns from your preferences.",
    url: "https://www.khroma.co",
    id: "khroma",
    image: "/tool-screenshots/khroma.png",
    logo: "/logo/khroma.png",
    categories: ["design"],
    subcategory: "color-palettes",
    tags: ["AI", "design", "colors", "palettes"],
    rating: 4.7,
    visits: 450000,
    dateAdded: "2022-01-15",
    isPremium: 'Free',
    features: [
      "AI Color Palette Generation: Learns your preferences and creates color schemes.",
      "Custom Training: Personalize palettes by training on colors you like.",
      "Infinite Combos: Generates endless color pairings with hex/RGB codes.",
      "Visual Previews: See palettes in UI mockups, images, and gradients."
    ],
    howToUse: [
      {
        title: "Train Khroma",
        description: "Pick colors you like to train the AI.",
        links: [{ label: "Khroma", url: "https://www.khroma.co" }]
      },
      {
        title: "Browse and Save Palettes",
        description: "View AI-generated palettes and save your favorites."
      },
      {
        title: "Preview in Context",
        description: "See palettes applied in UI, images, and designs."
      }
    ]
  },
  {
    name: "Cursor",
    description: "AI-powered code editor with advanced features for developers.",
    url: "https://cursor.sh",
    id: "cursor",
    image: "/tool-screenshots/cursor.png",
    logo: "/logo/cursor.png",
    categories: ["coding", "design"],
    subcategory: "code-editor",
    tags: ["AI", "coding", "editor", "development"],
    rating: 4.8,
    visits: 900000,
    dateAdded: "2023-01-15",
    isPremium: 'Free',
    features: [
      "AI Code Review: Highlights logic flaws and inefficiencies.",
      "Copilot Integration: Chat with code using natural language.",
      "Refactoring Suggestions: Restructures code for readability and efficiency.",
      "IDE-Like Environment: Works in a web-based AI IDE with debugging tools."
    ],
    howToUse: [
      {
        title: "Download or Access Cursor",
        description: "Install the Cursor app or use the web version.",
        links: [{ label: "Cursor", url: "https://cursor.sh" }]
      },
      {
        title: "Start Coding",
        description: "Open or create a project and write code with AI suggestions."
      },
      {
        title: "Use AI Features",
        description: "Leverage code review, refactoring, and Copilot chat for productivity."
      },
      {
        title: "Debug and Ship",
        description: "Use built-in debugging and deployment tools."
      }
    ]
  },
  {
    name: "Surfer SEO",
    description: "AI-powered SEO tool for content optimization and keyword research.",
    url: "https://surferseo.com",
    id: "surfer-seo",
    image: "/tool-screenshots/surfer-seo.png",
    logo: "/logo/surfer-seo.png",
    categories: ["marketing"],
    subcategory: "seo",
    tags: ["AI", "SEO", "content", "marketing"],
    rating: 4.6,
    visits: 750000,
    dateAdded: "2021-09-15",
    isPremium: 'Free',
    features: [
      "Content Editor: Real-time optimization suggestions based on SERP data.",
      "Keyword Research: Identifies high-impact keywords with volume data.",
      "SEO Audits: Analyzes existing pages for ranking improvements.",
      "SERP Analyzer: Visual breakdown of ranking factors for competitors."
    ],
    howToUse: [
      {
        title: "Sign Up & Start Auditing",
        description: "Register on Surfer SEO and begin a site audit or content optimization project.",
        links: [{ label: "Surfer SEO", url: "https://surferseo.com" }]
      },
      {
        title: "Input Keywords or URLs",
        description: "Analyze your site or research keywords for new content."
      },
      {
        title: "Review Recommendations",
        description: "Implement on-page suggestions and keyword optimizations."
      },
      {
        title: "Monitor Rankings",
        description: "Track progress in the dashboard."
      }
    ]
  },
  {
    name: "Copy.ai",
    description: "AI copywriting platform for marketing and sales content.",
    url: "https://www.copy.ai",
    id: "copy-ai",
    image: "/tool-screenshots/copy-ai.png",
    logo: "/logo/copy-ai.png",
    categories: ["marketing","text","design"],
    subcategory: "copywriting",
    tags: ["AI", "copywriting", "marketing", "content"],
    rating: 4.5,
    visits: 1000000,
    dateAdded: "2021-03-15",
    isPremium: 'Free',
    features: [
      "Sales Copy Generation: Writes value props, CTAs, and product descriptions.",
      "Campaign Workflows: Automates writing across multiple touchpoints.",
      "Tone Customization: Adjusts for brand voice, style, and tone.",
      "Long-Form Assistant: Helps draft blog posts, reports, and scripts.",
      "Marketing Copy Generator: Ads, landing pages, emails, etc.",
      "Workflow Automation: Create sequences of content with prompts.",
      "Tone Adjustment: Match tone to audience or brand.",
      "Multilingual Support: Write content in multiple languages."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Dashboard",
        description: "Register at Copy.ai and create a new project.",
        links: [{ label: "Copy.ai", url: "https://www.copy.ai" }]
      },
      {
        title: "Select Copy Type",
        description: "Choose from ads, emails, landing pages, or other content types."
      },
      {
        title: "Describe Your Need",
        description: "Input product info, keywords, and desired tone."
      },
      {
        title: "Generate, Edit, and Export",
        description: "Review generated copy, refine as needed, and export for marketing use."
      }
    ]
  },
  {
    name: "Microsoft Copilot",
    description: "AI assistant integrated into Microsoft 365 applications.",
    url: "https://www.microsoft.com/copilot",
    id: "microsoft-copilot",
    image: "/tool-screenshots/microsoft-copilot.png",
    logo: "/logo/microsoft-copilot.png",
    categories: ["productivity"],
    subcategory: "office-assistant",
    tags: ["AI", "productivity", "microsoft", "office"],
    rating: 4.6,
    visits: 1500000,
    dateAdded: "2023-03-15",
    isPremium: 'Free',
    features: [
      "Document Summarization: Condenses long documents in Word and Outlook.",
      "Data Insights: Generates charts and formulas in Excel from natural language.",
      "Meeting Recaps: Summarizes Teams meetings and assigns tasks.",
      "Contextual Assistance: Suggests next steps in Office tools based on activity."
    ],
    howToUse: [
      {
        title: "Access Microsoft Copilot",
        description: "Use Copilot via Microsoft 365 apps like Word, Excel, and Teams.",
        links: [{ label: "Microsoft Copilot", url: "https://www.microsoft.com/copilot" }]
      },
      {
        title: "Prompt for Help",
        description: "Ask Copilot to summarize, generate, or analyze documents and data."
      },
      {
        title: "Accept and Edit Output",
        description: "Review Copilot’s suggestions and adjust as needed."
      },
      {
        title: "Use Across Office Apps",
        description: "Leverage Copilot in Word, Excel, Outlook, and Teams for productivity."
      }
    ]
  },
  {
    name: "Resemble AI",
    description: "A voice cloning platform that enables users to create realistic synthetic voices with minimal data, supporting both text-to-speech and speech-to-speech transformations.",
    url: "https://www.resemble.ai",
    id: "resemble",
    image: "/tool-screenshots/resemble.png",
    logo: "/logo/resemble.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Resemble AI supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Create a Resemble AI account and log in to access the platform.",
        links: [{ label: "Resemble AI", url: "https://www.resemble.ai" }]
      },
      {
        title: "Create or Clone a Voice",
        description: "Use the platform to record or upload audio samples for voice cloning or generation."
      },
      {
        title: "Generate Audio",
        description: "Convert text to speech or use speech-to-speech transformation with your custom or cloned voice."
      },
      {
        title: "Download or Integrate",
        description: "Export generated audio or use API integrations for advanced workflows."
      }
    ]
  },
  {
    name: "Speechify",
    description: "A versatile text-to-speech application that converts written content into natural-sounding audio, featuring over 200 voices across 60+ languages.",
    url: "https://www.speechify.com",
    id: "speechify",
    image: "/tool-screenshots/speechify.png",
    logo: "/logo/speechify.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Speechify supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Download or Access Speechify",
        description: "Use the web app or download Speechify for your device.",
        links: [{ label: "Speechify", url: "https://www.speechify.com" }]
      },
      {
        title: "Import or Paste Text",
        description: "Add the content you want to convert to audio (documents, web pages, etc.)."
      },
      {
        title: "Select Voice and Language",
        description: "Choose from hundreds of voices and 60+ languages."
      },
      {
        title: "Listen, Download, or Share",
        description: "Listen to generated audio or export/share it as needed."
      }
    ]
  },
  {
    name: "WellSaid Labs",
    description: "An AI voice generation platform that transforms text into lifelike, natural-sounding voiceovers, offering a diverse selection of voices in multiple languages.",
    url: "https://www.wellsaid.io",
    id: "wellsaid",
    image: "/tool-screenshots/wellsaid.png",
    logo: "/logo/wellsaid.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: WellSaid Labs supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Studio",
        description: "Create an account and access the WellSaid Labs Studio.",
        links: [{ label: "WellSaid Labs", url: "https://www.wellsaid.io" }]
      },
      {
        title: "Enter or Upload Script",
        description: "Add the text you want to turn into a voiceover."
      },
      {
        title: "Choose Voice",
        description: "Select from a variety of natural-sounding AI voices."
      },
      {
        title: "Generate & Download Audio",
        description: "Produce the voiceover and download or integrate it with your project."
      }
    ]
  },
  {
    name: "Altered Studio",
    description: "A comprehensive voice content creation platform integrating multiple Voice AI technologies, including speech-to-speech voice morphing, into a user-friendly application.",
    url: "https://www.altered.ai",
    id: "altered",
    image: "/tool-screenshots/altered.png",
    logo: "/logo/altered.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Altered Studio supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Register & Log In",
        description: "Create an account on Altered Studio’s website.",
        links: [{ label: "Altered Studio", url: "https://www.altered.ai" }]
      },
      {
        title: "Upload or Record Audio",
        description: "Provide your audio for voice transformation or content creation."
      },
      {
        title: "Select AI Voice Options",
        description: "Choose desired voice morphing or synthesis features."
      },
      {
        title: "Process & Export",
        description: "Generate new voice content and download files for use."
      }
    ]
  },
  {
    name: "FineShare Singify",
    description: "An AI-powered music creation platform that allows users to generate song covers using a library of over 1,000 distinct AI voice models.",
    url: "https://www.fineshare.com",
    id: "fineshare",
    image: "/tool-screenshots/fineshare.png",
    logo: "/logo/fineshare.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: FineShare Singify supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Register on the FineShare platform.",
        links: [{ label: "FineShare Singify", url: "https://www.fineshare.com" }]
      },
      {
        title: "Select or Upload Song",
        description: "Choose a song or upload your own track."
      },
      {
        title: "Pick AI Voice Model",
        description: "Select from over 1,000 AI voice options for covers."
      },
      {
        title: "Generate & Download",
        description: "Produce your AI cover and download the final audio."
      }
    ]
  },
  {
    name: "Play.ht",
    description: "An AI-powered text-to-speech platform offering over 800 realistic voices in multiple languages, suitable for various applications like audiobooks and podcasts.",
    url: "https://www.play.ht",
    id: "playht",
    image: "/tool-screenshots/playht.png",
    logo: "/logo/playht.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Play.ht supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Create Account & Log In",
        description: "Sign up on Play.ht and access the dashboard.",
        links: [{ label: "Play.ht", url: "https://www.play.ht" }]
      },
      {
        title: "Input Text",
        description: "Paste or type the text you want converted to speech."
      },
      {
        title: "Select Voice & Language",
        description: "Choose from 800+ AI voices in different languages."
      },
      {
        title: "Generate & Download Audio",
        description: "Listen to, edit, and download your generated audio."
      }
    ]
  },
  {
    name: "Zonos AI",
    description: "An open-source text-to-speech model that generates expressive voices, capable of cloning voices in seconds and producing high-quality audio content in multiple languages.",
    url: "https://zonosai.com/",
    id: "zonos",
    image: "/tool-screenshots/zonos.png",
    logo: "/logo/zonos.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Zonos AI supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Access Zonos AI",
        description: "Go to the Zonos AI website and access its open-source TTS features.",
        links: [{ label: "Zonos AI", url: "https://zonosai.com/" }]
      },
      {
        title: "Clone or Select Voice",
        description: "Clone a voice with a short sample or choose from available voices."
      },
      {
        title: "Generate Speech",
        description: "Type or upload text to generate audio in your chosen voice."
      },
      {
        title: "Download Output",
        description: "Export your audio files for use in projects or content."
      }
    ]
  },
  {
    name: "Vadoo AI",
    description: "A video generation tool that allows users to add voice-overs to videos, offering various voice options for diverse applications.",
    url: "https://www.vadoo.tv",
    id: "vadoo",
    image: "/tool-screenshots/vadoo.png",
    logo: "/logo/vadoo.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Vadoo AI supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Register and log into Vadoo AI.",
        links: [{ label: "Vadoo AI", url: "https://www.vadoo.tv" }]
      },
      {
        title: "Upload or Create Video",
        description: "Add a video for voice-over or AI voice generation."
      },
      {
        title: "Select Voice & Language",
        description: "Choose from various voice options for the voice-over."
      },
      {
        title: "Apply & Export",
        description: "Generate the voice-over and download your processed video."
      }
    ]
  },
  {
    name: "SOUNDRAW",
    description: "An AI music generation platform focused on creating custom music tracks and beats for creators and artists without copyright concerns.",
    url: "https://www.soundraw.com",
    id: "soundraw",
    image: "/tool-screenshots/soundraw.png",
    logo: "/logo/soundraw.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: SOUNDRAW supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Access SOUNDRAW",
        description: "Go to SOUNDRAW's website and log in or start creating music.",
        links: [{ label: "SOUNDRAW", url: "https://www.soundraw.com" }]
      },
      {
        title: "Set Mood & Preferences",
        description: "Select the mood, genre, and track length for your music."
      },
      {
        title: "Generate Tracks",
        description: "Let AI compose music based on your settings."
      },
      {
        title: "Edit & Download",
        description: "Customize tracks and download royalty-free music for your projects."
      }
    ]
  },
  {
    name: "Beatoven.ai",
    description: "An AI-powered tool that creates royalty-free background music tailored for videos, podcasts, and games, based on user-selected moods and genres.",
    url: "https://www.beatoven.ai/",
    id: "beatovenai",
    image: "/tool-screenshots/beatovenai.png",
    logo: "/logo/beatovenai.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Beatoven.ai supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Access Beatoven.ai",
        description: "Go to the Beatoven.ai website.",
        links: [{ label: "Beatoven.ai", url: "https://www.beatoven.ai/" }]
      },
      {
        title: "Set Mood & Genre",
        description: "Choose the mood and genre that fits your project."
      },
      {
        title: "Generate Music",
        description: "Let AI compose background music to your specifications."
      },
      {
        title: "Download & Use",
        description: "Download royalty-free tracks for your content."
      }
    ]
  },
  {
    name: "Lalals",
    description: "A platform that enables users to create AI-generated instrumental songs and vocals with prompts, facilitating easy music production.",
    url: "https://www.lalals.com",
    id: "lalals",
    image: "/tool-screenshots/lalals.png",
    logo: "/logo/lalals.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Lalals supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Start Project",
        description: "Register on Lalals and start a new music project.",
        links: [{ label: "Lalals", url: "https://www.lalals.com" }]
      },
      {
        title: "Describe Song or Upload Prompt",
        description: "Use prompts or upload files to generate instrumentals or vocals."
      },
      {
        title: "Customize & Generate",
        description: "Tweak settings and let AI create music or vocals."
      },
      {
        title: "Download & Publish",
        description: "Export finished tracks for use or distribution."
      }
    ]
  },
  {
    name: "Magenta Studio",
    description: "An open-source project by Google exploring machine learning in music creation, offering tools for melody generation and more.",
    url: "https://magenta.tensorflow.org/studio/",
    id: "magenta",
    image: "/tool-screenshots/magenta.png",
    logo: "/logo/magenta.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Magenta Studio supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Access Magenta Studio",
        description: "Visit Magenta Studio and download open-source tools for music creation.",
        links: [{ label: "Magenta Studio", url: "https://magenta.tensorflow.org/studio/" }]
      },
      {
        title: "Create or Import Melody",
        description: "Use AI tools to generate or edit melodies and tracks."
      },
      {
        title: "Experiment & Export",
        description: "Experiment with settings and export your musical creations."
      }
    ]
  },
  {
    name: "Otter.ai",
    description: "Otter.ai is an AI tool for audio and speech-related tasks.",
    url: "https://otter.ai/",
    id: "otterai",
    image: "/tool-screenshots/otterai.png",
    logo: "/logo/otterai.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Otter.ai supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Otter.ai",
        description: "Register and log in to the Otter.ai dashboard.",
        links: [{ label: "Otter.ai", url: "https://otter.ai/" }]
      },
      {
        title: "Upload or Record Audio",
        description: "Use Otter.ai to record new audio or upload files for analysis."
      },
      {
        title: "Transcribe & Edit",
        description: "Let the AI transcribe speech and edit transcripts as needed."
      },
      {
        title: "Export Results",
        description: "Download transcripts and audio or share with collaborators."
      }
    ]
  },
  {
    name: "Rev",
    description: "Offers both AI-powered and human transcription services, ensuring high accuracy for various audio formats.",
    url: "https://www.rev.com",
    id: "rev",
    image: "/tool-screenshots/rev.png",
    logo: "/logo/rev.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Rev supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Access Rev Platform",
        description: "Go to Rev.com and choose AI or human transcription services.",
        links: [{ label: "Rev", url: "https://www.rev.com" }]
      },
      {
        title: "Upload Files",
        description: "Add audio or video files for transcription."
      },
      {
        title: "Select Service & Language",
        description: "Choose turnaround time, language, and service type."
      },
      {
        title: "Receive & Download",
        description: "Review completed transcripts, make edits, and download results."
      }
    ]
  },
  {
    name: "Trint",
    description: "Combines automated transcription with editing tools, facilitating efficient content creation workflows.",
    url: "https://trint.com",
    id: "trint",
    image: "/tool-screenshots/trint.png",
    logo: "/logo/trint.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Trint supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Trint",
        description: "Register and log in to the Trint dashboard.",
        links: [{ label: "Trint", url: "https://trint.com" }]
      },
      {
        title: "Upload or Record Media",
        description: "Add audio or video files or record directly in the platform."
      },
      {
        title: "Transcribe & Edit",
        description: "Use AI to generate transcripts and edit them with built-in tools."
      },
      {
        title: "Export & Share",
        description: "Download transcripts and audio or share with collaborators."
      }
    ]
  },
  {
    name: "Sonix",
    description: "Delivers fast and accurate transcriptions with multilingual support and integration options for diverse needs.",
    url: "https://sonix.ai",
    id: "sonix",
    image: "/tool-screenshots/sonix.png",
    logo: "/logo/sonix.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Sonix supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Register & Log In",
        description: "Create an account on Sonix.ai.",
        links: [{ label: "Sonix", url: "https://sonix.ai" }]
      },
      {
        title: "Upload Media",
        description: "Add audio or video files for transcription."
      },
      {
        title: "Transcribe & Edit",
        description: "Use AI to generate, edit, and translate transcripts."
      },
      {
        title: "Download & Integrate",
        description: "Export results or use integrations with other tools."
      }
    ]
  },
  {
    name: "Speechmatics",
    description: "Provides advanced speech recognition technology, supporting various languages and dialects for accurate transcriptions.",
    url: "https://www.speechmatics.com",
    id: "speechmatics",
    image: "/tool-screenshots/speechmatics.png",
    logo: "/logo/speechmatics.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Speechmatics supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Create an account on the Speechmatics platform.",
        links: [{ label: "Speechmatics", url: "https://www.speechmatics.com" }]
      },
      {
        title: "Upload Audio or Video",
        description: "Choose audio or video files to transcribe or process."
      },
      {
        title: "Select Language & Options",
        description: "Pick the language/dialect and enable features like noise reduction or voice synthesis."
      },
      {
        title: "Process & Download Results",
        description: "Receive transcriptions or processed audio. Download results in your preferred format."
      }
    ]
  },
  {
    name: "Jamie AI",
    description: "Offers highly accurate transcription services, suitable for various applications requiring precise speech-to-text conversion.",
    url: "https://meetjamie.ai",
    id: "jamie",
    image: "/tool-screenshots/jamie.png",
    logo: "/logo/jamie.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Jamie AI supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Register for a Jamie AI account and log in.",
        links: [{ label: "Jamie AI", url: "https://meetjamie.ai" }]
      },
      {
        title: "Upload or Record Audio",
        description: "Provide files or record audio for transcription or enhancement."
      },
      {
        title: "Configure Options",
        description: "Select language, enable noise reduction or voice synthesis if needed."
      },
      {
        title: "Process & Review Output",
        description: "Receive and review the transcription or edited audio. Download as needed."
      }
    ]
  },
  {
    name: "Happy Scribe",
    description: "Provides transcription services with support for multiple languages and automatic subtitle generation.",
    url: "https://www.happyscribe.com",
    id: "happy",
    image: "/tool-screenshots/happy.png",
    logo: "/logo/happy.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Happy Scribe supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Register & Access Dashboard",
        description: "Sign up on Happy Scribe and access the transcription dashboard.",
        links: [{ label: "Happy Scribe", url: "https://www.happyscribe.com" }]
      },
      {
        title: "Upload Audio/Video",
        description: "Drag and drop your media files for transcription or subtitle generation."
      },
      {
        title: "Select Language & Service",
        description: "Set the language and choose between transcription or subtitles."
      },
      {
        title: "Edit & Download",
        description: "Edit results within the dashboard and export in preferred formats."
      }
    ]
  },
  {
    name: "Restream",
    description: "A streaming platform that enables multi-platform broadcasting with integrated audio processing capabilities.",
    url: "https://restream.io",
    id: "restream",
    image: "/tool-screenshots/restream.png",
    logo: "/logo/restream.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Restream supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Platforms",
        description: "Create an account and link your streaming destinations (YouTube, Twitch, etc.).",
        links: [{ label: "Restream", url: "https://restream.io" }]
      },
      {
        title: "Configure Audio Enhancements",
        description: "Enable AI-powered features such as noise reduction and audio processing."
      },
      {
        title: "Go Live",
        description: "Start your live stream and broadcast to multiple platforms with enhanced audio."
      },
      {
        title: "Review & Download Streams",
        description: "Access recorded streams and download processed audio/video as needed."
      }
    ]
  },
  {
    name: "Riverside.fm",
    description: "A professional podcast and video recording platform with high-quality audio processing and remote recording capabilities.",
    url: "https://riverside.fm",
    id: "riversidefm",
    image: "/tool-screenshots/riversidefm.png",
    logo: "/logo/riversidefm.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Riverside.fm supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Create Studio",
        description: "Register and set up a recording studio for podcasts or video.",
        links: [{ label: "Riverside.fm", url: "https://riverside.fm" }]
      },
      {
        title: "Invite Guests & Record",
        description: "Invite remote guests and use AI features to enhance audio during recording."
      },
      {
        title: "Utilize Transcription & Editing",
        description: "Generate transcripts and use editing tools to polish your recordings."
      },
      {
        title: "Export & Share",
        description: "Export high-quality audio/video files for publishing."
      }
    ]
  },
  {
    name: "Cleanvoice AI",
    description: "An AI-powered audio cleaning tool that removes filler words, stutters, and background noise from recordings.",
    url: "https://cleanvoice.ai",
    id: "cleanvoice",
    image: "/tool-screenshots/cleanvoice.png",
    logo: "/logo/cleanvoice.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Cleanvoice AI supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Access Cleanvoice Platform",
        description: "Sign up and log in to Cleanvoice’s web interface.",
        links: [{ label: "Cleanvoice AI", url: "https://cleanvoice.ai" }]
      },
      {
        title: "Upload Recordings",
        description: "Add audio files for analysis and cleaning."
      },
      {
        title: "Select Cleaning Features",
        description: "Choose to remove background noise, filler words, and stutters."
      },
      {
        title: "Download Cleaned Audio",
        description: "Review and export cleaned audio files for further use."
      }
    ]
  },
  {
    name: "MyEdit",
    description: "An AI-powered audio editing platform that helps create professional-quality audio content with automated editing features.",
    url: "https://myedit.io",
    id: "myedit",
    image: "/tool-screenshots/myedit.png",
    logo: "/logo/myedit.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: MyEdit supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Register & Access MyEdit",
        description: "Create an account and log in to MyEdit’s interface.",
        links: [{ label: "MyEdit", url: "https://myedit.io" }]
      },
      {
        title: "Upload Audio Files",
        description: "Add recordings or music for editing."
      },
      {
        title: "Apply AI Editing Tools",
        description: "Use noise reduction, transcription, and other enhancement features."
      },
      {
        title: "Review & Export",
        description: "Preview changes and export the final audio for use."
      }
    ]
  },
  {
    name: "Voicemy.ai",
    description: "A voice cloning platform that allows users to create and customize AI voices for various applications.",
    url: "https://voicemy.ai",
    id: "voicemyai",
    image: "/tool-screenshots/voicemyai.png",
    logo: "/logo/voicemyai.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Voicemy.ai supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Register and access Voicemy.ai’s dashboard.",
        links: [{ label: "Voicemy.ai", url: "https://voicemy.ai" }]
      },
      {
        title: "Create or Clone Voices",
        description: "Use the platform to generate or clone custom voices for your projects."
      },
      {
        title: "Apply to Audio",
        description: "Synthesize or modify recordings with AI-generated voices."
      },
      {
        title: "Export or Integrate",
        description: "Download files or use APIs for integration in other apps."
      }
    ]
  },
  {
    name: "Jammable",
    description: "A platform for creating AI-generated music and voice covers with a library of celebrity voice models.",
    url: "https://jammable.com",
    id: "jammable",
    image: "/tool-screenshots/jammable.png",
    logo: "/logo/jammable.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: Jammable supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Register & Log In",
        description: "Sign up and access the Jammable platform.",
        links: [{ label: "Jammable", url: "https://jammable.com" }]
      },
      {
        title: "Choose Models & Create",
        description: "Select voice models or music templates and generate AI audio content."
      },
      {
        title: "Edit & Customize",
        description: "Use built-in tools to further edit and personalize songs or covers."
      },
      {
        title: "Download & Share",
        description: "Export your creations or share them on social platforms."
      }
    ]
  },
  {
    name: "CloneDub",
    description: "An AI voice cloning and dubbing platform that enables multilingual voice conversion and localization.",
    url: "https://clonedub.com",
    id: "clonedub",
    image: "/tool-screenshots/clonedub.png",
    logo: "/logo/clonedub.png",
    categories: ['audio'],
    subcategory: "misc",
    tags: ['AI', 'audio', 'speech'],
    rating: 4.3,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "AI audio processing: CloneDub supports automated audio analysis and enhancements.",
      "Transcription support: Provides tools for converting speech to text.",
      "Noise reduction: Reduces unwanted sounds from audio input.",
      "Voice synthesis: Can generate or clone voices using AI models.",
      "User-friendly interface: Simple design for creators and professionals."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Platform",
        description: "Register for CloneDub and log in.",
        links: [{ label: "CloneDub", url: "https://clonedub.com" }]
      },
      {
        title: "Upload Audio or Select Voices",
        description: "Add audio files and select desired target voices/languages for dubbing."
      },
      {
        title: "Configure & Convert",
        description: "Set language and voice preferences, then generate dubbed audio."
      },
      {
        title: "Download & Use",
        description: "Export multilingual or localized audio for your projects."
      }
    ]
  },
  {
    name: "AlphaCode",
    description: "An AI system by DeepMind designed to solve competitive programming problems.",
    url: "https://alphacode.deepmind.com/",
    id: "alphacode",
    image: "/tool-screenshots/alphacode.png",
    logo: "/logo/alphacode.png",
    categories: ['coding'],
    subcategory: "code generation",
    tags: ['AI', 'code generation', 'competitive programming'],
    rating: 4.5,
    visits: 660000,
    dateAdded: "2025-06-04",
    isPremium: "Free",
    features: [
      "Problem-solving AI: Designed to tackle complex programming challenges.",
      "Competitive programming: Excels in coding competitions.",
      "DeepMind technology: Built by Google's AI research lab.",
      "Multilingual support: Handles multiple programming languages."
    ],
    howToUse: [
      {
        title: "Access AlphaCode",
        description: "Visit the AlphaCode research page for demos and documentation.",
        links: [{ label: "AlphaCode", url: "https://alphacode.deepmind.com/" }]
      },
      {
        title: "Explore Use Cases",
        description: "Review competitive programming problems and solutions."
      },
      {
        title: "Integrate with Platforms",
        description: "Look for integrations or future releases to use AlphaCode in coding contests."
      }
    ]
  },
  {
    name: "OpenAI Codex",
    description: "An AI system that translates natural language into code, powering tools like GitHub Copilot.",
    url: "https://openai.com/codex/",
    id: "openai-codex",
    image: "/tool-screenshots/openai-codex.png",
    logo: "/logo/openai-codex.png",
    categories: ['coding'],
    subcategory: "code generation",
    tags: ['AI', 'natural language processing', 'code generation'],
    rating: 4.7,
    visits: 1700000000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Natural language to code: Converts plain English into code.",
      "Integration with IDEs: Works with popular code editors.",
      "Supports multiple languages: Handles various programming languages.",
      "Powers GitHub Copilot: Underlying engine for Copilot."
    ],
    howToUse: [
      {
        title: "Access via GitHub Copilot or API",
        description: "Use Codex through GitHub Copilot or OpenAI API.",
        links: [
          { label: "OpenAI Codex", url: "https://openai.com/codex/" },
          { label: "GitHub Copilot", url: "https://github.com/features/copilot" }
        ]
      },
      {
        title: "Prompt with Natural Language",
        description: "Describe desired code in plain English in your editor or API request."
      },
      {
        title: "Review and Edit Output",
        description: "Accept, modify, or refine the generated code for your project."
      }
    ]
  },
  {
    name: "CodeGeeX",
    description: "A multilingual code generation model supporting over 20 programming languages.",
    url: "https://codegeex.cn/",
    id: "codegeex",
    image: "/tool-screenshots/codegeex.png",
    logo: "/logo/codegeex.png",
    categories: ['coding'],
    subcategory: "code generation",
    tags: ['AI', 'multilingual', 'code generation'],
    rating: 4.3,
    visits: 18800000,
    dateAdded: "2025-06-04",
    isPremium: "Free",
    features: [
      "Multilingual support: Generates code in over 20 languages.",
      "Large-scale model: Trained on extensive code datasets.",
      "Code translation: Translates code between languages.",
      "IDE integration: Compatible with popular development environments."
    ],
    howToUse: [
      {
        title: "Access CodeGeeX Platform",
        description: "Visit the CodeGeeX website for demos and documentation.",
        links: [{ label: "CodeGeeX", url: "https://codegeex.cn/" }]
      },
      {
        title: "Use Online Demos or Plugins",
        description: "Generate or translate code using web demos or install IDE integrations."
      },
      {
        title: "Prompt and Review",
        description: "Describe your coding need or input code for translation/completion."
      },
      {
        title: "Export & Integrate",
        description: "Copy results into your IDE or integrate via provided APIs."
      }
    ]
  },
  {
    name: "StarCoder",
    description: "An open-source large language model for code generation and completion.",
    url: "https://huggingface.co/blog/starcoder",
    id: "starcoder",
    image: "/tool-screenshots/starcoder.png",
    logo: "/logo/starcoder.png",
    categories: ['coding'],
    subcategory: "code generation",
    tags: ['AI', 'open-source', 'code completion'],
    rating: 4.4,
    visits: 17298,
    dateAdded: "2025-06-04",
    isPremium: "Free",
    features: [
      "Open-source model: Accessible and modifiable by developers.",
      "Code completion: Suggests code snippets as you type.",
      "Supports multiple languages: Handles various programming languages.",
      "Community-driven: Developed and maintained by the community."
    ],
    howToUse: [
      {
        title: "Access StarCoder Model",
        description: "Find and use StarCoder via the HuggingFace Model Hub or integrate with open-source LLM platforms.",
        links: [{ label: "StarCoder on HuggingFace", url: "https://huggingface.co/blog/starcoder" }]
      },
      {
        title: "Integrate with Coding Tools",
        description: "Use provided APIs, CLI tools, or plugins to connect StarCoder to your IDE or workflow."
      },
      {
        title: "Prompt for Code",
        description: "Type code or prompts to receive code completions or suggestions in supported programming languages."
      },
      {
        title: "Customize & Extend",
        description: "Modify the open-source model or contribute to the community for new features and language support."
      }
    ]
  },
  {
    name: "CodeSquire",
    description: "An AI code writing assistant tailored for data scientists and analysts.",
    url: "https://codesquire.ai/",
    id: "codesquire",
    image: "/tool-screenshots/codesquire.png",
    logo: "/logo/codesquire.png",
    categories: ['coding'],
    subcategory: "code assistant",
    tags: ['AI', 'data science', 'code assistant'],
    rating: 4.2,
    visits: 455,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Tailored suggestions: Provides code suggestions for data tasks.",
      "Integration with notebooks: Works with Jupyter and Colab.",
      "Natural language prompts: Converts plain English to code.",
      "Supports SQL and Python: Focused on data-centric languages."
    ],
    howToUse: [
      {
        title: "Install CodeSquire Extension",
        description: "Add CodeSquire to your Jupyter, Colab, or compatible notebook environment.",
        links: [{ label: "CodeSquire", url: "https://codesquire.ai/" }]
      },
      {
        title: "Write Prompts or Code",
        description: "Type natural language or code to receive tailored code completions."
      },
      {
        title: "Accept or Edit Suggestions",
        description: "Insert, edit, or refine the AI-suggested code for your workflow."
      },
      {
        title: "Focus on Data Tasks",
        description: "Leverage SQL and Python support for data analysis and automation."
      }
    ]
  },
  {
    name: "CodeAssist",
    description: "A human-like chatbot that writes code in the editor and answers questions.",
    url: "https://www.codeassist.tech/",
    id: "codeassist",
    image: "/tool-screenshots/codeassist.png",
    logo: "/logo/codeassist.png",
    categories: ['coding'],
    subcategory: "code assistant",
    tags: ['AI', 'chatbot', 'code writing'],
    rating: 4.1,
    visits: 50000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Interactive chatbot: Communicates in natural language.",
      "Code generation: Writes code based on prompts.",
      "IDE integration: Compatible with JetBrains and VS Code.",
      "Supports multiple languages: Handles various programming languages."
    ],
    howToUse: [
      {
        title: "Install CodeAssist Plugin",
        description: "Add CodeAssist to your JetBrains IDE or VS Code via the marketplace.",
        links: [{ label: "CodeAssist", url: "https://www.codeassist.tech/" }]
      },
      {
        title: "Chat & Prompt",
        description: "Use the chatbot interface to ask coding questions or request code generation."
      },
      {
        title: "Insert or Edit Code",
        description: "Directly insert AI-generated code into your editor or modify as needed."
      }
    ]
  },
  {
    name: "CodePal",
    description: "An AI-powered coding assistant that generates code snippets and simplifies coding tasks.",
    url: "https://codepal.ai/",
    id: "codepal",
    image: "/tool-screenshots/codepal.png",
    logo: "/logo/codepal.png",
    categories: ['coding'],
    subcategory: "code assistant",
    tags: ['AI', 'code generation', 'coding assistant'],
    rating: 4.0,
    visits: 49300,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Code snippet generation: Creates code based on input.",
      "Bug detection: Identifies potential issues in code.",
      "Code simplification: Refactors complex code.",
      "Supports various languages: Handles multiple programming languages."
    ],
    howToUse: [
      {
        title: "Sign Up & Access CodePal",
        description: "Register on CodePal’s website to access the web app or browser extension.",
        links: [{ label: "CodePal", url: "https://codepal.ai/" }]
      },
      {
        title: "Describe or Paste Code",
        description: "Enter a task description or paste code to generate, debug, or simplify."
      },
      {
        title: "Review AI Suggestions",
        description: "Accept, edit, or refine code snippets and solutions."
      },
      {
        title: "Export or Use Code",
        description: "Copy snippets into your IDE or export for sharing."
      }
    ]
  },
  {
    name: "Cogram",
    description: "An AI tool that translates natural language into SQL queries and Python code.",
    url: "https://www.cogram.com/",
    id: "cogram",
    image: "/tool-screenshots/cogram.png",
    logo: "/logo/cogram.png",
    categories: ['coding'],
    subcategory: "code generation",
    tags: ['AI', 'SQL', 'Python', 'natural language processing'],
    rating: 4.2,
    visits: 55000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Natural language to SQL: Converts plain English to SQL queries.",
      "Python code generation: Translates descriptions into Python code.",
      "Data analysis assistance: Helps with data-related coding tasks.",
      "Integration with notebooks: Works with Jupyter and other platforms."
    ],
    howToUse: [
      {
        title: "Access Cogram Platform",
        description: "Sign up on Cogram’s website and access the online platform or notebook integration.",
        links: [{ label: "Cogram", url: "https://www.cogram.com/" }]
      },
      {
        title: "Describe Your Task",
        description: "Type natural language instructions or prompts for SQL or Python code."
      },
      {
        title: "Generate & Edit Code",
        description: "Receive code suggestions, review, and edit as needed."
      },
      {
        title: "Integrate with Data Tools",
        description: "Use Cogram’s integrations for data workflows in Jupyter and beyond."
      }
    ]
  },
  {
    name: "AskCodi",
    description: "An AI code assistant that provides code suggestions and answers coding questions.",
    url: "https://www.askcodi.com/",
    id: "askcodi",
    image: "/tool-screenshots/askcodi.png",
    logo: "/logo/askcodi.png",
    categories: ['coding'],
    subcategory: "code assistant",
    tags: ['AI', 'code suggestions', 'coding questions'],
    rating: 4.1,
    visits: 40000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Code suggestions: Provides code snippets based on input.",
      "Question answering: Answers coding-related queries.",
      "Supports multiple languages: Handles various programming languages.",
      "IDE integration: Compatible with popular code editors."
    ],
    howToUse: [
      {
        title: "Install AskCodi Extension",
        description: "Add AskCodi to your IDE or browser from the extension store.",
        links: [{ label: "AskCodi", url: "https://www.askcodi.com/" }]
      },
      {
        title: "Input Query or Task",
        description: "Type your coding question or task description."
      },
      {
        title: "Receive Code Suggestions",
        description: "Review and insert suggested code or answers."
      },
      {
        title: "Edit and Use",
        description: "Modify AI-suggested code as needed for your project."
      }
    ]
  },
  {
    name: "Blackbox AI",
    description: "AI coding assistant that lets you copy code from videos and build faster.",
    url: "https://www.useblackbox.io/",
    id: "blackbox-ai",
    image: "/tool-screenshots/blackbox-ai.png",
    logo: "/logo/blackbox-ai.png",
    categories: ['coding'],
    subcategory: "code assistant",
    tags: ['AI', 'code assistant', 'developer productivity'],
    rating: 4.4,
    visits: 15500000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Video code extraction: Copy code directly from videos.",
      "Autocomplete: AI-based code completions.",
      "Multiple language support: Supports Python, JavaScript, and more.",
      "Search engine: Find any code snippet instantly."
    ],
    howToUse: [
      {
        title: "Install Blackbox AI",
        description: "Add the Blackbox extension to your browser or IDE, or use the web app.",
        links: [{ label: "Blackbox AI", url: "https://www.useblackbox.io/" }]
      },
      {
        title: "Use Video Extraction",
        description: "Pause a video, highlight code, and copy it instantly with Blackbox."
      },
      {
        title: "Autocomplete & Search",
        description: "Use autocomplete for code suggestions or search to find relevant snippets."
      }
    ]
  },
  {
    name: "Sweep AI",
    description: "AI code review and pull request automation tool for teams.",
    url: "https://sweep.dev/",
    id: "sweep-ai",
    image: "/tool-screenshots/sweep-ai.png",
    logo: "/logo/sweep-ai.png",
    categories: ['coding'],
    subcategory: "code review",
    tags: ['AI', 'code review', 'automation'],
    rating: 4.3,
    visits: 7900,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "PR generation: Automates pull request writing.",
      "AI code review: Offers improvement suggestions.",
      "Team collaboration: Designed for team environments.",
      "IDE integrations: Works with GitHub workflows."
    ],
    howToUse: [
      {
        title: "Connect Sweep AI to GitHub",
        description: "Sign up on Sweep’s website and link your GitHub account.",
        links: [{ label: "Sweep AI", url: "https://sweep.dev/" }]
      },
      {
        title: "Automate PRs",
        description: "Let Sweep AI generate and review pull requests for your team."
      },
      {
        title: "Collaborate on Reviews",
        description: "Use the team dashboard to review, accept, or refine suggestions."
      }
    ]
  },
  {
    name: "Refact.ai",
    description: "AI assistant for code suggestions and refactoring in real-time.",
    url: "https://refact.ai/",
    id: "refact-ai",
    image: "/tool-screenshots/refact-ai.png",
    logo: "/logo/refact-ai.png",
    categories: ['coding'],
    subcategory: "code assistant",
    tags: ['AI', 'code refactoring', 'IDE plugin'],
    rating: 4.3,
    visits: 8200,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Real-time suggestions: Offers inline coding help.",
      "Supports major IDEs: Integration with JetBrains and VS Code.",
      "Secure development: Runs locally for sensitive projects.",
      "Custom prompts: Generate specific code with natural input."
    ],
    howToUse: [
      {
        title: "Install Refact.ai Plugin",
        description: "Add Refact.ai to your JetBrains IDE or VS Code.",
        links: [{ label: "Refact.ai", url: "https://refact.ai/" }]
      },
      {
        title: "Use Inline Suggestions",
        description: "Get real-time code suggestions and refactoring help as you type."
      },
      {
        title: "Customize Prompts",
        description: "Write custom prompts to generate or refactor code for specific needs."
      }
    ]
  },
  {
    name: "Continue.dev",
    description: "An open-source autopilot for coding directly within VS Code.",
    url: "https://continue.dev/",
    id: "continue-dev",
    image: "/tool-screenshots/continue-dev.png",
    logo: "/logo/continue-dev.png",
    categories: ['coding'],
    subcategory: "code assistant",
    tags: ['AI', 'open-source', 'IDE extension'],
    rating: 4.4,
    visits: 46000,
    dateAdded: "2025-06-04",
    isPremium: "Free",
    features: [
      "VS Code integration: Seamlessly extends your IDE.",
      "Open-source tool: Modify and extend functionality.",
      "Contextual coding: Generates code based on nearby files.",
      "Prompting panel: Ask and receive inline answers."
    ],
    howToUse: [
      {
        title: "Install Continue.dev Extension",
        description: "Add Continue.dev to your VS Code from the marketplace or via the official website.",
        links: [{ label: "Continue.dev", url: "https://continue.dev/" }]
      },
      {
        title: "Open the Prompt Panel",
        description: "Use the built-in panel to ask questions, request code, or get explanations."
      },
      {
        title: "Leverage Contextual Coding",
        description: "Generate code or refactor directly within your project, with AI referencing your codebase."
      },
      {
        title: "Modify or Extend",
        description: "As an open-source project, you can extend functionality or contribute to the tool."
      }
    ]
  },
  {
    name: "Phind",
    description: "AI-powered search engine and assistant designed for developers.",
    url: "https://www.phind.com/",
    id: "phind",
    image: "/tool-screenshots/phind.png",
    logo: "/logo/phind.png",
    categories: ['coding'],
    subcategory: "search assistant",
    tags: ['AI', 'developer search', 'assistant'],
    rating: 4.6,
    visits: 1400000,
    dateAdded: "2025-06-04",
    isPremium: "Free",
    features: [
      "Developer-focused search: AI-tuned for code queries.",
      "Real-time web data: Combines search with LLM responses.",
      "IDE extensions: Use directly inside coding environments.",
      "Error explanation: Understand and fix bugs faster."
    ],
    howToUse: [
      {
        title: "Go to Phind Website",
        description: "Access Phind via the web for instant search and troubleshooting.",
        links: [{ label: "Phind", url: "https://www.phind.com/" }]
      },
      {
        title: "Install IDE Extension (Optional)",
        description: "Add the Phind extension to VS Code for in-editor search and error explanations."
      },
      {
        title: "Ask Developer Questions",
        description: "Search for code snippets, explanations, or troubleshooting help in natural language."
      },
      {
        title: "Review Contextual Answers",
        description: "Get LLM-powered answers and resources tailored to your query."
      }
    ]
  },
  {
    name: "CodiumAI",
    description: "An AI code integrity platform to write better tests and validate logic.",
    url: "https://www.codium.ai/",
    id: "codiumai",
    image: "/tool-screenshots/codiumai.png",
    logo: "/logo/codiumai.png",
    categories: ['coding'],
    subcategory: "code testing",
    tags: ['AI', 'code quality', 'test generation'],
    rating: 4.5,
    visits: 29000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Test generation: Automatically creates meaningful tests.",
      "Real-time insights: Suggests fixes as you code.",
      "IDE integration: Works with VS Code and JetBrains.",
      "Code integrity: Identifies logical gaps and edge cases."
    ],
    howToUse: [
      {
        title: "Add CodiumAI Extension",
        description: "Install the CodiumAI plugin for VS Code or JetBrains IDEs.",
        links: [{ label: "CodiumAI", url: "https://www.codium.ai/" }]
      },
      {
        title: "Generate Tests",
        description: "Use the tool to automatically suggest and create tests for your code."
      },
      {
        title: "Review Code Insights",
        description: "Receive instant feedback on code integrity and get suggestions for improvements."
      },
      {
        title: "Iterate and Validate",
        description: "Fix logical issues and cover edge cases with AI-guided input."
      }
    ]
  },
  {
    name: "Bito AI",
    description: "AI tool for developers to generate, understand, and document code.",
    url: "https://bito.ai/",
    id: "bito-ai",
    image: "/tool-screenshots/bito-ai.png",
    logo: "/logo/bito-ai.png",
    categories: ['coding'],
    subcategory: "code assistant",
    tags: ['AI', 'documentation', 'developer productivity'],
    rating: 4.1,
    visits: 41000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Code explanation: Breaks down complex logic.",
      "Code generation: Writes code from prompts.",
      "Commenting: Adds helpful code comments.",
      "Test support: Helps with writing unit tests."
    ],
    howToUse: [
      {
        title: "Install Bito AI",
        description: "Add Bito AI as a browser extension, IDE plugin, or use the web app.",
        links: [{ label: "Bito AI", url: "https://bito.ai/" }]
      },
      {
        title: "Input Code or Prompt",
        description: "Paste code or describe what you need to generate or explain."
      },
      {
        title: "Review AI Output",
        description: "Read code explanations, generated code, or suggested comments/tests."
      },
      {
        title: "Export or Use in Project",
        description: "Copy and paste results into your development workflow."
      }
    ]
  },
  {
    name: "Clara Copilot",
    description: "Collaborative AI coding agent for pair programming and team workflows.",
    url: "https://claracopilot.ai/",
    id: "clara-copilot",
    image: "/tool-screenshots/clara-copilot.png",
    logo: "/logo/clara-copilot.png",
    categories: ['coding'],
    subcategory: "pair programming",
    tags: ['AI', 'collaboration', 'coding assistant'],
    rating: 4.3,
    visits: 4100,
    dateAdded: "2025-06-04",
    isPremium: "Premium",
    features: [
      "Live coding assistant: Guides through real-time collaboration.",
      "Multi-user support: Teams can use together in shared sessions.",
      "AI-driven suggestions: Proactively recommends changes.",
      "Secure access: Built with team security in mind."
    ],
    howToUse: [
      {
        title: "Sign Up and Create Team",
        description: "Register on the Clara Copilot website and invite team members.",
        links: [{ label: "Clara Copilot", url: "https://claracopilot.ai/" }]
      },
      {
        title: "Start a Coding Session",
        description: "Launch real-time pair programming or team session."
      },
      {
        title: "Use AI Suggestions",
        description: "Accept, modify, or discuss AI-driven recommendations live."
      },
      {
        title: "Collaborate Securely",
        description: "Work together with secure access and version tracking."
      }
    ]
  },
  {
    name: "Codify",
    description: "Generate code snippets and full modules from natural language prompts.",
    url: "https://www.codify.dev/",
    id: "codify",
    image: "/tool-screenshots/codify.png",
    logo: "/logo/codify.png",
    categories: ['coding'],
    subcategory: "code generation",
    tags: ['AI', 'code generator', 'natural language'],
    rating: 4.0,
    visits: 7200,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Prompt-based generation: Turn descriptions into code.",
      "Supports popular languages: JavaScript, Python, and more.",
      "Custom templates: Build with reusable code blocks.",
      "Collaborative sharing: Share snippets with teams."
    ],
    howToUse: [
      {
        title: "Go to Codify",
        description: "Access Codify via the website and log in or sign up.",
        links: [{ label: "Codify", url: "https://www.codify.dev/" }]
      },
      {
        title: "Describe Your Code Needs",
        description: "Write a natural language prompt describing the snippet or module you want."
      },
      {
        title: "Receive and Edit Code",
        description: "Review generated code, edit, or refine as needed."
      },
      {
        title: "Copy or Share",
        description: "Export the code or share with your team via the platform."
      }
    ]
  },
  {
    name: "AI2sql",
    description: "Convert natural language to SQL queries instantly.",
    url: "https://www.ai2sql.io/",
    id: "ai2sql",
    image: "/tool-screenshots/ai2sql.png",
    logo: "/logo/ai2sql.png",
    categories: ['coding'],
    subcategory: "SQL generation",
    tags: ['AI', 'SQL', 'natural language'],
    rating: 4.3,
    visits: 54000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Natural language to SQL: Translate plain text into queries.",
      "Query optimization: Suggests better query structures.",
      "Supports multiple DBs: MySQL, PostgreSQL, etc.",
      "Real-time feedback: Validate queries instantly."
    ],
    howToUse: [
      {
        title: "Access AI2sql",
        description: "Go to the AI2sql website and log in.",
        links: [{ label: "AI2sql", url: "https://www.ai2sql.io/" }]
      },
      {
        title: "Describe Query in Plain English",
        description: "Type your desired SQL query in natural language."
      },
      {
        title: "Get and Optimize SQL",
        description: "Receive and review the generated SQL. Let the tool suggest optimizations."
      },
      {
        title: "Validate and Use",
        description: "Test or copy the query for your database."
      }
    ]
  },
  {
    name: "PromptLoop",
    description: "Use AI directly in spreadsheets to analyze or transform data.",
    url: "https://www.promptloop.com/",
    id: "promptloop",
    image: "/tool-screenshots/promptloop.png",
    logo: "/logo/promptloop.png",
    categories: ['coding'],
    subcategory: "automation",
    tags: ['AI', 'sheets', 'automation'],
    rating: 4.0,
    visits: 9100,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Spreadsheet AI: Use LLMs in Excel or Sheets.",
      "Formula builder: Write complex logic in simple language.",
      "No-code integration: Set up without coding.",
      "Text processing: Clean and format content."
    ],
    howToUse: [
      {
        title: "Install PromptLoop Add-on",
        description: "Add the PromptLoop extension to Google Sheets or Excel.",
        links: [{ label: "PromptLoop", url: "https://www.promptloop.com/" }]
      },
      {
        title: "Use AI Formulas",
        description: "Enter natural language instructions in your spreadsheet cells."
      },
      {
        title: "Analyze or Transform Data",
        description: "Let AI help with data cleaning, summarization, or logic in your sheet."
      },
      {
        title: "No-Code Setup",
        description: "Set up automations and workflows without writing code."
      }
    ]
  },
  {
    name: "Genie AI",
    description: "Legal-focused AI assistant that helps generate contracts and clauses.",
    url: "https://www.genieai.co/",
    id: "genie-ai",
    image: "/tool-screenshots/genie-ai.png",
    logo: "/logo/genie-ai.png",
    categories: ['coding'],
    subcategory: "legal automation",
    tags: ['AI', 'legal', 'contracts'],
    rating: 4.1,
    visits: 32000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Legal templates: Pre-built contracts to customize.",
      "Clause generator: Drafts based on legal intent.",
      "Collaboration: Co-author with team members.",
      "Version tracking: Keep changes and history."
    ],
    howToUse: [
      {
        title: "Sign Up and Access Genie AI",
        description: "Register on the Genie AI website and log in.",
        links: [{ label: "Genie AI", url: "https://www.genieai.co/" }]
      },
      {
        title: "Select or Create Contract",
        description: "Choose a pre-built template or describe the contract you need."
      },
      {
        title: "Edit and Collaborate",
        description: "Customize clauses, invite collaborators, and iterate."
      },
      {
        title: "Export or Track Versions",
        description: "Download documents or use version history to manage changes."
      }
    ]
  },
  {
    name: "Pieces for Developers",
    description: "Save, enrich, and reuse code snippets with AI-powered productivity tools.",
    url: "https://www.pieces.app/",
    id: "pieces",
    image: "/tool-screenshots/pieces.png",
    logo: "/logo/pieces.png",
    categories: ['coding'],
    subcategory: "snippet management",
    tags: ['AI', 'snippets', 'developer productivity'],
    rating: 4.3,
    visits: 18000,
    dateAdded: "2025-06-04",
    isPremium: "Freemium",
    features: [
      "Snippet enrichment: Add context and metadata with AI.",
      "Smart search: Find saved content quickly.",
      "Offline support: Works without internet connection.",
      "IDE integration: Use in VS Code and IntelliJ."
    ],
    howToUse: [
      {
        title: "Install Pieces App or Extension",
        description: "Download the Pieces desktop app or install the extension for your IDE.",
        links: [{ label: "Pieces for Developers", url: "https://www.pieces.app/" }]
      },
      {
        title: "Save Snippets",
        description: "Save code snippets from anywhere—browser, IDE, or desktop."
      },
      {
        title: "Enrich and Search",
        description: "Let AI add metadata and search for snippets with context-aware suggestions."
      },
      {
        title: "Reuse and Share",
        description: "Insert snippets into your projects, or share with your team."
      }
    ]
  },
  {
    name: "AutoRegex",
    description: "Convert natural language to regular expressions using AI.",
    url: "https://www.autoregex.xyz/",
    id: "autoregex",
    image: "/tool-screenshots/autoregex.png",
    logo: "/logo/autoregex.png",
    categories: ['coding'],
    subcategory: "regex generation",
    tags: ['AI', 'regex', 'natural language'],
    rating: 4.2,
    visits: 15000,
    dateAdded: "2025-06-04",
    isPremium: "Free",
    features: [
      "Natural language input: Describe pattern needs in plain text.",
      "Regex output: Instant conversion to valid regular expressions.",
      "Syntax highlighting: Understand and edit regex easily.",
      "Learning tool: Helps beginners master regex concepts."
    ],
    howToUse: [
      {
        title: "Describe Your Pattern",
        description: "Go to the AutoRegex website and enter a plain language description of the pattern you want to convert to regex.",
        links: [{ label: "AutoRegex", url: "https://www.autoregex.xyz/" }]
      },
      {
        title: "Get Regex Output",
        description: "The tool instantly generates a regular expression based on your input."
      },
      {
        title: "Copy or Edit Regex",
        description: "Copy the generated regex or use syntax highlighting and tools to further refine it."
      },
      {
        title: "Learn Regex Concepts",
        description: "Review explanations and visualizations to understand how the regex works."
      }
    ]
  },
  {
    name: "Codetree",
    description: "AI project planner that converts goals into actionable coding tasks.",
    url: "https://codetree.ai/",
    id: "codetree",
    image: "/tool-screenshots/codetree.png",
    logo: "/logo/codetree.png",
    categories: ['coding'],
    subcategory: "planning",
    tags: ['AI', 'project planning', 'developer tools'],
    rating: 4.1,
    visits: 5600,
    dateAdded: "2025-06-04",
    isPremium: "Premium",
    features: [
      "Goal breakdown: Turn visions into structured plans.",
      "Task auto-generation: Assigns developer-friendly actions.",
      "Milestone mapping: Visualize project progress.",
      "Custom workflows: Tailor planning to your style."
    ],
    howToUse: [
      {
        title: "Start a New Project",
        description: "Sign up and start a new project by describing your coding goal.",
        links: [{ label: "Codetree", url: "https://codetree.ai/" }]
      },
      {
        title: "Generate Actions",
        description: "Let Codetree break down your goal into actionable developer tasks automatically."
      },
      {
        title: "Visualize Milestones",
        description: "Track progress and milestones on the project dashboard."
      },
      {
        title: "Customize Workflow",
        description: "Adjust, add, or remove tasks and milestones to suit your team's workflow."
      }
    ]
  },
  {
    name: "Pixlr",
    description: "A cloud-based image editing suite with AI tools for background removal, image generation, and smart resizing.",
    url: "https://www.pixlr.com/",
    id: "pixlr",
    image: "/tool-screenshots/pixlr.png",
    logo: "/logo/pixlr.png",
    categories: ["design"],
    subcategory: "online-editor",
    tags: ["AI", "image editing", "background removal", "image generation"],
    rating: 4.1,
    visits: 95000,
    dateAdded: "2021-08-10",
    isPremium: "Freemium",
    features: [
      "AI background remover: One-click cutouts with high accuracy.",
      "Smart resizing: Effortlessly crop and resize images using AI.",
      "Image generation: Create visuals from text prompts.",
      "Auto color correction: Instantly enhance colors and exposure.",
      "Batch editing: Apply edits to multiple images at once."
    ],
    howToUse: [
      {
        title: "Open Pixlr Editor",
        description: "Visit the Pixlr website and choose Pixlr X (easy) or Pixlr E (advanced) editor.",
        links: [{ label: "Pixlr", url: "https://www.pixlr.com/" }]
      },
      {
        title: "Upload or Start a Project",
        description: "Upload an image or start with a blank canvas or template."
      },
      {
        title: "Use AI Tools",
        description: "Apply background removal, resizing, or generate images from text prompts."
      },
      {
        title: "Edit and Export",
        description: "Make further adjustments and download your finished image."
      }
    ]
  },
  {
    name: "Luminar Neo",
    description: "A photo editing software with AI features like Sky Replacement, Portrait Enhancer, and Structure AI.",
    url: "https://skylum.com/luminar-neo",
    id: "luminar-neo",
    image: "/tool-screenshots/luminar-neo.png",
    logo: "/logo/luminar-neo.png",
    categories: ["design"],
    subcategory: "photo-editing",
    tags: ["AI", "photo editing", "sky replacement", "portrait enhancer"],
    rating: 4.3,
    visits: 39000,
    dateAdded: "2022-02-17",
    isPremium: "Premium",
    features: [
      "Sky Replacement: Instantly swap skies in your photos with AI.",
      "Portrait Enhancer: Automatically improve skin, eyes, and facial features.",
      "Structure AI: Enhance image details while preserving people and objects.",
      "Relight AI: Intelligently relight your scene for balanced exposure.",
      "Automatic object removal: Clean up distractions with a single click."
    ],
    howToUse: [
      {
        title: "Install Luminar Neo",
        description: "Download and install the software from Skylum’s website.",
        links: [{ label: "Luminar Neo", url: "https://skylum.com/luminar-neo" }]
      },
      {
        title: "Import Photos",
        description: "Open Luminar Neo and import the photos you want to edit."
      },
      {
        title: "Apply AI Tools",
        description: "Use Sky Replacement, Portrait Enhancer, and other AI-powered features to enhance your images."
      },
      {
        title: "Export Your Work",
        description: "Save or share your edited photos in high quality."
      }
    ]
  },
  {
    name: "Remove.bg",
    description: "Specializes in AI-driven background removal for images, streamlining the editing process.",
    url: "https://www.remove.bg/",
    id: "remove-bg",
    image: "/tool-screenshots/remove-bg.png",
    logo: "/logo/remove-bg.png",
    categories: ["design"],
    subcategory: "background-removal",
    tags: ["AI", "background removal", "image editing"],
    rating: 4.6,
    visits: 110000,
    dateAdded: "2020-10-05",
    isPremium: "Freemium",
    features: [
      "Instant background removal: Eliminate backgrounds from photos automatically.",
      "Batch processing: Remove backgrounds from multiple images at once.",
      "High-resolution output: Download images in high quality with transparent backgrounds.",
      "API integration: Automate background removal in your workflows.",
      "Smart hair detection: Retain fine hair and edges for realistic results."
    ],
    howToUse: [
      {
        title: "Go to Remove.bg",
        description: "Visit the Remove.bg website.",
        links: [{ label: "Remove.bg", url: "https://www.remove.bg/" }]
      },
      {
        title: "Upload Your Image",
        description: "Drag and drop your image onto the site or use the upload button."
      },
      {
        title: "Download Result",
        description: "Download the processed image with background removed. Use batch or API features for automation."
      }
    ]
  },
  {
    name: "UXPin",
    description: "A design platform that uses AI to streamline prototyping and collaboration, allowing designers to create interactive prototypes with real code components.",
    url: "https://www.uxpin.com/",
    id: "uxpin",
    image: "/tool-screenshots/uxpin.png",
    logo: "/logo/uxpin.png",
    categories: ["design"],
    subcategory: "design-platform",
    tags: ["AI", "prototyping", "collaboration", "code-based design"],
    rating: 4.2,
    visits: 28000,
    dateAdded: "2021-11-20",
    isPremium: "Premium",
    features: [
      "AI prototyping: Generate interactive prototypes from design specs.",
      "Real-time collaboration: Work together with your team live.",
      "Accessibility checks: Get AI-powered accessibility suggestions.",
      "Design-to-code: Convert designs to code-ready components.",
      "Component libraries: Maintain and reuse design system elements."
    ],
    howToUse: [
      {
        title: "Sign Up and Start Project",
        description: "Create an account on UXPin and start a new design or prototype.",
        links: [{ label: "UXPin", url: "https://www.uxpin.com/" }]
      },
      {
        title: "Design with AI",
        description: "Use AI features to generate prototypes and receive accessibility suggestions."
      },
      {
        title: "Collaborate and Share",
        description: "Invite team members for live collaboration and share interactive prototypes."
      },
      {
        title: "Export Components",
        description: "Convert your design to code or export assets for development."
      }
    ]
  },
  {
    name: "Lummi AI",
    description: "A design assistant that generates design concepts, provides layout suggestions, and offers creative prompts to kickstart the design process.",
    url: "https://lummi.ai/",
    id: "lummi-ai",
    image: "/tool-screenshots/lummi-ai.png",
    logo: "/logo/lummi-ai.png",
    categories: ["design"],
    subcategory: "design-assistant",
    tags: ["AI", "design assistant", "creative prompts", "concept generation"],
    rating: 4.0,
    visits: 17500,
    dateAdded: "2024-01-10",
    isPremium: "Freemium",
    features: [
      "AI design generation: Instantly create design concepts from prompts.",
      "Layout suggestions: Receive automatic layout and color ideas.",
      "Creative prompts: Get unique inspiration to start new projects.",
      "Moodboard automation: Build moodboards and style guides with AI.",
      "Live feedback: Improve your designs with instant suggestions."
    ],
    howToUse: [
      {
        title: "Access Lummi AI",
        description: "Go to Lummi AI and start a new design session.",
        links: [{ label: "Lummi AI", url: "https://lummi.ai/" }]
      },
      {
        title: "Describe Your Needs",
        description: "Enter a prompt or select creative options to generate design concepts."
      },
      {
        title: "Review Suggestions",
        description: "Browse layout, color, and concept suggestions provided by the AI."
      },
      {
        title: "Iterate and Export",
        description: "Refine the chosen design and download assets or moodboards."
      }
    ]
  },
  {
    name: "Fronty",
    description: "Converts mockups into HTML/CSS code using AI, aiding in rapid front-end development.",
    url: "https://fronty.com/",
    id: "fronty",
    image: "/tool-screenshots/fronty.png",
    logo: "/logo/fronty.png",
    categories: ["design"],
    subcategory: "frontend-dev",
    tags: ["AI", "HTML", "CSS", "mockup conversion"],
    rating: 3.9,
    visits: 12000,
    dateAdded: "2023-05-18",
    isPremium: "Freemium",
    features: [
      "Mockup to code: Turn image designs into HTML/CSS automatically.",
      "Color and font extraction: Detect and apply styles from images.",
      "Responsive layout: Create layouts optimized for any device.",
      "Live preview: Instantly see generated website results.",
      "One-click export: Download complete source code easily."
    ],
    howToUse: [
      {
        title: "Upload a Mockup",
        description: "Visit Fronty and upload your image mockup.",
        links: [{ label: "Fronty", url: "https://fronty.com/" }]
      },
      {
        title: "Review Generated Code",
        description: "Preview the automatically generated HTML/CSS layout."
      },
      {
        title: "Edit and Customize",
        description: "Make any required adjustments to the code or layout."
      },
      {
        title: "Export Source Code",
        description: "Download the finished website code in one click."
      }
    ]
  },
  {
    name: "Autodraw",
    description: "Developed by Google, it turns simple doodles into professional-looking drawings using machine learning.",
    url: "https://www.autodraw.com/",
    id: "autodraw",
    image: "/tool-screenshots/autodraw.png",
    logo: "/logo/autodraw.png",
    categories: ["design"],
    subcategory: "drawing",
    tags: ["AI", "drawing", "machine learning", "sketching"],
    rating: 4.4,
    visits: 38000,
    dateAdded: "2019-04-12",
    isPremium: "Free",
    features: [
      "Doodle recognition: Turn rough sketches into clean illustrations.",
      "Icon suggestions: Instantly get matching icons as you draw.",
      "Cross-platform: Use on desktop and mobile browsers.",
      "Sketch library: Access a wide range of free-to-use images.",
      "No registration: Start drawing with no sign-up required."
    ],
    howToUse: [
      {
        title: "Start Drawing",
        description: "Go to Autodraw and begin doodling with your mouse or touchscreen.",
        links: [{ label: "Autodraw", url: "https://www.autodraw.com/" }]
      },
      {
        title: "View Icon Suggestions",
        description: "As you draw, suggested icons will appear above the canvas."
      },
      {
        title: "Select and Refine",
        description: "Click on a suggested icon to replace your doodle with a professional-looking drawing."
      },
      {
        title: "Download or Share",
        description: "Download your finished artwork or share it online."
      }
    ]
  },
  {
    name: "Headlime",
    description: "An AI copywriting tool that generates headlines, descriptions, and microcopy tailored for various design contexts.",
    url: "https://headlime.com/",
    id: "headlime",
    image: "/tool-screenshots/headlime.png",
    logo: "/logo/headlime.png",
    categories: ["design"],
    subcategory: "ai-copywriting",
    tags: ["AI", "copywriting", "headlines", "microcopy"],
    rating: 4.1,
    visits: 22000,
    dateAdded: "2022-06-08",
    isPremium: "Freemium",
    features: [
      "Headline generation: Create catchy headlines and microcopy.",
      "Content suggestions: Get ideas for landing pages and ads.",
      "Custom writing styles: Adjust tone and writing style automatically.",
      "Team collaboration: Work together on content creation.",
      "Multilingual support: Write in multiple languages."
    ],
    howToUse: [
      {
        title: "Describe Your Needs",
        description: "Go to Headlime and enter your design or content requirements.",
        links: [{ label: "Headlime", url: "https://headlime.com/" }]
      },
      {
        title: "Generate Copy",
        description: "Let the AI suggest headlines, descriptions, and microcopy."
      },
      {
        title: "Customize and Edit",
        description: "Adjust style, tone, and content as needed for your design context."
      },
      {
        title: "Export and Use Content",
        description: "Copy the generated text into your landing pages, ads, or prototypes."
      }
    ]
  },
  {
    name: "ComfyUI",
    description: "An open-source, node-based program that allows users to generate images from text prompts using diffusion models.",
    url: "https://github.com/comfyanonymous/ComfyUI",
    id: "comfyui",
    image: "/tool-screenshots/comfyui.png",
    logo: "/logo/comfyui.png",
    categories: ["design"],
    subcategory: "open-source",
    tags: ["AI", "image generation", "diffusion models"],
    rating: 4.6,
    visits: 18500,
    dateAdded: "2023-09-11",
    isPremium: "Free",
    features: [
      "Node-based workflow: Build custom image generation pipelines.",
      "Custom model support: Use your own or community models.",
      "Real-time preview: Instantly see prompt results.",
      "Workflow export: Share and reuse generation setups.",
      "Open source: Community-driven and extensible."
    ],
    howToUse: [
      {
        title: "Install ComfyUI",
        description: "Clone the repository from GitHub and follow the installation instructions for your OS.",
        links: [{ label: "ComfyUI", url: "https://github.com/comfyanonymous/ComfyUI" }]
      },
      {
        title: "Launch the Interface",
        description: "Start the UI by running the provided script (e.g., python main.py)."
      },
      {
        title: "Build Your Workflow",
        description: "Drag and connect nodes to set up your image generation pipeline."
      },
      {
        title: "Generate Images",
        description: "Enter text prompts, select models, and tweak settings. Preview results in real time."
      },
      {
        title: "Export or Share Workflow",
        description: "Export workflows or results for reuse or sharing with the community."
      }
    ]
  },
  {
    name: "Freepik AI Image Generator",
    description: "Creates photorealistic images and digital art from text prompts using advanced AI models.",
    url: "https://www.freepik.com/ai/image-generator",
    id: "freepik-ai-image-generator",
    image: "/tool-screenshots/freepik-ai-image-generator.png",
    logo: "/logo/freepik-ai-image-generator.png",
    categories: ["design"],
    subcategory: "digital-art",
    tags: ["AI", "image generation", "digital art"],
    rating: 4.2,
    visits: 41000,
    dateAdded: "2024-02-19",
    isPremium: "Freemium",
    features: [
      "Text-to-image generation: Create images from textual prompts.",
      "Multiple art styles: Choose from a variety of digital art genres.",
      "Batch creation: Generate multiple images quickly.",
      "Quick editing: Instantly refine and download generated images.",
      "Ecosystem integration: Use in Freepik's design environment."
    ],
    howToUse: [
      {
        title: "Access the Generator",
        description: "Go to Freepik's AI Image Generator page.",
        links: [{ label: "Freepik AI Image Generator", url: "https://www.freepik.com/ai/image-generator" }]
      },
      {
        title: "Enter a Prompt",
        description: "Type a text description of the image you wish to generate."
      },
      {
        title: "Select Art Style and Settings",
        description: "Choose from available styles and adjust settings as desired."
      },
      {
        title: "Generate and Edit",
        description: "Click to create images, edit or refine as needed."
      },
      {
        title: "Download or Use in Designs",
        description: "Download finished images or use them within Freepik's design tools."
      }
    ]
  },
  {
    name: "KNIME",
    description:
      "KNIME is a comprehensive open-source platform designed for data analytics, reporting, and integration. It allows users to visually create data workflows, selectively execute steps, and inspect results, models, and visualizations. KNIME's modular pipelining concept makes it easy for both beginners and experts to build advanced data science solutions with minimal coding. It supports integration with machine learning and deep learning libraries, data manipulation, ETL processes, and offers a vast ecosystem of extensions for specialized analyses. KNIME is widely used in academia and industry for tasks ranging from simple data preprocessing to complex predictive modeling.",
    url: "https://www.knime.com",
    id: "knime",
    image: "/tool-screenshots/knime.png",
    logo: "/logo/knime.png",
    categories: ["data-processing"],
    subcategory: "Data Analytics Platform",
    tags: ["data_mining", "workflow", "open_source"],
    rating: 4.6,
    visits: 1200000,
    dateAdded: "2015-06-15",
    isPremium: "Free",
    features: [
      "Drag-and-Drop Workflow: User-friendly interface for building analytics pipelines without code.",
      "Extensive Integration: Connects with databases, cloud storage, and big data tools.",
      "Advanced Analytics: Supports machine learning, deep learning, statistics, and text mining.",
      "Extensible Platform: Large ecosystem of plugins and community extensions.",
      "Strong Community: Active forums, documentation, and training resources."
    ],
    howToUse: [
      {
        title: "Download and Install KNIME",
        description: "Get the latest version from the KNIME website and install it on your system.",
        links: [{ label: "KNIME", url: "https://www.knime.com" }]
      },
      {
        title: "Create a Workflow",
        description: "Open KNIME and use the drag-and-drop editor to build your data workflow."
      },
      {
        title: "Add Nodes for Data Processing",
        description: "Choose nodes for reading, transforming, analyzing, and visualizing data."
      },
      {
        title: "Execute and Inspect Results",
        description: "Run the workflow, inspect intermediate results, and visualize outputs."
      },
      {
        title: "Extend with Plugins",
        description: "Install community extensions for additional analytics capabilities."
      }
    ]
  },
  {
    name: "RapidMiner",
    description:
      "RapidMiner is a powerful data science platform offering advanced analytics, machine learning, and predictive modeling tools. Its intuitive visual workflow designer allows users to build, train, and deploy machine learning models with little to no coding. RapidMiner supports a wide variety of data sources and provides hundreds of pre-built machine learning algorithms. Its automation and collaboration features help teams accelerate the end-to-end data science lifecycle, from data preparation through deployment. RapidMiner is suitable for both business analysts and data scientists, enabling rapid prototyping and productionization of models.",
    url: "https://rapidminer.com",
    id: "rapidminer",
    image: "/tool-screenshots/rapidminer.png",
    logo: "/logo/rapidminer.png",
    categories: ["data-processing"],
    subcategory: "Data Science Platform",
    tags: ["machine_learning", "data_prep", "predictive_analytics"],
    rating: 4.5,
    visits: 700000,
    dateAdded: "2006-07-01",
    isPremium: "Freemium",
    features: [
      "Visual Workflow Designer: Drag-and-drop interface for building end-to-end data processes.",
      "Automated Machine Learning: AutoML to automatically select and tune models.",
      "Extensive Model Library: Hundreds of built-in algorithms for classification, regression, and clustering.",
      "Integrated Data Prep: Tools for cleaning, transforming, and enriching data.",
      "Collaboration and Sharing: Team features for project management and sharing results."
    ],
    howToUse: [
      {
        title: "Download and Install RapidMiner",
        description: "Get the platform from the RapidMiner website and install on your system.",
        links: [{ label: "RapidMiner", url: "https://rapidminer.com" }]
      },
      {
        title: "Open the Visual Designer",
        description: "Launch RapidMiner Studio and open a new project."
      },
      {
        title: "Build Your Workflow",
        description: "Drag and drop operators to prepare data, train models, and evaluate results."
      },
      {
        title: "Automate and Share Projects",
        description: "Use built-in automation and collaboration tools for deployment and sharing."
      }
    ]
  },
  {
    name: "Apache Spark",
    description:
      "Apache Spark is a unified analytics engine for large-scale data processing, known for its speed and scalability. Spark provides a fast in-memory data processing framework that supports batch and real-time analytics, machine learning, graph processing, and SQL queries. With APIs in Python, Java, Scala, and R, Spark is used for ETL, interactive queries, streaming, and advanced analytics on both structured and unstructured data. Its robust architecture and integration with Hadoop and cloud platforms make it a go-to choice for big data applications in enterprise and research settings.",
    url: "https://spark.apache.org",
    id: "apache_spark",
    image: "/tool-screenshots/apache_spark.png",
    logo: "/logo/apache_spark.png",
    categories: ["data-processing"],
    subcategory: "Big Data Analytics",
    tags: ["big_data", "distributed", "analytics"],
    rating: 4.7,
    visits: 2500000,
    dateAdded: "2014-05-30",
    isPremium: "Free",
    features: [
      "Distributed Computing: Processes massive datasets across clusters for scalability.",
      "Multi-Language Support: APIs for Python, Java, Scala, and R.",
      "In-Memory Processing: High-performance computations by keeping data in memory.",
      "Stream and Batch Processing: Unified engine for real-time and historical data.",
      "Integrated Machine Learning: Built-in MLlib for scalable machine learning algorithms."
    ],
    howToUse: [
      {
        title: "Download and Set Up Spark",
        description: "Get Apache Spark from the official website. Set up on your local machine or cluster.",
        links: [{ label: "Apache Spark", url: "https://spark.apache.org" }]
      },
      {
        title: "Start Spark Session",
        description: "Use your preferred language (Python, Scala, Java, R) to start a Spark session."
      },
      {
        title: "Load and Process Data",
        description: "Read data from files, databases, or distributed storage. Use Spark APIs to process and analyze."
      },
      {
        title: "Run Analytics and Machine Learning",
        description: "Use Spark SQL, MLlib, and GraphX for analytics, ML, and graph processing."
      }
    ]
  },
  {
    name: "Weka",
    description:
      "Weka is a popular open-source collection of machine learning algorithms for data mining tasks, developed at the University of Waikato. Weka features a graphical user interface for easy access to powerful data preprocessing, modeling, and visualization tools. It includes a comprehensive suite of algorithms for classification, regression, clustering, and feature selection. Weka is widely used in education and research for teaching, prototyping, and experimenting with machine learning techniques on structured datasets.",
    url: "https://www.cs.waikato.ac.nz/ml/weka/",
    id: "weka",
    image: "/tool-screenshots/weka.png",
    logo: "/logo/weka.png",
    categories: ["data-processing"],
    subcategory: "Machine Learning Suite",
    tags: ["machine_learning", "data_mining", "open_source"],
    rating: 4.3,
    visits: 350000,
    dateAdded: "2000-07-01",
    isPremium: "Free",
    features: [
      "Comprehensive Algorithms: Wide range of classification, regression, and clustering methods.",
      "Interactive Visualization: Tools for exploring and understanding datasets.",
      "Preprocessing Utilities: Support for data cleaning, filtering, and transformation.",
      "Extensible Framework: Plugin support for adding new methods and integrations.",
      "User-Friendly Interface: Intuitive GUI for non-programmers and rapid prototyping."
    ],
    howToUse: [
      {
        title: "Download and Install Weka",
        description: "Get Weka from the official website and install it on your computer.",
        links: [{ label: "Weka", url: "https://www.cs.waikato.ac.nz/ml/weka/" }]
      },
      {
        title: "Open the GUI",
        description: "Launch the Weka GUI and select the desired application (Explorer, Experimenter, etc.)."
      },
      {
        title: "Load Your Data",
        description: "Import datasets in ARFF, CSV, or other supported formats."
      },
      {
        title: "Apply Algorithms and Visualize",
        description: "Select and run machine learning algorithms, visualize results, and export models."
      }
    ]
  },
  {
    name: "Kaggle Kernels",
    description:
      "Kaggle Kernels is a cloud-based code environment that enables data scientists and analysts to write, run, and share code in Python and R directly in the browser. It provides free access to GPUs and TPUs, seamless integration with Kaggle datasets and competitions, and version control for collaborative projects. With an active community and built-in sharing features, Kaggle Kernels accelerates the prototyping, experimentation, and sharing of data science and machine learning projects.",
    url: "https://www.kaggle.com/code",
    id: "kaggle_kernels",
    image: "/tool-screenshots/kaggle_kernels.png",
    logo: "/logo/kaggle_kernels.png",
    categories: ["data-processing"],
    subcategory: "Cloud Notebooks",
    tags: ["notebook", "data_science", "collaboration"],
    rating: 4.6,
    visits: 8000000,
    dateAdded: "2016-09-01",
    isPremium: "Free",
    features: [
      "Free GPU/TPU Access: Run computationally intensive code at no cost.",
      "Seamless Dataset Access: Direct integration with Kaggle datasets and competitions.",
      "Version Control: Automatically save and track changes in notebooks.",
      "Real-Time Collaboration: Share and work on code together with others.",
      "Multiple Language Support: Native support for Python and R scripts."
    ],
    howToUse: [
      {
        title: "Sign Up and Access Kernels",
        description: "Create a Kaggle account and navigate to the Kernels section.",
        links: [{ label: "Kaggle Kernels", url: "https://www.kaggle.com/code" }]
      },
      {
        title: "Create or Fork a Kernel",
        description: "Start a new notebook or fork an existing one from the community."
      },
      {
        title: "Write and Run Code",
        description: "Develop in Python or R, use GPUs/TPUs, and access datasets directly."
      },
      {
        title: "Share and Collaborate",
        description: "Share kernels publicly or with teams, and collaborate in real time."
      }
    ]
  },
  {
    name: "Amazon SageMaker Neo",
    description:
      "Amazon SageMaker Neo is a model optimization and deployment platform that enables developers to train machine learning models once and deploy them anywhere. Neo automatically optimizes models for multiple hardware platforms, including cloud instances and edge devices, to maximize performance and minimize latency. It integrates seamlessly with the AWS SageMaker ecosystem and supports popular frameworks such as TensorFlow, MXNet, and PyTorch. SageMaker Neo empowers organizations to quickly roll out efficient ML solutions across diverse environments.",
    url: "https://aws.amazon.com/sagemaker/neo/",
    id: "sagemaker_neo",
    image: "/tool-screenshots/sagemaker_neo.png",
    logo: "/logo/sagemaker_neo.png",
    categories: ["data-processing"],
    subcategory: "Model Optimization",
    tags: ["aws", "model_optimization", "deployment"],
    rating: 4.2,
    visits: 120000,
    dateAdded: "2018-11-28",
    isPremium: "Premium",
    features: [
      "Multi-Framework Compatibility: Supports TensorFlow, PyTorch, MXNet, and more.",
      "Cross-Platform Deployment: Optimizes models for cloud and edge hardware.",
      "Accelerated Inference: Reduces latency and improves throughput on optimized hardware.",
      "Seamless AWS Integration: Directly connects with the SageMaker ecosystem.",
      "Automatic Model Compilation: Converts models automatically for target devices."
    ],
    howToUse: [
      {
        title: "Access SageMaker Studio",
        description: "Sign in to AWS and open SageMaker Studio or the Neo console.",
        links: [{ label: "SageMaker Neo", url: "https://aws.amazon.com/sagemaker/neo/" }]
      },
      {
        title: "Train or Import Model",
        description: "Train a new model in SageMaker or import an existing model."
      },
      {
        title: "Optimize with Neo",
        description: "Select the model and use Neo's optimization options for your target hardware."
      },
      {
        title: "Deploy Anywhere",
        description: "Deploy optimized models to cloud endpoints or edge devices."
      }
    ]
  },
  {
    name: "IBM Watson Studio",
    description:
      "IBM Watson Studio is a robust cloud-based environment that enables data scientists, analysts, and developers to collaboratively work on data science and AI projects. The platform provides tools for data preparation, visualization, automated machine learning (AutoAI), and model deployment. With strong integration to IBM Cloud services and support for open-source technologies, Watson Studio helps teams accelerate the entire data science lifecycle, from exploration to production, while ensuring enterprise-grade security and scalability.",
    url: "https://www.ibm.com/cloud/watson-studio",
    id: "watson_studio",
    image: "/tool-screenshots/watson_studio.png",
    logo: "/logo/watson_studio.png",
    categories: ["data-processing"],
    subcategory: "Data Science Platform",
    tags: ["cloud", "data_science", "collaboration"],
    rating: 4.4,
    visits: 450000,
    dateAdded: "2017-02-01",
    isPremium: "Freemium",
    features: [
      "Collaborative Workspace: Enables team-based data science projects.",
      "AutoAI: Automated model building, selection, and optimization.",
      "Interactive Visualization: Dashboards and visual tools for data exploration.",
      "Open Source Integration: Supports Jupyter, RStudio, and other tools.",
      "Easy Model Deployment: Streamlined deployment and monitoring of models."
    ],
    howToUse: [
      {
        title: "Register and Access Watson Studio",
        description: "Sign up on IBM Cloud and access Watson Studio from your dashboard.",
        links: [{ label: "Watson Studio", url: "https://www.ibm.com/cloud/watson-studio" }]
      },
      {
        title: "Start a New Project",
        description: "Create a new project for data analysis, modeling, or visualization."
      },
      {
        title: "Import Data and Build Models",
        description: "Upload datasets, use AutoAI, or develop custom models in Jupyter or RStudio."
      },
      {
        title: "Visualize and Deploy",
        description: "Use dashboards for analysis and deploy models to production as needed."
      }
    ]
  },
  {
    name: "Orange3",
    description:
      "Orange3 is an open-source data visualization and analysis toolbox for both novice and expert users. Its visual programming interface lets users build workflows for data preprocessing, machine learning, and visualization by connecting widgets. Orange3 is extensible with add-ons for text mining, bioinformatics, and more, making it a versatile choice for education, rapid prototyping, and exploratory data analysis. The platform is supported by a vibrant community and extensive documentation.",
    url: "https://orange.biolab.si",
    id: "orange3",
    image: "/tool-screenshots/orange3.png",
    logo: "/logo/orange3.png",
    categories: ["data-processing"],
    subcategory: "Data Visualization & Analysis",
    tags: ["visualization", "data_analysis", "open_source"],
    rating: 4.3,
    visits: 260000,
    dateAdded: "2013-06-01",
    isPremium: "Free",
    features: [
      "Visual Programming: Build analysis workflows with drag-and-drop widgets.",
      "Interactive Data Exploration: Real-time visualizations and interactive reports.",
      "Add-On Ecosystem: Extensions for text mining, bioinformatics, and more.",
      "Educational Focus: Designed for teaching and rapid prototyping.",
      "Integrated Machine Learning: Wide range of built-in ML algorithms."
    ],
    howToUse: [
      {
        title: "Download and Install Orange3",
        description: "Download Orange3 from the official site and install on your system.",
        links: [{ label: "Orange3", url: "https://orange.biolab.si" }]
      },
      {
        title: "Create a Workflow",
        description: "Start a new project and use widgets to build your data analysis pipeline."
      },
      {
        title: "Analyze and Visualize Data",
        description: "Connect widgets to preprocess, analyze, and visualize datasets."
      },
      {
        title: "Extend with Add-ons",
        description: "Install add-ons for specialized analyses such as text mining or bioinformatics."
      }
    ]
  },
  {
    name: "DataRobot",
    description:
      "DataRobot is an enterprise-grade AI platform that automates and streamlines the process of building, deploying, and maintaining machine learning models. It empowers data scientists and business analysts to quickly create accurate predictive models with automated feature engineering, model selection, and hyperparameter tuning. DataRobot offers explainable AI, model monitoring, and integration with major cloud platforms. Its collaborative features and enterprise security make it a trusted choice for mission-critical applications.",
    url: "https://www.datarobot.com",
    id: "datarobot",
    image: "/tool-screenshots/datarobot.png",
    logo: "/logo/datarobot.png",
    categories: ["data-processing"],
    subcategory: "Automated Machine Learning",
    tags: ["automl", "enterprise", "machine_learning"],
    rating: 4.5,
    visits: 190000,
    dateAdded: "2012-12-01",
    isPremium: "Premium",
    features: [
      "Automated Machine Learning: End-to-end automation of model development.",
      "Model Deployment: One-click deployment and model management.",
      "Explainable AI: Built-in tools for model interpretability.",
      "Collaboration: Team-based projects and sharing capabilities.",
      "Data Source Integration: Connects to databases, cloud, and on-premises sources."
    ],
    howToUse: [
      {
        title: "Sign Up and Access DataRobot",
        description: "Request a demo or sign up for an account to access the DataRobot platform.",
        links: [{ label: "DataRobot", url: "https://www.datarobot.com" }]
      },
      {
        title: "Upload Data and Build Models",
        description: "Upload your datasets and let DataRobot automate feature engineering and model training."
      },
      {
        title: "Evaluate and Interpret Models",
        description: "Use built-in explainability tools and dashboards to assess model performance."
      },
      {
        title: "Deploy and Monitor",
        description: "Deploy models to production and monitor them for accuracy and drift."
      }
    ]
  },
  {
    name: "Alteryx",
    description:
      "Alteryx is a powerful platform designed for data blending, advanced analytics, and data science. With its intuitive drag-and-drop interface, users can easily prepare, blend, and analyze data from multiple sources. Alteryx offers a wide range of predictive, statistical, and spatial analytics capabilities. Its automation features reduce manual work and accelerate time-to-insight, making Alteryx a favorite among business analysts and data professionals for building repeatable workflows at scale.",
    url: "https://www.alteryx.com",
    id: "alteryx",
    image: "/tool-screenshots/alteryx.png",
    logo: "/logo/alteryx.png",
    categories: ["data-processing"],
    subcategory: "Data Analytics & ETL",
    tags: ["analytics", "etl", "data_prep"],
    rating: 4.4,
    visits: 420000,
    dateAdded: "2010-01-01",
    isPremium: "Premium",
    features: [
      "Visual Workflow Builder: Drag-and-drop interface for building analytic pipelines.",
      "Data Preparation: Cleans, transforms, and blends data from multiple sources.",
      "Predictive Analytics: Built-in tools for forecasting and classification.",
      "Scalability: Efficiently handles large-scale data workflows.",
      "Collaboration: Enables sharing and reuse of workflows across teams."
    ],
    howToUse: [
      {
        title: "Install & Launch Alteryx Designer",
        description: "Download and install Alteryx Designer. Open the application to start building workflows.",
        links: [{ label: "Alteryx", url: "https://www.alteryx.com" }]
      },
      {
        title: "Connect Data Sources",
        description: "Use the drag-and-drop interface to connect to databases, files, APIs, and more."
      },
      {
        title: "Build & Automate Workflows",
        description: "Drag analytic tools to the canvas, configure them, and chain steps to prepare, blend, and analyze data."
      },
      {
        title: "Run & Share Results",
        description: "Execute workflows to generate outputs. Share or schedule workflows for team collaboration."
      }
    ]
  },
  {
    name: "Qlik",
    description:
      "Qlik is a leading business intelligence and data analytics platform that empowers organizations to explore and analyze data interactively. Qlik's associative engine enables users to discover insights through dynamic dashboards, reports, and visualizations. Qlik supports data integration from diverse sources, embedded AI for advanced analytics, and collaborative features for sharing findings. It is trusted by enterprises worldwide for self-service analytics, guided analytics, and embedded BI solutions.",
    url: "https://www.qlik.com",
    id: "qlik",
    image: "/tool-screenshots/qlik.png",
    logo: "/logo/qlik.png",
    categories: ["data-processing"],
    subcategory: "Business Intelligence",
    tags: ["business_intelligence", "dashboards", "analytics"],
    rating: 4.3,
    visits: 900000,
    dateAdded: "2012-03-01",
    isPremium: "Premium",
    features: [
      "Associative Analytics Engine: Enables dynamic data exploration and discovery.",
      "Interactive Dashboards: Real-time insights and customizable reports.",
      "Data Integration: Connects to a wide variety of data sources.",
      "Built-In AI: Features for predictive analytics and insights.",
      "Collaboration: Tools for sharing and storytelling with analytics."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Qlik Cloud",
        description: "Create a Qlik account and log in to the Qlik Cloud platform.",
        links: [{ label: "Qlik", url: "https://www.qlik.com" }]
      },
      {
        title: "Connect to Data Sources",
        description: "Import data from databases, cloud storage, or files."
      },
      {
        title: "Build Visualizations",
        description: "Use the associative engine and drag-and-drop dashboard editor to create interactive reports."
      },
      {
        title: "Share & Collaborate",
        description: "Share dashboards and insights with your team or organization."
      }
    ]
  },
  {
    name: "Zoho Analytics",
    description:
      "Zoho Analytics is a cloud-based business intelligence and analytics platform that makes it easy to visualize data, build insightful reports, and share dashboards. It offers a no-code interface, AI-powered insights via Zia, and the ability to blend data from hundreds of sources. Zoho Analytics supports team collaboration, scheduled reporting, and data security, making it suitable for businesses of all sizes seeking actionable data insights.",
    url: "https://www.zoho.com/analytics/",
    id: "zoho_analytics",
    image: "/tool-screenshots/zoho_analytics.png",
    logo: "/logo/zoho_analytics.png",
    categories: ["data-processing"],
    subcategory: "Business Intelligence",
    tags: ["bi", "analytics", "cloud"],
    rating: 4.2,
    visits: 650000,
    dateAdded: "2015-10-01",
    isPremium: "Freemium",
    features: [
      "Self-Service Analytics: Create reports and dashboards without coding.",
      "Data Blending: Merge and analyze data from multiple sources.",
      "AI Insights: Zia provides automated insights and anomaly detection.",
      "Collaboration: Share reports and dashboards with your team.",
      "Broad Integrations: Connects to over 500 data sources and apps."
    ],
    howToUse: [
      {
        title: "Register & Log In",
        description: "Sign up for Zoho Analytics and access the dashboard.",
        links: [{ label: "Zoho Analytics", url: "https://www.zoho.com/analytics/" }]
      },
      {
        title: "Import & Blend Data",
        description: "Connect to cloud apps, databases, or upload files to blend and analyze data."
      },
      {
        title: "Create Reports & Dashboards",
        description: "Use the visual builder and Zia insights to create interactive reports and dashboards."
      },
      {
        title: "Collaborate & Schedule",
        description: "Share dashboards with your team and schedule automated report delivery."
      }
    ]
  },
  {
    name: "ThoughtSpot",
    description:
      "ThoughtSpot is an AI-powered analytics platform that enables users to search and analyze business data using natural language queries. It offers real-time, search-driven analytics on cloud or on-prem data, empowering business users to uncover actionable insights without relying on technical experts. With built-in AI for automated insights and recommendations, ThoughtSpot transforms the way organizations approach business intelligence and decision-making.",
    url: "https://www.thoughtspot.com",
    id: "thoughtspot",
    image: "/tool-screenshots/thoughtspot.png",
    logo: "/logo/thoughtspot.png",
    categories: ["data-processing"],
    subcategory: "Search-Driven Analytics",
    tags: ["search_analytics", "bi", "cloud"],
    rating: 4.2,
    visits: 320000,
    dateAdded: "2012-11-01",
    isPremium: "Premium",
    features: [
      "Search-Driven Analytics: Query data using simple, natural language.",
      "AI Insights: Automatically surfaces trends, anomalies, and recommendations.",
      "Real-Time Analysis: Live queries on cloud and on-premises data.",
      "Integration Flexibility: Connects to cloud, warehouse, and local data.",
      "Collaboration: Share insights and dashboards with colleagues."
    ],
    howToUse: [
      {
        title: "Request a Demo or Trial",
        description: "Contact ThoughtSpot for a demo or sign up for a trial to access the platform.",
        links: [{ label: "ThoughtSpot", url: "https://www.thoughtspot.com" }]
      },
      {
        title: "Connect Data Sources",
        description: "Integrate your cloud, warehouse, or local data for analysis."
      },
      {
        title: "Search & Analyze",
        description: "Use natural language search to analyze data and discover insights."
      },
      {
        title: "Share & Collaborate",
        description: "Share findings, dashboards, and automated insights with colleagues."
      }
    ]
  },
  {
    name: "Google Cloud AutoML",
    description:
      "Google Cloud AutoML is a suite of products that enables developers with limited machine learning expertise to train high-quality models tailored to their needs. With a simple graphical interface, users can label data, train models, and deploy them on Google Cloud. AutoML supports a variety of data types, including images, text, and tabular data, and leverages Google's state-of-the-art transfer learning and neural architecture search technologies for optimal results.",
    url: "https://cloud.google.com/automl",
    id: "google_cloud_automl",
    image: "/tool-screenshots/google_cloud_automl.png",
    logo: "/logo/google_cloud_automl.png",
    categories: ["data-processing"],
    subcategory: "Automated Machine Learning",
    tags: ["automl", "cloud", "google"],
    rating: 4.3,
    visits: 380000,
    dateAdded: "2018-01-17",
    isPremium: "Premium",
    features: [
      "Automated Model Training: Build and tune machine learning models with minimal effort.",
      "Support for Multiple Data Types: Image, text, and tabular data.",
      "Easy Deployment: Deploy models to Google Cloud with a few clicks.",
      "Integrated Data Labeling: Built-in tools for annotating datasets.",
      "Scalable Infrastructure: Handles enterprise workloads and large datasets."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Console",
        description: "Create a Google Cloud account and access the AutoML console.",
        links: [{ label: "Google Cloud AutoML", url: "https://cloud.google.com/automl" }]
      },
      {
        title: "Prepare & Label Data",
        description: "Upload your dataset and use built-in tools to label data for training."
      },
      {
        title: "Train & Validate Model",
        description: "Use the graphical interface to train and evaluate machine learning models."
      },
      {
        title: "Deploy & Monitor",
        description: "Deploy models to Google Cloud and monitor their performance in production."
      }
    ]
  },
  {
    name: "H2O.ai",
    description:
      "H2O.ai is an open-source AI platform that delivers advanced machine learning and deep learning capabilities for data scientists and business analysts. It features a scalable architecture, AutoML, and support for distributed computing. H2O.ai offers integration with popular programming languages and supports model interpretability, making it a trusted solution for organizations seeking to accelerate AI adoption.",
    url: "https://www.h2o.ai",
    id: "h2o_ai",
    image: "/tool-screenshots/h2o_ai.png",
    logo: "/logo/h2o_ai.png",
    categories: ["data-processing"],
    subcategory: "Machine Learning Platform",
    tags: ["machine_learning", "open_source", "automl"],
    rating: 4.5,
    visits: 510000,
    dateAdded: "2014-09-01",
    isPremium: "Freemium",
    features: [
      "Open-Source Machine Learning: Free, extensible, and community-driven platform.",
      "AutoML: Automated pipelines for model selection and tuning.",
      "Distributed Processing: Scalable solutions for big data environments.",
      "Multi-Language Support: Integrates with Python, R, and Java.",
      "Model Interpretability: Built-in tools for explaining model predictions."
    ],
    howToUse: [
      {
        title: "Download & Install H2O.ai",
        description: "Download the H2O.ai platform or use the cloud version. Install and configure on your local or cloud environment.",
        links: [{ label: "H2O.ai", url: "https://www.h2o.ai" }]
      },
      {
        title: "Load Data & Build Models",
        description: "Import data and use AutoML or custom pipelines to build models in Python, R, or Java."
      },
      {
        title: "Interpret & Deploy Models",
        description: "Use interpretability tools to explain model results and deploy models to production."
      }
    ]
  },
  {
    name: "MindsDB",
    description:
      "MindsDB is an open-source platform that brings advanced machine learning capabilities directly inside databases. It enables users to create, train, and deploy predictive models using simple SQL queries, without moving data out of the database. MindsDB supports a range of data types and integrates with popular databases and BI tools, simplifying the machine learning workflow for data engineers and analysts.",
    url: "https://mindsdb.com",
    id: "mindsdb",
    image: "/tool-screenshots/mindsdb.png",
    logo: "/logo/mindsdb.png",
    categories: ["data-processing"],
    subcategory: "In-Database Machine Learning",
    tags: ["automl", "database", "open_source"],
    rating: 4.1,
    visits: 110000,
    dateAdded: "2017-09-01",
    isPremium: "Freemium",
    features: [
      "In-Database ML: Train and deploy models within your existing database.",
      "Open Source: Free to use with commercial support options.",
      "Automated Machine Learning: Simplifies ML workflows for SQL users.",
      "Supports Multiple Data Types: Structured and unstructured data.",
      "Extensible: Custom algorithms and integrations available."
    ],
    howToUse: [
      {
        title: "Install MindsDB",
        description: "Install MindsDB on your database server or use the cloud version.",
        links: [{ label: "MindsDB", url: "https://mindsdb.com" }]
      },
      {
        title: "Connect to Database",
        description: "Link MindsDB to your data source for training and inference."
      },
      {
        title: "Create & Train Models",
        description: "Use SQL queries to create and train predictive models directly in your database."
      },
      {
        title: "Query Predictions",
        description: "Run SQL queries to get predictions from your deployed models."
      }
    ]
  },
  {
    name: "Apache NiFi",
    description:
      "Apache NiFi is an open-source tool for automating the flow of data between software systems. With a web-based interface, users can build complex data pipelines for ingestion, transformation, and delivery across a wide range of systems. NiFi is designed for scalability, security, and extensibility, making it ideal for real-time analytics, ETL, and IoT data flows in both enterprise and research environments.",
    url: "https://nifi.apache.org",
    id: "apache_nifi",
    image: "/tool-screenshots/apache_nifi.png",
    logo: "/logo/apache_nifi.png",
    categories: ["data-processing"],
    subcategory: "Data Integration & ETL",
    tags: ["data_integration", "etl", "open_source"],
    rating: 4.2,
    visits: 130000,
    dateAdded: "2015-07-01",
    isPremium: "Free",
    features: [
      "Visual Flow-Based Programming: Drag-and-drop interface for building data flows.",
      "Real-Time Processing: Handles streaming and batch data.",
      "Extensible Processor Library: Wide range of built-in and custom processors.",
      "Security Features: Data encryption, access control, and audit logs.",
      "Scalable Architecture: Designed for both small and enterprise-scale deployments."
    ],
    howToUse: [
      {
        title: "Download & Launch NiFi",
        description: "Download Apache NiFi and start the web UI on your server.",
        links: [{ label: "Apache NiFi", url: "https://nifi.apache.org" }]
      },
      {
        title: "Design Data Flows",
        description: "Use drag-and-drop to create data ingestion, transformation, and delivery pipelines."
      },
      {
        title: "Configure & Monitor",
        description: "Set up processors, security, and monitor pipeline health and performance."
      }
    ]
  },
  {
    name: "Deepnote",
    description:
      "Deepnote is a collaborative notebook platform built for data science and analytics teams. It combines the flexibility of Jupyter notebooks with real-time collaboration, cloud execution, and integrations with popular data sources. Deepnote enables teams to explore data, build models, and create interactive reports together, making it ideal for both rapid prototyping and production analytics workflows.",
    url: "https://deepnote.com",
    id: "deepnote",
    image: "/tool-screenshots/deepnote.png",
    logo: "/logo/deepnote.png",
    categories: ["data-processing"],
    subcategory: "Collaborative Notebooks",
    tags: ["notebook", "collaboration", "cloud"],
    rating: 4.4,
    visits: 100000,
    dateAdded: "2019-06-01",
    isPremium: "Freemium",
    features: [
      "Real-Time Collaboration: Multiple users can edit and run code simultaneously.",
      "Cloud-Based Execution: No local setup or infrastructure required.",
      "Integrations: Connect to databases, cloud storage, and other tools.",
      "Version Control: Track changes and experiment with branching.",
      "Interactive Visualizations: Built-in support for data plots and dashboards."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Workspace",
        description: "Register for Deepnote and log in to your workspace.",
        links: [{ label: "Deepnote", url: "https://deepnote.com" }]
      },
      {
        title: "Create Notebooks & Collaborate",
        description: "Start new notebooks, invite collaborators, and use real-time editing."
      },
      {
        title: "Connect Data & Integrate Tools",
        description: "Integrate with databases, cloud storage, and visualization libraries."
      },
      {
        title: "Analyze & Share Results",
        description: "Build models, visualize data, and share interactive reports."
      }
    ]
  },
  {
    name: "Nanonets",
    description:
      "Nanonets is an AI platform focused on automating document workflows and extracting data from unstructured files such as invoices, receipts, and IDs. Using deep learning, Nanonets can be trained on custom documents and integrated into business processes via API. The platform continuously learns from user feedback, offers multi-language support, and enables organizations to build intelligent document processing solutions at scale.",
    url: "https://nanonets.com",
    id: "nanonets",
    image: "/tool-screenshots/nanonets.png",
    logo: "/logo/nanonets.png",
    categories: ["data-processing"],
    subcategory: "Document AI",
    tags: ["document_ai", "automation", "data_extraction"],
    rating: 4.3,
    visits: 80000,
    dateAdded: "2017-04-01",
    isPremium: "Freemium",
    features: [
      "Automated Data Extraction: Extracts fields from documents and images.",
      "Custom Workflows: Train models on your own documents.",
      "API Integration: Easily integrate with existing business systems.",
      "Multi-Language Support: Processes documents in various languages.",
      "Continuous Learning: Improves accuracy through feedback."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Create an account on Nanonets and log in to the dashboard.",
        links: [{ label: "Nanonets", url: "https://nanonets.com" }]
      },
      {
        title: "Train or Use a Model",
        description: "Upload sample documents to train a custom model or use a prebuilt workflow."
      },
      {
        title: "Integrate with Your Systems",
        description: "Use APIs or integrations to automate document processing in your business."
      },
      {
        title: "Review & Improve",
        description: "Review extracted data and provide feedback to improve model accuracy."
      }
    ]
  },
  {
    name: "Pulse",
    description:
      "Pulse is a data analytics platform designed for monitoring business performance, tracking key metrics, and visualizing KPIs. With customizable dashboards, real-time alerts, and integration capabilities, Pulse helps organizations stay on top of their data and make data-driven decisions. It is particularly useful for executives and managers who need at-a-glance insights into business operations.",
    url: "https://www.pulsedata.io",
    id: "pulse",
    image: "/tool-screenshots/pulse.png",
    logo: "/logo/pulse.png",
    categories: ["data-processing"],
    subcategory: "Business Analytics",
    tags: ["analytics", "kpi", "data_monitoring"],
    rating: 4.0,
    visits: 50000,
    dateAdded: "2019-02-01",
    isPremium: "Premium",
    features: [
      "KPI Tracking: Monitors business metrics in real time.",
      "Custom Dashboards: Build visualizations for specific teams or goals.",
      "Alerting: Notifies users of anomalies or performance thresholds.",
      "Integrates with Data Sources: Connects to databases and business tools.",
      "Data Visualization: Offers a variety of charts and graphs for deep insights."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Data Sources",
        description: "Register for Pulse and log in. Connect your business data sources (databases, SaaS tools) to the platform.",
        links: [{ label: "Pulse", url: "https://www.pulsedata.io" }]
      },
      {
        title: "Build Custom Dashboards",
        description: "Use the dashboard builder to create visualizations for specific teams, departments, or KPIs."
      },
      {
        title: "Set Up Alerts",
        description: "Configure real-time alerts for threshold breaches, anomalies, or significant changes in your metrics."
      },
      {
        title: "Monitor & Analyze",
        description: "Track key metrics and interact with dashboards to gain actionable business insights."
      }
    ]
  },
  {
    name: "Perplexity Labs",
    description:
      "Perplexity Labs is a platform that enables users to build, deploy, and manage AI-powered applications without extensive coding. It offers a no-code builder, model hosting, and analytics tools to track app performance. With easy API integrations and user management features, Perplexity Labs empowers organizations to quickly prototype and launch AI solutions tailored to their business needs.",
    url: "https://labs.perplexity.ai",
    id: "perplexity_labs",
    image: "/tool-screenshots/perplexity_labs.png",
    logo: "/logo/perplexity_labs.png",
    categories: ["data-processing"],
    subcategory: "AI Application Builder",
    tags: ["ai_app", "no_code", "deployment"],
    rating: 4.1,
    visits: 70000,
    dateAdded: "2023-01-01",
    isPremium: "Freemium",
    features: [
      "No-Code Builder: Create AI applications with a simple drag-and-drop editor.",
      "Model Hosting: Deploy and manage custom AI models.",
      "API Integrations: Connect with external data and services.",
      "User Management: Built-in authentication and access control.",
      "Analytics Dashboard: Monitor the usage and performance of your AI apps."
    ],
    howToUse: [
      {
        title: "Register & Start a Project",
        description: "Sign up for Perplexity Labs and start a new AI app project.",
        links: [{ label: "Perplexity Labs", url: "https://labs.perplexity.ai" }]
      },
      {
        title: "Build with No-Code Editor",
        description: "Drag and drop components to create your AI application's interface and logic."
      },
      {
        title: "Deploy & Integrate Models",
        description: "Host your own AI models or use built-in ones. Integrate APIs and data sources as needed."
      },
      {
        title: "Manage Users & Monitor Usage",
        description: "Set up authentication, manage access, and track app usage with built-in analytics."
      }
    ]
  },
  {
    name: "Numerous.ai",
    description:
      "Numerous.ai is an AI-powered automation tool designed to enhance spreadsheet productivity. It enables users to automate repetitive tasks, enrich data with external sources, and leverage AI formulas directly in Google Sheets or Excel. Numerous.ai offers real-time collaboration and supports bulk data processing, making it a valuable asset for analysts and teams working with large datasets.",
    url: "https://numerous.ai",
    id: "numerous_ai",
    image: "/tool-screenshots/numerous.png",
    logo: "/logo/numerous_ai.png",
    categories: ["data-processing"],
    subcategory: "Spreadsheet Automation",
    tags: ["spreadsheet", "automation", "data_enrichment"],
    rating: 4.0,
    visits: 60000,
    dateAdded: "2022-03-01",
    isPremium: "Freemium",
    features: [
      "AI Formulas: Automate complex calculations and tasks.",
      "Data Enrichment: Import and update data from external sources.",
      "Seamless Integration: Works natively with Google Sheets and Excel.",
      "Bulk Processing: Handles large-scale spreadsheet operations.",
      "Real-Time Collaboration: Share and edit spreadsheets with your team."
    ],
    howToUse: [
      {
        title: "Install Numerous.ai Add-on",
        description: "Add Numerous.ai to your Google Sheets or Excel from the respective app marketplace.",
        links: [{ label: "Numerous.ai", url: "https://numerous.ai" }]
      },
      {
        title: "Connect Data Sources",
        description: "Link external data sources or APIs for enrichment and automation."
      },
      {
        title: "Use AI Formulas",
        description: "Apply AI-driven formulas and automations directly in your spreadsheets."
      },
      {
        title: "Collaborate & Process in Bulk",
        description: "Invite team members for real-time collaboration and execute bulk operations as needed."
      }
    ]
  },
  {
    name: "Leonardo.Ai",
    description: "Leonardo.Ai is an AI-powered creative platform for generating high-quality art, illustrations, and concept images. It offers a variety of generative models and customization tools, making it ideal for game assets, concept artists, and designers seeking unique visuals. Its intuitive interface and prompt-based generation help users create professional artwork with minimal effort.",
    url: "https://leonardo.ai",
    id: "leonardo_ai",
    image: "/tool-screenshots/leonardo_ai.png",
    logo: "/logo/leonardo_ai.png",
    categories: ["design", "image"],
    subcategory: "AI Art Generator",
    tags: ["ai_art", "concept_art", "visuals", "prompt"],
    rating: 4.6,
    visits: 1200000,
    dateAdded: "2023-03-01",
    isPremium: "Freemium",
    features: [
      "Prompt-Based Generation: Create images from text prompts.",
      "Style Customization: Choose from various artistic styles and modifiers.",
      "Batch Generation: Produce multiple variations simultaneously.",
      "Asset Library: Save and manage your generated artwork.",
      "Community Gallery: Share and explore creations from other users."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Leonardo.Ai",
        description: "Create an account and log in to the Leonardo.Ai dashboard.",
        links: [{ label: "Leonardo.Ai", url: "https://leonardo.ai" }]
      },
      {
        title: "Enter Prompt & Customize",
        description: "Input a text prompt, select styles, and adjust modifiers for your image."
      },
      {
        title: "Generate & Save Artwork",
        description: "Generate images in batches, then save, manage, or share them in your asset library."
      },
      {
        title: "Explore Community Gallery",
        description: "Browse and interact with other users' creations for inspiration."
      }
    ]
  },
  {
    name: "Ideogram",
    description: "Ideogram is an AI art tool focused on generating images with text and typography. It enables users to create visually engaging posters, social media content, and graphics by combining AI-powered art generation with customizable fonts and layouts. Ideogram excels at producing images that integrate readable and stylized text.",
    url: "https://ideogram.ai",
    id: "ideogram",
    image: "/tool-screenshots/ideogram.png",
    logo: "/logo/ideogram.png",
    categories: ["design", "image"],
    subcategory: "Text-to-Image",
    tags: ["ai_art", "typography", "text_to_image", "graphics"],
    rating: 4.5,
    visits: 900000,
    dateAdded: "2023-08-01",
    isPremium: "Freemium",
    features: [
      "Text Integration: Generate images with embedded, stylized text.",
      "Typography Controls: Customize fonts, size, and placement.",
      "Prompt-Based Art: Create unique visuals from descriptions.",
      "Templates: Pre-made layouts for posters and graphics.",
      "Export Options: Download images in high resolution."
    ],
    howToUse: [
      {
        title: "Register & Log In",
        description: "Sign up for Ideogram, then access the prompt-based art generator.",
        links: [{ label: "Ideogram", url: "https://ideogram.ai" }]
      },
      {
        title: "Describe & Style",
        description: "Enter a prompt, choose font, layout, and styling options."
      },
      {
        title: "Generate & Edit",
        description: "Create images with integrated text, and adjust as needed."
      },
      {
        title: "Download & Share",
        description: "Export your graphics for use in marketing, social, or print projects."
      }
    ]
  },
  {
    name: "DALL·E 3",
    description: "DALL·E 3, developed by OpenAI, is a state-of-the-art AI image generator that creates highly detailed and coherent images from natural language prompts. It excels at understanding complex instructions, producing art, illustrations, and photorealistic images. DALL·E 3 is widely used for creative projects, concept art, and visual content generation.",
    url: "https://openai.com/dall-e-3",
    id: "dalle_3",
    image: "/tool-screenshots/dalle_3.png",
    logo: "/logo/dalle_3.png",
    categories: ["design", "image"],
    subcategory: "AI Image Generation",
    tags: ["ai_art", "image_generation", "openai", "creative"],
    rating: 4.7,
    visits: 2500000,
    dateAdded: "2023-10-01",
    isPremium: "Freemium",
    features: [
      "Natural Language Understanding: Converts detailed prompts into images.",
      "High Resolution Output: Generates images suitable for print and digital use.",
      "Style Versatility: Supports photorealistic and artistic outputs.",
      "Inpainting: Edit and refine parts of generated images.",
      "Seamless Integration: Used in ChatGPT Plus and other platforms."
    ],
    howToUse: [
      {
        title: "Access DALL·E 3 via Platform",
        description: "Use DALL·E 3 through OpenAI’s platform or integrated services (e.g., ChatGPT Plus).",
        links: [{ label: "DALL·E 3", url: "https://openai.com/dall-e-3" }]
      },
      {
        title: "Describe Your Image",
        description: "Enter a detailed prompt specifying what you want to generate."
      },
      {
        title: "Review & Refine",
        description: "Edit the prompt or use inpainting to refine specific areas."
      },
      {
        title: "Download & Use",
        description: "Save generated images for creative or commercial projects."
      }
    ]
  },
  {
    name: "Adobe Firefly",
    description: "Adobe Firefly is Adobe's generative AI model for creative professionals. It enables image generation, text effects, and vector creation using natural language prompts. Deeply integrated with Adobe Creative Cloud, Firefly empowers designers to rapidly prototype and enhance projects with AI-powered visuals tailored for commercial use.",
    url: "https://adobe.com/sensei/generative-ai/firefly",
    id: "adobe_firefly",
    image: "/tool-screenshots/adobe_firefly.png",
    logo: "/logo/adobe_firefly.png",
    categories: ["design", "image"],
    subcategory: "Generative AI",
    tags: ["adobe", "ai_art", "creative_cloud", "text_effects"],
    rating: 4.5,
    visits: 1800000,
    dateAdded: "2023-05-01",
    isPremium: "Freemium",
    features: [
      "Text-to-Image: Create images from descriptions.",
      "Text Effects: Apply unique styles to text for branding.",
      "Vector Generation: Produce vector art with AI assistance.",
      "Seamless Integration: Works within Adobe Photoshop and Illustrator.",
      "Commercial Use: Outputs designed to be safe for business projects."
    ],
    howToUse: [
      {
        title: "Sign In with Adobe Account",
        description: "Access Firefly through Creative Cloud or web app with your Adobe account.",
        links: [{ label: "Adobe Firefly", url: "https://adobe.com/sensei/generative-ai/firefly" }]
      },
      {
        title: "Choose Generation Tool",
        description: "Select from text-to-image, text effects, or vector generation."
      },
      {
        title: "Enter Prompt & Customize",
        description: "Describe the image or effect, and fine-tune settings (styles, colors, etc.)."
      },
      {
        title: "Export or Integrate",
        description: "Download outputs or use them in Photoshop, Illustrator, or other Adobe apps."
      }
    ]
  },
  {
    name: "Photoroom",
    description: "Photoroom is an AI-powered photo editing tool specializing in background removal, object isolation, and product photography enhancement. Used by e-commerce sellers and marketers, it provides instant cutouts, batch processing, and creative effects to turn ordinary photos into professional assets.",
    url: "https://photoroom.com",
    id: "photoroom",
    image: "/tool-screenshots/photoroom.png",
    logo: "/logo/photoroom.png",
    categories: ["design", "image"],
    subcategory: "Photo Editing",
    tags: ["background_removal", "photo_editing", "ecommerce", "creative"],
    rating: 4.6,
    visits: 6000000,
    dateAdded: "2020-07-01",
    isPremium: "Freemium",
    features: [
      "Background Removal: Instantly isolate subjects from backgrounds.",
      "Batch Editing: Process multiple images at once.",
      "Templates: Ready-to-use layouts for social media and e-commerce.",
      "AI Effects: Add shadows, blur, and color enhancements.",
      "Mobile and Web: Available as an app and online."
    ],
    howToUse: [
      {
        title: "Download App or Use Online",
        description: "Access Photoroom via web or mobile app.",
        links: [{ label: "Photoroom", url: "https://photoroom.com" }]
      },
      {
        title: "Upload or Capture Image",
        description: "Add a photo for background removal or editing."
      },
      {
        title: "Apply Edits & Effects",
        description: "Use templates, remove backgrounds, or add effects as needed."
      },
      {
        title: "Download or Share",
        description: "Export edited images for e-commerce, marketing, or personal use."
      }
    ]
  },
  {
    name: "Picsart AI",
    description: "Picsart AI is a robust creative platform featuring a suite of AI-powered tools for photo editing, video creation, and visual design. Known for its art filters, background changes, and generative effects, Picsart AI enables users to produce engaging content for personal and commercial use with ease.",
    url: "https://picsart.com/ai-tools",
    id: "picsart_ai",
    image: "/tool-screenshots/picsart_ai.png",
    logo: "/logo/picsart_ai.png",
    categories: ["design", "image", "video"],
    subcategory: "Creative Suite",
    tags: ["photo_editing", "ai_art", "video", "filters"],
    rating: 4.5,
    visits: 30000000,
    dateAdded: "2012-11-01",
    isPremium: "Freemium",
    features: [
      "AI Art Filters: Transform photos into artistic masterpieces.",
      "Background Replacement: Change and edit image backgrounds easily.",
      "Video Creation: Produce and edit videos with AI effects.",
      "Stickers and Assets: Huge library of creative elements.",
      "Collage and Templates: Design posts, stories, and ads quickly."
    ],
    howToUse: [
      {
        title: "Install or Access Online",
        description: "Use Picsart via mobile app or web platform.",
        links: [{ label: "Picsart AI", url: "https://picsart.com/ai-tools" }]
      },
      {
        title: "Start a Project",
        description: "Open a new photo or video project for editing or creation."
      },
      {
        title: "Apply AI Tools",
        description: "Use art filters, background removal, or generative effects for your project."
      },
      {
        title: "Export & Publish",
        description: "Download, share, or publish your finished content."
      }
    ]
  },
  {
    name: "Deep Dream Generator",
    description: "Deep Dream Generator is an online tool that leverages neural networks to generate unique, dreamlike images from photos. It allows users to apply different AI models and styles to create surreal, artistic visuals, making it a favorite among digital artists and enthusiasts.",
    url: "https://deepdreamgenerator.com",
    id: "deep_dream_generator",
    image: "/tool-screenshots/deep_dream_generator.png",
    logo: "/logo/deep_dream_generator.png",
    categories: ["design", "image"],
    subcategory: "Artistic Filters",
    tags: ["ai_art", "filters", "neural_network", "surreal"],
    rating: 4.2,
    visits: 250000,
    dateAdded: "2015-09-01",
    isPremium: "Freemium",
    features: [
      "Dreamlike Filters: Apply surreal AI-generated styles to photos.",
      "Style Transfer: Mix multiple styles on a single image.",
      "Multiple Models: Choose from deep dream, thin style, and more.",
      "Community Gallery: Explore and share creations.",
      "High-Resolution Export: Download images in print quality."
    ],
    howToUse: [
      {
        title: "Go to Deep Dream Generator",
        description: "Access the tool online and create an account for full features.",
        links: [{ label: "Deep Dream Generator", url: "https://deepdreamgenerator.com" }]
      },
      {
        title: "Upload a Photo",
        description: "Choose a photo and select a dream filter or style."
      },
      {
        title: "Generate & Adjust",
        description: "Apply neural network models and tweak settings for desired results."
      },
      {
        title: "Download or Share",
        description: "Download your dreamlike image or share in the community gallery."
      }
    ]
  },
  {
    name: "PaintsChainer",
    description: "PaintsChainer is an AI-powered automatic coloring tool for sketches and line art. It generates beautiful, anime-style artwork from black-and-white drawings, offering several AI models and manual adjustment options for colors, shading, and styles.",
    url: "https://paintschainer.preferred.tech",
    id: "paintschainer",
    image: "/tool-screenshots/paintschainer.png",
    logo: "/logo/paintschainer.png",
    categories: ["design", "image"],
    subcategory: "AI Coloring",
    tags: ["ai_art", "coloring", "anime", "illustration"],
    rating: 4.2,
    visits: 210000,
    dateAdded: "2017-03-01",
    isPremium: "Freemium",
    features: [
      "Automatic Coloring: AI fills sketches with colors and shading.",
      "Style Selection: Choose from different coloring models.",
      "Manual Touch-Up: Customize colors and effects after generation.",
      "Line Art Detection: Works with various drawing styles.",
      "High-Quality Output: Downloads for print and digital use."
    ],
    howToUse: [
      {
        title: "Access PaintsChainer",
        description: "Go to the PaintsChainer website and upload your sketch or line art.",
        links: [{ label: "PaintsChainer", url: "https://paintschainer.preferred.tech" }]
      },
      {
        title: "Choose a Coloring Style",
        description: "Pick from several AI coloring models and adjust style parameters."
      },
      {
        title: "Edit & Refine",
        description: "Manually adjust colors, shading, or add finishing touches."
      },
      {
        title: "Download Artwork",
        description: "Export your colored illustration for print or digital use."
      }
    ]
  },
  {
    name: "Framer AI",
    description: "Framer AI extends Framer's website and UI design platform with AI-powered prototyping and content generation. Designers can generate layouts, copy, and interactive components from natural language prompts, streamlining the web design process for both beginners and professionals.",
    url: "https://framer.com/ai",
    id: "framer_ai",
    image: "/tool-screenshots/framer_ai.png",
    logo: "/logo/framer_ai.png",
    categories: ["design", "coding", "productivity"],
    subcategory: "AI Web Design",
    tags: ["ui", "web_design", "ai_content", "prototyping"],
    rating: 4.4,
    visits: 750000,
    dateAdded: "2023-02-01",
    isPremium: "Freemium",
    features: [
      "AI Layouts: Generate page structures with text prompts.",
      "Copywriting: Instantly create and edit website copy.",
      "Component Library: Access interactive UI building blocks.",
      "Live Preview: See and test designs in real time.",
      "One-Click Publish: Deploy finished sites easily."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Framer AI",
        description: "Create a Framer account and access the Framer AI feature via the web dashboard.",
        links: [
          { label: "Framer AI", url: "https://framer.com/ai" }
        ]
      },
      {
        title: "Start a New Project",
        description: "Begin a new site or UI design project within the Framer editor."
      },
      {
        title: "Generate Layouts & Copy",
        description: "Use natural language prompts to generate layouts, website copy, or interactive elements instantly."
      },
      {
        title: "Edit & Customize",
        description: "Refine the generated content, drag-and-drop components, and preview your work in real time."
      },
      {
        title: "Publish or Export",
        description: "Publish your finished site with one click, or export code/assets for further development."
      }
    ]
  },
  {
    name: "TeleportHQ",
    description: "TeleportHQ is a low-code platform for creating, prototyping, and publishing websites using AI. It offers visual drag-and-drop editors, AI-powered code generation, and seamless export to frameworks like React and Vue. TeleportHQ is ideal for designers who want to bridge the gap between design and development.",
    url: "https://teleporthq.io",
    id: "teleporthq",
    image: "/tool-screenshots/teleporthq.png",
    logo: "/logo/teleporthq.png",
    categories: ["design", "coding", "productivity"],
    subcategory: "Low-Code Web Design",
    tags: ["web_design", "low_code", "ai_code", "prototyping"],
    rating: 4.1,
    visits: 120000,
    dateAdded: "2019-06-01",
    isPremium: "Freemium",
    features: [
      "Drag-and-Drop Editor: Visually assemble web layouts.",
      "AI Code Generation: Turn wireframes into production-ready code.",
      "Export to Frameworks: Supports React, Vue, and HTML/CSS.",
      "Collaboration: Team-based project management.",
      "Component Marketplace: Use and share UI components."
    ],
    howToUse: [
      {
        title: "Register & Access Editor",
        description: "Sign up for TeleportHQ and open the web-based editor.",
        links: [
          { label: "TeleportHQ", url: "https://teleporthq.io" }
        ]
      },
      {
        title: "Create or Import a Project",
        description: "Start a project from scratch or import an existing design."
      },
      {
        title: "Design Visually",
        description: "Use the drag-and-drop interface to assemble your website layout."
      },
      {
        title: "Generate & Export Code",
        description: "Let AI convert your design to code. Export to React, Vue, or as static HTML/CSS."
      },
      {
        title: "Collaborate & Publish",
        description: "Invite team members, manage permissions, and publish your site online."
      }
    ]
  },
  {
    name: "Anima",
    description: "Anima bridges the gap between design and development by converting Figma, Adobe XD, and Sketch designs into developer-friendly React, HTML, and CSS code. It streamlines handoff, supports prototyping with real data, and enhances workflow for product teams.",
    url: "https://animaapp.com",
    id: "anima",
    image: "/tool-screenshots/anima.png",
    logo: "/logo/anima.png",
    categories: ["design", "coding", "productivity"],
    subcategory: "Design to Code",
    tags: ["figma", "sketch", "code_generation", "handoff"],
    rating: 4.3,
    visits: 300000,
    dateAdded: "2017-06-01",
    isPremium: "Freemium",
    features: [
      "Design-to-Code: Convert designs to React, HTML, and CSS.",
      "Prototyping with Real Data: Use real APIs in prototypes.",
      "Automatic Code Updates: Sync design changes instantly.",
      "Collaboration: Comment and iterate with teams.",
      "Plugin Support: Integrates with leading design tools."
    ],
    howToUse: [
      {
        title: "Create Account & Install Plugin",
        description: "Sign up on Anima and install the plugin for Figma, Sketch, or XD.",
        links: [
          { label: "Anima", url: "https://animaapp.com" }
        ]
      },
      {
        title: "Sync Your Design",
        description: "Connect your design tool and sync your project to Anima."
      },
      {
        title: "Convert to Code",
        description: "Let Anima generate React, HTML, or CSS code from your design."
      },
      {
        title: "Prototype with Real Data",
        description: "Integrate live data or APIs to test interactive prototypes."
      },
      {
        title: "Collaborate and Export",
        description: "Share projects with your team and export code for development."
      }
    ]
  },
  {
    name: "Builder.io",
    description: "Builder.io is a visual CMS and page builder that empowers teams to create, test, and optimize digital experiences without writing code. With AI-powered content generation and modular components, Builder.io speeds up development and enables dynamic, data-driven web pages.",
    url: "https://builder.io",
    id: "builder_io",
    image: "/tool-screenshots/builder_io.png",
    logo: "/logo/builder_io.png",
    categories: ["design", "coding", "productivity"],
    subcategory: "Visual Web Builder",
    tags: ["cms", "page_builder", "ai_content", "optimization"],
    rating: 4.2,
    visits: 170000,
    dateAdded: "2018-05-01",
    isPremium: "Freemium",
    features: [
      "Visual Editing: Drag-and-drop page creation.",
      "AI Content Generation: Quickly produce text and images.",
      "A/B Testing: Experiment with versions and track conversions.",
      "Integration: Connects with React, Vue, Angular, and more.",
      "Dynamic Data: Display content from APIs and databases."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Builder.io",
        description: "Create your account and access the visual editor.",
        links: [
          { label: "Builder.io", url: "https://builder.io" }
        ]
      },
      {
        title: "Start a New Page or Project",
        description: "Create a new page or import an existing site for editing."
      },
      {
        title: "Design Visually",
        description: "Drag and drop components, and use AI to generate or optimize content."
      },
      {
        title: "Integrate & Test",
        description: "Connect to frameworks, APIs, or dynamic data sources. Use A/B testing to optimize."
      },
      {
        title: "Publish & Export",
        description: "Publish directly or export code and assets for deployment."
      }
    ]
  },
  {
    name: "Relume",
    description: "Relume is an AI-powered site builder that generates website wireframes, copy, and design with simple prompts. Focused on rapid prototyping and agency workflows, it enables quick iteration and seamless export to Figma or Webflow.",
    url: "https://relume.io",
    id: "relume",
    image: "/tool-screenshots/relume.png",
    logo: "/logo/relume.png",
    categories: ["design", "coding"],
    subcategory: "AI Site Builder",
    tags: ["wireframe", "ai_copy", "webflow", "agency"],
    rating: 4.1,
    visits: 90000,
    dateAdded: "2023-06-01",
    isPremium: "Freemium",
    features: [
      "Prompt-Based Generation: Build site wireframes from descriptions.",
      "AI Copywriting: Instantly generate and edit website content.",
      "Export Options: Send designs to Figma or Webflow.",
      "Library of Blocks: Mix-and-match prebuilt components.",
      "Collaboration: Share and iterate with team members."
    ],
    howToUse: [
      {
        title: "Sign Up & Start a Project",
        description: "Register on Relume, then start a new site project.",
        links: [
          { label: "Relume", url: "https://relume.io" }
        ]
      },
      {
        title: "Describe Your Site",
        description: "Enter a prompt describing the purpose and features of your site."
      },
      {
        title: "Generate & Edit Wireframe",
        description: "Let AI build your site’s structure and content. Modify and refine as needed."
      },
      {
        title: "Export or Share",
        description: "Export your site wireframe to Figma/Webflow, or share with your team."
      }
    ]
  },
  {
    name: "Penpot",
    description: "Penpot is an open-source design and prototyping platform for cross-functional teams. It offers collaborative vector editing, interactive prototyping, and supports open web standards. Penpot is web-based and suitable for both designers and developers who value transparency and extensibility.",
    url: "https://penpot.app",
    id: "penpot",
    image: "/tool-screenshots/penpot.png",
    logo: "/logo/penpot.png",
    categories: ["design", "coding", "productivity"],
    subcategory: "Open Source Design",
    tags: ["open_source", "vector", "prototyping", "collaboration"],
    rating: 4.2,
    visits: 130000,
    dateAdded: "2021-01-01",
    isPremium: "Free",
    features: [
      "Collaborative Editing: Work on designs with teams in real time.",
      "Vector Tools: Create detailed illustrations and interfaces.",
      "Interactive Prototyping: Build and share clickable prototypes.",
      "Open Standards: Export to SVG and other formats.",
      "Plugin Architecture: Extend and customize functionality."
    ],
    howToUse: [
      {
        title: "Register & Log In",
        description: "Create a free account on Penpot and access the web app.",
        links: [
          { label: "Penpot", url: "https://penpot.app" }
        ]
      },
      {
        title: "Start New Design or Import Assets",
        description: "Begin a new design or import SVGs and other assets."
      },
      {
        title: "Design & Prototype",
        description: "Use vector editing and prototyping features. Collaborate with others in real time."
      },
      {
        title: "Export & Extend",
        description: "Export your work to SVG/other formats or add plugins for new features."
      }
    ]
  },
  {
    name: "Fontjoy",
    description: "Fontjoy uses AI to help designers generate harmonious font pairings for their projects. By leveraging deep learning, it suggests visually compatible font combinations, making typography selection easier for web, print, and branding work.",
    url: "https://fontjoy.com",
    id: "fontjoy",
    image: "/tool-screenshots/fontjoy.png",
    logo: "/logo/fontjoy.png",
    categories: ["design", "productivity"],
    subcategory: "Typography",
    tags: ["ai", "fonts", "typography", "branding"],
    rating: 4.0,
    visits: 70000,
    dateAdded: "2017-04-01",
    isPremium: "Free",
    features: [
      "Automated Pairing: Instantly get compatible font combinations.",
      "Manual Adjustment: Fine-tune font matches and weights.",
      "Preview Tool: See pairings in sample content.",
      "Export: Copy CSS and font details for web use.",
      "Open Library: Access a variety of Google Fonts."
    ],
    howToUse: [
      {
        title: "Go to Fontjoy",
        description: "Access the website and start generating font pairings instantly.",
        links: [
          { label: "Fontjoy", url: "https://fontjoy.com" }
        ]
      },
      {
        title: "Generate Font Pairings",
        description: "Click 'Generate' to see new font combinations."
      },
      {
        title: "Adjust & Preview",
        description: "Manually tweak font weights or try different pairings. Preview them in live sample text."
      },
      {
        title: "Export & Use",
        description: "Copy the CSS/font info and use in your web or branding project."
      }
    ]
  },
  {
    name: "FontPair",
    description: "FontPair is a curated gallery and tool for discovering font pairings, especially for Google Fonts. It helps designers find and preview harmonious combinations for web, print, and branding, streamlining the typography process.",
    url: "https://fontpair.co",
    id: "fontpair",
    image: "/tool-screenshots/fontpair.png",
    logo: "/logo/fontpair.png",
    categories: ["design", "productivity"],
    subcategory: "Typography",
    tags: ["typography", "fonts", "pairing", "web_design"],
    rating: 3.9,
    visits: 60000,
    dateAdded: "2015-09-01",
    isPremium: "Free",
    features: [
      "Curated Pairings: Browse high-quality font combinations.",
      "Live Preview: Test pairings with your own text.",
      "Filter by Category: Serif, sans-serif, display, and more.",
      "Google Fonts Integration: Easy to use on web projects.",
      "Copy Styles: Export font CSS and style info."
    ],
    howToUse: [
      {
        title: "Visit FontPair",
        description: "Go to the FontPair website to browse curated font pairings.",
        links: [
          { label: "FontPair", url: "https://fontpair.co" }
        ]
      },
      {
        title: "Browse or Filter Pairings",
        description: "Explore pairings by category or search for specific font combinations."
      },
      {
        title: "Preview with Your Text",
        description: "Enter your own sample text to see how pairings look in real use cases."
      },
      {
        title: "Copy & Export",
        description: "Copy the font info or CSS for use in your web or branding project."
      }
    ]
  },
  {
    name: "Brandmark",
    description: "Brandmark is an AI-powered logo design tool that generates unique brand identities from simple keywords. It helps startups and small businesses create logos, color palettes, and brand guidelines quickly and affordably.",
    url: "https://brandmark.io",
    id: "brandmark",
    image: "/tool-screenshots/brandmark.png",
    logo: "/logo/brandmark.png",
    categories: ["design", "marketing"],
    subcategory: "Logo Design",
    tags: ["logo", "branding", "ai", "identity"],
    rating: 4.2,
    visits: 150000,
    dateAdded: "2017-08-01",
    isPremium: "Premium",
    features: [
      "AI Logo Generation: Create logos from keywords and styles.",
      "Brand Kit: Download color palettes, fonts, and templates.",
      "High-Res Export: Get print-ready files.",
      "Instant Preview: See logos on business cards and products.",
      "Unlimited Edits: Refine logos until satisfied."
    ],
    howToUse: [
      {
        title: "Get Started on Brandmark",
        description: "Go to Brandmark and enter your business name and keywords.",
        links: [
          { label: "Brandmark", url: "https://brandmark.io" }
        ]
      },
      {
        title: "Choose Style Preferences",
        description: "Select color and style preferences for your brand."
      },
      {
        title: "Generate & Edit Logos",
        description: "View AI-generated logos, then edit or refine until satisfied."
      },
      {
        title: "Download Brand Kit",
        description: "Purchase and download your logo plus full brand assets."
      }
    ]
  },
  {
    name: "LogoMakr",
    description: "LogoMakr is an easy-to-use online logo maker that enables users to design and customize logos quickly with a simple drag-and-drop interface and a vast icon library. It's ideal for small businesses and individuals seeking affordable branding solutions.",
    url: "https://logomakr.com",
    id: "logomakr",
    image: "/tool-screenshots/logomakr.png",
    logo: "/logo/logomakr.png",
    categories: ["design", "marketing"],
    subcategory: "Logo Design",
    tags: ["logo", "branding", "drag_and_drop", "icons"],
    rating: 4.0,
    visits: 120000,
    dateAdded: "2013-03-01",
    isPremium: "Freemium",
    features: [
      "Drag-and-Drop Editor: Quickly assemble and customize logos.",
      "Icon Library: Access thousands of shapes and graphics.",
      "Font Selection: Choose from a range of typefaces.",
      "Unlimited Downloads: Export in web and print formats.",
      "Branding Tools: Create business cards and social assets."
    ],
    howToUse: [
      {
        title: "Open LogoMakr",
        description: "Go to LogoMakr and start creating without any registration.",
        links: [
          { label: "LogoMakr", url: "https://logomakr.com" }
        ]
      },
      {
        title: "Design Your Logo",
        description: "Use the drag-and-drop interface and icon library to design your logo."
      },
      {
        title: "Customize & Preview",
        description: "Change fonts, colors, and layout. Preview your logo on different backgrounds."
      },
      {
        title: "Export & Download",
        description: "Download your finished logo for free (low-res) or purchase high-res files and brand assets."
      }
    ]
  },
  {
    name: "Spline",
    description: "Spline is a 3D design tool that enables designers to create, animate, and publish interactive 3D web experiences. With a real-time collaborative editor and intuitive interface, Spline makes 3D creation accessible for web, UI, and motion designers.",
    url: "https://spline.design",
    id: "spline",
    image: "/tool-screenshots/spline.png",
    logo: "/logo/spline.png",
    categories: ["design", "image"],
    subcategory: "3D Design",
    tags: ["3d", "animation", "web", "collaboration"],
    rating: 4.4,
    visits: 400000,
    dateAdded: "2020-09-01",
    isPremium: "Freemium",
    features: [
      "3D Modeling: Build shapes and scenes easily.",
      "Animation: Animate objects and scenes with keyframes.",
      "Interactivity: Add triggers and user actions.",
      "Collaboration: Edit projects in real time with others.",
      "Web Export: Publish interactive 3D content online."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Editor",
        description: "Create a free account on Spline to access the online 3D editor.",
        links: [
          { label: "Spline", url: "https://spline.design" }
        ]
      },
      {
        title: "Create or Import a 3D Scene",
        description: "Start a new project or import 3D assets. Use the intuitive interface to add, modify, or arrange objects."
      },
      {
        title: "Animate & Add Interactivity",
        description: "Use keyframes to animate objects and add triggers for user interactions (clicks, hovers, etc.)."
      },
      {
        title: "Collaborate in Real Time",
        description: "Invite others to edit your project simultaneously for team-based workflows."
      },
      {
        title: "Export or Publish",
        description: "Export your project as web-embeddable content or share a public link for interactive viewing."
      }
    ]
  },
  {
    name: "Kaedim",
    description: "Kaedim is an AI-powered tool that converts 2D images into 3D models automatically. Geared toward game developers, 3D artists, and designers, it accelerates asset creation for games, AR/VR, and digital content.",
    url: "https://kaedim3d.com",
    id: "kaedim",
    image: "/tool-screenshots/kaedim.png",
    logo: "/logo/kaedim.png",
    categories: ["design", "image"],
    subcategory: "3D Asset Generation",
    tags: ["3d", "ai", "asset_generation", "games"],
    rating: 4.2,
    visits: 80000,
    dateAdded: "2021-07-01",
    isPremium: "Premium",
    features: [
      "2D to 3D Conversion: Turn sketches or images into 3D models.",
      "Rapid Prototyping: Generate assets in minutes.",
      "Format Support: Download models in standard 3D formats.",
      "Cloud Processing: Handle large or complex scenes via cloud.",
      "Integration: Use in game engines and 3D editors."
    ],
    howToUse: [
      {
        title: "Sign Up & Upload Image",
        description: "Register for Kaedim and upload a 2D image or sketch you want to convert.",
        links: [
          { label: "Kaedim", url: "https://kaedim3d.com" }
        ]
      },
      {
        title: "Configure Output",
        description: "Specify your desired output format and any model requirements."
      },
      {
        title: "Generate 3D Asset",
        description: "Let Kaedim’s AI process your image and create a 3D model."
      },
      {
        title: "Download & Integrate",
        description: "Download your model for use in game engines or 3D editors."
      }
    ]
  },
  {
    name: "Luma AI",
    description: "Luma AI leverages neural radiance fields (NeRF) to capture and generate photorealistic 3D models from smartphone photos or videos. It's popular for AR/VR, e-commerce, and digital creators seeking ultra-realistic 3D scans.",
    url: "https://lumalabs.ai",
    id: "luma_ai",
    image: "/tool-screenshots/luma_ai.png",
    logo: "/logo/luma_ai.png",
    categories: ["design", "image"],
    subcategory: "3D Scanning",
    tags: ["3d", "photo2model", "nerf", "ar_vr"],
    rating: 4.3,
    visits: 100000,
    dateAdded: "2022-05-01",
    isPremium: "Freemium",
    features: [
      "NeRF Technology: Create 3D models from photos/videos.",
      "Photorealistic Output: High-fidelity, detailed results.",
      "Mobile Friendly: Capture with a standard smartphone.",
      "Export Options: Download in 3D and AR formats.",
      "Web Viewer: Share scans easily online."
    ],
    howToUse: [
      {
        title: "Create Account & Download App",
        description: "Sign up for Luma AI and download the mobile app or use the web platform.",
        links: [
          { label: "Luma AI", url: "https://lumalabs.ai" }
        ]
      },
      {
        title: "Capture Photos or Video",
        description: "Use your smartphone to capture an object or scene from multiple angles."
      },
      {
        title: "Process & Generate 3D Model",
        description: "Upload your captures to let Luma AI generate a photorealistic 3D model."
      },
      {
        title: "Download or Share Model",
        description: "Export in your preferred 3D/AR format or share a web viewer link."
      }
    ]
  },
  {
    name: "Interior AI",
    description: "Interior AI is a generative design tool for interior spaces. It allows users to upload photos of rooms and instantly visualize them in different styles, layouts, or with virtual renovations. It's widely used by homeowners, realtors, and designers for inspiration and planning.",
    url: "https://interiorai.com",
    id: "interior_ai",
    image: "/tool-screenshots/interior_ai.png",
    logo: "/logo/interior_ai.png",
    categories: ["design", "image"],
    subcategory: "Interior Design",
    tags: ["interior_design", "virtual_staging", "ai", "room_styles"],
    rating: 4.3,
    visits: 85000,
    dateAdded: "2022-08-01",
    isPremium: "Freemium",
    features: [
      "Style Selection: Preview rooms in dozens of design styles.",
      "Virtual Staging: Add or remove furniture and decor.",
      "Room Redesign: Experiment with layouts and color palettes.",
      "Photo Upload: Use any room photo for instant results.",
      "Download & Share: Save or share staged images."
    ],
    howToUse: [
      {
        title: "Sign Up & Upload Room Photo",
        description: "Create an account on Interior AI and upload a photo of your room.",
        links: [
          { label: "Interior AI", url: "https://interiorai.com" }
        ]
      },
      {
        title: "Choose a Style",
        description: "Select from a variety of design styles and staging options."
      },
      {
        title: "Preview & Edit",
        description: "View the AI-generated redesign; make adjustments to furniture and layout as needed."
      },
      {
        title: "Download & Share",
        description: "Save your new room designs or share them with others."
      }
    ]
  },
  {
    name: "Planner 5D",
    description: "Planner 5D is a user-friendly interior design tool that allows users to create 2D and 3D floor plans, furnish rooms, and visualize home designs. Its AI-powered features speed up layout planning and style recommendations, making it ideal for homeowners and professionals.",
    url: "https://planner5d.com",
    id: "planner_5d",
    image: "/tool-screenshots/planner_5d.png",
    logo: "/logo/planner_5d.png",
    categories: ["design", "productivity"],
    subcategory: "Floor Planning",
    tags: ["interior_design", "floor_plans", "3d", "ai"],
    rating: 4.2,
    visits: 700000,
    dateAdded: "2012-04-01",
    isPremium: "Freemium",
    features: [
      "2D & 3D Planning: Switch between floor plan and 3D visualization.",
      "Furniture Library: Choose from thousands of objects.",
      "AI Recommendations: Suggests layouts and styles.",
      "Mobile & Web: Design on any device.",
      "Export & Share: Download images or share projects online."
    ],
    howToUse: [
      {
        title: "Create Account & Start Project",
        description: "Sign up for Planner 5D and start a new design project.",
        links: [
          { label: "Planner 5D", url: "https://planner5d.com" }
        ]
      },
      {
        title: "Draw Floor Plan",
        description: "Use the editor to create 2D or 3D plans. Add, resize, and arrange rooms."
      },
      {
        title: "Furnish & Decorate",
        description: "Drag and drop furniture and decor from the library. Use AI recommendations for optimal layouts."
      },
      {
        title: "Visualize & Export",
        description: "Switch between 2D and 3D views, then export or share your designs."
      }
    ]
  },
  {
    name: "RoomGPT",
    description: "RoomGPT is an AI-powered tool that generates interior design ideas from a single room photo. By uploading an image and choosing a style, users receive realistic renderings of their space with new decor and layouts, perfect for inspiration and remote staging.",
    url: "https://roomgpt.io",
    id: "roomgpt",
    image: "/tool-screenshots/roomgpt.png",
    logo: "/logo/roomgpt.png",
    categories: ["design", "image"],
    subcategory: "AI Room Design",
    tags: ["interior_design", "ai", "rendering", "virtual_staging"],
    rating: 4.1,
    visits: 60000,
    dateAdded: "2023-03-01",
    isPremium: "Freemium",
    features: [
      "Photo-to-Design: Transform photos into styled rooms.",
      "Multiple Styles: Choose from modern, classic, rustic, and more.",
      "Fast Rendering: Get new designs in seconds.",
      "Mobile Friendly: Works on smartphones and tablets.",
      "Download Images: Save new room concepts for later."
    ],
    howToUse: [
      {
        title: "Access RoomGPT & Upload Photo",
        description: "Go to RoomGPT, sign in, and upload a photo of your room.",
        links: [
          { label: "RoomGPT", url: "https://roomgpt.io" }
        ]
      },
      {
        title: "Select a Style",
        description: "Choose from available interior design styles."
      },
      {
        title: "Generate New Designs",
        description: "Let AI render realistic new room concepts."
      },
      {
        title: "Download & Save",
        description: "Download your favorite designs for reference or sharing."
      }
    ]
  },
  {
    name: "Visily",
    description: "Visily is an AI-powered wireframing tool that helps non-designers create beautiful app wireframes from simple sketches, screenshots, or text prompts. It speeds up the ideation process and allows teams to collaborate effortlessly on low-fidelity and high-fidelity prototypes.",
    url: "https://www.visily.ai",
    id: "visily",
    image: "/tool-screenshots/visily.png",
    logo: "/logo/visily.png",
    categories: ["design", "productivity"],
    subcategory: "Wireframing",
    tags: ["wireframe", "prototyping", "ai", "collaboration"],
    rating: 4.3,
    visits: 250000,
    dateAdded: "2022-07-01",
    isPremium: "Freemium",
    features: [
      "AI Wireframe Generation: Turn sketches or text into wireframes.",
      "Component Library: Access a wide variety of UI components.",
      "Collaboration: Real-time team editing and commenting.",
      "Template Gallery: Start quickly with prebuilt layouts.",
      "Export Options: Share designs or export to popular formats."
    ],
    howToUse: [
      {
        title: "Sign Up and Start Project",
        description: "Register on Visily and start a new wireframe project.",
        links: [
          { label: "Visily", url: "https://www.visily.ai" }
        ]
      },
      {
        title: "Generate or Import Wireframes",
        description: "Create wireframes from sketches, screenshots, or use text prompts."
      },
      {
        title: "Edit & Collaborate",
        description: "Use the component library and real-time collaboration for editing and feedback."
      },
      {
        title: "Export or Share",
        description: "Export designs in popular formats or share with your team."
      }
    ]
  },
  {
    name: "Stockimg.AI",
    description: "Stockimg.AI is an AI-powered platform for generating stock images, book covers, posters, and more from text prompts. It is used by marketers, designers, and content creators looking for unique, copyright-safe visuals.",
    url: "https://stockimg.ai",
    id: "stockimg_ai",
    image: "/tool-screenshots/stockimg_ai.png",
    logo: "/logo/stockimg_ai.png",
    categories: ["design", "image", "marketing"],
    subcategory: "AI Stock Images",
    tags: ["stock_images", "ai_art", "marketing", "posters"],
    rating: 4.2,
    visits: 600000,
    dateAdded: "2023-03-01",
    isPremium: "Freemium",
    features: [
      "Text-to-Image: Generate stock images from prompts.",
      "Variety of Outputs: Create posters, book covers, wallpapers, and more.",
      "Commercial Use: Royalty-free outputs for business.",
      "Prompt Library: Inspiration for creative projects.",
      "High-Resolution Export: Download large, print-ready images."
    ],
    howToUse: [
      {
        title: "Sign Up and Access Platform",
        description: "Register at Stockimg.AI to unlock all generation features.",
        links: [
          { label: "Stockimg.AI", url: "https://stockimg.ai" }
        ]
      },
      {
        title: "Input Text Prompt",
        description: "Describe the image you want to generate."
      },
      {
        title: "Choose Type & Settings",
        description: "Select image type (poster, cover, etc.) and resolution."
      },
      {
        title: "Generate & Download",
        description: "Generate your image and download high-res outputs."
      }
    ]
  },
  {
    name: "Illustroke",
    description: "Illustroke uses AI to generate vector illustrations (SVG format) from simple text prompts. It's ideal for web designers, content creators, and marketers who need scalable, unique vector art quickly.",
    url: "https://illustroke.com",
    id: "illustroke",
    image: "/tool-screenshots/illustroke.png",
    logo: "/logo/illustroke.png",
    categories: ["design", "image"],
    subcategory: "Vector Illustration",
    tags: ["vector", "svg", "ai_art", "illustration"],
    rating: 4.1,
    visits: 90000,
    dateAdded: "2023-05-10",
    isPremium: "Freemium",
    features: [
      "SVG Output: Generate vector illustrations from text.",
      "Prompt-Based: Use natural language to specify your needs.",
      "Customizable: Edit colors and details after generation.",
      "Commercial License: Use outputs for business and products.",
      "Large Illustration Library: Browse and reuse community images."
    ],
    howToUse: [
      {
        title: "Sign Up & Enter Prompt",
        description: "Create an account at Illustroke and input your text prompt.",
        links: [
          { label: "Illustroke", url: "https://illustroke.com" }
        ]
      },
      {
        title: "Generate SVG Illustration",
        description: "Let the AI create a unique vector illustration."
      },
      {
        title: "Customize Colors & Details",
        description: "Modify the SVG output to match your preferences."
      },
      {
        title: "Download & Use",
        description: "Download your illustration for web, print, or commercial use."
      }
    ]
  },
  {
    name: "Mage.Space",
    description: "Mage.Space is an AI art studio for creating images, videos, and animations from text prompts using cutting-edge generative models. It is popular for both personal and professional creative work, with privacy-focused and NSFW-friendly options.",
    url: "https://mage.space",
    id: "mage_space",
    image: "/tool-screenshots/mage_space.png",
    logo: "/logo/mage_space.png",
    categories: ["design", "image", "video"],
    subcategory: "Generative Art",
    tags: ["ai_art", "image_generation", "animation", "video"],
    rating: 4.4,
    visits: 2500000,
    dateAdded: "2022-10-01",
    isPremium: "Freemium",
    features: [
      "Text-to-Image: Generate visuals from text prompts.",
      "Text-to-Video: Create short AI-powered videos.",
      "Animation: Turn static images into animated content.",
      "Private Generation: No content moderation for privacy-focused users.",
      "Gallery: Explore and remix public works."
    ],
    howToUse: [
      {
        title: "Access Mage.Space",
        description: "Go to Mage.Space and start creating with or without an account.",
        links: [
          { label: "Mage.Space", url: "https://mage.space" }
        ]
      },
      {
        title: "Enter Prompt",
        description: "Type your idea for an image, animation, or video."
      },
      {
        title: "Select Style & Options",
        description: "Choose generation settings and privacy options."
      },
      {
        title: "Generate & Review",
        description: "Create your content and review outputs. Iterate as needed."
      },
      {
        title: "Download or Share",
        description: "Save your work or publish to the public gallery."
      }
    ]
  },
  {
    name: "Dream by WOMBO",
    description: "Dream by WOMBO is a popular AI art generator app for web and mobile. It transforms text prompts into digital artworks in various styles for personal, social, and commercial use.",
    url: "https://www.wombo.art",
    id: "wombo_dream",
    image: "/tool-screenshots/wombo_dream.png",
    logo: "/logo/wombo_dream.png",
    categories: ["design", "image"],
    subcategory: "AI Art Generator",
    tags: ["ai_art", "mobile", "prompt", "community"],
    rating: 4.6,
    visits: 6000000,
    dateAdded: "2021-10-01",
    isPremium: "Freemium",
    features: [
      "Text-to-Art: Turn prompts into digital paintings.",
      "Style Selection: Choose from dozens of art styles.",
      "Mobile App: Create and share on the go.",
      "Print Shop: Order posters and framed prints.",
      "Community: Share artworks and participate in challenges."
    ],
    howToUse: [
      {
        title: "Access Dream by WOMBO",
        description: "Use the web app or download the mobile app to get started.",
        links: [{ label: "WOMBO Dream", url: "https://www.wombo.art" }]
      },
      {
        title: "Enter a Text Prompt",
        description: "Type any idea, concept, or phrase as your prompt."
      },
      {
        title: "Choose an Art Style",
        description: "Select from a variety of art styles before generating your artwork."
      },
      {
        title: "Generate and Edit",
        description: "Click 'Create' to generate your artwork. Optionally, refine or re-generate for different results."
      },
      {
        title: "Download or Share",
        description: "Download your art, share with the WOMBO community, or order a print."
      }
    ]
  },
  {
    name: "Gencraft",
    description: "Gencraft is an AI image generator that creates unique visuals for art, marketing, and storytelling. It offers high-res downloads, a prompt marketplace, and commercial licensing.",
    url: "https://gencraft.com",
    id: "gencraft",
    image: "/tool-screenshots/gencraft.png",
    logo: "/logo/gencraft.png",
    categories: ["design", "image", "video"],
    subcategory: "AI Image Generation",
    tags: ["ai_art", "image_generation", "marketing", "prompt"],
    rating: 4.3,
    visits: 820000,
    dateAdded: "2023-04-01",
    isPremium: "Freemium",
    features: [
      "Prompt Marketplace: Share and discover creative prompts.",
      "High-Resolution Output: Download images up to 4K.",
      "Style Filters: Apply different art styles.",
      "Commercial Use: License for business and marketing.",
      "Batch Generation: Create multiple images at once."
    ],
    howToUse: [
      {
        title: "Sign Up or Log In",
        description: "Visit Gencraft and create an account for high-res downloads and marketplace access.",
        links: [{ label: "Gencraft", url: "https://gencraft.com" }]
      },
      {
        title: "Enter a Prompt",
        description: "Type your creative prompt. Use the marketplace for inspiration."
      },
      {
        title: "Choose Styles and Settings",
        description: "Select art styles or filters, and set your desired resolution."
      },
      {
        title: "Generate and Download",
        description: "Generate images, preview results, and download the ones you like."
      },
      {
        title: "Use Commercially or Share",
        description: "License images for business, or share your creations on the platform."
      }
    ]
  },
  {
    name: "Designs.ai",
    description: "Designs.ai is an all-in-one creative platform offering AI-powered tools for logo design, video creation, mockups, and social media content. It is tailored for businesses and agencies needing to scale design output quickly.",
    url: "https://designs.ai",
    id: "designs_ai",
    image: "/tool-screenshots/designs_ai.png",
    logo: "/logo/designs_ai.png",
    categories: ["design", "marketing", "video"],
    subcategory: "Creative Suite",
    tags: ["logo", "video", "mockup", "ai"],
    rating: 4.2,
    visits: 700000,
    dateAdded: "2019-11-01",
    isPremium: "Freemium",
    features: [
      "Logo Maker: AI-powered branding tools.",
      "Video Maker: Convert text scripts into videos.",
      "Speechmaker: Generate professional voiceovers.",
      "Design Maker: Create banners, posts, and ads.",
      "Mockup Generator: Preview designs on products."
    ],
    howToUse: [
      {
        title: "Sign Up and Access Tools",
        description: "Create an account at Designs.ai to access all creative tools.",
        links: [{ label: "Designs.ai", url: "https://designs.ai" }]
      },
      {
        title: "Select a Tool",
        description: "Pick Logo Maker, Video Maker, Speechmaker, or Design Maker based on your project."
      },
      {
        title: "Input Your Content",
        description: "Provide text, upload assets, or select templates for your design."
      },
      {
        title: "Customize & Preview",
        description: "Edit layouts, styles, and elements. Preview and iterate as needed."
      },
      {
        title: "Download or Order",
        description: "Export your designs or order prints and branded products."
      }
    ]
  },
  {
    name: "Craiyon",
    description: "Craiyon (formerly DALL·E mini) is a free AI image generator that creates fun, surreal images from any text prompt. It is popular for social sharing and creative experimentation.",
    url: "https://www.craiyon.com",
    id: "craiyon",
    image: "/tool-screenshots/craiyon.png",
    logo: "/logo/craiyon.png",
    categories: ["design", "image"],
    subcategory: "AI Art Generator",
    tags: ["ai_art", "prompt", "free", "social"],
    rating: 4.0,
    visits: 1500000,
    dateAdded: "2022-05-01",
    isPremium: "Free",
    features: [
      "Free Text-to-Image: No signup or payment required.",
      "Unlimited Generation: Create as many images as you want.",
      "Fun Styles: Surreal, cartoonish outputs.",
      "Community Gallery: Share and browse creations.",
      "Mobile Friendly: Works on all devices."
    ],
    howToUse: [
      {
        title: "Go to Craiyon",
        description: "Access Craiyon from any browser or device. No sign-up required.",
        links: [{ label: "Craiyon", url: "https://www.craiyon.com" }]
      },
      {
        title: "Enter a Prompt",
        description: "Type your desired prompt in the input box."
      },
      {
        title: "Generate Images",
        description: "Click 'Draw' to create images. Wait for the AI to finish generating."
      },
      {
        title: "Download or Share",
        description: "Download images or share them to the community gallery."
      }
    ]
  },
  {
    name: "GrowthBar",
    description: "GrowthBar is an AI-powered SEO tool that enables users to generate optimized blog posts and perform keyword research quickly. It offers content outlines, competitive analysis, and on-page SEO suggestions.",
    url: "https://www.growthbarseo.com",
    id: "growthbar",
    image: "/tool-screenshots/growthbar.png",
    logo: "/logo/growthbar.png",
    categories: ['marketing', 'text', 'productivity'],
    subcategory: "SEO",
    tags: ['AI', 'SEO', 'content', 'blog'],
    rating: 4.5,
    visits: 110000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "AI blog post generation: Quickly create long-form SEO-optimized articles.",
      "Keyword research: Discover high-value keywords and their difficulty.",
      "Content outlines: Generate content structure and suggestions for writers.",
      "Competitive analysis: Analyze top-ranking websites for your keywords."
    ],
    howToUse: [
      {
        title: "Sign Up & Log In",
        description: "Register for GrowthBar and log in to access the dashboard.",
        links: [{ label: "GrowthBar", url: "https://www.growthbarseo.com" }]
      },
      {
        title: "Start a Blog Post or Keyword Research",
        description: "Choose to generate a blog post or begin keyword research."
      },
      {
        title: "Enter Topic or Keywords",
        description: "Input your blog topic or keywords for SEO analysis and suggestions."
      },
      {
        title: "Review Outlines & Suggestions",
        description: "View content outlines, keyword suggestions, and competitive data."
      },
      {
        title: "Generate and Optimize Content",
        description: "Generate the article and optimize with on-page SEO tips. Export or publish as needed."
      }
    ]
  },
  {
    name: "Ocoya",
    description: "Ocoya is an AI-driven platform for social media management, helping users create, schedule, and analyze posts across multiple channels. It includes automation and content generation features to boost online presence.",
    url: "https://www.ocoya.com",
    id: "ocoya",
    image: "/tool-screenshots/ocoya.png",
    logo: "/logo/ocoya.png",
    categories: ['marketing', 'productivity', 'text'],
    subcategory: "social-media",
    tags: ['AI', 'social media', 'automation'],
    rating: 4.4,
    visits: 180000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "AI post generation: Create social media content with AI suggestions.",
      "Scheduling: Plan and schedule posts across multiple platforms.",
      "Analytics dashboard: Track performance and engagement metrics.",
      "Content automation: Automate repetitive posting tasks."
    ],
    howToUse: [
      {
        title: "Register & Connect Accounts",
        description: "Sign up for Ocoya and connect your social media profiles.",
        links: [{ label: "Ocoya", url: "https://www.ocoya.com" }]
      },
      {
        title: "Generate or Schedule Posts",
        description: "Use AI to create content or set up scheduled posts for your channels."
      },
      {
        title: "Analyze Performance",
        description: "Monitor results and engagement using the analytics dashboard.",
      },
      {
        title: "Automate Content",
        description: "Set up automation rules for regular posting and content variation."
      }
    ]
  },
  {
    name: "Clearscope",
    description: "Clearscope leverages AI to help content marketers and SEO professionals optimize their content for higher search rankings. It provides in-depth keyword research and content grading tools.",
    url: "https://www.clearscope.io",
    id: "clearscope",
    image: "/tool-screenshots/clearscope.png",
    logo: "/logo/clearscope.png",
    categories: ['marketing', 'text', 'data-processing'],
    subcategory: "SEO",
    tags: ['AI', 'SEO', 'content optimization'],
    rating: 4.7,
    visits: 88000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Content grading: Scores content for keyword coverage and readability.",
      "Keyword research: Recommends keywords based on live search data.",
      "Competitor analysis: Analyzes top-ranking pages for target terms.",
      "Detailed reporting: Provides actionable insights for improvements."
    ],
    howToUse: [
      {
        title: "Sign Up for Clearscope",
        description: "Create a Clearscope account to access keyword and content optimization tools.",
        links: [{ label: "Clearscope", url: "https://www.clearscope.io" }]
      },
      {
        title: "Start a Report",
        description: "Input your target keyword to generate a content optimization report."
      },
      {
        title: "Optimize Content",
        description: "Use the grading and keyword suggestions to improve your content’s SEO and readability."
      },
      {
        title: "Monitor & Iterate",
        description: "Track content performance and update as needed for ongoing optimization."
      }
    ]
  },
  {
    name: "Lately AI",
    description: "Lately AI transforms long-form content into dozens of social media posts, using AI to maximize engagement. It helps marketers repurpose blogs, videos, and podcasts for broader reach.",
    url: "https://www.lately.ai",
    id: "latelyai",
    image: "/tool-screenshots/latelyai.png",
    logo: "/logo/latelyai.png",
    categories: ['marketing', 'text', 'productivity'],
    subcategory: "social-media",
    tags: ['AI', 'social media', 'automation'],
    rating: 4.3,
    visits: 35000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "AI content repurposing: Turns long-form content into social posts.",
      "Brand voice learning: Adapts to your brand's tone and style.",
      "Multi-channel publishing: Supports posting to various social networks.",
      "Performance analytics: Measures engagement and content effectiveness."
    ],
    howToUse: [
      {
        title: "Sign Up for Lately AI",
        description: "Create an account and access your dashboard.",
        links: [{ label: "Lately AI", url: "https://www.lately.ai" }]
      },
      {
        title: "Upload Long-form Content",
        description: "Upload a blog, video, or podcast you want to repurpose."
      },
      {
        title: "Generate Social Posts",
        description: "Let the AI create multiple posts in your brand voice."
      },
      {
        title: "Review & Edit",
        description: "Edit suggested posts, then approve for scheduling or publishing."
      },
      {
        title: "Analyze Engagement",
        description: "Track post performance and engagement analytics."
      }
    ]
  },
  {
    name: "Persado",
    description: "Persado uses AI and machine learning to generate and optimize marketing language for email, SMS, and digital ads, improving engagement and conversion rates.",
    url: "https://www.persado.com",
    id: "persado",
    image: "/tool-screenshots/persado.png",
    logo: "/logo/persado.png",
    categories: ['marketing', 'text'],
    subcategory: "email",
    tags: ['AI', 'copywriting', 'personalization'],
    rating: 4.6,
    visits: 23000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "AI-powered language generation: Creates high-converting marketing copy.",
      "A/B testing: Tests variations to optimize engagement.",
      "Personalization: Tailors messaging for each audience segment.",
      "Performance analytics: Tracks effectiveness of messaging."
    ],
    howToUse: [
      {
        title: "Request a Demo",
        description: "Contact Persado for a personalized demo and onboarding.",
        links: [{ label: "Persado", url: "https://www.persado.com" }]
      },
      {
        title: "Integrate with Marketing Platforms",
        description: "Connect Persado to your email or ad platforms for seamless campaign execution."
      },
      {
        title: "Input Campaign Goals & Data",
        description: "Define campaign objectives and provide audience data for personalized messaging."
      },
      {
        title: "Generate & Test Language",
        description: "Let Persado generate, A/B test, and optimize campaign copy.",
      },
      {
        title: "Analyze Results",
        description: "Use analytics to refine messaging and improve future performance."
      }
    ]
  },
  {
    name: "Dynamic Yield",
    description: "Dynamic Yield offers AI-powered personalization and recommendation solutions for websites and apps, enabling marketers to deliver tailored experiences and increase conversions.",
    url: "https://www.dynamicyield.com",
    id: "dynamicyield",
    image: "/tool-screenshots/dynamicyield.png",
    logo: "/logo/dynamicyield.png",
    categories: ['marketing', 'data-processing', 'productivity'],
    subcategory: "personalization",
    tags: ['AI', 'personalization', 'recommendation'],
    rating: 4.5,
    visits: 87000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Personalized recommendations: AI suggests products and content.",
      "A/B testing: Test different variations for user segments.",
      "Segmentation: Advanced targeting based on user behavior.",
      "Real-time analytics: Measure campaign impact instantly."
    ],
    howToUse: [
      {
        title: "Request a Demo or Start Trial",
        description: "Visit Dynamic Yield and request a demo or start a trial. A solutions expert will help with onboarding and integration.",
        links: [
          { label: "Dynamic Yield", url: "https://www.dynamicyield.com" }
        ]
      },
      {
        title: "Integrate with Your Site or App",
        description: "Install Dynamic Yield’s script or SDK on your website or app to begin collecting user data and serving personalized experiences."
      },
      {
        title: "Set up Campaigns and Segmentation",
        description: "Create campaigns and define audience segments based on user behavior, demographics, or custom criteria."
      },
      {
        title: "Deploy A/B Tests and Recommendations",
        description: "Use the platform to run A/B or multivariate tests and enable AI-powered content/product recommendations."
      },
      {
        title: "Analyze and Optimize",
        description: "Monitor real-time analytics dashboards, review performance by segment, and optimize campaigns for higher conversions."
      }
    ]
  },
  {
    name: "Mutiny",
    description: "Mutiny is an AI-driven personalization platform for B2B marketers, making it easy to tailor website content and campaigns to individual visitors for better conversion.",
    url: "https://www.mutinyhq.com",
    id: "mutiny",
    image: "/tool-screenshots/mutiny.png",
    logo: "/logo/mutiny.png",
    categories: ['marketing', 'data-processing', 'productivity'],
    subcategory: "personalization",
    tags: ['AI', 'B2B', 'personalization'],
    rating: 4.4,
    visits: 15000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Real-time website personalization: Tailors content for each visitor.",
      "Segmented campaigns: Target specific business audiences.",
      "A/B testing: Experiment with different website messages.",
      "Analytics dashboard: Monitor conversion and engagement rates."
    ],
    howToUse: [
      {
        title: "Request a Demo & Onboarding",
        description: "Sign up for a demo or contact Mutiny for onboarding. Their team will guide you through integration and best practices.",
        links: [
          { label: "Mutiny", url: "https://www.mutinyhq.com" }
        ]
      },
      {
        title: "Add Mutiny to Your Website",
        description: "Install the Mutiny code snippet to enable real-time personalization and data collection."
      },
      {
        title: "Set Up Audiences and Segments",
        description: "Define business audiences and create segments based on firmographics, behavior, or CRM data."
      },
      {
        title: "Personalize Content and Launch Campaigns",
        description: "Build personalized website experiences, run A/B tests, and launch segmented campaigns."
      },
      {
        title: "Analyze Impact",
        description: "Use Mutiny’s analytics dashboard to track engagement, conversions, and campaign effectiveness."
      }
    ]
  },
  {
    name: "Influencity",
    description: "Influencity is an AI-powered influencer marketing platform that helps brands discover, analyze, and manage collaborations with influencers to maximize campaign results.",
    url: "https://www.influencity.com",
    id: "influencity",
    image: "/tool-screenshots/influencity.png",
    logo: "/logo/influencity.png",
    categories: ['marketing', 'data-processing'],
    subcategory: "influencer",
    tags: ['AI', 'influencer', 'analytics'],
    rating: 4.1,
    visits: 49000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Influencer discovery: Find relevant creators for your brand.",
      "Campaign management: Organize and track influencer campaigns.",
      "Audience analysis: Deep insights into influencer followers.",
      "Performance metrics: Measure ROI and campaign success."
    ],
    howToUse: [
      {
        title: "Create an Account",
        description: "Register on Influencity to access the influencer marketing dashboard.",
        links: [
          { label: "Influencity", url: "https://www.influencity.com" }
        ]
      },
      {
        title: "Find and Analyze Influencers",
        description: "Use AI-powered discovery tools to search for influencers by niche, platform, and audience. Analyze profiles and audience data."
      },
      {
        title: "Set Up and Manage Campaigns",
        description: "Organize influencer collaborations, workflows, and deliverables within the campaign manager."
      },
      {
        title: "Track Performance",
        description: "Monitor campaign metrics, influencer impact, and ROI with Influencity’s analytics tools."
      }
    ]
  },
  {
    name: "INK",
    description: "INK is an AI-powered platform for writing and optimizing content for SEO, helping marketers improve rankings, increase engagement, and drive organic traffic.",
    url: "https://inkforall.com",
    id: "ink",
    image: "/tool-screenshots/ink.png",
    logo: "/logo/ink.png",
    categories: ['marketing', 'text'],
    subcategory: "SEO",
    tags: ['AI', 'SEO', 'writing'],
    rating: 4.4,
    visits: 56000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "SEO optimization: Real-time scoring for content improvement.",
      "AI writing assistant: Generates and edits text efficiently.",
      "Built-in plagiarism checker: Ensures content originality.",
      "Topic research: Recommends keywords and related topics."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Dashboard",
        description: "Create a free or paid account on INK and log in to the writing dashboard.",
        links: [
          { label: "INK", url: "https://inkforall.com" }
        ]
      },
      {
        title: "Start a New Project",
        description: "Create or import a document and select the SEO optimization tool."
      },
      {
        title: "Write or Optimize Content",
        description: "Use the AI writing assistant for drafting, editing, or optimizing existing content."
      },
      {
        title: "Check SEO Score and Plagiarism",
        description: "Review real-time SEO scoring and run the plagiarism checker for originality."
      },
      {
        title: "Export or Publish",
        description: "Export your optimized content for your CMS or publish it directly from INK if supported."
      }
    ]
  },
  {
    name: "Drift",
    description: "Drift is an AI-powered chatbot and conversational marketing platform that helps businesses engage website visitors, qualify leads, and accelerate sales pipelines.",
    url: "https://www.drift.com",
    id: "drift",
    image: "/tool-screenshots/drift.png",
    logo: "/logo/drift.png",
    categories: ['marketing', 'productivity'],
    subcategory: "chatbot",
    tags: ['AI', 'chatbot', 'conversational'],
    rating: 4.3,
    visits: 150000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Conversational marketing: Engage visitors with real-time chat.",
      "Lead qualification: AI filters and prioritizes sales leads.",
      "Automated meeting booking: Schedule calls directly from chat.",
      "Integrations: Connects with major CRM and marketing tools."
    ],
    howToUse: [
      {
        title: "Request a Demo or Start Free",
        description: "Go to Drift and request a demo or start a free trial. Onboarding guidance is provided for integration.",
        links: [
          { label: "Drift", url: "https://www.drift.com" }
        ]
      },
      {
        title: "Install Drift Widget",
        description: "Add the Drift chat widget to your website to enable real-time conversations."
      },
      {
        title: "Configure Playbooks",
        description: "Set up conversation playbooks to qualify leads, answer FAQs, or book meetings automatically."
      },
      {
        title: "Integrate with CRM/Marketing Tools",
        description: "Sync Drift with your CRM or marketing automation platform for full lead management."
      },
      {
        title: "Review Conversations and Analytics",
        description: "Track conversations, analyze chat impact, and optimize bot flows to improve results."
      }
    ]
  },
  {
    name: "Scalenut",
    description: "Scalenut is an AI-powered content research and writing platform that helps marketers plan, create, and optimize SEO content to drive organic growth.",
    url: "https://www.scalenut.com",
    id: "scalenut",
    image: "/tool-screenshots/scalenut.png",
    logo: "/logo/scalenut.png",
    categories: ['marketing', 'text'],
    subcategory: "SEO",
    tags: ['AI', 'SEO', 'content'],
    rating: 4.3,
    visits: 59000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "AI content research: Provides keyword and topic suggestions.",
      "SEO writing assistant: Optimizes content for higher rankings.",
      "Content briefs: Generates detailed outlines for articles.",
      "Competitor analysis: Benchmarks against top competitors."
    ],
    howToUse: [
      {
        title: "Register and Log In",
        description: "Sign up for a free or paid Scalenut account and access your dashboard.",
        links: [
          { label: "Scalenut", url: "https://www.scalenut.com" }
        ]
      },
      {
        title: "Start a New SEO Project",
        description: "Initiate a content research or writing project. Enter your topic or keyword."
      },
      {
        title: "Use AI Research Tools",
        description: "Get keyword, topic, and competitor insights using Scalenut’s AI research suite."
      },
      {
        title: "Write & Optimize Content",
        description: "Use the SEO writing assistant to draft or optimize your article, following suggestions for higher rankings."
      },
      {
        title: "Export or Publish Content",
        description: "Export finished articles or copy optimized content for your website or CMS."
      }
    ]
  },
  {
    name: "Flick",
    description: "Flick is an AI-powered tool for Instagram marketers, providing hashtag research, scheduling, and analytics to improve the reach and performance of social posts.",
    url: "https://www.flick.social",
    id: "flick",
    image: "/tool-screenshots/flick.png",
    logo: "/logo/flick.png",
    categories: ['marketing', 'productivity'],
    subcategory: "social-media",
    tags: ['AI', 'Instagram', 'analytics'],
    rating: 4.2,
    visits: 31000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Hashtag research: Find the best hashtags for your posts.",
      "Post scheduling: Plan Instagram content in advance.",
      "Analytics: Track engagement and follower growth.",
      "Content ideas: AI suggests trending topics and captions."
    ],
    howToUse: [
      {
        title: "Sign Up for Flick",
        description: "Register for Flick and connect your Instagram account to access all features.",
        links: [
          { label: "Flick", url: "https://www.flick.social" }
        ]
      },
      {
        title: "Research Hashtags",
        description: "Use Flick’s AI to find the best hashtags for your posts based on your audience and content."
      },
      {
        title: "Schedule Instagram Posts",
        description: "Plan and schedule content in advance, optimizing for best posting times."
      },
      {
        title: "Analyze Performance",
        description: "Monitor engagement, follower growth, and hashtag performance in the analytics dashboard."
      },
      {
        title: "Discover Content Ideas",
        description: "Get AI-generated suggestions for captions and trending topics tailored to your niche."
      }
    ]
  },
  {
    name: "BrightEdge",
    description: "BrightEdge is an AI-powered SEO and content performance platform that enables marketers to discover opportunities, optimize content, and track rankings. Its analytics suite turns search data into actionable insights.",
    url: "https://www.brightedge.com",
    id: "brightedge",
    image: "/tool-screenshots/brightedge.png",
    logo: "/logo/brightedge.png",
    categories: ['marketing', 'data-processing'],
    subcategory: "SEO",
    tags: ['AI', 'SEO', 'analytics'],
    rating: 4.5,
    visits: 59000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "AI-driven content recommendations for SEO.",
      "Rank tracking for keywords and competitors.",
      "Site and page-level analytics dashboards.",
      "Opportunity discovery for organic growth."
    ],
    howToUse: [
      {
        title: "Request a Demo & Onboarding",
        description: "Visit BrightEdge and request a demo or contact sales. Upon onboarding, you'll get access to the platform and a guided setup.",
        links: [
          { label: "BrightEdge", url: "https://www.brightedge.com" }
        ]
      },
      {
        title: "Set Up Your Website and Keywords",
        description: "Add your website and target keywords to the dashboard for monitoring and optimization."
      },
      {
        title: "Analyze Opportunities",
        description: "Use the AI-powered analytics suite to discover ranking opportunities, content gaps, and competitor benchmarks."
      },
      {
        title: "Optimize Content",
        description: "Follow BrightEdge’s AI-driven recommendations to improve on-page SEO, content relevance, and technical performance."
      },
      {
        title: "Track and Report",
        description: "Monitor keyword rankings, site performance, and campaign impact using customizable dashboards and exportable reports."
      }
    ]
  },
  {
    name: "SEMrush Writing Assistant",
    description: "SEMrush Writing Assistant provides real-time optimization for SEO, readability, and originality. It offers actionable feedback to help writers create content that ranks and engages.",
    url: "https://www.semrush.com/features/seowritingassistant/",
    id: "semrushwritingassistant",
    image: "/tool-screenshots/semrushwritingassistant.png",
    logo: "/logo/semrushwritingassistant.png",
    categories: ['marketing', 'text'],
    subcategory: "SEO",
    tags: ['AI', 'SEO', 'writing'],
    rating: 4.7,
    visits: 11000000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "SEO scoring with instant feedback.",
      "Readability, tone, and originality analysis.",
      "Integration with SEMrush ecosystem.",
      "Actionable suggestions for better rankings."
    ],
    howToUse: [
      {
        title: "Sign Up or Log In",
        description: "Create a SEMrush account or log in to your existing account. Access the Writing Assistant from your SEMrush dashboard.",
        links: [
          { label: "SEMrush Writing Assistant", url: "https://www.semrush.com/features/seowritingassistant/" }
        ]
      },
      {
        title: "Start a New Document",
        description: "Open Writing Assistant, start a new document, and paste or write your content."
      },
      {
        title: "Set SEO Targets",
        description: "Enter your target keywords and select your region or language for tailored SEO recommendations."
      },
      {
        title: "Optimize with Real-Time Feedback",
        description: "Follow actionable feedback on SEO, readability, tone of voice, and originality. Adjust your content to improve scores."
      },
      {
        title: "Integrate with CMS",
        description: "Install the SEMrush Writing Assistant plugin for Google Docs or WordPress to optimize content directly in your workflow."
      }
    ]
  },
  {
    name: "CanIRank",
    description: "CanIRank is an AI SEO tool that analyzes keywords, suggests ranking opportunities, and recommends actionable steps to improve your site's search performance.",
    url: "https://www.canirank.com",
    id: "canirank",
    image: "/tool-screenshots/canirank.png",
    logo: "/logo/canirank.png",
    categories: ['marketing', 'data-processing'],
    subcategory: "SEO",
    tags: ['AI', 'SEO', 'analytics'],
    rating: 4.2,
    visits: 44000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "Keyword analysis for ranking opportunities.",
      "Step-by-step SEO action recommendations.",
      "Competitor benchmarking and insights.",
      "Progress tracking for SEO improvements."
    ],
    howToUse: [
      {
        title: "Create Account & Add Your Website",
        description: "Sign up on CanIRank and add your website to start analyzing SEO performance.",
        links: [
          { label: "CanIRank", url: "https://www.canirank.com" }
        ]
      },
      {
        title: "Run Keyword and Competitor Analysis",
        description: "Input target keywords and analyze your site against competitors for ranking opportunities."
      },
      {
        title: "Follow Action Recommendations",
        description: "Get step-by-step AI-driven recommendations for improving rankings and site authority."
      },
      {
        title: "Track SEO Progress",
        description: "Monitor keyword rankings and site improvements using built-in progress tracking dashboards."
      }
    ]
  },
  {
    name: "DashThis",
    description: "DashThis is an automated marketing reporting tool that uses AI to collect, visualize, and deliver insights from analytics, SEO, PPC, and social data. It simplifies cross-channel reporting for marketers.",
    url: "https://dashthis.com",
    id: "dashthis",
    image: "/tool-screenshots/dashthis.png",
    logo: "/logo/dashthis.png",
    categories: ['marketing', 'data-processing'],
    subcategory: "analytics",
    tags: ['AI', 'analytics', 'reporting'],
    rating: 4.6,
    visits: 69000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "Automated dashboards from all your data sources.",
      "Custom and prebuilt templates for fast setup.",
      "Collaboration tools for sharing and commenting.",
      "AI-powered insights highlight key changes."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Data Sources",
        description: "Register on DashThis and log in. Connect your analytics, SEO, PPC, and social accounts for unified reporting.",
        links: [
          { label: "DashThis", url: "https://dashthis.com" }
        ]
      },
      {
        title: "Create or Select a Dashboard Template",
        description: "Pick from prebuilt templates or customize your own dashboard to suit your reporting needs."
      },
      {
        title: "Automate Data Collection",
        description: "Let DashThis automatically fetch and update your data across all connected platforms."
      },
      {
        title: "Collaborate and Share",
        description: "Invite team members to comment and collaborate on reports, or share dashboards with stakeholders."
      },
      {
        title: "Leverage AI Insights",
        description: "Use AI-powered suggestions and visualizations to spot key trends, anomalies, and growth opportunities."
      }
    ]
  },
  {
    name: "Seventh Sense",
    description: "Seventh Sense optimizes email send times for each recipient using AI, boosting open and engagement rates. It integrates with popular email platforms for smarter campaigns.",
    url: "https://theseventhsense.com",
    id: "seventhsense",
    image: "/tool-screenshots/seventhsense.png",
    logo: "/logo/seventhsense.png",
    categories: ['marketing', 'productivity'],
    subcategory: "email",
    tags: ['AI', 'email', 'automation'],
    rating: 4.3,
    visits: 8000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Personalizes delivery time for every recipient.",
      "Integrates with HubSpot and Marketo.",
      "Engagement analytics and reporting.",
      "AI-based audience segmentation."
    ],
    howToUse: [
      {
        title: "Request a Demo or Get Started",
        description: "Visit Seventh Sense to request a demo or sign up. Connect your email platform (HubSpot or Marketo) for integration.",
        links: [
          { label: "Seventh Sense", url: "https://theseventhsense.com" }
        ]
      },
      {
        title: "Sync Audience Data",
        description: "Import or sync your email lists to allow AI to analyze engagement patterns."
      },
      {
        title: "Configure Send Time Optimization",
        description: "Enable AI-powered delivery timing and audience segmentation for your campaigns."
      },
      {
        title: "Launch Campaigns",
        description: "Send campaigns and let Seventh Sense optimize delivery timing for each recipient."
      },
      {
        title: "Monitor Engagement",
        description: "Track results with engagement analytics and adjust future campaigns based on AI insights."
      }
    ]
  },
  {
    name: "Mailchimp Content Optimizer",
    description: "Mailchimp Content Optimizer uses AI to analyze marketing emails, providing personalized recommendations for subject lines, copy, and design. It helps marketers improve open and click rates.",
    url: "https://mailchimp.com/features/content-optimizer/",
    id: "mailchimpoptimizer",
    image: "/tool-screenshots/mailchimpoptimizer.png",
    logo: "/logo/mailchimpoptimizer.png",
    categories: ['marketing', 'productivity'],
    subcategory: "email",
    tags: ['AI', 'email', 'optimization'],
    rating: 4.4,
    visits: 17000000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "AI analysis of subject lines and body copy.",
      "Actionable suggestions for engagement.",
      "Design optimization tools.",
      "Personalized recommendations for content."
    ],
    howToUse: [
      {
        title: "Sign Up or Log In",
        description: "Create or log in to your Mailchimp account. Access the Content Optimizer tool from your dashboard.",
        links: [
          { label: "Mailchimp Content Optimizer", url: "https://mailchimp.com/features/content-optimizer/" }
        ]
      },
      {
        title: "Analyze an Email Campaign",
        description: "Select or create a marketing email, then run the Content Optimizer to analyze subject lines, copy, and design."
      },
      {
        title: "Review AI Recommendations",
        description: "Follow actionable AI suggestions for subject lines, email body, and visual layout to improve performance."
      },
      {
        title: "Implement Changes",
        description: "Edit your email campaign according to the recommendations for maximum engagement and click rates."
      },
      {
        title: "Track Performance",
        description: "Monitor open and click rates post-send, and use ongoing optimization for future campaigns."
      }
    ]
  },
  {
    name: "Phrasee",
    description: "Phrasee uses AI to generate and optimize email subject lines, push notifications, and marketing copy, driving higher engagement and conversions for campaigns.",
    url: "https://phrasee.co",
    id: "phrasee",
    image: "/tool-screenshots/phrasee.png",
    logo: "/logo/phrasee.png",
    categories: ['marketing', 'text'],
    subcategory: "email",
    tags: ['AI', 'email', 'copywriting'],
    rating: 4.2,
    visits: 15000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Generates high-performing subject lines.",
      "Push notification and SMS copy optimization.",
      "Brand voice adaptation with AI.",
      "A/B testing for copy variants."
    ],
    howToUse: [
      {
        title: "Request a Demo & Onboarding",
        description: "Visit Phrasee’s website and request a demo to get started. An onboarding specialist will help set up brand preferences and integrations.",
        links: [
          { label: "Phrasee", url: "https://phrasee.co" }
        ]
      },
      {
        title: "Set Up Brand Voice",
        description: "Configure your brand’s voice and messaging guidelines in the Phrasee platform to ensure on-brand AI-generated content."
      },
      {
        title: "Generate Copy",
        description: "Use the dashboard to generate subject lines, push notifications, or SMS copy for your campaigns. Adjust parameters for creativity, length, and tone."
      },
      {
        title: "A/B Test Variants",
        description: "Deploy multiple AI-generated copy variants with your campaigns. Use Phrasee’s built-in tools to track engagement and optimize results."
      },
      {
        title: "Integrate with Marketing Tools",
        description: "Connect Phrasee to your ESP, CRM, or marketing automation platform for seamless campaign execution and analytics."
      }
    ]
  },
  {
    name: "InVideo",
    description: "InVideo is an AI-powered video creation platform for marketers. It offers thousands of templates, stock assets, and automated tools to produce branded videos quickly.",
    url: "https://invideo.io",
    id: "invideo",
    image: "/tool-screenshots/invideo.png",
    logo: "/logo/invideo.png",
    categories: ['marketing', 'video'],
    subcategory: "video",
    tags: ['AI', 'video', 'content creation'],
    rating: 4.6,
    visits: 2100000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "5000+ customizable video templates.",
      "AI script generation from prompts.",
      "Premium stock video and music.",
      "Auto text-to-video from articles."
    ],
    howToUse: [
      {
        title: "Sign Up and Log In",
        description: "Register for a free or paid InVideo account. Log in to access the video creation dashboard.",
        links: [
          { label: "InVideo", url: "https://invideo.io" }
        ]
      },
      {
        title: "Choose a Template or Start from Scratch",
        description: "Browse thousands of templates by category, or start with a blank canvas for full creative control."
      },
      {
        title: "Generate Script or Upload Content",
        description: "Use the AI script generator, input your own text, or convert articles into videos directly from a URL."
      },
      {
        title: "Customize Video",
        description: "Edit scenes, add stock footage, music, text, transitions, and branding elements. Use drag-and-drop tools for quick adjustments."
      },
      {
        title: "Preview and Export",
        description: "Preview your video for quality and accuracy. Export it in your desired format and resolution, or publish directly to social platforms."
      }
    ]
  },
  {
    name: "Synthesys",
    description: "Synthesys generates AI voiceovers and avatar videos for marketing, e-learning, and presentations. It offers realistic voices, facial animation, and multi-language support.",
    url: "https://synthesys.io",
    id: "synthesys",
    image: "/tool-screenshots/synthesys.png",
    logo: "/logo/synthesys.png",
    categories: ['marketing', 'audio', 'video'],
    subcategory: "audio",
    tags: ['AI', 'audio', 'video'],
    rating: 4.4,
    visits: 39000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Wide variety of synthetic voices.",
      "Text-to-video with talking avatars.",
      "Supports 50+ languages for global reach.",
      "Branded video templates and customization."
    ],
    howToUse: [
      {
        title: "Sign Up and Access Dashboard",
        description: "Create a Synthesys account and log in to the platform to access voiceover and avatar video tools.",
        links: [
          { label: "Synthesys", url: "https://synthesys.io" }
        ]
      },
      {
        title: "Input or Paste Script",
        description: "Enter your script for voiceover or avatar video generation. Select the language and style you prefer."
      },
      {
        title: "Choose Voice and Avatar",
        description: "Pick from a library of AI voices and talking avatars. Adjust parameters for tone, speed, and accent as needed."
      },
      {
        title: "Generate and Preview Media",
        description: "Click to generate your audio or video. Preview the result and make further edits if required."
      },
      {
        title: "Download or Integrate",
        description: "Download your voiceover/video file or use integrations to publish directly to your marketing platforms."
      }
    ]
  },
  {
    name: "ManyChat",
    description: "ManyChat automates Messenger, Instagram, and WhatsApp marketing with AI-powered chatbots. It helps marketers engage users, qualify leads, and automate follow-ups.",
    url: "https://manychat.com",
    id: "manychat",
    image: "/tool-screenshots/manychat.png",
    logo: "/logo/manychat.png",
    categories: ['marketing', 'productivity'],
    subcategory: "chatbot",
    tags: ['AI', 'chatbot', 'automation'],
    rating: 4.7,
    visits: 1800000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "Chatbots for Messenger, Instagram, WhatsApp.",
      "Visual flow builder for bot creation.",
      "Integrates with major marketing tools.",
      "Analytics for conversion and engagement."
    ],
    howToUse: [
      {
        title: "Sign Up and Connect Channels",
        description: "Register for a ManyChat account and connect your Messenger, Instagram, or WhatsApp accounts.",
        links: [
          { label: "ManyChat", url: "https://manychat.com" }
        ]
      },
      {
        title: "Create a Chatbot Flow",
        description: "Use the drag-and-drop flow builder to design conversations, capture leads, and automate responses."
      },
      {
        title: "Integrate with Marketing Tools",
        description: "Connect ManyChat to your CRM, email, or marketing platforms for seamless lead management."
      },
      {
        title: "Deploy and Monitor",
        description: "Publish your chatbot and monitor engagement and conversion analytics within the ManyChat dashboard."
      }
    ]
  },
  {
    name: "Tidio",
    description: "Tidio combines live chat and AI-powered chatbots to automate support and lead generation. Marketers can boost conversions and provide instant answers to visitors.",
    url: "https://www.tidio.com",
    id: "tidio",
    image: "/tool-screenshots/tidio.png",
    logo: "/logo/tidio.png",
    categories: ['marketing', 'productivity'],
    subcategory: "chatbot",
    tags: ['AI', 'chatbot', 'automation'],
    rating: 4.6,
    visits: 3300000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "AI chatbots for FAQ and sales automation.",
      "Live chat for real-time support.",
      "Unified inbox for all conversations.",
      "Analytics for chat and conversion rates."
    ],
    howToUse: [
      {
        title: "Register and Install Widget",
        description: "Sign up on Tidio and install the chat widget on your website or e-commerce platform.",
        links: [
          { label: "Tidio", url: "https://www.tidio.com" }
        ]
      },
      {
        title: "Set Up Chatbots and Live Chat",
        description: "Configure AI-powered chatbots to answer FAQs, automate lead capture, and handle sales inquiries. Enable live chat for real-time support."
      },
      {
        title: "Customize and Integrate",
        description: "Personalize conversation flows, connect with CRM/marketing tools, and use the unified inbox to manage all conversations."
      },
      {
        title: "Analyze and Optimize",
        description: "Monitor chat analytics and conversion rates to optimize bot flows and improve customer engagement."
      }
    ]
  },
  {
    name: "MobileMonkey",
    description: "MobileMonkey is an AI chatbot platform for omni-channel messaging, supporting Facebook, Instagram, SMS, and web chat. It enables marketers to automate conversations and lead gen.",
    url: "https://mobilemonkey.com",
    id: "mobilemonkey",
    image: "/tool-screenshots/mobilemonkey.png",
    logo: "/logo/mobilemonkey.png",
    categories: ['marketing', 'productivity'],
    subcategory: "chatbot",
    tags: ['AI', 'chatbot', 'messaging'],
    rating: 4.3,
    visits: 250000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "Bots for Messenger, Instagram, SMS, and web.",
      "Lead capture via chat forms and quizzes.",
      "Automated drip campaigns and auto-responses.",
      "Integrates with major marketing/CRM tools."
    ],
    howToUse: [
      {
        title: "Sign Up & Connect Channels",
        description: "Visit MobileMonkey and create an account. Connect your Facebook, Instagram, SMS, and web channels as needed.",
        links: [
          { label: "MobileMonkey", url: "https://mobilemonkey.com" }
        ]
      },
      {
        title: "Create or Customize a Chatbot",
        description: "Use the drag-and-drop builder to create a chatbot for your selected channels. Start from a template or build your own conversation flow."
      },
      {
        title: "Set Up Lead Capture",
        description: "Add chat forms, quizzes, or surveys to collect leads and qualify prospects automatically within conversations."
      },
      {
        title: "Automate Drip Campaigns",
        description: "Configure automated follow-up sequences, drip campaigns, and auto-responses to nurture leads and engage users."
      },
      {
        title: "Integrate with Marketing Tools",
        description: "Connect MobileMonkey to your CRM, email platform, or other marketing tools for seamless lead syncing and campaign tracking."
      },
      {
        title: "Monitor and Optimize",
        description: "Use built-in analytics to track engagement, response rates, and lead quality. Refine chatbot flows and campaigns for better results."
      }
    ]
  },
  {
    name: "Optimizely",
    description: "Optimizely offers AI-powered experimentation and personalization for websites and apps. Marketers can run A/B tests, manage features, and deliver personalized content.",
    url: "https://www.optimizely.com",
    id: "optimizely",
    image: "/tool-screenshots/optimizely.png",
    logo: "/logo/optimizely.png",
    categories: ['marketing', 'data-processing', 'productivity'],
    subcategory: "personalization",
    tags: ['AI', 'personalization', 'AB testing'],
    rating: 4.6,
    visits: 1200000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "A/B and multivariate testing for web/app changes.",
      "AI-driven content personalization.",
      "Feature flag management for safe rollouts.",
      "Real-time analytics for experiment tracking."
    ],
    howToUse: [
      {
        title: "Sign Up & Set Up Account",
        description: "Create an Optimizely account and log in to your dashboard. Install the Optimizely snippet or SDK on your website or app.",
        links: [
          { label: "Optimizely", url: "https://www.optimizely.com" }
        ]
      },
      {
        title: "Launch Experiments",
        description: "Create A/B or multivariate tests using the visual editor. Set goals, define variations, and target specific audience segments."
      },
      {
        title: "Enable Personalization",
        description: "Use AI-powered personalization features to deliver tailored content and experiences based on user behavior and attributes."
      },
      {
        title: "Manage Feature Flags",
        description: "Implement feature flags to roll out new features gradually and safely. Control access for specific user groups."
      },
      {
        title: "Analyze Results",
        description: "Monitor real-time analytics to evaluate experiment performance and make data-driven decisions. Apply winning variations to your site or app."
      }
    ]
  },
  {
    name: "Yusp",
    description: "Yusp provides AI-powered personalization engines for e-commerce and content sites. It increases sales and engagement with real-time, user-specific recommendations.",
    url: "https://www.yusp.com",
    id: "yusp",
    image: "/tool-screenshots/yusp.png",
    logo: "/logo/yusp.png",
    categories: ['marketing', 'data-processing'],
    subcategory: "personalization",
    tags: ['AI', 'recommendation', 'personalization'],
    rating: 4.1,
    visits: 14000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Personalized recommendations for each user.",
      "Cross-selling and upselling with AI.",
      "Behavioral targeting from user data.",
      "Instant updates as user behavior changes."
    ],
    howToUse: [
      {
        title: "Request Demo or Sign Up",
        description: "Go to Yusp and request a demo or sign up for an account. Consult with the Yusp team to set up your personalization engine.",
        links: [
          { label: "Yusp", url: "https://www.yusp.com" }
        ]
      },
      {
        title: "Integrate Yusp with Your Platform",
        description: "Install Yusp’s API, SDK, or plugin on your e-commerce or content site. Follow documentation to connect user and product data sources."
      },
      {
        title: "Configure Recommendation Settings",
        description: "Set up recommendation logic, cross-sell/upsell strategies, and define behavioral targeting rules for your use case."
      },
      {
        title: "Deploy and Test",
        description: "Launch your personalization engine on your website. Test recommendations and targeting for different user segments."
      },
      {
        title: "Monitor & Optimize",
        description: "Track engagement, sales, and conversion metrics with Yusp’s analytics dashboard. Refine recommendation strategies for optimal performance."
      }
    ]
  },
  {
    name: "Albert.ai",
    description: "Albert.ai autonomously manages and optimizes digital ad campaigns, using AI to analyze data and drive performance across platforms. Marketers can maximize ROI with minimal manual effort.",
    url: "https://albert.ai",
    id: "albertai",
    image: "/tool-screenshots/albertai.png",
    logo: "/logo/albertai.png",
    categories: ['marketing', 'data-processing'],
    subcategory: "ads",
    tags: ['AI', 'ads', 'automation'],
    rating: 4.3,
    visits: 10000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Cross-channel campaign automation.",
      "AI-based audience targeting and segmentation.",
      "Creative and budget optimization in real time.",
      "Performance analytics and reporting."
    ],
    howToUse: [
      {
        title: "Request Access or Demo",
        description: "Visit Albert.ai and request access or schedule a demo with their team to get started.",
        links: [
          { label: "Albert.ai", url: "https://albert.ai" }
        ]
      },
      {
        title: "Onboard & Integrate Ad Accounts",
        description: "Connect your digital ad accounts (Google, Facebook, etc.) to the Albert.ai platform. Complete onboarding to sync data sources."
      },
      {
        title: "Configure Campaign Goals",
        description: "Set objectives, budget, and targeting preferences for your digital advertising campaigns."
      },
      {
        title: "Launch & Automate Campaigns",
        description: "Let Albert.ai autonomously manage, optimize, and allocate budget across channels for maximum ROI."
      },
      {
        title: "Monitor & Analyze Results",
        description: "Track performance with Albert's analytics dashboard. Review reports and insights to refine future campaigns."
      }
    ]
  },
  {
    name: "Upfluence",
    description: "Upfluence is an influencer marketing platform that uses AI to discover, engage, and manage influencer campaigns. It streamlines outreach for e-commerce and B2B brands.",
    url: "https://www.upfluence.com",
    id: "upfluence",
    image: "/tool-screenshots/upfluence.png",
    logo: "/logo/upfluence.png",
    categories: ['marketing', 'data-processing'],
    subcategory: "influencer",
    tags: ['AI', 'influencer', 'analytics'],
    rating: 4.2,
    visits: 27000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "AI influencer discovery by audience and niche.",
      "Campaign management and workflow tools.",
      "Shopify, WooCommerce, and e-commerce integration.",
      "Performance metrics and ROI analytics."
    ],
    howToUse: [
      {
        title: "Sign Up & Access Dashboard",
        description: "Go to Upfluence and create an account or request a demo. Log in to the dashboard to begin influencer discovery and campaign management.",
        links: [
          { label: "Upfluence", url: "https://www.upfluence.com" }
        ]
      },
      {
        title: "Discover Influencers",
        description: "Use AI-powered search and filters to find influencers by audience, niche, location, engagement, and platform. Review analytics and audience demographics."
      },
      {
        title: "Create and Manage Campaigns",
        description: "Launch new campaigns, define objectives, and select influencers. Use workflow tools to manage outreach, contracts, and collaborations."
      },
      {
        title: "Integrate E-commerce Platforms",
        description: "Connect Shopify, WooCommerce, or other e-commerce platforms to track sales, generate affiliate links, and automate influencer rewards."
      },
      {
        title: "Monitor Performance & Analyze ROI",
        description: "Track campaign metrics, influencer performance, and ROI in real time. Use analytics to optimize future campaigns for better results."
      }
    ]
  },
  {
    name: "Autopilot",
    description: "Autopilot is a visual marketing automation platform that uses AI for journey mapping, segmentation, and personalized messaging across email, SMS, and in-app notifications.",
    url: "https://www.autopilothq.com",
    id: "autopilot",
    image: "/tool-screenshots/autopilot.png",
    logo: "/logo/autopilot.png",
    categories: ['marketing', 'productivity'],
    subcategory: "automation",
    tags: ['AI', 'automation', 'email'],
    rating: 4.4,
    visits: 13000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Visual journey mapping and automation.",
      "AI-powered audience segmentation.",
      "Personalized messaging across channels.",
      "Multi-channel campaign delivery."
    ],
    howToUse: [
      {
        title: "Sign Up & Set Up Workspace",
        description: "Register for Autopilot and log in. Set up your workspace and connect your website, CRM, or database.",
        links: [
          { label: "Autopilot", url: "https://www.autopilothq.com" }
        ]
      },
      {
        title: "Map Customer Journeys",
        description: "Use the drag-and-drop builder to visually design journeys—automate actions, triggers, and audience flows for every stage."
      },
      {
        title: "Segment Audiences with AI",
        description: "Leverage AI tools to segment lists by behavior, demographics, or engagement for targeted messaging."
      },
      {
        title: "Create and Send Campaigns",
        description: "Build multi-channel campaigns across email, SMS, and in-app notifications. Personalize content for each segment."
      },
      {
        title: "Track and Optimize",
        description: "Monitor campaign performance in real time. Use analytics and reporting to optimize journeys and boost results."
      }
    ]
  },
  {
    name: "Salesforce Einstein",
    description: "Salesforce Einstein brings AI-driven analytics, insights, and automation to the Salesforce CRM, empowering marketers with predictive, personalized, and automated capabilities.",
    url: "https://www.salesforce.com/products/einstein/overview/",
    id: "salesforceeinstein",
    image: "/tool-screenshots/salesforceeinstein.png",
    logo: "/logo/salesforceeinstein.png",
    categories: ['marketing', 'data-processing'],
    subcategory: "automation",
    tags: ['AI', 'CRM', 'automation'],
    rating: 4.6,
    visits: 11000000,
    dateAdded: "2025-06-11",
    isPremium: "Premium",
    features: [
      "Predictive analytics and opportunity scoring.",
      "Automated insights for sales and marketing.",
      "Personalization for emails and offers.",
      "AI-powered workflow automation."
    ],
    howToUse: [
      {
        title: "Access Salesforce Einstein",
        description: "Log in to your Salesforce account. Make sure Einstein is enabled in your CRM environment.",
        links: [
          { label: "Salesforce Einstein", url: "https://www.salesforce.com/products/einstein/overview/" }
        ]
      },
      {
        title: "Configure Data Sources",
        description: "Connect CRM data, marketing platforms, and external data sources to feed Einstein’s analytics and prediction engine."
      },
      {
        title: "Leverage Predictive Analytics",
        description: "Use Einstein’s predictive scoring to identify high-value leads and opportunities, and to automate smart follow-ups."
      },
      {
        title: "Automate Campaigns & Workflows",
        description: "Set up automated campaigns and workflow rules using Einstein’s AI recommendations, triggers, and segmentation."
      },
      {
        title: "Personalize at Scale",
        description: "Let Einstein personalize emails, offers, and content for each contact based on data-driven insights."
      },
      {
        title: "Monitor and Refine",
        description: "Track performance with built-in analytics. Adjust automation and personalization strategies for continuous improvement."
      }
    ]
  },
  {
    name: "Sendinblue",
    description: "Sendinblue is an all-in-one marketing platform with AI-powered email, SMS, and chat automation. Marketers can launch, manage, and optimize campaigns at scale.",
    url: "https://www.sendinblue.com",
    id: "sendinblue",
    image: "/tool-screenshots/sendinblue.png",
    logo: "/logo/sendinblue.png",
    categories: ['marketing', 'productivity'],
    subcategory: "email",
    tags: ['AI', 'email', 'automation'],
    rating: 4.5,
    visits: 3800000,
    dateAdded: "2025-06-11",
    isPremium: "Freemium",
    features: [
      "AI-driven email automation and send times.",
      "SMS and chat marketing tools.",
      "Advanced segmentation and personalization.",
      "Comprehensive analytics for campaign tracking."
    ],
    howToUse: [
      {
        title: "Sign Up & Set Up Account",
        description: "Register for a Sendinblue account and complete the onboarding steps. Set up your sender profiles and connect domains.",
        links: [
          { label: "Sendinblue", url: "https://www.sendinblue.com" }
        ]
      },
      {
        title: "Import Contacts & Segment Lists",
        description: "Upload your contact list via CSV or API. Use segmentation tools to organize audiences by behavior, demographics, or engagement."
      },
      {
        title: "Create Automated Campaigns",
        description: "Use the visual workflow builder to create email, SMS, or chat automation sequences. Set triggers, conditions, and actions."
      },
      {
        title: "Personalize Content with AI",
        description: "Add dynamic content, product recommendations, and personalized send times powered by AI to boost engagement."
      },
      {
        title: "Launch & Monitor Campaigns",
        description: "Send your campaigns and monitor open, click, and conversion rates in real time. Use analytics to optimize for future sends."
      }
    ]
  },
  {
      name: "DeepBrain AI",
      description: "DeepBrain AI lets you generate realistic human avatar videos from scripts in multiple languages. Used for news, training, and explainer content with lifelike AI presenters.",
      url: "https://www.deepbrain.io",
      id: "deepbrainai",
      image: "/tool-screenshots/deepbrainai.png",
      logo: "/logo/deepbrainai.png",
      categories: ["video", "marketing"],
      subcategory: "avatar video",
      tags: ["AI", "avatar", "news", "training"],
      rating: 4.3,
      visits: 26000,
      dateAdded: "2025-06-13",
      isPremium: "Premium",
      features: [
        "AI news anchor avatars: Instantly generate professional news-style videos with digital presenters, cutting down production time and costs.",
        "Multilingual support: Create videos in over 80 languages, allowing for global reach and consistent branding across different markets.",
        "Custom avatars: Upload your own face or select from a diverse array of digital personas to match your company's image or audience.",
        "Easy script-to-video: Simply paste your script and receive a polished, presenter-led video ready for publishing or internal use."
      ], // <--- Make sure this comma is here!
      howToUse: [
        {
          title: "Sign Up & Log In",
          description: "Visit the DeepBrain AI (AI Studios) website and create a free account—no credit card needed. Verify your email and log into the AI Studios dashboard.",
          links: [
            { label: "aistudios.com", url: "https://www.aistudios.com" },
            { label: "YouTube Guide", url: "https://www.youtube.com/results?search_query=deepbrain+ai+studios+signup" }
          ]
        },
        {
          title: "Create a New Video Project",
          description: "Click 'New Project' or select a template (for business, explainer, training, etc.). Templates give you a structured starting point; otherwise, begin with a blank slate.",
          links: [
            { label: "aistudios.com", url: "https://www.aistudios.com" },
            { label: "cococlip.ai", url: "https://www.cococlip.ai" },
            { label: "yeschat.ai", url: "https://www.yeschat.ai" }
          ]
        },
        {
          title: "Choose Your AI Avatar",
          description: "Browse the Avatars library—over 80 multilingual lifelike avatars. Select one that aligns with your project's tone, language, and audience.",
          links: [
            { label: "aistudios.com", url: "https://www.aistudios.com" },
            { label: "YouTube Guide", url: "https://www.youtube.com/results?search_query=deepbrain+ai+avatar+selection" }
          ]
        },
        {
          title: "Customize Background & Scene",
          description: "Upload your own background image or choose from built-in stock options. Adjust avatars' position, scale, and style settings to suit your design."
        },
        {
          title: "Write or Import Your Script",
          description: "Use the onboard Script Assistant or paste script directly into each scene. You can edit text per slide and even auto-generate subtitles.",
          links: [
            { label: "fahimai.com", url: "https://www.fahimai.com" }
          ]
        },
        {
          title: "Select Voice & Language",
          description: "Choose from AI voices in 80+ languages with adjustable tone and speed. That allows localization or multilingual content targeting.",
          links: [
            { label: "aistudios.com", url: "https://www.aistudios.com" }
          ]
        },
        {
          title: "Enhance with Media & Effects",
          description: "Add images, shapes, animations, and background music or custom audio. Layer media assets and animate them across scenes for visual appeal.",
          links: [
            { label: "yeschat.ai", url: "https://www.yeschat.ai" }
          ]
        },
        {
          title: "Preview & Tweak",
          description: "Playback your video to check avatar lip-sync, timing, and scene transitions. Make any needed edits—swap avatars, adjust pacing, refine visuals."
        },
        {
          title: "Export & Publish",
          description: "Choose export options (MP4, resolution, chroma key if supported). Export your project and download. Higher resolutions and watermark-free exports depend on your subscription level.",
          links: [
            { label: "yeschat.ai", url: "https://www.yeschat.ai" }
          ]
        },
        {
          title: "Advanced Usage & API",
          description: "Avatar & Voice Customization: Choose outfits and styles, tweak lip-sync precision. API Integration: Automate video production using the AI Studios API—generate API keys, script uploads, job polling, and webhook callbacks.",
          links: [
            { label: "aistudios.com", url: "https://www.aistudios.com" },
            { label: "docs.deepbrain.io", url: "https://docs.deepbrain.io" }
          ]
        }
      ],
    },
      {
        name: "HeyGen (formerly Movio)",
        description: "HeyGen is a text-to-video platform that uses AI avatars and lip-sync to create videos from scripts, PowerPoints, or URLs. Features real-time video translation and voice cloning.",
        url: "https://www.heygen.com",
        id: "heygen",
        image: "/tool-screenshots/heygen.png",
        logo: "/logo/heygen.png",
        categories: ["video", "marketing"],
        subcategory: "avatar video",
        tags: ["AI", "avatar", "translation", "voice"],
        rating: 4.6,
        visits: 1620000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI avatar generation: Choose from a diverse range of digital humans to present your content, offering a professional and engaging delivery.",
          "Real-time translation: Instantly translate and dub your videos into multiple languages, breaking down language barriers for a global audience.",
          "Voice cloning: Use your own voice or select from a library of synthesized voices, enabling consistent branding and personal connection.",
          "Script-to-video: Convert text, slides, or even URLs directly into compelling video content, streamlining the content creation process."
        ],
        howToUse: [
          {
            title: "Sign Up & Access Dashboard",
            description: "Go to HeyGen's website and sign up for a free or premium account. After verifying your email, log in to access the dashboard.",
            links: [
              { label: "HeyGen", url: "https://www.heygen.com/" },
              { label: "YouTube Tutorial", url: "https://www.youtube.com/results?search_query=heygen+signup" }
            ]
          },
          {
            title: "Start a New Project",
            description: "Click 'Create Video' or 'New Project'. Choose from blank, script, PowerPoint, or URL input to start. You can also select a template suited for your use case.",
            links: [
              { label: "HeyGen Getting Started", url: "https://www.heygen.com/tutorials" }
            ]
          },
          {
            title: "Select Your AI Avatar",
            description: "Browse the avatar library and pick a digital presenter that matches your target audience and tone. Premium users unlock more avatar options.",
            links: [
              { label: "Avatar Library", url: "https://www.heygen.com/avatars" }
            ]
          },
          {
            title: "Input Script or Content",
            description: "Paste your script, upload a PowerPoint, or enter a URL. HeyGen will extract text and generate scenes based on your input. Edit each scene’s text as needed.",
            links: [
              { label: "Script Editor Guide", url: "https://www.heygen.com/guides/script-editor" }
            ]
          },
          {
            title: "Choose Voice and Language",
            description: "Select the AI voice and adjust language, accent, speed, and tone. Use the voice cloning feature if you want to use your own or a custom voice.",
            links: [
              { label: "Voice Settings", url: "https://www.heygen.com/voices" }
            ]
          },
          {
            title: "Customize Video Scenes",
            description: "Add or customize backgrounds, upload images, use HeyGen's stock assets, and arrange avatars and text. Adjust timing and transitions for each scene.",
            links: [
              { label: "Scene Editing", url: "https://www.heygen.com/features" }
            ]
          },
          {
            title: "Translate or Dub Video (Optional)",
            description: "Enable the translation feature to automatically translate and dub your video into other languages. Review the translated script and voices before generating.",
            links: [
              { label: "Translation Feature", url: "https://www.heygen.com/features/translation" }
            ]
          },
          {
            title: "Preview and Revise",
            description: "Preview the full video, check lip-sync, transitions, voice, and adjust any elements as needed. Make sure all scenes and text are accurate.",
            links: [
              { label: "HeyGen Help Center", url: "https://help.heygen.com/" }
            ]
          },
          {
            title: "Export & Download",
            description: "Choose your export format and resolution (some options may require a premium plan). Download the MP4 or share directly to social or business platforms.",
            links: [
              { label: "Exporting Videos", url: "https://www.heygen.com/help/export" }
            ]
          },
          {
            title: "Explore Advanced Features & API",
            description: "Try batch video creation, API integrations, or advanced branding and voice options for automation or large-scale production.",
            links: [
              { label: "API Docs", url: "https://docs.heygen.com/" }
            ]
          }
        ]
      },
      {
        name: "Elai.io",
        description: "Elai.io enables users to produce professional AI videos from text with customizable digital avatars. Supports multiple languages and templates for e-learning, marketing, and training.",
        url: "https://elai.io",
        id: "elaiio",
        image: "/tool-screenshots/elaiio.png",
        logo: "/logo/elaiio.png",
        categories: ["video", "marketing"],
        subcategory: "avatar video",
        tags: ["AI", "avatar", "marketing"],
        rating: 4.4,
        visits: 89000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI avatar video creation: Turn any text into engaging videos with lifelike digital presenters, saving time and production costs.",
          "Multi-language support: Produce videos in over 65 languages, reaching diverse global audiences without additional translation work.",
          "Template library: Access a range of ready-made video templates for marketing, education, and business use cases.",
          "Bulk video generation: Generate hundreds of personalized videos simultaneously for campaigns, training, or customer outreach."
        ],
        howToUse: [
          {
            title: "Register and Log In",
            description: "Visit Elai.io and sign up for a free or premium account. Confirm your email and log into the dashboard.",
            links: [
              { label: "Elai.io", url: "https://elai.io" }
            ]
          },
          {
            title: "Create a New Video",
            description: "Click 'Create Video' and select a template or start with a blank project. Templates speed up the process for common use cases like marketing or training.",
            links: [
              { label: "Templates", url: "https://elai.io/templates" }
            ]
          },
          {
            title: "Select an AI Avatar",
            description: "Choose from Elai's avatar library. Avatars can be filtered by language, appearance, and use case to match your audience.",
            links: [
              { label: "Avatars", url: "https://elai.io/avatars" }
            ]
          },
          {
            title: "Enter or Upload Script",
            description: "Paste your script into each scene or upload a document. You can also use the AI script generator for content ideas or translation.",
            links: [
              { label: "Script Tool", url: "https://elai.io/script-generator" }
            ]
          },
          {
            title: "Set Voice and Language",
            description: "Pick from dozens of AI voices and over 65 languages. Fine-tune speech speed, pitch, and accent for localization.",
            links: [
              { label: "Voice Settings", url: "https://elai.io/features" }
            ]
          },
          {
            title: "Customize Scenes",
            description: "Edit backgrounds, change layouts, add images, logos, transitions, and arrange visual elements for each slide.",
            links: [
              { label: "Scene Customization", url: "https://elai.io/customization" }
            ]
          },
          {
            title: "Add Media and Effects",
            description: "Enhance scenes with video clips, stock images, animations, and audio. Adjust timing and animate elements for dynamic presentations."
          },
          {
            title: "Preview & Edit",
            description: "Preview the video to check avatar performance, pronunciation, and scene flow. Make necessary edits before finalizing.",
            links: [
              { label: "Help Center", url: "https://elai.io/help" }
            ]
          },
          {
            title: "Export or Share",
            description: "Export the video in your desired resolution (dependent on plan). Download or share via link or embed code.",
            links: [
              { label: "Export Guide", url: "https://elai.io/export" }
            ]
          },
          {
            title: "API & Automation (Advanced)",
            description: "For bulk or automated video generation, connect with Elai’s API. Use for CRM integration, mass personalization, or e-learning at scale.",
            links: [
              { label: "API Docs", url: "https://elai.io/api" }
            ]
          }
        ]
      },
      {
        name: "D-ID",
        description: "D-ID brings photos to life with AI-powered talking avatars, animating faces from text or audio. Also enables video translation and dubbing for global audiences.",
        url: "https://www.d-id.com",
        id: "did",
        image: "/tool-screenshots/did.png",
        logo: "/logo/did.png",
        categories: ["video", "marketing"],
        subcategory: "talking avatar",
        tags: ["AI", "avatar", "translation", "dubbing"],
        rating: 4.5,
        visits: 540000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Photo animation: Animate any portrait into a speaking avatar, adding a human touch to otherwise static images for a memorable experience.",
          "Text-to-video: Generate talking head videos from scripts or audio, making it easy to produce narrated content without cameras or actors.",
          "AI video dubbing: Effortlessly translate and dub existing videos into different languages, preserving emotion and lip-sync for authenticity.",
          "API and integrations: Automate avatar creation and video translation for scalable workflows in marketing, education, or customer service."
        ],
        howToUse: [
          {
            title: "Sign Up or Log In",
            description: "Go to D-ID's website and register for an account. Confirm your email and access the main dashboard.",
            links: [
              { label: "D-ID", url: "https://www.d-id.com" }
            ]
          },
          {
            title: "Upload a Photo or Choose Stock Avatar",
            description: "Upload a portrait photo (JPG/PNG) or select from D-ID’s stock avatars to animate. Follow guidelines for best results.",
            links: [
              { label: "Avatar Guidelines", url: "https://www.d-id.com/faqs" }
            ]
          },
          {
            title: "Enter or Record Script",
            description: "Input the text you want spoken, or upload/record an audio file. D-ID will sync the avatar’s lips and facial expressions to your script.",
            links: [
              { label: "Script Help", url: "https://www.d-id.com/docs" }
            ]
          },
          {
            title: "Select Language and Voice",
            description: "Choose from dozens of AI voices and languages. Customize pitch, speed, and accent to suit your audience.",
            links: [
              { label: "Voice Options", url: "https://www.d-id.com/features" }
            ]
          },
          {
            title: "Customize Animation",
            description: "Adjust avatar style, background, and add visual effects. Use built-in tools to fine-tune facial expressions and gestures."
          },
          {
            title: "Translate & Dub (Optional)",
            description: "Use the translation/dubbing tool to automatically generate versions in other languages, preserving expressive lip sync."
          },
          {
            title: "Preview and Edit",
            description: "Preview the animated video, check synchronization and naturalness, and revise as needed.",
            links: [
              { label: "Support", url: "https://www.d-id.com/support" }
            ]
          },
          {
            title: "Export or Share",
            description: "Export your finished talking avatar video. Download as MP4 or share a link directly (watermarking depends on plan).",
            links: [
              { label: "Export FAQ", url: "https://www.d-id.com/faqs#export" }
            ]
          },
          {
            title: "API & Integration (Advanced)",
            description: "Integrate with D-ID's API for automated avatar video creation at scale, or connect to third-party platforms for marketing or e-learning.",
            links: [
              { label: "API Docs", url: "https://docs.d-id.com" }
            ]
          }
        ]
      },
      {
        name: "Hour One",
        description: "Hour One creates presenter-led videos using AI-generated humans and your script. Ideal for training, onboarding, and product explainers at scale.",
        url: "https://www.hourone.ai",
        id: "hourone",
        image: "/tool-screenshots/hourone.png",
        logo: "/logo/hourone.png",
        categories: ["video", "marketing"],
        subcategory: "avatar video",
        tags: ["AI", "avatar", "training"],
        rating: 4.1,
        visits: 31000,
        dateAdded: "2025-06-13",
        isPremium: "Premium",
        features: [
          "Script-to-presenter video: Easily transform a written script into a professional video with a realistic AI presenter, reducing production time.",
          "AI character library: Select from a wide range of digital humans to match your brand or audience demographics.",
          "Integrations: Use via API or connect with learning management systems to automate large-scale video creation.",
          "Multi-language support: Expand your training and onboarding reach with videos in multiple languages and accents."
        ],
        howToUse: [
          {
            title: "Create an Hour One Account",
            description: "Visit the Hour One website and register for an account. Verify your email to activate and access your dashboard.",
            links: [
              { label: "Hour One", url: "https://www.hourone.ai" }
            ]
          },
          {
            title: "Start a New Project",
            description: "Click 'New Project' and select your template (business, explainer, onboarding, etc.), or begin from scratch for custom presentations.",
            links: [
              { label: "Templates", url: "https://www.hourone.ai/templates" }
            ]
          },
          {
            title: "Pick Your AI Presenter",
            description: "Browse the Hour One character library and choose an avatar that fits your project's tone, language, and audience.",
            links: [
              { label: "Character Library", url: "https://www.hourone.ai/characters" }
            ]
          },
          {
            title: "Write or Paste Script",
            description: "Write your script in the editor, or paste/import content from a document. Each slide/scene can have its own text.",
            links: [
              { label: "Script Tips", url: "https://www.hourone.ai/help/script" }
            ]
          },
          {
            title: "Voice & Language Selection",
            description: "Select from a variety of AI voices and languages for narration. You can localize content for different regions.",
            links: [
              { label: "Voice Options", url: "https://www.hourone.ai/features" }
            ]
          },
          {
            title: "Customize Scenes",
            description: "Change background images, add your own logos or graphics, and arrange elements for each video segment.",
            links: [
              { label: "Scene Customization", url: "https://www.hourone.ai/help/customization" }
            ]
          },
          {
            title: "Enhance with Media & Transitions",
            description: "Include images, video clips, animations, and smooth transitions to make your video more dynamic and engaging."
          },
          {
            title: "Preview & Edit",
            description: "Preview the complete video, review presenter performance, and make changes to timing, visuals, or narration as needed.",
            links: [
              { label: "Help Center", url: "https://www.hourone.ai/support" }
            ]
          },
          {
            title: "Export & Download",
            description: "Export your video in different resolutions (HD/4K with premium). Download as MP4 or get a shareable link.",
            links: [
              { label: "Export Guide", url: "https://www.hourone.ai/help/export" }
            ]
          },
          {
            title: "API & Bulk Automation (Advanced)",
            description: "Access Hour One's API and automation tools to generate videos at scale for e-learning, onboarding, or marketing campaigns.",
            links: [
              { label: "API Docs", url: "https://www.hourone.ai/api" }
            ]
          }
        ]
      },
      {
        name: "Tavus",
        description: "Tavus automates personalized video generation for sales and marketing, using AI face and voice cloning for hyper-personalized outreach at scale.",
        url: "https://www.tavus.io",
        id: "tavus",
        image: "/tool-screenshots/tavus.png",
        logo: "/logo/tavus.png",
        categories: ["video", "marketing", "audio"],
        subcategory: "personalized video",
        tags: ["AI", "personalization", "voice"],
        rating: 4.3,
        visits: 12000,
        dateAdded: "2025-06-13",
        isPremium: "Premium",
        features: [
          "Personalized video at scale: Generate thousands of unique, hyper-personalized video messages for every prospect or customer automatically.",
          "AI face and voice cloning: Use your likeness and voice to deliver truly authentic and individualized outreach videos.",
          "CRM integration: Connect directly with popular CRM tools to personalize videos using live customer data for each message.",
          "Analytics dashboard: Measure success with detailed open, view, and engagement tracking for every video sent."
        ],
        howToUse: [
          {
            title: "Sign Up & Log In",
            description: "Go to Tavus.io and create an account using your work email. Choose a plan that matches your needs and log in to your dashboard.",
            links: [
              { label: "Tavus", url: "https://www.tavus.io" }
            ]
          },
          {
            title: "Record Your Base Video",
            description: "Follow Tavus's guided instructions to record a video template. This base video will be used for AI-driven face and voice cloning, so read the script clearly and use good lighting.",
            links: [
              { label: "Recording Guide", url: "https://help.tavus.io/en/articles/recording-your-base-video" }
            ]
          },
          {
            title: "Set Up Personalization Fields",
            description: "Decide which fields (like first name, company, product, etc.) you want to personalize. Map these variables to your contact data or CRM integration.",
            links: [
              { label: "Personalization Docs", url: "https://help.tavus.io/en/articles/personalization" }
            ]
          },
          {
            title: "Upload Your Audience List or Connect CRM",
            description: "Import a CSV of your recipients or connect directly to your CRM (such as HubSpot or Salesforce) for seamless data mapping and automation."
          },
          {
            title: "Generate Personalized Videos",
            description: "Tavus's AI engine will process your base video and data fields to create a unique, personalized video for each contact. You can preview a few before generating the full batch."
          },
          {
            title: "Review & Edit",
            description: "Check a sample of generated videos for quality, pronunciation, and accuracy. Make adjustments to your template or data and reprocess if needed."
          },
          {
            title: "Send or Share Videos",
            description: "Distribute your videos via email, SMS, direct link, or by embedding in landing pages. Tavus supports integrations for automated outreach and campaign tracking.",
            links: [
              { label: "Integrations", url: "https://help.tavus.io/en/articles/integrations" }
            ]
          },
          {
            title: "Analyze Results",
            description: "Monitor open rates, video views, clicks, and conversions in the Tavus analytics dashboard. Use insights to refine future campaigns for better engagement."
          },
          {
            title: "Advanced: API Automation",
            description: "For developers or enterprises, use the Tavus API to automate large-scale personalization, trigger video generation from workflows, and retrieve video URLs programmatically.",
            links: [
              { label: "Tavus API Docs", url: "https://docs.tavus.io/" }
            ]
          }
        ]
      },
      {
        name: "Vidyo.ai",
        description: "Vidyo.ai repurposes long-form videos into short, social-ready clips using AI, with auto-captioning, highlights, and vertical format conversion.",
        url: "https://vidyo.ai",
        id: "vidyoai",
        image: "/tool-screenshots/vidyoai.png",
        logo: "/logo/vidyoai.png",
        categories: ["video", "marketing", "productivity"],
        subcategory: "repurposing",
        tags: ["AI", "clips", "social media"],
        rating: 4.7,
        visits: 170000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI highlight detection: Automatically analyzes videos to find the most engaging moments, perfect for sharing on social media.",
          "Auto-captioning: Generates accurate, on-brand subtitles for every clip, improving accessibility and engagement.",
          "Format conversion: Instantly adapt content for TikTok, Instagram, or YouTube by converting to vertical, square, or horizontal formats.",
          "Batch processing: Process and export dozens of clips from long-form content in a fraction of the time."
        ],
        howToUse: [
          {
            title: "Register and Access Dashboard",
            description: "Go to Vidyo.ai and sign up for a free or premium account. After email confirmation, log into the dashboard.",
            links: [
              { label: "Vidyo.ai", url: "https://vidyo.ai" }
            ]
          },
          {
            title: "Upload a Long-Form Video",
            description: "Click the 'Upload Video' button and select your source video file (supported formats: MP4, MOV, etc.). Vidyo.ai will process most standard video types."
          },
          {
            title: "Choose Output Platform & Format",
            description: "Select the target platform (TikTok, Reels, Shorts, etc.). Vidyo.ai will recommend the best aspect ratio, clip length, and settings for that platform."
          },
          {
            title: "Let AI Generate Clips",
            description: "Vidyo.ai's AI will automatically detect key highlights and create multiple short, engaging clips from your long-form video."
          },
          {
            title: "Edit and Fine-Tune",
            description: "Review all generated clips. Use the built-in editor to trim, rearrange, add logos, overlays, music, and filters as needed."
          },
          {
            title: "Add Captions",
            description: "Enable auto-captioning for all clips, then review and edit the captions for accuracy, branding, and style."
          },
          {
            title: "Preview and Export",
            description: "Preview your clips and export in the optimal format for your chosen platform, ready for upload to social media."
          },
          {
            title: "Batch Process (Optional)",
            description: "For bulk work, upload and process multiple long videos at once—Vidyo.ai will handle batch highlight generation and export."
          }
        ]
      },
      {
        name: "Opus Clip",
        description: "Opus Clip harnesses AI to repurpose long videos into viral short clips, auto-selecting the most engaging segments for TikTok, Reels, and Shorts.",
        url: "https://www.opus.pro",
        id: "opusclip",
        image: "/tool-screenshots/opusclip.png",
        logo: "/logo/opusclip.png",
        categories: ["video", "marketing", "productivity"],
        subcategory: "repurposing",
        tags: ["AI", "clips", "social media"],
        rating: 4.6,
        visits: 210000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Viral moment detection: AI analyzes videos to identify and extract the most engaging, shareable moments.",
          "Auto captions: Automatically adds animated, visually appealing captions to increase watch time and accessibility.",
          "Highlight reels: Generates multiple short clips from a single long video, maximizing content value.",
          "Platform optimization: Exports clips in formats tailored for TikTok, YouTube Shorts, and Instagram Reels."
        ],
        howToUse: [
          {
            title: "Sign Up and Log In",
            description: "Go to Opus Clip's website and create an account. Log into your dashboard to start a new project.",
            links: [
              { label: "Opus Clip", url: "https://www.opus.pro" }
            ]
          },
          {
            title: "Upload Your Source Video",
            description: "Click 'Upload' and select the long-form video you want to repurpose. Opus Clip supports a variety of file types."
          },
          {
            title: "Select Output Platform",
            description: "Choose the social platform you want to optimize for (e.g., TikTok, YouTube Shorts, Instagram Reels). The tool will recommend the best format."
          },
          {
            title: "Run AI Viral Clip Detection",
            description: "Let Opus Clip automatically scan your video for the most engaging and shareable moments, generating a handful of short clips."
          },
          {
            title: "Edit Clips and Add Captions",
            description: "Use the built-in editor to tweak each clip, add animated captions, branding, overlays, or adjust timing and transitions."
          },
          {
            title: "Review and Export",
            description: "Preview all generated clips, make final adjustments, then export as MP4 or share directly to your social platforms."
          },
          {
            title: "Analyze and Batch Process",
            description: "Use analytics tools to see which clips perform best. If needed, use Opus Clip’s batch mode for processing multiple videos at once."
          }
        ]
      },
      {
        name: "Gling",
        description: "Gling is an AI video editor for YouTubers that automatically removes silences, bad takes, and stutters, speeding up the editing process for vlogs and interviews.",
        url: "https://www.gling.ai",
        id: "gling",
        image: "/tool-screenshots/gling.png",
        logo: "/logo/gling.png",
        categories: ["video", "productivity"],
        subcategory: "editing",
        tags: ["AI", "editing", "YouTube"],
        rating: 4.3,
        visits: 13000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Silence removal: Uses AI to detect and cut out pauses and dead air, making videos more engaging and concise.",
          "Bad take detection: Identifies and removes mistakes, retakes, or repeated lines for a polished final product.",
          "Timeline export: Provides clean project files for further editing in your favorite NLE.",
          "Batch processing: Edit multiple videos in one go, saving countless hours for creators."
        ],
        howToUse: [
          {
            title: "Download and Install Gling",
            description: "Visit Gling.ai, sign up, and download the desktop app for Windows or Mac. Install and launch the application.",
            links: [
              { label: "Gling", url: "https://www.gling.ai" }
            ]
          },
          {
            title: "Start a New Project",
            description: "Open Gling and create a new project. Import your raw video footage (supported formats: MP4, MOV, etc.)."
          },
          {
            title: "Run AI Editing",
            description: "Click the 'Process' button to have Gling automatically remove silences, bad takes, filler words, and stutters."
          },
          {
            title: "Review and Adjust",
            description: "Preview the AI-edited result. Restore or remove segments as needed for pacing and flow."
          },
          {
            title: "Export Timeline",
            description: "Export your cleaned timeline for further editing in your preferred video editor (Premiere, Final Cut, DaVinci Resolve, etc.)."
          },
          {
            title: "Batch Editing (Optional)",
            description: "Use batch mode to process several videos at once, perfect for bulk YouTube content or podcast cleanups."
          }
        ]
      },
      {
        name: "Papercup",
        description: "Papercup uses AI for video dubbing and translation, producing high-quality synthetic voices in dozens of languages for global video localization.",
        url: "https://www.papercup.com",
        id: "papercup",
        image: "/tool-screenshots/papercup.png",
        logo: "/logo/papercup.png",
        categories: ["video", "marketing", "audio"],
        subcategory: "dubbing",
        tags: ["AI", "dubbing", "translation"],
        rating: 4.4,
        visits: 21000,
        dateAdded: "2025-06-13",
        isPremium: "Premium",
        features: [
          "Automatic dubbing: Translate and voiceover your videos with high-quality AI voices, reducing the need for manual dubbing.",
          "Emotion-preserving voices: Synthetic voices retain emotional nuance and delivery style for authenticity.",
          "Global reach: Instantly make your videos accessible in dozens of languages and markets.",
          "Custom voice library: Choose or commission voices to match your brand, character, or style."
        ],
        howToUse: [
          {
            title: "Sign Up & Access Papercup Dashboard",
            description: "Visit Papercup and create an account for your business or project. Log in to access the dashboard where you can start new dubbing projects.",
            links: [
              { label: "Papercup", url: "https://www.papercup.com" }
            ]
          },
          {
            title: "Start a New Dubbing Project",
            description: "Click 'New Project' and upload your source video file. Papercup supports most major video formats (MP4, MOV, etc.).",
            links: [
              { label: "Papercup Help", url: "https://support.papercup.com/" }
            ]
          },
          {
            title: "Choose Target Languages",
            description: "Select one or more target languages from Papercup’s supported list. You can dub into dozens of languages for global reach."
          },
          {
            title: "Customize Voice & Style",
            description: "Choose from Papercup’s voice library. Pick voices that best match your content’s tone, or commission a custom voice for your brand."
          },
          {
            title: "Configure Additional Preferences",
            description: "Set preferences for gender, accent, and emotion if needed. You can specify requirements for each project or video segment."
          },
          {
            title: "Initiate AI Dubbing Process",
            description: "Papercup’s AI will transcribe your video, translate the script, generate synthetic voices, and sync the dubbed audio to the video with emotion preservation."
          },
          {
            title: "Review & Edit Transcript and Audio",
            description: "Check the AI-generated transcript and dubbed audio. Manually edit translations or timing if needed for accuracy and flow."
          },
          {
            title: "Preview and Approve",
            description: "Preview the dubbed video for quality and correctness. Approve when satisfied or send back for further adjustments."
          },
          {
            title: "Download & Distribute",
            description: "Export your dubbed video in the desired format. Use the download link to distribute, embed, or upload to your platforms.",
            links: [
              { label: "Papercup Export Guide", url: "https://support.papercup.com/hc/en-us/articles/4420437838097-Exporting-Your-Video" }
            ]
          },
          {
            title: "API & Integrations (Advanced)",
            description: "For large-scale automation, use Papercup’s API to submit videos, retrieve results, and integrate dubbing directly into your workflow.",
            links: [
              { label: "Papercup API", url: "https://docs.papercup.com/" }
            ]
          }
        ]
      },
      {
        name: "Dubverse",
        description: "Dubverse is an AI-powered video translation and dubbing platform that enables fast, accurate localization using a global voice library.",
        url: "https://www.dubverse.ai",
        id: "dubverse",
        image: "/tool-screenshots/dubverse.png",
        logo: "/logo/dubverse.png",
        categories: ["video", "marketing", "audio"],
        subcategory: "dubbing",
        tags: ["AI", "dubbing", "translation"],
        rating: 4.2,
        visits: 12000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI translation: Converts video speech to subtitles and voice in over 30 languages, opening content to new audiences.",
          "Voice cloning: Maintain the original speaker’s style and tone for a more authentic dub.",
          "Fast turnaround: Get dubbed videos in minutes, making localization efficient even for large projects.",
          "Subtitle and transcript generation: Automated, editable subtitles and full transcripts to complement any video."
        ],
        howToUse: [
          {
            title: "Register and Sign In",
            description: "Go to Dubverse and create an account. Log in to access your dashboard and start dubbing projects.",
            links: [
              { label: "Dubverse", url: "https://www.dubverse.ai" }
            ]
          },
          {
            title: "Upload Your Video",
            description: "Start a new project and upload your video file. Supported formats include MP4, MOV, and others."
          },
          {
            title: "Select Target Language(s)",
            description: "Choose one or more target languages you want your video to be dubbed into. Dubverse supports over 30 languages."
          },
          {
            title: "Pick Voice and Cloning Options",
            description: "Select from a variety of AI voices or use voice cloning for original style retention. Adjust gender, accent, and tone as desired."
          },
          {
            title: "AI Translation and Dubbing",
            description: "Dubverse will automatically transcribe, translate, and generate the dubbed audio with accurate lip-sync using AI."
          },
          {
            title: "Review Transcript and Dubbing",
            description: "Edit the generated transcript, subtitles, or audio if needed to ensure high-quality output."
          },
          {
            title: "Export Video with Subtitles",
            description: "Export your dubbed video and download it, or share via Dubverse’s provided link. You can also download the subtitle and transcript files."
          },
          {
            title: "API Automation (For Developers)",
            description: "Use the Dubverse API for batch processing and workflow integration in large-scale localization projects.",
            links: [
              { label: "Dubverse API Docs", url: "https://docs.dubverse.ai" }
            ]
          }
        ]
      },
      {
        name: "Video AI by Wondershare (Virbo)",
        description: "Virbo by Wondershare offers AI avatar videos, voiceovers, and automated video presentations from scripts. Great for marketing, courses, and content automation.",
        url: "https://virbo.wondershare.com",
        id: "virbo",
        image: "/tool-screenshots/virbo.png",
        logo: "/logo/virbo.png",
        categories: ["video", "marketing"],
        subcategory: "avatar video",
        tags: ["AI", "avatar", "voiceover"],
        rating: 4.2,
        visits: 9000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI avatar presenter: Choose from a variety of digital humans to star in your videos, enhancing professionalism and engagement.",
          "Script-to-video: Simply enter your text and receive a fully narrated and animated video.",
          "Custom voiceover: Upload your script and select a voice to match your brand persona or audience.",
          "Template library: Prebuilt templates for marketing, education, business, and more, making video creation fast and easy."
        ],
        howToUse: [
          {
            title: "Sign Up and Access Virbo",
            description: "Go to the Virbo by Wondershare website and create an account. Log in to access the dashboard.",
            links: [
              { label: "Virbo", url: "https://virbo.wondershare.com" }
            ]
          },
          {
            title: "Start New Project",
            description: "Click 'Create Video' or use a template. Choose your desired video type (presentation, marketing, explainer, etc.)."
          },
          {
            title: "Select an AI Avatar",
            description: "Browse and select a digital human avatar that matches your brand or message."
          },
          {
            title: "Write or Paste Script",
            description: "Enter your script for the avatar to present. Virbo supports multi-language scripts and dynamic content."
          },
          {
            title: "Choose Voice and Language",
            description: "Pick a voice from the library or upload your own. Set the language, accent, and tone for your audience."
          },
          {
            title: "Customize Video Scenes",
            description: "Add images, logos, backgrounds, and animations. Adjust timing and transitions for each segment."
          },
          {
            title: "Preview and Edit",
            description: "Preview your video, review avatar performance, and make edits to text, voice, or visuals as needed."
          },
          {
            title: "Export and Share",
            description: "Export your completed video in your chosen resolution and format. Download or share directly via link."
          }
        ]
      },
      {
        name: "DeepDub",
        description: "DeepDub is an AI dubbing platform for video translation with emotion-preserving synthetic voices, enabling global video content localization.",
        url: "https://deepdub.ai",
        id: "deepdub",
        image: "/tool-screenshots/deepdub.png",
        logo: "/logo/deepdub.png",
        categories: ["video", "audio"],
        subcategory: "dubbing",
        tags: ["AI", "dubbing", "translation"],
        rating: 4.1,
        visits: 6000,
        dateAdded: "2025-06-13",
        isPremium: "Premium",
        features: [
          "Emotion-preserving dubbing: AI voices keep the original speaker’s tone, emotion, and intent for a natural translation.",
          "Multi-language support: Translate and dub content into any major language for global audience expansion.",
          "Voice cloning: Retain the identity of the original speaker for authenticity and continuity.",
          "API access: Automate large-scale localization and dubbing workflows for enterprise-level needs."
        ],
        howToUse: [
          {
            title: "Contact DeepDub Sales",
            description: "Visit DeepDub and reach out via the contact form to discuss your project and get access to the platform.",
            links: [
              { label: "DeepDub", url: "https://deepdub.ai" }
            ]
          },
          {
            title: "Onboard and Upload Video",
            description: "Work with the DeepDub team to onboard your project, set up access, and securely upload your source video files."
          },
          {
            title: "Define Languages and Preferences",
            description: "Specify the target languages, desired tone, and any emotional requirements for dubbing. DeepDub will help configure the right AI voices."
          },
          {
            title: "Voice Cloning & Dubbing Setup",
            description: "If needed, provide sample audio for voice cloning. DeepDub will set up voices to match your requirements and brand consistency."
          },
          {
            title: "AI Dubbing and Review",
            description: "DeepDub’s AI transcribes, translates, and dubs the video while preserving the original speaker’s intent and emotion. Review initial outputs for feedback."
          },
          {
            title: "Approve and Receive Deliverables",
            description: "Approve the final dubbed videos after your review. Receive your localized content in the required video format for global distribution."
          },
          {
            title: "API Integration (Enterprise)",
            description: "For large-scale, recurring, or programmatic localization, use DeepDub’s API to automate video submission and retrieval.",
            links: [
              { label: "DeepDub API", url: "https://deepdub.ai/technology" }
            ]
          }
        ]
      },
      {
        name: "VideoKen",
        description: "VideoKen uses AI to summarize, chapter, and index webinars, lectures, and conferences, making long-form video content easily navigable and searchable.",
        url: "https://www.videoken.com",
        id: "videoken",
        image: "/tool-screenshots/videoken.png",
        logo: "/logo/videoken.png",
        categories: ["video", "productivity"],
        subcategory: "summarization",
        tags: ["AI", "summarization", "education"],
        rating: 4.2,
        visits: 8000,
        dateAdded: "2025-06-13",
        isPremium: "Premium",
        features: [
          "AI video summarization: Condenses long videos into highlight reels or concise summaries, saving viewers time.",
          "Automatic chaptering: Detects topic changes and creates clickable chapters for easy navigation.",
          "Searchable transcripts: Generates accurate transcripts and indexes key content for efficient search.",
          "Embeddable widgets: Add smart indexes and navigation tools to your video platform or website."
        ],
        howToUse: [
          {
            title: "Sign Up & Access Dashboard",
            description: "Visit VideoKen and sign up for an account. After verifying your email, log in to access the project dashboard.",
            links: [
              { label: "VideoKen", url: "https://www.videoken.com" }
            ]
          },
          {
            title: "Start a New Project",
            description: "Click 'New Project' and upload your long-form video (webinar, lecture, or conference). Supported formats include MP4, MOV, and more."
          },
          {
            title: "Configure Analysis Preferences",
            description: "Set options for summarization depth, chapter length, and indexing detail. You can tailor these to your audience or use case."
          },
          {
            title: "Run AI Summarization & Chaptering",
            description: "Initiate the analysis. VideoKen's AI will process your video, identify key segments, summarize content, and create interactive chapters."
          },
          {
            title: "Review Summaries & Chapters",
            description: "Preview the generated summaries and chapters. Manually edit titles, keywords, or timestamps for accuracy and clarity."
          },
          {
            title: "Generate and Edit Transcript",
            description: "VideoKen will auto-generate a searchable transcript. Review and edit the transcript to fix names, terms, or add custom notes."
          },
          {
            title: "Embed or Export Indexes",
            description: "Embed interactive chapter widgets or indexes on your website, LMS, or shareable pages. Export summaries or transcripts as needed.",
            links: [
              { label: "Embed Guide", url: "https://www.videoken.com/embed" }
            ]
          },
          {
            title: "Monitor Engagement",
            description: "Use VideoKen's analytics to track how viewers interact with your chapters, indexes, and summaries."
          }
        ]
      },
      {
        name: "Vidby",
        description: "Vidby is an AI-powered video translation and voiceover tool, supporting 70+ languages for fast and accurate video localization.",
        url: "https://www.vidby.com",
        id: "vidby",
        image: "/tool-screenshots/vidby.png",
        logo: "/logo/vidby.png",
        categories: ["video", "marketing", "audio"],
        subcategory: "translation",
        tags: ["AI", "translation", "dubbing"],
        rating: 4.3,
        visits: 18000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI voiceover: Quickly add multi-language narration to your videos, making them accessible worldwide.",
          "Fast translation: Localize videos in over 70 languages with just a few clicks, no manual work needed.",
          "Subtitle generation: Automatic, editable subtitles for every video, enhancing SEO and accessibility.",
          "Speaker detection: Accurately identifies and translates multiple speakers in one video."
        ],
        howToUse: [
          {
            title: "Register and Log In",
            description: "Go to Vidby, sign up for a free or premium account, and log into your dashboard.",
            links: [
              { label: "Vidby", url: "https://www.vidby.com" }
            ]
          },
          {
            title: "Upload Your Video",
            description: "Click on 'Upload Video' and select your file. Supported formats include MP4, MOV, AVI, and more."
          },
          {
            title: "Select Languages and Voices",
            description: "Pick the target language(s) for translation. Choose from a variety of voices for narration or dubbing."
          },
          {
            title: "Configure Subtitles and Speaker Detection",
            description: "Enable automatic subtitle generation and confirm speaker identification for multi-speaker videos."
          },
          {
            title: "Initiate AI Translation and Voiceover",
            description: "Start the process. Vidby’s AI will translate, dub, and subtitle your video. Wait for processing (time depends on video length)."
          },
          {
            title: "Review and Edit Output",
            description: "Check the translated video, subtitles, and voiceover for accuracy. Edit any section if needed."
          },
          {
            title: "Export or Share",
            description: "Export your localized video, subtitles, and transcripts. Share directly via Vidby links or download for distribution."
          }
        ]
      },
      {
        name: "Aimages",
        description: "Aimages is an AI-powered video enhancement platform for upscaling, denoising, and restoring old or low-quality videos, making them look new again.",
        url: "https://aimages.ai",
        id: "aimages",
        image: "/tool-screenshots/aimages.png",
        logo: "/logo/aimages.png",
        categories: ["video", "productivity"],
        subcategory: "enhancement",
        tags: ["AI", "upscaling", "restoration"],
        rating: 4.2,
        visits: 12000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI upscaling: Sharpen and enhance low-resolution videos for HD or 4K output.",
          "Noise reduction: Remove grain, compression artifacts, and visual noise for a clean look.",
          "Frame interpolation: Smooth choppy or low-FPS footage for more natural motion.",
          "Restoration: Revive damaged, faded, or old videos using deep learning models."
        ],
        howToUse: [
          {
            title: "Create an Account and Log In",
            description: "Sign up at Aimages and log into your dashboard to start processing videos.",
            links: [
              { label: "Aimages", url: "https://aimages.ai" }
            ]
          },
          {
            title: "Upload Video for Enhancement",
            description: "Click 'Upload' and select the video you want to enhance. Supported formats: MP4, AVI, MOV, etc."
          },
          {
            title: "Select Enhancement Features",
            description: "Choose from upscaling (HD/4K), noise reduction, frame interpolation, and restoration. You can enable one or several features based on your needs."
          },
          {
            title: "Configure Output Settings",
            description: "Set your desired output resolution, frame rate, and format. Review advanced options for best results."
          },
          {
            title: "Run AI Enhancement",
            description: "Start processing. Aimages’ AI will enhance your video and display a progress bar. Processing time depends on video length and selected features."
          },
          {
            title: "Preview and Download",
            description: "Preview the enhanced video for quality. Download the final result or reprocess with different settings if needed."
          }
        ]
      },
      {
        name: "Neural.love Video Enhancer",
        description: "Neural.love offers AI-powered upscaling, colorization, and restoration for old or damaged video footage, making your archives shine.",
        url: "https://neural.love/video-enhancer",
        id: "neurallove",
        image: "/tool-screenshots/neurallove.png",
        logo: "/logo/neurallove.png",
        categories: ["video", "productivity"],
        subcategory: "enhancement",
        tags: ["AI", "upscaling", "restoration"],
        rating: 4.4,
        visits: 15000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI upscaling: Transform SD or low-quality footage into crisp HD or 4K with advanced deep learning.",
          "Colorization: Automatically colorize black-and-white videos for a modern, vibrant look.",
          "Scratch and noise removal: Remove physical and digital imperfections from aged footage.",
          "Frame interpolation: Generate additional frames for smoother slow-motion or restored framerate."
        ],
        howToUse: [
          {
            title: "Sign Up and Log In",
            description: "Go to Neural.love, create an account, and log in to the video enhancer dashboard.",
            links: [
              { label: "Neural.love Video Enhancer", url: "https://neural.love/video-enhancer" }
            ]
          },
          {
            title: "Upload Your Video",
            description: "Click 'Upload Video' and select your source file (supported formats: MP4, MOV, etc.)."
          },
          {
            title: "Choose Enhancement Options",
            description: "Select upscaling, colorization, scratch removal, noise reduction, or frame interpolation. Combine features as needed."
          },
          {
            title: "Set Output Preferences",
            description: "Choose output resolution (HD, 4K), format, and other preferences before starting."
          },
          {
            title: "Process Video with AI",
            description: "Start the enhancement process. Neural.love’s AI will apply selected features and show progress."
          },
          {
            title: "Preview and Download",
            description: "Preview the enhanced video to review quality. Download your high-quality, restored video or tweak settings and reprocess if needed."
          }
        ]
      },
      {
        name: "Peech",
        description: "Peech is an AI video editor for marketers, offering automated subtitling, branding, and highlight detection to repurpose long-form content for social media.",
        url: "https://www.peech-ai.com",
        id: "peech",
        image: "/tool-screenshots/peech.png",
        logo: "/logo/peech.png",
        categories: ["video", "marketing", "productivity"],
        subcategory: "editing",
        tags: ["AI", "editing", "subtitles"],
        rating: 4.2,
        visits: 8000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Automatic highlight detection: AI scans and extracts the best moments from your content for social media sharing.",
          "AI branding: Applies logos, colors, and fonts consistently across all your video content.",
          "Auto-subtitling: Generates accurate, stylized captions to boost accessibility and engagement.",
          "Batch video repurposing: Turn webinars or podcasts into dozens of clips for different platforms in one workflow."
        ],
        howToUse: [
          {
            title: "Sign Up & Log In",
            description: "Visit Peech AI and create an account. Log in to your personalized dashboard to start editing.",
            links: [
              { label: "Peech AI", url: "https://www.peech-ai.com" }
            ]
          },
          {
            title: "Upload Your Video Content",
            description: "Click on 'Upload' and select your webinar, podcast, or long-form video. Peech supports popular video formats such as MP4 and MOV."
          },
          {
            title: "Automatic Highlight Detection",
            description: "Let Peech’s AI analyze your video and automatically detect the most engaging highlights suitable for social sharing."
          },
          {
            title: "Apply Branding",
            description: "Customize your video with your brand’s logos, colors, and fonts. Peech applies brand consistency across all output clips."
          },
          {
            title: "Generate and Edit Subtitles",
            description: "Peech automatically creates subtitles for your video. Edit the captions for accuracy or style them to match your branding."
          },
          {
            title: "Batch Repurposing",
            description: "Use batch features to turn one long-form video into multiple short, platform-ready clips for TikTok, YouTube Shorts, Reels, and more."
          },
          {
            title: "Preview & Export",
            description: "Preview all generated clips, make any final adjustments, and export them in the desired format for your preferred platforms."
          }
        ]
      },
      {
        name: "LALAL.AI Video Stem Splitter",
        description: "LALAL.AI uses AI to extract vocals and music from video files, making it easy to remix or edit soundtracks for new projects.",
        url: "https://www.lalal.ai",
        id: "lalalai",
        image: "/tool-screenshots/lalalai.png",
        logo: "/logo/lalalai.png",
        categories: ["video", "audio", "productivity"],
        subcategory: "audio splitting",
        tags: ["AI", "audio", "stem splitter"],
        rating: 4.6,
        visits: 720000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Audio stem extraction: Precisely separate vocals, instrumentation, drums, and other elements from video or audio files.",
          "Batch processing: Upload and process multiple video files at once for efficient workflows.",
          "High-accuracy AI: Maintains excellent sound quality and clarity during the extraction process.",
          "Multi-format support: Works with a wide range of video and audio file types for maximum flexibility."
        ],
        howToUse: [
          {
            title: "Sign Up or Start for Free",
            description: "Go to LALAL.AI and either sign up or start the free trial to access the stem splitter tool.",
            links: [
              { label: "LALAL.AI", url: "https://www.lalal.ai" }
            ]
          },
          {
            title: "Upload Your Video or Audio File",
            description: "Drag and drop or select the file you want to split. LALAL.AI supports MP4, MP3, WAV, and many other formats."
          },
          {
            title: "Choose Stems to Extract",
            description: "Select which stems you want—vocals, instrumental, drums, bass, etc. LALAL.AI will process accordingly."
          },
          {
            title: "Processing & Preview",
            description: "Wait for the AI to analyze and separate the tracks. You can preview the extracted stems before downloading."
          },
          {
            title: "Download Stems",
            description: "Download your separated audio files and use them for remixing, editing, or any new creative project."
          },
          {
            title: "Batch Mode (Optional)",
            description: "For large jobs, use batch processing to split stems from multiple files in one session (requires paid plan)."
          }
        ]
      },
      {
        name: "Unscreen",
        description: "Unscreen allows you to remove video backgrounds automatically without a green screen. Ideal for social content, memes, and remote presentations.",
        url: "https://www.unscreen.com",
        id: "unscreen",
        image: "/tool-screenshots/unscreen.png",
        logo: "/logo/unscreen.png",
        categories: ["video", "productivity"],
        subcategory: "background removal",
        tags: ["AI", "background removal", "editing"],
        rating: 4.5,
        visits: 800000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Automatic background removal: Instantly removes video backgrounds without needing a green screen or manual masking.",
          "Supports GIF, MOV, MP4: Works with multiple video and animation formats for broad compatibility.",
          "Batch upload: Process many videos at once for efficient content creation.",
          "Custom backgrounds: Replace backgrounds with images, colors, or other videos to suit your project."
        ],
        howToUse: [
          {
            title: "Go to Unscreen",
            description: "Visit the Unscreen website. You can use it online without registration for smaller files, or sign up for batch and advanced features.",
            links: [
              { label: "Unscreen", url: "https://www.unscreen.com" }
            ]
          },
          {
            title: "Upload Your Video or GIF",
            description: "Click 'Upload Clip' and select your video or GIF. Supported formats include MP4, MOV, and GIF."
          },
          {
            title: "Automatic Background Removal",
            description: "Let Unscreen process the video. The background will be removed automatically, no green screen required."
          },
          {
            title: "Customize Background (Optional)",
            description: "Add a new background: choose a solid color, upload an image, or select a video background for your subject."
          },
          {
            title: "Preview & Download",
            description: "Preview the output and download your video or GIF with the new background. Free version may include a watermark."
          },
          {
            title: "Batch Processing (Pro)",
            description: "If you need to process many videos, sign up for a paid plan and use Unscreen Pro for batch uploads and higher resolution output."
          }
        ]
      },
      {
        name: "Munch",
        description: "Munch uses AI to repurpose video content into multiple short-form clips for social media, with auto captions, highlights, and SEO insights.",
        url: "https://www.getmunch.com",
        id: "munch",
        image: "/tool-screenshots/munch.png",
        logo: "/logo/munch.png",
        categories: ["video", "marketing", "productivity"],
        subcategory: "repurposing",
        tags: ["AI", "clips", "social media"],
        rating: 4.4,
        visits: 18000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI highlight selection: Analyzes videos and finds the most engaging moments to create viral-ready clips for social media.",
          "Auto-captioning: Adds accurate, on-brand subtitles in a variety of styles to increase accessibility and reach.",
          "SEO scoring: AI evaluates clip content for shareability and discoverability, helping maximize engagement.",
          "Multi-platform export: Easily export content for TikTok, Reels, YouTube Shorts, and more."
        ],
        howToUse: [
          {
            title: "Register for Munch",
            description: "Sign up for Munch and log in to your dashboard to start repurposing content.",
            links: [
              { label: "Munch", url: "https://www.getmunch.com" }
            ]
          },
          {
            title: "Upload Your Source Video",
            description: "Click 'Upload' and select the video you want to repurpose. Munch will process most major video formats."
          },
          {
            title: "AI Highlight Detection",
            description: "Let Munch's AI automatically analyze your video and select the best moments for short-form, viral-ready clips."
          },
          {
            title: "Edit and Add Captions",
            description: "Review the suggested clips, trim as needed, and add or edit captions styled for your brand."
          },
          {
            title: "SEO & Platform Optimization",
            description: "Use Munch's SEO tools to optimize each clip for shareability and discoverability on social platforms."
          },
          {
            title: "Export for Multi-Platform Use",
            description: "Export your clips in the correct format for TikTok, YouTube Shorts, Instagram Reels, and more. Download or share via direct link."
          }
        ]
      },
      {
        name: "Steve.AI",
        description: "Steve.AI creates videos from blog posts or scripts using AI-generated scenes, stock footage, and voiceovers, ideal for marketing and content teams.",
        url: "https://www.steve.ai",
        id: "steveai",
        image: "/tool-screenshots/steveai.png",
        logo: "/logo/steveai.png",
        categories: ["video", "marketing"],
        subcategory: "creation",
        tags: ["AI", "creation", "voiceover"],
        rating: 4.3,
        visits: 20000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Blog-to-video: AI transforms written articles or scripts into animated explainer or promo videos in minutes.",
          "AI scene generation: Automatically generates relevant, visually engaging scenes to match your script.",
          "Stock library: Access thousands of royalty-free images, video clips, and music tracks for your projects.",
          "Voiceover generation: Add realistic AI voice narration in multiple languages and accents."
        ],
        howToUse: [
          {
            title: "Sign Up & Log In",
            description: "Go to Steve.AI and create an account. Log in to access your video creation dashboard.",
            links: [
              { label: "Steve.AI", url: "https://www.steve.ai" }
            ]
          },
          {
            title: "Start a New Video Project",
            description: "Click 'Create Video' and choose your workflow: script-to-video, blog-to-video, or from a template. Select a template if you want a head start."
          },
          {
            title: "Input Script or Blog Link",
            description: "Paste your script, enter your blog URL, or write content directly in the platform. Steve.AI will use this text to generate scenes."
          },
          {
            title: "Select Video Type & Style",
            description: "Choose between animation, live-action, or mixed style. Set your branding, color palette, and aspect ratio for your target platform."
          },
          {
            title: "Customize Scenes & Stock Media",
            description: "Edit each generated scene: swap backgrounds, add or change stock images, video clips, and icons. Add or edit on-screen text and transitions."
          },
          {
            title: "Add Voiceover",
            description: "Select an AI-generated voice in your preferred language and accent, or upload a custom voiceover file."
          },
          {
            title: "Preview & Edit",
            description: "Preview the video, check timing, voiceover sync, and scene transitions. Edit any scene or narration for clarity and flow."
          },
          {
            title: "Export & Share",
            description: "Export your finished video in your chosen resolution. Download the file or share directly to social media or via link."
          }
        ]
      },
      {
        name: "DeepSwap",
        description: "DeepSwap is an AI-powered face swapping tool for videos and images, enabling realistic and quick face replacement for memes, parody, and creative edits.",
        url: "https://www.deepswap.ai",
        id: "deepswap",
        image: "/tool-screenshots/deepswap.png",
        logo: "/logo/deepswap.png",
        categories: ["video", "productivity"],
        subcategory: "face swap",
        tags: ["AI", "face swap", "editing"],
        rating: 4.2,
        visits: 85000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Automatic face swapping: Replace faces in videos or images with high accuracy and realism using advanced neural networks.",
          "Realistic results: Seamless blending and natural expressions for both fun and professional use cases.",
          "Multiple file formats: Works with MP4, GIF, JPEG, and many other common media file types.",
          "Fast processing: Upload and process large files quickly, with support for batch jobs."
        ],
        howToUse: [
          {
            title: "Register or Log In",
            description: "Go to DeepSwap's website, sign up for an account, and log in to your dashboard.",
            links: [
              { label: "DeepSwap", url: "https://www.deepswap.ai" }
            ]
          },
          {
            title: "Upload Source Video or Image",
            description: "Click 'Upload' and choose the video, GIF, or image you want to use as the base for face swapping."
          },
          {
            title: "Upload Face(s) for Swap",
            description: "Upload the face image(s) you want to insert into the base video or image. DeepSwap will analyze and prepare them for swapping."
          },
          {
            title: "Run AI Face Swap",
            description: "Start the swap process. DeepSwap’s AI will automatically replace faces, adjust blending, and generate the output."
          },
          {
            title: "Preview & Edit",
            description: "Preview your swapped result. For best results, check the alignment and naturalness. Re-upload or adjust faces if needed."
          },
          {
            title: "Download or Share",
            description: "Download your face-swapped video or image. Paid users can export in higher resolution and without watermark."
          }
        ]
      },
      {
        name: "Reface",
        description: "Reface is an AI-powered app for face-swapping in short videos, GIFs, and memes. Popular for social media and entertainment.",
        url: "https://www.reface.ai",
        id: "reface",
        image: "/tool-screenshots/reface.png",
        logo: "/logo/reface.png",
        categories: ["video"],
        subcategory: "face swap",
        tags: ["AI", "face swap", "memes"],
        rating: 4.5,
        visits: 1700000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Face swap for video, GIF, and images: Instantly overlay your face onto trending clips or memes for viral social content.",
          "Viral meme generator: Pick from thousands of templates to create and share popular memes in seconds.",
          "Template library: Access a huge collection of prebuilt video and GIF templates for face swap fun.",
          "Mobile app: Edit and share on the go with iOS and Android support, perfect for creators and influencers."
        ],
        howToUse: [
          {
            title: "Download and Open App",
            description: "Download the Reface app from the App Store or Google Play and open the app on your device.",
            links: [
              { label: "Reface App", url: "https://www.reface.ai" }
            ]
          },
          {
            title: "Upload or Take a Selfie",
            description: "Use your device camera to take a selfie or upload a photo. Make sure the face is clear and well-lit for best results."
          },
          {
            title: "Choose a Template",
            description: "Select from thousands of trending videos, GIFs, and meme templates in the app’s library."
          },
          {
            title: "Apply Face Swap",
            description: "Let Reface’s AI automatically swap your face onto the selected template. Preview the animated result instantly."
          },
          {
            title: "Edit & Download",
            description: "Trim, crop, or add effects as desired. Download the final GIF, video, or meme to your device."
          },
          {
            title: "Share to Social Media",
            description: "Share your creation directly to Instagram, TikTok, Messenger, or other social platforms straight from the app."
          }
        ]
      },
      {
        name: "ClipDrop Relight",
        description: "ClipDrop Relight uses AI to relight and edit video scenes, enhancing visuals without reshooting. Perfect for post-production and creative projects.",
        url: "https://clipdrop.co/relight",
        id: "clipdroprelight",
        image: "/tool-screenshots/clipdroprelight.png",
        logo: "/logo/clipdroprelight.png",
        categories: ["video", "productivity", "design"],
        subcategory: "enhancement",
        tags: ["AI", "relighting", "editing"],
        rating: 4.3,
        visits: 30000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI relighting: Change the lighting conditions in your video after filming, adding drama or correcting bad lighting.",
          "Color grading: Instantly adjust the mood, tone, and color palette for a polished professional look.",
          "Object removal: Effortlessly erase unwanted elements from your shots without complex editing skills.",
          "Web-based editor: Edit videos in the cloud, with no need for high-powered local hardware."
        ],
        howToUse: [
          {
            title: "Go to ClipDrop Relight",
            description: "Visit ClipDrop’s Relight tool online. No installation is needed; all editing is done in the browser.",
            links: [
              { label: "ClipDrop Relight", url: "https://clipdrop.co/relight" }
            ]
          },
          {
            title: "Upload Your Video or Image",
            description: "Click 'Upload' and select the video or image file you want to relight or enhance."
          },
          {
            title: "Adjust Lighting",
            description: "Use the relight controls to add, move, or adjust virtual light sources. Instantly see the effect on your scene."
          },
          {
            title: "Apply Color Grading and Effects",
            description: "Experiment with color grading sliders and filters to achieve the desired mood and style."
          },
          {
            title: "Remove Objects (Optional)",
            description: "If needed, use the object removal tool to erase unwanted elements from your video or image."
          },
          {
            title: "Preview & Download",
            description: "Preview your enhanced video or image. Download the result in your chosen format directly from the web editor."
          }
        ]
      },
      {
        name: "Ssemble",
        description: "Ssemble is a collaborative online video editor with AI tools for summarizing, transcribing, and enhancing videos, ideal for teams and educators.",
        url: "https://www.ssemble.com",
        id: "ssemble",
        image: "/tool-screenshots/ssemble.png",
        logo: "/logo/ssemble.png",
        categories: ["video", "productivity"],
        subcategory: "editing",
        tags: ["AI", "editing", "collaboration"],
        rating: 4.3,
        visits: 7000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "Collaborative editing: Multiple users can work on the same video project in real time, streamlining team workflows.",
          "Transcription and subtitles: AI generates editable transcripts and subtitles for improved accessibility and SEO.",
          "Video summarization: Automatically condense long-form content into short, shareable highlights.",
          "Plugin marketplace: Extend Ssemble with add-ons for effects, integrations, and custom tools."
        ],
        howToUse: [
          {
            title: "Sign Up & Log In",
            description: "Visit Ssemble and create a free account. Log in to your dashboard to start new projects or join team workspaces.",
            links: [
              { label: "Ssemble", url: "https://www.ssemble.com" }
            ]
          },
          {
            title: "Create or Join a Project",
            description: "Start a new video editing project or join an existing team project. Invite collaborators if you’re working as a team."
          },
          {
            title: "Upload Video Files",
            description: "Upload your source media files (video, audio, images) to the project workspace. Ssemble supports all major video formats."
          },
          {
            title: "Edit Collaboratively in Real Time",
            description: "Edit the timeline, cut or merge clips, add transitions, overlays, and effects. Multiple users can work together live on the same timeline."
          },
          {
            title: "Use AI Tools for Transcription & Summarization",
            description: "Generate automatic transcripts and subtitles for your videos. Use the AI summarization feature to create highlight reels from long-form content."
          },
          {
            title: "Explore Plugin Marketplace",
            description: "Install plugins for advanced effects, integrations (like YouTube or Google Drive), or custom workflow enhancements."
          },
          {
            title: "Preview, Export, and Share",
            description: "Preview your final video, export in the desired resolution and format, and share via link or direct download."
          }
        ]
      },
      {
        name: "Genny by LOVO",
        description: "Genny by LOVO offers AI voiceovers and text-to-video creation for marketing, e-learning, and creative projects, with dozens of voices and languages.",
        url: "https://www.lovo.ai/genny",
        id: "gennybylovo",
        image: "/tool-screenshots/gennybylovo.png",
        logo: "/logo/gennybylovo.png",
        categories: ["video", "audio", "marketing"],
        subcategory: "voiceover",
        tags: ["AI", "voiceover", "text-to-video"],
        rating: 4.4,
        visits: 62000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI voice generator: Access over 500 realistic voices in more than 100 languages and accents for any project.",
          "Text-to-video: Transform scripts into video presentations with synchronized visuals and narration.",
          "Voice cloning: Replicate your own or an actor’s voice for highly customized voiceovers.",
          "Audio editing suite: Edit, mix, and enhance voice tracks to achieve perfect results in every video."
        ],
        howToUse: [
          {
            title: "Create a Genny Account",
            description: "Go to the Genny by LOVO site and sign up for a free or paid account. Log in to access your dashboard.",
            links: [
              { label: "Genny by LOVO", url: "https://www.lovo.ai/genny" }
            ]
          },
          {
            title: "Start a New Project",
            description: "Create a new project: choose between text-to-video or voiceover-only workflow based on your needs."
          },
          {
            title: "Input or Upload Script",
            description: "Type your script or upload a document. For video creation, Genny will sync text with visuals and narration."
          },
          {
            title: "Select a Voice and Language",
            description: "Choose from 500+ AI voices in 100+ languages and accents. Use voice cloning if you want to replicate a specific voice."
          },
          {
            title: "Customize Visuals (Text-to-Video)",
            description: "For video projects, add images, slides, or backgrounds. Arrange audio and visuals on the timeline."
          },
          {
            title: "Edit and Mix Audio",
            description: "Fine-tune timing, pitch, and effects for narration. Edit background music or sound effects in the audio suite."
          },
          {
            title: "Preview and Export",
            description: "Preview your voiceover or video, make final adjustments, and export the finished file in your desired format."
          }
        ]
      },
      {
        name: "VideoLeap by Lightricks",
        description: "VideoLeap is a mobile video editing app with AI-powered effects, auto-cutting, and enhancement tools for quick, high-quality video creation.",
        url: "https://www.videoleapapp.com",
        id: "videoleap",
        image: "/tool-screenshots/videoleap.png",
        logo: "/logo/videoleap.png",
        categories: ["video", "productivity"],
        subcategory: "editing",
        tags: ["AI", "mobile", "editing"],
        rating: 4.6,
        visits: 2400000,
        dateAdded: "2025-06-13",
        isPremium: "Freemium",
        features: [
          "AI-powered effects: Instantly enhance footage and apply creative filters and transitions with a tap.",
          "Auto-cut and montage: Automatically find and assemble the best clips for polished, professional videos.",
          "Layered editing: Combine video clips, images, and soundtracks with advanced compositing tools.",
          "Mobile-first: Edit and publish on the go with full-featured apps for iOS and Android devices."
        ],
        howToUse: [
          {
            title: "Download VideoLeap App",
            description: "Download and install VideoLeap from the App Store (iOS) or Google Play (Android). Launch the app on your mobile device.",
            links: [
              { label: "VideoLeap App", url: "https://www.videoleapapp.com" }
            ]
          },
          {
            title: "Start a New Project",
            description: "Tap the '+' button to create a new project. Import your video clips, photos, or audio from your device."
          },
          {
            title: "Edit with AI Tools",
            description: "Use AI-powered effects, auto-cut, and montage tools to enhance and assemble your video. Apply filters, transitions, and creative overlays."
          },
          {
            title: "Arrange Clips and Layers",
            description: "Drag and drop video clips, images, and soundtracks onto the timeline. Use advanced layering and compositing options as needed."
          },
          {
            title: "Preview and Adjust",
            description: "Preview your edit in real time. Trim, split, or reorder clips, and adjust colors, speed, or effects."
          },
          {
            title: "Export and Share",
            description: "Export your finished video in high resolution. Share directly to social media or save to your device."
          }
        ]
      }
  ];

export async function getToolById(id: string) {
  return mockTools.find((tool) => tool.id === id) || null;
}
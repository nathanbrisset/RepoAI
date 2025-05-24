"use client";
import { useState } from "react"
import { mockTools } from "@/lib/data"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ExternalLink, ThumbsUp } from "lucide-react"
import ToolCard from "@/components/tool-card"

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function getToolFeatures(toolName: string, category: string): string[] {
  const genericFeatures = [
    "AI-Powered Analysis: Leverages artificial intelligence for advanced data processing and insights.",
    "Real-Time Processing: Provides immediate results and updates as data changes.",
    "User-Friendly Interface: Offers an intuitive and easy-to-navigate design.",
    "Customizable Settings: Allows users to tailor the tool to their specific needs."
  ];

  switch (category.toLowerCase()) {
    case "text":
      switch (toolName) {
        case "Grammarly":
          return [
            "Real-Time Grammar and Spelling Checks: Instantly identifies and corrects grammatical errors and typos as you type.",
            "Writing Style Improvements: Offers suggestions to improve clarity, conciseness, and tone.",
            "Plagiarism Detection: Checks content against billions of web pages to ensure originality.",
            "Tone Detection: Analyzes the tone of your writing to ensure it matches your intended message."
          ];
        case "QuillBot":
          return [
            "Paraphrasing Tool: Rewrites sentences in multiple modes to suit different writing styles.",
            "Grammar Checker: Identifies and corrects grammatical errors to improve writing accuracy.",
            "Summarizer: Condenses articles, papers, or documents into key points.",
            "Citation Generator: Automatically creates citations in various formats like APA, MLA, and Chicago."
          ];
        case "ProWritingAid":
          return [
            "In-Depth Writing Reports: Provides over 20 detailed reports on aspects like overused words, sentence length, and readability.",
            "Style and Grammar Checks: Offers suggestions to enhance writing style and correct grammatical errors.",
            "Integration with Writing Platforms: Compatible with MS Word, Google Docs, Scrivener, and more.",
            "Thesaurus and Word Explorer: Helps diversify vocabulary and find the perfect word for your context."
          ];
        case "Hemingway App":
          return [
            "Readability Score: Assigns a grade level to your writing to gauge its readability.",
            "Highlighting Complex Sentences: Identifies hard-to-read sentences for simplification.",
            "Adverb and Passive Voice Detection: Flags overuse of adverbs and passive constructions.",
            "Formatting Tools: Allows basic formatting like bold, italics, headings, and lists."
          ];
        case "ChatGPT (GPT-4o)":
          return [
            "Conversational Abilities: Engages in coherent and context-aware dialogues.",
            "Multilingual Support: Understands and generates text in multiple languages.",
            "Creative Writing: Assists in composing poems, stories, and essays.",
            "Code Assistance: Helps in writing and debugging code snippets."
          ];
        case "Claude 3":
          return [
            "Constitutional AI: Adheres to a set of ethical principles to ensure safe interactions.",
            "Contextual Understanding: Maintains context over extended conversations.",
            "Summarization: Efficiently summarizes long documents or articles.",
            "Question Answering: Provides accurate answers to a wide range of queries."
          ];
        case "Gemini 1.5 Pro":
          return [
            "Multimodal Processing: Handles various data types, including text and images.",
            "Long Context Understanding: Maintains coherence over long pieces of content.",
            "Integration with Google Services: Seamlessly works with tools like Google Docs and Sheets.",
            "Advanced Reasoning: Capable of complex problem-solving and analytical tasks."
          ];
        case "Jasper AI":
          return [
            "Content Templates: Offers templates for blogs, ads, emails, and more.",
            "Brand Voice Customization: Maintains consistent tone and style across content.",
            "SEO Integration: Optimizes content for search engines.",
            "Team Collaboration: Enables multiple users to work on content simultaneously."
          ];
        case "Copy.ai":
          return [
            "Automated Copywriting: Generates engaging copy for various platforms.",
            "Multiple Language Support: Creates content in several languages.",
            "Tone Adjustment: Tailors the tone of the content to suit different audiences.",
            "Idea Generation: Provides creative ideas for content topics and angles."
          ];
        case "Writer.com":
          return [
            "Style Guide Enforcement: Ensures adherence to brand-specific writing guidelines.",
            "Terminology Management: Maintains consistent use of industry-specific terms.",
            "Real-Time Suggestions: Offers instant feedback to improve clarity and grammar.",
            "Analytics Dashboard: Tracks writing improvements and consistency over time."
          ];
        case "INK for All":
          return [
            "SEO Score: Provides real-time SEO scoring to optimize content.",
            "AI Writer: Generates content based on user input and keywords.",
            "Readability Enhancements: Suggests improvements for better audience engagement.",
            "Content Planning: Assists in strategizing content topics and calendars."
          ];
        case "Wordtune":
          return [
            "Sentence Rewriting: Offers alternative phrasings for better expression.",
            "Tone Adjustments: Modifies tone to be more formal, casual, or enthusiastic.",
            "Shortening and Expanding: Adjusts sentence length as needed.",
            "Multilingual Support: Provides suggestions in multiple languages."
          ];
        case "Sudowrite":
          return [
            "Story Engine: Helps in plotting and developing narratives.",
            "Character Generator: Assists in creating detailed character profiles.",
            "Sensory Descriptions: Enhances writing with vivid sensory details.",
            "Brainstorming Tools: Offers prompts and ideas to inspire creativity."
          ];
        case "Writesonic":
          return [
            "AI Article Writer: Produces long-form articles based on brief inputs.",
            "Landing Page Generator: Creates persuasive landing page content.",
            "Product Descriptions: Crafts compelling descriptions for e-commerce.",
            "Ad Copy Generator: Develops engaging advertisements for various platforms."
          ];
        case "Anyword":
          return [
            "Predictive Performance Score: Estimates how well content will perform.",
            "Audience Targeting: Tailors messages to specific demographics.",
            "A/B Testing: Compares different versions of copy to determine effectiveness.",
            "Content Personalization: Customizes content to resonate with various audience segments."
          ];
        case "Notion AI":
          return [
            "Content Summarization: Condenses long notes or documents into key points.",
            "Idea Generation: Helps brainstorm topics and outlines.",
            "Writing Assistance: Provides grammar and style suggestions.",
            "Task Automation: Automates repetitive tasks within the Notion workspace."
          ];
        case "Perplexity AI":
          return [
            "Natural Language Processing: Understands and responds to queries in everyday language.",
            "Concise Summaries: Delivers brief and relevant answers.",
            "Source Citations: Provides references for the information presented.",
            "Interactive Q&A: Engages in follow-up questions for deeper understanding."
          ];
        default:
          return genericFeatures;
      }
    case "marketing":
      switch (toolName.toLowerCase()) {
        case "jasper":
          return [
            "Marketing Editor: AI document editor trained exclusively in marketing best practices.",
            "Brand Voice: Configures outputs to adhere to your brand's unique tone and style.",
            "Team Acceleration: AI-native project management for efficient team coordination.",
            "AI-Powered Workflows: Builds AI apps and workflows tied to real business outcomes."
          ]
        case "conversion.ai":
          return [
            "AI Enrichment: Enhances lead data with AI for better personalization.",
            "Magic Segmentation: Automatically segments leads based on behavior.",
            "Real-Time Triggers: Initiates actions based on real-time user behavior.",
            "Content Generation: Generates brand-consistent and personalized content efficiently."
          ]
        case "copysmith":
          return [
            "Bulk Content Generation: Produces product descriptions and other content at scale.",
            "Centralized Content Management: Manages product content from a single platform.",
            "Collaborative Editing: Enables real-time team collaboration on content.",
            "SEO Optimization: Ensures content is optimized for search engines."
          ]
        case "copyscape":
          return [
            "Plagiarism Detection: Scans the web to detect duplicate content.",
            "Premium Services: Offers advanced features like batch search and private index.",
            "API Integration: Allows integration with other platforms for automated checks.",
            "User-Friendly Interface: Simple process to check content originality."
          ]
        case "synthesia":
          return [
            "AI Video Generation: Creates videos from text input using AI avatars.",
            "Multilingual Support: Generates videos in over 140 languages and accents.",
            "Custom Avatars: Allows creation of personalized AI avatars.",
            "Template Library: Provides pre-designed templates for various video types."
          ]
        case "lumen5":
          return [
            "Blog-to-Video Conversion: Transforms blog posts into engaging videos.",
            "AI-Powered Editing: Simplifies video creation with AI assistance.",
            "Customizable Templates: Offers a range of templates for different needs.",
            "User-Friendly Interface: Designed for users without video editing experience."
          ]
        case "jasper art":
          return [
            "Text-to-Image Generation: Creates images from textual descriptions.",
            "Image-to-Image Editing: Modifies existing images using AI.",
            "High-Quality Outputs: Produces visually striking and detailed images.",
            "User-Friendly Interface: Simplifies the process of AI-generated art."
          ]
        case "copy.ai":
          return [
            "AI Content Generation: Produces high-quality content for various platforms.",
            "User-Friendly Tools: Offers intuitive tools for content creation.",
            "Infobase Feature: Stores and tags information for consistent content generation.",
            "Versatile Templates: Provides templates for blogs, social media, and more."
          ]
        case "surfer seo":
          return [
            "Content Optimization: Analyzes content against 500+ on-page signals.",
            "Real-Time Metrics: Provides data-driven recommendations during writing.",
            "Content Score: Evaluates content quality and SEO effectiveness.",
            "Multilingual Support: Optimizes content in various languages."
          ]
        case "writesonic":
          return [
            "AI Writing Tools: Offers over 80 tools for various content needs.",
            "SEO Optimization: Integrates with tools like Ahrefs and Semrush.",
            "Multilingual Support: Supports content creation in 25+ languages.",
            "One-Click WordPress Export: Simplifies publishing to WordPress."
          ]
        case "anyword":
          return [
            "Predictive Performance Scores: Estimates content effectiveness before publishing.",
            "A/B Testing: Tests different content variations for performance.",
            "Brand Voice Control: Maintains consistent messaging across content.",
            "Integration with AI Models: Enhances content generation with data-driven insights."
          ]
        case "mailchimp":
          return [
            "Email Marketing: Creates and manages email campaigns.",
            "Marketing Automation: Automates marketing tasks and workflows.",
            "Audience Management: Organizes and targets audience segments.",
            "Analytics and Reporting: Provides insights into campaign performance."
          ]
        case "activecampaign":
          return [
            "Email Designer: Crafts personalized emails with ease.",
            "Landing Pages: Builds pages to capture leads effectively.",
            "CRM Integration: Manages customer relationships and sales pipelines.",
            "Automation Workflows: Automates marketing and sales processes."
          ]
        case "adobe marketo engage":
          return [
            "Customer Lifecycle Engagement: Manages customer journeys across channels.",
            "Cross-Channel Personalization: Delivers personalized experiences across platforms.",
            "Sales and Marketing Alignment: Integrates sales and marketing efforts.",
            "Marketing Impact Analysis: Measures and optimizes marketing performance."
          ]
        default:
          return genericFeatures
      }
    case "data":
      switch (toolName.toLowerCase()) {
        case "databricks":
          return [
            "Unified Analytics Platform: Combines data engineering, science, and machine learning.",
            "Lakehouse Architecture: Integrates data lakes and warehouses.",
            "Collaborative Notebooks: Enables real-time collaboration on data projects.",
            "Scalable Machine Learning: Supports large-scale ML model training and deployment."
          ]
        case "tableau":
          return [
            "Interactive Dashboards: Creates dynamic visualizations for data exploration.",
            "Data Blending: Combines data from multiple sources.",
            "Real-Time Analysis: Connects to live data for up-to-date insights.",
            "Mobile Accessibility: Accesses dashboards on mobile devices."
          ]
        case "microsoft power bi":
          return [
            "Custom Visualizations: Designs tailored visuals for data representation.",
            "Natural Language Queries: Retrieves data insights using plain language.",
            "Microsoft Integration: Seamlessly connects with other Microsoft tools.",
            "Data Security: Provides robust security features for data protection."
          ]
        case "julius ai":
          return [
            "Automated Data Analysis: Performs complex analyses with minimal input.",
            "Predictive Modeling: Generates forecasts based on data trends.",
            "User-Friendly Interface: Simplifies data tasks for non-technical users.",
            "Custom Reporting: Creates tailored reports for business needs."
          ]
        case "simple analytics":
          return [
            "Privacy-Focused Tracking: Collects analytics without compromising user privacy.",
            "Clean Interface: Provides straightforward dashboards.",
            "No Cookies Required: Operates without cookies for compliance.",
            "Real-Time Data: Offers immediate insights into website traffic."
          ]
        case "akkio":
          return [
            "No-Code AI: Builds AI models without programming knowledge.",
            "Rapid Deployment: Integrates AI models quickly into processes.",
            "Data Visualization: Visualizes data and model outcomes.",
            "Automated Machine Learning: Simplifies model training and evaluation."
          ]
        case "monkeylearn":
          return [
            "No-Code Text Analysis: Enables users to perform sentiment analysis, topic classification, and more without coding.",
            "Custom Model Creation: Allows building tailored machine learning models for specific text analysis needs.",
            "Pre-Trained Models: Offers ready-to-use models for common text analysis tasks.",
            "Scalable Cloud Platform: Processes large volumes of text data efficiently in the cloud."
          ]
        case "sisense":
          return [
            "Embedded Analytics: Integrates dashboards and visualizations directly into applications.",
            "Customizable Dashboards: Provides tools to create tailored data visualizations.",
            "Scalable Architecture: Handles large datasets and complex queries efficiently.",
            "AI-Driven Insights: Utilizes machine learning to uncover patterns and anomalies in data."
          ]
        case "kanaries":
          return [
            "Automated Data Exploration: Discovers patterns and insights in data without manual intervention.",
            "Visualization Recommendations: Suggests the most effective visualizations for data presentation.",
            "Anomaly Detection: Identifies outliers and unusual trends in datasets.",
            "Interactive Reports: Generates reports that allow users to interact with and explore data."
          ]
        default:
          return genericFeatures
      }
    case "image":
      switch (toolName) {
        case "Stable Diffusion":
          return [
            "Text-to-Image Generation: Converts descriptive text prompts into detailed images.",
            "Image-to-Image Translation: Transforms existing images based on new prompts.",
            "Customization: Supports fine-tuning and model training for specific styles.",
            "Community Support: Extensive community with numerous plugins and extensions."
          ];
        case "Adobe Firefly":
          return [
            "Text Effects: Generates stylized text with customizable effects.",
            "Generative Fill: Adds or removes elements from images seamlessly.",
            "Content Authenticity: Provides attribution and transparency for AI-generated content.",
            "Integration: Works seamlessly with Adobe Photoshop and Illustrator."
          ];
        case "Canva AI":
          return [
            "Magic Write: Generates text content for presentations, social media, and more.",
            "Text to Image: Creates images from textual descriptions.",
            "Background Remover: Automatically removes backgrounds from images.",
            "Design Suggestions: Provides AI-driven design recommendations."
          ];
        case "Artbreeder":
          return [
            "Image Blending: Combines images to create new variations.",
            "Gene Editing: Adjusts parameters (genes) to modify image features.",
            "Multiple Categories: Supports portraits, landscapes, and more.",
            "Community Sharing: Users can share and remix each other's creations."
          ];
        case "Lensa AI":
          return [
            "Magic Avatars: Generates artistic renditions of user selfies.",
            "Photo Enhancements: Offers tools for skin retouching and background blurring.",
            "Filters and Effects: Provides a variety of filters for image customization.",
            "User-Friendly Interface: Designed for quick and easy photo editing."
          ];
        case "StarryAI":
          return [
            "Text-to-Image Generation: Creates images from descriptive text.",
            "Style Selection: Offers multiple art styles for customization.",
            "Upscaling: Enhances image resolution.",
            "Ownership Rights: Users have full ownership of generated images."
          ];
        case "Jasper Art":
          return [
            "High-Quality Image Generation: Produces detailed images from text.",
            "Style Variations: Offers different artistic styles.",
            "Integration: Works alongside Jasper's content generation tools.",
            "Commercial Use: Images are suitable for commercial purposes."
          ];
        case "Craiyon":
        case "Craiyon (formerly DALL·E Mini)":
          return [
            "Text-to-Image Generation: Creates images based on user prompts.",
            "Free Access: Available for use without subscription.",
            "Simple Interface: User-friendly design for easy navigation.",
            "Community Sharing: Users can share and explore creations."
          ];
        case "Deep Nostalgia":
          return [
            "Photo Animation: Adds movement to still images.",
            "Facial Expression Simulation: Creates lifelike expressions.",
            "Easy Upload: Simple process to animate photos.",
            "Sharing Options: Allows sharing of animations on social media."
          ];
        case "FaceApp":
          return [
            "Age Transformation: Alters appearance to look older or younger.",
            "Gender Swap: Changes facial features to resemble another gender.",
            "Smile Enhancement: Adds smiles to photos.",
            "Makeup Application: Applies virtual makeup."
          ];
        case "Midjourney":
          return [
            "High-Quality Image Generation: Produces detailed and artistic images.",
            "Community Interaction: Operates via Discord for collaborative creation.",
            "Style Customization: Allows users to define artistic styles.",
            "Fast Processing: Generates images quickly."
          ];
        case "DALL·E":
          return [
            "Text-to-Image Generation: Creates images from descriptive text.",
            "Inpainting: Edits parts of images based on prompts.",
            "Variations: Generates different versions of an image.",
            "High Resolution: Produces high-quality images."
          ];
        case "Canva Magic Design":
          return [
            "Template Suggestions: Provides design templates based on content.",
            "Customization: Allows editing of suggested designs.",
            "Integration: Works within the Canva platform.",
            "Time-Saving: Speeds up the design creation process."
          ];
        case "Leonardo.Ai":
          return [
            "Image Generation: Creates images from text prompts.",
            "Video Creation: Transforms images into videos.",
            "Style Consistency: Maintains consistent styles across projects.",
            "Collaboration: Supports team-based creative processes."
          ];
        case "Recraft":
          return [
            "Vector Generation: Creates scalable vector graphics.",
            "Style Customization: Offers various artistic styles.",
            "Mockup Creation: Generates product mockups.",
            "Background Removal: Automatically removes image backgrounds."
          ];
        case "NightCafe":
          return [
            "Multiple Algorithms: Supports VQGAN+CLIP, CLIP-Guided Diffusion, and more.",
            "Style Transfer: Applies artistic styles to images.",
            "Community Engagement: Users can share and explore artworks.",
            "Print Options: Offers printing of generated artworks."
          ];
        case "Fotor AI":
          return [
            "AI Image Generator: Generates images from text prompts using advanced AI models.",
            "AI Photo Enhancer: Automatically improves brightness, sharpness, and quality.",
            "One-Tap Retouch: Offers beautification tools like blemish removal, skin smoothing, and eye brightening.",
            "Background Remover: Allows instant background deletion or replacement."
          ];
        case "Lexica Art":
          return [
            "Prompt Search Engine: Lets users search a massive gallery of prompts and their corresponding images.",
            "AI Image Generator: Create high-quality images from custom prompts directly on the platform.",
            "Prompt Refinement Tools: Offers guidance on how to write more effective prompts.",
            "Download and Share Options: Users can easily download or share generated images."
          ];
        case "Playground AI":
          return [
            "Text-to-Image Generation: Create visuals from natural language descriptions using models like Stable Diffusion.",
            "Image Inpainting: Edit specific areas of images by masking and prompting.",
            "Styling Tools: Apply filters and pre-defined artistic styles to generated images.",
            "Batch Creation: Generate and manage multiple artworks in one project space."
          ];
        default:
          return [
            "AI-powered image generation.",
            "Text-to-image and style transfer.",
            "Photo editing and enhancement.",
            "Creative design features."
          ];
      }
    case "coding":
      switch (toolName) {
        case "GitHub Copilot":
          return [
            "AI Coding Agent: Performs tasks like bug fixes and feature additions autonomously.",
            "Context-Aware Suggestions: Provides code completions based on the current context.",
            "Pull Request Summaries: Generates summaries for pull requests to aid reviews.",
            "CLI Integration: Offers command-line assistance within the terminal."
          ];
        case "Tabnine":
          return [
            "Real-Time Code Completion: Suggests code as you type across multiple languages.",
            "IDE Chat: Allows natural language interactions for coding assistance.",
            "Privacy-Focused: Offers local models to ensure code privacy.",
            "Customizable Behavior: Tailors suggestions based on user preferences."
          ];
        case "Replit Ghostwriter":
          return [
            "In-Line Code Suggestions: Provides real-time code completions.",
            "Code Explanation: Breaks down code snippets into understandable language.",
            "Code Transformation: Refactors code based on user prompts.",
            "Integrated Search: Finds and imports open-source code directly within the editor."
          ];
        case "DeepCode (Snyk Code)":
          return [
            "AI-Powered Code Review: Analyzes code for potential issues.",
            "Security Autofixes: Automatically suggests fixes for vulnerabilities.",
            "Comprehensive Language Support: Supports over 19 programming languages.",
            "Tech Debt Management: Helps prioritize and manage technical debt."
          ];
        case "CodeT5":
          return [
            "Text-to-Code Generation: Converts natural language descriptions into code.",
            "Code Autocompletion: Predicts and completes code snippets.",
            "Code Summarization: Generates summaries of code functions.",
            "Multi-Language Support: Handles various programming languages."
          ];
        case "ChatCode":
          return [
            "Natural Language Coding: Translates conversational input into code.",
            "Debugging Assistance: Identifies and suggests fixes for code errors.",
            "Code Explanation: Provides insights into code functionality.",
            "Multi-Language Support: Works across different programming languages."
          ];
        case "PyCaret":
          return [
            "Low-Code Machine Learning: Simplifies ML model creation.",
            "Automated Preprocessing: Handles data cleaning and preparation.",
            "Model Comparison: Evaluates multiple models to select the best.",
            "Feature Importance Analysis: Identifies key features impacting the model."
          ];
        case "DataRobot Code":
          return [
            "Automated Machine Learning: Builds and deploys models with minimal coding.",
            "Feature Impact Analysis: Assesses the influence of features on predictions.",
            "Model Deployment: Facilitates easy deployment of models.",
            "Compliance Monitoring: Ensures models meet regulatory standards."
          ];
        case "CodeGen":
          return [
            "Autoregressive Code Generation: Generates code sequences based on input.",
            "Program Synthesis: Creates programs from specifications.",
            "Multi-Language Support: Handles various programming languages.",
            "Integration with Transformers: Utilizes transformer models for code generation."
          ];
        case "Sourcery":
          return [
            "Instant Code Refactoring: Improves code quality automatically.",
            "Bug Detection: Identifies potential issues in code.",
            "Multi-Language Support: Works with over 30 programming languages.",
            "IDE Integration: Seamlessly integrates with popular code editors."
          ];
        case "Kogito":
          return [
            "Cloud-Native Development: Designed for cloud environments.",
            "Business Process Automation: Automates complex workflows.",
            "Integration with Modern Technologies: Works with Quarkus, Knative, and Kafka.",
            "Scalability: Supports scaling in containerized platforms."
          ];
        case "Jina AI":
          return [
            "Multimodal Search: Handles text, image, audio, and video data.",
            "Modular Architecture: Allows for flexible and extensible design.",
            "Flow API: Simplifies building complex AI pipelines.",
            "Scalability: Designed to handle large-scale applications."
          ];
        case "Yellowbrick":
          return [
            "Visual Model Evaluation: Provides visual tools for model assessment.",
            "Feature Importance Visualization: Highlights key features affecting models.",
            "Multi-Model Comparison: Compares performance across different models.",
            "Integration with Scikit-Learn: Works seamlessly with scikit-learn models."
          ];
        case "Semantic Kernel (Microsoft)":
          return [
            "AI Agent Development: Facilitates building AI agents.",
            "Integration with AI Models: Works with latest AI models in C#, Python, or Java.",
            "Plugin Support: Allows encapsulation of APIs for AI use.",
            "Lightweight Framework: Designed for rapid development."
          ];
        case "ML.NET":
          return [
            "Cross-Platform ML: Supports machine learning in .NET applications.",
            "Model Training and Deployment: Enables end-to-end ML workflows.",
            "Integration with .NET Ecosystem: Works with existing .NET libraries.",
            "Support for ONNX: Allows use of pre-trained deep learning models."
          ];
        case "Hugging Face Transformers":
          return [
            "Pre-Trained Models: Offers a wide range of transformer models.",
            "Multi-Task Learning: Supports various NLP tasks.",
            "Easy Integration: Provides simple APIs for model use.",
            "Community Support: Backed by a large developer community."
          ];
        case "Keras Tuner":
          return [
            "Hyperparameter Optimization: Automates tuning of model parameters.",
            "Integration with Keras: Works seamlessly with Keras models.",
            "Multiple Search Algorithms: Supports Random Search, Hyperband, and Bayesian Optimization.",
            "Scalability: Handles large-scale tuning tasks efficiently."
          ];
        case "Cursor":
          return [
            "Code Navigation: Enhances navigation within codebases.",
            "Intelligent Search: Provides smart search capabilities.",
            "Integration with Editors: Works with popular code editors.",
            "Real-Time Collaboration: Supports collaborative coding sessions."
          ];
        case "Codiga":
          return [
            "Real-Time Static Code Analysis: Instantly detects bugs, code smells, and security issues directly in your IDE.",
            "Smart Code Snippets Manager: Allows developers to create, reuse, and share code snippets to boost coding efficiency.",
            "Automated Code Reviews: Analyzes pull requests and provides actionable feedback with GitHub, GitLab, and Bitbucket integrations.",
            "Custom Rule Sets: Enables teams to enforce coding standards with tailored rules and gain insights via quality dashboards."
          ];
        case "Amazon CodeWhisperer":
          return [
            "AI-Powered Code Suggestions: Provides real-time code recommendations.",
            "Security Scanning: Identifies and suggests fixes for security issues.",
            "Multi-Language Support: Works with various programming languages.",
            "Integration with AWS Services: Seamlessly connects with AWS tools."
          ];
        case "Codeium":
          return [
            "AI Code Completion: Offers intelligent code suggestions.",
            "Multi-Language Support: Handles numerous programming languages.",
            "IDE Integration: Works within popular development environments.",
            "Privacy-Focused: Ensures user code remains confidential."
          ];
        default:
          return [
            "AI-powered coding features.",
            "Code completion and suggestions.",
            "Bug detection and refactoring.",
            "Productivity enhancements."
          ];
      }
    case "audio":
      switch (toolName) {
        case "ElevenLabs":
          return [
            "High-Fidelity Text-to-Speech: Generates lifelike speech with nuanced control over pitch, speed, and emotion.",
            "Voice Cloning: Accurately replicates voices from short audio samples.",
            "Multilingual Support: Supports 29 languages for diverse applications.",
            "Real-Time Streaming: Offers low-latency voice synthesis suitable for live applications."
          ];
        case "Murf.ai":
          return [
            "Extensive Voice Library: Provides over 200 realistic voices across 20+ languages.",
            "Voice Cloning: Allows creation of custom voices for personalized content.",
            "Voice Changer: Transforms recorded voices into different AI-generated voices.",
            "API Integration: Enables seamless incorporation into various platforms and tools."
          ];
        case "Lovo":
          return [
            "Natural-Sounding Voices: Delivers high-quality voiceovers with human-like intonation.",
            "Voice Cloning: Enables users to create custom voices from audio samples.",
            "Emotional Control: Adjusts tone, pitch, and speed to convey different emotions.",
            "Multilingual Support: Offers voices in multiple languages for global reach."
          ];
        case "Voice.ai":
          return [
            "Real-Time Voice Changing: Modifies voices live during calls or recordings.",
            "Wide Compatibility: Integrates with platforms like Discord, Zoom, and Skype.",
            "Custom Voice Creation: Allows users to design unique voice profiles.",
            "Voice Cloning: Replicates voices from provided audio samples."
          ];
        case "Uberduck":
          return [
            "Text-to-Speech: Converts written text into spoken words using AI voices.",
            "Voice Cloning: Creates custom voices for personalized content.",
            "Singing & Rapping Synthesis: Generates musical vocals from text inputs.",
            "API Access: Provides developers with tools to integrate voice features into applications."
          ];
        case "Descript":
          return [
            "Overdub: Allows users to create and edit voiceovers using AI-generated voices.",
            "Multitrack Editing: Supports editing of multiple audio and video tracks simultaneously.",
            "Screen Recording: Captures screen activity with integrated editing tools.",
            "Transcription: Automatically transcribes audio and video content for easy editing."
          ];
        case "Adobe Podcast Enhance":
          return [
            "Speech Enhancement: Improves audio quality by reducing background noise and echo.",
            "Web-Based Recording: Allows recording directly from the browser without additional software.",
            "Transcription: Converts speech into text for easy editing and reference.",
            "Mic Check: Analyzes microphone setup to ensure optimal recording quality."
          ];
        case "Krisp":
          return [
            "Noise Cancellation: Removes background noise from calls and recordings in real-time.",
            "Echo Removal: Eliminates echo for clearer audio communication.",
            "Voice Cancellation: Filters out other voices in the background.",
            "Integration: Works with various communication apps like Zoom, Skype, and Slack."
          ];
        case "Auphonic":
          return [
            "Intelligent Leveler: Balances audio levels between speakers, music, and sound effects.",
            "Noise & Hum Reduction: Cleans up audio by removing unwanted noise and hum.",
            "Loudness Normalization: Ensures consistent volume levels across audio files.",
            "Multi-Format Output: Exports audio in various formats for different platforms."
          ];
        case "iZotope Cascadia":
          return [
            "Tape Delay Emulation: Simulates classic tape delay effects for audio processing.",
            "Auto-Ducking: Automatically reduces the volume of background tracks during voiceovers.",
            "Modulation Effects: Adds depth and movement to audio through modulation.",
            "Preset Library: Offers a range of presets for quick audio enhancement."
          ];
        case "AIVA":
          return [
            "AI Music Composition: Generates original music compositions in various styles.",
            "Customizable Styles: Allows users to define specific musical styles and moods.",
            "MIDI Export: Provides compositions in MIDI format for further editing.",
            "Collaborative Tools: Enables collaboration between users on musical projects."
          ];
        case "WavTool":
          return [
            "AI-Powered Conductor: Assists in music creation by generating audio and MIDI.",
            "Browser-Based DAW: Offers a digital audio workstation accessible through web browsers.",
            "Plugin Support: Compatible with VST and AU plugins for extended functionality.",
            "Cloud Saving: Stores projects in the cloud for easy access and collaboration."
          ];
        case "Suno":
          return [
            "AI Music Generation: Creates full songs based on user inputs like style and lyrics.",
            "Real-Time Collaboration: Allows users to collaborate on music projects via platforms like Discord.",
            "User-Friendly Interface: Designed for ease of use, making music creation accessible to all.",
            "Freemium Model: Offers a free tier with daily song generation limits."
          ];
        case "Whisper":
          return [
            "Multilingual Transcription: Transcribes speech in multiple languages with high accuracy.",
            "Translation: Translates speech from various languages into English.",
            "Robustness: Handles accents, background noise, and technical language effectively.",
            "Open Source: Available for public use and customization."
          ];
        case "Podcastle":
          return [
            "Text-to-Speech Conversion: Transforms written content into audio format.",
            "Audio & Video Recording: Supports recording of both audio and video for podcasts.",
            "Editing Tools: Provides tools for editing and enhancing recordings.",
            "Voice Cloning: Allows creation of custom AI voices for content."
          ];
        default:
          return [
            "AI-powered audio features.",
            "Voice synthesis and editing.",
            "Noise reduction and enhancement.",
            "Music and podcast tools."
          ];
      }
    case "video":
      switch (toolName) {
        case "Pictory":
          return [
            "Script to Video: Convert scripts into engaging videos with AI-selected visuals and music.",
            "Blog to Video: Transform blog posts into shareable video content.",
            "Auto Captioning: Automatically generate and synchronize captions.",
            "Video Summarization: Create concise highlights from longer videos."
          ];
        case "Fliki":
          return [
            "Text-to-Video: Turn text into videos with realistic AI voices and avatars.",
            "YouTube Shorts Generator: Produce short videos optimized for YouTube.",
            "Voice Cloning: Create custom AI voices from samples.",
            "Web Research Integration: Fetch up-to-date information during content creation."
          ];
        case "CapCut":
          return [
            "AI Video Editing: Automate editing tasks like trimming and transitions.",
            "Text-to-Speech: Convert written content into spoken audio.",
            "Auto Captions: Generate captions automatically for videos.",
            "Background Music Generation: Add AI-generated music to videos."
          ];
        case "Lumen5":
          return [
            "Blog to Video: Convert blog posts into engaging videos.",
            "AI Voiceovers: Add voice narration with AI-generated voices.",
            "Drag-and-Drop Interface: Simplify video creation with an intuitive editor.",
            "Branded Templates: Maintain brand consistency with customizable templates."
          ];
        case "VEED.io":
          return [
            "AI Script Generator: Create video scripts using AI assistance.",
            "Auto Subtitles: Automatically add subtitles to videos.",
            "Background Noise Removal: Enhance audio by eliminating background sounds.",
            "AI Avatars: Use digital avatars for video presentations."
          ];
        case "Wisecut":
          return [
            "Automatic Silence Removal: Detect and cut silent pauses in videos.",
            "Storyboard-Based Editing: Edit videos by rearranging text-based storyboards.",
            "Auto Subtitles: Generate subtitles automatically.",
            "Smart Background Music: Add music that adapts to the video's tone."
          ];
        case "Animoto":
          return [
            "Drag-and-Drop Editing: Easily create videos with a user-friendly interface.",
            "Custom Branding: Add logos, colors, and fonts to maintain brand identity.",
            "Music Library: Access a vast collection of licensed music tracks.",
            "AI Script Generator: Generate video scripts with AI assistance."
          ];
        case "Colossyan":
          return [
            "AI Avatars: Create videos with realistic digital presenters.",
            "Multilingual Support: Produce content in multiple languages.",
            "Easy Editing: Simplify video creation with intuitive tools.",
            "Customizable Templates: Use templates tailored for various themes and purposes."
          ];
        case "Magisto":
          return [
            "AI-Powered Editing: Automatically edit videos with AI assistance.",
            "Smart Storytelling: Enhance narratives through intelligent editing.",
            "Music Synchronization: Align music with video transitions seamlessly.",
            "Custom Branding: Incorporate brand elements into videos."
          ];
        case "HeyGen":
          return [
            "AI Avatars: Generate videos featuring AI-driven digital avatars.",
            "Voice Cloning: Create personalized AI voices.",
            "Video Translation: Translate videos into multiple languages.",
            "Face Swap: Replace faces in videos with AI-generated alternatives."
          ];
        default:
          return [
            "AI-powered video features.",
            "Text-to-video and editing.",
            "Voiceovers and avatars.",
            "Templates and automation."
          ];
      }
    case "design":
      switch (toolName) {
        case "Adobe Firefly":
          return [
            "Image & Video Generation: Create high-quality images and videos from text prompts.",
            "Firefly Boards: Collaborative canvas for ideation and content creation.",
            "Third-Party Model Integration: Supports models like OpenAI's GPT and Google's Imagen.",
            "Mobile App: Leverages device-specific capabilities for on-the-go creativity."
          ];
        case "Canva AI":
          return [
            "Magic Design: Generates design suggestions based on user inputs.",
            "AI-Powered Writing Help: Assists in content creation with tone and style adjustments.",
            "Text to Image: Transforms text prompts into images instantly.",
            "Multimodal Input: Supports various input types for diverse design needs."
          ];
        case "Figma AI":
          return [
            "AI-Powered Text Tools: Translate, shorten, or rewrite text with a click.",
            "Realistic Content Generation: Generate realistic copy and images to enhance designs.",
            "Streamlined Workflows: Automate repetitive tasks to focus on creativity.",
            "Integrated AI Tools: Access AI features directly within the design toolbar."
          ];
        case "Uizard":
          return [
            "Autodesigner: Generates UI designs from text prompts.",
            "Screenshot Scanner: Converts screenshots into editable mockups.",
            "Wireframe Scanner: Transforms hand-drawn wireframes into digital designs.",
            "Focus Predictor: Predicts attention heatmaps for UI elements."
          ];
        case "Looka":
          return [
            "AI-Powered Logo Maker: Creates logos based on user preferences.",
            "Brand Kit Generator: Develops a complete brand identity package.",
            "AI Website Builder: Designs websites aligned with your brand.",
            "User-Friendly Interface: Simplifies the design process with intuitive tools."
          ];
        case "Designify":
          return [
            "AI-Powered Designs: Automatically removes backgrounds and enhances images.",
            "Logo Generation: Creates logos tailored to your brand.",
            "Batch Processing: Edits multiple images simultaneously.",
            "Customizable Templates: Offers a variety of design templates for different needs."
          ];
        case "V0 by Vercel":
          return [
            "Text-Based Design Generation: Creates UI components from text prompts.",
            "Responsive Layout Adaptation: Ensures designs are mobile-friendly.",
            "Interactive Element Integration: Adds interactive features to designs.",
            "User Profile Linkage: Connects designs to user profiles for personalization."
          ];
        case "Let's Enhance":
          return [
            "AI Image Upscaling: Increases image resolution without quality loss.",
            "Color and Light Enhancement: Automatically adjusts color balance and lighting.",
            "Sharpness Improvement: Enhances image clarity and reduces blurriness.",
            "Batch Processing: Edits multiple images at once for streamlined workflows."
          ];
        case "Runway ML":
          return [
            "Video Generation: Creates videos from text prompts or existing images.",
            "Real-Time Collaboration: Allows multiple users to work on projects simultaneously.",
            "Comprehensive Editing Tools: Provides tools for video, image, and audio editing.",
            "AI-Powered Features: Utilizes AI for tasks like background removal and color grading."
          ];
        case "Khroma":
          return [
            "Personalized Color Palettes: Generates color combinations based on user preferences.",
            "AI Learning: Learns which colors you like to provide tailored suggestions.",
            "Search and Filter: Allows discovery of palettes by hue, tint, and more.",
            "Save and Export: Enables saving and exporting of favorite palettes."
          ];
        default:
          return [
            "AI-powered design features.",
            "Image and color enhancement.",
            "Logo and branding tools.",
            "Templates and automation."
          ];
      }
    default:
      return genericFeatures;
  }
}

export default function ToolPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const tool = mockTools.find((t) => t.id === id);
  const [tab, setTab] = useState<'overview' | 'features' | 'reviews'>('overview');

  if (!tool) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-gray-600 mb-6">Sorry, we couldn't find the tool you're looking for.</p>
        <Link href="/tools" className="text-purple-600 hover:text-purple-800 font-medium">← Back to All Tools</Link>
      </div>
    );
  }

  // Related tools: same first category, exclude self
  const relatedTools = mockTools.filter(
    t => t.id !== tool.id && t.categories[0] === tool.categories[0]
  ).slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
        <button onClick={() => window.history.back()} className="text-xs text-gray-500 hover:text-gray-700 mb-4 inline-block">← Back</button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              <div className="flex gap-2">
            <Link href={tool.url} target="_blank" className="px-4 py-1 rounded bg-purple-500 text-white font-semibold hover:bg-purple-600 flex items-center gap-1 text-sm">
              Visit Website <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
              </div>
            </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {tool.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="capitalize text-xs">{cat}</Badge>
              ))}
            </div>
        <div className="flex items-center gap-2 text-sm mb-6">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-700">{tool.rating.toFixed(1)}</span>
          <span className="text-gray-400">({tool.visits.toLocaleString()} visits)</span>
          <span className="text-gray-400">Added {new Date(tool.dateAdded).toLocaleDateString()}</span>
          <span className="text-gray-400">Pricing: <span className="font-semibold text-gray-700">{tool.isPremium || 'Unknown'}</span></span>
              </div>
        <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden" style={{ minHeight: 340 }}>
          <Image src={tool.image} alt={tool.name} fill className="object-contain" />
            </div>
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 flex gap-2">
          <button onClick={() => setTab('overview')} className={`px-4 py-2 font-semibold ${tab === 'overview' ? 'border-b-2 border-purple-600 text-purple-700 bg-white' : 'text-gray-500'}`}>Overview</button>
          <button onClick={() => setTab('features')} className={`px-4 py-2 font-semibold ${tab === 'features' ? 'border-b-2 border-purple-600 text-purple-700 bg-white' : 'text-gray-500'}`}>Features</button>
          <button onClick={() => setTab('reviews')} className={`px-4 py-2 font-semibold ${tab === 'reviews' ? 'border-b-2 border-purple-600 text-purple-700 bg-white' : 'text-gray-500'}`}>Reviews</button>
          </div>
        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">About {tool.name}</h2>
            <p className="text-gray-700 mb-2">{tool.description}</p>
            <p className="text-gray-700 mb-2">
              <b>Categories:</b> {tool.categories.map(capitalizeWords).join(", ")}
            </p>
            {tool.tags && tool.tags.length > 0 && (
              <p className="text-gray-700 mb-2">
                <b>Key Capabilities:</b> {tool.tags.map(capitalizeWords).join(", ")}
              </p>
            )}
            <p className="text-gray-700">
              {tool.name} is designed to help users in the {tool.categories.map(capitalizeWords).join(", ")} space. Whether you're a professional or a beginner, this tool offers features like {tool.tags && tool.tags.length > 0 ? tool.tags.map(capitalizeWords).slice(0, 3).join(", ") : "advanced AI capabilities"} to streamline your workflow and boost productivity. Explore its unique features and see how it can fit your needs!
            </p>
          </div>
        )}
        {tab === 'features' && (
          <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Key Features</h2>
            {tool ? (
              <ul className="space-y-4">
                {getToolFeatures(tool.categories[0], tool.name).map((feature, idx) => {
                  const [title, ...descriptionParts] = feature.split(':');
                  const description = descriptionParts.join(':').trim();
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <ThumbsUp className="mt-1 text-purple-500" />
                    <div>
                        <div className="font-bold text-base text-gray-900">{title}</div>
                        <div className="text-gray-600 text-sm mt-1">{description}</div>
                    </div>
                  </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No features listed for this tool.</p>
            )}
              </div>
        )}
        {tab === 'reviews' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Reviews</h2>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center text-gray-500">
              No reviews yet. <br /> <span className="text-purple-600 font-medium cursor-pointer">Be the first to add a review!</span>
                          </div>
                        </div>
        )}
                      </div>
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8 sticky top-24 z-10">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
          <div className="flex flex-col gap-3 text-sm mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium">{tool.categories.map(capitalizeWords).join(", ")}</span>
                    </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Rating:</span>
              <span className="flex items-center gap-1 font-medium">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {tool.rating.toFixed(1)}/5
              </span>
                  </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Pricing:</span>
              <span className="font-medium">{tool.pricing?.type || tool.isPremium || 'Unknown'}</span>
              </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Added:</span>
              <span>{new Date(tool.dateAdded).toLocaleDateString()}</span>
        </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Visits:</span>
              <span>{tool.visits.toLocaleString()}</span>
                </div>
            {tool.tags && tool.tags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-gray-500">Key Features:</span>
                <div className="flex flex-wrap gap-1">
                  {tool.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {capitalizeWords(tag)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href={tool.url} target="_blank" className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
            Visit Website <ExternalLink className="inline w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Related Tools</h3>
          <div className="flex flex-col gap-4">
            {relatedTools.length === 0 && <div className="text-gray-500 text-sm">No related tools found.</div>}
            {relatedTools.map((rel) => (
              <ToolCard key={rel.id} tool={rel} />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

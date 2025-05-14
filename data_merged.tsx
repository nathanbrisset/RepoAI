import React from 'react';
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
export const tools: Tool[] = [
  {
    name: 'OpenAI Jukebox',
    description: 'AI music generator capable of creating songs in various genres.',
    url: 'https://openai.com/research/jukebox',
    id: 'openai-jukebox',
    image: '/tool-screenshots/openai-jukebox.png',
    logo: '/logo/openai-jukebox.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-generation',
    tags: [
      'AI',
      'music',
      'singing'
    ],
    rating: '4.2',
    visits: '1',
    dateAdded: '2030-07-15',
    isPremium: 'Free'
  },
  {
    name: 'VocaliD',
    description: 'AI voice customization and branding platform.',
    url: 'https://www.vocalid.ai',
    id: 'vocalid',
    image: '/tool-screenshots/vocalid.png',
    logo: '/logo/vocalid.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-customization',
    tags: [
      'AI',
      'voice',
      'branding'
    ],
    rating: '4.3',
    visits: '1',
    dateAdded: '2030-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Altered Studio',
    description: 'Voice transformation and synthesis platform.',
    url: 'https://www.altered.ai',
    id: 'altered-studio',
    image: '/tool-screenshots/altered-studio.png',
    logo: '/logo/altered-studio.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-transformation',
    tags: [
      'AI',
      'voice',
      'transformation'
    ],
    rating: '4.0',
    visits: '1',
    dateAdded: '2030-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Respeecher',
    description: 'AI voice cloning platform for media and entertainment.',
    url: 'https://www.respeecher.com',
    id: 'respeecher',
    image: '/tool-screenshots/respeecher.png',
    logo: '/logo/respeecher.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-cloning',
    tags: [
      'AI',
      'voice cloning',
      'media'
    ],
    rating: '4.1',
    visits: '1',
    dateAdded: '2030-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Cymatics Labs + AI Tools',
    description: 'AI-assisted sound design and music production platform.',
    url: 'https://cymatics.fm',
    id: 'cymatics-labs',
    image: '/tool-screenshots/cymatics-labs.png',
    logo: '/logo/cymatics-labs.png',
    categories: [
      'audio'
    ],
    subcategory: 'sound-design',
    tags: [
      'AI',
      'sound design',
      'music'
    ],
    rating: '4.2',
    visits: '1',
    dateAdded: '2029-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Soundful',
    description: 'AI music creation platform for content creators.',
    url: 'https://soundful.com',
    id: 'soundful',
    image: '/tool-screenshots/soundful.png',
    logo: '/logo/soundful.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-creation',
    tags: [
      'AI',
      'music',
      'content'
    ],
    rating: '4.3',
    visits: '1',
    dateAdded: '2029-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Epidemic Sound + AI',
    description: 'AI-enhanced royalty-free music platform.',
    url: 'https://www.epidemicsound.com',
    id: 'epidemic-sound-ai',
    image: '/tool-screenshots/epidemic-sound-ai.png',
    logo: '/logo/epidemic-sound-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-library',
    tags: [
      'AI',
      'royalty-free',
      'music'
    ],
    rating: '4.4',
    visits: '1',
    dateAdded: '2029-07-15',
    isPremium: 'Free'
  },
  {
    name: 'AI Duet',
    description: 'Interactive AI music instrument and performance tool.',
    url: 'https://experiments.withgoogle.com/ai-duet',
    id: 'ai-duet',
    image: '/tool-screenshots/ai-duet.png',
    logo: '/logo/ai-duet.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-interaction',
    tags: [
      'AI',
      'music',
      'interaction'
    ],
    rating: '4.0',
    visits: '2',
    dateAdded: '2029-05-15',
    isPremium: 'Free'
  },
  {
    name: 'VideoRemix',
    description: 'AI personalization and editing platform for videos.',
    url: 'https://videoremix.ai',
    id: 'videoremix',
    image: '/tool-screenshots/videoremix.png',
    logo: '/logo/videoremix.png',
    categories: [
      'video'
    ],
    subcategory: 'video-personalization',
    tags: [
      'AI',
      'personalization',
      'editing'
    ],
    rating: '4.0',
    visits: '2',
    dateAdded: '2029-05-15',
    isPremium: 'Free'
  },
  {
    name: 'AImusic',
    description: 'AI-powered custom soundscapes and music generation platform.',
    url: 'https://aimusic.com',
    id: 'aimusic',
    image: '/tool-screenshots/aimusic.png',
    logo: '/logo/aimusic.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-generation',
    tags: [
      'AI',
      'soundscapes',
      'ambient'
    ],
    rating: '4.1',
    visits: '3',
    dateAdded: '2029-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Veed Flex',
    description: 'AI automated video subtitling and translation platform.',
    url: 'https://www.veed.io/flex',
    id: 'veed-flex',
    image: '/tool-screenshots/veed-flex.png',
    logo: '/logo/veed-flex.png',
    categories: [
      'video'
    ],
    subcategory: 'video-translation',
    tags: [
      'AI',
      'subtitles',
      'translation'
    ],
    rating: '4.1',
    visits: '4',
    dateAdded: '2029-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Boomy',
    description: 'Platform for creating and releasing AI-generated music.',
    url: 'https://boomy.com',
    id: 'boomy',
    image: '/tool-screenshots/boomy.png',
    logo: '/logo/boomy.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-creation',
    tags: [
      'AI',
      'music',
      'create & distribute'
    ],
    rating: '4.2',
    visits: '4',
    dateAdded: '2029-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Synthesys X',
    description: 'Advanced video synthesis and narration models platform.',
    url: 'https://synthesys.io/x',
    id: 'synthesys-x',
    image: '/tool-screenshots/synthesys-x.png',
    logo: '/logo/synthesys-x.png',
    categories: [
      'video'
    ],
    subcategory: 'video-synthesis',
    tags: [
      'AI',
      'narration',
      'synthesis'
    ],
    rating: '4.2',
    visits: '6',
    dateAdded: '2029-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Coda AI',
    description: 'AI-powered document and workflow automation platform.',
    url: 'https://coda.io/ai',
    id: 'coda-ai',
    image: '/tool-screenshots/coda-ai.png',
    logo: '/logo/coda-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'document-automation',
    tags: [
      'AI',
      'documents',
      'automation'
    ],
    rating: '4.3',
    visits: '70',
    dateAdded: '2029-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Ecrett Music',
    description: 'AI music creation tool for content creators.',
    url: 'https://ecrettmusic.com',
    id: 'ecrett-music',
    image: '/tool-screenshots/ecrett-music.png',
    logo: '/logo/ecrett-music.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-creation',
    tags: [
      'AI',
      'music',
      'soundtrack'
    ],
    rating: '4.3',
    visits: '6',
    dateAdded: '2028-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Viddyoze',
    description: 'AI-powered professional video effects platform.',
    url: 'https://viddyoze.com',
    id: 'viddyoze',
    image: '/tool-screenshots/viddyoze.png',
    logo: '/logo/viddyoze.png',
    categories: [
      'video'
    ],
    subcategory: 'video-effects',
    tags: [
      'AI',
      'effects',
      'branding'
    ],
    rating: '4.3',
    visits: '8',
    dateAdded: '2028-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Superhuman',
    description: 'AI-enhanced email productivity and workflow platform.',
    url: 'https://superhuman.com',
    id: 'superhuman',
    image: '/tool-screenshots/superhuman.png',
    logo: '/logo/superhuman.png',
    categories: [
      'productivity'
    ],
    subcategory: 'email-productivity',
    tags: [
      'AI',
      'email',
      'workflow'
    ],
    rating: '4.4',
    visits: '80',
    dateAdded: '2028-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Soundraw',
    description: 'AI music generator for video content.',
    url: 'https://soundraw.io',
    id: 'soundraw',
    image: '/tool-screenshots/soundraw.png',
    logo: '/logo/soundraw.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-generation',
    tags: [
      'AI',
      'music',
      'video soundtrack'
    ],
    rating: '4.0',
    visits: '8',
    dateAdded: '2028-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Realiteer',
    description: 'Immersive AI-driven 3D and VR video experiences platform.',
    url: 'https://realiteer.com',
    id: 'realiteer',
    image: '/tool-screenshots/realiteer.png',
    logo: '/logo/realiteer.png',
    categories: [
      'video'
    ],
    subcategory: 'vr-experiences',
    tags: [
      'AI',
      '3D',
      'VR'
    ],
    rating: '4.4',
    visits: '10',
    dateAdded: '2028-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Timely',
    description: 'AI-powered automatic time tracking and productivity analytics.',
    url: 'https://timelyapp.com',
    id: 'timely',
    image: '/tool-screenshots/timely.png',
    logo: '/logo/timely.png',
    categories: [
      'productivity'
    ],
    subcategory: 'time-tracking',
    tags: [
      'AI',
      'time tracking',
      'analytics'
    ],
    rating: '4.0',
    visits: '90',
    dateAdded: '2028-09-15',
    isPremium: 'Free'
  },
  {
    name: 'HumTap',
    description: 'AI-driven music and sound effects platform.',
    url: 'https://humtap.com',
    id: 'humtap',
    image: '/tool-screenshots/humtap.png',
    logo: '/logo/humtap.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-creation',
    tags: [
      'AI',
      'music',
      'sound effects'
    ],
    rating: '4.1',
    visits: '10',
    dateAdded: '2028-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Velodyne Labs',
    description: 'AI video analysis and surveillance platform.',
    url: 'https://velodynelabs.com',
    id: 'velodyne-labs',
    image: '/tool-screenshots/velodyne-labs.png',
    logo: '/logo/velodyne-labs.png',
    categories: [
      'video'
    ],
    subcategory: 'video-analysis',
    tags: [
      'AI',
      'security',
      'surveillance'
    ],
    rating: '4.0',
    visits: '15',
    dateAdded: '2028-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Magic AI',
    description: 'AI personal assistant for productivity and task management.',
    url: 'https://magic.ai',
    id: 'magic-ai',
    image: '/tool-screenshots/magic-ai.png',
    logo: '/logo/magic-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'personal-assistant',
    tags: [
      'AI',
      'assistant',
      'productivity'
    ],
    rating: '4.1',
    visits: '100',
    dateAdded: '2028-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Designify',
    description: 'AI-enhanced product videos and visuals platform.',
    url: 'https://designify.com',
    id: 'designify',
    image: '/tool-screenshots/designify.png',
    logo: '/logo/designify.png',
    categories: [
      'video'
    ],
    subcategory: 'product-videos',
    tags: [
      'AI',
      'product',
      'visuals'
    ],
    rating: '4.1',
    visits: '20',
    dateAdded: '2028-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Endlesss',
    description: 'Collaborative AI music-making platform.',
    url: 'https://endlesss.fm',
    id: 'endlesss',
    image: '/tool-screenshots/endlesss.png',
    logo: '/logo/endlesss.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-collaboration',
    tags: [
      'AI',
      'collaboration',
      'music'
    ],
    rating: '4.2',
    visits: '15',
    dateAdded: '2028-05-15',
    isPremium: 'Free'
  },
  {
    name: 'ClickUp AI',
    description: 'AI-enhanced project management and task automation.',
    url: 'https://clickup.com',
    id: 'clickup-ai',
    image: '/tool-screenshots/clickup-ai.png',
    logo: '/logo/clickup-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'project-management',
    tags: [
      'AI',
      'project management',
      'tasks'
    ],
    rating: '4.2',
    visits: '150',
    dateAdded: '2028-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Jukedeck',
    description: 'AI-generated music tracks platform.',
    url: 'https://www.jukedeck.com',
    id: 'jukedeck',
    image: '/tool-screenshots/jukedeck.png',
    logo: '/logo/jukedeck.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-generation',
    tags: [
      'AI',
      'music',
      'generation'
    ],
    rating: '4.3',
    visits: '20',
    dateAdded: '2028-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Wibbitz',
    description: 'AI video creation for news and marketing platform.',
    url: 'https://wibbitz.com',
    id: 'wibbitz',
    image: '/tool-screenshots/wibbitz.png',
    logo: '/logo/wibbitz.png',
    categories: [
      'video'
    ],
    subcategory: 'news-videos',
    tags: [
      'AI',
      'media',
      'automation'
    ],
    rating: '4.2',
    visits: '30',
    dateAdded: '2028-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Compose AI',
    description: 'AI-powered email and document composition assistant.',
    url: 'https://compose.ai',
    id: 'compose-ai',
    image: '/tool-screenshots/compose-ai.png',
    logo: '/logo/compose-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'email-composition',
    tags: [
      'AI',
      'email',
      'documents'
    ],
    rating: '4.3',
    visits: '200',
    dateAdded: '2028-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Amper Music',
    description: 'Automated music creation platform for media content.',
    url: 'https://www.ampermusic.com',
    id: 'amper-music',
    image: '/tool-screenshots/amper-music.png',
    logo: '/logo/amper-music.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-creation',
    tags: [
      'AI',
      'music',
      'content'
    ],
    rating: '4.4',
    visits: '30',
    dateAdded: '2028-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Synthesia Studio',
    description: 'Enterprise-grade avatar and video synthesis platform.',
    url: 'https://www.synthesia.io/studio',
    id: 'synthesia-studio',
    image: '/tool-screenshots/synthesia-studio.png',
    logo: '/logo/synthesia-studio.png',
    categories: [
      'video'
    ],
    subcategory: 'enterprise-avatars',
    tags: [
      'AI',
      'enterprise',
      'avatars'
    ],
    rating: '4.3',
    visits: '40',
    dateAdded: '2028-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Grammarly',
    description: 'AI writing assistant for grammar and style improvement.',
    url: 'https://grammarly.com',
    id: 'grammarly',
    image: '/tool-screenshots/grammarly.png',
    logo: '/logo/grammarly.png',
    categories: [
      'productivity'
    ],
    subcategory: 'writing-assistant',
    tags: [
      'AI',
      'grammar',
      'writing'
    ],
    rating: '4.4',
    visits: '300',
    dateAdded: '2028-01-15',
    isPremium: 'Free'
  },
  {
    name: 'AIVA',
    description: 'AI music composition platform for soundtracks.',
    url: 'https://www.aiva.ai',
    id: 'aiva',
    image: '/tool-screenshots/aiva.png',
    logo: '/logo/aiva.png',
    categories: [
      'audio'
    ],
    subcategory: 'music-composition',
    tags: [
      'AI',
      'music',
      'soundtrack'
    ],
    rating: '4.0',
    visits: '40',
    dateAdded: '2027-11-15',
    isPremium: 'Free'
  },
  {
    name: 'DeepBrain AI',
    description: 'Customized AI virtual news anchors and hosts platform.',
    url: 'https://www.deepbrain.io/news',
    id: 'deepbrain-ai-news',
    image: '/tool-screenshots/deepbrain-ai-news.png',
    logo: '/logo/deepbrain-ai-news.png',
    categories: [
      'video'
    ],
    subcategory: 'news-anchors',
    tags: [
      'AI',
      'news',
      'virtual hosts'
    ],
    rating: '4.0',
    visits: '60',
    dateAdded: '2027-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Fireflies.ai',
    description: 'AI meeting transcription and note-taking assistant.',
    url: 'https://fireflies.ai',
    id: 'fireflies-ai',
    image: '/tool-screenshots/fireflies-ai.png',
    logo: '/logo/fireflies-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'meeting-transcription',
    tags: [
      'AI',
      'transcription',
      'meetings'
    ],
    rating: '4.0',
    visits: '400',
    dateAdded: '2027-11-15',
    isPremium: 'Free'
  },
  {
    name: 'PhonicMind',
    description: 'AI audio stem separation and remixing platform.',
    url: 'https://phonicmind.com',
    id: 'phonicmind',
    image: '/tool-screenshots/phonicmind.png',
    logo: '/logo/phonicmind.png',
    categories: [
      'audio'
    ],
    subcategory: 'stem-separation',
    tags: [
      'AI',
      'audio',
      'remixing'
    ],
    rating: '4.1',
    visits: '60',
    dateAdded: '2027-09-15',
    isPremium: 'Free'
  },
  {
    name: 'D-ID Live',
    description: 'AI-powered video communication and virtual personas platform.',
    url: 'https://www.d-id.com/live',
    id: 'd-id-live',
    image: '/tool-screenshots/d-id-live.png',
    logo: '/logo/d-id-live.png',
    categories: [
      'video'
    ],
    subcategory: 'live-communication',
    tags: [
      'AI',
      'live',
      'virtual'
    ],
    rating: '4.1',
    visits: '80',
    dateAdded: '2027-09-15',
    isPremium: 'Free'
  },
  {
    name: 'LALAL.AI',
    description: 'AI-powered vocal extraction and stem separation platform.',
    url: 'https://www.lalal.ai',
    id: 'lalal-ai',
    image: '/tool-screenshots/lalal-ai.png',
    logo: '/logo/lalal-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'vocal-extraction',
    tags: [
      'AI',
      'vocal extraction'
    ],
    rating: '4.2',
    visits: '80',
    dateAdded: '2027-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Reface Video',
    description: 'Deepfake and face swap videos using AI platform.',
    url: 'https://reface.app',
    id: 'reface-video',
    image: '/tool-screenshots/reface-video.png',
    logo: '/logo/reface-video.png',
    categories: [
      'video'
    ],
    subcategory: 'deepfake',
    tags: [
      'AI',
      'deepfake',
      'face swap'
    ],
    rating: '4.2',
    visits: '100',
    dateAdded: '2027-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Designs.ai Videomaker',
    description: 'AI-driven branding videos platform.',
    url: 'https://designs.ai/videomaker',
    id: 'designs-ai-videomaker',
    image: '/tool-screenshots/designs-ai-videomaker.png',
    logo: '/logo/designs-ai-videomaker.png',
    categories: [
      'video'
    ],
    subcategory: 'branding-videos',
    tags: [
      'AI',
      'branding',
      'automation'
    ],
    rating: '4.3',
    visits: '150',
    dateAdded: '2027-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Modulate.ai',
    description: 'AI voice skins and live voice modification platform.',
    url: 'https://www.modulate.ai',
    id: 'modulate-ai',
    image: '/tool-screenshots/modulate-ai.png',
    logo: '/logo/modulate-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-modification',
    tags: [
      'AI',
      'voice',
      'live'
    ],
    rating: '4.3',
    visits: '100',
    dateAdded: '2027-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Speechly',
    description: 'Real-time voice recognition and UI platform.',
    url: 'https://www.speechly.com',
    id: 'speechly',
    image: '/tool-screenshots/speechly.png',
    logo: '/logo/speechly.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-recognition',
    tags: [
      'AI',
      'voice',
      'real-time'
    ],
    rating: '4.0',
    visits: '150',
    dateAdded: '2027-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Animoto',
    description: 'AI-assisted social and marketing videos platform.',
    url: 'https://animoto.com',
    id: 'animoto',
    image: '/tool-screenshots/animoto.png',
    logo: '/logo/animoto.png',
    categories: [
      'video'
    ],
    subcategory: 'social-videos',
    tags: [
      'AI',
      'marketing',
      'social media'
    ],
    rating: '4.4',
    visits: '200',
    dateAdded: '2027-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Ava.ai',
    description: 'Enterprise meeting transcription and insights platform.',
    url: 'https://www.ava.me',
    id: 'ava-ai',
    image: '/tool-screenshots/ava-ai.png',
    logo: '/logo/ava-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'meeting-transcription',
    tags: [
      'AI',
      'meetings',
      'productivity'
    ],
    rating: '4.1',
    visits: '200',
    dateAdded: '2027-01-15',
    isPremium: 'Free'
  },
  {
    name: 'VideoScribe',
    description: 'Whiteboard animation with AI automation platform.',
    url: 'https://www.videoscribe.co',
    id: 'videoscribe',
    image: '/tool-screenshots/videoscribe.png',
    logo: '/logo/videoscribe.png',
    categories: [
      'video'
    ],
    subcategory: 'whiteboard-animation',
    tags: [
      'AI',
      'whiteboard',
      'animation'
    ],
    rating: '4.0',
    visits: '300',
    dateAdded: '2027-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Synthesia.io',
    description: 'Multi-language AI virtual presenter platform.',
    url: 'https://www.synthesia.io',
    id: 'synthesia-io',
    image: '/tool-screenshots/synthesia-io.png',
    logo: '/logo/synthesia-io.png',
    categories: [
      'video'
    ],
    subcategory: 'virtual-presenters',
    tags: [
      'AI',
      'multilingual',
      'presenter'
    ],
    rating: '4.1',
    visits: '400',
    dateAdded: '2026-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Mem',
    description: 'AI-powered note organization and intelligent retrieval platform.',
    url: 'https://mem.ai',
    id: 'mem',
    image: '/tool-screenshots/mem.png',
    logo: '/logo/mem.png',
    categories: [
      'productivity'
    ],
    subcategory: 'note-organization',
    tags: [
      'AI',
      'notes',
      'organization'
    ],
    rating: '4.1',
    visits: '3000',
    dateAdded: '2026-11-15',
    isPremium: 'Free'
  },
  {
    name: 'AIDungeon',
    description: 'Interactive storytelling platform with voice capabilities.',
    url: 'https://aidungeon.io',
    id: 'aidungeon',
    image: '/tool-screenshots/aidungeon.png',
    logo: '/logo/aidungeon.png',
    categories: [
      'audio'
    ],
    subcategory: 'storytelling',
    tags: [
      'AI',
      'storytelling',
      'interactive'
    ],
    rating: '4.2',
    visits: '300',
    dateAdded: '2026-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Foid',
    description: 'AI scheduling and reminder assistant for productivity.',
    url: 'https://foid.ai',
    id: 'foid',
    image: '/tool-screenshots/foid.png',
    logo: '/logo/foid.png',
    categories: [
      'productivity'
    ],
    subcategory: 'scheduling',
    tags: [
      'AI',
      'scheduling',
      'reminders'
    ],
    rating: '4.2',
    visits: '4000',
    dateAdded: '2026-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Voicera (Eva)',
    description: 'AI meeting assistant for transcription and note-taking.',
    url: 'https://voicera.com',
    id: 'voicera',
    image: '/tool-screenshots/voicera.png',
    logo: '/logo/voicera.png',
    categories: [
      'audio'
    ],
    subcategory: 'meeting-assistant',
    tags: [
      'AI',
      'meetings',
      'transcription'
    ],
    rating: '4.3',
    visits: '400',
    dateAdded: '2026-09-15',
    isPremium: 'Free'
  },
  {
    name: 'DeepMotion',
    description: 'Real-time motion tracking and avatar animation platform.',
    url: 'https://www.deepmotion.com',
    id: 'deepmotion',
    image: '/tool-screenshots/deepmotion.png',
    logo: '/logo/deepmotion.png',
    categories: [
      'video'
    ],
    subcategory: 'motion-tracking',
    tags: [
      'AI',
      'motion',
      'animation'
    ],
    rating: '4.2',
    visits: '600',
    dateAdded: '2026-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Hugo AI',
    description: 'Knowledge management and AI writing assistant.',
    url: 'https://hugo.ai',
    id: 'hugo-ai',
    image: '/tool-screenshots/hugo-ai.png',
    logo: '/logo/hugo-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'knowledge-management',
    tags: [
      'AI',
      'knowledge',
      'writing'
    ],
    rating: '4.3',
    visits: '6000',
    dateAdded: '2026-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Deepgram',
    description: 'High-accuracy speech recognition and analytics platform.',
    url: 'https://deepgram.com',
    id: 'deepgram',
    image: '/tool-screenshots/deepgram.png',
    logo: '/logo/deepgram.png',
    categories: [
      'audio'
    ],
    subcategory: 'speech-analytics',
    tags: [
      'AI',
      'voice',
      'analytics'
    ],
    rating: '4.4',
    visits: '600',
    dateAdded: '2026-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Viond',
    description: 'AI-powered 3D and AR video content platform.',
    url: 'https://viond.io',
    id: 'viond',
    image: '/tool-screenshots/viond.png',
    logo: '/logo/viond.png',
    categories: [
      'video'
    ],
    subcategory: 'ar-content',
    tags: [
      'AI',
      'AR',
      '3D content'
    ],
    rating: '4.3',
    visits: '800',
    dateAdded: '2026-07-15',
    isPremium: 'Free'
  },
  {
    name: 'X.con',
    description: 'AI document summarization and information extraction platform.',
    url: 'https://x.con',
    id: 'x-con',
    image: '/tool-screenshots/x-con.png',
    logo: '/logo/x-con.png',
    categories: [
      'productivity'
    ],
    subcategory: 'document-analysis',
    tags: [
      'AI',
      'documents',
      'summaries'
    ],
    rating: '4.4',
    visits: '8000',
    dateAdded: '2026-05-15',
    isPremium: 'Free'
  },
  {
    name: 'AssemblyAI',
    description: 'Voice AI platform for transcription and insights.',
    url: 'https://www.assemblyai.com',
    id: 'assembly-ai',
    image: '/tool-screenshots/assembly-ai.png',
    logo: '/logo/assembly-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-analytics',
    tags: [
      'AI',
      'voice',
      'analytics'
    ],
    rating: '4.0',
    visits: '800',
    dateAdded: '2026-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Kinetix',
    description: 'AI-driven 3D avatar and character animation platform.',
    url: 'https://www.kinetix.tech',
    id: 'kinetix',
    image: '/tool-screenshots/kinetix.png',
    logo: '/logo/kinetix.png',
    categories: [
      'video'
    ],
    subcategory: '3d-animation',
    tags: [
      'AI',
      '3D',
      'animation'
    ],
    rating: '4.0',
    visits: '1000',
    dateAdded: '2026-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Rev.ai',
    description: 'Enterprise-grade speech recognition API.',
    url: 'https://www.rev.ai',
    id: 'rev-ai',
    image: '/tool-screenshots/rev-ai.png',
    logo: '/logo/rev-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'speech-recognition',
    tags: [
      'AI',
      'APIs',
      'speech recognition'
    ],
    rating: '4.1',
    visits: '1000',
    dateAdded: '2026-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Panda Video',
    description: 'AI explainer and presentation videos platform.',
    url: 'https://pandavideo.com',
    id: 'panda-video',
    image: '/tool-screenshots/panda-video.png',
    logo: '/logo/panda-video.png',
    categories: [
      'video'
    ],
    subcategory: 'explainer-videos',
    tags: [
      'AI',
      'explainer',
      'presentation'
    ],
    rating: '4.1',
    visits: '1500',
    dateAdded: '2026-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Synthesys Studio',
    description: 'AI voice and video narration platform.',
    url: 'https://synthesys.io',
    id: 'synthesys-studio',
    image: '/tool-screenshots/synthesys-studio.png',
    logo: '/logo/synthesys-studio.png',
    categories: [
      'video'
    ],
    subcategory: 'video-narration',
    tags: [
      'AI',
      'voice',
      'narration'
    ],
    rating: '4.2',
    visits: '2000',
    dateAdded: '2026-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Trint',
    description: 'AI transcription platform with advanced editing tools.',
    url: 'https://trint.com',
    id: 'trint',
    image: '/tool-screenshots/trint.png',
    logo: '/logo/trint.png',
    categories: [
      'audio'
    ],
    subcategory: 'transcription',
    tags: [
      'AI',
      'transcription',
      'editing'
    ],
    rating: '4.3',
    visits: '2000',
    dateAdded: '2025-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Rocketium',
    description: 'Rapid AI automation for video production teams.',
    url: 'https://rocketium.com',
    id: 'rocketium',
    image: '/tool-screenshots/rocketium.png',
    logo: '/logo/rocketium.png',
    categories: [
      'video'
    ],
    subcategory: 'team-automation',
    tags: [
      'AI',
      'teamwork',
      'automation'
    ],
    rating: '4.3',
    visits: '3000',
    dateAdded: '2025-11-15',
    isPremium: 'Free'
  },
  {
    name: 'V7 Labs',
    description: 'AI image and video annotation and analytics platform.',
    url: 'https://www.v7labs.com',
    id: 'v7-labs',
    image: '/tool-screenshots/v7-labs.png',
    logo: '/logo/v7-labs.png',
    categories: [
      'analytics'
    ],
    subcategory: 'image-analytics',
    tags: [
      'AI'
    ],
    rating: '4.3',
    visits: '100',
    dateAdded: '2025-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Sonix.ai',
    description: 'AI-powered audio and video transcription with search capabilities.',
    url: 'https://sonix.ai',
    id: 'sonix-ai',
    image: '/tool-screenshots/sonix-ai.png',
    logo: '/logo/sonix-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'transcription',
    tags: [
      'AI',
      'transcription',
      'search'
    ],
    rating: '4.0',
    visits: '3000',
    dateAdded: '2025-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Lalaland.ai',
    description: 'AI music and sound effects for videos platform.',
    url: 'https://lalaland.ai',
    id: 'lalaland-ai',
    image: '/tool-screenshots/lalaland-ai.png',
    logo: '/logo/lalaland-ai.png',
    categories: [
      'video'
    ],
    subcategory: 'sound-effects',
    tags: [
      'AI',
      'music',
      'sound effects'
    ],
    rating: '4.4',
    visits: '4000',
    dateAdded: '2025-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Program Synthesis Tools',
    description: 'AI for automatic code generation from specifications.',
    url: 'https://program-synthesis.org',
    id: 'program-synthesis',
    image: '/tool-screenshots/program-synthesis.png',
    logo: '/logo/program-synthesis.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-synthesis',
    tags: [
      'AI',
      'synthesis',
      'automation'
    ],
    rating: '4.4',
    visits: '1000000',
    dateAdded: '2025-09-01',
    isPremium: 'Free'
  },
  {
    name: 'DataRobot MLOps',
    description: 'AI lifecycle management and deployment platform.',
    url: 'https://www.datarobot.com/platform/mlops',
    id: 'datarobot-mlops',
    image: '/tool-screenshots/datarobot-mlops.png',
    logo: '/logo/datarobot-mlops.png',
    categories: [
      'analytics'
    ],
    subcategory: 'mlops',
    tags: [
      'AI',
      'MLOps',
      'deployment'
    ],
    rating: '4.5',
    visits: '150',
    dateAdded: '2025-08-15',
    isPremium: 'Free'
  },
  {
    name: 'DataClarity',
    description: 'Data correlation & cleansing for analytics platform.',
    url: 'https://dataclarity.ai',
    id: 'dataclarity',
    image: '/tool-screenshots/dataclarity.png',
    logo: '/logo/dataclarity.png',
    categories: [
      'data'
    ],
    subcategory: 'data-cleansing',
    tags: [
      'AI'
    ],
    rating: '4.2',
    visits: '600',
    dateAdded: '2025-08-15',
    isPremium: 'Free'
  },
  {
    name: 'ChatGPT for Developers',
    description: 'In-app coding help and interactive assistance.',
    url: 'https://chat.openai.com',
    id: 'chatgpt-developers',
    image: '/tool-screenshots/chatgpt-developers.png',
    logo: '/logo/chatgpt-developers.png',
    categories: [
      'coding'
    ],
    subcategory: 'chat-assistant',
    tags: [
      'AI',
      'chat',
      'developer tools'
    ],
    rating: '4.6',
    visits: '2000000',
    dateAdded: '2025-08-01',
    isPremium: 'Free'
  },
  {
    name: 'Kogito (Red Hat)',
    description: 'Intelligent automation & decision processing platform.',
    url: 'https://kogito.kie.org',
    id: 'kogito',
    image: '/tool-screenshots/kogito.png',
    logo: '/logo/kogito.png',
    categories: [
      'data'
    ],
    subcategory: 'automation',
    tags: [
      'AI',
      'automation',
      'decisioning'
    ],
    rating: '4.3',
    visits: '800',
    dateAdded: '2025-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Speechmatics',
    description: 'Advanced speech recognition and transcription platform.',
    url: 'https://www.speechmatics.com',
    id: 'speechmatics',
    image: '/tool-screenshots/speechmatics.png',
    logo: '/logo/speechmatics.png',
    categories: [
      'audio'
    ],
    subcategory: 'speech-recognition',
    tags: [
      'AI',
      'voice',
      'transcription'
    ],
    rating: '4.1',
    visits: '4000',
    dateAdded: '2025-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Biteable',
    description: 'AI animation for explainer and marketing videos.',
    url: 'https://biteable.com',
    id: 'biteable',
    image: '/tool-screenshots/biteable.png',
    logo: '/logo/biteable.png',
    categories: [
      'video'
    ],
    subcategory: 'explainer-videos',
    tags: [
      'AI',
      'animation',
      'marketing'
    ],
    rating: '4.0',
    visits: '6000',
    dateAdded: '2025-07-15',
    isPremium: 'Free'
  },
  {
    name: 'GPT-4 Programming Assistants',
    description: 'Advanced language models for coding tasks.',
    url: 'https://openai.com/gpt-4',
    id: 'gpt-4-programming',
    image: '/tool-screenshots/gpt-4-programming.png',
    logo: '/logo/gpt-4-programming.png',
    categories: [
      'coding'
    ],
    subcategory: 'programming-assistant',
    tags: [
      'AI',
      'GPT-4',
      'programming'
    ],
    rating: '4.8',
    visits: '3000000',
    dateAdded: '2025-07-01',
    isPremium: 'Free'
  },
  {
    name: 'NVIDIA Clara & Merlin',
    description: 'AI analytics for healthcare and life sciences.',
    url: 'https://developer.nvidia.com/clara',
    id: 'nvidia-clara',
    image: '/tool-screenshots/nvidia-clara.png',
    logo: '/logo/nvidia-clara.png',
    categories: [
      'analytics'
    ],
    subcategory: 'healthcare-analytics',
    tags: [
      'AI',
      'healthcare',
      'life sciences'
    ],
    rating: '4.6',
    visits: '300',
    dateAdded: '2025-06-15',
    isPremium: 'Free'
  },
  {
    name: 'VAST AI',
    description: 'Accelerated cloud data processing & analysis platform.',
    url: 'https://vast.ai',
    id: 'vast-ai',
    image: '/tool-screenshots/vast-ai.png',
    logo: '/logo/vast-ai.png',
    categories: [
      'data'
    ],
    subcategory: 'cloud-data',
    tags: [
      'AI',
      'cloud',
      'acceleration'
    ],
    rating: '4.4',
    visits: '1000',
    dateAdded: '2025-06-15',
    isPremium: 'Free'
  },
  {
    name: 'bayesianCode',
    description: 'Probabilistic programming with AI optimization.',
    url: 'https://bayesiancode.com',
    id: 'bayesiancode',
    image: '/tool-screenshots/bayesiancode.png',
    logo: '/logo/bayesiancode.png',
    categories: [
      'coding',
      'data'
    ],
    subcategory: 'probabilistic',
    tags: [
      'AI',
      'probabilistic',
      'optimization'
    ],
    rating: '4.1',
    visits: '400000',
    dateAdded: '2025-06-01',
    isPremium: 'Free'
  },
  {
    name: 'Kensho (S&P Global)',
    description: 'AI and machine learning for finance and economic research.',
    url: 'https://www.kensho.com',
    id: 'kensho',
    image: '/tool-screenshots/kensho.png',
    logo: '/logo/kensho.png',
    categories: [
      'analytics'
    ],
    subcategory: 'financial-analytics',
    tags: [
      'AI',
      'finance',
      'economic modeling'
    ],
    rating: '4.5',
    visits: '400',
    dateAdded: '2025-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Azure Synapse Spark',
    description: 'Unified big data analytics platform.',
    url: 'https://azure.microsoft.com/services/synapse-analytics',
    id: 'azure-synapse-spark',
    image: '/tool-screenshots/azure-synapse-spark.png',
    logo: '/logo/azure-synapse-spark.png',
    categories: [
      'data'
    ],
    subcategory: 'cloud-analytics',
    tags: [
      'AI',
      'cloud',
      'Spark'
    ],
    rating: '4.6',
    visits: '1200',
    dateAdded: '2025-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Microsoft Azure TTS',
    description: 'Cloud-based speech synthesis service.',
    url: 'https://azure.microsoft.com/services/cognitive-services/text-to-speech',
    id: 'microsoft-azure-tts',
    image: '/tool-screenshots/microsoft-azure-tts.png',
    logo: '/logo/microsoft-azure-tts.png',
    categories: [
      'audio'
    ],
    subcategory: 'text-to-speech',
    tags: [
      'AI',
      'Azure',
      'TTS'
    ],
    rating: '4.2',
    visits: '6000',
    dateAdded: '2025-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Wave.video',
    description: 'AI-powered marketing videos and social media clips platform.',
    url: 'https://wave.video',
    id: 'wave-video',
    image: '/tool-screenshots/wave-video.png',
    logo: '/logo/wave-video.png',
    categories: [
      'video'
    ],
    subcategory: 'marketing-videos',
    tags: [
      'AI',
      'marketing',
      'social media'
    ],
    rating: '4.1',
    visits: '8000',
    dateAdded: '2025-05-15',
    isPremium: 'Free'
  },
  {
    name: 'CodeSquire',
    description: 'AI-powered technical documentation and code generation tool.',
    url: 'https://codesquire.com',
    id: 'codesquire',
    image: '/tool-screenshots/codesquire.png',
    logo: '/logo/codesquire.png',
    categories: [
      'coding'
    ],
    subcategory: 'documentation',
    tags: [
      'AI',
      'documentation',
      'developer tools'
    ],
    rating: '4.3',
    visits: '800000',
    dateAdded: '2025-05-01',
    isPremium: 'Free'
  },
  {
    name: 'AWS Analytics & ML Stack',
    description: 'Broad suite of AI tools for analytics workflows.',
    url: 'https://aws.amazon.com/analytics',
    id: 'aws-analytics-stack',
    image: '/tool-screenshots/aws-analytics-stack.png',
    logo: '/logo/aws-analytics-stack.png',
    categories: [
      'analytics'
    ],
    subcategory: 'cloud-analytics',
    tags: [
      'AI',
      'AWS',
      'Big Data'
    ],
    rating: '4.7',
    visits: '600',
    dateAdded: '2025-04-15',
    isPremium: 'Free'
  },
  {
    name: 'Oracle Big Data Platform',
    description: 'Enterprise data integration & processing platform.',
    url: 'https://www.oracle.com/big-data',
    id: 'oracle-big-data',
    image: '/tool-screenshots/oracle-big-data.png',
    logo: '/logo/oracle-big-data.png',
    categories: [
      'data'
    ],
    subcategory: 'enterprise-data',
    tags: [
      'AI',
      'enterprise',
      'big data'
    ],
    rating: '4.5',
    visits: '1500',
    dateAdded: '2025-04-15',
    isPremium: 'Free'
  },
  {
    name: 'OpenAI API for Code',
    description: 'General purpose API for custom AI code solutions.',
    url: 'https://openai.com/api',
    id: 'openai-api-code',
    image: '/tool-screenshots/openai-api-code.png',
    logo: '/logo/openai-api-code.png',
    categories: [
      'coding'
    ],
    subcategory: 'api',
    tags: [
      'AI',
      'API',
      'development'
    ],
    rating: '4.7',
    visits: '2500000',
    dateAdded: '2025-04-01',
    isPremium: 'Free'
  },
  {
    name: 'OpenAI Codex (for analytics scripting)',
    description: 'AI-supported code generation for data analysis tasks.',
    url: 'https://openai.com/blog/openai-codex',
    id: 'openai-codex-analytics',
    image: '/tool-screenshots/openai-codex-analytics.png',
    logo: '/logo/openai-codex-analytics.png',
    categories: [
      'analytics'
    ],
    subcategory: 'code-generation',
    tags: [
      'AI',
      'scripting',
      'data'
    ],
    rating: '4.6',
    visits: '800',
    dateAdded: '2025-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Qubole',
    description: 'Cloud-native big data & data pipeline management platform.',
    url: 'https://www.qubole.com',
    id: 'qubole',
    image: '/tool-screenshots/qubole.png',
    logo: '/logo/qubole.png',
    categories: [
      'data'
    ],
    subcategory: 'cloud-data',
    tags: [
      'AI',
      'cloud',
      'big data'
    ],
    rating: '4.4',
    visits: '2000',
    dateAdded: '2025-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Amazon Polly',
    description: 'Amazon's text-to-speech API service.',
    url: 'https://aws.amazon.com/polly',
    id: 'amazon-polly',
    image: '/tool-screenshots/amazon-polly.png',
    logo: '/logo/amazon-polly.png',
    categories: [
      'audio'
    ],
    subcategory: 'text-to-speech',
    tags: [
      'AI',
      'Amazon',
      'speech'
    ],
    rating: '4.3',
    visits: '8000',
    dateAdded: '2025-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Canva Video',
    description: 'Integrated AI for video storytelling and editing.',
    url: 'https://www.canva.com/video',
    id: 'canva-video',
    image: '/tool-screenshots/canva-video.png',
    logo: '/logo/canva-video.png',
    categories: [
      'video'
    ],
    subcategory: 'video-storytelling',
    tags: [
      'AI',
      'storytelling',
      'editing'
    ],
    rating: '4.2',
    visits: '10000',
    dateAdded: '2025-03-15',
    isPremium: 'Free'
  },
  {
    name: 'GitHub Copilot Labs',
    description: 'Experimental tools for AI-assisted coding and learning.',
    url: 'https://github.com/features/copilot',
    id: 'github-copilot-labs',
    image: '/tool-screenshots/github-copilot-labs.png',
    logo: '/logo/github-copilot-labs.png',
    categories: [
      'coding'
    ],
    subcategory: 'experimental',
    tags: [
      'AI',
      'experiment',
      'IDE'
    ],
    rating: '4.5',
    visits: '1500000',
    dateAdded: '2025-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Satellogic',
    description: 'Satellite data analytics with AI capabilities.',
    url: 'https://satellogic.com',
    id: 'satellogic',
    image: '/tool-screenshots/satellogic.png',
    logo: '/logo/satellogic.png',
    categories: [
      'analytics'
    ],
    subcategory: 'geospatial',
    tags: [
      'AI',
      'geospatial',
      'satellite data'
    ],
    rating: '4.5',
    visits: '1000',
    dateAdded: '2025-02-15',
    isPremium: 'Free'
  },
  {
    name: 'Dremio',
    description: 'Data lakehouse & semantic layer with AI enhancements.',
    url: 'https://www.dremio.com',
    id: 'dremio',
    image: '/tool-screenshots/dremio.png',
    logo: '/logo/dremio.png',
    categories: [
      'data'
    ],
    subcategory: 'data-lake',
    tags: [
      'AI',
      'data lake',
      'semantic layer'
    ],
    rating: '4.6',
    visits: '2500',
    dateAdded: '2025-02-15',
    isPremium: 'Free'
  },
  {
    name: 'AI CodeReviewer',
    description: 'AI-based code review and quality analysis tool.',
    url: 'https://aicodereviewer.com',
    id: 'ai-codereviewer',
    image: '/tool-screenshots/ai-codereviewer.png',
    logo: '/logo/ai-codereviewer.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-review',
    tags: [
      'AI',
      'review',
      'QA'
    ],
    rating: '4.2',
    visits: '700000',
    dateAdded: '2025-02-01',
    isPremium: 'Free'
  },
  {
    name: 'Cloudy AI',
    description: 'AI-enhanced predictive maintenance and IoT analytics.',
    url: 'https://cloudy.ai',
    id: 'cloudy-ai',
    image: '/tool-screenshots/cloudy-ai.png',
    logo: '/logo/cloudy-ai.png',
    categories: [
      'analytics'
    ],
    subcategory: 'iot-analytics',
    tags: [
      'AI',
      'IoT',
      'predictive maintenance'
    ],
    rating: '4.3',
    visits: '1500',
    dateAdded: '2025-01-15',
    isPremium: 'Free'
  },
  {
    name: 'C3 AI Suite',
    description: 'Industrial & enterprise data processing & analytics platform.',
    url: 'https://c3.ai',
    id: 'c3-ai-suite',
    image: '/tool-screenshots/c3-ai-suite.png',
    logo: '/logo/c3-ai-suite.png',
    categories: [
      'data'
    ],
    subcategory: 'enterprise-data',
    tags: [
      'AI',
      'enterprise',
      'data management'
    ],
    rating: '4.5',
    visits: '3000',
    dateAdded: '2025-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Google Cloud Text-to-Speech',
    description: 'Scalable text-to-speech service powered by Google's AI.',
    url: 'https://cloud.google.com/text-to-speech',
    id: 'google-cloud-tts',
    image: '/tool-screenshots/google-cloud-tts.png',
    logo: '/logo/google-cloud-tts.png',
    categories: [
      'audio'
    ],
    subcategory: 'text-to-speech',
    tags: [
      'AI',
      'Google',
      'speech'
    ],
    rating: '4.5',
    visits: '10000',
    dateAdded: '2025-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Movio',
    description: 'AI avatar and synthetic video creation platform.',
    url: 'https://www.movio.la',
    id: 'movio',
    image: '/tool-screenshots/movio.png',
    logo: '/logo/movio.png',
    categories: [
      'video'
    ],
    subcategory: 'avatar-creation',
    tags: [
      'AI',
      'avatars',
      'video synthesis'
    ],
    rating: '4.3',
    visits: '15000',
    dateAdded: '2025-01-15',
    isPremium: 'Free'
  },
  {
    name: 'CodeSandbox AI',
    description: 'AI-assisted code sharing and editing platform.',
    url: 'https://codesandbox.io',
    id: 'codesandbox-ai',
    image: '/tool-screenshots/codesandbox-ai.png',
    logo: '/logo/codesandbox-ai.png',
    categories: [
      'coding'
    ],
    subcategory: 'web-ide',
    tags: [
      'AI',
      'web',
      'IDE'
    ],
    rating: '4.3',
    visits: '900000',
    dateAdded: '2025-01-01',
    isPremium: 'Free'
  },
  {
    name: 'TensorFlow Federated',
    description: 'Federated learning platform for distributed analytics.',
    url: 'https://www.tensorflow.org/federated',
    id: 'tensorflow-federated',
    image: '/tool-screenshots/tensorflow-federated.png',
    logo: '/logo/tensorflow-federated.png',
    categories: [
      'analytics'
    ],
    subcategory: 'federated-learning',
    tags: [
      'AI',
      'federated learning'
    ],
    rating: '4.4',
    visits: '2000',
    dateAdded: '2024-12-15',
    isPremium: 'Free'
  },
  {
    name: 'TIBCO Data Virtualization',
    description: 'Real-time data federation & processing platform.',
    url: 'https://www.tibco.com/products/data-virtualization',
    id: 'tibco-data-virtualization',
    image: '/tool-screenshots/tibco-data-virtualization.png',
    logo: '/logo/tibco-data-virtualization.png',
    categories: [
      'data'
    ],
    subcategory: 'data-virtualization',
    tags: [
      'AI',
      'virtualization'
    ],
    rating: '4.4',
    visits: '4000',
    dateAdded: '2024-12-15',
    isPremium: 'Free'
  },
  {
    name: 'Replit AI',
    description: 'Integrated AI coding environment for collaborative development.',
    url: 'https://replit.com',
    id: 'replit-ai',
    image: '/tool-screenshots/replit-ai.png',
    logo: '/logo/replit-ai.png',
    categories: [
      'coding'
    ],
    subcategory: 'ide',
    tags: [
      'AI',
      'IDE',
      'collaborative coding'
    ],
    rating: '4.4',
    visits: '1000000',
    dateAdded: '2024-12-01',
    isPremium: 'Free'
  },
  {
    name: 'Dataiku DSS',
    description: 'Enterprise data engineering & Automl workflows platform.',
    url: 'https://www.dataiku.com/product/',
    id: 'dataiku-dss',
    image: '/tool-screenshots/dataiku-dss.png',
    logo: '/logo/dataiku-dss.png',
    categories: [
      'data'
    ],
    subcategory: 'data-engineering',
    tags: [
      'AI',
      'data pipeline',
      'ML'
    ],
    rating: '4.6',
    visits: '5000',
    dateAdded: '2024-11-15',
    isPremium: 'Free'
  },
  {
    name: 'IBM Watson Text to Speech',
    description: 'Enterprise-grade AI-powered text-to-speech API.',
    url: 'https://www.ibm.com/watson/services/text-to-speech',
    id: 'ibm-watson-tts',
    image: '/tool-screenshots/ibm-watson-tts.png',
    logo: '/logo/ibm-watson-tts.png',
    categories: [
      'audio'
    ],
    subcategory: 'text-to-speech',
    tags: [
      'AI',
      'Watson',
      'TTS'
    ],
    rating: '4.4',
    visits: '15000',
    dateAdded: '2024-11-15',
    isPremium: 'Free'
  },
  {
    name: 'D-ID',
    description: 'AI reenactment and face animation from images and videos.',
    url: 'https://www.d-id.com',
    id: 'd-id',
    image: '/tool-screenshots/d-id.png',
    logo: '/logo/d-id.png',
    categories: [
      'video'
    ],
    subcategory: 'face-animation',
    tags: [
      'AI',
      'reenactment',
      'animation'
    ],
    rating: '4.0',
    visits: '20000',
    dateAdded: '2024-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Qlik Cloud',
    description: 'Cloud-native analytics with AI features.',
    url: 'https://www.qlik.com/us/products/qlik-cloud',
    id: 'qlik-cloud',
    image: '/tool-screenshots/qlik-cloud.png',
    logo: '/logo/qlik-cloud.png',
    categories: [
      'analytics'
    ],
    subcategory: 'cloud-analytics',
    tags: [
      'AI',
      'cloud',
      'BI'
    ],
    rating: '4.3',
    visits: '4000',
    dateAdded: '2024-10-15',
    isPremium: 'Free'
  },
  {
    name: 'AWS Glue',
    description: 'Serverless data integration & ETL service.',
    url: 'https://aws.amazon.com/glue',
    id: 'aws-glue',
    image: '/tool-screenshots/aws-glue.png',
    logo: '/logo/aws-glue.png',
    categories: [
      'data'
    ],
    subcategory: 'serverless-etl',
    tags: [
      'AI',
      'AWS',
      'serverless'
    ],
    rating: '4.7',
    visits: '6000',
    dateAdded: '2024-10-15',
    isPremium: 'Free'
  },
  {
    name: 'AI Developer Extensions',
    description: 'Collection of IDE plugins for AI coding assistance.',
    url: 'https://marketplace.visualstudio.com',
    id: 'ai-developer-extensions',
    image: '/tool-screenshots/ai-developer-extensions.png',
    logo: '/logo/ai-developer-extensions.png',
    categories: [
      'coding'
    ],
    subcategory: 'ide-plugins',
    tags: [
      'AI',
      'IDE',
      'plugins'
    ],
    rating: '4.2',
    visits: '600000',
    dateAdded: '2024-10-01',
    isPremium: 'Free'
  },
  {
    name: 'SAP Analytics Cloud',
    description: 'AI-driven analytics platform.',
    url: 'https://www.sap.com/products/technology-platform/analytics.html',
    id: 'sap-analytics-cloud',
    image: '/tool-screenshots/sap-analytics-cloud.png',
    logo: '/logo/sap-analytics-cloud.png',
    categories: [
      'analytics'
    ],
    subcategory: 'cloud-analytics',
    tags: [
      'AI',
      'enterprise',
      'SAP'
    ],
    rating: '4.5',
    visits: '6000',
    dateAdded: '2024-09-15',
    isPremium: 'Free'
  },
  {
    name: 'DataRobot Data Pipelines',
    description: 'Sophisticated automated data workflows platform.',
    url: 'https://www.datarobot.com/platform/pipelines',
    id: 'datarobot-data-pipelines',
    image: '/tool-screenshots/datarobot-data-pipelines.png',
    logo: '/logo/datarobot-data-pipelines.png',
    categories: [
      'data'
    ],
    subcategory: 'data-pipelines',
    tags: [
      'AI',
      'pipelines',
      'automation'
    ],
    rating: '4.5',
    visits: '8000',
    dateAdded: '2024-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Acapela Group',
    description: 'Customizable voice solutions powered by AI.',
    url: 'https://www.acapela-group.com',
    id: 'acapela-group',
    image: '/tool-screenshots/acapela-group.png',
    logo: '/logo/acapela-group.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-solutions',
    tags: [
      'AI',
      'voices',
      'synthesis'
    ],
    rating: '4.0',
    visits: '20000',
    dateAdded: '2024-09-15',
    isPremium: 'Free'
  },
  {
    name: 'SynthAI',
    description: 'AI-driven soundtrack and sound design for videos.',
    url: 'https://synthai.com',
    id: 'synthai',
    image: '/tool-screenshots/synthai.png',
    logo: '/logo/synthai.png',
    categories: [
      'video'
    ],
    subcategory: 'sound-design',
    tags: [
      'AI',
      'music',
      'sound design'
    ],
    rating: '4.1',
    visits: '30000',
    dateAdded: '2024-09-15',
    isPremium: 'Free'
  },
  {
    name: 'MicroStrategy',
    description: 'Enterprise analytics and AI insights platform.',
    url: 'https://www.microstrategy.com',
    id: 'microstrategy',
    image: '/tool-screenshots/microstrategy.png',
    logo: '/logo/microstrategy.png',
    categories: [
      'analytics'
    ],
    subcategory: 'enterprise-analytics',
    tags: [
      'AI',
      'enterprise',
      'visualization'
    ],
    rating: '4.4',
    visits: '8000',
    dateAdded: '2024-08-15',
    isPremium: 'Free'
  },
  {
    name: 'DeepAI Code Support',
    description: 'AI-based code assistance and error fixing tool.',
    url: 'https://deepai.org',
    id: 'deepai-code-support',
    image: '/tool-screenshots/deepai-code-support.png',
    logo: '/logo/deepai-code-support.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-assistance',
    tags: [
      'AI',
      'bug fixing'
    ],
    rating: '4.0',
    visits: '200000',
    dateAdded: '2024-08-01',
    isPremium: 'Free'
  },
  {
    name: 'AdRoll',
    description: 'AI advertising & retargeting platform.',
    url: 'https://www.adroll.com',
    id: 'adroll',
    image: '/tool-screenshots/adroll.png',
    logo: '/logo/adroll.png',
    categories: [
      'marketing'
    ],
    subcategory: 'advertising',
    tags: [
      'AI',
      'advertising',
      'retargeting'
    ],
    rating: '4.5',
    visits: '1000',
    dateAdded: '2024-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Looker (Google Cloud)',
    description: 'BI and embedded analytics with AI features.',
    url: 'https://looker.com',
    id: 'looker',
    image: '/tool-screenshots/looker.png',
    logo: '/logo/looker.png',
    categories: [
      'analytics'
    ],
    subcategory: 'business-intelligence',
    tags: [
      'AI',
      'BI',
      'embedded analytics'
    ],
    rating: '4.5',
    visits: '10000',
    dateAdded: '2024-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Google Cloud Dataproc',
    description: 'Managed Spark & Hadoop clusters service.',
    url: 'https://cloud.google.com/dataproc',
    id: 'google-cloud-dataproc',
    image: '/tool-screenshots/google-cloud-dataproc.png',
    logo: '/logo/google-cloud-dataproc.png',
    categories: [
      'data'
    ],
    subcategory: 'cloud-data',
    tags: [
      'AI',
      'cloud',
      'data processing'
    ],
    rating: '4.7',
    visits: '12000',
    dateAdded: '2024-07-15',
    isPremium: 'Free'
  },
  {
    name: 'CandyVoice',
    description: 'AI-powered voice conversion and enhancement platform.',
    url: 'https://candyvoice.ai',
    id: 'candyvoice',
    image: '/tool-screenshots/candyvoice.png',
    logo: '/logo/candyvoice.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-enhancement',
    tags: [
      'AI',
      'voice',
      'transfer'
    ],
    rating: '4.1',
    visits: '30000',
    dateAdded: '2024-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Kapwing',
    description: 'Collaborative AI video editing and remixing platform.',
    url: 'https://www.kapwing.com',
    id: 'kapwing',
    image: '/tool-screenshots/kapwing.png',
    logo: '/logo/kapwing.png',
    categories: [
      'video'
    ],
    subcategory: 'collaborative-editing',
    tags: [
      'AI',
      'collaboration',
      'editing'
    ],
    rating: '4.2',
    visits: '40000',
    dateAdded: '2024-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Chai ML',
    description: 'AI assistant for coding suggestions and Q&A.',
    url: 'https://chai.ml',
    id: 'chai-ml',
    image: '/tool-screenshots/chai-ml.png',
    logo: '/logo/chai-ml.png',
    categories: [
      'coding'
    ],
    subcategory: 'chat-assistant',
    tags: [
      'AI',
      'chat',
      'suggestions'
    ],
    rating: '4.1',
    visits: '300000',
    dateAdded: '2024-07-01',
    isPremium: 'Free'
  },
  {
    name: 'Sentient Technologies',
    description: 'AI for digital marketing and conversion optimization platform.',
    url: 'https://www.sentient.ai',
    id: 'sentient-technologies',
    image: '/tool-screenshots/sentient-technologies.png',
    logo: '/logo/sentient-technologies.png',
    categories: [
      'marketing'
    ],
    subcategory: 'conversion-optimization',
    tags: [
      'AI',
      'conversion'
    ],
    rating: '4.3',
    visits: '1500',
    dateAdded: '2024-06-15',
    isPremium: 'Free'
  },
  {
    name: 'Blue Yonder (JDA)',
    description: 'Supply chain analytics with AI optimizations.',
    url: 'https://blueyonder.com',
    id: 'blue-yonder',
    image: '/tool-screenshots/blue-yonder.png',
    logo: '/logo/blue-yonder.png',
    categories: [
      'analytics'
    ],
    subcategory: 'supply-chain',
    tags: [
      'AI',
      'supply chain',
      'logistics'
    ],
    rating: '4.6',
    visits: '12000',
    dateAdded: '2024-06-15',
    isPremium: 'Free'
  },
  {
    name: 'Kafka + Pulsar',
    description: 'Event streaming & real-time data flow platforms.',
    url: 'https://kafka.apache.org',
    id: 'kafka-pulsar',
    image: '/tool-screenshots/kafka-pulsar.png',
    logo: '/logo/kafka-pulsar.png',
    categories: [
      'data'
    ],
    subcategory: 'event-streaming',
    tags: [
      'AI',
      'streaming',
      'event-driven'
    ],
    rating: '4.8',
    visits: '15000',
    dateAdded: '2024-06-15',
    isPremium: 'Free'
  },
  {
    name: 'Debuild.co',
    description: 'AI web app builder that generates code from prompts.',
    url: 'https://debuild.co',
    id: 'debuild',
    image: '/tool-screenshots/debuild.png',
    logo: '/logo/debuild.png',
    categories: [
      'coding'
    ],
    subcategory: 'web-development',
    tags: [
      'AI',
      'web development',
      'no-code'
    ],
    rating: '4.4',
    visits: '800000',
    dateAdded: '2024-06-01',
    isPremium: 'Free'
  },
  {
    name: 'ActiveCampaign',
    description: 'Marketing automation & CRM with AI insights platform.',
    url: 'https://www.activecampaign.com',
    id: 'activecampaign',
    image: '/tool-screenshots/activecampaign.png',
    logo: '/logo/activecampaign.png',
    categories: [
      'marketing'
    ],
    subcategory: 'marketing-automation',
    tags: [
      'AI',
      'automation',
      'CRM'
    ],
    rating: '4.4',
    visits: '2000',
    dateAdded: '2024-05-15',
    isPremium: 'Free'
  },
  {
    name: 'TIBCO Spotfire',
    description: 'AI-enhanced data visualization and analysis platform.',
    url: 'https://www.tibco.com/products/tibco-spotfire',
    id: 'tibco-spotfire',
    image: '/tool-screenshots/tibco-spotfire.png',
    logo: '/logo/tibco-spotfire.png',
    categories: [
      'analytics'
    ],
    subcategory: 'data-visualization',
    tags: [
      'AI',
      'visualization'
    ],
    rating: '4.4',
    visits: '15000',
    dateAdded: '2024-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Kubernetes + Apache Spark',
    description: 'Containerized big data & ETL pipelines platform.',
    url: 'https://spark.apache.org/docs/latest/running-on-kubernetes.html',
    id: 'kubernetes-spark',
    image: '/tool-screenshots/kubernetes-spark.png',
    logo: '/logo/kubernetes-spark.png',
    categories: [
      'data'
    ],
    subcategory: 'container-data',
    tags: [
      'AI',
      'container',
      'Spark'
    ],
    rating: '4.6',
    visits: '18000',
    dateAdded: '2024-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Voicemod',
    description: 'Real-time voice changer and soundboard platform.',
    url: 'https://www.voicemod.net',
    id: 'voicemod',
    image: '/tool-screenshots/voicemod.png',
    logo: '/logo/voicemod.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-modulation',
    tags: [
      'AI',
      'voice',
      'real-time'
    ],
    rating: '4.2',
    visits: '40000',
    dateAdded: '2024-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Veed.io',
    description: 'AI-powered subtitles and video editing platform.',
    url: 'https://www.veed.io',
    id: 'veed-io',
    image: '/tool-screenshots/veed-io.png',
    logo: '/logo/veed-io.png',
    categories: [
      'video'
    ],
    subcategory: 'video-editing',
    tags: [
      'AI',
      'subtitles',
      'editing'
    ],
    rating: '4.3',
    visits: '60000',
    dateAdded: '2024-05-15',
    isPremium: 'Free'
  },
  {
    name: 'CodeComplete',
    description: 'AI-driven code snippets and blocks library.',
    url: 'https://codecomplete.ai',
    id: 'codecomplete',
    image: '/tool-screenshots/codecomplete.png',
    logo: '/logo/codecomplete.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-snippets',
    tags: [
      'AI',
      'snippets',
      'library'
    ],
    rating: '4.2',
    visits: '500000',
    dateAdded: '2024-05-01',
    isPremium: 'Free'
  },
  {
    name: 'Intercom',
    description: 'AI-powered customer engagement & messaging platform.',
    url: 'https://www.intercom.com',
    id: 'intercom',
    image: '/tool-screenshots/intercom.png',
    logo: '/logo/intercom.png',
    categories: [
      'marketing'
    ],
    subcategory: 'customer-engagement',
    tags: [
      'AI',
      'customer engagement'
    ],
    rating: '4.6',
    visits: '2500',
    dateAdded: '2024-04-15',
    isPremium: 'Free'
  },
  {
    name: 'Domo',
    description: 'Cloud platform for analytics and AI insights.',
    url: 'https://www.domo.com',
    id: 'domo',
    image: '/tool-screenshots/domo.png',
    logo: '/logo/domo.png',
    categories: [
      'analytics'
    ],
    subcategory: 'cloud-analytics',
    tags: [
      'AI',
      'cloud',
      'BI'
    ],
    rating: '4.5',
    visits: '20000',
    dateAdded: '2024-04-15',
    isPremium: 'Free'
  },
  {
    name: 'Hadoop Ecosystem (HDFS, MapReduce)',
    description: 'Scalable data storage & processing framework.',
    url: 'https://hadoop.apache.org',
    id: 'hadoop-ecosystem',
    image: '/tool-screenshots/hadoop-ecosystem.png',
    logo: '/logo/hadoop-ecosystem.png',
    categories: [
      'data'
    ],
    subcategory: 'big-data',
    tags: [
      'AI',
      'big data',
      'Hadoop'
    ],
    rating: '4.7',
    visits: '20000',
    dateAdded: '2024-04-15',
    isPremium: 'Free'
  },
  {
    name: 'ExaCode',
    description: 'AI performance tuning and bug detection tool.',
    url: 'https://exacode.ai',
    id: 'exacode',
    image: '/tool-screenshots/exacode.png',
    logo: '/logo/exacode.png',
    categories: [
      'coding'
    ],
    subcategory: 'performance',
    tags: [
      'AI',
      'performance',
      'bug-finding'
    ],
    rating: '4.3',
    visits: '700000',
    dateAdded: '2024-04-01',
    isPremium: 'Free'
  },
  {
    name: 'Drift',
    description: 'AI chatbot & conversational marketing platform.',
    url: 'https://www.drift.com',
    id: 'drift',
    image: '/tool-screenshots/drift.png',
    logo: '/logo/drift.png',
    categories: [
      'marketing'
    ],
    subcategory: 'conversational-marketing',
    tags: [
      'AI',
      'chat',
      'marketing'
    ],
    rating: '4.5',
    visits: '3000',
    dateAdded: '2024-03-15',
    isPremium: 'Free'
  },
  {
    name: 'EndNote (with AI features)',
    description: 'Citation & research management',
    url: 'https://endnote.com',
    id: 'endnote',
    image: '/tool-screenshots/endnote.png',
    logo: '/logo/endnote.png',
    categories: [
      'research'
    ],
    subcategory: 'citation-management',
    tags: [
      'AI',
      'citations',
      'management'
    ],
    rating: '4.2',
    visits: '12000',
    dateAdded: '2024-03-15',
    isPremium: 'Premium'
  },
  {
    name: 'DataRobot Paxata',
    description: 'AI-enabled data preparation platform.',
    url: 'https://www.datarobot.com/platform/paxata',
    id: 'datarobot-paxata',
    image: '/tool-screenshots/datarobot-paxata.png',
    logo: '/logo/datarobot-paxata.png',
    categories: [
      'analytics'
    ],
    subcategory: 'data-preparation',
    tags: [
      'AI',
      'data prep',
      'automation'
    ],
    rating: '4.3',
    visits: '25000',
    dateAdded: '2024-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Axiom (by Insight Partners)',
    description: 'Enterprise data processing & synthetic data generation platform.',
    url: 'https://www.axiom.ai',
    id: 'axiom',
    image: '/tool-screenshots/axiom.png',
    logo: '/logo/axiom.png',
    categories: [
      'data'
    ],
    subcategory: 'enterprise-data',
    tags: [
      'AI',
      'enterprise',
      'synthesis'
    ],
    rating: '4.4',
    visits: '25000',
    dateAdded: '2024-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Speechify',
    description: 'AI-powered reading and text-to-speech platform for accessibility.',
    url: 'https://speechify.com',
    id: 'speechify',
    image: '/tool-screenshots/speechify.png',
    logo: '/logo/speechify.png',
    categories: [
      'audio'
    ],
    subcategory: 'text-to-speech',
    tags: [
      'AI',
      'TTS',
      'reading'
    ],
    rating: '4.3',
    visits: '60000',
    dateAdded: '2024-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Pictory',
    description: 'AI automated video editing and summaries platform.',
    url: 'https://pictory.ai',
    id: 'pictory',
    image: '/tool-screenshots/pictory.png',
    logo: '/logo/pictory.png',
    categories: [
      'video'
    ],
    subcategory: 'video-summaries',
    tags: [
      'AI',
      'summaries',
      'editing'
    ],
    rating: '4.4',
    visits: '80000',
    dateAdded: '2024-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Google DeepMind AlphaCode',
    description: 'AI system for competitive programming and code synthesis.',
    url: 'https://deepmind.com/blog/article/Competitive-programming-with-AlphaCode',
    id: 'alphacode',
    image: '/tool-screenshots/alphacode.png',
    logo: '/logo/alphacode.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-synthesis',
    tags: [
      'AI',
      'synthesis',
      'deep learning'
    ],
    rating: '4.8',
    visits: '2000000',
    dateAdded: '2024-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Amplify.ai',
    description: 'AI-powered conversational marketing & chatbots platform.',
    url: 'https://amplify.ai',
    id: 'amplify-ai',
    image: '/tool-screenshots/amplify-ai.png',
    logo: '/logo/amplify-ai.png',
    categories: [
      'marketing'
    ],
    subcategory: 'conversational-marketing',
    tags: [
      'AI',
      'chatbots',
      'conversational marketing'
    ],
    rating: '4.4',
    visits: '4000',
    dateAdded: '2024-02-15',
    isPremium: 'Free'
  },
  {
    name: 'TruEra',
    description: 'AI model validation, monitoring, and explainability platform.',
    url: 'https://truera.com',
    id: 'truera',
    image: '/tool-screenshots/truera.png',
    logo: '/logo/truera.png',
    categories: [
      'analytics'
    ],
    subcategory: 'model-validation',
    tags: [
      'AI',
      'model validation'
    ],
    rating: '4.4',
    visits: '30000',
    dateAdded: '2024-02-15',
    isPremium: 'Free'
  },
  {
    name: 'StreamSets DataOps Platform',
    description: 'Intelligent data pipeline automation platform.',
    url: 'https://streamsets.com',
    id: 'streamsets-dataops',
    image: '/tool-screenshots/streamsets-dataops.png',
    logo: '/logo/streamsets-dataops.png',
    categories: [
      'data'
    ],
    subcategory: 'dataops',
    tags: [
      'AI',
      'DataOps',
      'pipelines'
    ],
    rating: '4.5',
    visits: '30000',
    dateAdded: '2024-02-15',
    isPremium: 'Free'
  },
  {
    name: 'MLflow',
    description: 'ML lifecycle management and deployment platform.',
    url: 'https://mlflow.org',
    id: 'mlflow',
    image: '/tool-screenshots/mlflow.png',
    logo: '/logo/mlflow.png',
    categories: [
      'coding',
      'data'
    ],
    subcategory: 'ml-ops',
    tags: [
      'AI',
      'lifecycle',
      'ML Ops'
    ],
    rating: '4.5',
    visits: '1500000',
    dateAdded: '2024-02-01',
    isPremium: 'Free'
  },
  {
    name: 'Optimizely (formerly Episerver)',
    description: 'AI-driven experimentation & personalization platform.',
    url: 'https://www.optimizely.com',
    id: 'optimizely',
    image: '/tool-screenshots/optimizely.png',
    logo: '/logo/optimizely.png',
    categories: [
      'marketing'
    ],
    subcategory: 'personalization',
    tags: [
      'AI',
      'personalization',
      'experimentation'
    ],
    rating: '4.6',
    visits: '5000',
    dateAdded: '2024-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Alation',
    description: 'Enterprise data catalog with AI tagging.',
    url: 'https://www.alation.com',
    id: 'alation',
    image: '/tool-screenshots/alation.png',
    logo: '/logo/alation.png',
    categories: [
      'analytics'
    ],
    subcategory: 'data-catalog',
    tags: [
      'AI',
      'metadata',
      'catalog'
    ],
    rating: '4.5',
    visits: '40000',
    dateAdded: '2024-01-15',
    isPremium: 'Free'
  },
  {
    name: 'IBM DataStage',
    description: 'Enterprise data integration & processing platform.',
    url: 'https://www.ibm.com/products/datastage',
    id: 'ibm-datastage',
    image: '/tool-screenshots/ibm-datastage.png',
    logo: '/logo/ibm-datastage.png',
    categories: [
      'data'
    ],
    subcategory: 'enterprise-etl',
    tags: [
      'AI',
      'enterprise',
      'ETL'
    ],
    rating: '4.6',
    visits: '40000',
    dateAdded: '2024-01-15',
    isPremium: 'Free'
  },
  {
    name: 'iSpeech',
    description: 'Speech recognition and text-to-speech API services.',
    url: 'https://ispeech.org',
    id: 'ispeech',
    image: '/tool-screenshots/ispeech.png',
    logo: '/logo/ispeech.png',
    categories: [
      'audio'
    ],
    subcategory: 'speech-apis',
    tags: [
      'AI',
      'speech',
      'APIs'
    ],
    rating: '4.0',
    visits: '80000',
    dateAdded: '2024-01-15',
    isPremium: 'Free'
  },
  {
    name: 'ZMO.ai',
    description: 'AI-generated virtual humans and avatars platform.',
    url: 'https://zmo.ai',
    id: 'zmo-ai',
    image: '/tool-screenshots/zmo-ai.png',
    logo: '/logo/zmo-ai.png',
    categories: [
      'video'
    ],
    subcategory: 'virtual-avatars',
    tags: [
      'AI',
      'virtual avatars',
      'livestreams'
    ],
    rating: '4.0',
    visits: '100000',
    dateAdded: '2024-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Keras Tuner',
    description: 'Hyperparameter optimization tool with AI capabilities.',
    url: 'https://keras.io/keras_tuner',
    id: 'keras-tuner',
    image: '/tool-screenshots/keras-tuner.png',
    logo: '/logo/keras-tuner.png',
    categories: [
      'coding',
      'data'
    ],
    subcategory: 'optimization',
    tags: [
      'AI',
      'hyperparameters',
      'ML'
    ],
    rating: '4.1',
    visits: '400000',
    dateAdded: '2024-01-01',
    isPremium: 'Free'
  },
  {
    name: 'Unbounce Smart Traffic',
    description: 'AI-powered landing page optimization platform.',
    url: 'https://unbounce.com',
    id: 'unbounce',
    image: '/tool-screenshots/unbounce.png',
    logo: '/logo/unbounce.png',
    categories: [
      'marketing'
    ],
    subcategory: 'landing-pages',
    tags: [
      'AI',
      'landing pages',
      'CRO'
    ],
    rating: '4.5',
    visits: '6000',
    dateAdded: '2023-12-15',
    isPremium: 'Free'
  },
  {
    name: 'Mode Analytics',
    description: 'Collaborative data analysis and reporting platform.',
    url: 'https://mode.com',
    id: 'mode-analytics',
    image: '/tool-screenshots/mode-analytics.png',
    logo: '/logo/mode-analytics.png',
    categories: [
      'analytics'
    ],
    subcategory: 'collaborative-analysis',
    tags: [
      'AI',
      'collaboration',
      'reporting'
    ],
    rating: '4.3',
    visits: '50000',
    dateAdded: '2023-12-15',
    isPremium: 'Free'
  },
  {
    name: 'Matillion',
    description: 'Cloud-native ETL & data transformation platform.',
    url: 'https://www.matillion.com',
    id: 'matillion',
    image: '/tool-screenshots/matillion.png',
    logo: '/logo/matillion.png',
    categories: [
      'data'
    ],
    subcategory: 'cloud-etl',
    tags: [
      'AI',
      'cloud',
      'ETL'
    ],
    rating: '4.4',
    visits: '50000',
    dateAdded: '2023-12-15',
    isPremium: 'Free'
  },
  {
    name: 'Codota (Tabnine)',
    description: 'AI code completions for Java and JVM languages.',
    url: 'https://www.tabnine.com',
    id: 'codota',
    image: '/tool-screenshots/codota.png',
    logo: '/logo/codota.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-autocompletion',
    tags: [
      'AI',
      'Java',
      'IDE'
    ],
    rating: '4.2',
    visits: '600000',
    dateAdded: '2023-12-01',
    isPremium: 'Free'
  },
  {
    name: 'NotebookLM (Google)',
    description: 'AI-powered note-taking & knowledge management',
    url: 'https://notebooklm.google.com',
    id: 'notebook-lm',
    image: '/tool-screenshots/notebook-lm.png',
    logo: '/logo/notebook-lm.png',
    categories: [
      'research'
    ],
    subcategory: 'note-taking',
    tags: [
      'AI',
      'notes',
      'research'
    ],
    rating: '4.5',
    visits: '50000',
    dateAdded: '2023-12-01'
  },
  {
    name: 'VocalVine',
    description: 'AI-based voice & video content marketing platform.',
    url: 'https://www.vocalvine.com',
    id: 'vocalvine',
    image: '/tool-screenshots/vocalvine.png',
    logo: '/logo/vocalvine.png',
    categories: [
      'marketing'
    ],
    subcategory: 'content-marketing',
    tags: [
      'AI',
      'voice',
      'video marketing'
    ],
    rating: '4.3',
    visits: '8000',
    dateAdded: '2023-11-15',
    isPremium: 'Free'
  },
  {
    name: 'SciSpace (formerly Typeset)',
    description: 'AI-assisted academic research & paper writing',
    url: 'https://scispace.com',
    id: 'scispace',
    image: '/tool-screenshots/scispace.png',
    logo: '/logo/scispace.png',
    categories: [
      'research'
    ],
    subcategory: 'academic-writing',
    tags: [
      'AI',
      'academic',
      'research'
    ],
    rating: '4.6',
    visits: '45000',
    dateAdded: '2023-11-15'
  },
  {
    name: 'ThoughtSpot',
    description: 'Search and AI-powered analytics platform.',
    url: 'https://www.thoughtspot.com',
    id: 'thoughtspot',
    image: '/tool-screenshots/thoughtspot.png',
    logo: '/logo/thoughtspot.png',
    categories: [
      'analytics'
    ],
    subcategory: 'search-analytics',
    tags: [
      'AI',
      'search',
      'insights'
    ],
    rating: '4.6',
    visits: '60000',
    dateAdded: '2023-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Qlik Data Integration',
    description: 'Real-time data ingestion & transformation platform.',
    url: 'https://www.qlik.com/us/products/qlik-data-integration',
    id: 'qlik-data-integration',
    image: '/tool-screenshots/qlik-data-integration.png',
    logo: '/logo/qlik-data-integration.png',
    categories: [
      'data'
    ],
    subcategory: 'data-integration',
    tags: [
      'AI',
      'data integration',
      'real-time processing'
    ],
    rating: '4.5',
    visits: '60000',
    dateAdded: '2023-11-15',
    isPremium: 'Free'
  },
  {
    name: 'AI Voicechanger',
    description: 'Real-time voice conversion and modulation platform.',
    url: 'https://aivoicechanger.com',
    id: 'ai-voicechanger',
    image: '/tool-screenshots/ai-voicechanger.png',
    logo: '/logo/ai-voicechanger.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-modulation',
    tags: [
      'AI',
      'voice',
      'real-time'
    ],
    rating: '4.1',
    visits: '100000',
    dateAdded: '2023-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Deepfake Lab',
    description: 'Deepfake video generation and editing platform.',
    url: 'https://deepfakelab.com',
    id: 'deepfake-lab',
    image: '/tool-screenshots/deepfake-lab.png',
    logo: '/logo/deepfake-lab.png',
    categories: [
      'video'
    ],
    subcategory: 'deepfake',
    tags: [
      'AI',
      'deepfake',
      'synthetic video'
    ],
    rating: '4.1',
    visits: '150000',
    dateAdded: '2023-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Hugging Face Transformers',
    description: 'Library of pre-trained models for code and NLP tasks.',
    url: 'https://huggingface.co/docs/transformers',
    id: 'huggingface-transformers',
    image: '/tool-screenshots/huggingface-transformers.png',
    logo: '/logo/huggingface-transformers.png',
    categories: [
      'coding',
      'data'
    ],
    subcategory: 'models',
    tags: [
      'AI',
      'transformers',
      'models'
    ],
    rating: '4.7',
    visits: '3000000',
    dateAdded: '2023-11-01',
    isPremium: 'Free'
  },
  {
    name: 'DALL-E 3',
    description: 'Advanced AI image generation model that creates highly detailed and creative images from text prompts.',
    url: 'https://openai.com/dall-e-3',
    id: 'dall-e-3',
    image: '/tool-screenshots/dall-e-3.png',
    logo: '/logo/dall-e-3.png',
    categories: [
      'image',
      'design'
    ],
    subcategory: 'art-generation',
    tags: [
      'AI',
      'art',
      'image generation',
      'creative'
    ],
    rating: '4.8',
    visits: '4000000',
    dateAdded: '2023-10-20',
    isPremium: 'Free'
  },
  {
    name: 'Tlooto',
    description: 'AI research data collection & analysis',
    url: 'https://tlooto.com',
    id: 'tlooto',
    image: '/tool-screenshots/tlooto.png',
    logo: '/logo/tlooto.png',
    categories: [
      'research'
    ],
    subcategory: 'data-analysis',
    tags: [
      'AI',
      'data',
      'research'
    ],
    rating: '4.4',
    visits: '30000',
    dateAdded: '2023-10-20'
  },
  {
    name: 'Vennli',
    description: 'AI-driven strategic marketing & customer insights platform.',
    url: 'https://www.vennli.com',
    id: 'vennli',
    image: '/tool-screenshots/vennli.png',
    logo: '/logo/vennli.png',
    categories: [
      'marketing'
    ],
    subcategory: 'strategic-marketing',
    tags: [
      'AI',
      'strategy',
      'insights'
    ],
    rating: '4.2',
    visits: '10000',
    dateAdded: '2023-10-15',
    isPremium: 'Free'
  },
  {
    name: 'Sisense',
    description: 'Embedded analytics with AI-driven insights.',
    url: 'https://www.sisense.com',
    id: 'sisense',
    image: '/tool-screenshots/sisense.png',
    logo: '/logo/sisense.png',
    categories: [
      'analytics'
    ],
    subcategory: 'embedded-analytics',
    tags: [
      'AI',
      'embedded',
      'analytics'
    ],
    rating: '4.4',
    visits: '70000',
    dateAdded: '2023-10-15',
    isPremium: 'Free'
  },
  {
    name: 'Pentaho Data Integration (Kettle)',
    description: 'Open-source data processing & ETL platform.',
    url: 'https://www.hitachivantara.com/en-us/products/data-management-analytics/pentaho-platform/pentaho-data-integration.html',
    id: 'pentaho-data-integration',
    image: '/tool-screenshots/pentaho-data-integration.png',
    logo: '/logo/pentaho-data-integration.png',
    categories: [
      'data'
    ],
    subcategory: 'data-processing',
    tags: [
      'AI',
      'open-source',
      'ETL'
    ],
    rating: '4.3',
    visits: '70000',
    dateAdded: '2023-10-15',
    isPremium: 'Free'
  },
  {
    name: 'ML.NET',
    description: 'Machine learning framework for C# and .NET developers.',
    url: 'https://dotnet.microsoft.com/apps/machinelearning-ai/ml-dotnet',
    id: 'ml-net',
    image: '/tool-screenshots/ml-net.png',
    logo: '/logo/ml-net.png',
    categories: [
      'coding',
      'data'
    ],
    subcategory: 'ml-framework',
    tags: [
      'AI',
      '.NET',
      'ML'
    ],
    rating: '4.4',
    visits: '1000000',
    dateAdded: '2023-10-01',
    isPremium: 'Free'
  },
  {
    name: 'Persado',
    description: 'AI language & message optimization for marketing platform.',
    url: 'https://www.persado.com',
    id: 'persado',
    image: '/tool-screenshots/persado.png',
    logo: '/logo/persado.png',
    categories: [
      'marketing'
    ],
    subcategory: 'message-optimization',
    tags: [
      'AI',
      'messaging',
      'language'
    ],
    rating: '4.4',
    visits: '12000',
    dateAdded: '2023-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Semantic Scholar (AI features)',
    description: 'AI-enhanced literature search & discovery',
    url: 'https://semanticscholar.org',
    id: 'semantic-scholar',
    image: '/tool-screenshots/semantic-scholar.png',
    logo: '/logo/semantic-scholar.png',
    categories: [
      'research'
    ],
    subcategory: 'literature-search',
    tags: [
      'AI',
      'literature',
      'search'
    ],
    rating: '4.7',
    visits: '75000',
    dateAdded: '2023-09-15'
  },
  {
    name: 'Power BI (Microsoft)',
    description: 'AI-embedded analytics platform.',
    url: 'https://powerbi.microsoft.com',
    id: 'power-bi',
    image: '/tool-screenshots/power-bi.png',
    logo: '/logo/power-bi.png',
    categories: [
      'analytics'
    ],
    subcategory: 'business-intelligence',
    tags: [
      'AI',
      'BI',
      'Microsoft'
    ],
    rating: '4.5',
    visits: '80000',
    dateAdded: '2023-09-15',
    isPremium: 'Free'
  },
  {
    name: 'DataKitchen',
    description: 'DataOps automation & pipeline management platform.',
    url: 'https://datakitchen.io',
    id: 'datakitchen',
    image: '/tool-screenshots/datakitchen.png',
    logo: '/logo/datakitchen.png',
    categories: [
      'data'
    ],
    subcategory: 'dataops',
    tags: [
      'AI',
      'DataOps',
      'pipeline orchestration'
    ],
    rating: '4.4',
    visits: '80000',
    dateAdded: '2023-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Replicate',
    description: 'Platform for hosting and deploying AI voice models.',
    url: 'https://replicate.com',
    id: 'replicate',
    image: '/tool-screenshots/replicate.png',
    logo: '/logo/replicate.png',
    categories: [
      'audio'
    ],
    subcategory: 'model-deployment',
    tags: [
      'AI',
      'voice',
      'deployment'
    ],
    rating: '4.4',
    visits: '150000',
    dateAdded: '2023-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Waifu Labs',
    description: 'AI virtual character videos and animations platform.',
    url: 'https://waifulabs.com',
    id: 'waifu-labs',
    image: '/tool-screenshots/waifu-labs.png',
    logo: '/logo/waifu-labs.png',
    categories: [
      'video'
    ],
    subcategory: 'character-animation',
    tags: [
      'AI',
      'animation',
      'characters'
    ],
    rating: '4.2',
    visits: '200000',
    dateAdded: '2023-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Semantic Kernel (Microsoft)',
    description: 'AI SDK for automation and code integration.',
    url: 'https://github.com/microsoft/semantic-kernel',
    id: 'semantic-kernel',
    image: '/tool-screenshots/semantic-kernel.png',
    logo: '/logo/semantic-kernel.png',
    categories: [
      'coding'
    ],
    subcategory: 'sdk',
    tags: [
      'AI',
      'SDK',
      'automation'
    ],
    rating: '4.3',
    visits: '800000',
    dateAdded: '2023-09-01',
    isPremium: 'Free'
  },
  {
    name: 'Iris.ai',
    description: 'Scientific literature & research discovery',
    url: 'https://iris.ai',
    id: 'iris-ai',
    image: '/tool-screenshots/iris-ai.png',
    logo: '/logo/iris-ai.png',
    categories: [
      'research'
    ],
    subcategory: 'research-discovery',
    tags: [
      'AI',
      'literature',
      'scientific research'
    ],
    rating: '4.5',
    visits: '40000',
    dateAdded: '2023-08-20'
  },
  {
    name: 'AlluxiQA',
    description: 'AI-driven B2B marketing personalization platform.',
    url: 'https://www.alluxiqa.com',
    id: 'alluxiqa',
    image: '/tool-screenshots/alluxiqa.png',
    logo: '/logo/alluxiqa.png',
    categories: [
      'marketing'
    ],
    subcategory: 'b2b-marketing',
    tags: [
      'AI',
      'personalization',
      'B2B'
    ],
    rating: '4.3',
    visits: '15000',
    dateAdded: '2023-08-15',
    isPremium: 'Free'
  },
  {
    name: 'Tableau (with Einstein Analytics)',
    description: 'Visual analytics enhanced with AI capabilities.',
    url: 'https://www.tableau.com/products/einstein-analytics',
    id: 'tableau-einstein',
    image: '/tool-screenshots/tableau-einstein.png',
    logo: '/logo/tableau-einstein.png',
    categories: [
      'analytics'
    ],
    subcategory: 'visual-analytics',
    tags: [
      'AI',
      'visualization'
    ],
    rating: '4.7',
    visits: '90000',
    dateAdded: '2023-08-15',
    isPremium: 'Free'
  },
  {
    name: 'Vertica',
    description: 'High-speed analytics & data warehousing platform.',
    url: 'https://www.vertica.com',
    id: 'vertica',
    image: '/tool-screenshots/vertica.png',
    logo: '/logo/vertica.png',
    categories: [
      'data'
    ],
    subcategory: 'data-warehouse',
    tags: [
      'AI',
      'analytics',
      'high performance'
    ],
    rating: '4.7',
    visits: '90000',
    dateAdded: '2023-08-15',
    isPremium: 'Free'
  },
  {
    name: 'Salesforce Einstein',
    description: 'AI-powered CRM & marketing tools platform.',
    url: 'https://www.salesforce.com/products/einstein/overview',
    id: 'salesforce-einstein',
    image: '/tool-screenshots/salesforce-einstein.png',
    logo: '/logo/salesforce-einstein.png',
    categories: [
      'marketing'
    ],
    subcategory: 'crm',
    tags: [
      'AI',
      'CRM',
      'predictive analytics'
    ],
    rating: '4.7',
    visits: '18000',
    dateAdded: '2023-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Elicit (Ought)',
    description: 'AI research assistant for literature review & data collection',
    url: 'https://elicit.org',
    id: 'elicit',
    image: '/tool-screenshots/elicit.png',
    logo: '/logo/elicit.png',
    categories: [
      'research'
    ],
    subcategory: 'research-assistant',
    tags: [
      'AI',
      'literature',
      'research'
    ],
    rating: '4.6',
    visits: '55000',
    dateAdded: '2023-07-15'
  },
  {
    name: 'Qlik Sense',
    description: 'Data visualization and insights with AI features.',
    url: 'https://www.qlik.com/us/products/qlik-sense',
    id: 'qlik-sense',
    image: '/tool-screenshots/qlik-sense.png',
    logo: '/logo/qlik-sense.png',
    categories: [
      'analytics'
    ],
    subcategory: 'data-visualization',
    tags: [
      'AI',
      'BI',
      'visualization'
    ],
    rating: '4.6',
    visits: '100000',
    dateAdded: '2023-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Druid',
    description: 'Real-time analytics & data ingestion platform.',
    url: 'https://druid.apache.org',
    id: 'druid',
    image: '/tool-screenshots/druid.png',
    logo: '/logo/druid.png',
    categories: [
      'data'
    ],
    subcategory: 'real-time-analytics',
    tags: [
      'AI',
      'streaming',
      'analytics'
    ],
    rating: '4.5',
    visits: '100000',
    dateAdded: '2023-07-15',
    isPremium: 'Free'
  },
  {
    name: 'VoxScript',
    description: 'AI-powered script-to-speech conversion platform.',
    url: 'https://voxscript.ai',
    id: 'voxscript',
    image: '/tool-screenshots/voxscript.png',
    logo: '/logo/voxscript.png',
    categories: [
      'audio'
    ],
    subcategory: 'script-conversion',
    tags: [
      'AI',
      'script',
      'speech'
    ],
    rating: '4.2',
    visits: '200000',
    dateAdded: '2023-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Hour One',
    description: 'AI virtual characters for media and marketing.',
    url: 'https://hour.one',
    id: 'hour-one',
    image: '/tool-screenshots/hour-one.png',
    logo: '/logo/hour-one.png',
    categories: [
      'video'
    ],
    subcategory: 'virtual-characters',
    tags: [
      'AI',
      'virtual human',
      'media'
    ],
    rating: '4.3',
    visits: '300000',
    dateAdded: '2023-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Yellowbrick',
    description: 'ML model visualization tool for code debugging.',
    url: 'https://www.scikit-yb.org',
    id: 'yellowbrick',
    image: '/tool-screenshots/yellowbrick.png',
    logo: '/logo/yellowbrick.png',
    categories: [
      'coding',
      'data'
    ],
    subcategory: 'visualization',
    tags: [
      'AI',
      'visualization',
      'ML'
    ],
    rating: '4.0',
    visits: '200000',
    dateAdded: '2023-07-01',
    isPremium: 'Free'
  },
  {
    name: 'HubSpot',
    description: 'CRM & marketing with AI prediction & automation platform.',
    url: 'https://www.hubspot.com',
    id: 'hubspot',
    image: '/tool-screenshots/hubspot.png',
    logo: '/logo/hubspot.png',
    categories: [
      'marketing'
    ],
    subcategory: 'crm',
    tags: [
      'AI',
      'CRM',
      'automation'
    ],
    rating: '4.6',
    visits: '20000',
    dateAdded: '2023-06-15',
    isPremium: 'Free'
  },
  {
    name: 'Figma AI',
    description: 'AI-powered design tool that helps create and prototype user interfaces with advanced automation features.',
    url: 'https://www.figma.com',
    id: 'figma-ai',
    image: '/tool-screenshots/figma-ai.png',
    logo: '/logo/figma-ai.png',
    categories: [
      'design'
    ],
    subcategory: 'ui-design',
    tags: [
      'AI',
      'UI',
      'UX',
      'prototyping'
    ],
    rating: '4.8',
    visits: '5000000',
    dateAdded: '2023-06-15',
    isPremium: 'Free'
  },
  {
    name: 'Trifacta',
    description: 'Data wrangling with AI-driven data cleaning.',
    url: 'https://www.trifacta.com',
    id: 'trifacta',
    image: '/tool-screenshots/trifacta.png',
    logo: '/logo/trifacta.png',
    categories: [
      'analytics'
    ],
    subcategory: 'data-wrangling',
    tags: [
      'AI',
      'data cleaning',
      'wrangling'
    ],
    rating: '4.4',
    visits: '120000',
    dateAdded: '2023-06-15',
    isPremium: 'Free'
  },
  {
    name: 'Presto (Trino)',
    description: 'Distributed SQL query engine for big data.',
    url: 'https://trino.io',
    id: 'presto',
    image: '/tool-screenshots/presto.png',
    logo: '/logo/presto.png',
    categories: [
      'data'
    ],
    subcategory: 'query-engine',
    tags: [
      'AI',
      'SQL',
      'distributed processing'
    ],
    rating: '4.6',
    visits: '120000',
    dateAdded: '2023-06-15',
    isPremium: 'Free'
  },
  {
    name: 'Marketo (Adobe)',
    description: 'Marketing automation with AI features platform.',
    url: 'https://www.marketo.com',
    id: 'marketo',
    image: '/tool-screenshots/marketo.png',
    logo: '/logo/marketo.png',
    categories: [
      'marketing'
    ],
    subcategory: 'marketing-automation',
    tags: [
      'AI',
      'marketing automation'
    ],
    rating: '4.5',
    visits: '25000',
    dateAdded: '2023-05-15',
    isPremium: 'Free'
  },
  {
    name: 'ResearchRabbit',
    description: 'Visual exploration of research papers with AI',
    url: 'https://researchrabbit.ai',
    id: 'research-rabbit',
    image: '/tool-screenshots/research-rabbit.png',
    logo: '/logo/research-rabbit.png',
    categories: [
      'research'
    ],
    subcategory: 'research-exploration',
    tags: [
      'AI',
      'research',
      'exploration'
    ],
    rating: '4.4',
    visits: '35000',
    dateAdded: '2023-05-15'
  },
  {
    name: 'Snowflake',
    description: 'Cloud data platform with AI integration.',
    url: 'https://www.snowflake.com',
    id: 'snowflake',
    image: '/tool-screenshots/snowflake.png',
    logo: '/logo/snowflake.png',
    categories: [
      'data'
    ],
    subcategory: 'data-warehouse',
    tags: [
      'AI',
      'data warehouse',
      'cloud'
    ],
    rating: '4.8',
    visits: '150000',
    dateAdded: '2023-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Dataiku',
    description: 'Collaborative Data Science and ML platform.',
    url: 'https://www.dataiku.com',
    id: 'dataiku',
    image: '/tool-screenshots/dataiku.png',
    logo: '/logo/dataiku.png',
    categories: [
      'analytics'
    ],
    subcategory: 'collaborative-ml',
    tags: [
      'AI',
      'enterprise',
      'collaboration'
    ],
    rating: '4.5',
    visits: '150000',
    dateAdded: '2023-05-15',
    isPremium: 'Free'
  },
  {
    name: 'WellSaid Labs',
    description: 'Professional AI voice synthesis platform for enterprise use.',
    url: 'https://wellsaidlabs.com',
    id: 'wellsaid-labs',
    image: '/tool-screenshots/wellsaid-labs.png',
    logo: '/logo/wellsaid-labs.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-synthesis',
    tags: [
      'AI',
      'voice',
      'professional'
    ],
    rating: '4.5',
    visits: '300000',
    dateAdded: '2023-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Rephrase.ai',
    description: 'AI video personalization and actor synthesis platform.',
    url: 'https://www.rephrase.ai',
    id: 'rephrase-ai',
    image: '/tool-screenshots/rephrase-ai.png',
    logo: '/logo/rephrase-ai.png',
    categories: [
      'video'
    ],
    subcategory: 'video-personalization',
    tags: [
      'AI',
      'personalization',
      'synthesis'
    ],
    rating: '4.4',
    visits: '400000',
    dateAdded: '2023-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Jina AI',
    description: 'Neural search and multimedia pipelines platform.',
    url: 'https://jina.ai',
    id: 'jina-ai',
    image: '/tool-screenshots/jina-ai.png',
    logo: '/logo/jina-ai.png',
    categories: [
      'coding',
      'data'
    ],
    subcategory: 'neural-search',
    tags: [
      'AI',
      'search',
      'neural network'
    ],
    rating: '4.4',
    visits: '500000',
    dateAdded: '2023-05-01',
    isPremium: 'Free'
  },
  {
    name: 'Connected Papers',
    description: 'Visual graph of related research papers',
    url: 'https://connectedpapers.com',
    id: 'connected-papers',
    image: '/tool-screenshots/connected-papers.png',
    logo: '/logo/connected-papers.png',
    categories: [
      'research'
    ],
    subcategory: 'research-visualization',
    tags: [
      'AI',
      'literature',
      'visualization'
    ],
    rating: '4.5',
    visits: '45000',
    dateAdded: '2023-04-20'
  },
  {
    name: 'InsideView',
    description: 'AI market & customer intelligence platform.',
    url: 'https://www.insideview.com',
    id: 'insideview',
    image: '/tool-screenshots/insideview.png',
    logo: '/logo/insideview.png',
    categories: [
      'marketing'
    ],
    subcategory: 'market-intelligence',
    tags: [
      'AI',
      'market research'
    ],
    rating: '4.4',
    visits: '30000',
    dateAdded: '2023-04-15',
    isPremium: 'Free'
  },
  {
    name: 'H2O.ai',
    description: 'Open-source AI and machine learning platform.',
    url: 'https://www.h2o.ai',
    id: 'h2o-ai',
    image: '/tool-screenshots/h2o-ai.png',
    logo: '/logo/h2o-ai.png',
    categories: [
      'analytics'
    ],
    subcategory: 'open-source-ml',
    tags: [
      'AI',
      'open-source',
      'ML'
    ],
    rating: '4.6',
    visits: '180000',
    dateAdded: '2023-04-15',
    isPremium: 'Free'
  },
  {
    name: 'ClickHouse',
    description: 'Real-time analytics database.',
    url: 'https://clickhouse.com',
    id: 'clickhouse',
    image: '/tool-screenshots/clickhouse.png',
    logo: '/logo/clickhouse.png',
    categories: [
      'data'
    ],
    subcategory: 'analytics-db',
    tags: [
      'AI',
      'analysis',
      'real-time'
    ],
    rating: '4.7',
    visits: '180000',
    dateAdded: '2023-04-15',
    isPremium: 'Free'
  },
  {
    name: 'Adobe Firefly',
    description: 'Adobe's AI-powered tool for creating creative assets and image design.',
    url: 'https://firefly.adobe.com',
    id: 'adobe-firefly',
    image: '/tool-screenshots/adobe-firefly.png',
    logo: '/logo/adobe-firefly.png',
    categories: [
      'image',
      'design'
    ],
    subcategory: 'creative-assets',
    tags: [
      'AI',
      'Adobe',
      'graphic design'
    ],
    rating: '4.7',
    visits: '5000000',
    dateAdded: '2023-03-21',
    isPremium: 'Free'
  },
  {
    name: 'LeadGenius',
    description: 'AI-driven lead generation & data enrichment platform.',
    url: 'https://www.leadgenius.com',
    id: 'leadgenius',
    image: '/tool-screenshots/leadgenius.png',
    logo: '/logo/leadgenius.png',
    categories: [
      'marketing'
    ],
    subcategory: 'lead-generation',
    tags: [
      'AI',
      'lead generation'
    ],
    rating: '4.3',
    visits: '35000',
    dateAdded: '2023-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Litmaps',
    description: 'Research trail tracking & visualization via AI',
    url: 'https://litmaps.com',
    id: 'litmaps',
    image: '/tool-screenshots/litmaps.png',
    logo: '/logo/litmaps.png',
    categories: [
      'research'
    ],
    subcategory: 'research-tracking',
    tags: [
      'AI',
      'literature',
      'tracking'
    ],
    rating: '4.3',
    visits: '30000',
    dateAdded: '2023-03-15'
  },
  {
    name: 'AWS SageMaker',
    description: 'Comprehensive ML model lifecycle management platform.',
    url: 'https://aws.amazon.com/sagemaker',
    id: 'aws-sagemaker',
    image: '/tool-screenshots/aws-sagemaker.png',
    logo: '/logo/aws-sagemaker.png',
    categories: [
      'analytics'
    ],
    subcategory: 'ml-platform',
    tags: [
      'AI',
      'AWS',
      'ML'
    ],
    rating: '4.7',
    visits: '200000',
    dateAdded: '2023-03-15',
    isPremium: 'Free'
  },
  {
    name: 'KDB+/Q',
    description: 'Ultra-fast time series & financial data processing.',
    url: 'https://kx.com',
    id: 'kdb-q',
    image: '/tool-screenshots/kdb-q.png',
    logo: '/logo/kdb-q.png',
    categories: [
      'data'
    ],
    subcategory: 'time-series',
    tags: [
      'AI',
      'time-series',
      'high-frequency'
    ],
    rating: '4.6',
    visits: '200000',
    dateAdded: '2023-03-15',
    isPremium: 'Free'
  },
  {
    name: 'LOVO Studio',
    description: 'Custom voice creation and editing platform powered by AI.',
    url: 'https://lovo.ai/studio',
    id: 'lovo-studio',
    image: '/tool-screenshots/lovo-studio.png',
    logo: '/logo/lovo-studio.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-creation',
    tags: [
      'AI',
      'voice',
      'studio'
    ],
    rating: '4.0',
    visits: '400000',
    dateAdded: '2023-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Sourcery',
    description: 'AI-powered Python refactoring and code improvement tool.',
    url: 'https://sourcery.ai',
    id: 'sourcery',
    image: '/tool-screenshots/sourcery.png',
    logo: '/logo/sourcery.png',
    categories: [
      'coding'
    ],
    subcategory: 'refactoring',
    tags: [
      'AI',
      'Python',
      'refactoring'
    ],
    rating: '4.3',
    visits: '700000',
    dateAdded: '2023-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Cursor',
    description: 'AI-powered code completion and suggestions for developers.',
    url: 'https://cursor.sh',
    id: 'cursor',
    image: '/tool-screenshots/cursor.png',
    logo: '/logo/cursor.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-autocompletion',
    tags: [
      'AI',
      'IDE',
      'developer tools'
    ],
    rating: '4.6',
    visits: '2500000',
    dateAdded: '2023-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Sketch AI',
    description: 'AI-assisted vector graphic design tool for professional designers.',
    url: 'https://www.sketch.com',
    id: 'sketch-ai',
    image: '/tool-screenshots/sketch-ai.png',
    logo: '/logo/sketch-ai.png',
    categories: [
      'design'
    ],
    subcategory: 'vector-design',
    tags: [
      'AI',
      'vector',
      'design'
    ],
    rating: '4.6',
    visits: '3000000',
    dateAdded: '2023-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Meta\\'s Research & AI tools',
    description: 'Various academic & scientific tools',
    url: 'https://ai.meta.com/research',
    id: 'meta-research',
    image: '/tool-screenshots/meta-research.png',
    logo: '/logo/meta-research.png',
    categories: [
      'research'
    ],
    subcategory: 'research-tools',
    tags: [
      'AI',
      'research',
      'scientific'
    ],
    rating: '4.7',
    visits: '80000',
    dateAdded: '2023-02-20'
  },
  {
    name: 'Crush Card',
    description: 'AI lead scoring & customer segmentation platform.',
    url: 'https://crushcard.com',
    id: 'crush-card',
    image: '/tool-screenshots/crush-card.png',
    logo: '/logo/crush-card.png',
    categories: [
      'marketing'
    ],
    subcategory: 'lead-scoring',
    tags: [
      'AI',
      'lead scoring',
      'segmentation'
    ],
    rating: '4.2',
    visits: '40000',
    dateAdded: '2023-02-15',
    isPremium: 'Free'
  },
  {
    name: 'Apache NiFi',
    description: 'Real-time data routing & transformation platform.',
    url: 'https://nifi.apache.org',
    id: 'apache-nifi',
    image: '/tool-screenshots/apache-nifi.png',
    logo: '/logo/apache-nifi.png',
    categories: [
      'data'
    ],
    subcategory: 'data-flow',
    tags: [
      'AI',
      'streaming',
      'data flow'
    ],
    rating: '4.5',
    visits: '250000',
    dateAdded: '2023-02-15',
    isPremium: 'Free'
  },
  {
    name: 'CodeGen',
    description: 'Transformer models for code synthesis and generation.',
    url: 'https://github.com/salesforce/CodeGen',
    id: 'codegen',
    image: '/tool-screenshots/codegen.png',
    logo: '/logo/codegen.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-generation',
    tags: [
      'AI',
      'deep learning',
      'models'
    ],
    rating: '4.2',
    visits: '600000',
    dateAdded: '2023-02-01',
    isPremium: 'Free'
  },
  {
    name: 'Canva AI',
    description: 'AI-powered graphic design platform for creating professional images and templates.',
    url: 'https://canva.com',
    id: 'canva-ai',
    image: '/tool-screenshots/canva-ai.png',
    logo: '/logo/canva-ai.png',
    categories: [
      'image',
      'design'
    ],
    subcategory: 'graphic-design',
    tags: [
      'AI',
      'design',
      'graphics',
      'templates'
    ],
    rating: '4.6',
    visits: '8000000',
    dateAdded: '2023-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Runway ML',
    description: 'AI tools for video editing, effects, and synthesis.',
    url: 'https://runwayml.com',
    id: 'runway-ml',
    image: '/tool-screenshots/runway-ml.png',
    logo: '/logo/runway-ml.png',
    categories: [
      'video'
    ],
    subcategory: 'video-effects',
    tags: [
      'AI',
      'video',
      'multimedia'
    ],
    rating: '4.6',
    visits: '600000',
    dateAdded: '2023-01-15',
    isPremium: 'Free'
  },
  {
    name: 'InVision AI',
    description: 'AI-driven prototyping and collaboration platform for design teams.',
    url: 'https://www.invisionapp.com',
    id: 'invision-ai',
    image: '/tool-screenshots/invision-ai.png',
    logo: '/logo/invision-ai.png',
    categories: [
      'design'
    ],
    subcategory: 'prototyping',
    tags: [
      'AI',
      'prototyping',
      'collaboration'
    ],
    rating: '4.5',
    visits: '2500000',
    dateAdded: '2023-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Crayon',
    description: 'Competitive intelligence with AI insights platform.',
    url: 'https://www.crayon.co',
    id: 'crayon',
    image: '/tool-screenshots/crayon.png',
    logo: '/logo/crayon.png',
    categories: [
      'marketing'
    ],
    subcategory: 'competitive-intelligence',
    tags: [
      'AI',
      'competitive analysis'
    ],
    rating: '4.4',
    visits: '50000',
    dateAdded: '2023-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Scite.ai',
    description: 'Smart citation & research validation using AI',
    url: 'https://scite.ai',
    id: 'scite-ai',
    image: '/tool-screenshots/scite-ai.png',
    logo: '/logo/scite-ai.png',
    categories: [
      'research'
    ],
    subcategory: 'citation-tools',
    tags: [
      'AI',
      'citations',
      'validation'
    ],
    rating: '4.6',
    visits: '50000',
    dateAdded: '2023-01-15'
  },
  {
    name: 'IBM Watsonx',
    description: 'Enterprise AI and advanced analytics platform.',
    url: 'https://www.ibm.com/watsonx',
    id: 'ibm-watsonx',
    image: '/tool-screenshots/ibm-watsonx.png',
    logo: '/logo/ibm-watsonx.png',
    categories: [
      'analytics'
    ],
    subcategory: 'enterprise-ai',
    tags: [
      'AI',
      'enterprise',
      'Watson'
    ],
    rating: '4.5',
    visits: '300000',
    dateAdded: '2023-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Stitch Data',
    description: 'Simple ETL platform with AI & automation.',
    url: 'https://www.stitchdata.com',
    id: 'stitch-data',
    image: '/tool-screenshots/stitch-data.png',
    logo: '/logo/stitch-data.png',
    categories: [
      'data'
    ],
    subcategory: 'data-pipeline',
    tags: [
      'AI',
      'data pipeline',
      'ETL'
    ],
    rating: '4.4',
    visits: '300000',
    dateAdded: '2023-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Speechelo',
    description: 'AI voiceover platform for videos and presentations.',
    url: 'https://speechelo.com',
    id: 'speechelo',
    image: '/tool-screenshots/speechelo.png',
    logo: '/logo/speechelo.png',
    categories: [
      'audio'
    ],
    subcategory: 'voiceover',
    tags: [
      'AI',
      'voice',
      'video'
    ],
    rating: '4.1',
    visits: '600000',
    dateAdded: '2023-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Ref-N-Write',
    description: 'AI-powered academic writing & style assistance',
    url: 'https://ref-n-write.com',
    id: 'ref-n-write',
    image: '/tool-screenshots/ref-n-write.png',
    logo: '/logo/ref-n-write.png',
    categories: [
      'research'
    ],
    subcategory: 'academic-writing',
    tags: [
      'AI',
      'writing',
      'academic'
    ],
    rating: '4.4',
    visits: '35000',
    dateAdded: '2022-12-20'
  },
  {
    name: 'Hootsuite Insights',
    description: 'AI-powered social analytics platform.',
    url: 'https://hootsuite.com/products/insights',
    id: 'hootsuite-insights',
    image: '/tool-screenshots/hootsuite-insights.png',
    logo: '/logo/hootsuite-insights.png',
    categories: [
      'marketing'
    ],
    subcategory: 'social-analytics',
    tags: [
      'AI',
      'social media',
      'analytics'
    ],
    rating: '4.3',
    visits: '60000',
    dateAdded: '2022-12-15',
    isPremium: 'Free'
  },
  {
    name: 'Azure Machine Learning',
    description: 'Scalable AI and machine learning platform.',
    url: 'https://azure.microsoft.com/services/machine-learning',
    id: 'azure-machine-learning',
    image: '/tool-screenshots/azure-machine-learning.png',
    logo: '/logo/azure-machine-learning.png',
    categories: [
      'analytics'
    ],
    subcategory: 'cloud-ml',
    tags: [
      'AI',
      'Azure',
      'cloud'
    ],
    rating: '4.6',
    visits: '400000',
    dateAdded: '2022-12-15',
    isPremium: 'Free'
  },
  {
    name: 'Fivetran',
    description: 'Fully automated data pipeline & ingestion platform.',
    url: 'https://fivetran.com',
    id: 'fivetran',
    image: '/tool-screenshots/fivetran.png',
    logo: '/logo/fivetran.png',
    categories: [
      'data'
    ],
    subcategory: 'data-integration',
    tags: [
      'AI',
      'ETL',
      'data integration'
    ],
    rating: '4.6',
    visits: '400000',
    dateAdded: '2022-12-15',
    isPremium: 'Free'
  },
  {
    name: 'PyCaret',
    description: 'AutoML platform for machine learning and coding pipelines.',
    url: 'https://pycaret.org',
    id: 'pycaret',
    image: '/tool-screenshots/pycaret.png',
    logo: '/logo/pycaret.png',
    categories: [
      'coding',
      'data'
    ],
    subcategory: 'automl',
    tags: [
      'AI',
      'AutoML',
      'Python'
    ],
    rating: '4.5',
    visits: '1200000',
    dateAdded: '2022-12-01',
    isPremium: 'Free'
  },
  {
    name: 'Sprout Social',
    description: 'Social media management with AI insights platform.',
    url: 'https://sproutsocial.com',
    id: 'sprout-social',
    image: '/tool-screenshots/sprout-social.png',
    logo: '/logo/sprout-social.png',
    categories: [
      'marketing'
    ],
    subcategory: 'social-management',
    tags: [
      'AI',
      'social media',
      'management'
    ],
    rating: '4.6',
    visits: '70000',
    dateAdded: '2022-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Semantic Scholar TLDR',
    description: 'Quick summaries & research highlights',
    url: 'https://semanticscholar.org/tldr',
    id: 'semantic-scholar-tldr',
    image: '/tool-screenshots/semantic-scholar-tldr.png',
    logo: '/logo/semantic-scholar-tldr.png',
    categories: [
      'research'
    ],
    subcategory: 'research-summaries',
    tags: [
      'AI',
      'summaries',
      'research'
    ],
    rating: '4.5',
    visits: '40000',
    dateAdded: '2022-11-15'
  },
  {
    name: 'Google BigQuery ML',
    description: 'Integrated machine learning within cloud data warehouse.',
    url: 'https://cloud.google.com/bigquery-ml',
    id: 'google-bigquery-ml',
    image: '/tool-screenshots/google-bigquery-ml.png',
    logo: '/logo/google-bigquery-ml.png',
    categories: [
      'analytics'
    ],
    subcategory: 'cloud-ml',
    tags: [
      'AI',
      'BigQuery',
      'ML'
    ],
    rating: '4.7',
    visits: '500000',
    dateAdded: '2022-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Azure Data Factory',
    description: 'Cloud-native data pipeline orchestration service.',
    url: 'https://azure.microsoft.com/services/data-factory',
    id: 'azure-data-factory',
    image: '/tool-screenshots/azure-data-factory.png',
    logo: '/logo/azure-data-factory.png',
    categories: [
      'data'
    ],
    subcategory: 'cloud-data',
    tags: [
      'AI',
      'cloud',
      'data flow'
    ],
    rating: '4.5',
    visits: '500000',
    dateAdded: '2022-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Lovo AI',
    description: 'AI voice generation platform for content creators and media professionals.',
    url: 'https://lovo.ai',
    id: 'lovo-ai',
    image: '/tool-screenshots/lovo-ai.png',
    logo: '/logo/lovo-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-generation',
    tags: [
      'AI',
      'voice',
      'content'
    ],
    rating: '4.2',
    visits: '800000',
    dateAdded: '2022-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Colossyan Creator',
    description: 'AI avatars and video content creation platform.',
    url: 'https://www.colossyan.com',
    id: 'colossyan-creator',
    image: '/tool-screenshots/colossyan-creator.png',
    logo: '/logo/colossyan-creator.png',
    categories: [
      'video'
    ],
    subcategory: 'avatar-creation',
    tags: [
      'AI',
      'avatars',
      'video'
    ],
    rating: '4.0',
    visits: '800000',
    dateAdded: '2022-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Loom AI',
    description: 'Screen recording and video messaging with AI tools.',
    url: 'https://loom.com',
    id: 'loom-ai',
    image: '/tool-screenshots/loom-ai.png',
    logo: '/logo/loom-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'screen-recording',
    tags: [
      'AI',
      'video',
      'screen recording'
    ],
    rating: '4.3',
    visits: '2500000',
    dateAdded: '2022-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Lensa AI',
    description: 'AI-powered portrait and photo editing app.',
    url: 'https://lensa-ai.com',
    id: 'lensa-ai',
    image: '/tool-screenshots/lensa-ai.png',
    logo: '/logo/lensa-ai.png',
    categories: [
      'image'
    ],
    subcategory: 'portrait',
    tags: [
      'AI',
      'portrait',
      'editing'
    ],
    rating: '4.5',
    visits: '4000000',
    dateAdded: '2022-11-01',
    isPremium: 'Free'
  },
  {
    name: 'ChatCode',
    description: 'Interactive AI coding chatbot for developer support.',
    url: 'https://chatcode.ai',
    id: 'chatcode',
    image: '/tool-screenshots/chatcode.png',
    logo: '/logo/chatcode.png',
    categories: [
      'coding'
    ],
    subcategory: 'chatbot',
    tags: [
      'AI',
      'chatbot',
      'developer support'
    ],
    rating: '4.3',
    visits: '800000',
    dateAdded: '2022-11-01',
    isPremium: 'Free'
  },
  {
    name: 'Uizard',
    description: 'AI-assisted wireframing and app design platform for rapid prototyping.',
    url: 'https://uizard.io',
    id: 'uizard',
    image: '/tool-screenshots/uizard.png',
    logo: '/logo/uizard.png',
    categories: [
      'design'
    ],
    subcategory: 'wireframing',
    tags: [
      'AI',
      'wireframing',
      'app design'
    ],
    rating: '4.4',
    visits: '2000000',
    dateAdded: '2022-11-01',
    isPremium: 'Free'
  },
  {
    name: 'DeepDyve',
    description: 'AI-enhanced access & search for scientific articles',
    url: 'https://deepdyve.com',
    id: 'deepdyve',
    image: '/tool-screenshots/deepdyve.png',
    logo: '/logo/deepdyve.png',
    categories: [
      'research'
    ],
    subcategory: 'article-access',
    tags: [
      'AI',
      'search',
      'scientific'
    ],
    rating: '4.3',
    visits: '30000',
    dateAdded: '2022-10-20'
  },
  {
    name: 'NetBase Quid',
    description: 'AI social media & consumer insights platform.',
    url: 'https://www.quid.com',
    id: 'netbase-quid',
    image: '/tool-screenshots/netbase-quid.png',
    logo: '/logo/netbase-quid.png',
    categories: [
      'marketing'
    ],
    subcategory: 'social-insights',
    tags: [
      'AI',
      'social media',
      'insights'
    ],
    rating: '4.5',
    visits: '80000',
    dateAdded: '2022-10-15',
    isPremium: 'Free'
  },
  {
    name: 'Domino Data Lab',
    description: 'Enterprise data science and model management platform.',
    url: 'https://www.dominodatalab.com',
    id: 'domino-data-lab',
    image: '/tool-screenshots/domino-data-lab.png',
    logo: '/logo/domino-data-lab.png',
    categories: [
      'analytics'
    ],
    subcategory: 'model-management',
    tags: [
      'AI',
      'ML',
      'enterprise'
    ],
    rating: '4.6',
    visits: '600000',
    dateAdded: '2022-10-15',
    isPremium: 'Free'
  },
  {
    name: 'Google Cloud Dataflow',
    description: 'Serverless data stream & batch processing service.',
    url: 'https://cloud.google.com/dataflow',
    id: 'google-cloud-dataflow',
    image: '/tool-screenshots/google-cloud-dataflow.png',
    logo: '/logo/google-cloud-dataflow.png',
    categories: [
      'data'
    ],
    subcategory: 'cloud-data',
    tags: [
      'AI',
      'cloud',
      'stream/batch'
    ],
    rating: '4.7',
    visits: '600000',
    dateAdded: '2022-10-15',
    isPremium: 'Free'
  },
  {
    name: 'Toongineer Cartoonizer',
    description: 'AI tool for transforming photos into cartoon-style images.',
    url: 'https://toongineer.com',
    id: 'toongineer-cartoonizer',
    image: '/tool-screenshots/toongineer-cartoonizer.png',
    logo: '/logo/toongineer-cartoonizer.png',
    categories: [
      'image'
    ],
    subcategory: 'cartoon',
    tags: [
      'AI',
      'cartoon',
      'stylization'
    ],
    rating: '4.2',
    visits: '1000000',
    dateAdded: '2022-10-01',
    isPremium: 'Free'
  },
  {
    name: 'AI4Code',
    description: 'AI platform for automated code reviews and suggestions.',
    url: 'https://ai4code.com',
    id: 'ai4code',
    image: '/tool-screenshots/ai4code.png',
    logo: '/logo/ai4code.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-review',
    tags: [
      'AI',
      'review',
      'QA'
    ],
    rating: '4.1',
    visits: '400000',
    dateAdded: '2022-10-01',
    isPremium: 'Free'
  },
  {
    name: 'Visily',
    description: 'AI-driven UI creation and prototyping tool for modern applications.',
    url: 'https://www.visily.ai',
    id: 'visily',
    image: '/tool-screenshots/visily.png',
    logo: '/logo/visily.png',
    categories: [
      'design'
    ],
    subcategory: 'ui-creation',
    tags: [
      'AI',
      'UI',
      'prototyping'
    ],
    rating: '4.3',
    visits: '1500000',
    dateAdded: '2022-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Crimson Hexagon (now part of Brandwatch)',
    description: 'AI sentiment & market analysis platform.',
    url: 'https://www.brandwatch.com',
    id: 'crimson-hexagon',
    image: '/tool-screenshots/crimson-hexagon.png',
    logo: '/logo/crimson-hexagon.png',
    categories: [
      'marketing'
    ],
    subcategory: 'market-analysis',
    tags: [
      'AI',
      'sentiment',
      'market research'
    ],
    rating: '4.4',
    visits: '90000',
    dateAdded: '2022-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Consensus AI',
    description: 'Smart search engine for scientific research',
    url: 'https://consensus.app',
    id: 'consensus-ai',
    image: '/tool-screenshots/consensus-ai.png',
    logo: '/logo/consensus-ai.png',
    categories: [
      'research'
    ],
    subcategory: 'research-search',
    tags: [
      'AI',
      'search',
      'scientific'
    ],
    rating: '4.6',
    visits: '55000',
    dateAdded: '2022-09-15'
  },
  {
    name: 'BigML',
    description: 'Accessible machine learning and predictive analytics platform.',
    url: 'https://bigml.com',
    id: 'bigml',
    image: '/tool-screenshots/bigml.png',
    logo: '/logo/bigml.png',
    categories: [
      'analytics'
    ],
    subcategory: 'predictive-analytics',
    tags: [
      'AI',
      'ML',
      'predictive modeling'
    ],
    rating: '4.3',
    visits: '700000',
    dateAdded: '2022-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Informatica Intelligent Data Management',
    description: 'Enterprise data processing & quality platform.',
    url: 'https://www.informatica.com/products/information-platform/intelligent-data-management.html',
    id: 'informatica-intelligent-data-management',
    image: '/tool-screenshots/informatica-intelligent-data-management.png',
    logo: '/logo/informatica-intelligent-data-management.png',
    categories: [
      'data'
    ],
    subcategory: 'data-governance',
    tags: [
      'AI',
      'data governance'
    ],
    rating: '4.6',
    visits: '700000',
    dateAdded: '2022-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Play.ht',
    description: 'Advanced text-to-speech conversion platform with natural-sounding voices.',
    url: 'https://play.ht',
    id: 'play-ht',
    image: '/tool-screenshots/play-ht.png',
    logo: '/logo/play-ht.png',
    categories: [
      'audio'
    ],
    subcategory: 'text-to-speech',
    tags: [
      'AI',
      'TTS',
      'voice synthesis'
    ],
    rating: '4.3',
    visits: '1000000',
    dateAdded: '2022-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Deepbrain AI',
    description: 'AI-generated virtual presenters and video synthesis platform.',
    url: 'https://www.deepbrain.io',
    id: 'deepbrain-ai',
    image: '/tool-screenshots/deepbrain-ai.png',
    logo: '/logo/deepbrain-ai.png',
    categories: [
      'video'
    ],
    subcategory: 'virtual-presenters',
    tags: [
      'AI',
      'virtual humans',
      'video synthesis'
    ],
    rating: '4.1',
    visits: '1000000',
    dateAdded: '2022-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Scribe AI',
    description: 'Automatic process documentation and training material platform.',
    url: 'https://scribe.ai',
    id: 'scribe-ai',
    image: '/tool-screenshots/scribe-ai.png',
    logo: '/logo/scribe-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'documentation',
    tags: [
      'AI',
      'documentation',
      'training'
    ],
    rating: '4.4',
    visits: '3000000',
    dateAdded: '2022-09-15',
    isPremium: 'Free'
  },
  {
    name: 'NightCafe',
    description: 'AI platform for artistic style transfer and image creation.',
    url: 'https://nightcafe.studio',
    id: 'nightcafe',
    image: '/tool-screenshots/nightcafe.png',
    logo: '/logo/nightcafe.png',
    categories: [
      'image'
    ],
    subcategory: 'artistic',
    tags: [
      'AI',
      'art',
      'style transfer'
    ],
    rating: '4.3',
    visits: '1800000',
    dateAdded: '2022-09-01',
    isPremium: 'Free'
  },
  {
    name: 'Leonardo AI',
    description: 'AI platform for generating realistic and artistic images with high quality.',
    url: 'https://leonardo.ai',
    id: 'leonardo-ai',
    image: '/tool-screenshots/leonardo-ai.png',
    logo: '/logo/leonardo-ai.png',
    categories: [
      'image'
    ],
    subcategory: 'realistic-art',
    tags: [
      'AI',
      'realistic',
      'art',
      'generation'
    ],
    rating: '4.6',
    visits: '4000000',
    dateAdded: '2022-09-01',
    isPremium: 'Free'
  },
  {
    name: 'Stable Diffusion',
    description: 'Open-source AI model for generating high-quality images from text descriptions.',
    url: 'https://stability.ai',
    id: 'stable-diffusion',
    image: '/tool-screenshots/stable-diffusion.png',
    logo: '/logo/stable-diffusion.png',
    categories: [
      'image'
    ],
    subcategory: 'open-source',
    tags: [
      'AI',
      'open-source',
      'art',
      'creative'
    ],
    rating: '4.5',
    visits: '6000000',
    dateAdded: '2022-08-22',
    isPremium: 'Free'
  },
  {
    name: 'Perplexity AI',
    description: 'Search & summarize research data from multiple domains',
    url: 'https://perplexity.ai',
    id: 'perplexity-ai',
    image: '/tool-screenshots/perplexity-ai.png',
    logo: '/logo/perplexity-ai.png',
    categories: [
      'research'
    ],
    subcategory: 'research-search',
    tags: [
      'AI',
      'search',
      'research'
    ],
    rating: '4.7',
    visits: '70000',
    dateAdded: '2022-08-20'
  },
  {
    name: 'CodeT5',
    description: 'Multi-language code understanding and generation model.',
    url: 'https://github.com/salesforce/CodeT5',
    id: 'codet5',
    image: '/tool-screenshots/codet5.png',
    logo: '/logo/codet5.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-generation',
    tags: [
      'AI',
      'T5',
      'models'
    ],
    rating: '4.2',
    visits: '500000',
    dateAdded: '2022-08-15',
    isPremium: 'Free'
  },
  {
    name: 'Albert.ai',
    description: 'Autonomous AI marketing & ad campaign management platform.',
    url: 'https://albert.ai',
    id: 'albert-ai',
    image: '/tool-screenshots/albert-ai.png',
    logo: '/logo/albert-ai.png',
    categories: [
      'marketing'
    ],
    subcategory: 'campaign-management',
    tags: [
      'AI',
      'campaign',
      'automation'
    ],
    rating: '4.6',
    visits: '100000',
    dateAdded: '2022-08-15',
    isPremium: 'Free'
  },
  {
    name: 'RapidMiner',
    description: 'Data science platform with AI modeling and automation.',
    url: 'https://rapidminer.com',
    id: 'rapidminer',
    image: '/tool-screenshots/rapidminer.png',
    logo: '/logo/rapidminer.png',
    categories: [
      'analytics'
    ],
    subcategory: 'data-science',
    tags: [
      'AI',
      'data science'
    ],
    rating: '4.4',
    visits: '800000',
    dateAdded: '2022-08-15',
    isPremium: 'Free'
  },
  {
    name: 'Talend Data Fabric',
    description: 'Integrated data onboarding & processing platform.',
    url: 'https://www.talend.com/products/talend-data-fabric',
    id: 'talend-data-fabric',
    image: '/tool-screenshots/talend-data-fabric.png',
    logo: '/logo/talend-data-fabric.png',
    categories: [
      'data'
    ],
    subcategory: 'data-integration',
    tags: [
      'AI',
      'ETL',
      'data integration'
    ],
    rating: '4.4',
    visits: '800000',
    dateAdded: '2022-08-15',
    isPremium: 'Free'
  },
  {
    name: 'ClosersCopy',
    description: 'AI tool specialized in creating persuasive copywriting.',
    url: 'https://closerscopy.com',
    id: 'closerscopy',
    image: '/tool-screenshots/closerscopy.png',
    logo: '/logo/closerscopy.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'persuasive-copy',
    tags: [
      'AI',
      'copy',
      'persuasion'
    ],
    rating: '4.2',
    visits: '180000',
    dateAdded: '2022-08-01',
    isPremium: 'Free'
  },
  {
    name: 'DeepArt',
    description: 'AI platform for neural style transfer and artistic image creation.',
    url: 'https://deepart.io',
    id: 'deepart',
    image: '/tool-screenshots/deepart.png',
    logo: '/logo/deepart.png',
    categories: [
      'image'
    ],
    subcategory: 'style-transfer',
    tags: [
      'AI',
      'art',
      'neural style'
    ],
    rating: '4.2',
    visits: '1500000',
    dateAdded: '2022-08-01',
    isPremium: 'Free'
  },
  {
    name: 'DataRobot',
    description: 'Automated machine learning and deployment platform.',
    url: 'https://www.datarobot.com',
    id: 'datarobot',
    image: '/tool-screenshots/datarobot.png',
    logo: '/logo/datarobot.png',
    categories: [
      'analytics'
    ],
    subcategory: 'automl',
    tags: [
      'AI',
      'AutoML',
      'model deployment'
    ],
    rating: '4.5',
    visits: '900000',
    dateAdded: '2022-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Adext AI',
    description: 'AI-automated ad management & optimization platform.',
    url: 'https://adext.com',
    id: 'adext-ai',
    image: '/tool-screenshots/adext-ai.png',
    logo: '/logo/adext-ai.png',
    categories: [
      'marketing'
    ],
    subcategory: 'ad-management',
    tags: [
      'AI',
      'ads',
      'automation'
    ],
    rating: '4.3',
    visits: '120000',
    dateAdded: '2022-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Scholarcy',
    description: 'AI article summarization & key point extraction',
    url: 'https://scholarcy.com',
    id: 'scholarcy',
    image: '/tool-screenshots/scholarcy.png',
    logo: '/logo/scholarcy.png',
    categories: [
      'research'
    ],
    subcategory: 'article-summarization',
    tags: [
      'AI',
      'summarization',
      'research'
    ],
    rating: '4.5',
    visits: '45000',
    dateAdded: '2022-07-15'
  },
  {
    name: 'DataRobot Data Prep',
    description: 'Automated data cleansing and transformation platform.',
    url: 'https://www.datarobot.com/platform/prep',
    id: 'datarobot-data-prep',
    image: '/tool-screenshots/datarobot-data-prep.png',
    logo: '/logo/datarobot-data-prep.png',
    categories: [
      'data'
    ],
    subcategory: 'data-cleaning',
    tags: [
      'AI',
      'data cleaning'
    ],
    rating: '4.5',
    visits: '900000',
    dateAdded: '2022-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Murf.ai',
    description: 'AI-powered voiceover and narration platform for content creators.',
    url: 'https://murf.ai',
    id: 'murf-ai',
    image: '/tool-screenshots/murf-ai.png',
    logo: '/logo/murf-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'voiceover',
    tags: [
      'AI',
      'voiceover',
      'narration'
    ],
    rating: '4.4',
    visits: '1200000',
    dateAdded: '2022-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Wisecut',
    description: 'AI-powered noise removal and auto-editing platform for videos.',
    url: 'https://wisecut.video',
    id: 'wisecut',
    image: '/tool-screenshots/wisecut.png',
    logo: '/logo/wisecut.png',
    categories: [
      'video'
    ],
    subcategory: 'video-enhancement',
    tags: [
      'AI',
      'noise reduction',
      'editing'
    ],
    rating: '4.2',
    visits: '1200000',
    dateAdded: '2022-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Trello AI',
    description: 'Project management and task organization with AI suggestions.',
    url: 'https://trello.com',
    id: 'trello-ai',
    image: '/tool-screenshots/trello-ai.png',
    logo: '/logo/trello-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'project-management',
    tags: [
      'AI',
      'project management'
    ],
    rating: '4.5',
    visits: '3500000',
    dateAdded: '2022-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Midjourney',
    description: 'AI art generator that creates stunning images from text descriptions.',
    url: 'https://www.midjourney.com',
    id: 'midjourney',
    image: '/tool-screenshots/midjourney.png',
    logo: '/logo/midjourney.png',
    categories: [
      'image',
      'design'
    ],
    subcategory: 'art-generation',
    tags: [
      'AI',
      'art',
      'image generation',
      'creative'
    ],
    rating: '4.7',
    visits: '5000000',
    dateAdded: '2022-07-12',
    isPremium: 'Free'
  },
  {
    name: 'Piggy.ai',
    description: 'AI platform for comedy and creative image generation.',
    url: 'https://piggy.ai',
    id: 'piggy-ai',
    image: '/tool-screenshots/piggy-ai.png',
    logo: '/logo/piggy-ai.png',
    categories: [
      'image'
    ],
    subcategory: 'comedy',
    tags: [
      'AI',
      'humorous',
      'creative'
    ],
    rating: '4.1',
    visits: '800000',
    dateAdded: '2022-07-01',
    isPremium: 'Free'
  },
  {
    name: 'Microsoft Turing',
    description: 'Enterprise AI development models for large-scale applications.',
    url: 'https://www.microsoft.com/en-us/ai/turing',
    id: 'microsoft-turing',
    image: '/tool-screenshots/microsoft-turing.png',
    logo: '/logo/microsoft-turing.png',
    categories: [
      'coding'
    ],
    subcategory: 'enterprise-ai',
    tags: [
      'AI',
      'enterprise',
      'models'
    ],
    rating: '4.5',
    visits: '1500000',
    dateAdded: '2022-07-01',
    isPremium: 'Free'
  },
  {
    name: 'AutoDraw',
    description: 'AI-powered tool that transforms quick sketches into professional drawings.',
    url: 'https://www.autodraw.com',
    id: 'autodraw',
    image: '/tool-screenshots/autodraw.png',
    logo: '/logo/autodraw.png',
    categories: [
      'design'
    ],
    subcategory: 'sketching',
    tags: [
      'AI',
      'sketching',
      'drawing'
    ],
    rating: '4.2',
    visits: '1200000',
    dateAdded: '2022-07-01',
    isPremium: 'Free'
  },
  {
    name: 'ContentVillain',
    description: 'AI-powered tool for generating niche blog and content.',
    url: 'https://contentvillain.com',
    id: 'contentvillain',
    image: '/tool-screenshots/contentvillain.png',
    logo: '/logo/contentvillain.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'niche-content',
    tags: [
      'AI',
      'niche',
      'blogging'
    ],
    rating: '4.1',
    visits: '200000',
    dateAdded: '2022-07-01',
    isPremium: 'Free'
  },
  {
    name: 'Amazon CodeWhisperer',
    description: 'AI-powered code generation tool integrated with AWS services.',
    url: 'https://aws.amazon.com/codewhisperer',
    id: 'amazon-codewhisperer',
    image: '/tool-screenshots/amazon-codewhisperer.png',
    logo: '/logo/amazon-codewhisperer.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-generation',
    tags: [
      'AI',
      'code',
      'automation',
      'AWS'
    ],
    rating: '4.5',
    visits: '3000000',
    dateAdded: '2022-06-23',
    isPremium: 'Free'
  },
  {
    name: 'Paperpile',
    description: 'Research reference management with AI features',
    url: 'https://paperpile.com',
    id: 'paperpile',
    image: '/tool-screenshots/paperpile.png',
    logo: '/logo/paperpile.png',
    categories: [
      'research'
    ],
    subcategory: 'reference-management',
    tags: [
      'AI',
      'references',
      'management'
    ],
    rating: '4.4',
    visits: '35000',
    dateAdded: '2022-06-20'
  },
  {
    name: 'Pattern89',
    description: 'AI ad optimization & performance analytics platform.',
    url: 'https://pattern89.com',
    id: 'pattern89',
    image: '/tool-screenshots/pattern89.png',
    logo: '/logo/pattern89.png',
    categories: [
      'marketing'
    ],
    subcategory: 'ad-optimization',
    tags: [
      'AI',
      'advertising',
      'analytics'
    ],
    rating: '4.5',
    visits: '150000',
    dateAdded: '2022-06-15',
    isPremium: 'Free'
  },
  {
    name: 'SAS Viya',
    description: 'Comprehensive enterprise analytics and AI solutions.',
    url: 'https://www.sas.com/viya',
    id: 'sas-viya',
    image: '/tool-screenshots/sas-viya.png',
    logo: '/logo/sas-viya.png',
    categories: [
      'analytics'
    ],
    subcategory: 'enterprise-analytics',
    tags: [
      'AI',
      'enterprise',
      'analytics'
    ],
    rating: '4.7',
    visits: '1000000',
    dateAdded: '2022-06-15',
    isPremium: 'Free'
  },
  {
    name: 'SAS Data Management',
    description: 'Enterprise data quality & integration platform.',
    url: 'https://www.sas.com/en_us/software/data-management.html',
    id: 'sas-data-management',
    image: '/tool-screenshots/sas-data-management.png',
    logo: '/logo/sas-data-management.png',
    categories: [
      'data'
    ],
    subcategory: 'data-quality',
    tags: [
      'AI',
      'data quality',
      'ETL'
    ],
    rating: '4.7',
    visits: '1000000',
    dateAdded: '2022-06-15',
    isPremium: 'Free'
  },
  {
    name: 'StarryAI',
    description: 'AI platform for generating art and NFTs.',
    url: 'https://starryai.com',
    id: 'starryai',
    image: '/tool-screenshots/starryai.png',
    logo: '/logo/starryai.png',
    categories: [
      'image'
    ],
    subcategory: 'nft-art',
    tags: [
      'AI',
      'art',
      'NFTs',
      'creativity'
    ],
    rating: '4.4',
    visits: '2000000',
    dateAdded: '2022-06-01',
    isPremium: 'Free'
  },
  {
    name: 'DeepDev',
    description: 'AI-powered debugging and code correction tool.',
    url: 'https://deepdev.io',
    id: 'deepdev',
    image: '/tool-screenshots/deepdev.png',
    logo: '/logo/deepdev.png',
    categories: [
      'coding'
    ],
    subcategory: 'debugging',
    tags: [
      'AI',
      'debugging',
      'troubleshooting'
    ],
    rating: '4.3',
    visits: '600000',
    dateAdded: '2022-06-01',
    isPremium: 'Free'
  },
  {
    name: 'Snazzy AI',
    description: 'AI tool for creating marketing copy and landing pages.',
    url: 'https://snazzy.ai',
    id: 'snazzy-ai',
    image: '/tool-screenshots/snazzy-ai.png',
    logo: '/logo/snazzy-ai.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'marketing-copy',
    tags: [
      'AI',
      'marketing',
      'copy',
      'landing pages'
    ],
    rating: '4.0',
    visits: '250000',
    dateAdded: '2022-06-01',
    isPremium: 'Free'
  },
  {
    name: 'DeepSeek Janus Pro',
    description: 'Advanced AI platform for visual search and image creation.',
    url: 'https://deepseek.com',
    id: 'deepseek-janus-pro',
    image: '/tool-screenshots/deepseek-janus-pro.png',
    logo: '/logo/deepseek-janus-pro.png',
    categories: [
      'image'
    ],
    subcategory: 'visual-search',
    tags: [
      'AI',
      'search',
      'image synthesis'
    ],
    rating: '4.4',
    visits: '2000000',
    dateAdded: '2022-06-01',
    isPremium: 'Free'
  },
  {
    name: 'Lumen5',
    description: 'AI-powered social media video content creation platform.',
    url: 'https://lumen5.com',
    id: 'lumen5',
    image: '/tool-screenshots/lumen5.png',
    logo: '/logo/lumen5.png',
    categories: [
      'video'
    ],
    subcategory: 'social-media',
    tags: [
      'AI',
      'social media',
      'video'
    ],
    rating: '4.3',
    visits: '1500000',
    dateAdded: '2022-05-15',
    isPremium: 'Free'
  },
  {
    name: 'WizardCoder',
    description: 'Cloud-based AI coding helper for developers.',
    url: 'https://wizardcoder.com',
    id: 'wizardcoder',
    image: '/tool-screenshots/wizardcoder.png',
    logo: '/logo/wizardcoder.png',
    categories: [
      'coding'
    ],
    subcategory: 'cloud-coding',
    tags: [
      'AI',
      'cloud',
      'development tools'
    ],
    rating: '4.2',
    visits: '700000',
    dateAdded: '2022-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Beautiful.ai',
    description: 'AI-powered presentation design platform for creating stunning slides.',
    url: 'https://www.beautiful.ai',
    id: 'beautiful-ai',
    image: '/tool-screenshots/beautiful-ai.png',
    logo: '/logo/beautiful-ai.png',
    categories: [
      'design'
    ],
    subcategory: 'presentation',
    tags: [
      'AI',
      'presentation',
      'slides'
    ],
    rating: '4.5',
    visits: '1800000',
    dateAdded: '2022-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Alteryx',
    description: 'Data blending, cleaning, and advanced analytics platform.',
    url: 'https://www.alteryx.com',
    id: 'alteryx',
    image: '/tool-screenshots/alteryx.png',
    logo: '/logo/alteryx.png',
    categories: [
      'analytics'
    ],
    subcategory: 'data-preparation',
    tags: [
      'AI',
      'data prep',
      'analytics'
    ],
    rating: '4.6',
    visits: '1200000',
    dateAdded: '2022-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Alteryx Designer',
    description: 'Data blending, cleansing & advanced analytics platform.',
    url: 'https://www.alteryx.com/products/alteryx-designer',
    id: 'alteryx-designer',
    image: '/tool-screenshots/alteryx-designer.png',
    logo: '/logo/alteryx-designer.png',
    categories: [
      'data'
    ],
    subcategory: 'data-preparation',
    tags: [
      'AI',
      'data prep',
      'automation'
    ],
    rating: '4.6',
    visits: '1200000',
    dateAdded: '2022-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Descript Overdub',
    description: 'AI voice cloning and editing platform for content creators.',
    url: 'https://www.descript.com/overdub',
    id: 'descript-overdub',
    image: '/tool-screenshots/descript-overdub.png',
    logo: '/logo/descript-overdub.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-editing',
    tags: [
      'AI',
      'voice',
      'editing'
    ],
    rating: '4.5',
    visits: '1500000',
    dateAdded: '2022-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Zapier AI',
    description: 'Automation and integrated workflows across apps platform.',
    url: 'https://zapier.com',
    id: 'zapier-ai',
    image: '/tool-screenshots/zapier-ai.png',
    logo: '/logo/zapier-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'automation',
    tags: [
      'AI',
      'automation',
      'workflows'
    ],
    rating: '4.6',
    visits: '4000000',
    dateAdded: '2022-05-15',
    isPremium: 'Free'
  },
  {
    name: 'AI Painter',
    description: 'AI tool for creating realistic and creative paintings.',
    url: 'https://ai-painter.com',
    id: 'ai-painter',
    image: '/tool-screenshots/ai-painter.png',
    logo: '/logo/ai-painter.png',
    categories: [
      'image'
    ],
    subcategory: 'painting',
    tags: [
      'AI',
      'painting',
      'art'
    ],
    rating: '4.2',
    visits: '1200000',
    dateAdded: '2022-05-01',
    isPremium: 'Free'
  },
  {
    name: 'Kafkai',
    description: 'AI-powered SEO article writer for creating niche-specific content.',
    url: 'https://kafkai.com',
    id: 'kafkai',
    image: '/tool-screenshots/kafkai.png',
    logo: '/logo/kafkai.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'seo-writing',
    tags: [
      'AI',
      'SEO',
      'articles',
      'niche writing'
    ],
    rating: '4.1',
    visits: '300000',
    dateAdded: '2022-05-01',
    isPremium: 'Free'
  },
  {
    name: 'Mendeley',
    description: 'Research organization & collaboration with AI suggestions',
    url: 'https://mendeley.com',
    id: 'mendeley',
    image: '/tool-screenshots/mendeley.png',
    logo: '/logo/mendeley.png',
    categories: [
      'research'
    ],
    subcategory: 'research-organization',
    tags: [
      'AI',
      'organization',
      'collaboration'
    ],
    rating: '4.5',
    visits: '50000',
    dateAdded: '2022-04-20'
  },
  {
    name: 'Vidnami (formerly Content Samurai)',
    description: 'AI video ads & marketing videos platform.',
    url: 'https://www.vidnami.com',
    id: 'vidnami',
    image: '/tool-screenshots/vidnami.png',
    logo: '/logo/vidnami.png',
    categories: [
      'marketing'
    ],
    subcategory: 'video-ads',
    tags: [
      'AI',
      'video',
      'advertising'
    ],
    rating: '4.3',
    visits: '200000',
    dateAdded: '2022-04-15',
    isPremium: 'Free'
  },
  {
    name: 'Databricks',
    description: 'Collaborative unified data & AI platform.',
    url: 'https://databricks.com',
    id: 'databricks',
    image: '/tool-screenshots/databricks.png',
    logo: '/logo/databricks.png',
    categories: [
      'data'
    ],
    subcategory: 'data-analytics',
    tags: [
      'AI',
      'ML',
      'data engineering'
    ],
    rating: '4.8',
    visits: '1500000',
    dateAdded: '2022-04-15',
    isPremium: 'Free'
  },
  {
    name: 'Jasper Art',
    description: 'AI tool for generating content marketing images.',
    url: 'https://jasper.ai/art',
    id: 'jasper-art',
    image: '/tool-screenshots/jasper-art.png',
    logo: '/logo/jasper-art.png',
    categories: [
      'image',
      'marketing'
    ],
    subcategory: 'marketing',
    tags: [
      'AI',
      'marketing',
      'content',
      'art'
    ],
    rating: '4.3',
    visits: '1500000',
    dateAdded: '2022-04-01',
    isPremium: 'Free'
  },
  {
    name: 'PolyCoder',
    description: 'Open-source large-scale code generator for various programming languages.',
    url: 'https://github.com/VHellendoorn/Code-LMs',
    id: 'polycoder',
    image: '/tool-screenshots/polycoder.png',
    logo: '/logo/polycoder.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-generation',
    tags: [
      'AI',
      'open-source',
      'models'
    ],
    rating: '4.1',
    visits: '800000',
    dateAdded: '2022-04-01',
    isPremium: 'Free'
  },
  {
    name: 'Headlime',
    description: 'AI tool for generating effective headlines and advertising copy.',
    url: 'https://headlime.com',
    id: 'headlime',
    image: '/tool-screenshots/headlime.png',
    logo: '/logo/headlime.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'ad-copy',
    tags: [
      'AI',
      'headlines',
      'advertising',
      'copy'
    ],
    rating: '4.2',
    visits: '400000',
    dateAdded: '2022-04-01',
    isPremium: 'Free'
  },
  {
    name: 'Flux.1',
    description: 'AI-powered tool for style transfer and advanced image editing.',
    url: 'https://flux.1',
    id: 'flux-1',
    image: '/tool-screenshots/flux-1.png',
    logo: '/logo/flux-1.png',
    categories: [
      'image'
    ],
    subcategory: 'style-transfer',
    tags: [
      'AI',
      'art',
      'style transfer'
    ],
    rating: '4.2',
    visits: '1500000',
    dateAdded: '2022-03-15',
    isPremium: 'Free'
  },
  {
    name: 'VAST Data',
    description: 'AI-optimized storage & fast data throughput platform.',
    url: 'https://vastdata.com',
    id: 'vast-data',
    image: '/tool-screenshots/vast-data.png',
    logo: '/logo/vast-data.png',
    categories: [
      'data'
    ],
    subcategory: 'data-storage',
    tags: [
      'AI',
      'storage',
      'big data'
    ],
    rating: '4.5',
    visits: '1800000',
    dateAdded: '2022-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Resemble AI',
    description: 'AI voice cloning and customization platform for creating unique voice models.',
    url: 'https://www.resemble.ai',
    id: 'resemble-ai',
    image: '/tool-screenshots/resemble-ai.png',
    logo: '/logo/resemble-ai.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-cloning',
    tags: [
      'AI',
      'voice',
      'cloning'
    ],
    rating: '4.6',
    visits: '1800000',
    dateAdded: '2022-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Otter.ai',
    description: 'AI transcription and meeting notes platform.',
    url: 'https://otter.ai',
    id: 'otter-ai',
    image: '/tool-screenshots/otter-ai.png',
    logo: '/logo/otter-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'transcription',
    tags: [
      'AI',
      'transcription',
      'meetings'
    ],
    rating: '4.7',
    visits: '4500000',
    dateAdded: '2022-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Magisto',
    description: 'AI-driven automated video creation platform.',
    url: 'https://www.magisto.com',
    id: 'magisto',
    image: '/tool-screenshots/magisto.png',
    logo: '/logo/magisto.png',
    categories: [
      'video'
    ],
    subcategory: 'video-automation',
    tags: [
      'AI',
      'video',
      'automation'
    ],
    rating: '4.4',
    visits: '1800000',
    dateAdded: '2022-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Craiyon (formerly DALL·E Mini)',
    description: 'Quick and accessible text-to-image generation tool.',
    url: 'https://craiyon.com',
    id: 'craiyon',
    image: '/tool-screenshots/craiyon.png',
    logo: '/logo/craiyon.png',
    categories: [
      'image'
    ],
    subcategory: 'quick-generation',
    tags: [
      'AI',
      'art',
      'quick generation'
    ],
    rating: '4.1',
    visits: '3000000',
    dateAdded: '2022-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Codeium',
    description: 'Real-time AI code completion tool for faster and more efficient coding.',
    url: 'https://codeium.com',
    id: 'codeium',
    image: '/tool-screenshots/codeium.png',
    logo: '/logo/codeium.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-autocompletion',
    tags: [
      'AI',
      'IDE',
      'developer tools'
    ],
    rating: '4.4',
    visits: '1200000',
    dateAdded: '2022-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Lunacy',
    description: 'AI-based UI design tool compatible with Sketch for professional designers.',
    url: 'https://icons8.com/lunacy',
    id: 'lunacy',
    image: '/tool-screenshots/lunacy.png',
    logo: '/logo/lunacy.png',
    categories: [
      'design'
    ],
    subcategory: 'ui-design',
    tags: [
      'AI',
      'UI design',
      'compatibility'
    ],
    rating: '4.4',
    visits: '1000000',
    dateAdded: '2022-03-01',
    isPremium: 'Free'
  },
  {
    name: 'INK',
    description: 'AI-powered content optimization and SEO writing assistant.',
    url: 'https://inkforall.com',
    id: 'ink',
    image: '/tool-screenshots/ink.png',
    logo: '/logo/ink.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'seo',
    tags: [
      'AI',
      'SEO',
      'writing'
    ],
    rating: '4.0',
    visits: '500000',
    dateAdded: '2022-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Cogram',
    description: 'AI-powered SQL code generation and analytics platform.',
    url: 'https://cogram.com',
    id: 'cogram',
    image: '/tool-screenshots/cogram.png',
    logo: '/logo/cogram.png',
    categories: [
      'coding',
      'data'
    ],
    subcategory: 'sql-generation',
    tags: [
      'AI',
      'SQL',
      'data analysis'
    ],
    rating: '4.3',
    visits: '900000',
    dateAdded: '2022-02-15',
    isPremium: 'Free'
  },
  {
    name: 'Apache Spark',
    description: 'High-performance distributed data processing engine.',
    url: 'https://spark.apache.org',
    id: 'apache-spark',
    image: '/tool-screenshots/apache-spark.png',
    logo: '/logo/apache-spark.png',
    categories: [
      'data'
    ],
    subcategory: 'big-data',
    tags: [
      'AI',
      'big data',
      'analytics'
    ],
    rating: '4.7',
    visits: '2000000',
    dateAdded: '2022-02-15',
    isPremium: 'Free'
  },
  {
    name: 'DeepAngel',
    description: 'AI tool for removing objects and editing images.',
    url: 'https://deepangel.com',
    id: 'deepangel',
    image: '/tool-screenshots/deepangel.png',
    logo: '/logo/deepangel.png',
    categories: [
      'image'
    ],
    subcategory: 'editing',
    tags: [
      'AI',
      'editing',
      'removal'
    ],
    rating: '4.0',
    visits: '900000',
    dateAdded: '2022-02-01',
    isPremium: 'Free'
  },
  {
    name: 'Frase',
    description: 'AI-powered tool for creating content briefs and optimizing content for SEO.',
    url: 'https://www.frase.io',
    id: 'frase',
    image: '/tool-screenshots/frase.png',
    logo: '/logo/frase.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'content-optimization',
    tags: [
      'AI',
      'content',
      'SEO',
      'briefs'
    ],
    rating: '4.1',
    visits: '600000',
    dateAdded: '2022-02-01',
    isPremium: 'Free'
  },
  {
    name: 'ElevenLabs',
    description: 'AI voice synthesis and cloning platform that creates natural-sounding speech from text.',
    url: 'https://elevenlabs.io',
    id: 'elevenlabs',
    image: '/tool-screenshots/elevenlabs.png',
    logo: '/logo/elevenlabs.png',
    categories: [
      'audio'
    ],
    subcategory: 'voice-synthesis',
    tags: [
      'AI',
      'voice',
      'speech synthesis'
    ],
    rating: '4.7',
    visits: '2500000',
    dateAdded: '2022-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Looka',
    description: 'AI-powered logo and branding platform for businesses.',
    url: 'https://looka.com',
    id: 'looka',
    image: '/tool-screenshots/looka.png',
    logo: '/logo/looka.png',
    categories: [
      'design'
    ],
    subcategory: 'branding',
    tags: [
      'AI',
      'branding',
      'logo design'
    ],
    rating: '4.3',
    visits: '800000',
    dateAdded: '2022-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Copyscape',
    description: 'AI-powered plagiarism detection & content validation platform.',
    url: 'https://www.copyscape.com',
    id: 'copyscape',
    image: '/tool-screenshots/copyscape.png',
    logo: '/logo/copyscape.png',
    categories: [
      'marketing'
    ],
    subcategory: 'content-validation',
    tags: [
      'AI',
      'plagiarism',
      'content'
    ],
    rating: '4.4',
    visits: '350000',
    dateAdded: '2022-01-15',
    isPremium: 'Free'
  },
  {
    name: 'KNIME',
    description: 'AI-driven data analytics and workflow automation platform.',
    url: 'https://www.knime.com',
    id: 'knime',
    image: '/tool-screenshots/knime.png',
    logo: '/logo/knime.png',
    categories: [
      'analytics'
    ],
    subcategory: 'workflow-automation',
    tags: [
      'AI',
      'data',
      'workflow'
    ],
    rating: '4.6',
    visits: '2500000',
    dateAdded: '2022-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Apache Beam',
    description: 'Unified stream & batch data processing framework.',
    url: 'https://beam.apache.org',
    id: 'apache-beam',
    image: '/tool-screenshots/apache-beam.png',
    logo: '/logo/apache-beam.png',
    categories: [
      'data'
    ],
    subcategory: 'data-processing',
    tags: [
      'AI',
      'data pipeline',
      'streaming'
    ],
    rating: '4.6',
    visits: '1500000',
    dateAdded: '2022-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Filmora',
    description: 'AI-enhanced video editing and effects platform.',
    url: 'https://filmora.wondershare.com',
    id: 'filmora',
    image: '/tool-screenshots/filmora.png',
    logo: '/logo/filmora.png',
    categories: [
      'video'
    ],
    subcategory: 'video-editing',
    tags: [
      'AI',
      'video',
      'editing'
    ],
    rating: '4.5',
    visits: '2000000',
    dateAdded: '2022-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Notion AI',
    description: 'Intelligent note-taking and workspace automation platform.',
    url: 'https://notion.so',
    id: 'notion-ai',
    image: '/tool-screenshots/notion-ai.png',
    logo: '/logo/notion-ai.png',
    categories: [
      'productivity'
    ],
    subcategory: 'note-taking',
    tags: [
      'AI',
      'notes',
      'workspace'
    ],
    rating: '4.8',
    visits: '5000000',
    dateAdded: '2022-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Replit Ghostwriter',
    description: 'AI coding assistant integrated directly into the Replit IDE for seamless development.',
    url: 'https://replit.com/ghostwriter',
    id: 'replit-ghostwriter',
    image: '/tool-screenshots/replit-ghostwriter.png',
    logo: '/logo/replit-ghostwriter.png',
    categories: [
      'coding'
    ],
    subcategory: 'ide-integration',
    tags: [
      'AI',
      'IDE',
      'code generation',
      'collaboration'
    ],
    rating: '4.3',
    visits: '2000000',
    dateAdded: '2022-01-10',
    isPremium: 'Free'
  },
  {
    name: 'Deep Nostalgia',
    description: 'AI tool for animating photos from still images.',
    url: 'https://myheritage.com/deep-nostalgia',
    id: 'deep-nostalgia',
    image: '/tool-screenshots/deep-nostalgia.png',
    logo: '/logo/deep-nostalgia.png',
    categories: [
      'image',
      'video'
    ],
    subcategory: 'animation',
    tags: [
      'AI',
      'animation',
      'photo'
    ],
    rating: '4.3',
    visits: '2500000',
    dateAdded: '2022-01-01',
    isPremium: 'Free'
  },
  {
    name: 'SurferSEO',
    description: 'AI-powered content optimization and SEO tool for creating search-engine friendly content.',
    url: 'https://surferseo.com',
    id: 'surfer-seo',
    image: '/tool-screenshots/surfer-seo.png',
    logo: '/logo/surfer-seo.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'seo',
    tags: [
      'AI',
      'SEO',
      'content',
      'keywords'
    ],
    rating: '4.2',
    visits: '700000',
    dateAdded: '2022-01-01',
    isPremium: 'Free'
  },
  {
    name: 'CopySmith',
    description: 'AI content generation for marketing platform.',
    url: 'https://copysmith.ai',
    id: 'copysmith',
    image: '/tool-screenshots/copysmith.png',
    logo: '/logo/copysmith.png',
    categories: [
      'marketing'
    ],
    subcategory: 'content-generation',
    tags: [
      'AI',
      'content',
      'marketing'
    ],
    rating: '4.3',
    visits: '400000',
    dateAdded: '2021-12-15',
    isPremium: 'Free'
  },
  {
    name: 'FaceApp',
    description: 'AI-powered app for facial transformations and edits.',
    url: 'https://faceapp.com',
    id: 'faceapp',
    image: '/tool-screenshots/faceapp.png',
    logo: '/logo/faceapp.png',
    categories: [
      'image'
    ],
    subcategory: 'face-editing',
    tags: [
      'AI',
      'faces',
      'editing'
    ],
    rating: '4.4',
    visits: '3500000',
    dateAdded: '2021-12-01',
    isPremium: 'Free'
  },
  {
    name: 'MarketMuse',
    description: 'AI-powered content strategy and SEO optimization platform.',
    url: 'https://www.marketmuse.com',
    id: 'marketmuse',
    image: '/tool-screenshots/marketmuse.png',
    logo: '/logo/marketmuse.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'content-strategy',
    tags: [
      'AI',
      'content',
      'SEO',
      'strategy'
    ],
    rating: '4.3',
    visits: '800000',
    dateAdded: '2021-12-01',
    isPremium: 'Free'
  },
  {
    name: 'Sourcegraph',
    description: 'AI-enhanced code search and intelligence platform for better code navigation.',
    url: 'https://sourcegraph.com',
    id: 'sourcegraph',
    image: '/tool-screenshots/sourcegraph.png',
    logo: '/logo/sourcegraph.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-search',
    tags: [
      'AI',
      'codebase',
      'navigation'
    ],
    rating: '4.6',
    visits: '2000000',
    dateAdded: '2021-11-15',
    isPremium: 'Free'
  },
  {
    name: 'Khroma',
    description: 'AI-driven color palette generator for designers and artists.',
    url: 'https://www.khroma.co',
    id: 'khroma',
    image: '/tool-screenshots/khroma.png',
    logo: '/logo/khroma.png',
    categories: [
      'design'
    ],
    subcategory: 'color-tools',
    tags: [
      'AI',
      'colors',
      'palette'
    ],
    rating: '4.2',
    visits: '600000',
    dateAdded: '2021-11-01',
    isPremium: 'Free'
  },
  {
    name: 'Clearscope',
    description: 'AI-powered tool for keyword optimization and SEO content creation.',
    url: 'https://www.clearscope.io',
    id: 'clearscope',
    image: '/tool-screenshots/clearscope.png',
    logo: '/logo/clearscope.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'seo',
    tags: [
      'AI',
      'SEO',
      'keywords',
      'content'
    ],
    rating: '4.4',
    visits: '900000',
    dateAdded: '2021-11-01',
    isPremium: 'Free'
  },
  {
    name: 'WOMBO Dream',
    description: 'AI-powered app for creating artistic images with various style transfers.',
    url: 'https://dream.ai',
    id: 'wombo-dream',
    image: '/tool-screenshots/wombo-dream.png',
    logo: '/logo/wombo-dream.png',
    categories: [
      'image'
    ],
    subcategory: 'style-transfer',
    tags: [
      'AI',
      'art',
      'painting',
      'creativity'
    ],
    rating: '4.4',
    visits: '2500000',
    dateAdded: '2021-11-01',
    isPremium: 'Free'
  },
  {
    name: 'Conversion.ai (Jasper AI)',
    description: 'AI marketing & sales copy generation platform.',
    url: 'https://www.conversion.ai',
    id: 'conversion-ai',
    image: '/tool-screenshots/conversion-ai.png',
    logo: '/logo/conversion-ai.png',
    categories: [
      'marketing'
    ],
    subcategory: 'sales-copy',
    tags: [
      'AI',
      'marketing',
      'sales'
    ],
    rating: '4.6',
    visits: '600000',
    dateAdded: '2021-10-15',
    isPremium: 'Free'
  },
  {
    name: 'Designs.ai',
    description: 'Comprehensive AI tools for branding, videos, and graphics creation.',
    url: 'https://designs.ai',
    id: 'designs-ai',
    image: '/tool-screenshots/designs-ai.png',
    logo: '/logo/designs-ai.png',
    categories: [
      'design'
    ],
    subcategory: 'branding',
    tags: [
      'AI',
      'branding',
      'video',
      'graphics'
    ],
    rating: '4.4',
    visits: '900000',
    dateAdded: '2021-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Anyword',
    description: 'AI tool specialized in creating persuasive marketing and advertising copy.',
    url: 'https://anyword.com',
    id: 'anyword',
    image: '/tool-screenshots/anyword.png',
    logo: '/logo/anyword.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'marketing-copy',
    tags: [
      'AI',
      'marketing',
      'ad copy',
      'persuasion'
    ],
    rating: '4.3',
    visits: '1100000',
    dateAdded: '2021-09-01',
    isPremium: 'Free'
  },
  {
    name: 'DeepCode (Snyk Code)',
    description: 'AI-driven code review and bug detection platform for improved code quality.',
    url: 'https://snyk.io/product/snyk-code',
    id: 'deepcode',
    image: '/tool-screenshots/deepcode.png',
    logo: '/logo/deepcode.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-review',
    tags: [
      'AI',
      'review',
      'bug fixing'
    ],
    rating: '4.5',
    visits: '1800000',
    dateAdded: '2021-08-20',
    isPremium: 'Free'
  },
  {
    name: 'Artbreeder',
    description: 'AI platform for genetic image merging and creative image generation.',
    url: 'https://artbreeder.com',
    id: 'artbreeder',
    image: '/tool-screenshots/artbreeder.png',
    logo: '/logo/artbreeder.png',
    categories: [
      'image'
    ],
    subcategory: 'image-blending',
    tags: [
      'AI',
      'image blending',
      'art'
    ],
    rating: '4.3',
    visits: '1800000',
    dateAdded: '2021-08-01',
    isPremium: 'Free'
  },
  {
    name: 'ContentBot.ai',
    description: 'AI-powered tool for automating blog and content creation.',
    url: 'https://contentbot.ai',
    id: 'contentbot',
    image: '/tool-screenshots/contentbot.png',
    logo: '/logo/contentbot.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'content-automation',
    tags: [
      'AI',
      'blog',
      'content',
      'automation'
    ],
    rating: '4.0',
    visits: '900000',
    dateAdded: '2021-08-01',
    isPremium: 'Free'
  },
  {
    name: 'PaintsChainer',
    description: 'AI tool for automatic coloring and painting of line art.',
    url: 'https://paintschainer.preferred.tech',
    id: 'paintschainer',
    image: '/tool-screenshots/paintschainer.png',
    logo: '/logo/paintschainer.png',
    categories: [
      'image'
    ],
    subcategory: 'coloring',
    tags: [
      'AI',
      'coloring',
      'illustration'
    ],
    rating: '4.1',
    visits: '900000',
    dateAdded: '2021-07-15',
    isPremium: 'Free'
  },
  {
    name: 'Tailor Brands',
    description: 'AI-powered comprehensive branding and logo design platform.',
    url: 'https://www.tailorbrands.com',
    id: 'tailor-brands',
    image: '/tool-screenshots/tailor-brands.png',
    logo: '/logo/tailor-brands.png',
    categories: [
      'design'
    ],
    subcategory: 'branding',
    tags: [
      'AI',
      'branding',
      'logo'
    ],
    rating: '4.3',
    visits: '700000',
    dateAdded: '2021-07-01',
    isPremium: 'Free'
  },
  {
    name: 'Peppertype.ai',
    description: 'AI content and copywriting tool for creating engaging marketing content.',
    url: 'https://www.peppertype.ai',
    id: 'peppertype',
    image: '/tool-screenshots/peppertype.png',
    logo: '/logo/peppertype.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'content-creation',
    tags: [
      'AI',
      'content',
      'copy',
      'marketing'
    ],
    rating: '4.1',
    visits: '1000000',
    dateAdded: '2021-07-01',
    isPremium: 'Free'
  },
  {
    name: 'ProWritingAid',
    description: 'Comprehensive writing tool that helps you improve your writing style, grammar, and readability.',
    url: 'https://prowritingaid.com',
    id: 'prowritingaid',
    image: '/tool-screenshots/prowritingaid.png',
    logo: '/logo/prowritingaid.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'style-editing',
    tags: [
      'AI',
      'style',
      'editing',
      'readability'
    ],
    rating: '4.3',
    visits: '1800000',
    dateAdded: '2021-06-15',
    isPremium: 'Free'
  },
  {
    name: 'LongShot AI',
    description: 'AI-powered tool for generating long-form content like articles and blog posts.',
    url: 'https://longshot.ai',
    id: 'longshot-ai',
    image: '/tool-screenshots/longshot-ai.png',
    logo: '/logo/longshot-ai.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'long-form-content',
    tags: [
      'AI',
      'article',
      'long-form',
      'blog'
    ],
    rating: '4.2',
    visits: '1200000',
    dateAdded: '2021-06-15',
    isPremium: 'Free'
  },
  {
    name: 'BigSleep',
    description: 'High-quality AI image synthesis tool using deep learning.',
    url: 'https://github.com/lucidrains/big-sleep',
    id: 'bigsleep',
    image: '/tool-screenshots/bigsleep.png',
    logo: '/logo/bigsleep.png',
    categories: [
      'image'
    ],
    subcategory: 'image-synthesis',
    tags: [
      'AI',
      'deep learning',
      'art'
    ],
    rating: '4.0',
    visits: '800000',
    dateAdded: '2021-06-01',
    isPremium: 'Free'
  },
  {
    name: 'Hemingway App',
    description: 'AI-powered writing tool that helps you write clear, concise, and readable content.',
    url: 'https://hemingwayapp.com',
    id: 'hemingway-app',
    image: '/tool-screenshots/hemingway-app.png',
    logo: '/logo/hemingway-app.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'readability',
    tags: [
      'AI',
      'readability',
      'writing',
      'style'
    ],
    rating: '4.2',
    visits: '1500000',
    dateAdded: '2021-05-20',
    isPremium: 'Free'
  },
  {
    name: 'Sudowrite',
    description: 'AI writing tool specialized in creative writing and storytelling.',
    url: 'https://www.sudowrite.com',
    id: 'sudowrite',
    image: '/tool-screenshots/sudowrite.png',
    logo: '/logo/sudowrite.png',
    categories: [
      'text'
    ],
    subcategory: 'creative-writing',
    tags: [
      'AI',
      'creative',
      'storytelling',
      'fiction'
    ],
    rating: '4.4',
    visits: '1500000',
    dateAdded: '2021-05-20',
    isPremium: 'Free'
  },
  {
    name: 'Kite',
    description: 'AI-powered code completion and documentation tool for developers.',
    url: 'https://kite.com',
    id: 'kite',
    image: '/tool-screenshots/kite.png',
    logo: '/logo/kite.png',
    categories: [
      'coding'
    ],
    subcategory: 'code-assistance',
    tags: [
      'AI',
      'autocompletion',
      'documentation'
    ],
    rating: '4.2',
    visits: '1500000',
    dateAdded: '2021-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Phrasee',
    description: 'AI-generated email subject lines & marketing language platform.',
    url: 'https://phrasee.co',
    id: 'phrasee',
    image: '/tool-screenshots/phrasee.png',
    logo: '/logo/phrasee.png',
    categories: [
      'marketing'
    ],
    subcategory: 'email-marketing',
    tags: [
      'AI',
      'email',
      'marketing'
    ],
    rating: '4.3',
    visits: '1200000',
    dateAdded: '2021-05-15',
    isPremium: 'Free'
  },
  {
    name: 'Deep Dream Generator',
    description: 'AI-powered tool for creating surreal and artistic images using neural networks.',
    url: 'https://deepdreamgenerator.com',
    id: 'deep-dream-generator',
    image: '/tool-screenshots/deep-dream-generator.png',
    logo: '/logo/deep-dream-generator.png',
    categories: [
      'image'
    ],
    subcategory: 'artistic',
    tags: [
      'AI',
      'art',
      'surreal',
      'neural network'
    ],
    rating: '4.3',
    visits: '3000000',
    dateAdded: '2021-05-15',
    isPremium: 'Free'
  },
  {
    name: 'VQGAN+CLIP',
    description: 'Neural network-based art generation tool.',
    url: 'https://github.com/nerdyrodent/VQGAN-CLIP',
    id: 'vqgan-clip',
    image: '/tool-screenshots/vqgan-clip.png',
    logo: '/logo/vqgan-clip.png',
    categories: [
      'image'
    ],
    subcategory: 'neural-art',
    tags: [
      'AI',
      'neural network',
      'art'
    ],
    rating: '4.1',
    visits: '700000',
    dateAdded: '2021-05-01',
    isPremium: 'Free'
  },
  {
    name: 'Rytr',
    description: 'AI writing assistant that helps you create high-quality content for various purposes.',
    url: 'https://rytr.me',
    id: 'rytr',
    image: '/tool-screenshots/rytr.png',
    logo: '/logo/rytr.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'writing-assistant',
    tags: [
      'AI',
      'writing',
      'content',
      'assistant'
    ],
    rating: '4.3',
    visits: '1800000',
    dateAdded: '2021-04-15',
    isPremium: 'Free'
  },
  {
    name: 'Artisto',
    description: 'AI tool for transforming media into artistic works.',
    url: 'https://artisto.my.com',
    id: 'artisto',
    image: '/tool-screenshots/artisto.png',
    logo: '/logo/artisto.png',
    categories: [
      'image',
      'video'
    ],
    subcategory: 'art-filters',
    tags: [
      'AI',
      'art',
      'filters',
      'video'
    ],
    rating: '4.0',
    visits: '600000',
    dateAdded: '2021-04-01',
    isPremium: 'Free'
  },
  {
    name: 'QuillBot',
    description: 'AI-powered paraphrasing tool that helps you rewrite and improve your text while maintaining its meaning.',
    url: 'https://quillbot.com',
    id: 'quillbot',
    image: '/tool-screenshots/quillbot.png',
    logo: '/logo/quillbot.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'paraphrasing',
    tags: [
      'AI',
      'paraphrasing',
      'rewriting',
      'editing'
    ],
    rating: '4.5',
    visits: '4000000',
    dateAdded: '2021-03-20',
    isPremium: 'Free'
  },
  {
    name: 'Writesonic',
    description: 'AI content & ad copy generation platform.',
    url: 'https://writesonic.com',
    id: 'writesonic',
    image: '/tool-screenshots/writesonic.png',
    logo: '/logo/writesonic.png',
    categories: [
      'marketing'
    ],
    subcategory: 'content-generation',
    tags: [
      'AI',
      'advertising',
      'content'
    ],
    rating: '4.5',
    visits: '1800000',
    dateAdded: '2021-03-15',
    isPremium: 'Free'
  },
  {
    name: 'Remove.bg',
    description: 'AI-powered background removal tool for images.',
    url: 'https://www.remove.bg',
    id: 'remove-bg',
    image: '/tool-screenshots/remove-bg.png',
    logo: '/logo/remove-bg.png',
    categories: [
      'design'
    ],
    subcategory: 'image-editing',
    tags: [
      'AI',
      'background removal'
    ],
    rating: '4.5',
    visits: '2000000',
    dateAdded: '2021-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Copy.ai',
    description: 'AI-powered content and marketing copy generation platform.',
    url: 'https://www.copy.ai',
    id: 'copy-ai',
    image: '/tool-screenshots/copy-ai.png',
    logo: '/logo/copy-ai.png',
    categories: [
      'marketing'
    ],
    subcategory: 'content-generation',
    tags: [
      'AI',
      'content',
      'marketing'
    ],
    rating: '4.6',
    visits: '2000000',
    dateAdded: '2021-02-15',
    isPremium: 'Free'
  },
  {
    name: 'Pixray',
    description: 'Customizable neural network-based image generation tool.',
    url: 'https://github.com/pixray/pixray',
    id: 'pixray',
    image: '/tool-screenshots/pixray.png',
    logo: '/logo/pixray.png',
    categories: [
      'image'
    ],
    subcategory: 'neural-art',
    tags: [
      'AI',
      'neural network',
      'art'
    ],
    rating: '4.0',
    visits: '500000',
    dateAdded: '2021-02-01',
    isPremium: 'Free'
  },
  {
    name: 'Jasper (formerly Jarvis)',
    description: 'AI content creation & copywriting platform.',
    url: 'https://www.jasper.ai',
    id: 'jasper',
    image: '/tool-screenshots/jasper.png',
    logo: '/logo/jasper.png',
    categories: [
      'marketing'
    ],
    subcategory: 'content-creation',
    tags: [
      'AI',
      'content',
      'copywriting'
    ],
    rating: '4.7',
    visits: '2500000',
    dateAdded: '2021-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Daz 3D',
    description: 'AI-assisted 3D modeling and rendering platform.',
    url: 'https://www.daz3d.com',
    id: 'daz-3d',
    image: '/tool-screenshots/daz-3d.png',
    logo: '/logo/daz-3d.png',
    categories: [
      'design'
    ],
    subcategory: '3d-modeling',
    tags: [
      'AI',
      '3D',
      'modeling'
    ],
    rating: '4.4',
    visits: '1500000',
    dateAdded: '2021-01-15',
    isPremium: 'Free'
  },
  {
    name: 'Prisma',
    description: 'AI-powered app for applying artistic filters and effects to photos.',
    url: 'https://prisma-ai.com',
    id: 'prisma',
    image: '/tool-screenshots/prisma.png',
    logo: '/logo/prisma.png',
    categories: [
      'image'
    ],
    subcategory: 'filters',
    tags: [
      'AI',
      'filters',
      'art'
    ],
    rating: '4.3',
    visits: '2000000',
    dateAdded: '2021-01-01',
    isPremium: 'Free'
  },
  {
    name: 'This Person Does Not Exist',
    description: 'AI-generated realistic human faces using GAN technology.',
    url: 'https://thispersondoesnotexist.com',
    id: 'this-person-does-not-exist',
    image: '/tool-screenshots/this-person-does-not-exist.png',
    logo: '/logo/this-person-does-not-exist.png',
    categories: [
      'image'
    ],
    subcategory: 'face-generation',
    tags: [
      'AI',
      'faces',
      'realism'
    ],
    rating: '4.4',
    visits: '3000000',
    dateAdded: '2020-12-01',
    isPremium: 'Free'
  },
  {
    name: 'Replika',
    description: 'AI companion chatbot designed for personal interaction and companionship.',
    url: 'https://replika.com',
    id: 'replika',
    image: '/tool-screenshots/replika.png',
    logo: '/logo/replika.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'personal-chatbot',
    tags: [
      'AI',
      'chatbot',
      'companionship'
    ],
    rating: '4.3',
    visits: '3000000',
    dateAdded: '2020-11-01',
    isPremium: 'Free'
  },
  {
    name: 'Mitsuku (Kuki)',
    description: 'Advanced AI chatbot and virtual assistant.',
    url: 'https://www.pandorabots.com/mitsuku',
    id: 'mitsuku',
    image: '/tool-screenshots/mitsuku.png',
    logo: '/logo/mitsuku.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'chatbot',
    tags: [
      'AI',
      'chatbot',
      'conversation'
    ],
    rating: '4.2',
    visits: '2500000',
    dateAdded: '2020-10-01',
    isPremium: 'Free'
  },
  {
    name: 'Grammarly',
    description: 'AI-powered writing assistant that helps you write better by checking grammar, spelling, and style.',
    url: 'https://www.grammarly.com',
    id: 'grammarly',
    image: '/tool-screenshots/grammarly.png',
    logo: '/logo/grammarly.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'grammar',
    tags: [
      'AI',
      'grammar',
      'proofreading',
      'editing'
    ],
    rating: '4.7',
    visits: '12000000',
    dateAdded: '2020-09-15',
    isPremium: 'Free'
  },
  {
    name: 'Cleverbot',
    description: 'Interactive AI chatbot that learns from conversations.',
    url: 'https://www.cleverbot.com',
    id: 'cleverbot',
    image: '/tool-screenshots/cleverbot.png',
    logo: '/logo/cleverbot.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'interactive-ai',
    tags: [
      'AI',
      'chatbot',
      'conversation'
    ],
    rating: '4.1',
    visits: '2000000',
    dateAdded: '2020-09-01',
    isPremium: 'Free'
  },
  {
    name: 'Dialogflow (Google)',
    description: 'Google's platform for building conversational interfaces and chatbots.',
    url: 'https://cloud.google.com/dialogflow',
    id: 'dialogflow',
    image: '/tool-screenshots/dialogflow.png',
    logo: '/logo/dialogflow.png',
    categories: [
      'text',
      'coding'
    ],
    subcategory: 'chatbot-platform',
    tags: [
      'AI',
      'chatbot',
      'conversational interface'
    ],
    rating: '4.5',
    visits: '1500000',
    dateAdded: '2020-08-01',
    isPremium: 'Free'
  },
  {
    name: 'Watson Assistant (IBM)',
    description: 'Enterprise-grade AI chatbot platform by IBM.',
    url: 'https://www.ibm.com/watson/assistant',
    id: 'watson-assistant',
    image: '/tool-screenshots/watson-assistant.png',
    logo: '/logo/watson-assistant.png',
    categories: '[\'text\',]',
    subcategory: 'enterprise-chatbot',
    tags: [
      'AI',
      'chatbot',
      'enterprise',
      'conversation'
    ],
    rating: '4.4',
    visits: '1000000',
    dateAdded: '2020-07-01',
    isPremium: 'Free'
  },
  {
    name: 'Tidio',
    description: 'AI-powered customer service chatbot platform.',
    url: 'https://www.tidio.com',
    id: 'tidio',
    image: '/tool-screenshots/tidio.png',
    logo: '/logo/tidio.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'customer-service',
    tags: [
      'AI',
      'chatbot',
      'customer support'
    ],
    rating: '4.3',
    visits: '800000',
    dateAdded: '2020-06-01',
    isPremium: 'Free'
  },
  {
    name: 'ManyChat',
    description: 'Platform for creating Facebook Messenger chatbots.',
    url: 'https://manychat.com',
    id: 'manychat',
    image: '/tool-screenshots/manychat.png',
    logo: '/logo/manychat.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'messenger-chatbot',
    tags: [
      'AI',
      'Messenger',
      'chatbot'
    ],
    rating: '4.2',
    visits: '600000',
    dateAdded: '2020-05-01',
    isPremium: 'Free'
  },
  {
    name: 'SMMRY',
    description: 'AI-powered text summarization tool.',
    url: 'https://smmry.com',
    id: 'smmry',
    image: '/tool-screenshots/smmry.png',
    logo: '/logo/smmry.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'text-summarization',
    tags: [
      'AI',
      'summary',
      'abstraction'
    ],
    rating: '4.0',
    visits: '400000',
    dateAdded: '2020-04-01',
    isPremium: 'Free'
  },
  {
    name: 'Resoomer',
    description: 'AI tool for summarizing and analyzing text content.',
    url: 'https://resoomer.com',
    id: 'resoomer',
    image: '/tool-screenshots/resoomer.png',
    logo: '/logo/resoomer.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'text-summarization',
    tags: [
      'AI',
      'summary',
      'writing'
    ],
    rating: '4.1',
    visits: '350000',
    dateAdded: '2020-03-01',
    isPremium: 'Free'
  },
  {
    name: 'Scholarcy',
    description: 'AI tool for summarizing academic papers and research articles.',
    url: 'https://www.scholarcy.com',
    id: 'scholarcy',
    image: '/tool-screenshots/scholarcy.png',
    logo: '/logo/scholarcy.png',
    categories: [
      'text',
      'research'
    ],
    subcategory: 'academic-summarization',
    tags: [
      'AI',
      'research',
      'paper summarization'
    ],
    rating: '4.2',
    visits: '300000',
    dateAdded: '2020-02-01',
    isPremium: 'Free'
  },
  {
    name: 'TLDR This',
    description: 'AI tool for generating quick summaries of articles and text.',
    url: 'https://tldrthis.com',
    id: 'tldr-this',
    image: '/tool-screenshots/tldr-this.png',
    logo: '/logo/tldr-this.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'quick-summaries',
    tags: [
      'AI',
      'summary',
      'quick read'
    ],
    rating: '4.0',
    visits: '250000',
    dateAdded: '2020-01-01',
    isPremium: 'Free'
  },
  {
    name: 'SummarizeBot',
    description: 'AI-powered tool for summarizing text and documents.',
    url: 'https://www.summarizebot.com',
    id: 'summarizebot',
    image: '/tool-screenshots/summarizebot.png',
    logo: '/logo/summarizebot.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'document-summarization',
    tags: [
      'AI',
      'summarize',
      'documents'
    ],
    rating: '4.1',
    visits: '200000',
    dateAdded: '2019-12-01',
    isPremium: 'Free'
  },
  {
    name: 'Google Translate',
    description: 'AI-powered machine translation service supporting multiple languages.',
    url: 'https://translate.google.com',
    id: 'google-translate',
    image: '/tool-screenshots/google-translate.png',
    logo: '/logo/google-translate.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'translation',
    tags: [
      'AI',
      'translation',
      'multilingual'
    ],
    rating: '4.5',
    visits: '20000000',
    dateAdded: '2019-11-01',
    isPremium: 'Free'
  },
  {
    name: 'DeepL Translator',
    description: 'High-quality AI translation service with support for multiple languages.',
    url: 'https://www.deepl.com',
    id: 'deepl',
    image: '/tool-screenshots/deepl.png',
    logo: '/logo/deepl.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'translation',
    tags: [
      'AI',
      'translation',
      'multilingual'
    ],
    rating: '4.6',
    visits: '15000000',
    dateAdded: '2019-10-01',
    isPremium: 'Free'
  },
  {
    name: 'Microsoft Translator',
    description: 'AI-powered multilingual translation service.',
    url: 'https://www.microsoft.com/translator',
    id: 'microsoft-translator',
    image: '/tool-screenshots/microsoft-translator.png',
    logo: '/logo/microsoft-translator.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'translation',
    tags: [
      'AI',
      'translation',
      'language'
    ],
    rating: '4.4',
    visits: '10000000',
    dateAdded: '2019-09-01',
    isPremium: 'Free'
  },
  {
    name: 'Reverso Context',
    description: 'AI-powered translation tool with context and language learning features.',
    url: 'https://context.reverso.net',
    id: 'reverso',
    image: '/tool-screenshots/reverso.png',
    logo: '/logo/reverso.png',
    categories: [
      'text',
      'productivity'
    ],
    subcategory: 'translation',
    tags: [
      'AI',
      'translation',
      'language learning'
    ],
    rating: '4.3',
    visits: '8000000',
    dateAdded: '2019-08-01',
    isPremium: 'Free'
  },
  {
    name: 'Answer the Public',
    description: 'AI-powered tool for content ideation and keyword research.',
    url: 'https://answerthepublic.com',
    id: 'answer-the-public',
    image: '/tool-screenshots/answer-the-public.png',
    logo: '/logo/answer-the-public.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'content-ideation',
    tags: [
      'AI',
      'ideation',
      'keywords'
    ],
    rating: '4.2',
    visits: '600000',
    dateAdded: '2019-07-01',
    isPremium: 'Free'
  },
  {
    name: 'QuestionDB',
    description: 'AI tool for generating content ideas and questions.',
    url: 'https://questiondb.io',
    id: 'questiondb',
    image: '/tool-screenshots/questiondb.png',
    logo: '/logo/questiondb.png',
    categories: [
      'text',
      'marketing'
    ],
    subcategory: 'question-generation',
    tags: [
      'AI',
      'questions',
      'ideas'
    ],
    rating: '4.1',
    visits: '400000',
    dateAdded: '2019-06-01',
    isPremium: 'Free'
  },
  {
    name: 'Brainstormer',
    description: 'AI-powered tool for creative brainstorming and idea generation.',
    url: 'https://brainstormer.ai',
    id: 'brainstormer',
    image: '/tool-screenshots/brainstormer.png',
    logo: '/logo/brainstormer.png',
    categories: [
      'text'
    ],
    subcategory: 'creative-brainstorming',
    tags: [
      'AI',
      'ideation',
      'creativity'
    ],
    rating: '4.0',
    visits: '300000',
    dateAdded: '2019-05-01',
    isPremium: 'Free'
  },
  {
    name: 'Descript',
    description: 'AI-powered audio and video editing platform with text-based editing capabilities.',
    url: 'https://www.descript.com',
    id: 'descript',
    image: '/tool-screenshots/descript.png',
    logo: '/logo/descript.png',
    categories: [
      'audio',
      'video'
    ],
    subcategory: 'media-editing',
    tags: [
      'AI',
      'audio',
      'video',
      'editing'
    ],
    rating: '4.5',
    visits: '1800000',
    dateAdded: '2017-08-01',
    isPremium: 'Free'
  }
];

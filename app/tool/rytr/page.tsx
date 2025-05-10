import type { Metadata } from 'next'
import { ToolPage } from '@/components/tool-page'

export const metadata: Metadata = {
  title: 'Rytr - AI Tools Directory',
  description: 'An AI writing assistant that helps you create high-quality content for various purposes, from blog posts to social media.',
}

export default function Page() {
  return <ToolPage toolId="rytr" />
}
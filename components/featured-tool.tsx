import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tool } from '@/lib/types';

interface FeaturedToolProps {
  tool: Tool;
}

export function FeaturedTool({ tool }: FeaturedToolProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
      <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {tool.logo && (
              <Image
                src={tool.logo}
            alt={tool.name}
                width={32}
                height={32}
                className="rounded-sm"
              />
            )}
            <h3 className="font-bold">{tool.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {tool.description}
          </p>
          </div>
        <div className="flex items-center gap-2">
          <Link
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Visit Website
          </Link>
          <span className="text-sm text-muted-foreground">
            {tool.rating} ★
          </span>
            </div>
      </div>
    </div>
  );
}
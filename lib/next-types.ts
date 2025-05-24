import { Metadata } from 'next'

export type PageParams<T extends string> = {
  params: { [key in T]: string }
}

export type PageProps<T extends string> = {
  params: { [key in T]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export type GenerateMetadataProps<T extends string> = PageParams<T> 
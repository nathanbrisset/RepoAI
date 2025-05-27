import { Metadata } from 'next'

export type MyPageParams<T extends string> = {
  params: { [key in T]: string }
}

export type MyPageProps<T extends string> = {
  params: { [key in T]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export type GenerateMetadataProps<T extends string> = MyPageParams<T> 
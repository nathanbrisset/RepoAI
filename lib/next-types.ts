import { Metadata } from 'next'

export type MyPageParams<T extends string> = {
  params: { [key in T]: string }
}

export type GenerateMetadataProps<T extends string> = MyPageParams<T> 
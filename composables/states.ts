export type Headers = Readonly<Record<string, string>>
export const useHeaders = () => useState<Headers>('headers')
export const useHeadersWithDefault = (init: Headers) =>
  useState<Headers>('headers', () => init)

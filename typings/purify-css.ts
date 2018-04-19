declare namespace purifyCss {
  interface Options {
    minify?: boolean
    output?: boolean
    info?: boolean
    rejected?: boolean
    whitelist?: string[]
  }
}

declare function purifyCss(
  content: string | string[],
  css: string | string[],
  options: purifyCss.Options,
  callback?: (css: string) => void
): string

export = purifyCss

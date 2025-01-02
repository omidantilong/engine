import type { PageType, Config } from "../types"

export * from "./defaults"

export function definePageType(pageType: PageType) {
  return pageType
}

export function defineEngineConfig(config: Config) {
  return config
}

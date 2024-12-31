import type { EngineConfig, EnginePageType } from "../types"

export * from "./defaults"

export function definePageType(pageType: EnginePageType) {
  return pageType
}

export function defineEngineConfig(config: EngineConfig) {
  return config
}

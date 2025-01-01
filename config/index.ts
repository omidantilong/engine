import type Engine from "engine:types"

export * from "./defaults"

export function definePageType(pageType: Engine.PageType) {
  return pageType
}

export function defineEngineConfig(config: Engine.Config) {
  return config
}

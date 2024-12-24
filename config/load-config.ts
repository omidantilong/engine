import type { EngineConfig } from "../types"

const cwd = process.cwd()

export async function loadConfig(): Promise<EngineConfig> {
  if (process.env.NODE_ENV === "development") {
    const config = await import(cwd + "/tenant.config.ts")
    return config.engineConfig
  }

  const config = await import(cwd + "/tenant.config.mjs")
  return config.engineConfig
}

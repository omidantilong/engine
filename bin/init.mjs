import fs from "fs-extra"
import path from "node:path"
import util from "node:util"
import * as child_process from "child_process"
import yoctoSpinner from "yocto-spinner"

const exec = util.promisify(child_process.exec)
const cwd = process.cwd()

function formatJSON(input) {
  return JSON.stringify(input, null, 2)
}

async function execute(cmd) {
  const execResult = await exec(cmd)
  if (execResult.stderr) return false
  return true
}

const editorSettings = formatJSON({
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode",
  },
})

const tsconfigSettings = formatJSON({
  extends: "astro/tsconfigs/strict",
  compilerOptions: {
    jsx: "react-jsx",
    jsxImportSource: "react",
    baseUrl: ".",
    skipLibCheck: false,
    paths: {
      "@/*": ["src/*"],
    },
  },
})

const prettierSettings = formatJSON({
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  singleQuote: false,
  printWidth: 100,
})

const envTypes = `
/// <reference types="astro/client" />
/// <reference types="@omidantilong/engine/types" />
/// <reference types="@omidantilong/engine/types/env.d.ts" />
`

const astroConfig = `
import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import react from "@astrojs/react"
import UnoCSS from "unocss/astro"

import { engine } from "@omidantilong/engine"

export default defineConfig({
  output: "server",
  devToolbar: { enabled: false },
  adapter: node({
    mode: "standalone",
  }),
  integrations: [engine(), UnoCSS(), react()],
  server: {
    port: 8020,
  },
  vite: {
    plugins: [],
    resolve: {
      alias: {
        "@/": "./src",
      },
    },
  },
})
`

const tenantConfig = `
import type { EngineConfig } from "@omidantilong/engine/types"

export const engineConfig: EngineConfig = {}
`.trimStart()

async function setupFiles() {
  try {
    await fs.ensureDir(cwd + "/engine")
    await fs.ensureDir(cwd + "/types")
    await fs.ensureDir(cwd + "/.vscode")
    await fs.outputFile(cwd + "/.vscode/settings.json", editorSettings)
    await fs.outputFile(cwd + "/tsconfig.json", tsconfigSettings)
    await fs.outputFile(cwd + "/.prettierrc", prettierSettings)
    return true
  } catch (e) {
    return false
  }
}

async function setupTenant() {
  try {
    await fs.outputFile(cwd + "/astro.config.ts", astroConfig)
    await fs.outputFile(cwd + "/types/env.d.ts", envTypes)
    await fs.outputFile(cwd + "/tenant.config.ts", tenantConfig)
    return true
  } catch (e) {
    return false
  }
}

async function installDeps() {
  return await execute("npm install astro @astrojs/node @astrojs/react unocss")
}

async function init() {
  const pkg = await fs.readFile(cwd + "/package.json").then((res) => JSON.parse(res.toString()))

  // const spinner = yoctoSpinner({ text: "Creating path map" }).start()
  // await exec("npm run engine:map")
  // spinner.success()

  const actions = {
    //"Installing dependencies": () => installDeps(),
    "Setting up Tenant config": () => setupTenant(),
    "Setting up project files": () => setupFiles(),
    //"Writing local content map": () => exec("npm run engine:map"),
  }

  for (const action in actions) {
    const spinner = yoctoSpinner({ text: action }).start()
    const result = await actions[action]()

    if (result) {
      spinner.success()
    } else {
      spinner.error()
      process.exit()
    }
  }

  //await execute("npm install astro")
}

init()

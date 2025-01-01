#!/usr/bin/env node

/* 
 * This needs a lot of tidying up, splitting things out into separate
   files, etc. Just a proof of concept atm for what an init script could
   look like. 
 */

import fs from "fs-extra"
import path from "node:path"
import util from "node:util"
import * as child_process from "child_process"
import yoctoSpinner from "yocto-spinner"

const exec = util.promisify(child_process.exec)
const cwd = process.cwd()
const dir = path.basename(cwd)

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
  extends: "@omidantilong/engine/presets/tsconfig.tenant",
  compilerOptions: {
    jsx: "react-jsx",
    jsxImportSource: "react",
    baseUrl: ".",
  },
})

const prettierSettings = `
/** @type {import("prettier").Config} */
export default {
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  singleQuote: false,
  printWidth: 100,
}
`

const envTypes = `
/// <reference types="@omidantilong/engine/types/env" />
`

const astroConfig = `
import { defineConfig } from "astro/config"
import { engine } from "@omidantilong/engine"
import node from "@astrojs/node"

export default defineConfig({
  output: "server",
  devToolbar: { enabled: false },
  adapter: node({
    mode: "standalone",
  }),
  integrations: [engine()],
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

const vitestConfig = `
/// <reference types="vitest" />
import { getViteConfig } from "astro/config"

export default getViteConfig({})
`

const tenantConfig = `
import defineEngineConfig from "@omidantilong/engine/config"

export const engineConfig = defineEngineConfig({})
`

const gitIgnoreSettings = `
# build output
dist/

# generated types
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# environment
.env
.env.production
.env.*

# os files
.DS_Store

# editor
*.code-workspace

# engine
engine/
`

const dockerIgnoreSettings = `
.DS_Store
node_modules
engine
dist
scratch
.vscode
.code-workspace
`

const componentIndex = `
export {}
`

async function setupFiles() {
  try {
    await fs.ensureDir(cwd + "/engine")
    await fs.ensureDir(cwd + "/src")
    await fs.ensureDir(cwd + "/types")
    await fs.ensureDir(cwd + "/.vscode")

    await fs.outputFile(cwd + "/.vscode/settings.json", editorSettings)
    await fs.outputFile(cwd + "/tsconfig.json", tsconfigSettings)
    await fs.outputFile(cwd + "/prettier.config.mjs", prettierSettings.trimStart())
    await fs.outputFile(cwd + "/.gitignore", gitIgnoreSettings.trimStart())
    await fs.outputFile(cwd + "/.dockerignore", dockerIgnoreSettings.trimStart())

    return true
  } catch (e) {
    return false
  }
}

async function setupTenant() {
  try {
    await fs.outputFile(cwd + "/astro.config.ts", astroConfig.trimStart())
    await fs.outputFile(cwd + "/types/env.d.ts", envTypes.trimStart())
    await fs.outputFile(cwd + "/tenant.config.ts", tenantConfig.trimStart())
    await fs.outputFile(cwd + "/vitest.config.ts", vitestConfig.trimStart())
    await fs.outputFile(cwd + "/src/components/index.ts", componentIndex.trimStart())

    return true
  } catch (e) {
    return false
  }
}

async function installDeps() {
  return await execute("npm i vitest typescript")
}

async function writePackageScripts() {
  try {
    const pkg = await fs.readFile(cwd + "/package.json").then((res) => JSON.parse(res.toString()))

    pkg.scripts = {
      dev: "astro dev",
      astro: "astro",
      "astro:dev": "astro dev",
      "astro:build": "astro check && astro build",
      "astro:check": "astro check",
      "astro:preview": "astro preview",
      "engine:build-local": "engine build-local",
      "engine:build-astro": "engine build-astro",
      "engine:build": "engine build",
      "engine:serve": "engine serve",
      "engine:map": "tsx ./node_modules/@omidantilong/engine/contentful/map.ts",
      test: "vitest",
    }

    pkg.type = "module"
    pkg.engines = { node: ">= 20" }
    pkg.name = dir

    await fs.writeFile(cwd + "/package.json", formatJSON(pkg))
    return true
  } catch (e) {
    return false
  }
}

async function setupCSS() {
  const mainSCSSContent = `
  @use "@/styles/reset";
  `

  const resetSCSSContent = `
/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Prevent font size inflation */
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

html,
body,
h1,
h2,
h3,
h4,
p {
  margin: 0;
  padding: 0;
  border: 0;
}

/* Remove default margin in favour of better control in authored CSS */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin-block-end: 0;
}

h1,
h2,
h3,
h4 {
  font-weight: 600;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role="list"],
ol[role="list"] {
  list-style: none;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  line-height: 1.5;
}

/* Set shorter line heights on interactive elements */
button,
input,
label {
  line-height: 1.1;
}

/* Balance text wrapping on headings */
h1,
h2,
h3,
h4 {
  text-wrap: balance;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
  //color: currentColor;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
}

/* Make sure textareas without a rows attribute are not tiny */
textarea:not([rows]) {
  min-height: 10em;
}

/* Anything that has been anchored to should have extra scroll margin */
:target {
  scroll-margin-block: 5ex;
}

:root {
  --flow-space: 1rem;
}

.flow > * + * {
  margin-block-start: var(--flow-space, 1rem);
}
  `

  try {
    await fs.ensureDir(cwd + "/src/styles")
    await fs.outputFile(cwd + "/src/styles/main.scss", mainSCSSContent)
    await fs.outputFile(cwd + "/src/styles/_reset.scss", resetSCSSContent)

    return true
  } catch (e) {
    return false
  }
}

async function init() {
  const actions = {
    "Installing dependencies": () => installDeps(),
    "Setting up project files": () => setupFiles(),
    "Setting up Tenant config": () => setupTenant(),
    "Writing package scripts": () => writePackageScripts(),
    "Applying default styles": () => setupCSS(),
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

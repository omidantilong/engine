import fs from "node:fs"

const pkg = await import("package.json")

console.log(pkg)

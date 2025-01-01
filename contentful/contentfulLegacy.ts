import type Engine from "engine:types"
import type CMS from "engine:types/cms"

import * as fragments from "./fragments"
import { engineDefaults } from "../config/defaults"
import { parentLookup } from "./parentLookup"
import fs from "node:fs/promises"
import gqlmin from "gqlmin"

//@ts-ignore
import { engineConfig } from "../../../../tenant.config"
import { getFullPath } from "../util/path"
//import { loadConfig } from "../config/load-config"

import { resolve } from "node:path"

export { parentLookup }
export { parse } from "./markdown"

//const conf = await loadConfig()

const pageTypes: Engine.PageTypeMap = {
  ...engineConfig.pageTypes,
  ...engineDefaults.pageTypes,
}

const cwd = process.cwd()

export async function getEntry(ref: Engine.EntryReference): Promise<Engine.EntryResponse> {
  const query = pageTypes[ref.type as keyof Engine.PageTypeMap].entryQuery({
    ref,
    fragments,
    parentLookup,
  })
  const { data, errors } = await fetchData({ query })

  const { entry } = data
  return { entry, errors }
}

export async function getAsset(id: string) {
  const query = `
    query AssetQuery { 
      asset(id:"${id}") {
        title
        contentType
        width
        height
        sys {
          id
        }
      }
    }`
  return await fetchData({ query })
}

export async function getRedirect(pathname: string) {
  const query = `
    query RedirectQuery {
      collection: redirectCollection(limit: 3000) {
        items {
          from,
          to
        }
      }
    }
  `

  const { data } = await fetchData({ query })

  for (let redirect of data.collection.items) {
    const exp = `^${redirect.from}`
    if (pathname.match(exp)) {
      console.log("Redirect match")
      return redirect
    }
  }
}

export async function fetchData({ query, preview = false }: { query: string; preview?: boolean }) {
  const token = preview
    ? import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_API
    : import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_API

  const spaceId = import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID
  const spaceEnv = import.meta.env.PUBLIC_CONTENTFUL_ENV
  return await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${spaceEnv}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: gqlmin(query) }),
    }
  ).then((res) => {
    //console.log(gqlmin(query))
    console.log(`Query complexity: ${res.headers.get("X-Contentful-Graphql-Query-Cost")} / 11000`)
    return res.json()
  })
}

export async function getEntryRefFromPath(
  pathname: string
): Promise<Engine.EntryReference | false> {
  let paths: Engine.PathMap
  try {
    await fs.access(resolve(cwd + "/engine/paths.json"))
    paths = await fs
      .readFile(resolve(cwd + "/engine/paths.json"))
      .then((res) => JSON.parse(res.toString()))
  } catch (e) {
    paths = await createContentMap()
  }

  return paths[pathname] || false
}

// export async function getEntryPathFromRef(id: string): Promise<string> {
//   //const d = await cache.get("foo")

//   //console.log(d)
//   const refs = await fs.readFile("public/refs.json").then((res) => JSON.parse(res.toString()))
//   return refs[id] ?? false
// }

export async function createContentMap() {
  console.log("Rebuilding content path map")

  const pathMap: Engine.PathMap = {}
  const refMap: Engine.ReferenceMap = {}

  for (const pageType in pageTypes) {
    const { collectionQuery, root } = pageTypes[pageType as keyof Engine.PageTypeMap]
    const query = collectionQuery({ fragments, parentLookup })
    const { data } = await fetchData({ query })

    data.collection.items.forEach((entry: CMS.DefaultPage | CMS.TenantPage) => {
      const resolvedPath = getFullPath(entry, root)

      pathMap[resolvedPath] = { id: entry.sys.id, type: entry.type }
      refMap[entry.sys.id] = resolvedPath
    })
  }

  await fs.writeFile(resolve(cwd + "/engine/paths.json"), JSON.stringify(pathMap))

  return pathMap
  //await fs.writeFile("engine/refs.json", JSON.stringify(refMap))
}

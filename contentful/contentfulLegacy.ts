import type { EngineEntryReference, EngineEntryResponse, EngineContentTypeConfig } from "../types"
import * as fragments from "./fragments"
import { engineDefaults } from "../config/defaults"
import { parentLookup } from "./parentLookup"
import fs from "node:fs/promises"
import gqlmin from "gqlmin"

//@ts-ignore
import { engineConfig } from "../../../../tenant.config"
//import { loadConfig } from "../config/load-config"

export { parentLookup }
export { parse } from "./markdown"

//const conf = await loadConfig()

const contentTypes: EngineContentTypeConfig = {
  ...engineConfig.contentTypes,
  ...engineDefaults.contentTypes,
}

export async function getEntry(ref: EngineEntryReference): Promise<EngineEntryResponse> {
  const query = contentTypes[ref.type as keyof EngineContentTypeConfig].entryQuery({
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

// async function buildCache() {
//   console.log("Rebuilding path cache")
//   const paths = await fs.readFile("engine/paths.json").then((res) => JSON.parse(res.toString()))
//   for (const path in paths) {
//     await cache.set(path, paths[path])
//   }
// }

// export async function getEntryRefFromPath(pathname: string): Promise<EngineEntryReference | false> {
//   if (!cache) {
//     cache = createCache({
//       ttl: 60000,
//       stores: [new Keyv()],
//     })
//     await buildCache()
//   }
//   let ref: EngineEntryReference | null = await cache.get(pathname)
//   if (!ref) {
//     await buildCache()
//     ref = await cache.get(pathname)
//   }

//   return ref ?? false
// }

export async function getEntryRefFromPath(pathname: string): Promise<EngineEntryReference | false> {
  const paths = await fs.readFile("engine/paths.json").then((res) => JSON.parse(res.toString()))
  return paths[pathname] || false
}

export async function getEntryPathFromRef(id: string): Promise<string> {
  //const d = await cache.get("foo")

  //console.log(d)
  const refs = await fs.readFile("public/refs.json").then((res) => JSON.parse(res.toString()))
  return refs[id] ?? false
}

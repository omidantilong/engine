// These functions create maps of content that can be used to quickly
// look up a pathname to get its page (or other content type) id. They
// are just written to the file system as plain json files for now.

// Part of the refMap contains entries for every InternalLink content
// type, meaning links can be resolved quickly without additional api
// calls. But the alternative approach of extending the graphql query
// seems to be performing ok so far

import dotenv from "dotenv"

dotenv.config({ path: `.env.development` })

import { createContentMap } from "../contentful"

console.log(import.meta)

async function run() {
  const tokens = {
    PUBLIC_CONTENTFUL_DELIVERY_API: process.env.PUBLIC_CONTENTFUL_DELIVERY_API,
    PUBLIC_CONTENTFUL_PREVIEW_API: process.env.PUBLIC_CONTENTFUL_PREVIEW_API,
    PUBLIC_CONTENTFUL_SPACE_ID: process.env.PUBLIC_CONTENTFUL_SPACE_ID,
    PUBLIC_CONTENTFUL_ENV: process.env.PUBLIC_CONTENTFUL_ENV,
  }

  // await createContentMap({ tokens })
}

run().then(() => {
  console.log("Wrote map")
})

import { defineMiddleware } from "astro:middleware"

import { getEntry, getEntryRefFromPath, getRedirect } from "../contentful"
import { sanitizePath } from "../util/path"
import type { Sys } from "@omidantilong/engine/types/cms"

//import type { MiddlewareHandler } from "astro"

// https://github.com/getsentry/sentry-javascript/blob/develop/packages/astro/src/server/middleware.ts
// function checkIsDynamicPageRequest(context: Parameters<MiddlewareHandler>[0]): boolean {
//   try {
//     return context.clientAddress != null
//   } catch {
//     return false
//   }
// }

export const onRequest = defineMiddleware(async (context, next) => {
  //console.log(context.routePattern)
  //const isDynamic = checkIsDynamicPageRequest(context)
  const isEngineInternalRoute = !!context.routePattern.includes("__engine__")

  if (!context.isPrerendered && !isEngineInternalRoute) {
    const pathname = sanitizePath(context.url.pathname)
    //const { data } = await getPage(pathname)
    //console.log(data)
    // Would be nice to just return an actual Response here. This does
    // work but seems to bypass Astro's custom 404 page unlike next()
    // context.rewrite doesn't seem to work either

    //if (data.error) return new Response(new Blob(), { status: 404 })
    //if (data.error) return next("/404")

    // Redirect if data.redirect is true
    //if (data.redirect) return context.redirect(data.to)

    // Return 404 if there is no page with that slug
    //if (!data?.pageCollection?.items) return next("/404")

    const ref = await getEntryRefFromPath(pathname)

    if (!ref) {
      const redirect = await getRedirect(pathname)

      if (redirect) return context.redirect(redirect.data.to)

      return next("/404")
      //return { data: { error: { code: 404 } } }
    }

    //const { entry } = await getEntry(ref)
    //console.log(entry)
    //interface PageType extends Sys {}

    context.locals.engine = {
      ref,
      entry: async () => {
        return await getEntry(ref)
      },
      // entry: <PageType extends Sys>() => { entry: PageType } {
      //   return { entry }
      // },
    }
  }

  // if (context.url.pathname === "/some-test-path") {
  //   return Response.json({
  //     ok: true,
  //   })
  // }

  return next()
})

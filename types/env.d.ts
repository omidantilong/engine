/// <reference path="../../../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="../../../../src/contentful.d.ts" />

declare namespace App {
  interface Locals extends Record<string, any> {
    engine: {
      ref: { id: string; type: string }
    }
  }
}

declare interface Sys {
  sys: {
    id: string
    publishedAt: string
  }
}

declare interface ContentfulDefaultPage extends Sys {
  type: "Page"
  slug: string
  title: string
  metaTitle: string
  parent: ContentfulPage
  modulesCollection: { items: Array<ContentModule> }
}

declare type EngineContentEntry = ContentfulDefaultPage

declare interface DefaultModule extends Sys {
  type: string
}

declare type ContentModule = Omit<TenantModule, DefaultModule>

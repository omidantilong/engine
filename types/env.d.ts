/// <reference types="astro/client" />
/// <reference path="../../../../types/tenant.d.ts" />

declare namespace App {
  interface Locals extends Record<string, any> {
    engine: {
      ref: { id: string; type: string }
    }
  }
}

declare namespace CMS {
  interface Sys {
    sys: {
      id: string
      publishedAt: string
    }
  }
  interface DefaultPage extends Sys {
    type: "Page"
    slug: string
    title: string
    metaTitle: string
    parent: DefaultPage
    modulesCollection: { items: Array<ContentModule> }
  }
  interface DefaultModule extends Sys {
    type: string
  }
  type Page = DefaultPage | TenantPage
  type ContentModule = DefaultModule | TenantModule
}

declare namespace Engine {}

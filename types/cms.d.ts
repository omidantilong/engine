declare module "engine:types/cms" {
  export interface Sys {
    sys: {
      id: string
      publishedAt: string
    }
  }
  export interface DefaultPage extends Sys {
    type: "Page"
    slug: string
    title: string
    metaTitle: string
    parent: DefaultPage
    modulesCollection: { items: Array<DefaultContentModule> }
  }
  export interface DefaultContentModule extends Sys {
    type: string
  }
  export type RootEntry = DefaultPage | TenantPage
  export type ContentModule = DefaultContentModule | TenantContentModule
}

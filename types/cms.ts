export interface Sys {
  sys: {
    id: string
    publishedAt: string
  }
  type: string
}
export interface DefaultPage extends Sys {
  type: "Page"
  slug: string
  title: string
  metaTitle: string
  parent: DefaultPage
  modulesCollection: { items: Array<ContentModule> }
}
export interface ContentModule extends Sys {}
//export type RootEntry = DefaultPage | TenantPage
//export type ContentModule = DefaultContentModule | TenantContentModule

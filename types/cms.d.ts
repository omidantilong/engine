declare namespace CMS {
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
  // type Page = DefaultPage | TenantPage
  // type ContentModule = DefaultContentModule | TenantContentModule
}

//declare namespace Engine {}

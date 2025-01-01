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

  export type ContentModule = DefaultContentModule | TenantContentModule
}

declare module "engine:types" {
  export interface Config {
    pageTypes?: PageTypeMap
  }

  export interface PageTypeMap {
    [key: Capitalize<string>]: PageType
  }

  export interface PageType {
    root?: string
    entryQuery: ({ ref, fragments, parentLookup }: EntryQueryCallback) => string
    collectionQuery: ({ fragments, parentLookup }: CollectionQueryCallback) => string
  }

  export interface DefaultRoutes {
    [key: string]: () => { pattern: string; entrypoint: string }
  }

  export interface FragmentCollection {
    [key: string]: string
  }

  export interface EntryQueryCallback {
    ref: EntryReference
    fragments: FragmentCollection
    parentLookup: Function
  }

  export interface CollectionQueryCallback {
    fragments: FragmentCollection
    parentLookup: Function
  }

  export interface EntryReference {
    id: string
    type: string
  }

  export interface EntryResponse {
    entry: Entry
    errors: any
  }

  export interface PathMap {
    [key: string]: {
      id: string
      type: string
    }
  }

  export interface ReferenceMap {
    [key: string]: string
  }
  //type Entry = { type: string }
  export type Entry = import("engine:types/cms").DefaultPage | import("engine:types/cms").TenantPage
}

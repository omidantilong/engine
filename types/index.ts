import type { Sys } from "../types/cms"

export interface Config {
  /**
   * Remember this is how you add type hints
   */
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

export interface EntryResponse<PageType extends Sys> {
  entry: PageType
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

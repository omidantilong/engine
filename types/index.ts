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
  entry: import("engine:types/cms").RootEntry
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

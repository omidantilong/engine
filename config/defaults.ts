import type { Config } from "../types"

export const engineDefaults: Config = {
  pageTypes: {
    Page: {
      entryQuery: ({ ref, fragments, parentLookup }) => `
      ${fragments.pageData}
      ${fragments.sys}
      ${fragments.video}
      ${fragments.image}
      ${fragments.text}
      ${fragments.editorialCard}
      ${fragments.externalLink}
      ${fragments.internalLink}
      ${fragments.signpost}
      query PageQuery {
        entry: page(id:"${ref.id}") { 
          ...pageData
          metaTitle
          metaDescription
          parent: parentPage {
            ${parentLookup(3)}
          }
          heroCollection(limit: 1) {
            items {
              sys {
                id
              }
              type: __typename
              title
              heroHeading
              heroBody
              image {
                url
                title
                description
                width
                height
              }
              imageCaption
              link: heroLink {
                type: __typename
                ...externalLinkFields
                ...internalLinkFields
              }
            }
          }
          modulesCollection(limit: 10) {
            items {
              type: __typename
              ...sysFields
              ...videoFields
              ...imageFields
              ...textFields
              ...on Section {
                title
                contentCollection(limit: 20) {
                  items {
                    type: __typename
                    ...sysFields
                    ...videoFields
                    ...imageFields
                    ...textFields
                    ...signpostFields
                    ...editorialCardFields

                  }
                }
              }
            }
          } 
        } 
      }`,
      collectionQuery: ({ fragments, parentLookup }) => `
        ${fragments.pageData}
        query PageQuery {
          collection: pageCollection(limit: 1000) { 
            items { 
              ...pageData
              parent: parentPage {
                ${parentLookup(3)}
              }
            }
          }
        }`,
    },
  },
}

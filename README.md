# Astro Tenant Engine

The package contains the internals ("engine") for the astro-tenant repo.

It's not currently published to NPM, but it can be installed straight from github.

To get started in a fresh project, run:

```
npm install github:omidantilong/engine
npx engine init
```

Then you'll need a `.env.development` file with the following:

```
PUBLIC_CONTENTFUL_DELIVERY_API=
PUBLIC_CONTENTFUL_PREVIEW_API=
PUBLIC_CONTENTFUL_SPACE_ID=
PUBLIC_CONTENTFUL_ENV=
```

### How it works

At its core, the `engine` module is an Astro integration providing a wrapper around Contentful.

Tenants using the engine must provide a `tenant.config.ts` at their root. This file is used to register new content types for top level pages and provide other local config.

The integration works by injecting middleware into Astro. A `map` function is exposed which generates a flat map of all publicly-accessible URLs, using the path as a key for an object containing the contentful entry id and content type. The middleware checks incoming request paths against this map and returns an entry reference. At this point Astro's file routing takes over, using either the default route templates provided by the engine or custom templates defined locally. These templates can access the entry reference using `Astro.locals.engine` and then decide how to render the content.

### Tenant setup

Tenants need the following files:

- `.env` file with appropriate Contentful token, space id and environment name
- `src/components` for registering components
- `src/types/env.d.ts` referencing astro and engine types
- `src/types/tenant.d.ts` types for bespoke content models
- `tenant.config.ts` containing local tenant config
- `astro.config.ts` standard astro config
- `Dockerfile` for building production image

Much of this will be automated in the engine install process.

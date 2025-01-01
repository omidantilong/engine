/// <reference types="astro/client" />
//@ts-ignore
/// <reference types="../../../../types/cms" />

declare namespace App {
  interface Locals extends Record<string, any> {
    engine: {
      ref: { id: string; type: string }
    }
  }
}

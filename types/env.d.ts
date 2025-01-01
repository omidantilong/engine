/// <reference types="astro/client" />

declare namespace App {
  interface Locals extends Record<string, any> {
    engine: {
      ref: { id: string; type: string }
    }
  }
}

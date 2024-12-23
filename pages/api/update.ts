import type { APIRoute } from "astro"

export const GET: APIRoute = ({ params, request }) => {
  console.log(new URL(request.url))
  return new Response(
    JSON.stringify({
      name: "Astro",
      url: "https://astro.build/",
    })
  )
}

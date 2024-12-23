export function sanitizePath(path: string) {
  // If the incoming path is just a slash, return it
  // Otherwise remove the trailing slash

  if (path === "/") return path
  return path.endsWith("/") ? path.slice(0, -1) : path
}

export function getPathSegments(entry: CMS.ContentEntry) {
  const path = [entry.slug]

  if ("parent" in entry && entry.parent) {
    path.push(getPathSegments(entry.parent))
  }

  return path.reverse().join("/")
}

export function getFullPath(entry: CMS.ContentEntry, root: string = "") {
  return entry.slug === "/" ? entry.slug : `${root}/${getPathSegments(entry)}`
}

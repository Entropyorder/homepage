// Resolve a public asset path relative to BASE_URL.
// Works in both dev (BASE_URL = '/') and GitHub Pages (BASE_URL = '/Entropyorder/').
// Accepts paths with or without leading slash; returns a correctly joined URL.
export function publicAsset(path) {
  if (!path) return ''
  // External URLs pass through untouched
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path

  const base = import.meta.env.BASE_URL || '/'
  const baseClean = base.endsWith('/') ? base.slice(0, -1) : base
  const pathClean = path.startsWith('/') ? path : `/${path}`
  return `${baseClean}${pathClean}`
}

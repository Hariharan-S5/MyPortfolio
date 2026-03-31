/**
 * Prepends Vite's BASE_URL to any absolute public asset path.
 * In development: BASE_URL = "/"  → path unchanged
 * In production (GitHub Pages): BASE_URL = "/MyPortfolio/" → path fixed
 *
 * @param {string} path - e.g. "/assets/profile-pic.jpeg"
 * @returns {string} - e.g. "/MyPortfolio/assets/profile-pic.jpeg"
 */
export function getAssetUrl(path) {
  if (!path) return '';
  // Strip any cache-busting query string for the path check
  const [filePath, query] = path.split('?');
  // Remove leading slash since BASE_URL already ends with /
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : import.meta.env.BASE_URL + '/';
  return base + cleanPath + (query ? `?${query}` : '');
}

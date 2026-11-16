/** Legacy require target; Next uses next.config.mjs in production. */
module.exports = {
  redirects: async () => {
    const { getSiteRedirects } = await import("./lib/routing/site-redirects.mjs")
    return getSiteRedirects()
  },
}
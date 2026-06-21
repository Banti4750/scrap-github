import { octokit } from './client.ts'

// --- Search API ---
// Note: Search has a tighter limit (30 req/min) and caps results at 1,000
// per query. For big sweeps, narrow with qualifiers (language:, stars:, etc.)
// or slice by date ranges and page through.

/** Search repositories. e.g. q = "topic:cli language:typescript stars:>100" */
export async function searchRepos(q: string, limit = 100) {
  return octokit.paginate(
    octokit.rest.search.repos,
    { q, per_page: 100 },
    (response, done) => {
      // Stop early once we have enough.
      const items = response.data
      if (items.length >= limit) done()
      return items
    },
  ).then((items) => items.slice(0, limit))
}

/** Search code across public repos. e.g. q = "addEventListener language:js" */
export async function searchCode(q: string, limit = 100) {
  const { data } = await octokit.rest.search.code({ q, per_page: Math.min(limit, 100) })
  return data.items
}

/** Search users/orgs. e.g. q = "location:berlin language:go" */
export async function searchUsers(q: string, limit = 100) {
  const { data } = await octokit.rest.search.users({ q, per_page: Math.min(limit, 100) })
  return data.items
}

import { Octokit } from 'octokit'

// A single shared Octokit instance.
//
// `octokit` (the meta-package) ships with the throttling + retry plugins
// already wired in, so rate limits and transient 5xx errors are handled
// for us — that's what makes large pulls "manageable".
//
// Auth: set GITHUB_TOKEN in a .env file. Bun loads .env automatically.
//   - no token  ->   60 requests/hour
//   - with token -> 5,000 requests/hour
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  throttle: {
    onRateLimit: (retryAfter: number, options: any, _octokit: unknown, retryCount: number) => {
      console.warn(`Rate limit hit for ${options.method} ${options.url}`)
      // Retry up to 2 times automatically.
      if (retryCount < 2) {
        console.warn(`Retrying after ${retryAfter}s...`)
        return true
      }
      return false
    },
    onSecondaryRateLimit: (_retryAfter: number, options: any) => {
      console.warn(`Secondary rate limit for ${options.method} ${options.url}`)
      return true
    },
  },
})

/**
 * Auto-paginate but STOP after `max` items. Without a cap, fetching e.g.
 * every commit of a huge repo would burn your whole hourly rate limit and
 * take forever. Pass max = Infinity only when you truly want everything.
 */
export async function paginateUpTo<T>(
  endpoint: any,
  params: Record<string, unknown>,
  max = 300,
): Promise<T[]> {
  const out: T[] = []
  await octokit.paginate(endpoint, { per_page: 100, ...params }, (response: any, done: () => void) => {
    out.push(...response.data)
    if (out.length >= max) done()
    return response.data
  })
  return out.slice(0, max)
}

if (!process.env.GITHUB_TOKEN) {
  console.warn(
    '⚠  No GITHUB_TOKEN set — limited to 60 requests/hour.\n' +
      '   Create one at https://github.com/settings/tokens (no scopes needed for public data)\n' +
      '   and put it in a .env file:  GITHUB_TOKEN=ghp_xxx',
  )
}

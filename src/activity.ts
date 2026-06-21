import { octokit, paginateUpTo } from './client.ts'

// --- Issues, PRs & commits (REST API) ---
// Paginated but capped (default 300 items) so a huge repo can't run away
// with your rate limit. Bump `max` when you really want everything.

/** Issues for a repo. state = "open" | "closed" | "all". */
export async function listIssues(
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'all',
  max = 300,
) {
  return paginateUpTo(octokit.rest.issues.listForRepo, { owner, repo, state }, max)
}

/** Pull requests for a repo. */
export async function listPullRequests(
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'all',
  max = 300,
) {
  return paginateUpTo(octokit.rest.pulls.list, { owner, repo, state }, max)
}

/** Commit history for a repo (optionally filtered by branch/path). */
export async function listCommits(
  owner: string,
  repo: string,
  opts: { sha?: string; path?: string } = {},
  max = 300,
) {
  return paginateUpTo(octokit.rest.repos.listCommits, { owner, repo, ...opts }, max)
}

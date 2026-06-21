import { octokit, paginateUpTo } from './client.ts'

// --- Repo & user metadata (REST API) ---

/** Full metadata for one repo: stars, forks, language, topics, license, etc. */
export async function getRepo(owner: string, repo: string) {
  const { data } = await octokit.rest.repos.get({ owner, repo })
  return data
}

/** A user's (or org's) public profile. */
export async function getUser(username: string) {
  const { data } = await octokit.rest.users.getByUsername({ username })
  return data
}

/**
 * Every public repo for a user — auto-paginated, so this handles
 * users with 1 repo or 1,000 the same way.
 */
export async function listUserRepos(username: string, max = 300) {
  return paginateUpTo(octokit.rest.repos.listForUser, { username }, max)
}

/** Languages breakdown (bytes per language) for a repo. */
export async function getRepoLanguages(owner: string, repo: string) {
  const { data } = await octokit.rest.repos.listLanguages({ owner, repo })
  return data
}

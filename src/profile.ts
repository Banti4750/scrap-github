import { getUser, listUserRepos, getRepoLanguages } from './repos.ts'
import { listCommits } from './activity.ts'

const DAYS_90_MS = 1000 * 60 * 60 * 24 * 90

type RepoOwner = { login?: string } | string

type RepoSummary = {
  name: string
  stargazers_count?: number
  language?: string | null
  html_url?: string
  owner?: RepoOwner
}

type UserResponse = {
  login: string
  name?: string | null
  avatar_url: string
  bio?: string | null
  followers?: number
}

export type Profile = {
  username: string
  name: string
  avatar_url: string
  bio: string
  followers: number
  score: number
  top_languages: Array<{ name: string; bytes: number }>
  commits_last_90d: number
  total_stars: number
  top_repos: Array<{ name: string; stars: number; language: string; url: string }>
  repo_count: number
}

type GitHubCommit = {
  sha: string
  commit: {
    message: string
    author?: { date?: string }
  }
}

const isRecentCommit = (commit: GitHubCommit, cutoff: number) => {
  const date = commit?.commit?.author?.date
  return typeof date === 'string' && Date.parse(date) >= cutoff
}

export function scoreProfile(data: {
  total_stars: number
  commits_last_90d: number
  repo_count: number
  unique_language_count: number
}) {
  return data.total_stars * 2 + data.commits_last_90d * 3 + data.repo_count * 1 + data.unique_language_count * 5
}

export async function buildProfile(username: string): Promise<Profile> {
  const [user, repos] = await Promise.all([getUser(username), listUserRepos(username)])

  const userData = user as UserResponse
  const repoList = repos as RepoSummary[]

  const repoCount = repoList.length
  const totalStars = repoList.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0)

  const topRepos = [...repoList]
    .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .slice(0, 5)

  const cutoff = Date.now() - DAYS_90_MS

  const topRepoDetails = await Promise.all(
    topRepos.map(async (repo) => {
      const owner = typeof repo.owner === 'string' ? repo.owner : repo.owner?.login ?? username
      const name = String(repo.name)
      const [languages, commits] = await Promise.all([
        getRepoLanguages(owner, name).catch(() => ({} as Record<string, number>)),
        listCommits(owner, name).catch(() => [] as GitHubCommit[]),
      ])

      const recentCommits = (commits as GitHubCommit[]).filter((commit) => isRecentCommit(commit, cutoff))
      return { repo, languages, recentCommits }
    }),
  )

  const languageBytes = topRepoDetails.reduce<Record<string, number>>((acc, details) => {
    for (const [lang, bytes] of Object.entries(details.languages)) {
      acc[lang] = (acc[lang] ?? 0) + bytes
    }
    return acc
  }, {})

  const topLanguages = Object.entries(languageBytes)
    .sort(([, aBytes], [, bBytes]) => bBytes - aBytes)
    .slice(0, 5)
    .map(([name, bytes]) => ({ name, bytes }))

  const commitsLast90d = topRepoDetails.reduce((sum, details) => sum + details.recentCommits.length, 0)

  const topReposOutput = topRepos.map((repo) => ({
    name: repo.name,
    stars: repo.stargazers_count ?? 0,
    language: repo.language ?? '',
    url: repo.html_url ?? '',
  }))

  const profile: Profile = {
    username: user.login,
    name: user.name ?? '',
    avatar_url: user.avatar_url,
    bio: user.bio ?? '',
    followers: user.followers ?? 0,
    score: scoreProfile({
      total_stars: totalStars,
      commits_last_90d: commitsLast90d,
      repo_count: repoCount,
      unique_language_count: Object.keys(languageBytes).length,
    }),
    top_languages: topLanguages,
    commits_last_90d: commitsLast90d,
    total_stars: totalStars,
    top_repos: topReposOutput,
    repo_count: repoCount,
  }

  return profile
}

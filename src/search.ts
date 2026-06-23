import { octokit } from './client.ts'
import { buildProfile, type Profile } from './profile.ts'

/** Search users/orgs. e.g. q = "location:berlin language:go" */
export async function searchUsers(q: string, limit = 100) {
  const { data } = await octokit.rest.search.users({ q, per_page: Math.min(limit, 100) })
  return data.items
}

const CACHE_TTL_MS = 1000 * 60 * 10
const profileCache = new Map<string, { profile: Profile; expiresAt: number }>()

async function getCachedProfile(username: string): Promise<Profile> {
  const cached = profileCache.get(username)
  const now = Date.now()

  if (cached && cached.expiresAt > now) {
    return cached.profile
  }

  const profile = await buildProfile(username)
  profileCache.set(username, { profile, expiresAt: now + CACHE_TTL_MS })
  return profile
}

type SearchDevelopersParams = {
  skill: string
  min_score?: number
  limit?: number
}

export async function searchDevelopers(params: SearchDevelopersParams) {
  const skill = params.skill
  const minScore = params.min_score ?? 0
  const limit = params.limit ?? 10

  const users = await searchUsers(skill, 30)

  const profileResults = await Promise.all(
    users.map(async (user) => {
      try {
        const profile = await getCachedProfile(user.login)
        return { profile, github_url: user.html_url }
      } catch {
        return null
      }
    }),
  )

  const developers = profileResults
    .filter((entry): entry is { profile: Profile; github_url: string } => entry !== null)
    .filter((entry) => entry.profile.score >= minScore)
    .sort((a, b) => b.profile.score - a.profile.score)
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      username: entry.profile.username,
      name: entry.profile.name,
      avatar_url: entry.profile.avatar_url,
      score: entry.profile.score,
      top_languages: entry.profile.top_languages,
      commits_last_90d: entry.profile.commits_last_90d,
      total_stars: entry.profile.total_stars,
      repo_count: entry.profile.repo_count,
      github_url: entry.github_url,
    }))

  return {
    total: developers.length,
    skill,
    developers,
  }
}

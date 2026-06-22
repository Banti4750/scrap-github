const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type DeveloperSearchResult = {
  total: number
  skill: string
  developers: Array<{
    rank: number
    username: string
    name: string
    avatar_url: string
    score: number
    top_languages: Array<{ name: string; bytes: number }>
    commits_last_90d: number
    total_stars: number
    repo_count: number
    github_url: string
  }>
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
  repo_count: number
  top_repos: Array<{ name: string; stars: number; language: string; url: string }>
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) {
    throw new Error(await res.text())
  }
  return res.json()
}

export async function searchDevelopers(skill: string, min_score: number, limit: number) {
  const params = new URLSearchParams({
    skill,
    min_score: String(min_score),
    limit: String(limit),
  })
  return fetchJson<DeveloperSearchResult>(`${API_URL}/search/developers?${params.toString()}`)
}

export async function fetchProfile(username: string) {
  return fetchJson<Profile>(`${API_URL}/users/${username}/profile`)
}

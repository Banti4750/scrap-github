import { Profile } from './api'

type CompareRow = {
  metric: string
  values: string[]
}

export function exportComparisonCsv(usernames: string[], profiles: Profile[]) {
  const headers = ['Metric', ...usernames]
  const rows: CompareRow[] = [
    { metric: 'Score', values: profiles.map((profile) => String(profile.score)) },
    { metric: 'Stars', values: profiles.map((profile) => String(profile.total_stars)) },
    { metric: 'Commits (90d)', values: profiles.map((profile) => String(profile.commits_last_90d)) },
    { metric: 'Repos', values: profiles.map((profile) => String(profile.repo_count)) },
    { metric: 'Top Language', values: profiles.map((profile) => profile.top_languages[0]?.name ?? '') },
    { metric: 'Languages', values: profiles.map((profile) => String(profile.top_languages.length)) },
  ]

  const lines = [headers.join(','), ...rows.map((row) => [row.metric, ...row.values].join(','))]
  return lines.join('\n')
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

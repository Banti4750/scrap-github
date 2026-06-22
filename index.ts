import express from 'express'
import { getRepo, getUser, listUserRepos, getRepoLanguages } from './src/repos.ts'
import { buildProfile } from './src/profile.ts'
import { searchRepos, searchCode, searchUsers, searchDevelopers } from './src/search.ts'
import { getFile, listDir, getReadme } from './src/code.ts'
import { listIssues, listPullRequests, listCommits } from './src/activity.ts'

const app = express()

// Small helper so each route stays a one-liner and errors return clean JSON.
const handle =
  (fn: (req: express.Request) => Promise<unknown>) =>
  async (req: express.Request, res: express.Response) => {
    try {
      res.json(await fn(req))
    } catch (err: any) {
      res.status(err.status ?? 500).json({ error: err.message })
    }
  }

// Coerce a route param or query value (typed `string | string[]`) to a string.
const s = (v: unknown): string => (Array.isArray(v) ? v[0] : String(v ?? ''))

// --- Metadata ---
app.get('/repos/:owner/:repo', handle((r) => getRepo(s(r.params.owner), s(r.params.repo))))
app.get('/repos/:owner/:repo/languages', handle((r) => getRepoLanguages(s(r.params.owner), s(r.params.repo))))
app.get('/users/:username', handle((r) => getUser(s(r.params.username))))
app.get('/users/:username/repos', handle((r) => listUserRepos(s(r.params.username))))
app.get('/users/:username/profile', handle((r) => buildProfile(s(r.params.username))))
app.get('/search/developers',
  handle((r) =>
    searchDevelopers({
      skill: s(r.query.skill),
      min_score: r.query.min_score ? Number(r.query.min_score) : 0,
      limit: r.query.limit ? Number(r.query.limit) : 10,
    }),
  ),
)

// --- Search (pass ?q=...) ---
app.get('/search/repos', handle((r) => searchRepos(s(r.query.q))))
app.get('/search/code', handle((r) => searchCode(s(r.query.q))))
app.get('/search/users', handle((r) => searchUsers(s(r.query.q))))

// --- Code / files (pass ?path=...) ---
app.get('/repos/:owner/:repo/readme', handle((r) => getReadme(s(r.params.owner), s(r.params.repo))))
app.get('/repos/:owner/:repo/file', handle((r) => getFile(s(r.params.owner), s(r.params.repo), s(r.query.path))))
app.get('/repos/:owner/:repo/dir', handle((r) => listDir(s(r.params.owner), s(r.params.repo), s(r.query.path))))

// --- Activity ---
app.get('/repos/:owner/:repo/issues', handle((r) => listIssues(s(r.params.owner), s(r.params.repo))))
app.get('/repos/:owner/:repo/pulls', handle((r) => listPullRequests(s(r.params.owner), s(r.params.repo))))
app.get('/repos/:owner/:repo/commits', handle((r) => listCommits(s(r.params.owner), s(r.params.repo))))

app.get('/', (_req, res) => {
  res.json({ message: 'GitHub scraper up. Try GET /repos/oven-sh/bun' })
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))

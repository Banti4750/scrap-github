import express from 'express'
import cors from 'cors'
import { buildProfile } from './src/profile.ts'
import { searchDevelopers } from './src/search.ts'

const app = express()
// Enable CORS for all routes
app.use(cors())

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

// --- Public APIs used by the web frontend ---
app.get('/users/:username/profile', handle((r) => buildProfile(s(r.params.username))))
app.get(
  '/search/developers',
  handle((r) =>
    searchDevelopers({
      skill: s(r.query.skill),
      min_score: r.query.min_score ? Number(r.query.min_score) : 0,
      limit: r.query.limit ? Number(r.query.limit) : 10,
    }),
  ),
)

app.get('/', (_req, res) => {
  res.json({ message: 'GitHub scraper up. Try GET /repos/oven-sh/bun' })
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))

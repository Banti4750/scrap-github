# scrap-github

A GitHub scraper built on the **official, free GitHub API** (via [Octokit](https://github.com/octokit/octokit.js)) — no paid proxy service needed.

## Setup

1. Create a free Personal Access Token (no scopes needed for public data):
   https://github.com/settings/tokens?type=beta
2. Copy `.env.example` to `.env` and paste your token:
   ```
   GITHUB_TOKEN=github_pat_xxx
   ```
   Without a token you're limited to **60 requests/hour**; with one, **5,000/hour**.
3. Run it:
   ```
   bun index.ts
   ```

## Endpoints

| Category | Route | Example |
|---|---|---|
| Repo metadata | `GET /repos/:owner/:repo` | `/repos/oven-sh/bun` |
| Languages | `GET /repos/:owner/:repo/languages` | |
| User profile | `GET /users/:username` | `/users/torvalds` |
| User's repos | `GET /users/:username/repos` | |
| Search repos | `GET /search/repos?q=` | `/search/repos?q=cli language:typescript stars:>100` |
| Search code | `GET /search/code?q=` | |
| Search users | `GET /search/users?q=` | |
| README | `GET /repos/:owner/:repo/readme` | |
| File contents | `GET /repos/:owner/:repo/file?path=` | `?path=src/index.ts` |
| Directory list | `GET /repos/:owner/:repo/dir?path=` | |
| Issues | `GET /repos/:owner/:repo/issues` | |
| Pull requests | `GET /repos/:owner/:repo/pulls` | |
| Commits | `GET /repos/:owner/:repo/commits` | |

## How it stays "manageable"

- **Throttling + retry** are built in (`src/client.ts`) — rate limits and transient errors are handled automatically.
- **Bounded pagination** (`paginateUpTo`, default 300 items) stops big repos from burning your whole rate limit. Bump the `max` argument when you really want everything.

## Why not DataImpulse / proxies?

Proxy services are for scraping raw HTML at scale. GitHub gives you structured JSON for free via its API, and HTML-scraping it violates GitHub's Terms of Service. Use the API.

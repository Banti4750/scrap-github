import { octokit } from './client.ts'

// --- Code & file contents (REST Contents API) ---

/**
 * Read a single file's contents (decoded from base64 to text).
 * `path` is relative to the repo root, e.g. "src/index.ts".
 */
export async function getFile(owner: string, repo: string, path: string, ref?: string) {
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref })
  if (Array.isArray(data) || data.type !== 'file' || !('content' in data)) {
    throw new Error(`"${path}" is not a file`)
  }
  return Buffer.from(data.content, 'base64').toString('utf-8')
}

/** List the entries (files + dirs) in a directory of a repo. */
export async function listDir(owner: string, repo: string, path = '', ref?: string) {
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref })
  if (!Array.isArray(data)) throw new Error(`"${path}" is not a directory`)
  return data.map((e) => ({ name: e.name, path: e.path, type: e.type, size: e.size }))
}

/** README contents (decoded to text), whatever the file is named. */
export async function getReadme(owner: string, repo: string) {
  const { data } = await octokit.rest.repos.getReadme({ owner, repo })
  return Buffer.from(data.content, 'base64').toString('utf-8')
}

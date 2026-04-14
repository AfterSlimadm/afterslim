import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')

export function projectPath(...segments: string[]): string {
  return path.join(ROOT, ...segments)
}

export function outputDir(date?: string): string {
  const d = date || new Date().toISOString().split('T')[0]
  return projectPath('output', d)
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

export async function nextIndex(dir: string, prefix: string): Promise<string> {
  await ensureDir(dir)
  const entries = await fs.readdir(dir).catch(() => [])
  const existing = entries.filter(e => e.startsWith(prefix))
  const num = String(existing.length + 1).padStart(3, '0')
  return `${prefix}-${num}`
}

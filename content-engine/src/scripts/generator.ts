import { generateJSON } from '../lib/gemini.js'
import { getTemplate, getRandomFormat, type ContentFormat, type AccountVoice } from './templates.js'
import { validateScript, sanitizeScript } from './compliance.js'
import fs from 'node:fs/promises'
import { projectPath } from '../lib/fs-utils.js'

interface ScriptResponse {
  sentences: string[]
  hook: string
  title: string
  hashtags: string[]
}

export interface GeneratedScript {
  sentences: string[]
  hook: string
  title: string
  hashtags: string[]
  format: ContentFormat
  voice: AccountVoice
  topic: string
}

export async function generateScript(
  topic: string,
  format?: ContentFormat,
  voice: AccountVoice = 'main'
): Promise<GeneratedScript> {
  const fmt = format || getRandomFormat()
  const { systemPrompt, userPrompt } = getTemplate(fmt, voice, topic)

  console.log(`  Generating ${fmt} script about: ${topic}`)
  const response = await generateJSON<ScriptResponse>(systemPrompt, userPrompt)

  // Sanitize each sentence
  const sanitized = response.sentences.map(s => sanitizeScript(s))

  // Validate
  const fullText = sanitized.join(' ')
  const compliance = validateScript(fullText)

  if (!compliance.valid) {
    console.log(`  ⚠ Compliance violations found, re-sanitizing...`)
    for (const v of compliance.violations) console.log(`    - ${v}`)
    // Try sanitizing again — if still fails, throw
    const reSanitized = sanitized.map(s => sanitizeScript(s))
    const reCheck = validateScript(reSanitized.join(' '))
    if (!reCheck.valid) {
      throw new Error(`Script failed compliance after sanitization: ${reCheck.violations.join(', ')}`)
    }
    return {
      sentences: reSanitized,
      hook: sanitizeScript(response.hook),
      title: response.title,
      hashtags: response.hashtags || [],
      format: fmt,
      voice,
      topic,
    }
  }

  if (compliance.warnings.length > 0) {
    for (const w of compliance.warnings) console.log(`  ⚠ Warning: ${w}`)
  }

  return {
    sentences: sanitized,
    hook: sanitizeScript(response.hook),
    title: response.title,
    hashtags: response.hashtags || [],
    format: fmt,
    voice,
    topic,
  }
}

export async function getRandomTopic(category?: string): Promise<string> {
  const topicsFile = projectPath('content', 'topics.json')
  const data = JSON.parse(await fs.readFile(topicsFile, 'utf-8'))
  const categories = data.categories as Record<string, { topics: string[] }>

  let pool: string[]
  if (category && categories[category]) {
    pool = categories[category].topics
  } else {
    pool = Object.values(categories).flatMap(c => c.topics)
  }

  return pool[Math.floor(Math.random() * pool.length)]
}

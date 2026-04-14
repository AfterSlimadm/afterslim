import fs from 'node:fs/promises'
import path from 'node:path'
import { ensureDir, projectPath } from '../lib/fs-utils.js'

const PEXELS_API = 'https://api.pexels.com'

interface PexelsVideoFile {
  id: number
  quality: string
  file_type: string
  width: number
  height: number
  link: string
}

interface PexelsVideo {
  id: number
  width: number
  height: number
  duration: number
  video_files: PexelsVideoFile[]
}

interface PexelsSearchResponse {
  videos: PexelsVideo[]
  total_results: number
}

// Search terms mapped to content topics — vertical/portrait preferred
const TOPIC_QUERIES: Record<string, string[]> = {
  'gut-health': ['healthy food preparation', 'woman eating salad', 'vegetables cooking', 'smoothie blending', 'kitchen cooking healthy'],
  'glp1-effects': ['woman holding stomach', 'medicine pills', 'pharmacy', 'doctor consultation', 'health wellness'],
  'probiotics': ['yogurt preparation', 'fermented food', 'healthy breakfast', 'wellness routine morning', 'supplement vitamins'],
  'nutrition': ['meal prep healthy', 'fruit vegetables close up', 'healthy cooking kitchen', 'grocery shopping fresh', 'eating healthy food'],
  'exercise': ['woman walking outdoor', 'light exercise stretching', 'yoga morning routine', 'fitness wellness', 'walking nature path'],
  'science': ['laboratory research', 'microscope science', 'dna molecule', 'medical research', 'biology cells'],
  'wellness': ['morning routine woman', 'meditation peaceful', 'self care routine', 'wellness lifestyle', 'relaxation spa'],
  'default': ['healthy lifestyle woman', 'wellness routine', 'nature peaceful', 'healthy food cooking', 'morning routine'],
}

function getApiKey(): string {
  const key = process.env.PEXELS_API_KEY
  if (!key) throw new Error('PEXELS_API_KEY not set in .env — get one free at pexels.com/api')
  return key
}

export async function searchVideos(
  query: string,
  count = 5,
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<PexelsVideo[]> {
  const url = `${PEXELS_API}/videos/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=${orientation}`
  const res = await fetch(url, {
    headers: { Authorization: getApiKey() },
  })
  if (!res.ok) throw new Error(`Pexels API error ${res.status}: ${await res.text()}`)
  const data = await res.json() as PexelsSearchResponse
  return data.videos
}

function pickBestFile(video: PexelsVideo, preferHeight = 1920): PexelsVideoFile | null {
  // Prefer HD vertical video
  const files = video.video_files
    .filter(f => f.file_type === 'video/mp4')
    .sort((a, b) => {
      // Prefer closer to target height
      const diffA = Math.abs(a.height - preferHeight)
      const diffB = Math.abs(b.height - preferHeight)
      return diffA - diffB
    })
  return files[0] || null
}

export async function downloadVideo(video: PexelsVideo, outputDir: string, index: number): Promise<string> {
  await ensureDir(outputDir)
  const file = pickBestFile(video)
  if (!file) throw new Error(`No suitable video file for video ${video.id}`)

  const outputPath = path.join(outputDir, `stock-${String(index).padStart(3, '0')}.mp4`)
  const res = await fetch(file.link)
  if (!res.ok) throw new Error(`Failed to download video: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(outputPath, buffer)

  return outputPath
}

export function getSearchQueries(topic: string): string[] {
  // Try to match topic to known categories
  const lower = topic.toLowerCase()
  for (const [key, queries] of Object.entries(TOPIC_QUERIES)) {
    if (lower.includes(key) || key.split('-').some(k => lower.includes(k))) {
      return queries
    }
  }
  return TOPIC_QUERIES['default']
}

/** Download multiple clips for a video, one per cue/segment */
export async function fetchStockClips(
  topic: string,
  clipCount: number,
  outputDir: string,
): Promise<string[]> {
  const queries = getSearchQueries(topic)
  const clipPaths: string[] = []
  const usedIds = new Set<number>()

  for (let i = 0; i < clipCount; i++) {
    const query = queries[i % queries.length]
    console.log(`    Searching: "${query}"...`)

    try {
      const videos = await searchVideos(query, 5)
      // Pick one we haven't used
      const video = videos.find(v => !usedIds.has(v.id)) || videos[0]
      if (!video) {
        console.log(`    No results, using fallback`)
        continue
      }
      usedIds.add(video.id)
      const clipPath = await downloadVideo(video, outputDir, i)
      clipPaths.push(clipPath)
    } catch (err) {
      console.log(`    Failed: ${err instanceof Error ? err.message : err}`)
    }
  }

  return clipPaths
}

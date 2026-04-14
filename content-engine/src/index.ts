import 'dotenv/config'
import { generateTTS } from './tts/edge-tts.js'
import { parseVTT } from './tts/vtt-parser.js'
import { saveCaptions } from './assembly/caption-styler.js'
import { generateBackground } from './visuals/backgrounds.js'
import { buildVideo, buildSlideshowVideo, generateThumbnail } from './assembly/video-builder.js'
import { generateTextFrames } from './visuals/text-frames.js'
import { buildSlideshow } from './visuals/slideshow.js'
import { fetchStockClips } from './visuals/stock-footage.js'
import { buildStockBackground } from './visuals/stock-video.js'
import { outputDir, ensureDir, nextIndex } from './lib/fs-utils.js'
import { probe } from './lib/ffmpeg.js'
import { generateScript, getRandomTopic } from './scripts/generator.js'
import { validateScript, DISCLAIMER } from './scripts/compliance.js'
import type { ContentFormat, AccountVoice } from './scripts/templates.js'
import fs from 'node:fs/promises'
import path from 'node:path'

const FALLBACK_SCRIPT = [
  'Did you know that nearly 70 percent of people on GLP-1 medications experience digestive side effects?',
  'The most common ones are nausea, bloating, and constipation.',
  'This happens because GLP-1 slows down your digestive system significantly.',
  'Your gut microbiome actually changes when you start these medications.',
  'Prebiotics and probiotics can help support your gut during this transition.',
  'Resistant starch is especially powerful because it feeds beneficial bacteria.',
  'A healthy gut means better nutrient absorption and less discomfort.',
  'Taking care of your digestive health is just as important as the medication itself.',
]

type VisualMode = 'stock' | 'slides' | 'captions'

interface VideoOptions {
  topic?: string
  format?: ContentFormat
  voice?: AccountVoice
  scriptLines?: string[]
  useAI?: boolean
  visualMode?: VisualMode
}

async function makeVideo(opts: VideoOptions = {}) {
  const today = outputDir()
  const pieceId = await nextIndex(today, 'video')
  const workDir = path.join(today, pieceId)
  await ensureDir(workDir)

  let lines: string[]
  let title = 'GLP-1 Gut Health Facts'
  let hashtags: string[] = ['#glp1', '#guthealth', '#prebiotics']
  let format: ContentFormat = opts.format || 'informational'
  let topic = opts.topic || 'GLP-1 gut health'

  if (opts.useAI) {
    console.log(`\n[SCRIPT] Generating with AI...`)
    topic = opts.topic || await getRandomTopic()
    const script = await generateScript(topic, opts.format, opts.voice)
    lines = script.sentences
    title = script.title
    hashtags = script.hashtags
    format = script.format
    console.log(`  Topic: ${topic}`)
    console.log(`  Format: ${format} | Sentences: ${lines.length}`)
  } else if (opts.scriptLines) {
    lines = opts.scriptLines
  } else {
    lines = FALLBACK_SCRIPT
  }

  // Compliance check
  const fullText = lines.join(' ')
  const compliance = validateScript(fullText)
  if (!compliance.valid) {
    console.error('COMPLIANCE FAILED:')
    compliance.violations.forEach(v => console.error(`  - ${v}`))
    process.exit(1)
  }

  const mode = opts.visualMode || 'stock'

  console.log(`[TTS] Generating narration...`)
  const tts = await generateTTS(fullText, workDir)

  console.log(`[CAPTIONS] Parsing subtitles...`)
  const cues = await parseVTT(tts.vttPath)
  console.log(`  ${cues.length} cues`)

  const audioDuration = (await probe(tts.audioPath)).duration
  console.log(`  Duration: ${audioDuration.toFixed(1)}s`)

  const assPath = await saveCaptions(cues, workDir)
  let finalPath: string

  if (mode === 'stock') {
    // Stock footage mode: download clips, darken, overlay captions
    console.log(`[STOCK] Fetching stock footage...`)
    const clipsDir = path.join(workDir, 'clips')
    const clipCount = Math.min(cues.length, 4) // 4 clips max to keep it clean
    const clips = await fetchStockClips(topic, clipCount, clipsDir)

    if (clips.length === 0) {
      console.log(`  No clips found, falling back to solid background`)
      const bgPath = await generateBackground(workDir, audioDuration + 1)
      finalPath = await buildVideo({ backgroundPath: bgPath, audioPath: tts.audioPath, assPath, outputDir: workDir })
    } else {
      console.log(`  ${clips.length} clips downloaded`)
      console.log(`[VIDEO] Building stock background...`)
      const stockBg = await buildStockBackground(clips, audioDuration, workDir)
      console.log(`[ASSEMBLY] Merging stock video + audio + captions...`)
      finalPath = await buildVideo({ backgroundPath: stockBg, audioPath: tts.audioPath, assPath, outputDir: workDir })
    }

  } else if (mode === 'slides') {
    console.log(`[SLIDES] Generating text frames...`)
    const slidesDir = path.join(workDir, 'slides')
    const slides = await generateTextFrames(cues, slidesDir)
    console.log(`  ${slides.length} slides`)

    console.log(`[SLIDESHOW] Building...`)
    const slideshowPath = await buildSlideshow(slides, workDir)

    console.log(`[ASSEMBLY] Merging slideshow + audio...`)
    finalPath = await buildSlideshowVideo(slideshowPath, tts.audioPath, workDir)

  } else {
    // Captions mode: solid bg + ASS overlay
    console.log(`[BACKGROUND] Generating...`)
    const bgPath = await generateBackground(workDir, audioDuration + 1)

    console.log(`[ASSEMBLY] Building video...`)
    finalPath = await buildVideo({ backgroundPath: bgPath, audioPath: tts.audioPath, assPath, outputDir: workDir })
  }

  console.log(`[THUMBNAIL] Extracting...`)
  await generateThumbnail(finalPath, workDir)

  const meta = {
    id: pieceId,
    createdAt: new Date().toISOString(),
    title,
    script: lines,
    hashtags,
    format,
    visualMode: mode,
    voice: opts.voice || 'main',
    topic,
    duration: audioDuration,
    ttsVoice: 'en-US-AvaNeural',
    disclaimer: DISCLAIMER,
    outputPath: finalPath,
  }
  await fs.writeFile(path.join(workDir, 'metadata.json'), JSON.stringify(meta, null, 2))
  await fs.writeFile(path.join(workDir, 'script.txt'), lines.join('\n'))

  console.log(`\n✓ ${finalPath}`)
  console.log(`  ${audioDuration.toFixed(1)}s | 1080x1920 | ${format} | ${mode}`)
  console.log(`  Title: ${title}`)
  return finalPath
}

async function makeBatch(count: number, voice: AccountVoice = 'main', visualMode: VisualMode = 'stock') {
  console.log(`\nGenerating batch of ${count} videos (${visualMode} mode)...\n`)
  const results: string[] = []
  for (let i = 0; i < count; i++) {
    console.log(`\n--- Video ${i + 1}/${count} ---`)
    try {
      const p = await makeVideo({ useAI: true, voice, visualMode })
      results.push(p)
    } catch (err) {
      console.error(`Failed: ${err instanceof Error ? err.message : err}`)
    }
  }
  console.log(`\n✓ Batch complete: ${results.length}/${count} videos generated`)
}

// ---- CLI ----
const args = process.argv.slice(2)
const command = args[0]

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag)
  return idx !== -1 ? args[idx + 1] : undefined
}

function getVisualMode(): VisualMode {
  if (args.includes('--slides')) return 'slides'
  if (args.includes('--captions')) return 'captions'
  return 'stock' // default: stock footage
}

switch (command) {
  case 'video': {
    const topic = getArg('--topic')
    const format = getArg('--format') as ContentFormat | undefined
    const voice = (getArg('--voice') || 'main') as AccountVoice
    const visualMode = getVisualMode()
    const useAI = args.includes('--ai') || !!topic
    makeVideo({ topic, format, voice, useAI, visualMode }).catch(err => {
      console.error('Error:', err.message)
      process.exit(1)
    })
    break
  }

  case 'batch': {
    const count = parseInt(getArg('--count') || '3')
    const voice = (getArg('--voice') || 'main') as AccountVoice
    const visualMode = getVisualMode()
    makeBatch(count, voice, visualMode).catch(err => {
      console.error('Error:', err.message)
      process.exit(1)
    })
    break
  }

  case 'test': {
    const visualMode = getVisualMode()
    makeVideo({ visualMode }).catch(err => {
      console.error('Error:', err.message)
      process.exit(1)
    })
    break
  }

  default:
    console.log(`
AfterSlim Content Engine

Commands:
  test                              Test video (hardcoded script)
  video --ai                        AI script + stock footage (default)
  video --topic "gut health tips"   Specific topic
  video --format myth-buster --ai   Specific format
  video --voice satellite-edu --ai  Satellite voice
  batch --count 5                   Batch of AI videos
  batch --count 3 --voice satellite-gut

Visual modes (default: stock):
  --stock      Stock footage background + captions overlay (best quality)
  --slides     Colored text slides (no API needed)
  --captions   Solid dark background + captions (simplest)

Formats: informational, listicle, myth-buster, did-you-know, tips
Voices: main, satellite-edu, satellite-gut

Environment:
  GEMINI_API_KEY     Required for --ai mode
  PEXELS_API_KEY     Required for --stock mode (free at pexels.com/api)
`)
}

import * as ffmpeg from '../lib/ffmpeg.js'
import path from 'node:path'
import { ensureDir, projectPath } from '../lib/fs-utils.js'
import type { VttCue } from '../tts/vtt-parser.js'

const FONT_PATH = projectPath('assets', 'fonts', 'Montserrat-ExtraBold.ttf')
  .replace(/\\/g, '/')
  .replace(/:/g, '\\:')

// Vibrant alternating color schemes
const SLIDE_THEMES = [
  { bg: '0f0f23', text: 'FFFFFF', accent: '4ECDC4' },  // dark navy + white
  { bg: '1B6B4A', text: 'FFFFFF', accent: 'F5A623' },  // emerald + white
  { bg: '1a0a2e', text: 'F5A623', accent: 'FFFFFF' },  // deep purple + amber
  { bg: '0c1f3f', text: 'FFFFFF', accent: '4ECDC4' },  // midnight blue + white
  { bg: '2d1b0e', text: 'F5A623', accent: 'FFFFFF' },  // dark brown + amber
]

export interface SlideInfo {
  imagePath: string
  durationMs: number
  text: string
}

function escapeDrawtext(text: string): string {
  return text
    .replace(/\\/g, '\\\\\\\\')
    .replace(/'/g, "\u2019")  // smart quote instead of escaping
    .replace(/:/g, '\\:')
    .replace(/%/g, '%%')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
}

function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if (current && (current + ' ' + word).length > maxChars) {
      lines.push(current)
      current = word
    } else {
      current = current ? current + ' ' + word : word
    }
  }
  if (current) lines.push(current)
  return lines
}

export async function generateTextFrames(
  cues: VttCue[],
  outputDir: string,
  width = 1080,
  height = 1920
): Promise<SlideInfo[]> {
  await ensureDir(outputDir)
  const slides: SlideInfo[] = []

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i]
    const theme = SLIDE_THEMES[i % SLIDE_THEMES.length]
    const imagePath = path.join(outputDir, `slide-${String(i).padStart(3, '0')}.png`)
    const durationMs = cue.endMs - cue.startMs

    const lines = wrapLines(cue.text, 18)
    const fontSize = 72
    const lineHeight = Math.round(fontSize * 1.5)
    const totalHeight = lines.length * lineHeight
    const startY = Math.round((height - totalHeight) / 2)

    // Build drawtext filters — each line centered, bold, with thick outline
    const drawFilters = lines.map((line, li) => {
      const y = startY + li * lineHeight
      const escaped = escapeDrawtext(line)
      return `drawtext=text='${escaped}':fontfile='${FONT_PATH}':fontsize=${fontSize}:fontcolor=#${theme.text}:borderw=5:bordercolor=#000000:shadowcolor=#00000080:shadowx=3:shadowy=3:x=(w-text_w)/2:y=${y}`
    })

    // Add a subtle accent line at top
    const accentBar = `drawbox=x=0:y=0:w=${width}:h=8:color=#${theme.accent}:t=fill`

    // Add slide number indicator dots at bottom
    const dotFilters = cues.map((_, di) => {
      const dotX = Math.round(width / 2 - (cues.length * 24) / 2 + di * 24)
      const dotColor = di === i ? theme.accent : '666666'
      return `drawbox=x=${dotX}:y=${height - 80}:w=12:h=12:color=#${dotColor}:t=fill`
    })

    const allFilters = [accentBar, ...drawFilters, ...dotFilters].join(',')

    await ffmpeg.run([
      '-f', 'lavfi',
      '-i', `color=c=#${theme.bg}:s=${width}x${height}:d=1`,
      '-vf', allFilters,
      '-frames:v', '1',
      '-y',
      imagePath,
    ])

    slides.push({ imagePath, durationMs, text: cue.text })
  }

  return slides
}

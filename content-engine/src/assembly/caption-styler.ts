import fs from 'node:fs/promises'
import path from 'node:path'
import { projectPath } from '../lib/fs-utils.js'
import type { VttCue } from '../tts/vtt-parser.js'

// Use Montserrat ExtraBold for TikTok-style captions
const FONT_NAME = 'Montserrat ExtraBold'

interface CaptionStyle {
  fontName: string
  fontSize: number
  primaryColor: string   // ASS color format: &HAABBGGRR (note: BGR not RGB)
  outlineColor: string
  backColor: string
  outlineWidth: number
  shadow: number
  alignment: number      // 2 = bottom-center, 5 = center-center
  marginV: number
  playResX: number
  playResY: number
}

const DEFAULT_STYLE: CaptionStyle = {
  fontName: FONT_NAME,
  fontSize: 68,
  primaryColor: '&H00FFFFFF',   // white
  outlineColor: '&H00000000',   // black outline
  backColor: '&H80000000',      // semi-transparent black shadow
  outlineWidth: 5,
  shadow: 2,
  alignment: 2,                 // bottom center
  marginV: 200,
  playResX: 1080,
  playResY: 1920,
}

function msToASS(ms: number): string {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const cs = Math.floor((ms % 1000) / 10)
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export function generateASS(cues: VttCue[], style?: Partial<CaptionStyle>): string {
  const s = { ...DEFAULT_STYLE, ...style }

  // Register the font file path for ASS rendering
  const fontPath = projectPath('assets', 'fonts', 'Montserrat-ExtraBold.ttf')

  const header = `[Script Info]
Title: AfterSlim Content
ScriptType: v4.00+
PlayResX: ${s.playResX}
PlayResY: ${s.playResY}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${s.fontName},${s.fontSize},${s.primaryColor},&H000000FF,${s.outlineColor},${s.backColor},1,0,0,0,100,100,2,0,1,${s.outlineWidth},${s.shadow},${s.alignment},60,60,${s.marginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`

  const events = cues.map(cue => {
    const start = msToASS(cue.startMs)
    const end = msToASS(cue.endMs)
    const text = wrapText(cue.text, 25)
    return `Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`
  })

  return header + '\n' + events.join('\n') + '\n'
}

function wrapText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
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
  return lines.join('\\N')
}

export async function saveCaptions(cues: VttCue[], outputDir: string, style?: Partial<CaptionStyle>): Promise<string> {
  const assContent = generateASS(cues, style)
  const assPath = path.join(outputDir, 'captions.ass')
  await fs.writeFile(assPath, assContent, 'utf-8')
  return assPath
}

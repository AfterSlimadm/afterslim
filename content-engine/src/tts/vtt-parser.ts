import fs from 'node:fs/promises'

export interface VttCue {
  index: number
  startMs: number
  endMs: number
  text: string
}

function timeToMs(time: string): number {
  // Format: HH:MM:SS.mmm or MM:SS.mmm
  const parts = time.trim().split(':')
  let hours = 0, minutes = 0, seconds = 0

  if (parts.length === 3) {
    hours = parseInt(parts[0])
    minutes = parseInt(parts[1])
    seconds = parseFloat(parts[2])
  } else if (parts.length === 2) {
    minutes = parseInt(parts[0])
    seconds = parseFloat(parts[1])
  }

  return Math.round((hours * 3600 + minutes * 60 + seconds) * 1000)
}

export async function parseVTT(vttPath: string): Promise<VttCue[]> {
  const content = await fs.readFile(vttPath, 'utf-8')
  const cues: VttCue[] = []
  const lines = content.split(/\r?\n/)

  let index = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.includes(' --> ')) continue

    const [startStr, endStr] = line.split(' --> ')
    const startMs = timeToMs(startStr)
    const endMs = timeToMs(endStr)

    // Collect text lines until empty line or next cue number
    const textLines: string[] = []
    for (let j = i + 1; j < lines.length; j++) {
      const tl = lines[j].trim()
      if (!tl || /^\d+$/.test(tl)) break
      if (tl.includes(' --> ')) break
      textLines.push(tl)
    }

    const text = textLines.join(' ').trim()
    if (text) {
      cues.push({ index: index++, startMs, endMs, text })
    }
  }

  return cues
}

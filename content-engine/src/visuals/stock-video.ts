import * as ffmpeg from '../lib/ffmpeg.js'
import { probe } from '../lib/ffmpeg.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { ensureDir } from '../lib/fs-utils.js'
import type { VttCue } from '../tts/vtt-parser.js'

/**
 * Build a background video from stock clips, trimmed and concatenated
 * to match the total audio duration. Clips are scaled to 1080x1920.
 */
export async function buildStockBackground(
  clipPaths: string[],
  totalDuration: number,
  outputDir: string,
  width = 1080,
  height = 1920,
): Promise<string> {
  await ensureDir(outputDir)

  if (clipPaths.length === 0) {
    throw new Error('No stock clips provided')
  }

  // Get duration of each clip
  const clipDurations: number[] = []
  for (const cp of clipPaths) {
    const info = await probe(cp)
    clipDurations.push(info.duration)
  }

  // Calculate how long each segment should be (evenly split)
  const segmentDuration = totalDuration / clipPaths.length

  // Process each clip: trim, scale, pad to 9:16
  const processedPaths: string[] = []
  for (let i = 0; i < clipPaths.length; i++) {
    const processed = path.join(outputDir, `processed-${String(i).padStart(3, '0')}.mp4`)
    const dur = Math.min(segmentDuration, clipDurations[i])

    await ffmpeg.run([
      '-i', clipPaths[i],
      '-t', String(dur),
      '-vf', [
        `scale=${width}:${height}:force_original_aspect_ratio=increase`,
        `crop=${width}:${height}`,
        // Slight dark overlay so text is readable on top
        'colorlevels=rimax=0.7:gimax=0.7:bimax=0.7',
      ].join(','),
      '-an',  // remove audio from stock clips
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-pix_fmt', 'yuv420p',
      '-r', '30',
      '-y',
      processed,
    ])
    processedPaths.push(processed)
  }

  // If only one clip, use it directly
  if (processedPaths.length === 1) {
    const output = path.join(outputDir, 'stock-background.mp4')
    await fs.rename(processedPaths[0], output)
    return output
  }

  // Concatenate all processed clips
  const concatFile = path.join(outputDir, 'concat-stock.txt')
  const concatContent = processedPaths
    .map(p => `file '${p.replace(/\\/g, '/')}'`)
    .join('\n')
  await fs.writeFile(concatFile, concatContent, 'utf-8')

  const output = path.join(outputDir, 'stock-background.mp4')
  await ffmpeg.run([
    '-f', 'concat',
    '-safe', '0',
    '-i', concatFile,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-pix_fmt', 'yuv420p',
    '-y',
    output,
  ])

  // Cleanup processed files
  for (const p of processedPaths) {
    await fs.unlink(p).catch(() => {})
  }
  await fs.unlink(concatFile).catch(() => {})

  return output
}

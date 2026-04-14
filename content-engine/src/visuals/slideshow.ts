import * as ffmpeg from '../lib/ffmpeg.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { SlideInfo } from './text-frames.js'

export async function buildSlideshow(
  slides: SlideInfo[],
  outputDir: string,
  width = 1080,
  height = 1920,
): Promise<string> {
  // Create FFmpeg concat demuxer file
  const concatPath = path.join(outputDir, 'slides.txt')
  const lines = slides.map(s => {
    const dur = (s.durationMs / 1000).toFixed(3)
    // FFmpeg concat demuxer uses forward slashes
    const filePath = s.imagePath.replace(/\\/g, '/')
    return `file '${filePath}'\nduration ${dur}`
  })
  // Add last image again (FFmpeg concat quirk — needs last entry for duration)
  if (slides.length > 0) {
    const last = slides[slides.length - 1].imagePath.replace(/\\/g, '/')
    lines.push(`file '${last}'`)
  }

  await fs.writeFile(concatPath, lines.join('\n'), 'utf-8')

  const outputPath = path.join(outputDir, 'slideshow.mp4')

  await ffmpeg.run([
    '-f', 'concat',
    '-safe', '0',
    '-i', concatPath,
    '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    '-y',
    outputPath,
  ])

  return outputPath
}

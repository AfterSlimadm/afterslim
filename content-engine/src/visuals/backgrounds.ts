import * as ffmpeg from '../lib/ffmpeg.js'
import path from 'node:path'
import { ensureDir } from '../lib/fs-utils.js'

export async function generateBackground(
  outputDir: string,
  duration: number,
  color = '0f0f23',
  width = 1080,
  height = 1920,
): Promise<string> {
  await ensureDir(outputDir)
  const outputPath = path.join(outputDir, 'background.mp4')

  await ffmpeg.run([
    '-f', 'lavfi',
    '-i', `color=c=#${color}:s=${width}x${height}:d=${Math.ceil(duration)}:r=30`,
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-pix_fmt', 'yuv420p',
    '-y',
    outputPath,
  ])

  return outputPath
}

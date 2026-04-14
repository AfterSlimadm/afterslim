import * as ffmpeg from '../lib/ffmpeg.js'
import path from 'node:path'
import { ensureDir } from '../lib/fs-utils.js'

export interface BuildVideoOptions {
  backgroundPath: string
  audioPath: string
  assPath?: string
  outputDir: string
  filename?: string
}

export async function buildVideo(opts: BuildVideoOptions): Promise<string> {
  await ensureDir(opts.outputDir)
  const outputPath = path.join(opts.outputDir, opts.filename || 'final.mp4')

  const args = [
    '-i', opts.backgroundPath,
    '-i', opts.audioPath,
  ]

  // Add ASS captions overlay if provided
  if (opts.assPath) {
    const assPathNorm = opts.assPath
      .replace(/\\/g, '/')
      .replace(/:/g, '\\:')
    args.push('-vf', `ass='${assPathNorm}'`)
  }

  args.push(
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    '-shortest',
    '-y',
    outputPath,
  )

  await ffmpeg.run(args)
  return outputPath
}

/** Build video from slideshow (text frames) + audio, no separate captions needed */
export async function buildSlideshowVideo(
  slideshowPath: string,
  audioPath: string,
  outputDir: string,
  filename = 'final.mp4'
): Promise<string> {
  await ensureDir(outputDir)
  const outputPath = path.join(outputDir, filename)

  await ffmpeg.run([
    '-i', slideshowPath,
    '-i', audioPath,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    '-shortest',
    '-y',
    outputPath,
  ])

  return outputPath
}

export async function generateThumbnail(videoPath: string, outputDir: string): Promise<string> {
  await ensureDir(outputDir)
  const thumbPath = path.join(outputDir, 'thumbnail.jpg')

  await ffmpeg.run([
    '-i', videoPath,
    '-vf', 'thumbnail,scale=1080:1920',
    '-frames:v', '1',
    '-y',
    thumbPath,
  ])

  return thumbPath
}

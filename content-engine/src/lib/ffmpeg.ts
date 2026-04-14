import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'

const exec = promisify(execFile)

const FFMPEG = 'ffmpeg'
const FFPROBE = 'ffprobe'

export function tmpPath(ext: string): string {
  return path.join(os.tmpdir(), `asce-${crypto.randomUUID()}.${ext}`)
}

export async function run(args: string[]): Promise<string> {
  const { stdout, stderr } = await exec(FFMPEG, args, { maxBuffer: 50 * 1024 * 1024 })
  return stderr || stdout
}

export async function probe(filePath: string): Promise<{ duration: number; width: number; height: number }> {
  const { stdout } = await exec(FFPROBE, [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_format',
    '-show_streams',
    filePath,
  ])
  const data = JSON.parse(stdout)
  const duration = parseFloat(data.format?.duration || '0')
  const videoStream = data.streams?.find((s: { codec_type: string }) => s.codec_type === 'video')
  return {
    duration,
    width: videoStream?.width || 0,
    height: videoStream?.height || 0,
  }
}

export async function cleanup(...paths: string[]): Promise<void> {
  for (const p of paths) {
    await fs.unlink(p).catch(() => {})
  }
}

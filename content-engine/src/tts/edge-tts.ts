import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { ensureDir } from '../lib/fs-utils.js'

const exec = promisify(execFile)

export interface TTSResult {
  audioPath: string
  vttPath: string
}

export async function generateTTS(
  text: string,
  outputDir: string,
  voice = 'en-US-AvaNeural',
  rate = '-5%'
): Promise<TTSResult> {
  await ensureDir(outputDir)
  const audioPath = path.join(outputDir, 'narration.mp3')
  const vttPath = path.join(outputDir, 'narration.vtt')

  // Write text to temp file to avoid shell escaping issues
  const tmpText = path.join(os.tmpdir(), `asce-tts-${Date.now()}.txt`)
  await fs.writeFile(tmpText, text, 'utf-8')

  try {
    await exec('edge-tts', [
      '--voice', voice,
      '--rate=' + rate,
      '-f', tmpText,
      '--write-media', audioPath,
      '--write-subtitles', vttPath,
    ], { maxBuffer: 10 * 1024 * 1024 })
  } finally {
    await fs.unlink(tmpText).catch(() => {})
  }

  return { audioPath, vttPath }
}

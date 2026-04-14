import { GoogleGenAI } from '@google/genai'
import 'dotenv/config'

let client: GoogleGenAI | null = null

function getClient(): GoogleGenAI {
  if (!client) {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY not set in .env')
    client = new GoogleGenAI({ apiKey: key })
  }
  return client
}

export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  model = 'gemini-2.5-flash'
): Promise<T> {
  const response = await getClient().models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      temperature: 0.8,
    },
  })

  const text = response.text ?? '{}'
  return JSON.parse(text) as T
}

export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  model = 'gemini-2.5-flash'
): Promise<string> {
  const response = await getClient().models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
    },
  })

  return response.text ?? ''
}

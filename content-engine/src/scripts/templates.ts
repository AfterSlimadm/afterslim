export type ContentFormat = 'informational' | 'listicle' | 'myth-buster' | 'did-you-know' | 'tips'

export type AccountVoice = 'main' | 'satellite-edu' | 'satellite-gut'

interface PromptTemplate {
  systemPrompt: string
  userPromptTemplate: string
}

const VOICE_INSTRUCTIONS: Record<AccountVoice, string> = {
  main: `Voice: Warm, authoritative, science-backed but accessible. Think "your smart friend who reads research papers for fun."
Use words like: support, nourish, complement, designed to help, research suggests.
Never: pushy, salesy, clinical jargon without explanation.`,

  'satellite-edu': `Voice: Casual, relatable, "things nobody tells you" energy. Think "that friend who always shares interesting facts."
Use words like: honestly, here's the thing, most people don't realize, the truth is.
Never: overly formal, academic, brand mentions.`,

  'satellite-gut': `Voice: Nurturing, supportive, empathetic. Think "a caring nutritionist friend."
Use words like: your body, listen to your gut, gentle, nourish, take care.
Never: scary, alarmist, judgment about food choices.`,
}

const BASE_RULES = `CRITICAL RULES:
- NEVER use brand names (Ozempic, Wegovy, Mounjaro, Zepbound, Saxenda)
- NEVER use drug names (semaglutide, tirzepatide, liraglutide)
- ALWAYS say "GLP-1 medications" or "GLP-1 therapies" generically
- NEVER make health claims: no "cures", "treats", "prevents disease", "clinically proven"
- Use wellness framing: "may support", "designed to complement", "research suggests"
- Target audience: Americans using GLP-1 medications
- Language: US English, conversational, easy to understand
- Each sentence: MAX 15 words. Short, punchy, easy to read on screen.
- Total script: 6-10 sentences for ~45-75 seconds of audio`

const FORMAT_TEMPLATES: Record<ContentFormat, PromptTemplate> = {
  informational: {
    systemPrompt: `You generate scripts for short-form educational videos about GLP-1 medications and gut health.
${BASE_RULES}

OUTPUT: JSON object with:
- "sentences": array of short sentences (the script, read in order)
- "hook": the first sentence (must grab attention in 3 seconds)
- "title": short video title for metadata (max 60 chars)
- "hashtags": array of 5-7 relevant hashtags`,
    userPromptTemplate: `Create an informational video script about: {topic}

{voice}

The video should educate viewers about this topic in a compelling, easy-to-follow way.`,
  },

  listicle: {
    systemPrompt: `You generate scripts for "X things you need to know" style short-form videos about GLP-1 and gut health.
${BASE_RULES}

Structure: Hook sentence → numbered points (3-5) → closing thought.

OUTPUT: JSON object with:
- "sentences": array of short sentences
- "hook": first sentence
- "title": short title (max 60 chars)
- "hashtags": array of 5-7 hashtags`,
    userPromptTemplate: `Create a listicle video script about: {topic}

{voice}

Format: "X things about [topic]" — make each point surprising or counter-intuitive.`,
  },

  'myth-buster': {
    systemPrompt: `You generate scripts for myth-busting short-form videos about GLP-1 medications and gut health.
${BASE_RULES}

Structure: State the myth → explain why it's wrong → give the truth → practical takeaway.

OUTPUT: JSON object with:
- "sentences": array of short sentences
- "hook": first sentence (state the myth provocatively)
- "title": short title (max 60 chars)
- "hashtags": array of 5-7 hashtags`,
    userPromptTemplate: `Create a myth-buster video script about: {topic}

{voice}

Start with a common misconception, then reveal the truth with evidence.`,
  },

  'did-you-know': {
    systemPrompt: `You generate scripts for "Did you know?" style short-form videos about GLP-1 and gut health.
${BASE_RULES}

Structure: Surprising fact → explanation → why it matters → what you can do.

OUTPUT: JSON object with:
- "sentences": array of short sentences
- "hook": first sentence (the surprising fact)
- "title": short title (max 60 chars)
- "hashtags": array of 5-7 hashtags`,
    userPromptTemplate: `Create a "did you know" video script about: {topic}

{voice}

Lead with the most surprising fact. Make it impossible to scroll past.`,
  },

  tips: {
    systemPrompt: `You generate scripts for practical tips videos about managing GLP-1 side effects and gut health.
${BASE_RULES}

Structure: Relatable problem → actionable tips (3-4) → encouraging close.

OUTPUT: JSON object with:
- "sentences": array of short sentences
- "hook": first sentence (name the problem)
- "title": short title (max 60 chars)
- "hashtags": array of 5-7 hashtags`,
    userPromptTemplate: `Create a tips video script about: {topic}

{voice}

Focus on practical, actionable advice people can use today.`,
  },
}

export function getTemplate(format: ContentFormat, voice: AccountVoice, topic: string): { systemPrompt: string; userPrompt: string } {
  const template = FORMAT_TEMPLATES[format]
  const voiceInstructions = VOICE_INSTRUCTIONS[voice]

  return {
    systemPrompt: template.systemPrompt,
    userPrompt: template.userPromptTemplate
      .replace('{topic}', topic)
      .replace('{voice}', voiceInstructions),
  }
}

export function getRandomFormat(): ContentFormat {
  const formats: ContentFormat[] = ['informational', 'listicle', 'myth-buster', 'did-you-know', 'tips']
  return formats[Math.floor(Math.random() * formats.length)]
}

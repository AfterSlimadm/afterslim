const BANNED_BRAND_NAMES = [
  'ozempic', 'wegovy', 'mounjaro', 'zepbound', 'saxenda',
  'rybelsus', 'trulicity', 'victoza', 'byetta',
]

const BANNED_DRUG_NAMES = [
  'semaglutide', 'tirzepatide', 'liraglutide', 'dulaglutide', 'exenatide',
]

const BANNED_CLAIMS = [
  'cure', 'cures', 'treat', 'treats', 'treatment for',
  'prevent disease', 'prevents disease',
  'clinically proven', 'doctor recommended', 'physician approved',
  'weight loss guaranteed', 'lose \\d+ pounds',
  'fda approved', 'medically proven',
  'miracle', 'breakthrough cure',
]

const WELLNESS_ALTERNATIVES: Record<string, string> = {
  'cures': 'may support',
  'treats': 'is designed to complement',
  'prevents': 'may help with',
  'clinically proven': 'research suggests',
  'guaranteed': 'designed to support',
}

export interface ComplianceResult {
  valid: boolean
  violations: string[]
  warnings: string[]
}

export function validateScript(text: string): ComplianceResult {
  const lower = text.toLowerCase()
  const violations: string[] = []
  const warnings: string[] = []

  for (const brand of BANNED_BRAND_NAMES) {
    if (lower.includes(brand)) {
      violations.push(`Banned brand name: "${brand}" — use "GLP-1 medications" instead`)
    }
  }

  for (const drug of BANNED_DRUG_NAMES) {
    if (lower.includes(drug)) {
      violations.push(`Banned drug name: "${drug}" — use "GLP-1 medications" instead`)
    }
  }

  for (const claim of BANNED_CLAIMS) {
    const regex = new RegExp(claim, 'i')
    if (regex.test(lower)) {
      violations.push(`Banned health claim: "${claim}"`)
    }
  }

  // Warnings (not blockers but should review)
  if (lower.includes('weight loss') && !lower.includes('may')) {
    warnings.push('Mention of "weight loss" without qualifier — consider adding "may support"')
  }

  if (!lower.includes('glp-1') && !lower.includes('gut') && !lower.includes('digestive')) {
    warnings.push('Script does not mention GLP-1 or gut health — may be off-topic')
  }

  return {
    valid: violations.length === 0,
    violations,
    warnings,
  }
}

export function sanitizeScript(text: string): string {
  let result = text

  // Replace brand names with generic
  for (const brand of BANNED_BRAND_NAMES) {
    const regex = new RegExp(brand, 'gi')
    result = result.replace(regex, 'GLP-1 medications')
  }

  // Replace drug names with generic
  for (const drug of BANNED_DRUG_NAMES) {
    const regex = new RegExp(drug, 'gi')
    result = result.replace(regex, 'GLP-1 medications')
  }

  // Replace claim patterns
  for (const [bad, good] of Object.entries(WELLNESS_ALTERNATIVES)) {
    const regex = new RegExp(bad, 'gi')
    result = result.replace(regex, good)
  }

  return result
}

export const DISCLAIMER = 'This content is for informational purposes only and is not medical advice. Consult your healthcare provider before making any changes to your supplement routine.'

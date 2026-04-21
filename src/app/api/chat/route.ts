import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are Catty (แคตตี้), a friendly bilingual AI assistant for "เช่ารถกับแคตตี้" — a premium car rental & lifestyle service in Phuket, Thailand.

LANGUAGE RULE: Detect user language and reply in THE SAME language. Thai → Thai only. English → English only.

Services offered:
- 🚗 Car Rental: Sedan ฿800-1,500/day, SUV ฿1,200-2,000/day, Sport ฿3,000+/day
- 🏠 Accommodation: Budget ฿500/night, Superior ฿1,200/night, Pool Villa ฿3,500/night  
- 💄 Beauty: Lip tattoo ฿2,500, Eyebrow tattoo ฿3,000, Lash extension ฿800, Keratin ฿1,500
- 📚 Tutoring: Chemistry/Math/Physics/Science ฿380-450/hr, ONET/GAT/PAT Package ฿8,000
- Payment: Bank transfer, PromptPay, Credit card, Cash, LINE Pay
- Contact: LINE @cattycar | Tel: 081-234-5678 | Phuket, Thailand

Personality: Cheerful, helpful, uses 🐱 occasionally. 2-3 sentence answers unless more detail needed.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const res = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: SYSTEM,
      messages: messages.slice(-10),
    })
    const text = res.content.find(b => b.type === 'text')?.text || ''
    return NextResponse.json({ message: text })
  } catch (e) {
    return NextResponse.json({ error: 'Chat unavailable' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy',
      baseURL: 'https://api.deepseek.com/v1',
    });
  }
  return _client;
}

export async function POST(req: NextRequest) {
  try {
    const { answers, financialSituation } = await req.json();

    const prompt = `You are an AI investment risk tolerance advisor. Analyze the following questionnaire responses and financial situation:

Financial Situation:
${financialSituation}

Risk Assessment Answers:
${JSON.stringify(answers, null, 2)}

Provide:
1. Overall risk tolerance score (Conservative / Moderately Conservative / Moderate / Moderately Aggressive / Aggressive) with reasoning
2. Detected behavioral biases (e.g., recency bias, overconfidence, loss aversion)
3. Recommended asset allocation (stocks/bonds/cash/alternatives) with percentage breakdown
4. Specific investment vehicle suggestions (index funds, bonds, REITs, etc.)
5. Rebalancing alert thresholds and strategy
6. Key risks to be aware of based on the profile

Format with clear sections, percentages, and practical advice.`;

    const completion = await getClient().chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error: unknown) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json({ error: 'Failed to generate risk assessment' }, { status: 500 });
  }
}

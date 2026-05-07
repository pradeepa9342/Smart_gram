import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const { message, language } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const reply = await aiService.getChatResponse(message, language || 'en');
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Chat Service Error' }, { status: 500 });
  }
}

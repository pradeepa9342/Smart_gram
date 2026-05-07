import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const category = await aiService.categorizeComplaint(description);
    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Categorization API Error:', error);
    return NextResponse.json({ error: error.message || 'Service Error' }, { status: 500 });
  }
}

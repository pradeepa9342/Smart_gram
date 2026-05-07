import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const { temperature, humidity, season } = await req.json();
    
    if (!temperature || !humidity || !season) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const aiRawResponse = await aiService.getCropSuggestion(temperature, humidity, season);
    
    // Parse the standardized format from aiService
    // RECOMMENDED: [Crop Name] | ALTERNATIVE: [Crop Name] | REASON: [Short Text] | TIP: [Short Text]
    const parts = aiRawResponse.split('|');
    const getVal = (prefix: string) => parts.find((p: string) => p.includes(prefix))?.split(':')[1]?.trim() || 'N/A';

    return NextResponse.json({
      recommendedCrop: getVal('RECOMMENDED'),
      alternativeCrop: getVal('ALTERNATIVE'),
      reason: getVal('REASON'),
      farmingTip: getVal('TIP')
    });
  } catch (error: any) {
    console.error('Crop Suggestion Error:', error);
    return NextResponse.json({ error: error.message || 'AI Service Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { weatherService } from '@/services/weatherService';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const village = searchParams.get('village') || 'Erode';
    
    const weatherData = await weatherService.getVillageWeather(village);
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

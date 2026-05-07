import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/services/notificationService';

export async function POST(req: NextRequest) {
  try {
    const { type, message, target } = await req.json();
    
    if (!type || !message) {
      return NextResponse.json({ error: 'Type and message are required' }, { status: 400 });
    }

    const result = await notificationService.triggerAlert(type, message, target);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Notification API Error:', error);
    return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 });
  }
}

// app/api/get-token/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Updated to use the correct env variable name
    const apiKey = process.env.AITUTOR_API_KEY;
    const chatbotId = process.env.CHATBOT_ID || 'cb_va9j8g2v7t8b0z7ev0lwy7a';
    
    console.log(`Getting token for chatbot ID: ${chatbotId}`);
    
    const response = await fetch('https://aitutor-api.vercel.app/api/v1/chat/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
      },
      body: JSON.stringify({
        chatbotId: chatbotId,
      }),
    });

    console.log(`Token API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token API error:', errorText);
      return NextResponse.json(
        { error: `Failed to get token: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Token API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
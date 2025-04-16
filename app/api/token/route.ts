// app/api/token/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Call the AI Tutor API to get a chat token
    const response = await fetch('https://aitutor-api.vercel.app/api/v1/chat/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any required authentication headers
        'x-api-key': process.env.AI_TUTOR_API_KEY || '',
      },
      body: JSON.stringify({
        // Any required parameters
        chatbotId: process.env.CHATBOT_ID || 'cb_va9j8g2v7t8b0z7ev0lwy7a', // Your chatbot ID
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get token from AI Tutor API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Token API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
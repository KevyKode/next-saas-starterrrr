import { NextRequest, NextResponse } from 'next/server';
import { getUser, getTeamForUser, createReportRequest } from '@/lib/db/queries';
import { checkMessageLimit } from '@/lib/db/utils';

export const maxDuration = 300; // Set to maximum duration (in seconds) for your Vercel plan

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const team = await getTeamForUser(user.id);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const { withinLimit } = await checkMessageLimit(team.id);
    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Monthly message limit reached. Upgrade your plan for unlimited messages.' },
        { status: 403 }
      );
    }

    // Create the report request and get the ID
    const reportId = await createReportRequest(user.id, team.id, formData);

    // Start the webhook-based approach
    // Return the reportId immediately
    return NextResponse.json({ 
      reportId,
      status: 'pending',
      message: 'Report generation started' 
    });
  } catch (error: any) {
    console.error('Business Report API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}

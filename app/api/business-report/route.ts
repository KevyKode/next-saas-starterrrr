import { NextRequest, NextResponse } from 'next/server';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { checkMessageLimit, incrementMessageCount, saveWorkflowHistory } from '@/lib/db/utils';

export async function POST(req: NextRequest) {
  try {
    // Get the business form data from the request
    const formData = await req.json();

    // Get the authenticated user
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get the team details for the user
    const team = await getTeamForUser(user.id);
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check the team's monthly message limit
    const { withinLimit, remainingMessages } = await checkMessageLimit(team.id);
    if (!withinLimit) {
      return NextResponse.json(
        {
          error:
            'Monthly message limit reached. Upgrade your plan for unlimited messages.',
        },
        { status: 403 }
      );
    }

    // Call the business report workflow API endpoint with the form data
    // Note: No need to check for story parameter as we're sending the whole form
    const response = await fetch(
      'https://aitutor-api.vercel.app/api/v1/run/wf_z17kkxc4nnupcimdpk6zi4zm',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer sk_wzsb34sr3o3xdtw13ga1e2ciea52fnyy',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    // Get the response as text first
    const responseText = await response.text();
    
    // Try to parse as JSON, but if it fails, wrap in a result object
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { result: responseText, success: true };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Error generating business report' },
        { status: response.status }
      );
    }

    // Increment the team's message count
    await incrementMessageCount(team.id, 1);

    // Save workflow history
    await saveWorkflowHistory(
      team.id, 
      user.id, 
      JSON.stringify(formData), 
      typeof data === 'object' ? JSON.stringify(data) : data
    );

    // Format the response to match what StoryDisplay expects
    // If data already has a result property, use it, otherwise wrap it
    const formattedData = data.result ? data : { result: responseText, success: true };

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error: any) {
    console.error('Business Report API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
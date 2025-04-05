// app/api/run/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { checkMessageLimit, incrementMessageCount, saveWorkflowHistory } from '@/lib/db/utils';

// Tell Railway this function needs more time and resources
export const config = {
  maxDuration: 120, // 2 minutes
  memory: 1024, // 1GB of memory
};

export async function POST(req: NextRequest) {
  try {
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

    // Set a longer timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100000); // 100 seconds timeout

    try {
      console.log('Starting API request at:', new Date().toISOString());
      
      // Call the business report workflow API endpoint with timeout
      const response = await fetch(
        'https://aitutor-api.vercel.app/api/v1/run/wf_z17kkxc4nnupcimdpk6zi4zm',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer sk_wzsb34sr3o3xdtw13ga1e2ciea52fnyy',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
          // Add longer timeout hints
          keepalive: true,
        }
      );

      console.log('API request completed at:', new Date().toISOString());
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      // Try to get the response as text first
      const responseText = await response.text();
      console.log('Response text length:', responseText.length);

      // Try to parse as JSON, but if it fails, wrap in a result object
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // If not valid JSON, wrap the raw text in a result object
        data = { result: responseText, success: true };
      }

      if (!response.ok) {
        return NextResponse.json(
          { error: data.error || 'Error generating report' },
          { status: response.status }
        );
      }

      console.log('Processing successful response at:', new Date().toISOString());
      
      // Increment the team's message count after successful API call
      await incrementMessageCount(team.id, 1);

      // Save workflow history - stringify the form data for input
      await saveWorkflowHistory(
        team.id, 
        user.id, 
        JSON.stringify(formData), 
        typeof data === 'object' ? JSON.stringify(data) : data
      );

      console.log('Returning response at:', new Date().toISOString());
      
      // Return the response data
      return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      
      // Handle AbortError (timeout) separately
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('API request timed out');
        throw new Error('API request timed out after 100 seconds');
      }
      
      throw error; // Re-throw other errors
    }
  } catch (error: unknown) {
    console.error('Report API Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + errorMessage },
      { status: 500 }
    );
  }
}
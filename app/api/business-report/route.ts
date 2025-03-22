import { NextRequest, NextResponse } from 'next/server';
import { getUser, getTeamForUser, createReportRequest, updateReportStatus } from '@/lib/db/queries';
import { checkMessageLimit } from '@/lib/db/utils';

// This function will be enqueued for background processing
async function processReport(reportId: string, formData: any, userId: number, teamId: number) {
  try {
    // Update report status to processing
    await updateReportStatus(reportId, 'processing', null);
    
    // Make the API request
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

    // Process response
    if (!response.ok) {
      const errorData = await response.text();
      await updateReportStatus(reportId, 'failed', errorData);
      return;
    }

    // Get response content
    const responseText = await response.text();
    
    // Save the result
    await updateReportStatus(reportId, 'completed', responseText);
    
    // Increment message count
    const { incrementMessageCount, saveWorkflowHistory } = await import('@/lib/db/utils');
    await incrementMessageCount(teamId, 1);
    await saveWorkflowHistory(
      teamId, 
      userId, 
      JSON.stringify(formData), 
      responseText
    );
  } catch (error) {
    console.error('Error processing report:', error);
    await updateReportStatus(reportId, 'failed', 'Internal processing error');
  }
}

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
    const { withinLimit } = await checkMessageLimit(team.id);
    if (!withinLimit) {
      return NextResponse.json(
        {
          error:
            'Monthly message limit reached. Upgrade your plan for unlimited messages.',
        },
        { status: 403 }
      );
    }

    // Create a new report request in the database
    const reportId = await createReportRequest(user.id, team.id, formData);

    // Start processing in the background
    // This function will continue running even after the response is sent
    processReport(reportId, formData, user.id, team.id);
    
    // Return immediately with the report ID
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
import { NextRequest, NextResponse } from 'next/server';
import { getUser, getTeamForUser, updateReportStatus } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { reportRequests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Set to a valid value for the Vercel hobby plan (maximum is 60 seconds)
export const maxDuration = 60; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportId, formData } = body;
    
    // If no reportId is provided, just process the form data directly
    if (!reportId) {
      // Get user and team
      const user = await getUser();
      if (!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }
      
      const team = await getTeamForUser(user.id);
      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }
      
      // Make the API request directly
      try {
        console.log('Making API request for report generation...');
        
        const response = await fetch(
          'https://aitutor-api.vercel.app/api/v1/run/wf_z17kkxc4nnupcimdpk6zi4zm',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer sk_wzsb34sr3o3xdtw13ga1e2ciea52fnyy',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error('API request failed:', errorData);
          return NextResponse.json({ error: 'API request failed' }, { status: 500 });
        }

        // Get response content
        const responseText = await response.text();
        console.log('API response received, length:', responseText.length);
        
        // Increment message count and save history
        const { incrementMessageCount, saveWorkflowHistory } = await import('@/lib/db/utils');
        await incrementMessageCount(team.id, 1);
        
        await saveWorkflowHistory(
          team.id, 
          user.id, 
          JSON.stringify(formData), 
          responseText
        );
        
        // Try to parse as JSON, but if it fails, return as result
        try {
          const jsonResult = JSON.parse(responseText);
          return NextResponse.json(jsonResult);
        } catch {
          return NextResponse.json({ result: responseText, status: 'completed' });
        }
      } catch (error) {
        console.error('Processing error:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
    }
    
    // Original code for handling reportId remains unchanged below
    // Get the report details from the database to get the userId and teamId
    const report = await db.select().from(reportRequests).where(eq(reportRequests.id, reportId)).limit(1);
    
    if (!report || report.length === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    
    const { userId, teamId } = report[0];
    
    if (!userId || !teamId) {
      return NextResponse.json({ error: 'Invalid report data: missing user or team ID' }, { status: 400 });
    }

    // Update status to processing
    await updateReportStatus(reportId, 'processing', null);
    
    // Rest of your existing code for the reportId workflow...
    // ...

  } catch (error) {
    console.error('Process report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
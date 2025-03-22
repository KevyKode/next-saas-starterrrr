import { NextRequest, NextResponse } from 'next/server';
import { getReportStatus, updateReportStatus } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { reportRequests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const maxDuration = 300; // Set to maximum duration allowed by your Vercel plan

export async function POST(req: NextRequest) {
  try {
    const { reportId, formData } = await req.json();
    
    if (!reportId) {
      return NextResponse.json({ error: 'Missing reportId' }, { status: 400 });
    }

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
    
    try {
      console.log('Making API request for report generation...');
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

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API request failed:', errorData);
        await updateReportStatus(reportId, 'failed', errorData);
        return NextResponse.json({ error: 'API request failed' }, { status: 500 });
      }

      // Get response content
      const responseText = await response.text();
      console.log('API response received, length:', responseText.length);
      
      // Update report status
      await updateReportStatus(reportId, 'completed', responseText);
      
      // Increment message count and save history
      const { incrementMessageCount, saveWorkflowHistory } = await import('@/lib/db/utils');
      await incrementMessageCount(teamId, 1);
      
      // Make sure we're passing the correct user and team IDs
      await saveWorkflowHistory(
        teamId, 
        userId, 
        JSON.stringify(formData), 
        responseText
      );
      
      return NextResponse.json({ status: 'completed' });
    } catch (error) {
      console.error('Processing error:', error);
      await updateReportStatus(reportId, 'failed', 'Internal processing error');
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Process report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
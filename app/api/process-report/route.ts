import { NextRequest, NextResponse } from 'next/server';
import { getReportStatus, updateReportStatus } from '@/lib/db/queries';

export const maxDuration = 300; // Set to maximum duration allowed by your Vercel plan

export async function POST(req: NextRequest) {
  try {
    const { reportId, formData, userId, teamId } = await req.json();
    
    if (!reportId) {
      return NextResponse.json({ error: 'Missing reportId' }, { status: 400 });
    }

    // Update status to processing
    await updateReportStatus(reportId, 'processing', null);
    
    try {
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
        await updateReportStatus(reportId, 'failed', errorData);
        return NextResponse.json({ error: 'API request failed' }, { status: 500 });
      }

      // Get response content
      const responseText = await response.text();
      
      // Update report status
      await updateReportStatus(reportId, 'completed', responseText);
      
      // Increment message count and save history
      const { incrementMessageCount, saveWorkflowHistory } = await import('@/lib/db/utils');
      await incrementMessageCount(teamId, 1);
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
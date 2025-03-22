import { NextRequest, NextResponse } from 'next/server';
import { getReportStatus } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In Next.js canary, params may be a Promise that needs to be awaited
    // However, the exact syntax depends on the specific version
    const reportId = typeof params.id === 'function' 
      ? await params.id() 
      : params.id;
    
    if (!reportId) {
      return NextResponse.json(
        { error: 'Missing report ID' },
        { status: 400 }
      );
    }
    
    // Fetch report status from your database
    const report = await getReportStatus(reportId);
    
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching report status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report status' },
      { status: 500 }
    );
  }
}

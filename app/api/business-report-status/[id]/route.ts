import { NextRequest, NextResponse } from 'next/server';
import { getReportStatus } from '@/lib/db/queries';

// Use a very simple signature with 'any' to bypass type checking issues
export async function GET(request: NextRequest, context: any) {
  try {
    // Access the ID parameter from the context
    const reportId = context.params?.id;
    
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


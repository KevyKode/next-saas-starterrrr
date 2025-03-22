"use client";
import { marked } from 'marked';
import { useState, useEffect } from 'react';

interface StoryDisplayProps {
  result: {
    result?: string;
    success?: boolean;
  };
}

export default function StoryDisplay({ result }: StoryDisplayProps) {
    const [formattedResult, setFormattedResult] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const [reportTitle, setReportTitle] = useState('ITT Business-Readiness Report');
    const [reportDate, setReportDate] = useState('');
    const [readinessScore, setReadinessScore] = useState('');
    const [sections, setSections] = useState<{title: string; score?: string; content: string}[]>([]);

    useEffect(() => {
        console.log('StoryDisplay received result:', result);
        
        try {
            // Check if we have the expected data structure
            if (result && result.result) {
                console.log('Found result.result, processing...');
                
                // Clean up the content
                let content = result.result.trim();
                
                // Remove <think> tag if present
                content = content.replace(/<think>[\s\S]*?<\/think>|<think>[\s\S]*/g, '');
                
                // If content is still empty after removing think tag, use the original content
                if (!content.trim()) {
                    content = result.result.trim();
                    content = content.replace(/<think>\s*/, '');
                }
                
                // Replace the title if needed
                if (content.match(/^\*\*\s*March \d+, \d+/) || content.match(/^Start-Up Readiness Report/)) {
                    content = content.replace(/^[\s\S]*?(Start-Up Readiness Report|March \d+, \d+)/, 'ITT Business-Readiness Report\n\nDate: $1');
                }
                
                console.log('Cleaned content start:', content.substring(0, 200));
                
                // Parse as markdown for display
                const htmlContent = marked.parse(content);
                setFormattedResult(htmlContent);
                
                // Extract data for structured display
                parseReportContent(content);
                
                setDebugInfo('');
            } else {
                console.error('Invalid result format:', result);
                setFormattedResult('<p>Error: Received data is not in the expected format.</p>');
                setDebugInfo(JSON.stringify(result, null, 2));
            }
        } catch (error) {
            console.error('Error in StoryDisplay:', error);
            setFormattedResult('<p>Error formatting the report. Please check the console for details.</p>');
            setDebugInfo(error instanceof Error ? error.message : String(error));
        }
    }, [result]);
    
    // Improved parsing function to extract all sections
    const parseReportContent = (content: string) => {
        try {
            // Set default title
            setReportTitle('ITT Business-Readiness Report');
            
            // Extract date
            const dateMatch = content.match(/Date:\s*([^\n]+)/);
            if (dateMatch) {
                setReportDate(dateMatch[1]);
            } else {
                const anyDateMatch = content.match(/March \d+, \d+/);
                if (anyDateMatch) {
                    setReportDate(anyDateMatch[0]);
                }
            }
            
            // Extract readiness score
            const scoreMatch = content.match(/Readiness Score:?\s*([^\n]+)/);
            if (scoreMatch) {
                setReadinessScore(scoreMatch[1].replace(/\*\*/g, ''));
            }
            
            // Split the content into sections using a simpler approach
            // This uses the actual structure of the document we're seeing
            
            // First, remove the header part to focus on sections
            const headerEndIndex = content.indexOf('Problem-Solution Fit') > -1 
                ? content.indexOf('Problem-Solution Fit') 
                : content.indexOf('Market Opportunity');
                
            if (headerEndIndex === -1) {
                // Fallback to original content if we can't find section markers
                const extractedSections = [{
                    title: 'Report Content',
                    content: content
                }];
                setSections(extractedSections);
                return;
            }
            
            const headerContent = content.substring(0, headerEndIndex);
            const sectionsContent = content.substring(headerEndIndex);
            
            // Now divide into sections - look for section titles which are usually followed by "(Score: X/Y)"
            // or are standalone lines with capital first letter
            const extractedSections: {title: string; score?: string; content: string}[] = [];
            
            // These are the section titles we expect to find
            const expectedSections = [
                'Problem-Solution Fit',
                'Market Opportunity',
                'Business Model Viability',
                'Product Readiness & Traction',
                'Competitive Landscape',
                'Financial & Fundability Metrics',
                'Conclusion & Next Steps'
            ];
            
            // Find all section starts
            const sectionStarts: {index: number; title: string; score?: string}[] = [];
            
            for (const sectionTitle of expectedSections) {
                const regex = new RegExp(`${sectionTitle}\\s*(?:\\(Score:\\s*([^\\)]+)\\))?`, 'i');
                const match = regex.exec(sectionsContent);
                if (match) {
                    sectionStarts.push({
                        index: match.index,
                        title: sectionTitle,
                        score: match[1]
                    });
                }
            }
            
            // Sort by index to maintain order
            sectionStarts.sort((a, b) => a.index - b.index);
            
            // Extract section content
            for (let i = 0; i < sectionStarts.length; i++) {
                const start = sectionStarts[i];
                const end = i < sectionStarts.length - 1 ? sectionStarts[i + 1].index : sectionsContent.length;
                
                const sectionContent = sectionsContent.substring(start.index, end).trim();
                
                // Remove the section title from content
                const contentStart = sectionContent.indexOf('\n');
                const cleanContent = contentStart > -1 ? sectionContent.substring(contentStart + 1).trim() : sectionContent;
                
                extractedSections.push({
                    title: start.title,
                    score: start.score,
                    content: cleanContent
                });
            }
            
            // If we didn't find any sections, try a different approach
            if (extractedSections.length === 0) {
                console.log('No sections found with expected titles, falling back to manual parsing');
                
                // Split by lines and look for potential section headers
                const lines = sectionsContent.split('\n');
                let currentSection = '';
                let currentScore = '';
                let currentContent = '';
                let inSection = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    
                    // Check if this looks like a section header
                    if (line && /^[A-Z][a-zA-Z\s&]+/.test(line) && line.length < 100) {
                        // This might be a section header
                        
                        // Save previous section if we have one
                        if (currentSection && inSection) {
                            extractedSections.push({
                                title: currentSection,
                                score: currentScore,
                                content: currentContent.trim()
                            });
                        }
                        
                        // Start new section
                        const scoreMatch = line.match(/\(Score:\s*([^)]+)\)/);
                        currentScore = scoreMatch ? scoreMatch[1].trim() : '';
                        currentSection = line.replace(/\(Score:\s*[^)]+\)/, '').trim();
                        currentContent = '';
                        inSection = true;
                    } else if (inSection) {
                        // Add to current section content
                        currentContent += line + '\n';
                    }
                }
                
                // Add the last section
                if (currentSection && inSection) {
                    extractedSections.push({
                        title: currentSection,
                        score: currentScore,
                        content: currentContent.trim()
                    });
                }
            }
            
            console.log('Found sections:', extractedSections.length);
            setSections(extractedSections);
        } catch (error) {
            console.error('Error parsing report:', error);
            // Fallback to displaying the whole content as is
        }
    };

    // If we have structured data, render a beautiful report
    if (sections.length > 0) {
        return (
            <div className="glass-morphism p-8 rounded-xl shadow-xl backdrop-blur-lg bg-white/30">
                <div className="report-container">
                    {/* Report Header */}
                    <div className="mb-8 border-b border-gray-200 pb-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                            {reportTitle}
                        </h1>
                        <div className="flex flex-col md:flex-row md:justify-between mt-4">
                            <p className="text-gray-600">{reportDate}</p>
                            {readinessScore && (
                                <div className="mt-2 md:mt-0">
                                    <span className="font-semibold">Readiness Score: </span>
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                                        {readinessScore}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Report Sections */}
                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <div key={index} className="section border border-gray-100 rounded-lg p-6 bg-white/50 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {section.title}
                                    </h2>
                                    {section.score && (
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            Score: {section.score}
                                        </span>
                                    )}
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    {/* Convert the markdown content to HTML and insert it */}
                                    <div dangerouslySetInnerHTML={{ __html: marked.parse(section.content) }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Download Button */}
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={() => {
                                // Create cleaned version for download
                                let cleanContent = result?.result || '';
                                cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>|<think>[\s\S]*/g, '');
                                if (!cleanContent.trim()) {
                                    cleanContent = result?.result?.replace(/<think>\s*/, '') || '';
                                }
                                cleanContent = cleanContent.replace(/^[\s\S]*?(Start-Up Readiness Report|March \d+, \d+)/, 'ITT Business-Readiness Report\n\nDate: $1');
                                
                                const blob = new Blob([cleanContent], { type: 'text/markdown' });
                                const url = URL.createObjectURL(blob);
                                
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'business-analysis-report.md';
                                document.body.appendChild(a);
                                a.click();
                                
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                            className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Report
                        </button>
                    </div>
                </div>
                
                {debugInfo && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm overflow-auto">
                        <h3 className="font-bold mb-2 text-red-600">Debug Information:</h3>
                        <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                    </div>
                )}
            </div>
        );
    }
    
    // Fallback to the original rendering if structured data extraction fails
    return (
        <div className="glass-morphism p-8 rounded-xl shadow-xl backdrop-blur-lg bg-white/30">
            <div 
                className="story-content prose prose-lg max-w-none"
                style={{
                    color: '#4B5563',
                    lineHeight: '1.8',
                }}
                dangerouslySetInnerHTML={{ __html: formattedResult }}
            />
            
            {debugInfo && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm overflow-auto">
                    <h3 className="font-bold mb-2 text-red-600">Debug Information:</h3>
                    <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                </div>
            )}
            
            {formattedResult && (
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={() => {
                            // Create cleaned version for download
                            let cleanContent = result?.result || '';
                            cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>|<think>[\s\S]*/g, '');
                            if (!cleanContent.trim()) {
                                cleanContent = result?.result?.replace(/<think>\s*/, '') || '';
                            }
                            
                            const blob = new Blob([cleanContent], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'business-analysis-report.md';
                            document.body.appendChild(a);
                            a.click();
                            
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }}
                        className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Report
                    </button>
                </div>
            )}
        </div>
    );
}

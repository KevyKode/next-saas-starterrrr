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
    const [reportTitle, setReportTitle] = useState('');
    const [reportDate, setReportDate] = useState('');
    const [readinessScore, setReadinessScore] = useState('');
    const [sections, setSections] = useState<{title: string; score?: string; content: string}[]>([]);

    useEffect(() => {
        console.log('StoryDisplay received result:', result);
        
        try {
            // Check if we have the expected data structure
            if (result && result.result) {
                console.log('Found result.result, parsing as markdown...');
                
                // Check if the result is actually markdown or if it's HTML
                const content = result.result.trim();
                
                if (content.startsWith('<') && content.includes('</')) {
                    // Seems to be HTML, no need to parse with marked
                    console.log('Content appears to be HTML, using directly');
                    setFormattedResult(content);
                    processReport(content);
                } else {
                    // Parse as markdown
                    const parser = new marked.Parser();
                    const lexer = new marked.Lexer();
                    
                    const tokens = lexer.lex(content);
                    const htmlContent = parser.parse(tokens);
                    console.log('Markdown parsed successfully');
                    setFormattedResult(htmlContent);
                    processReport(content);
                }
                
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
    
    // Function to process and extract structured data from the report
    const processReport = (content: string) => {
        try {
            // Extract title (first line)
            const lines = content.split('\n');
            if (lines.length > 0) {
                setReportTitle(lines[0].replace(/^#+\s*/, ''));
            }
            
            // Extract date
            const dateMatch = content.match(/Date:\s*([^\n]+)/);
            if (dateMatch) {
                setReportDate(dateMatch[1]);
            }
            
            // Extract readiness score
            const scoreMatch = content.match(/Readiness Score:\s*([^\n]+)/);
            if (scoreMatch) {
                setReadinessScore(scoreMatch[1]);
            }
            
            // Extract sections
            const sectionRegex = /##\s*([^(]+)(?:\(Score:\s*([^)]+)\))?\s*\n([\s\S]*?)(?=##|$)/g;
            const extractedSections: {title: string; score?: string; content: string}[] = [];
            
            let match;
            while ((match = sectionRegex.exec(content)) !== null) {
                extractedSections.push({
                    title: match[1].trim(),
                    score: match[2]?.trim(),
                    content: match[3].trim()
                });
            }
            
            setSections(extractedSections);
        } catch (error) {
            console.error('Error processing report structure:', error);
            // If structured processing fails, we still have the formatted result
        }
    };

    // If we have structured data, render a beautiful report
    if (reportTitle) {
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
                                const markdownContent = result?.result || '';
                                const blob = new Blob([markdownContent], { type: 'text/markdown' });
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
                            // Create a blob with the markdown content
                            const markdownContent = result?.result || '';
                            const blob = new Blob([markdownContent], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            
                            // Create a temporary anchor element to download the file
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'business-analysis-report.md';
                            document.body.appendChild(a);
                            a.click();
                            
                            // Clean up
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
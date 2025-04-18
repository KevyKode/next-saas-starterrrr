"use client";
import React from 'react';
import { marked } from 'marked';
import { useState, useEffect, useRef } from 'react';

interface StoryDisplayProps {
  result: any;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ result }) => {
    const [formattedResult, setFormattedResult] = useState<string>('');
    const [cleanedContent, setCleanedContent] = useState<string>('');
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [isPrinting, setIsPrinting] = useState<boolean>(false);
    const [reportScore, setReportScore] = useState<string>('');
    const reportRef = useRef<HTMLDivElement>(null);
    const printFrameRef = useRef<HTMLIFrameElement | null>(null);

    // NEW HELPER FUNCTION: Clean text by removing all ** markers
    const cleanAsterisks = (text: string): string => {
        return text.replace(/\*\*/g, '');
    };

    useEffect(() => {
        console.log('StoryDisplay received result:', result);
        
        const processContent = async () => {
            try {
                // Get the raw content first
                let rawContent = '';
                
                if (typeof result === 'string') {
                    rawContent = result.trim();
                } else if (result && typeof result.result === 'string') {
                    rawContent = result.result.trim();
                } else if (result && typeof result === 'object') {
                    rawContent = JSON.stringify(result, null, 2);
                    
                    if (rawContent.includes("ITT Assessment") || 
                        rawContent.includes("Problem-Solution Fit") || 
                        rawContent.includes("Market Opportunity")) {
                        rawContent = rawContent;
                    }
                } else {
                    throw new Error('Unrecognized result format');
                }
                
                // Extract sections with a custom parser to avoid markdown rendering issues
                const sections = extractSections(rawContent);
                
                // Extract score from the content
                const scoreMatch = rawContent.match(/Assessment Score:?\s*([^\n]+)/);
                if (scoreMatch && scoreMatch[1]) {
                    let cleanedScore = scoreMatch[1].trim()
                        .replace(/\*\*/g, '')
                        .replace(/→/g, '-')
                        .replace(/\s+/g, ' ');
                    
                    setReportScore(cleanedScore);
                }
                
                // Save original content for download
                setCleanedContent(rawContent);
                
                // Generate custom HTML bypassing markdown issues
                const customHTML = generateCustomHTML(sections);
                setFormattedResult(customHTML);
                
            } catch (error) {
                console.error('Error in StoryDisplay:', error);
                setFormattedResult('<p>Error: Could not process the report data.</p>');
                if (result) {
                    const debugText = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
                    setDebugInfo(debugText);
                } else {
                    setDebugInfo(error instanceof Error ? error.message : String(error));
                }
            }
        };
        
        processContent();
    }, [result]);

    // Custom parser to extract sections and correctly handle recommendations
    const extractSections = (content: string) => {
        const sections: any = {};
        
        // Extract main report sections
        const mainSectionRegex = /### \*\*(.*?) \(Score: (\d+)\/(\d+)\)\*\*\s*([\s\S]*?)(?=### \*\*|---|\*\*Conclusion|$)/g;
        let match;
        
        while ((match = mainSectionRegex.exec(content)) !== null) {
            const sectionName = match[1].trim();
            const score = match[2];
            const maxScore = match[3];
            let sectionContent = match[4].trim();
            
            // MODIFIED: Clean the section content of ** markers
            sectionContent = cleanAsterisks(sectionContent);
            
            // Extract subsections
            const subsections: any = {};
            
            // Get all lines that aren't recommendations
            const contentLines = sectionContent.split('\n').filter(line => 
                !line.trim().startsWith('Recommendations:') && 
                !line.trim().startsWith('-')
            );
            
            // Extract recommendation lines
            const recommendationLines = sectionContent.split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => {
                    // MODIFIED: Clean each recommendation of ** markers
                    return cleanAsterisks(line.replace(/^-\s*/, '').trim());
                });
            
            // Store in the section
            sections[sectionName] = {
                score,
                maxScore,
                content: contentLines.join('\n').trim(),
                recommendations: recommendationLines
            };
        }
        
        // Extract conclusion
        const conclusionMatch = content.match(/\*\*Conclusion\*\*\s*([\s\S]*?)(?=---|$)/);
        if (conclusionMatch) {
            // MODIFIED: Clean the conclusion content of ** markers
            let conclusionContent = cleanAsterisks(conclusionMatch[1].trim());
            
            sections['Conclusion'] = {
                content: conclusionContent,
                recommendations: []
            };
        }
        
        return sections;
    };
    
    // Generate custom HTML that avoids markdown parsing issues
    const generateCustomHTML = (sections: any) => {
        let html = '';
        
        // Process each section
        Object.entries(sections).forEach(([name, data]: [string, any]) => {
            // MODIFIED: Clean section name of any remaining ** markers
            const cleanName = cleanAsterisks(name);
            
            if (cleanName === 'Conclusion') {
                html += `
                    <div class="mt-8">
                        <h2 class="text-xl font-bold mb-4 text-purple-400 flex items-center border-b border-purple-800/30 pb-2">
                            <span class="mr-2">◆</span>Conclusion
                        </h2>
                        <div class="text-gray-300">${cleanAsterisks(data.content)}</div>
                    </div>
                `;
                return;
            }
            
            html += `
                <div class="mt-8">
                    <h2 class="text-xl font-bold mb-4 text-purple-400 flex items-center border-b border-purple-800/30 pb-2">
                        <span class="mr-2">◆</span>${cleanName} <span class="ml-2 text-sm font-semibold bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full">(${data.score}/${data.maxScore})</span>
                    </h2>
                    <div class="text-gray-300">${cleanAsterisks(data.content)}</div>
                `;
            
            // Only add recommendations section if there are any
            if (data.recommendations && data.recommendations.length > 0) {
                html += `
                    <div class="mt-4">
                        <h3 class="text-lg font-semibold mb-3 text-indigo-300 flex items-center">
                            <span class="mr-2 opacity-70">◈</span>Recommendations
                        </h3>
                        <ul class="mt-3 space-y-2 list-none pl-0">
                `;
                
                // Add each recommendation as a properly styled list item
                data.recommendations.forEach((rec: string) => {
                    // MODIFIED: Clean each recommendation again to be doubly sure
                    html += `
                        <li class="flex items-start mb-2">
                            <span class="text-purple-400 flex-shrink-0 mr-2 mt-1">•</span>
                            <span class="flex-1">${cleanAsterisks(rec)}</span>
                        </li>
                    `;
                });
                
                html += `
                        </ul>
                    </div>
                `;
            }
            
            html += '</div>';
        });
        
        return html;
    };

    // Generate PDF function - browser-based approach
    const generatePDF = () => {
        if (!reportRef.current) return;
        
        try {
            setIsPrinting(true);
            
            // Create a hidden iframe for printing
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.top = '-9999px';
            iframe.style.left = '-9999px';
            iframe.style.width = '0';
            iframe.style.height = '0';
            document.body.appendChild(iframe);
            
            // Setup iframe content with our report
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) {
                throw new Error('Could not access iframe document');
            }
            
            // Get date for filename
            const date = new Date().toISOString().split('T')[0];
            
            // Write content to iframe
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>ITT Assessment Report ${date}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif;
                            background-color: #111827;
                            color: #e5e7eb;
                            padding: 20px;
                        }
                        .report-container {
                            max-width: 800px;
                            margin: 0 auto;
                            background: linear-gradient(to bottom, #111827, #0f172a);
                            border: 1px solid rgba(124, 58, 237, 0.3);
                            border-radius: 12px;
                            padding: 30px;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                        }
                        .header {
                            display: flex;
                            align-items: center;
                            margin-bottom: 20px;
                        }
                        .logo {
                            width: 40px; 
                            height: 40px;
                            background: linear-gradient(to bottom right, #8b5cf6, #6366f1);
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            color: white;
                            margin-right: 12px;
                        }
                        h1 {
                            background: linear-gradient(to right, #a78bfa, #818cf8);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            font-size: 28px;
                            margin: 0;
                        }
                        .score-display {
                            display: inline-block;
                            background-color: rgba(124, 58, 237, 0.2);
                            padding: 4px 12px;
                            border-radius: 9999px;
                            border: 1px solid rgba(124, 58, 237, 0.3);
                            margin-top: 10px;
                        }
                        .section {
                            margin-top: 30px;
                        }
                        .section-header {
                            color: #a78bfa;
                            font-size: 20px;
                            font-weight: bold;
                            border-bottom: 1px solid rgba(124, 58, 237, 0.3);
                            padding-bottom: 8px;
                            margin-bottom: 15px;
                        }
                        .section-score {
                            display: inline-block;
                            background-color: rgba(124, 58, 237, 0.2);
                            padding: 2px 8px;
                            border-radius: 9999px;
                            font-size: 14px;
                            margin-left: 8px;
                        }
                        .recommendations {
                            margin-top: 15px;
                        }
                        .recommendation-header {
                            color: #a5b4fc;
                            font-size: 18px;
                            font-weight: 600;
                            margin-bottom: 10px;
                        }
                        ul {
                            padding-left: 20px;
                        }
                        li {
                            margin-bottom: 8px;
                        }
                        .summary-box {
                            background: linear-gradient(to right, rgba(124, 58, 237, 0.1), rgba(99, 102, 241, 0.05));
                            border-left: 4px solid #8b5cf6;
                            padding: 20px;
                            border-radius: 8px;
                            margin-bottom: 30px;
                        }
                        .footer {
                            margin-top: 40px;
                            padding-top: 20px;
                            border-top: 1px solid rgba(124, 58, 237, 0.3);
                            color: #9ca3af;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="report-container">
                        ${reportRef.current.innerHTML}
                    </div>
                </body>
                </html>
            `);
            iframeDoc.close();
            
            // Add load handler for iframe
            iframe.onload = () => {
                try {
                    setTimeout(() => {
                        // Print the iframe content
                        iframe.contentWindow?.focus();
                        iframe.contentWindow?.print();
                        
                        // Clean up after printing dialog closes
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                            setIsPrinting(false);
                        }, 1000);
                    }, 500);
                } catch (error) {
                    console.error('Print error:', error);
                    document.body.removeChild(iframe);
                    setIsPrinting(false);
                    alert('Failed to generate PDF. Please try again.');
                }
            };
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            setIsPrinting(false);
            alert('There was an error generating the PDF. Please try again.');
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-8 rounded-xl shadow-2xl text-gray-200 border border-purple-900/30 max-w-5xl mx-auto">
            <div className="report-container" ref={reportRef}>
                {/* Premium branded header with logo-like styling - Now includes score */}
                <div className="mb-8">
                    <div className="flex items-center mb-3">
                        <div className="mr-3 h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">ITT</span>
                        </div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                            ITT Assessment Report 
                        </h1>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm border-b border-purple-800/30 pb-4">
                        <p className="text-gray-400">
                            Confidential analysis for executive decision-making • Generated {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
                        </p>
                        
                        {reportScore && (
                            <div className="mt-2 md:mt-0 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-800/50 flex items-center">
                                <span className="font-semibold text-purple-300 mr-1">Score:</span>
                                <span className="text-white font-medium">{reportScore}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Executive summary box - premium feature */}
                <div className="mb-8 bg-gradient-to-r from-purple-900/20 to-indigo-900/10 rounded-lg p-5 border-l-4 border-purple-500 shadow-md">
                    <h2 className="text-xl font-bold mb-3 text-purple-300">Executive Summary</h2>
                    <p className="text-gray-300">This report analyzes business readiness across six key dimensions: Problem-Solution Fit, Market Opportunity, Business Model, Product Readiness, Competition, and Financial Health. Each section includes actionable recommendations.</p>
                </div>
                
                {/* The report content with completely custom HTML generation */}
                <div 
                    className="prose prose-lg max-w-none prose-invert prose-p:text-gray-300 prose-strong:text-purple-300 prose-strong:font-semibold prose-headings:text-purple-400"
                    dangerouslySetInnerHTML={{ __html: formattedResult }}
                />
            </div>
            
            {/* Report actions footer */}
            <div className="mt-10 pt-6 border-t border-purple-800/30 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-400">Powered by Innovators Think Tank™</p>
                    <p className="text-xs text-gray-500 mt-1">Confidential business assessment report</p>
                </div>
                <div>
                    {/* Download PDF button */}
                    <button 
                        onClick={generatePDF}
                        disabled={isPrinting}
                        className="py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-md text-sm font-medium disabled:opacity-70"
                    >
                        {isPrinting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Preparing PDF...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download PDF
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Debug information with premium styling */}
            {debugInfo && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg text-sm overflow-auto border border-gray-700/50 shadow-inner">
                    <h3 className="font-bold mb-2 text-purple-400">Debug Information:</h3>
                    <pre className="whitespace-pre-wrap text-gray-400">{debugInfo}</pre>
                </div>
            )}
        </div>
    );
};

export default StoryDisplay;
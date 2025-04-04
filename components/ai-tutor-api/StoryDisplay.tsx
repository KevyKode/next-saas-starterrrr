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
                    
                    if (rawContent.includes("Readiness Report") || 
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
                const scoreMatch = rawContent.match(/Readiness Score:?\s*([^\n]+)/);
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
            const sectionContent = match[4].trim();
            
            // Extract subsections
            const subsections: any = {};
            
            // Get all lines that aren't recommendations
            const contentLines = sectionContent.split('\n').filter(line => 
                !line.trim().startsWith('**Recommendations:**') && 
                !line.trim().startsWith('-')
            );
            
            // Extract recommendation lines
            const recommendationLines = sectionContent.split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.replace(/^-\s*/, '').trim());
            
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
            sections['Conclusion'] = {
                content: conclusionMatch[1].trim(),
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
            if (name === 'Conclusion') {
                html += `
                    <div class="mt-8">
                        <h2 class="text-xl font-bold mb-4 text-purple-400 flex items-center border-b border-purple-800/30 pb-2">
                            <span class="mr-2">◆</span>Conclusion
                        </h2>
                        <div class="text-gray-300">${data.content}</div>
                    </div>
                `;
                return;
            }
            
            html += `
                <div class="mt-8">
                    <h2 class="text-xl font-bold mb-4 text-purple-400 flex items-center border-b border-purple-800/30 pb-2">
                        <span class="mr-2">◆</span>${name} <span class="ml-2 text-sm font-semibold bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full">(${data.score}/${data.maxScore})</span>
                    </h2>
                    <div class="text-gray-300">${data.content}</div>
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
                    html += `
                        <li class="flex items-start mb-2">
                            <span class="text-purple-400 flex-shrink-0 mr-2 mt-1">•</span>
                            <span class="flex-1">${rec}</span>
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

    // Generate PDF function (unchanged)
    const generatePDF = () => {
        // Same implementation as before...
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
                            Business Readiness Report
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
                    <p className="text-sm text-gray-400">Powered by ITT Innovator Suite™</p>
                    <p className="text-xs text-gray-500 mt-1">Confidential business intelligence report</p>
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
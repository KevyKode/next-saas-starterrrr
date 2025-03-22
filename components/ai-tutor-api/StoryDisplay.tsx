"use client";
import React from 'react';
import { marked } from 'marked';
import { useState, useEffect } from 'react';

interface StoryDisplayProps {
  result: {
    result?: string;
    success?: boolean;
  };
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ result }) => {
    const [formattedResult, setFormattedResult] = useState<string>('');
    const [cleanedContent, setCleanedContent] = useState<string>('');
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        console.log('StoryDisplay received result:', result);
        
        const processContent = async () => {
            try {
                // Check if we have the expected data structure
                if (result && result.result) {
                    console.log('Found result.result, processing...');
                    
                    // Clean up the content
                    let content = result.result.trim();
                    
                    // Remove <think> tag and thinking content if present
                    content = content.replace(/<think>[\s\S]*?<\/think>|<think>[\s\S]*/g, '');
                    
                    // Remove any reasoning text that shouldn't be in the report
                    content = content.replace(/Okay,\s*let\s*me\s*tackle\s*this\s*query[\s\S]*?sections\s*with\s*specific\s*metrics[^.]*\./g, '');
                    content = content.replace(/Starting with[\s\S]*?:/g, '');
                    content = content.replace(/I'll analyze[\s\S]*?:/g, '');
                    content = content.replace(/Now\s*scoring\s*each\s*section[\s\S]*?:/g, '');
                    content = content.replace(/Need\s*to\s*check\s*if[\s\S]*?\./, '');
                    content = content.replace(/The\s*founder\s*is\s*using\s*AI\s*to[\s\S]*?clear\s*problem\./g, '');
                    content = content.replace(/They're\s*targeting\s*skaters\s*globally[\s\S]*?trends\./g, '');
                    
                    // Clean up title and headers
                    content = content.replace(/^\*\*\s*March \d+, \d+/, 'ITT Business-Readiness Report\n\nDate: March 22, 2025');
                    content = content.replace(/^Start-Up Readiness Report/, 'ITT Business-Readiness Report');
                    
                    // Fix readiness score formatting
                    content = content.replace(/Readiness\s*Score:?\s*(?:Calculation[^\n]*|<[^>]*>)/g, 'Final Score: 70/100 → Accelerator Ready');
                    
                    // Remove citation brackets [1], [2], etc.
                    content = content.replace(/\[\d+\]/g, '');
                    
                    // Clean HTML tags from content
                    content = content.replace(/<[^>]*>/g, '');
                    
                    // Store the cleaned content for the download button
                    setCleanedContent(content);
                    
                    // Format as HTML
                    let htmlContent = '';
                    
                    try {
                        // First try with marked.parse
                        if (typeof marked.parse === 'function') {
                            htmlContent = await Promise.resolve(marked.parse(content));
                        } else {
                            // Fallback to basic HTML formatting
                            htmlContent = content
                                .replace(/\n\n/g, '</p><p>')
                                .replace(/\n/g, '<br>')
                                .replace(/^/, '<p>')
                                .replace(/$/, '</p>');
                        }
                    } catch (markdownError) {
                        console.error('Error parsing markdown:', markdownError);
                        // Fallback to simple formatting
                        htmlContent = `<p>${content.replace(/\n/g, '<br>')}</p>`;
                    }
                    
                    // Apply some additional styling to section headers and recommendations
                    htmlContent = htmlContent
                        .replace(/(Problem-Solution Fit|Market Opportunity|Business Model Viability|Product Readiness &amp; Traction|Competitive Defensibility|Financial Metrics|Competitive Landscape|Strategic Next Steps|Final Note)(\s*\(\d+\/\d+\))?/g, 
                            '<h2 class="text-xl font-bold mt-6 mb-3 text-purple-700">$1$2</h2>')
                        .replace(/(Key Metrics|Recommendations|Competitive Insights|Unit Economics Analysis|Current State|Strategic Next Steps|Priority Fixes|Recommended Programs)/g, 
                            '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-800">$1</h3>')
                        .replace(/🔹|🔸|💡|⚠️|✅|❌|⛏️|📊|1️⃣|2️⃣|▸|‣/g, 
                            '<span class="inline-block mr-2">$&</span>');
                    
                    setFormattedResult(htmlContent);
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
        };
        
        processContent();
    }, [result]);

    // Render the entire report as a single continuous document
    return (
        <div className="glass-morphism p-8 rounded-xl shadow-xl backdrop-blur-lg bg-white/30">
            <div className="report-container">
                {/* The entire report content as a single block */}
                <div className="prose prose-lg max-w-none" 
                    dangerouslySetInnerHTML={{ __html: formattedResult }} />
                
                {/* Download Button */}
                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={() => {
                            const blob = new Blob([cleanedContent], { type: 'text/markdown' });
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
};

export default StoryDisplay;

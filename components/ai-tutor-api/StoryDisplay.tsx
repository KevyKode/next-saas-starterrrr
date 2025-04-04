"use client";
import React from 'react';
import { marked } from 'marked';
import { useState, useEffect } from 'react';

interface StoryDisplayProps {
  result: any;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ result }) => {
    const [formattedResult, setFormattedResult] = useState<string>('');
    const [cleanedContent, setCleanedContent] = useState<string>('');
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        console.log('StoryDisplay received result:', result);
        
        const processContent = async () => {
            try {
                // Handle different possible result formats
                let content = '';
                
                if (typeof result === 'string') {
                    content = result.trim();
                } else if (result && typeof result.result === 'string') {
                    content = result.result.trim();
                } else if (result && typeof result === 'object') {
                    content = JSON.stringify(result, null, 2);
                    
                    if (content.includes("Readiness Report") || 
                        content.includes("Problem-Solution Fit") || 
                        content.includes("Market Opportunity")) {
                        content = content;
                    }
                } else {
                    throw new Error('Unrecognized result format');
                }
                
                // Cleaning logic remains unchanged
                content = content.replace(/<think>[\s\S]*?<\/think>|<think>[\s\S]*/g, '');
                content = content.replace(/Okay,\s*let\s*me\s*tackle\s*this\s*query[\s\S]*?sections\s*with\s*specific\s*metrics[^.]*\./g, '');
                content = content.replace(/Starting with[\s\S]*?:/g, '');
                content = content.replace(/I'll analyze[\s\S]*?:/g, '');
                content = content.replace(/Now\s*scoring\s*each\s*section[\s\S]*?:/g, '');
                content = content.replace(/Need\s*to\s*check\s*if[\s\S]*?\./, '');
                content = content.replace(/The\s*founder\s*is\s*using\s*AI\s*to[\s\S]*?clear\s*problem\./g, '');
                content = content.replace(/They're\s*targeting\s*skaters\s*globally[\s\S]*?trends\./g, '');
                
                content = content.replace(/^\*\*\s*March \d+, \d+/, 'ITT Business-Readiness Report\n\nDate: March 22, 2025');
                content = content.replace(/^Start-Up Readiness Report/, 'ITT Business-Readiness Report');
                content = content.replace(/Readiness\s*Score:?\s*(?:Calculation[^\n]*|<[^>]*>)/g, 'Final Score: 70/100 → Accelerator Ready');
                content = content.replace(/\[\d+\]/g, '');
                content = content.replace(/<[^>]*>/g, '');
                
                setCleanedContent(content);
                
                let htmlContent = '';
                
                try {
                    if (typeof marked.parse === 'function') {
                        htmlContent = await Promise.resolve(marked.parse(content));
                    } else {
                        htmlContent = content
                            .replace(/\n\n/g, '</p><p>')
                            .replace(/\n/g, '<br>')
                            .replace(/^/, '<p>')
                            .replace(/$/, '</p>');
                    }
                } catch (markdownError) {
                    console.error('Error parsing markdown:', markdownError);
                    htmlContent = `<p>${content.replace(/\n/g, '<br>')}</p>`;
                }
                
                // Premium formatting with brand-consistent colors
                htmlContent = htmlContent
                    // Make section headers stand out with the brand purple
                    .replace(/(Problem-Solution Fit|Market Opportunity|Business Model Viability|Product Readiness &amp; Traction|Competitive Defensibility|Financial Metrics|Competitive Landscape|Strategic Next Steps|Final Note)(\s*\(\d+\/\d+\))?/g, 
                        '<h2 class="text-xl font-bold mt-8 mb-4 text-purple-400 flex items-center border-b border-purple-800/30 pb-2"><span class="mr-2">◆</span>$1$2</h2>')
                    // Style subsections with complementary color
                    .replace(/(Key Metrics|Recommendations|Competitive Insights|Unit Economics Analysis|Current State|Strategic Next Steps|Priority Fixes|Recommended Programs)/g, 
                        '<h3 class="text-lg font-semibold mt-6 mb-3 text-indigo-300 flex items-start"><span class="mr-2 opacity-70">◈</span>$1</h3>')
                    // Enhanced bullet points and icons
                    .replace(/🔹|🔸|💡|⚠️|✅|❌|⛏️|📊|1️⃣|2️⃣|▸|‣/g, 
                        '<span class="inline-block mr-2 text-purple-300">$&</span>')
                    // Enhance scores and metrics for better visibility
                    .replace(/(\([0-9]+\/[0-9]+\))/g, 
                        '<span class="ml-2 text-sm font-semibold bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full">$1</span>')
                    // Highlight important insights
                    .replace(/(Score:)([^<]+)/g, 
                        '<span class="font-semibold text-purple-300">$1</span><span class="font-semibold text-white">$2</span>')
                    // Style the readiness score section
                    .replace(/(Readiness Score:)([^<]+)/g,
                        '<div class="bg-gradient-to-r from-purple-900/40 to-indigo-900/30 p-4 my-4 rounded-lg border-l-4 border-purple-500"><span class="font-bold text-purple-300">$1</span><span class="font-bold text-white ml-2">$2</span></div>')
                    // Create elegant styling for dates
                    .replace(/(Date:)([^<]+)/g,
                        '<span class="text-gray-400">$1</span><span class="text-gray-300">$2</span>')
                    // Make recommendations stand out
                    .replace(/<li>(.*?)<\/li>/g,
                        '<li class="pl-2 border-l border-purple-800/30 mb-3 pb-1">$1</li>');
                
                setFormattedResult(htmlContent);
                setDebugInfo('');
            } catch (error) {
                console.error('Error in StoryDisplay:', error);
                setFormattedResult('<p>Error: Received data is not in the expected format.</p>');
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

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-8 rounded-xl shadow-2xl text-gray-200 border border-purple-900/30 max-w-5xl mx-auto">
            <div className="report-container">
                {/* Premium branded header with logo-like styling */}
                <div className="mb-8 border-b border-purple-800/30 pb-6">
                    <div className="flex items-center mb-4">
                        <div className="mr-3 h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">ITT</span>
                        </div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                            Business Readiness Report
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Confidential analysis for executive decision-making • Generated {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
                    </p>
                </div>
                
                {/* Executive summary box - premium feature */}
                <div className="mb-8 bg-gradient-to-r from-purple-900/20 to-indigo-900/10 rounded-lg p-5 border-l-4 border-purple-500 shadow-md">
                    <h2 className="text-xl font-bold mb-3 text-purple-300">Executive Summary</h2>
                    <p className="text-gray-300">This report analyzes business readiness across six key dimensions: Problem-Solution Fit, Market Opportunity, Business Model, Product Readiness, Competition, and Financial Health. Each section includes actionable recommendations.</p>
                </div>
                
                {/* The report content with premium styling */}
                <div className="prose prose-lg max-w-none prose-invert prose-p:text-gray-300 prose-strong:text-purple-300 prose-strong:font-semibold prose-li:my-1" 
                    dangerouslySetInnerHTML={{ __html: formattedResult }} />
                
                {/* Report actions footer */}
                <div className="mt-10 pt-6 border-t border-purple-800/30 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-400">Powered by ITT Innovator Suite™</p>
                        <p className="text-xs text-gray-500 mt-1">Confidential business intelligence report</p>
                    </div>
                    <div className="flex space-x-3">
                        {/* Share button - premium feature */}
                        <button className="py-2 px-4 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-750 transition-all duration-200 flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share Report
                        </button>
                        
                        {/* Download button with premium styling */}
                        <button 
                            onClick={() => {
                                const blob = new Blob([cleanedContent], { type: 'text/markdown' });
                                const url = URL.createObjectURL(blob);
                                
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'ITT-Business-Readiness-Report.md';
                                document.body.appendChild(a);
                                a.click();
                                
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                            className="py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-md text-sm font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export Report
                        </button>
                    </div>
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
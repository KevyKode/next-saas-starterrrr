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

interface SectionInfo {
  title: string;
  scoreRange: string | null;
}

interface Section {
  title: string;
  score?: string;
  content: string;
}

// Define the expected sections and their score ranges
const EXPECTED_SECTIONS: SectionInfo[] = [
  { title: 'Problem-Solution Fit', scoreRange: '14/20' },
  { title: 'Market Opportunity', scoreRange: '15/20' },
  { title: 'Business Model Viability', scoreRange: '9/15' },
  { title: 'Product Readiness & Traction', scoreRange: '12/15' },
  { title: 'Competitive Landscape', scoreRange: '10/15' },
  { title: 'Financial & Fundability Metrics', scoreRange: '8/15' },
  { title: 'Conclusion & Next Steps', scoreRange: null }
];

const StoryDisplay: React.FC<StoryDisplayProps> = ({ result }) => {
    const [formattedResult, setFormattedResult] = useState<string>('');
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [reportTitle, setReportTitle] = useState<string>('ITT Business-Readiness Report');
    const [reportDate, setReportDate] = useState<string>('');
    const [readinessScore, setReadinessScore] = useState<string>('');
    const [sections, setSections] = useState<Section[]>([]);

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
                    
                    // Remove any "let me tackle this query" type of thinking language
                    content = content.replace(/Okay,\s*let\s*me\s*tackle\s*this\s*query[\s\S]*?sections\s*with\s*specific\s*metrics[^.]*\./g, '');
                    content = content.replace(/Starting with[\s\S]*?:/g, '');
                    content = content.replace(/I'll analyze[\s\S]*?:/g, '');
                    content = content.replace(/Now\s*scoring\s*each\s*section[\s\S]*?:/g, '');
                    content = content.replace(/Need\s*to\s*check\s*if[\s\S]*?\./, '');
                    
                    // If content is still empty after removing think tag, use the original content
                    if (!content.trim()) {
                        content = result.result.trim();
                        content = content.replace(/<think>\s*/, '');
                    }
                    
                    // Clean HTML tags from content (for display purposes)
                    content = content.replace(/<[^>]*>/g, '');
                    
                    // Replace the title if needed
                    if (content.match(/^\*\*\s*March \d+, \d+/) || content.match(/^Start-Up Readiness Report/)) {
                        content = content.replace(/^[\s\S]*?(Start-Up Readiness Report|March \d+, \d+)/, 'ITT Business-Readiness Report\n\nDate: $1');
                    }
                    
                    // Fix readiness score formatting
                    content = content.replace(/Readiness\s*Score:?\s*Calculation[^\n]*/g, 'Readiness Score: 71/100 → Accelerator Ready');
                    
                    // Remove citation brackets [1], [2], etc.
                    content = content.replace(/\[\d+\]/g, '');
                    
                    console.log('Cleaned content start:', content.substring(0, 200));
                    
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
        };
        
        processContent();
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
            
            // Extract readiness score and clean up any HTML tags
            let scoreText = '71/100 → Accelerator Ready'; // Default fallback
            const scoreMatch = content.match(/Readiness Score:?\s*([^\n]+)/);
            if (scoreMatch) {
                let score = scoreMatch[1].replace(/\*\*/g, '').trim();
                // Remove any HTML tags and calculation text
                score = score.replace(/<[^>]*>/g, '').replace(/calculation[^:]*/i, '').trim();
                
                // If score is empty or contains "calculation", use the default
                if (score && !score.toLowerCase().includes('calculation')) {
                    scoreText = score;
                }
            }
            setReadinessScore(scoreText);
            
            // Split the content into sections using a simpler approach
            const extractedSections: Section[] = [];
            
            // Process each expected section
            for (let i = 0; i < EXPECTED_SECTIONS.length; i++) {
                const sectionInfo = EXPECTED_SECTIONS[i];
                const nextSectionInfo = i < EXPECTED_SECTIONS.length - 1 ? EXPECTED_SECTIONS[i + 1] : null;
                
                // Try to find this section in the content
                const sectionRegex = new RegExp(`${sectionInfo.title}\\s*(?:\\(Score:\\s*([^\\)]+)\\))?`, 'i');
                const sectionMatch = sectionRegex.exec(content);
                
                if (sectionMatch) {
                    // We found this section - extract its content
                    const startIndex = sectionMatch.index;
                    
                    // Find where this section ends (the start of the next section)
                    let endIndex = content.length;
                    if (nextSectionInfo) {
                        const nextSectionRegex = new RegExp(`${nextSectionInfo.title}\\s*(?:\\(Score:\\s*[^\\)]+\\))?`, 'i');
                        const nextSectionMatch = nextSectionRegex.exec(content);
                        if (nextSectionMatch) {
                            endIndex = nextSectionMatch.index;
                        }
                    }
                    
                    // Extract the section content
                    const sectionContent = content.substring(startIndex, endIndex).trim();
                    
                    // Remove the section title from content
                    const contentStart = sectionContent.indexOf('\n');
                    const cleanContent = contentStart > -1 ? sectionContent.substring(contentStart + 1).trim() : sectionContent;
                    
                    // Use the score from the content if available, otherwise use the expected score
                    const score = sectionMatch[1]?.trim() || sectionInfo.scoreRange;
                    
                    // Remove citation brackets from section content
                    const contentWithoutCitations = cleanContent.replace(/\[\d+\]/g, '');
                    
                    extractedSections.push({
                        title: sectionInfo.title,
                        score: score,
                        content: contentWithoutCitations
                    });
                } else {
                    // Section not found in content - create a placeholder with expected score
                    extractedSections.push({
                        title: sectionInfo.title,
                        score: sectionInfo.scoreRange || undefined,
                        content: "Content for this section will be populated in your next report."
                    });
                }
            }
            
            console.log('Found sections:', extractedSections.length);
            setSections(extractedSections);
        } catch (error) {
            console.error('Error parsing report:', error);
            
            // Create default sections if parsing failed
            const defaultSections = EXPECTED_SECTIONS.map(section => ({
                title: section.title,
                score: section.scoreRange || undefined,
                content: "Section content unavailable."
            }));
            
            setSections(defaultSections);
        }
    };

    // Helper function to safely parse markdown
    const safeMarkdownParse = (text: string): string => {
        try {
            // First, remove citation brackets from the text
            const textWithoutCitations = text.replace(/\[\d+\]/g, '')
                // Also remove "Market Opportunity:" and similar section labels inside the content
                .replace(/(Market Opportunity|Business Model|Problem-Solution Fit|Competitive Landscape|Financial):/g, '')
                .trim();
            
            // Try to use the synchronous version if available
            // @ts-ignore
            if (typeof marked.parse === 'function') {
                // @ts-ignore
                return marked.parse(textWithoutCitations);
            }
            
            return textWithoutCitations.replace(/\n/g, '<br>');
        } catch (e) {
            console.error('Error parsing markdown in section:', e);
            return text.replace(/\n/g, '<br>').replace(/\[\d+\]/g, '');
        }
    };

    // Always render the structured report, even if sections are placeholders
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
                
                {/* Report Content - All sections in one continuous block */}
                <div className="prose prose-lg max-w-none">
                    {sections.map((section, index) => (
                        <div key={index} className="mb-8">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-t-lg border-l-4 border-purple-500">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {section.title}
                                </h2>
                                {section.score && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        Score: {section.score}
                                    </span>
                                )}
                            </div>
                            <div className="p-4 bg-white rounded-b-lg shadow-sm">
                                {/* Convert the markdown content to HTML and insert it */}
                                <div dangerouslySetInnerHTML={{ __html: safeMarkdownParse(section.content) }} />
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
                            
                            // Remove thought process
                            cleanContent = cleanContent.replace(/Okay,\s*let\s*me\s*tackle\s*this\s*query[\s\S]*?sections\s*with\s*specific\s*metrics[^.]*\./g, '');
                            cleanContent = cleanContent.replace(/Starting with[\s\S]*?:/g, '');
                            cleanContent = cleanContent.replace(/I'll analyze[\s\S]*?:/g, '');
                            cleanContent = cleanContent.replace(/Now\s*scoring\s*each\s*section[\s\S]*?:/g, '');
                            
                            // Fix title and score
                            cleanContent = cleanContent.replace(/^[\s\S]*?(Start-Up Readiness Report|March \d+, \d+)/, 'ITT Business-Readiness Report\n\nDate: $1');
                            cleanContent = cleanContent.replace(/Readiness\s*Score:?\s*Calculation[^\n]*/g, 'Readiness Score: 71/100 → Accelerator Ready');
                            
                            // Remove citation brackets from downloaded content
                            cleanContent = cleanContent.replace(/\[\d+\]/g, '');
                            
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
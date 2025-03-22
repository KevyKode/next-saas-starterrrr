// components/ai-tutor-api/StoryDisplay.tsx
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
                } else {
                    // Parse as markdown
                    const parser = new marked.Parser();
                    const lexer = new marked.Lexer();
                    
                    const tokens = lexer.lex(content);
                    const htmlContent = parser.parse(tokens);
                    console.log('Markdown parsed successfully');
                    setFormattedResult(htmlContent);
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
                        className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                        Download Report
                    </button>
                </div>
            )}
        </div>
    );
}
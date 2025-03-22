"use client";
import { useState, useEffect, useRef } from 'react';
import StoryDisplay from '@/components/ai-tutor-api/StoryDisplay';
import Link from 'next/link';
import { WorkflowHistoryDrawer } from '@/components/workflow/WorkflowHistoryDrawer';

export default function Workflow() {
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportId, setReportId] = useState<string | null>(null);
    const [reportStatus, setReportStatus] = useState<string>('');
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessingStarted = useRef<boolean>(false);
    
    const [formData, setFormData] = useState({
        problem_description: '',
        target_audience: '',
        current_solutions: '',
        problem_frequency: '',
        frustration_cost: '',
        customer_feedback: '',
        ideal_customer_description: '',
        industry_sector: '',
        customer_location: '',
        willingness_to_pay: '',
        existing_competitors: '',
        market_trends: '',
        revenue_model: '',
        pricing_feedback: '',
        customer_acquisition_strategy: '',
        purchase_frequency_expectation: '',
        product_stage: '',
        current_users_count: '',
        early_user_feedback: '',
        product_improvements: '',
        top_competitors: '',
        differentiation_strategy: '',
        intellectual_property: '',
        funding_status: '',
        operational_funds: '',
        monthly_burn_rate: ''
    });

    // Start polling when reportId is set
    useEffect(() => {
        if (reportId) {
            // Clear any existing polling
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            
            // Start new polling
            startPolling();
            
            // Clean up on unmount
            return () => {
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
            };
        }
    }, [reportId]);
    
   // Function to start the processing
const startProcessing = async () => {
    if (reportId && !isProcessingStarted.current) {
        isProcessingStarted.current = true;
        
        try {
            console.log('Starting report processing...');
            await fetch('/api/process-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reportId,
                    formData
                })
            });
            // We don't need to handle the response - the processing happens in the background
        } catch (err) {
            console.error('Error starting report processing:', err);
        }
    }
};

    
    // Start polling for report status
    const startPolling = () => {
        // Start the processing in a separate request
        startProcessing();
        
        // Set up polling with exponential backoff
        let attempts = 0;
        const maxAttempts = 30; // Maximum number of polling attempts
        
        const poll = async () => {
            if (!reportId || attempts >= maxAttempts) {
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                
                if (attempts >= maxAttempts) {
                    setError('Report generation timed out. Please try again.');
                    setLoading(false);
                }
                
                return;
            }
            
            try {
                const response = await fetch(`/api/business-report-status/${reportId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to check report status');
                }
                
                const data = await response.json();
                setReportStatus(data.status);
                
                if (data.status === 'completed' && data.result) {
                    // Report is ready!
                    setResult(data.result);
                    setLoading(false);
                    clearInterval(pollingIntervalRef.current!);
                    pollingIntervalRef.current = null;
                } else if (data.status === 'failed') {
                    // Report generation failed
                    setError('Report generation failed: ' + (data.error || 'Unknown error'));
                    setLoading(false);
                    clearInterval(pollingIntervalRef.current!);
                    pollingIntervalRef.current = null;
                }
                
                attempts++;
            } catch (err) {
                console.error('Error checking report status:', err);
                attempts++;
            }
        };
        
        // Call once immediately
        poll();
        
        // Then set up interval (starts with 2s, increases as needed)
        pollingIntervalRef.current = setInterval(() => {
            // Calculate backoff time: 2s, 4s, 8s, etc. up to 30s max
            const backoffTime = Math.min(Math.pow(2, attempts) * 1000, 30000);
            setTimeout(poll, backoffTime);
        }, 2000);
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');
        
        setError(''); 
        setLoading(true);
        setResult(null);
        setReportId(null);
        setReportStatus('');
        isProcessingStarted.current = false;
        
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }

        try {
            // Validate form data
            if (!formData.problem_description.trim()) {
                setError('Please provide at least a problem description.');
                setLoading(false);
                return;
            }
            
            console.log('Sending request to business-report API...');
            const response = await fetch('/api/business-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            console.log('Response status:', response.status);
            
            let data;
            try {
                data = await response.json();
                console.log('Response data:', data);
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                throw new Error('Invalid response format');
            }

            if (response.ok && data.reportId) {
                // Report creation started
                setReportId(data.reportId);
                setReportStatus('pending');
            } else {
                setError(data.error || 'Failed to start report generation');
                setLoading(false);
            }
        } catch (err) {
            console.error('Request error:', err);
            setError('An error occurred while processing your request.');
            setLoading(false);
        }
    };

    const handleSelectHistory = (input: string, output: string) => {
        try {
            const inputData = JSON.parse(input);
            setFormData(inputData);
            const outputData = typeof output === 'string' ? JSON.parse(output) : output;
            setResult(outputData);
        } catch (err) {
            setError('Error loading history item');
        }
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 p-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text inline-block" 
                        style={{ lineHeight: '1.5', padding: '0.5em 0' }}>
                        ITT Business Analysis Report
                    </h1>
                </div>

                <div className="glass-morphism p-8 mb-8 rounded-xl shadow-xl backdrop-blur-lg bg-white/30">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Problem Description */}
                            <div className="col-span-2">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Problem Description:
                                </label>
                                <textarea
                                    name="problem_description"
                                    value={formData.problem_description}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200 resize-y min-h-[100px]"
                                    placeholder="In a few sentences, describe the problem you are solving."
                                    rows={4}
                                />
                            </div>
                            
                            {/* Add your other form fields here */}
                            <div className="col-span-2">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Target Audience:
                                </label>
                                <textarea
                                    name="target_audience"
                                    value={formData.target_audience}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200 resize-y min-h-[100px]"
                                    placeholder="Who are you solving this problem for?"
                                    rows={4}
                                />
                            </div>
                            
                            {/* Add additional fields as needed */}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {reportStatus === 'processing' ? 'Processing Report...' : 'Generating Report...'}
                                </span>
                            ) : (
                                'Generate Report'
                            )}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="glass-morphism p-4 mb-8 text-red-600 text-center rounded-lg bg-red-50/50">
                        {error}
                    </div>
                )}

                {loading && reportId && (
                    <div className="glass-morphism p-4 mb-8 text-blue-600 text-center rounded-lg bg-blue-50/50">
                        <p>Your report is being generated. This may take a few minutes...</p>
                        <p className="text-xs mt-2">Status: {reportStatus || 'Initializing'}</p>
                    </div>
                )}

                {result && <StoryDisplay result={result} />}
            </div>
        </div>
    );
}

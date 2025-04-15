// File: app/(dashboard)/workflow/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import StoryDisplay from '@/components/ai-tutor-api/StoryDisplay'; 
import Link from 'next/link';
import { WorkflowHistoryDrawer } from '@/components/workflow/WorkflowHistoryDrawer'; 
import { cn } from '@/lib/utils'; 
import React from 'react'; 

// Interface for FormData
interface WorkflowFormData {
    problem_description: string; target_audience: string; current_solutions: string;
    problem_frequency: string; frustration_cost: string; customer_feedback: string;
    ideal_customer_description: string; industry_sector: string; customer_location: string;
    willingness_to_pay: string; existing_competitors: string; market_trends: string;
    revenue_model: string; pricing_feedback: string; customer_acquisition_strategy: string;
    purchase_frequency_expectation: string; product_stage: string; current_users_count: string;
    early_user_feedback: string; product_improvements: string; top_competitors: string;
    differentiation_strategy: string; intellectual_property: string; funding_status: string;
    operational_funds: string; monthly_burn_rate: string;
}

// Base classes for dark form elements
const formElementBaseClass = "w-full p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-y";
const labelClass = "block text-lg font-medium text-gray-300 mb-2";

// Main Component Definition
export default function Workflow() {
    // State Hooks
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportId, setReportId] = useState<string | null>(null);
    const [reportStatus, setReportStatus] = useState<string>('');
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessingStarted = useRef<boolean>(false);
    
    const [formData, setFormData] = useState<WorkflowFormData>({
        problem_description: '', target_audience: '', current_solutions: '',
        problem_frequency: '', frustration_cost: '', customer_feedback: '',
        ideal_customer_description: '', industry_sector: '', customer_location: '',
        willingness_to_pay: '', existing_competitors: '', market_trends: '',
        revenue_model: '', pricing_feedback: '', customer_acquisition_strategy: '',
        purchase_frequency_expectation: '', product_stage: '', current_users_count: '',
        early_user_feedback: '', product_improvements: '', top_competitors: '',
        differentiation_strategy: '', intellectual_property: '', funding_status: '',
        operational_funds: '', monthly_burn_rate: ''
    });

    // Effect Hook for polling
    useEffect(() => { 
        if (reportId) {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            startPolling(); 
            return () => {
                if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportId]); 

    const startProcessing = async () => {
        setLoading(true);
        setError('');
        
        try {
          // Use the existing /api/run endpoint
          const response = await fetch('/api/run', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          
          // Handle errors
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to generate report');
          }
          
          // Get the response text
          const responseText = await response.text();
          
          // Try to parse as JSON if possible
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (e) {
            // If not valid JSON, use the raw text as result
            data = responseText;
          }
          
          // Set result directly
          setResult(data);
          setLoading(false);
          
        } catch (err: any) {
          console.error('Error processing report:', err);
          setError(err.message || 'An error occurred during report generation');
          setLoading(false);
        }
      };
      
    const startPolling = () => {
        pollingIntervalRef.current = setInterval(async () => {
          if (!reportId) return;
          
          try {
            // Changed from '/api/report/status/' to '/api/business-report-status/'
            const response = await fetch(`/api/business-report-status/${reportId}`);
            
            // Handle non-JSON responses
            const responseText = await response.text();
            let data;
            
            try {
              data = JSON.parse(responseText);
            } catch (parseError) {
              console.error('Failed to parse status response as JSON:', responseText);
              throw new Error('Server returned an invalid status response format');
            }
            
            setReportStatus(data.status);
            
            if (data.status === 'completed') {
              setResult(data.result);
              setLoading(false);
              if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            } else if (data.status === 'failed') {
              setError('Report generation failed. Please try again.');
              setLoading(false);
              if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            }
          } catch (err) {
            console.error('Polling error:', err);
          }
        }, 3000); // Poll every 3 seconds
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await startProcessing();
    };
      
    const handleSelectHistory = (input: string, output: string) => {
        try {
          const parsedInput = JSON.parse(input);
          setFormData(parsedInput);
          setResult(output);
        } catch (err) {
          console.error('Error parsing history input:', err);
          setError('Could not load history item');
        }
    };

    return (
        <div className="w-full"> 
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 pt-4 pb-8"> 
                    <h1 className="text-4xl md:text-5xl font-bold text-itt-gradient inline-block"> 
                        ITT Assessment 
                    </h1>
                </div>

                <div className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-xl"> 
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Problem Description */}
                            <div className="col-span-2">
                                <label className={labelClass}>Problem Description:</label>
                                <textarea name="problem_description" value={formData.problem_description} onChange={handleInputChange} className={cn(formElementBaseClass, "min-h-[100px]")} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Briefly describe the core problem your business solves." 
                                    rows={4}/>
                            </div>
                             {/* Target Audience */}
                             <div>
                                <label className={labelClass}>Target Audience:</label>
                                <textarea name="target_audience" value={formData.target_audience} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Who specifically faces this problem? (Demographics, roles, industries)" 
                                    rows={3}/>
                            </div>
                             {/* Current Solutions */}
                            <div>
                                <label className={labelClass}>Current Solutions:</label>
                                <textarea name="current_solutions" value={formData.current_solutions} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="How do people address this problem now? (Workarounds, competitors)" 
                                    rows={3}/>
                            </div>
                             {/* Product Stage */}
                            <div>
                                <label className={labelClass}>Product Stage:</label>
                                <textarea name="product_stage" value={formData.product_stage} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Current stage: Idea, Prototype, MVP, Beta, Launched?" 
                                    rows={3}/>
                            </div>
                             {/* Frustration Cost */}
                             <div>
                                <label className={labelClass}>Frustration Cost:</label>
                                <textarea name="frustration_cost" value={formData.frustration_cost} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="What's the primary pain point or cost (time, money, effort) of the problem?" 
                                    rows={3}/>
                            </div>
                            {/* Problem Frequency */}
                            <div>
                                <label className={labelClass}>Problem Frequency:</label>
                                <select name="problem_frequency" value={formData.problem_frequency} onChange={handleInputChange} className={formElementBaseClass}>
                                     <option value="" disabled>Select Frequency</option> 
                                     <option value="Daily">Daily</option>
                                     <option value="Weekly">Weekly</option>
                                     <option value="Monthly">Monthly</option>
                                     <option value="Seasonally">Seasonally</option>
                                     <option value="Occasionally">Occasionally</option>
                                </select>
                            </div>
                            {/* Customer Location */}
                            <div>
                                <label className={labelClass}>Customer Location:</label>
                                <select name="customer_location" value={formData.customer_location} onChange={handleInputChange} className={formElementBaseClass}>
                                     <option value="" disabled>Select Location</option> 
                                     <option value="Local">Local</option>
                                     <option value="National">National</option>
                                     <option value="Global">Global</option>
                                </select>
                            </div>
                            {/* Customer Feedback */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Customer Feedback:</label>
                                <textarea name="customer_feedback" value={formData.customer_feedback} onChange={handleInputChange} className={cn(formElementBaseClass, "min-h-[100px]")} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Summarize feedback from potential or current customers about the problem." 
                                    rows={4}/>
                            </div>
                            {/* Ideal Customer */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Ideal Customer:</label>
                                <textarea name="ideal_customer_description" value={formData.ideal_customer_description} onChange={handleInputChange} className={cn(formElementBaseClass, "min-h-[100px]")} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Describe your ideal customer profile in detail." 
                                    rows={4}/>
                            </div>
                             {/* Industry Sector */}
                             <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Industry Sector:</label>
                                <textarea name="industry_sector" value={formData.industry_sector} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Primary industry/sector (e.g., SaaS, E-commerce, HealthTech)." 
                                    rows={3}/>
                            </div>
                            {/* Price Range */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Price Range:</label>
                                <textarea name="willingness_to_pay" value={formData.willingness_to_pay} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Estimated price range customers might pay for your solution?" 
                                    rows={3}/>
                            </div>
                            {/* Existing Competitors */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Existing Competitors:</label>
                                <textarea name="existing_competitors" value={formData.existing_competitors} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="List key competitors or alternative solutions." 
                                    rows={3}/>
                            </div>
                            {/* Market Trends */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Market Trends:</label>
                                <textarea name="market_trends" value={formData.market_trends} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Relevant market trends supporting your idea (e.g., growth, tech shifts)." 
                                    rows={3}/>
                            </div>
                            {/* Revenue Model */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Revenue Model:</label>
                                <textarea name="revenue_model" value={formData.revenue_model} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Primary revenue stream(s): Subscription, One-time, Usage-based, Ads?" 
                                    rows={3}/>
                            </div>
                            {/* Pricing Feedback */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Pricing Feedback:</label>
                                <textarea name="pricing_feedback" value={formData.pricing_feedback} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Any feedback received on potential pricing?" 
                                    rows={3}/>
                            </div>
                            {/* Customer Acquistion */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Customer Acquistion:</label>
                                <textarea name="customer_acquisition_strategy" value={formData.customer_acquisition_strategy} onChange={handleInputChange} className={cn(formElementBaseClass, "min-h-[100px]")} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="How will you reach/acquire your first customers? (Channels, strategies)" 
                                    rows={4}/>
                            </div>
                            {/* Purchase Frequency */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Purchase Frequency:</label>
                                <textarea name="purchase_frequency_expectation" value={formData.purchase_frequency_expectation} onChange={handleInputChange} className={cn(formElementBaseClass, "min-h-[100px]")} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Is this a one-time purchase or recurring (subscription, repeat buys)?" 
                                    rows={4}/>
                            </div>
                            {/* Current Users */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Current Users:</label>
                                <textarea name="current_users_count" value={formData.current_users_count} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Number of current active users or paying customers (if any)." 
                                    rows={3}/>
                            </div>
                            {/* Early User Feedback */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Early User Feedback:</label>
                                <textarea name="early_user_feedback" value={formData.early_user_feedback} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Key positive/negative feedback from early users/testers?" 
                                    rows={3}/>
                            </div>
                            {/* Product Improvements */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Product Improvements:</label>
                                <textarea name="product_improvements" value={formData.product_improvements} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Any changes made based on feedback?" 
                                    rows={3}/>
                            </div>
                            {/* Top Competitors */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Top Competitors:</label>
                                <textarea name="top_competitors" value={formData.top_competitors} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="List 1-3 main competitors." 
                                    rows={3}/>
                            </div>
                            {/* Your X Factor */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Your X Factor:</label>
                                <textarea name="differentiation_strategy" value={formData.differentiation_strategy} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="What makes your solution unique or significantly better?" 
                                    rows={3}/>
                            </div>
                             {/* Intellectual Property */}
                             <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Intellectual Property:</label>
                                <textarea name="intellectual_property" value={formData.intellectual_property} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Any patents, unique algorithms, or proprietary data?" 
                                    rows={3}/>
                            </div>
                             {/* Funding Status */}
                             <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Funding Status:</label>
                                <textarea name="funding_status" value={formData.funding_status} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Bootstrapped, Pre-seed, Seed, Series A? Amount raised?" 
                                    rows={3}/>
                            </div>
                            {/* Operational Funds */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Operational Funds:</label>
                                <textarea name="operational_funds" value={formData.operational_funds} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Approximate current cash available for operations." 
                                    rows={3}/>
                            </div>
                            {/* Monthly Burn Rate */}
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Monthly Burn Rate:</label>
                                <textarea name="monthly_burn_rate" value={formData.monthly_burn_rate} onChange={handleInputChange} className={formElementBaseClass} 
                                    // --- UPDATED Placeholder ---
                                    placeholder="Approximate monthly operating expenses." 
                                    rows={3}/>
                            </div>

                        </div>
                        {/* Submit Button */}
                        <button type="submit" disabled={loading} className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" >
                            {loading ? ( <span className="flex items-center justify-center"> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> {reportStatus === 'processing' ? 'Processing Report...' : 'Generating Report...'} </span> ) : ( 'Generate Report' )}
                        </button>
                    </form>
                </div>

                {/* Error Display */}
                {error && ( <div className="border border-red-600/50 bg-red-900/20 p-4 mb-8 text-red-400 text-center rounded-lg"> {error} </div> )}

                {/* Loading Display */}
                {loading && reportId && ( <div className="border border-blue-600/50 bg-blue-900/20 p-4 mb-8 text-blue-400 text-center rounded-lg"> <p>Your report is being generated...</p><p className="text-xs mt-2">Status: {reportStatus || 'Initializing'}</p> </div> )}

                {/* Result Display */}
                {result && <StoryDisplay result={result} />} 
            </div>
             {/* Correct prop name based on error message */}
             <WorkflowHistoryDrawer onSelectHistory={handleSelectHistory} /> 
        </div>
    ); 
} 

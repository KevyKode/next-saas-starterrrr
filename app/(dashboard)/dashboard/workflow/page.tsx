// app/(dashboard)/dashboard/workflow/page.tsx
"use client";
import { useState } from 'react';
import StoryDisplay from '@/components/ai-tutor-api/StoryDisplay';
import Link from 'next/link';
import { WorkflowHistoryDrawer } from '@/components/workflow/WorkflowHistoryDrawer';

export default function Workflow() {
    // State management for all form fields
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
        setError('');
        setLoading(true);
        setResult(null);

        const options = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer sk_wzsb34sr3o3xdtw13ga1e2ciea52fnyy',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        };

        try {
            const response = await fetch('https://aitutor-api.vercel.app/api/v1/run/wf_z17kkxc4nnupcimdpk6zi4zm', options);
            const data = await response.json();

            if (response.ok) {
                setResult(data);
                setError('');
            } else {
                setError(data.error || 'An error occurred while processing your request.');
            }
        } catch (err) {
            setError('An error occurred while processing your request.');
        } finally {
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

                            {/* Target Audience */}
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Target Audience:
                                </label>
                                <textarea
                                    name="target_audience"
                                    value={formData.target_audience}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Who are the people or businesses experiencing this problem??"
                                />
                            </div>

                            {/* Current Solutions */}
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Current Solutions:
                                </label>
                                <textarea
                                    name="current_solutions"
                                    value={formData.current_solutions}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="How are you currently solving the problem?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Product Stage:
                                </label>
                                <textarea
                                    name="product_stage"
                                    value={formData.product_stage}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="What stage is your product in? (Idea, Prototype, MVP, Beta, Launched)"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Frustration Cost:
                                </label>
                                <textarea
                                    name="frustration_cost"
                                    value={formData.frustration_cost}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="What’s the biggest frustration or cost associated with this problem?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Problem Frequency:
                                </label>
                                <select
                                    name="problem_frequency"
                                    value={formData.problem_frequency}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    >
                                        <option value="" disabled hidden>Select</option>
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Seasonally">Seasonally</option>
                                        <option value="Occasionally">Occasionally</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Customer Location:
                                </label>
                                <select
                                    name="customer_location"
                                    value={formData.customer_location}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                >
                                    <option value="" disabled hidden>Select</option>
                                    <option value="Local">Local</option>
                                    <option value="National">National</option>
                                    <option value="Global">Global</option>
                                   
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Customer Feedback:
                                </label>
                                <textarea
                                    name="customer_feedback"
                                    value={formData.customer_feedback}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Have you spoken to potential customers about this problem? What did they say?"
                                />
                            </div>

                        
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Ideal Customer:
                                </label>
                                <textarea
                                    name="ideal_customer_description"
                                    value={formData.ideal_customer_description}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Who is your ideal customer? Describe them."
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Industry Sector:
                                </label>
                                <textarea
                                    name="industry_sector"
                                    value={formData.industry_sector}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="What industry or sector is your business in?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Price Range:
                                </label>
                                <textarea
                                    name="willingness_to_pay"
                                    value={formData.willingness_to_pay}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="How much do you think they would be willing to pay for a solution?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Existing Competitors:
                                </label>
                                <textarea
                                    name="existing_competitors"
                                    value={formData.existing_competitors}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Are there existing companies trying to solve this problem? If so, name a few."
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Market Trends:
                                </label>
                                <textarea
                                    name="market_trends"
                                    value={formData.market_trends}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="What recent trends suggest this market is growing?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Revenue Model:
                                </label>
                                <textarea
                                    name="revenue_model"
                                    value={formData.revenue_model}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="How do you plan to make money? (e.g., subscription, one-time purchase, marketplace fees)"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Pricing Feedback:
                                </label>
                                <textarea
                                    name="pricing_feedback"
                                    value={formData.pricing_feedback}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Have you tested pricing with potential customers? What was their feedback?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Customer Acquistion:
                                </label>
                                <textarea
                                    name="customer_acquisition_strategy"
                                    value={formData.customer_acquisition_strategy}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="How will you acquire your first 100 customers?(If you already have 100+ customers, explain how you got them.)"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Purchase Frequency:
                                </label>
                                <textarea
                                    name="purchase_frequency_expectation"
                                    value={formData.purchase_frequency_expectation}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Do you expect customers to buy repeatedly or just once?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Current Users:
                                </label>
                                <textarea
                                    name="current_users_count"
                                    value={formData.current_users_count}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="If launched, how many users/customers do you currently have?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Early User Feedback:
                                </label>
                                <textarea
                                    name="early_user_feedback"
                                    value={formData.early_user_feedback}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="What feedback have you received from early users?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Product Improvements:
                                </label>
                                <textarea
                                    name="product_improvements"
                                    value={formData.product_improvements}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Have you made any product improvements based on user feedback?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Top Competitors:
                                </label>
                                <textarea
                                    name="top_competitors"
                                    value={formData.top_competitors}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Who are your top competitors (if any)?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Your X Factor:
                                </label>
                                <textarea
                                    name="differentiation_strategy"
                                    value={formData.differentiation_strategy}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="How is your approach different or better than competitors?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Intellectual Property:
                                </label>
                                <textarea
                                    name="intellectual_property"
                                    value={formData.intellectual_property}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Do you have any intellectual property (IP), unique technology, or a competitive moat?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Funding Status:
                                </label>
                                <textarea
                                    name="funding_status"
                                    value={formData.funding_status}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="Have you raised any outside funding? (Yes/No) If yes, how much and from whom?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Operational Funds:
                                </label>
                                <textarea
                                    name="operational_funds"
                                    value={formData.operational_funds}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-lg bg-white/50 border border-purple-200"
                                    placeholder="How much money do you currently have to operate your start-up?"
                                />
                            </div>
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
                                    Generating...
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

                {result && <StoryDisplay result={result} />}
            </div>
        </div>
    );
}
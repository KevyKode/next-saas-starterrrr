// File: lib/tiers.tsx  (Note the .tsx extension)
"use client"; // Add if icons might need client context, safer

import React from "react"; // Import React for JSX
import { Sparkles, Star, Pencil } from "lucide-react";

// Define the structure for a tier (This is the single source of truth now)
export interface Tier {
    id: string; 
    name: string;
    icon: React.ReactNode;
    priceMonthly: number | null; 
    reportLimit: number | string; 
    description: string; 
    features: string[];
    popular?: boolean; 
    priceId?: string; 
}

// Define the actual tiers
export const tiers: Tier[] = [
    {
        id: 'free',
        name: 'Free',
        icon: <Pencil className="w-6 h-6" />, // JSX is now allowed
        priceMonthly: null,
        reportLimit: 1, 
        description: 'Test the waters with basic analysis.',
        features: [
            '1 Report per month',
            'Standard AI model',
            'Community access',
        ],
        popular: false,
        priceId: undefined, 
    },
    {
        id: 'founder',
        name: 'Founder',
        icon: <Star className="w-6 h-6" />, // JSX is now allowed
        priceMonthly: 19, 
        reportLimit: 7, 
        description: 'For active founders & early-stage teams.',
        features: [
            '7 Reports per month',
            'Standard AI model',
            'Priority community access',
            'Basic chat support', 
        ],
        popular: true, 
        priceId: process.env.NEXT_PUBLIC_STRIPE_FOUNDER_PRICE_ID || 'price_founder_replace_me', 
    },
    {
        id: 'pro',
        name: 'Pro / Consultant',
        icon: <Sparkles className="w-6 h-6" />, // JSX is now allowed
        priceMonthly: 59, 
        reportLimit: "Unlimited", 
        description: 'For consultants, agencies & power users.',
        features: [
            'Unlimited Reports*', 
            'Priority AI model access', 
            'Advanced chat features', 
            'Priority support',
        ],
        popular: false,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_replace_me',
    },
];

// Helper function remains the same
export function getTierById(id: string): Tier | undefined {
    return tiers.find(tier => tier.id === id);
}

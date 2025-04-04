// File: lib/tiers.tsx 
// --- MODIFIED: Removed "use client" ---
// "use client"; // REMOVED

import React from "react"; 
import { Sparkles, Star, Pencil } from "lucide-react";

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

export const tiers: Tier[] = [
    {
        id: 'free',
        name: 'Free',
        icon: <Pencil className="w-6 h-6" />, 
        priceMonthly: null,
        reportLimit: "Unlimited", 
        description: 'Test the waters with basic analysis.',
        features: [ '1 Report per month', 'Standard AI model', 'Community access' ],
        popular: false,
        priceId: undefined, 
    },
    {
        id: 'founder',
        name: 'Founder',
        icon: <Star className="w-6 h-6" />, 
        priceMonthly: 19, 
        reportLimit: 7, 
        description: 'For active founders & early-stage teams.',
        features: [ '7 Reports per month', 'Standard AI model', 'Priority community access', 'Basic chat support' ],
        popular: true, 
        priceId: process.env.NEXT_PUBLIC_STRIPE_FOUNDER_PRICE_ID || 'price_founder_replace_me', 
    },
    {
        id: 'pro',
        name: 'Pro / Consultant',
        icon: <Sparkles className="w-6 h-6" />, 
        priceMonthly: 59, 
        reportLimit: "Unlimited", 
        description: 'For consultants, agencies & power users.',
        features: [ 'Unlimited Reports*', 'Priority AI model access', 'Advanced chat features', 'Priority support' ],
        popular: false,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_replace_me',
    },
];

export function getTierById(id: string): Tier | undefined {
    return tiers.find(tier => tier.id === id);
}

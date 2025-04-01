// File: app/(front)/pricing/page.tsx

import { checkoutAction } from '@/lib/payments/actions'; 
import { Check, Sparkles, Star, Pencil } from 'lucide-react'; 
import { tiers, type Tier } from '@/lib/tiers'; 
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link"; 

export const revalidate = 3600; 

export default async function PricingPage() { 
    const pricingTiers: Tier[] = Array.isArray(tiers) ? tiers : []; 
    
    // --- ADD CONSOLE LOG ---
    console.log("--- Rendering Pricing Page ---");
    console.log("Imported tiers data:", JSON.stringify(pricingTiers, null, 2)); 
    // --- END CONSOLE LOG ---

    if (!Array.isArray(tiers)) {
        console.error("PricingPage Error: Imported 'tiers' is not an array!", tiers);
    }

    return ( 
        <div className="w-full bg-gray-950 text-white"> 
            <div className="container mx-auto max-w-7xl relative z-10 py-20 md:py-28"> 
                <div className="flex text-center justify-center items-center gap-4 flex-col">
                    {/* Heading Section */}
                    <div className="flex gap-2 flex-col mb-8">
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-itt-gradient"> 
                            Choose Your Plan
                        </h2>
                        <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                            Select the perfect plan for your needs with the Innovator Tool Suite
                        </p>
                    </div>
                    
                    {/* Grid Section */}
                    <div className="grid pt-8 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
                        {/* Map through tiers */}
                        {pricingTiers.length > 0 ? ( // Check if array has items before mapping
                          pricingTiers.map((tier) => ( 
                            <div key={tier.id} className="relative"> 
                                {tier.popular && ( /* ... Popular tag ... */ )}
                                <PricingCard
                                    tier={tier}
                                    isFreeTier={tier.priceMonthly === null} 
                                />
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 col-span-3">No pricing plans available at the moment.</p> // Fallback message
                        )}
                    </div>
                </div>
            </div>
        </div>
    ); 
} 

// --- PricingCard Component ---
function PricingCard({ /* ...props... */ }: { tier: Tier; isFreeTier?: boolean; }) {
    // ... PricingCard implementation ...
    const {id, name, icon, priceMonthly, description, features, popular, priceId, reportLimit} = tier; 
    const cardBg = popular ? 'bg-gray-900' : 'bg-gray-950/60'; 
    const cardBorder = popular ? 'border-purple-600' : 'border-gray-700/50';
    const cardShadow = popular ? 'shadow-[0_10px_30px_-10px_rgba(110,59,255,0.2)]' : 'shadow-md shadow-black/20';
    const iconBg = popular ? 'bg-purple-600/20' : 'bg-purple-600/10'; 
    const iconColor = 'text-purple-400'; 
    const checkBg = 'bg-purple-600/15'; 
    const checkColor = 'text-purple-400'; 
    const buttonStyle = popular ? { background: 'linear-gradient(to right, var(--itt-purple, #6e3bff), var(--itt-silver, #8A95A5))' } : {};
    const buttonHover = popular ? 'hover:shadow-lg hover:shadow-purple-500/30' : 'hover:bg-purple-600/20';

    return ( <div className={cn("relative flex flex-col h-full ...", cardBg, cardBorder, cardShadow)}> {/* ... Card Content ... */} </div> ); 
} 


// File: app/(front)/pricing/page.tsx
// --- COMPLETE FILE WITH ALL CORRECTIONS ---

import { checkoutAction } from '@/lib/payments/actions'; 
import { Check, Sparkles, Star, Pencil } from 'lucide-react'; 
import { tiers, type Tier } from '@/lib/tiers'; // Import without .tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link"; 
import React from 'react'; 

// --- PricingCard Component Definition (Defined Correctly Outside PricingPage) ---
function PricingCard({
    tier, // The prop name is 'tier'
    isFreeTier = false,
}: {
    tier: Tier; // The type annotation for the 'tier' prop
    isFreeTier?: boolean;
}) {
    // Destructure properties from the 'tier' prop object
    const {id, name, icon, priceMonthly, description, features, popular, priceId, reportLimit} = tier; 
    
    // Define styles 
    const cardBg = popular ? 'bg-gray-900' : 'bg-gray-950/60'; 
    const cardBorder = popular ? 'border-purple-600' : 'border-gray-700/50';
    const cardShadow = popular ? 'shadow-[0_10px_30px_-10px_rgba(110,59,255,0.2)]' : 'shadow-md shadow-black/20';
    const iconBg = popular ? 'bg-purple-600/20' : 'bg-purple-600/10'; 
    const iconColor = 'text-purple-400'; 
    const checkBg = 'bg-purple-600/15'; 
    const checkColor = 'text-purple-400'; 
    const buttonStyle = popular 
        ? { background: 'linear-gradient(to right, var(--itt-purple, #6e3bff), var(--itt-silver, #8A95A5))' } 
        : {};
    const buttonHover = popular ? 'hover:shadow-lg hover:shadow-purple-500/30' : 'hover:bg-purple-600/20';

    return ( // Start of PricingCard return
        <div className={cn(
            "relative flex flex-col h-full overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300", 
            cardBg,
            cardBorder,
            cardShadow
        )}>
            <div className="p-8 flex flex-col flex-grow"> 
                {/* Render the icon passed in the tier object */}
                <div className={cn("w-12 h-12 rounded-full mb-4 flex items-center justify-center shrink-0", iconBg)}> 
                    <div className={iconColor}>{icon}</div> 
                </div> 
                
                <h3 className="text-xl font-bold text-white mb-1"> 
                    {name}
                </h3>
                <p className="text-gray-400 mb-5 text-sm"> 
                    {reportLimit === -1 || reportLimit === "Unlimited" ? "Unlimited Reports" : `${reportLimit} Reports / month`}
                </p>
                
                <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                        ${priceMonthly ?? 0} 
                    </span>
                    {priceMonthly !== null && priceMonthly > 0 ? (
                        <span className="text-gray-400 ml-1">
                            /month
                        </span>
                    ) : null}
                </div>
                
                <div className="space-y-3 mb-8 flex-grow"> 
                    {/* Safety check for features array */}
                    {Array.isArray(features) ? features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3" >
                            <div className={cn("rounded-full p-0.5", checkBg)}> 
                                <Check className={cn("w-3.5 h-3.5", checkColor)} /> 
                            </div>
                            <span className="text-gray-300 text-sm">
                                {feature}
                            </span>
                        </div>
                    )) : <p className="text-sm text-red-400">Features not available.</p>} 
                </div>
                
                <div className="mt-auto"> 
                    {!isFreeTier && ( 
                      <form action={checkoutAction}> 
                        <input type="hidden" name="priceId" value={priceId!} />
                        <Button type="submit" className={cn("w-full text-white transition-all duration-300", buttonHover)} style={buttonStyle}>Get Started</Button>
                      </form> 
                    )}
                    {isFreeTier && ( 
                      <Button asChild variant="outline" className="w-full text-gray-300 border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 hover:text-white transition-all duration-300"> 
                        <Link href="/sign-up"> Try Now </Link> 
                      </Button> 
                    )}
                </div>
            </div>
        </div>
    ); // End of PricingCard return
} // End of PricingCard function

// --- Main Page Component Definition ---
export const revalidate = 3600; 

export default async function PricingPage() { // START OF PricingPage FUNCTION
    // Assign tiers, default to empty array if import fails
    const pricingTiers: Tier[] = Array.isArray(tiers) ? tiers : []; 
    
    // Log if tiers didn't load as array (for debugging)
    if (!Array.isArray(tiers)) {
        console.error("PricingPage Warning: Imported 'tiers' is not an array! Rendering fallback.", tiers);
    }

    // Ensure nothing else is between the variable assignments and the return statement
    
    return ( // START OF PricingPage RETURN STATEMENT
        <div className="w-full bg-gray-950 text-white"> 
            <div className="container mx-auto max-w-7xl relative z-10 py-20 md:py-28"> 
                <div className="flex text-center justify-center items-center gap-4 flex-col">
                    {/* Heading Section */}
                    <div className="flex gap-2 flex-col mb-8">
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-itt-gradient"> 
                            Get Started Today!
                        </h2>
                        <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                            Select the perfect plan for your needs with the Innovator Suite
                        </p>
                    </div>
                    
                    {/* Grid Section */}
                    <div className="grid pt-8 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
                        {pricingTiers.length > 0 ? ( 
                          pricingTiers.map((tier) => ( // 'tier' is correctly scoped here
                            <div key={tier.id} className="relative"> 
                                {/* Correct conditional rendering for Popular tag */}
                                {tier.popular && ( 
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                                        <span className="px-4 py-1 text-xs font-medium text-white rounded-full shadow-lg"
                                             style={{ 
                                                 background: 'linear-gradient(to right, var(--itt-purple), var(--itt-silver))',
                                                 boxShadow: '0 4px 6px rgba(110, 59, 255, 0.2)'
                                             }}>
                                            Popular!
                                        </span>
                                    </div>
                                )} 
                                {/* End Correct conditional rendering */}
                                <PricingCard
                                    tier={tier} // Pass the 'tier' object from the map
                                    isFreeTier={tier.priceMonthly === null} 
                                />
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 col-span-3">No pricing plans available at the moment.</p> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    ); // END OF PricingPage RETURN STATEMENT
} // END OF PricingPage FUNCTION

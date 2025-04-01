// File: app/(front)/pricing/page.tsx
// --- THIS IS THE COMPLETE AND CORRECTED CONTENT ---

import { checkoutAction } from '@/lib/payments/actions'; 
import { Check, Sparkles, Star, Pencil } from 'lucide-react'; // Combine icon imports
import { tiers, type Tier } from '@/lib/tiers'; // Use .tsx extension and import Tier
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Import Link

// Revalidation setting (optional)
export const revalidate = 3600; 

// Main Page Component Definition
export default async function PricingPage() { 
    // Use the imported tiers data
    const pricingTiers: Tier[] = tiers; 

    // Ensure the return statement is correct
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
                        {/* Map through all tiers */}
                        {pricingTiers.map((tier) => ( 
                            <div key={tier.id} className="relative"> 
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
                                {/* Render the PricingCard component */}
                                <PricingCard
                                    tier={tier}
                                    isFreeTier={tier.priceMonthly === null} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ); // End of return statement
} // End of PricingPage function

// --- PricingCard Component (Helper within this file) ---
// Make sure this function definition is OUTSIDE the PricingPage function
function PricingCard({
    tier,
    isFreeTier = false,
}: {
    tier: Tier; 
    isFreeTier?: boolean;
}) {
    const {id, name, icon, priceMonthly, description, features, popular, priceId, reportLimit} = tier; 
    
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

    return (
        <div className={cn(
            "relative flex flex-col h-full overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300", 
            cardBg,
            cardBorder,
            cardShadow
        )}>
            <div className="p-8 flex flex-col flex-grow"> 
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
                    {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3" >
                            <div className={cn("rounded-full p-0.5", checkBg)}> 
                                <Check className={cn("w-3.5 h-3.5", checkColor)} /> 
                            </div>
                            <span className="text-gray-300 text-sm">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>
                
                <div className="mt-auto"> 
                    {!isFreeTier && (
                        <form action={checkoutAction}>
                            <input type="hidden" name="priceId" value={priceId!} />
                            <Button 
                                type="submit" // Ensure type is submit for form
                                className={cn("w-full text-white transition-all duration-300", buttonHover)}
                                style={buttonStyle}
                            >
                                Get Started
                            </Button>
                        </form>
                    )}
                    
                    {isFreeTier && (
                         <Button 
                            asChild // Add asChild
                            variant="outline" 
                            className="w-full text-gray-300 border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
                        >
                            {/* Wrap with Link */}
                            <Link href="/sign-up"> 
                                Try Now
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    ); // End of PricingCard return
} // End of PricingCard function

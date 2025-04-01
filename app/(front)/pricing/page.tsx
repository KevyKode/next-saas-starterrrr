// File: app/(front)/pricing/page.tsx
import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { tiers } from '@/lib/tiers';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Star, Pencil } from "lucide-react";

interface PricingTier {
    name: string;
    icon: React.ReactNode;
    price: number | null;
    description: string;
    features: string[];
    popular?: boolean;
    color: string; // Keep color if used for other styling, otherwise can remove
    priceId?: string;
    messageLimit: number;
    isFreeTier?: boolean;
}

export const revalidate = 3600;

export default async function PricingPage() {
    const pricingTiers: PricingTier[] = tiers.map((tier) => ({
        name: tier.name,
        icon: tier.id === 'free' ? <Pencil className="w-6 h-6" /> : (tier.id === 'starter' ? <Star className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />),
        price: tier.priceMonthly,
        description: tier.description,
        features: tier.features,
        popular: tier.id === 'starter',
        color: tier.id === 'free' ? 'blue' : (tier.id === 'starter' ? 'amber' : 'blue'),
        priceId: tier.priceId,
        messageLimit: tier.messageLimit
    }));

    return (
        // --- MODIFIED LINE ---
        // Changed py-20 to pt-20 (removed bottom padding)
        // Replaced style with className bg-gray-950 for consistency
        <div className="w-full pt-20 bg-gray-950 text-white"> 
            {/* Removed min-h-screen as it might interfere with layout flow to footer */}
            {/* Removed fixed cosmic background effects - assuming these are handled globally or by hero */}
            {/* If you NEED the blur effects here, they need careful positioning */}
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex text-center justify-center items-center gap-4 flex-col">
                    <div className="flex gap-2 flex-col mb-8">
                        {/* Assuming text-itt-gradient is defined in your globals.css or tailwind config */}
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-itt-gradient"> 
                            Choose Your Plan
                        </h2>
                        <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                            Select the perfect plan for your needs with the Innovator Tool Suite
                        </p>
                    </div>
                    
                    <div className="grid pt-8 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
                        {/* Free Tier First */}
                        {pricingTiers.filter(tier => tier.price === null).map((tier, idx) => (
                            <div key={tier.name}>
                                <PricingCard
                                    tier={tier}
                                    isFreeTier
                                />
                            </div>
                        ))}

                        {/* Paid Tiers */}
                        {pricingTiers.filter(tier => tier.price !== null).map((tier, index) => (
                            <div key={tier.name} className="relative">
                                {tier.popular && (
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                                        {/* Assuming --itt-purple and --itt-silver are defined CSS variables */}
                                        <span className="px-4 py-1 text-xs font-medium text-white rounded-full shadow-lg"
                                             style={{ 
                                                 background: 'linear-gradient(to right, var(--itt-purple), var(--itt-silver))',
                                                 boxShadow: '0 4px 6px rgba(110, 59, 255, 0.2)'
                                             }}>
                                            Popular!
                                        </span>
                                    </div>
                                )}
                                <PricingCard
                                    tier={tier}
                                    index={index} // Pass index if needed by PricingCard
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- PricingCard Component (Modified for dark theme consistency) ---
function PricingCard({
    tier,
    isFreeTier = false,
    index = 0 // Keep index if needed
}: {
    tier: PricingTier;
    isFreeTier?: boolean;
    index?: number;
}) {
    const {name, icon, price, description, features, popular, color, priceId, messageLimit} = tier;
    
    // Define card styles based on props for better readability
    const cardBg = popular ? 'bg-gray-900' : 'bg-gray-950/60'; // Slightly different bg for popular
    const cardBorder = popular ? 'border-purple-600' : 'border-gray-700/50';
    const cardShadow = popular ? 'shadow-[0_10px_30px_-10px_rgba(110,59,255,0.2)]' : 'shadow-md shadow-black/20';
    const iconBg = popular ? 'bg-purple-600/20' : 'bg-purple-600/10';
    const iconColor = 'text-purple-400'; // Consistent purple icon color
    const checkBg = 'bg-purple-600/15';
    const checkColor = 'text-purple-400';
    const buttonStyle = popular 
        ? { background: 'linear-gradient(to right, var(--itt-purple, #6e3bff), var(--itt-silver, #8A95A5))' } // Define fallbacks
        : {};
    const buttonHover = popular ? 'hover:shadow-lg hover:shadow-purple-500/30' : 'hover:bg-purple-600/20';

    return (
        <div className={cn(
            "relative h-full overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300",
            cardBg,
            cardBorder,
            cardShadow
        )}>
            <div className="p-8">
                <div className={cn("w-12 h-12 rounded-full mb-4 flex items-center justify-center", iconBg)}>
                    <div className={iconColor}>{icon}</div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">
                    {name}
                </h3>
                <p className="text-gray-400 mb-5 text-sm"> {/* Made description smaller */}
                    {messageLimit === -1 ? "Unlimited messages" : `${messageLimit} messages per month`}
                </p>
                
                {/* Price */}
                <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                        ${price ?? 0}
                    </span>
                    {price !== null && price > 0 ? (
                        <span className="text-gray-400 ml-1">
                            /month
                        </span>
                    ) : null}
                </div>
                
                <div className="space-y-3 mb-8"> {/* Reduced space */}
                    {features.map((feature) => (
                        <div
                            key={feature}
                            className="flex items-center gap-3"
                        >
                            <div className={cn("rounded-full p-0.5", checkBg)}> {/* Smaller check bg */}
                                <Check className={cn("w-3.5 h-3.5", checkColor)} /> {/* Smaller check */}
                            </div>
                            <span className="text-gray-300 text-sm">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>
                
                {!isFreeTier && (
                    <form action={checkoutAction}>
                        <input type="hidden" name="priceId" value={priceId!} />
                        <Button 
                            className={cn("w-full text-white transition-all duration-300", buttonHover)}
                            style={buttonStyle}
                        >
                            Get Started
                        </Button>
                    </form>
                )}
                
                {isFreeTier && (
                    <Button 
                        variant="outline" 
                        className="w-full text-gray-300 border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
                    >
                        Try Now
                    </Button>
                )}
            </div>
        </div>
    );
}

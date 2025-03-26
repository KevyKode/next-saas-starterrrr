// pricing/page.tsx
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
    color: string;
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
        <div className="w-full py-20 min-h-screen" style={{ backgroundColor: 'var(--itt-dark)' }}>
            {/* Cosmic background effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full" 
                     style={{ backgroundColor: 'rgba(110, 59, 255, 0.1)', filter: 'blur(120px)' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full" 
                     style={{ backgroundColor: 'rgba(110, 59, 255, 0.05)', filter: 'blur(120px)' }}></div>
            </div>
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex text-center justify-center items-center gap-4 flex-col">
                    <div className="flex gap-2 flex-col mb-8">
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-itt-gradient">
                            Choose Your Plan
                        </h2>
                        <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                            Select the perfect plan for your needs with our Innovator Tool Suite
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
                                    index={index}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PricingCard({
    tier,
    isFreeTier = false,
    index = 0
}: {
    tier: PricingTier;
    isFreeTier?: boolean;
    index?: number;
}) {
    const {name, icon, price, description, features, popular, color, priceId, messageLimit} = tier;
    
    return (
        <div className="relative h-full">
            <div className="overflow-hidden rounded-xl border h-full"
                 style={{
                     backgroundColor: popular ? 'var(--itt-card-active)' : 'var(--itt-card-bg)',
                     borderColor: popular ? 'rgba(110, 59, 255, 0.3)' : '#333333',
                     boxShadow: popular ? '0 10px 15px -3px rgba(110, 59, 255, 0.1)' : 'none'
                 }}>
                <div className="p-8">
                    <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                         style={{ backgroundColor: popular ? 'rgba(110, 59, 255, 0.2)' : 'rgba(110, 59, 255, 0.1)' }}>
                        <div style={{ color: 'var(--itt-purple)' }}>{icon}</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-1">
                        {name}
                    </h3>
                    <p className="text-gray-400 mb-5">
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
                    
                    <div className="space-y-4 mb-8">
                        {features.map((feature) => (
                            <div
                                key={feature}
                                className="flex items-center gap-3"
                            >
                                <div className="rounded-full p-1" style={{ backgroundColor: 'rgba(110, 59, 255, 0.1)' }}>
                                    <Check className="w-4 h-4" style={{ color: 'var(--itt-purple)' }} />
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
                                className="w-full text-white hover:shadow-lg transition-all duration-300"
                                style={{ 
                                    background: 'linear-gradient(to right, var(--itt-purple), var(--itt-silver))',
                                    boxShadow: popular ? '0 4px 6px rgba(110, 59, 255, 0.2)' : 'none'
                                }}
                            >
                                Get Started
                            </Button>
                        </form>
                    )}
                    
                    {isFreeTier && (
                        <Button 
                            variant="outline" 
                            className="w-full text-white hover:bg-opacity-10 transition-all duration-300"
                            style={{ 
                                borderColor: '#333333', 
                                backgroundColor: 'rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            Try Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
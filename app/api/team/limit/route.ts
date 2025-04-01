// File: app/api/team/limit/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { teams, type User } from '@/lib/db/schema'; 
import { eq } from 'drizzle-orm';
import { getUser, getUserWithTeam } from '@/lib/db/queries'; 
import { tiers, type Tier } from '@/lib/tiers'; // Correct import path

export async function GET() {
  // --- ADD CONSOLE LOG ---
  console.log('Imported tiers type:', typeof tiers);
  console.log('Imported tiers value:', tiers);
  // --- END CONSOLE LOG ---

  try {
    const user = await getUser(); 

    if (!user) {
      console.log("API /team/limit: No authenticated user found.");
      // --- MODIFIED: Use find directly on imported tiers ---
      const freeTier = Array.isArray(tiers) ? tiers.find(t => t.id === 'free') : undefined;
      // --- End Modification ---
      const freeLimit = freeTier?.reportLimit ?? 1;
      return NextResponse.json({ 
        limit: freeLimit === "Unlimited" ? -1 : freeLimit, 
        count: 0, 
        tier: freeTier?.name ?? 'Free' 
      }); 
    }
    
    const userWithTeam = await getUserWithTeam(user.id); 

    if (!userWithTeam || !userWithTeam.teamId) {
      console.log(`API /team/limit: User ${user.id} found, but no team association.`);
      // --- MODIFIED: Use find directly on imported tiers ---
      const freeTier = Array.isArray(tiers) ? tiers.find(t => t.id === 'free') : undefined;
      // --- End Modification ---
      const freeLimit = freeTier?.reportLimit ?? 1;
      return NextResponse.json({ 
        limit: freeLimit === "Unlimited" ? -1 : freeLimit, 
        count: 0, 
        tier: freeTier?.name ?? 'Free' 
      }); 
    }

    const [team] = await db
      .select({
        currentMessages: teams.currentMessages,
        stripeProductId: teams.stripeProductId, 
        stripeSubscriptionId: teams.stripeSubscriptionId,
      })
      .from(teams)
      .where(eq(teams.id, userWithTeam.teamId))
      .limit(1);

    if (!team) {
       console.warn(`API /team/limit: Team ${userWithTeam.teamId} not found in DB for user ${user.id}.`);
       // --- MODIFIED: Use find directly on imported tiers ---
       const freeTier = Array.isArray(tiers) ? tiers.find(t => t.id === 'free') : undefined;
       // --- End Modification ---
       const freeLimit = freeTier?.reportLimit ?? 1;
       return NextResponse.json({ 
         limit: freeLimit === "Unlimited" ? -1 : freeLimit, 
         count: 0, 
         tier: freeTier?.name ?? 'Free' 
       });
    }

    let subscriptionTier: Tier | undefined;
    let tierName = "Free"; 

    if (team.stripeSubscriptionId && team.stripeProductId) {
      // --- MODIFIED: Use find directly on imported tiers ---
      subscriptionTier = Array.isArray(tiers) ? tiers.find(t => t.priceId === team.stripeProductId) : undefined;
      // --- End Modification ---
      
      if (subscriptionTier) {
        tierName = subscriptionTier.name;
      } else {
         console.warn(`Stripe Product ID ${team.stripeProductId} for team ${userWithTeam.teamId} not found in defined tiers. Defaulting to Free.`);
         // --- MODIFIED: Use find directly on imported tiers ---
         subscriptionTier = Array.isArray(tiers) ? tiers.find(t => t.id === 'free') : undefined; 
         // --- End Modification ---
         tierName = subscriptionTier?.name ?? "Free"; 
      }
    } else {
      // --- MODIFIED: Use find directly on imported tiers ---
      subscriptionTier = Array.isArray(tiers) ? tiers.find(t => t.id === 'free') : undefined;
      // --- End Modification ---
      tierName = subscriptionTier?.name ?? "Free";
    }

    const limit = subscriptionTier?.reportLimit ?? 1; 
    const count = team.currentMessages ?? 0;

    return NextResponse.json({ 
      limit: limit === "Unlimited" ? -1 : limit, 
      count, 
      tier: tierName 
    });

  } catch (error) {
    console.error("API /team/limit Error:", error);
    // --- MODIFIED: Use find directly on imported tiers ---
    const freeTier = Array.isArray(tiers) ? tiers.find(t => t.id === 'free') : undefined;
    // --- End Modification ---
    const freeLimit = freeTier?.reportLimit ?? 1;
    return NextResponse.json({ 
      limit: freeLimit === "Unlimited" ? -1 : freeLimit, 
      count: 0, 
      tier: 'Error' 
    }, { status: 500 });
  }
}

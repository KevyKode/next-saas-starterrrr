// File: app/api/team/limit/route.ts
// --- Replace entire file content with this ---

import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { teams } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserWithTeam } from '@/lib/db/queries';
// Ensure this import path and extension are correct for your project structure
import { tiers, type Tier } from '@/lib/tiers.tsx'; 

export async function GET() {
  try {
    const userWithTeam = await getUserWithTeam();

    // Default to free tier limits if no team or user found
    if (!userWithTeam || !userWithTeam.teamId) {
      const freeTier = tiers.find(t => t.id === 'free');
      const freeLimit = freeTier?.reportLimit ?? 1;
      return NextResponse.json({ 
        limit: freeLimit === "Unlimited" ? -1 : freeLimit, 
        count: 0, 
        tier: freeTier?.name ?? 'Free' 
      }); 
    }

    // Fetch team data from the database
    const [team] = await db
      .select({
        currentMessages: teams.currentMessages,
        stripeProductId: teams.stripeProductId, // This ID from your DB must match a priceId in tiers.tsx
        stripeSubscriptionId: teams.stripeSubscriptionId,
      })
      .from(teams)
      .where(eq(teams.id, userWithTeam.teamId))
      .limit(1);

    // Default to free tier if team not found in DB (shouldn't usually happen)
    if (!team) {
       const freeTier = tiers.find(t => t.id === 'free');
       const freeLimit = freeTier?.reportLimit ?? 1;
       return NextResponse.json({ 
         limit: freeLimit === "Unlimited" ? -1 : freeLimit, 
         count: 0, 
         tier: freeTier?.name ?? 'Free' 
       });
    }

    let subscriptionTier: Tier | undefined;
    let tierName = "Free"; // Default tier name

    // Check if the team has an active subscription based on DB fields
    if (team.stripeSubscriptionId && team.stripeProductId) {
      // --- THIS IS THE KEY CHANGE ---
      // Find the matching tier using priceId from tiers.tsx and stripeProductId from DB
      subscriptionTier = tiers.find(t => t.priceId === team.stripeProductId); 
      // --- End Key Change ---
      
      if (subscriptionTier) {
        tierName = subscriptionTier.name;
      } else {
         // If stripeProductId from DB doesn't match any known priceId, log warning and default to Free
         console.warn(`Stripe Product ID ${team.stripeProductId} for team ${userWithTeam.teamId} not found in defined tiers. Defaulting to Free.`);
         subscriptionTier = tiers.find(t => t.id === 'free'); // Fallback to free tier object
         tierName = subscriptionTier?.name ?? "Free"; // Use Free tier name
      }
    } else {
      // If no Stripe IDs in DB, explicitly find the free tier
      subscriptionTier = tiers.find(t => t.id === 'free');
      tierName = subscriptionTier?.name ?? "Free";
    }

    // Determine the limit based on the found tier or default to free tier limit
    // Use 1 as a fallback if even the free tier definition is somehow missing
    const limit = subscriptionTier?.reportLimit ?? 1; 
    const count = team.currentMessages ?? 0;

    // Return the limit (-1 for "Unlimited"), current count, and tier name
    return NextResponse.json({ 
      limit: limit === "Unlimited" ? -1 : limit, 
      count, 
      tier: tierName 
    });

  } catch (error) {
    console.error("Error fetching team limit:", error);
    // Return a default/error state in case of unexpected errors
    const freeTier = tiers.find(t => t.id === 'free');
    const freeLimit = freeTier?.reportLimit ?? 1;
    return NextResponse.json({ 
      limit: freeLimit === "Unlimited" ? -1 : freeLimit, 
      count: 0, 
      tier: 'Error' 
    }, { status: 500 });
  }
}

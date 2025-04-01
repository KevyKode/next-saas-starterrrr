// File: lib/db/utils.ts
import { db } from './drizzle';
import { teams, Team } from './schema';
import { eq, sql, desc } from 'drizzle-orm';
import { tiers, type Tier } from '@/lib/tiers'; // Use correct path without extension
import { workflowHistory, NewWorkflowHistory } from './schema';

export async function checkMessageLimit( // Consider renaming to checkReportLimit
  teamId: number
): Promise<{ withinLimit: boolean; remainingMessages: number | string }> { 
  
  const teamResult = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);

  if (teamResult.length === 0) {
    console.error(`Team not found for ID: ${teamId} in checkMessageLimit`);
    return { withinLimit: false, remainingMessages: 0 }; 
  }

  const currentTeam: Team = teamResult[0];
  let reportLimitFromTier: number | string; // Get the limit from the tier definition
  let tierName = "Free"; 

  const freeTier = tiers.find(t => t.id === 'free');
  const defaultLimit = freeTier?.reportLimit ?? 1; // Default limit from free tier or 1

  if (currentTeam.stripeSubscriptionId && currentTeam.stripeProductId) {
    const matchedTier: Tier | undefined = tiers.find(
      (t) => t.priceId === currentTeam.stripeProductId 
    );
    
    if (matchedTier) {
      reportLimitFromTier = matchedTier.reportLimit; 
      tierName = matchedTier.name;
      console.log(`Team ${teamId} matched to tier: ${tierName} with limit: ${reportLimitFromTier}`);
    } else {
      console.warn(`Team ${teamId} has Stripe IDs but no matching tier found for priceId ${currentTeam.stripeProductId}. Defaulting to Free tier limit.`);
      reportLimitFromTier = defaultLimit;
      tierName = freeTier?.name ?? "Free";
    }
  } else {
    reportLimitFromTier = defaultLimit;
    tierName = freeTier?.name ?? "Free";
    console.log(`Team ${teamId} has no active subscription. Applying Free tier limit: ${reportLimitFromTier}`);
  }

  const currentMessages = currentTeam.currentMessages ?? 0; 

  // --- MODIFIED: Handle "Unlimited" and calculate remaining ---
  if (reportLimitFromTier === "Unlimited" || reportLimitFromTier === -1) {
    // If the tier limit is unlimited, they are always within limit
    return { withinLimit: true, remainingMessages: "Unlimited" };
  } else {
    // If the limit is a number, perform the calculation
    const numericLimit = Number(reportLimitFromTier); // Ensure it's treated as a number
    if (isNaN(numericLimit)) {
        // Handle cases where reportLimit might be an unexpected string
        console.error(`Invalid numeric reportLimit found for team ${teamId}: ${reportLimitFromTier}. Defaulting to 0 remaining.`);
        return { withinLimit: false, remainingMessages: 0 };
    }
    const remainingMessages = numericLimit - currentMessages;
    const withinLimit = remainingMessages > 0;
    return { withinLimit, remainingMessages };
  }
  // --- End Modification ---
}

// Function to increment a team's message count.
export async function incrementMessageCount(teamId: number, count: number = 1): Promise<void> {
  console.log(`Incrementing message count for team ${teamId} by ${count}`);
  await db.update(teams)
    .set({
      currentMessages: sql`${teams.currentMessages} + ${count}`, 
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
}

// Function to save workflow history
export async function saveWorkflowHistory(
  teamId: number,
  userId: number,
  input: string,
  output: string
): Promise<void> {
  const newHistory: NewWorkflowHistory = {
    teamId,
    userId,
    input,
    output,
    createdAt: new Date(),
  };
  
  await db.insert(workflowHistory).values(newHistory);
  console.log(`Saved workflow history for team ${teamId}, user ${userId}`);
}

// Function to get workflow history for a team
export async function getWorkflowHistory(
  teamId: number,
  limit: number = 10
) {
  console.log(`Fetching workflow history for team ${teamId}, limit ${limit}`);
  return db.select({
    id: workflowHistory.id,
    input: workflowHistory.input,
    output: workflowHistory.output,
    createdAt: workflowHistory.createdAt,
    userId: workflowHistory.userId,
  })
  .from(workflowHistory)
  .where(eq(workflowHistory.teamId, teamId))
  .orderBy(desc(workflowHistory.createdAt))
  .limit(limit);
}

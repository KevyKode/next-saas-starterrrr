// File: lib/db/utils.ts
import { db } from './drizzle';
import { teams, Team } from './schema';
import { eq, sql, desc } from 'drizzle-orm';
// --- MODIFIED: Import path and Tier type ---
import { tiers, type Tier } from '@/lib/tiers'; // Use correct path without extension
import { workflowHistory, NewWorkflowHistory } from './schema';

// This function checks the monthly report limit for a team.
export async function checkMessageLimit( // Consider renaming to checkReportLimit for clarity
  teamId: number
): Promise<{ withinLimit: boolean; remainingMessages: number | string }> { // Allow string for "Unlimited"
  
  const teamResult = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);

  if (teamResult.length === 0) {
    // Or handle appropriately, maybe return a specific error state
    console.error(`Team not found for ID: ${teamId} in checkMessageLimit`);
    return { withinLimit: false, remainingMessages: 0 }; 
  }

  const currentTeam: Team = teamResult[0];
  let reportLimit: number | string; // Use the correct property name and type
  let tierName = "Free"; // Keep track of tier name

  // Find the free tier definition first for default values
  const freeTier = tiers.find(t => t.id === 'free');
  const defaultLimit = freeTier?.reportLimit ?? 1; // Default limit from free tier or 1

  if (currentTeam.stripeSubscriptionId && currentTeam.stripeProductId) {
    // Look for a matching tier based on the stored stripeProductId matching priceId
    const matchedTier: Tier | undefined = tiers.find(
      // --- MODIFIED: Use priceId ---
      (t) => t.priceId === currentTeam.stripeProductId 
    );
    
    if (matchedTier) {
      // --- MODIFIED: Use reportLimit ---
      reportLimit = matchedTier.reportLimit; 
      tierName = matchedTier.name;
      console.log(`Team ${teamId} matched to tier: ${tierName} with limit: ${reportLimit}`);
    } else {
      // If no matching paid tier found, default to free tier limit
      console.warn(`Team ${teamId} has Stripe IDs but no matching tier found for priceId ${currentTeam.stripeProductId}. Defaulting to Free tier limit.`);
      reportLimit = defaultLimit;
      tierName = freeTier?.name ?? "Free";
    }
  } else {
    // No active subscription—apply free plan limit
    reportLimit = defaultLimit;
    tierName = freeTier?.name ?? "Free";
    console.log(`Team ${teamId} has no active subscription. Applying Free tier limit: ${reportLimit}`);
  }

  const currentMessages = currentTeam.currentMessages ?? 0; // Use currentMessages from DB

  // Handle "Unlimited" case
  if (reportLimit === "Unlimited" || reportLimit === -1) {
    return { withinLimit: true, remainingMessages: "Unlimited" };
  }

  // Calculate remaining for numeric limits
  const remainingMessages = reportLimit - currentMessages;
  const withinLimit = remainingMessages > 0;

  return { withinLimit, remainingMessages };
}

// Function to increment a team's message count.
export async function incrementMessageCount(teamId: number, count: number = 1): Promise<void> {
  console.log(`Incrementing message count for team ${teamId} by ${count}`);
  await db.update(teams)
    .set({
      // Use sql helper for safe incrementation
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


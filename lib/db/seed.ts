// lib/db/seed.ts
import { stripe } from '../payments/stripe'; 
import { db } from './drizzle';
// --- MODIFIED: Added 'eq' import ---
import { eq } from 'drizzle-orm'; 
import { users, teams, teamMembers } from './schema';
import { hashPassword } from '@/lib/auth/session'; 
import { tiers } from '@/lib/tiers'; 

async function createStripeProductsAndPrices() {
    // ... (Stripe logic remains the same) ...
    console.log('Creating/Verifying Stripe products and prices...');

    for (const tier of tiers) {
        if (tier.priceMonthly !== null && tier.priceId?.startsWith('price_')) { 
            let product;
            console.log(`Processing tier: ${tier.name}`);

            const existingProducts = await stripe.products.list({ active: true });
            const existingProduct = existingProducts.data.find(p => p.name === tier.name);

            if(existingProduct){
                product = existingProduct;
                console.log(`Product ${tier.name} found with ID: ${product.id}`);
            } else {
                console.log(`Creating product ${tier.name}...`);
                product = await stripe.products.create({
                    name: tier.name,
                    description: tier.description,
                });
                console.log(`Product ${tier.name} created with ID: ${product.id}`);
            }

            const existingPrices = await stripe.prices.list({
                product: product.id,
                active: true,
            });

            const targetAmount = tier.priceMonthly! * 100; 
            const existingPrice = existingPrices.data.find(p => p.unit_amount === targetAmount && p.recurring?.interval === 'month');

            if(existingPrice){
                console.log(`Price for ${tier.name} ($${tier.priceMonthly}/month) found with ID: ${existingPrice.id}`);
                tier.priceId = existingPrice.id; 
            } else {
                console.log(`Creating price for ${tier.name} ($${tier.priceMonthly}/month)...`);
                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: targetAmount, 
                    currency: 'usd',
                    recurring: { interval: 'month' },
                });
                console.log(`Price for ${tier.name} created with ID: ${price.id}`);
                tier.priceId = price.id;
            }
            console.log(`Tier ${tier.name} using Price ID: ${tier.priceId}`);
        } else if (tier.priceMonthly !== null) {
             console.log(`Tier ${tier.name} already has a non-placeholder Price ID: ${tier.priceId}. Skipping Stripe creation.`);
        } else {
             console.log(`Tier ${tier.name} is free. Skipping Stripe creation.`);
        }
    }
    console.log('Stripe products and prices verified/created.');
}


async function seed() {
  const email = 'test@test.com';
  const password = 'admin123'; 
  
  const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  let userIdToUse: number;

  if (existingUser) {
    console.log(`User ${email} already exists.`);
    userIdToUse = existingUser.id;
  } else {
    console.log(`Creating user ${email}...`);
    const passwordHash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values([ { email: email, passwordHash: passwordHash, role: "owner" } ])
      .returning();
    userIdToUse = newUser.id;
    console.log(`User ${email} created with ID: ${userIdToUse}.`);

    const freeTier = tiers.find(t => t.id === 'free');
    if (!freeTier) {
        throw new Error("Free tier definition not found in tiers.tsx");
    }

    // --- MODIFIED: Ensure value passed to DB is number ---
    // Explicitly check the type before assignment
    let limitForDb: number;
    if (typeof freeTier.reportLimit === 'string' && freeTier.reportLimit.toLowerCase() === 'unlimited') {
        limitForDb = -1; // Use -1 for unlimited
    } else if (typeof freeTier.reportLimit === 'number') {
        limitForDb = freeTier.reportLimit;
    } else {
        console.warn(`Invalid reportLimit found for free tier: ${freeTier.reportLimit}. Defaulting to 1.`);
        limitForDb = 1; // Fallback default
    }
    // --- End Modification ---

    console.log(`Creating team for user ${userIdToUse}...`);
    const [team] = await db
      .insert(teams)
      .values({
        name: `${email}'s Team`, 
        // --- MODIFIED: Use the explicitly typed number ---
        messageLimit: limitForDb, 
        // --- End Modification ---
        currentMessages: 0, 
      })
      .returning();
    console.log(`Team created with ID: ${team.id}.`);

    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: userIdToUse,
      role: 'owner',
    });
    console.log(`Team member association created.`);
  }

  await createStripeProductsAndPrices(); 
}

seed()
  .then(() => {
    console.log('Seed process finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  });

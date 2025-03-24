import { numeric } from "ponder";
import { ponder } from "ponder:registry";
import { mints, transfers, burns , wallet , totalSupply } from "ponder:schema";

ponder.on("WhitelistedMintableToken:Mint" as any, async ({ event, context }) => {
  const { to, amount } = event.args;

  await context.db.insert(mints).values({
    id: event.transaction.hash,
    to,
    amount: amount.toString(),
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
  });

  // Update wallet balance
  await context.db
    .insert(wallet)
    .values({
      id: to,
      balance: amount.toString(),
    })
    .onConflictDoUpdate((row) => ({
      balance: (BigInt(row.balance as string) + amount).toString(),
    }));
  await context.db
    .insert(totalSupply)
    .values({
      id: "totalSupply",
      totalSupply: amount.toString(),
    })
    .onConflictDoUpdate((row) => ({
      totalSupply: (BigInt(row.totalSupply as string) + amount).toString(),
    }));
});

// Transfer event
ponder.on("WhitelistedMintableToken:Transfer" as any, async ({ event, context }) => {
  const { from, to, value } = event.args;
  if (from !== "0x0000000000000000000000000000000000000000" || to !== "0x0000000000000000000000000000000000000000"){
  await context.db.insert(transfers).values({
    id: event.transaction.hash,
    from,
    to,
    amount: value.toString(),
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
  })};

  if (from !== "0x0000000000000000000000000000000000000000" || to !== "0x0000000000000000000000000000000000000000") {
  await context.db
    .insert(wallet)
    .values({
      id: from,
      balance: "0",
    })
    .onConflictDoUpdate((row) => ({
      balance: (BigInt(row.balance as string) - value > 0n ? BigInt(row.balance as string) - value : 0n).toString(),
    }));

  // Add balance to receiver
  await context.db
    .insert(wallet)
    .values({
      id: to,
      balance: value.toString(),
    })
    .onConflictDoUpdate((row) => ({
      balance: (BigInt(row.balance as string) + value).toString(),
    }));
}});

// Burn event
ponder.on("WhitelistedMintableToken:Burn" as any, async ({ event, context }) => {
  const { from, amount } = event.args;

  await context.db.insert(burns).values({
    id: event.transaction.hash,
    from,
    amount: amount.toString(),
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
  });

  // Deduct burned amount from sender
  await context.db
    .insert(wallet)
    .values({
      id: from,
      balance: "0",
    })
    .onConflictDoUpdate((row) => ({
      balance: (BigInt(row.balance as string) - amount > 0n ? BigInt(row.balance as string) - amount : 0n).toString(),
    }));
  
  // Deduct burned amount from total supply
  await context.db
    .insert(totalSupply)
    .values({
      id: "totalSupply",
      totalSupply: "0",
    })
    .onConflictDoUpdate((row) => ({
      totalSupply: (BigInt(row.totalSupply as string) - amount > 0n ? BigInt(row.totalSupply as string) - amount : 0n).toString(),
    }));
});


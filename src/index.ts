import { numeric } from "ponder";
import { ponder } from "ponder:registry";
import { mints, transfers, burns , wallet , totalSupply } from "ponder:schema";

// Mint Event
ponder.on("WhitelistedMintableToken:Mint" as any, async ({ event, context }) => {
  const { to, amount } = event.args;
  const newTimestamp = BigInt(event.block.timestamp);

  // Fetch the last known timestamp for minting
  const walletData = await context.db.find(wallet , {id : to});
  const lastTimestamp = walletData ? BigInt(walletData.timestampForMint || 0n) : 0n;

  if (newTimestamp <= lastTimestamp) {
    console.log(`Skipping mint for ${to} as it's an old transaction.`);
    return;
  }

  // Insert new mint transaction
  await context.db.insert(mints).values({
    id: event.transaction.hash,
    to,
    amount: amount.toString(),
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
  });

  // Update wallet balance & timestamp
  await context.db.insert(wallet)
    .values({ id: to, balance: amount.toString(), timestampForMint: newTimestamp })
    .onConflictDoUpdate((row) => ({
      balance: (BigInt(row.balance as string) + amount).toString(),
      timestampForMint: newTimestamp
    }));

  // Update total supply
  await context.db.insert(totalSupply)
    .values({ id: "totalSupply", totalSupply: amount.toString() })
    .onConflictDoUpdate((row) => ({
      totalSupply: (BigInt(row.totalSupply as string) + amount).toString(),
    }));
});

// Transfer Event
ponder.on("WhitelistedMintableToken:Transfer" as any, async ({ event, context }) => {
  const { from, to, value } = event.args;

  if (from !== "0x0000000000000000000000000000000000000000" && to !== "0x0000000000000000000000000000000000000000") {
    await context.db.insert(transfers).values({
      id: event.transaction.hash,
      from,
      to,
      amount: value.toString(),
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
    });

    await context.db.insert(wallet)
      .values({ id: from, balance: "0" })
      .onConflictDoUpdate((row) => ({
        balance: (BigInt(row.balance as string) - value > 0n ? BigInt(row.balance as string) - value : 0n).toString(),
      }));

    await context.db.insert(wallet)
      .values({ id: to, balance: value.toString() })
      .onConflictDoUpdate((row) => ({
        balance: (BigInt(row.balance as string) + value).toString(),
      }));
  }
});

// Burn Event
ponder.on("WhitelistedMintableToken:Burn" as any, async ({ event, context }) => {
  const { from, amount } = event.args;
  const newTimestamp = BigInt(event.block.timestamp);

  // Fetch last burn timestamp
  const walletData = await context.db.find(wallet , {id : from});
  const lastTimestamp = walletData ? BigInt(walletData.timestampForBurn || 0n) : 0n;

  if (newTimestamp <= lastTimestamp) {
    console.log(`Skipping burn for ${from} as it's an old transaction.`);
    return;
  }

  // Insert burn transaction
  await context.db.insert(burns).values({
    id: event.transaction.hash,
    from,
    amount: amount.toString(),
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
  });

  // Deduct burned amount from sender
  await context.db.insert(wallet)
    .values({ id: from, balance: "0" })
    .onConflictDoUpdate((row) => ({
      balance: (BigInt(row.balance as string) - amount > 0n ? BigInt(row.balance as string) - amount : 0n).toString(),
      timestampForBurn: newTimestamp
    }));

  // Deduct burned amount from total supply (ensuring it doesn't go negative)
  await context.db.insert(totalSupply)
    .values({ id: "totalSupply", totalSupply: "0" })
    .onConflictDoUpdate((row) => ({
      totalSupply: (BigInt(row.totalSupply as string) - amount >= 0n ? BigInt(row.totalSupply as string) - amount : 0n).toString(),
    }));
});

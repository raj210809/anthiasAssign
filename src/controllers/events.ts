import { timeStamp } from "console";
import {mints, transfers, burns , wallet , totalSupply , alerts} from "ponder:schema";

export const mintEvents = async ({ event, context }) => {
  const { to, amount } = event.args;
  const newTimestamp = BigInt(event.block.timestamp);

  const walletData = await context.db.find(wallet , {id : to});
  const lastTimestamp = walletData ? BigInt(walletData.timestampForMint || 0n) : 0n;

  if (newTimestamp <= lastTimestamp) {
    console.log(`Skipping mint for ${to} as it's an old transaction.`);
    return;
  }

  if (amount >= 100000) {
    await context.db.insert(alerts).values({
      id: event.transaction.hash,
      address: to,
      amount: amount.toString(),
      timeStamp : event.block.timestamp
    });
  }

  await context.db.insert(mints).values({
    id: event.transaction.hash,
    to,
    amount: amount.toString(),
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
  });

  await context.db.insert(wallet)
    .values({ id: to, balance: amount.toString(), timestampForMint: newTimestamp })
    .onConflictDoUpdate((row) => ({
      balance: (BigInt(row.balance as string) + amount).toString(),
      timestampForMint: newTimestamp
    }));

  await context.db.insert(totalSupply)
    .values({ id: "totalSupply", totalSupply: amount.toString() })
    .onConflictDoUpdate((row) => ({
      totalSupply: (BigInt(row.totalSupply as string) + amount).toString(),
    }));
}

export const transferevents = async ({ event, context }) => {
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
}

export const burnEvents = async ({ event, context }) => {
  const { from, amount } = event.args;
  const newTimestamp = BigInt(event.block.timestamp);

  const walletData = await context.db.find(wallet , {id : from});
  const lastTimestamp = walletData ? BigInt(walletData.timestampForBurn || 0n) : 0n;

  if (newTimestamp <= lastTimestamp) {
    console.log(`Skipping burn for ${from} as it's an old transaction.`);
    return;
  }

  await context.db.insert(burns).values({
    id: event.transaction.hash,
    from,
    amount: amount.toString(),
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
  });

  await context.db.insert(wallet)
    .values({ id: from, balance: "0" })
    .onConflictDoUpdate((row) => ({
      balance: (BigInt(row.balance as string) - amount > 0n ? BigInt(row.balance as string) - amount : 0n).toString(),
      timestampForBurn: newTimestamp
    }));

  await context.db.insert(totalSupply)
    .values({ id: "totalSupply", totalSupply: "0" })
    .onConflictDoUpdate((row) => ({
      totalSupply: (BigInt(row.totalSupply as string) - amount >= 0n ? BigInt(row.totalSupply as string) - amount : 0n).toString(),
    }));
}
import { time } from "console";
import { onchainTable } from "ponder";

// Table for Mint events
export const mints = onchainTable("mints", (t) => ({
  id: t.text().primaryKey(),  // Transaction hash as primary key
  to: t.text(),               // Recipient of the minted tokens
  amount: t.text(),           // Minted amount
  blockNumber: t.integer(),   // Block number
  timestamp: t.integer(),     // Timestamp of the block
}));

// Table for Transfer events
export const transfers = onchainTable("transfers", (t) => ({
  id: t.text().primaryKey(),  // Transaction hash
  from: t.text(),             // Sender of tokens
  to: t.text(),               // Recipient of tokens
  amount: t.text(),           // Amount transferred
  blockNumber: t.integer(),   // Block number
  timestamp: t.integer(),     // Timestamp of the block
}));

// Table for Burn events
export const burns = onchainTable("burns", (t) => ({
  id: t.text().primaryKey(),  // Transaction hash
  from: t.text(),             // Address burning the tokens
  amount: t.text(),           // Amount burned
  blockNumber: t.integer(),   // Block number
  timestamp: t.integer(),     // Timestamp of the block
}));

export const wallet = onchainTable("wallet", (t) => ({
  id : t.text().primaryKey(),
  timestampForMint : t.bigint(),
  timestampForBurn : t.bigint(),
  balance : t.text(),
}));

export const alerts = onchainTable("alerts", (t) => ({
  id : t.text().primaryKey(),
  address : t.text(),
  amount : t.text(),
  timestamp : t.integer(),
}))

export const totalSupply = onchainTable("totalSupply", (t) => ({
  id : t.text().primaryKey(),
  totalSupply : t.text(),
}));

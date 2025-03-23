import { ponder } from "ponder:registry";
import { mints, transfers, burns } from "ponder:schema";

ponder.on("WhitelistedMintableToken:Mint" , async ({ event, context }) => {
  await context.db.insert(mints).values({
    id: event.transaction.hash,
    to: event.args.to,
    amount: event.args.amount.toString(),
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
  });
});

ponder.on(
  "WhitelistedMintableToken:Transfer" as any,
  async ({ event , context }) => {
    await context.db.insert(transfers).values({
      id: event.transaction.hash,
      from: event.args.from,
      to: event.args.to,
      amount: event.args.value.toString(),
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
    });
  }
);

ponder.on(
  "WhitelistedMintableToken:Burn" as any,
  async ({ event, context }) => {
    await context.db.insert(burns).values({
      id: event.transaction.hash,
      from: event.args.from,
      amount: event.args.amount.toString(),
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
    });
  }
);

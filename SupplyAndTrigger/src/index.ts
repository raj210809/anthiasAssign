import { aggregateBalances } from "./aggregator";

async function main() {
  await aggregateBalances();
}

main().catch(console.error);
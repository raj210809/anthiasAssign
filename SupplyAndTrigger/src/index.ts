import { aggregateBalances } from "./aggregator";
import {checkAlerts} from "./trigger"
import { getHoldersAndBalances } from "./controllers/holdersAndBalances";

async function main() {
//   await aggregateBalances();
//     await checkAlerts();
    await getHoldersAndBalances();
}

main().catch(console.error);
import { ponder } from "ponder:registry";
import {burnEvents, mintEvents , transferevents} from "./controllers/events"

ponder.on("WhitelistedMintableToken:Mint" as any,mintEvents );

ponder.on("WhitelistedMintableToken:Transfer" as any, transferevents);

ponder.on("WhitelistedMintableToken:Burn" as any, burnEvents);

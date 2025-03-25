import { supabase } from "./utils/supabaseClient";
import dotenv from "dotenv";

dotenv.config();

const ALERT_HOLDER_PERCENTAGE = Number(process.env.ALERT_HOLDER_PERCENTAGE);
const ALERT_SUPPLY_THRESHOLD = Number(process.env.ALERT_SUPPLY_THRESHOLD);
const TIMEFRAME_MINUTES = Number(process.env.TIMEFRAME_MINUTES);
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS!;

/**
 * Checks for alerts and logs them.
 */
export async function checkAlerts() {
  console.log("🔔 Checking alerts...");

  // Fetch total supply
  const { data: supplyData } = await supabase
    .from("balances")
    .select("balance")
    .eq("token", TOKEN_ADDRESS);

  const totalSupply = supplyData?.reduce((sum, { balance }) => sum + balance, 0) || 0;

  // Alert: Large holder
  const { data: largeHolders } = await supabase
    .from("balances")
    .select("address, balance")
    .eq("token", TOKEN_ADDRESS);

  largeHolders?.forEach(({ address, balance }) => {
    if ((balance / totalSupply) * 100 > ALERT_HOLDER_PERCENTAGE) {
      console.warn(`🚨 Alert: Address ${address} holds more than ${ALERT_HOLDER_PERCENTAGE}% of total supply!`);
    }
  });

  // Alert: Minting spike
  const timeframeAgo = new Date(Date.now() - TIMEFRAME_MINUTES * 60000).toISOString();
  const { data: recentMints } = await supabase
    .from("mints")
    .select("amount")
    .gte("timestamp", timeframeAgo);

  const mintedInTimeframe = recentMints?.reduce((sum, { amount }) => sum + Number(amount), 0) || 0;

  if (mintedInTimeframe > ALERT_SUPPLY_THRESHOLD) {
    console.warn(`🚨 Alert: Minted more than ${ALERT_SUPPLY_THRESHOLD} tokens in last ${TIMEFRAME_MINUTES} minutes!`);
  }
}

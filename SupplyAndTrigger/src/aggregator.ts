import { supabase } from "./utils/supabaseClient";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS!;

/**
 * Aggregates token balances and computes total supply.
 */
export async function aggregateBalances() {
  console.log(`🔄 Aggregating balances for token: ${TOKEN_ADDRESS}`);

  // Fetch mint, transfer, and burn events
  const { data: mints } = await supabase.from("mints").select("*");
  const { data: transfers } = await supabase.from("transfers").select("*");
  const { data: burns } = await supabase.from("burns").select("*");

  const balances: Record<string, number> = {};
  let totalSupply = 0;

  // Process mints
  mints?.forEach(({ to, amount }) => {
    balances[to] = (balances[to] || 0) + Number(amount);
    totalSupply += Number(amount);
  });

  // Process transfers
  transfers?.forEach(({ from, to, amount }) => {
    balances[from] = (balances[from] || 0) - Number(amount);
    balances[to] = (balances[to] || 0) + Number(amount);
  });

  // Process burns
  burns?.forEach(({ from, amount }) => {
    balances[from] = (balances[from] || 0) - Number(amount);
    totalSupply -= Number(amount);
  });

  // Store aggregated balances in Supabase
  await supabase.from("balances").delete().match({ token: TOKEN_ADDRESS });

  for (const [address, balance] of Object.entries(balances)) {
    await supabase.from("balances").insert({
      token: TOKEN_ADDRESS,
      address,
      balance,
    });
  }

  console.log(`✅ Aggregation complete: Total supply = ${totalSupply}`);
}

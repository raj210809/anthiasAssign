import { supabase } from "../utils/supabaseClient";
import { Request, Response } from "express";

export async function getTriggersAndAlerts(req: Request, res: Response) {
  try {
    const { data: wallet } = await supabase.from("wallet").select("*");
    let { data: totalSupply, error } = await supabase.from("totalSupply").select("*");
    
    let fullSupply: string = "0";
    if (error || !totalSupply || totalSupply.length === 0) {
      console.error("Error fetching totalSupply or data is empty:", error);
    } else {
      fullSupply = totalSupply[0]?.total_supply as string ?? "0"; // Fallback to "0" if undefined
    }

    let triggersAndAlerts: any = [];
    wallet?.forEach((balance) => {
      if (Number.parseInt(balance.balance) > Number.parseInt(fullSupply) * 0.2) {
        triggersAndAlerts.push({
          address: balance.id,
          balance: balance.balance,
          alert: "Balance is greater than 20% of the total supply",
        });
      }
    });

    const now = Math.floor(Date.now() / 1000);
    const last24Hours = now - 24 * 60 * 60;

    const { data: mints } = await supabase
      .from("mints")
      .select("amount, timestamp")
      .gte("timestamp", last24Hours)
      .lte("timestamp", now);

    if (!mints || mints.length === 0) {
      console.log("No mints in the last 24 hours");
      triggersAndAlerts.push({
        totalMinted: BigInt(0).toString(),
        alert: "No mints in the last 24 hours",
      });

      // **Immediately return the response**
      return res.status(200).json({ triggersAndAlerts });
    } else {
      let totalMinted = mints.reduce((acc, mint) => acc + BigInt(mint.amount), BigInt(0));
      const totalMintedString = totalMinted.toString();

      if (totalMinted > BigInt(1000000)) {
        triggersAndAlerts.push({
          totalMintedString,
          alert: "Total minted in the last 24 hours exceeds 1,000,000",
        });
      } else {
        triggersAndAlerts.push({
          totalMintedString,
          alert: "Total minted in the last 24 hours is less than 1,000,000",
        });
      }
      return res.status(200).json({ triggersAndAlerts });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
  }
}

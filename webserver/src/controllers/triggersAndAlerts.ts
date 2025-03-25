import { supabase } from "../utils/supabaseClient";
import { Request, Response } from "express";

export async function getTriggersAndAlerts(req: Request, res: Response) {
  try {
      let triggersAndAlerts: any[] = [];

      const { data: wallets, error: walletError } = await supabase.from("wallet").select("*");
      if (walletError) {
          console.error("Error fetching wallets:", walletError.message);
          return res.status(500).json({ message: "Error fetching wallet data", error: walletError.message });
      }

      const { data: totalSupplyData, error: totalSupplyError } = await supabase.from("totalSupply").select("*");
      let fullSupply: string = "0";

      if (totalSupplyError) {
          console.error("Error fetching totalSupply:", totalSupplyError.message);
      } else if (totalSupplyData && totalSupplyData.length > 0) {
          fullSupply = totalSupplyData[0]?.total_supply as string ?? "0";
      }

      const alertHolderPercentage = Number(process.env.ALERT_HOLDER_PERCENTAGE);
      if (isNaN(alertHolderPercentage)) {
          return res.status(500).json({ message: "ALERT_HOLDER_PERCENTAGE is not defined or invalid" });
      }

      wallets?.forEach((wallet) => {
          if (parseInt(wallet.balance) > parseInt(fullSupply) * (alertHolderPercentage / 100)) {
              triggersAndAlerts.push({
                  address: wallet.id,
                  balance: wallet.balance,
                  alert: `Balance is greater than ${alertHolderPercentage}% of the total supply`,
              });
          }
      });

      const now = Math.floor(Date.now() / 1000);
      const last24Hours = now - 24 * 60 * 60;

      const { data: mints, error: mintsError } = await supabase
          .from("mints")
          .select("amount, timestamp")
          .gte("timestamp", last24Hours)
          .lte("timestamp", now);

      if (mintsError) {
          console.error("Error fetching mints:", mintsError.message);
          return res.status(500).json({ message: "Error fetching mint data", error: mintsError.message });
      }

      if (!mints || mints.length === 0) {
          triggersAndAlerts.push({
              totalMinted: "0",
              alert: "No mints in the last 24 hours",
          });
      } else {
          let totalMinted = mints.reduce((acc, mint) => acc + BigInt(mint.amount), BigInt(0));
          const totalMintedString = totalMinted.toString();

          // Ensure ALERT_SUPPLY_THRESHOLD is defined
          const alertSupplyThreshold = Number(process.env.ALERT_SUPPLY_THRESHOLD);
          if (isNaN(alertSupplyThreshold)) {
              return res.status(500).json({ message: "ALERT_SUPPLY_THRESHOLD is not defined or invalid" });
          }

          if (totalMinted > BigInt(alertSupplyThreshold)) {
              triggersAndAlerts.push({
                  totalMinted: totalMintedString,
                  alert: `Total minted in the last 24 hours exceeds ${alertSupplyThreshold}`,
              });
          } else {
              triggersAndAlerts.push({
                  totalMinted: totalMintedString,
                  alert: `Total minted in the last 24 hours is less than ${alertSupplyThreshold}`,
              });
          }
      }

      return res.status(200).json({ triggersAndAlerts });

  } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: (error as Error).message });
  }
}

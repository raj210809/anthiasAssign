import {supabase} from "../utils/supabaseClient"
import {Request , Response} from "express"

export async function getHoldersAndBalances(req: Request, res: Response) {
  try {
      const { data: wallets, error } = await supabase.from("wallet").select("*");

      if (error) {
          console.error("Supabase query error:", error.message);
          return res.status(500).json({ message: "Database query failed", error: error.message });
      }

      if (!wallets || wallets.length === 0) {
          return res.status(404).json({ message: "No wallet holders found" });
      }

      return res.status(200).json({ holders: wallets });

  } catch (error) {

      return res.status(500).json({ 
          message: "Internal Server Error", 
          error: (error as Error).message 
      });
  }
}
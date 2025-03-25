import {supabase} from "../utils/supabaseClient"
import {Request , Response} from "express"

export async function getTotalSupply(req: Request, res: Response) {
    try {
        const { data, error } = await supabase
            .from("totalSupply")
            .select("total_supply")
            .limit(1)
            .single(); // Ensures we only get one row

        if (error) {
            console.error("Database Error:", error.message);
            return res.status(500).json({ message: "Database query failed", error: error.message });
        }

        if (!data) {
            return res.status(404).json({ message: "Total supply data not found" });
        }

        const totalSupplyString = typeof data.total_supply === "string" ? data.total_supply : "0";

        return res.status(200).json({ totalSupply: totalSupplyString });

    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ message: "Internal Server Error", error: (err as Error).message });
    }
}
import {supabase} from "../utils/supabaseClient"
import {Request , Response} from "express"

export async function getTotalSupply (req: Request , res: Response) {
    try {
        const {data : wallet} = await supabase.from("wallet").select("*")
        let totalSupply = 0
        wallet?.forEach(({balance}) => {
            totalSupply += balance.balance
        })
        res.status(200).json(totalSupply)
    } catch (error) {
        res.status(500).json({message : "INTERNAL SERVER ERROR"})
    }
}
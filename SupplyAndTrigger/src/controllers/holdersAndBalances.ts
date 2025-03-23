import {supabase} from "../utils/supabaseClient"
import {Request , Response} from "express"

export async function getHoldersAndBalances(req : Request , res : Response) {
  try {
    const {data: wallet} = await supabase.from("wallet").select("*")
    res.status(200).json({holders : wallet})
  } catch (error) {
    res.status(500).json({message : "iNTERNAL SERVER ERROR"})
  }
}
import {Request , Response} from "express"
import {gql , request} from "graphql-request"

export async function getBalance (req: Request , res: Response) {
    const {id} = req.query
    try {
        const query = gql`
            query {
                wallet (id : "${id}") {
                    balance
                }
            }
        `
        const data = await request("http://localhost:42069/graphql" , query)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "INTERNAL SERVER ERROR"})
    }
}
import express from "express"

import {getTriggersAndAlerts} from "../controllers/triggersAndAlerts"
import {getHoldersAndBalances} from "../controllers/holdersAndBalances"
import {getTotalSupply} from "../controllers/aggregateSupply"
import {getBalance} from "../controllers/getbalance"

const router = express.Router()

router.get("/triggersAndAlerts" , getTriggersAndAlerts)
router.get("/holdersAndBalances" , getHoldersAndBalances)
router.get("/totalSupply" , getTotalSupply)
router.get("/balance" , getBalance)

export default router
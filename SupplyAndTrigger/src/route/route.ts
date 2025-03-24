import express from "express"

import {getTriggersAndAlerts} from "../controllers/triggersAndAlerts"
import {getHoldersAndBalances} from "../controllers/holdersAndBalances"
import {getTotalSupply} from "../controllers/aggregateSupply"

const router = express.Router()

router.get("/triggersAndAlerts" , getTriggersAndAlerts)
router.get("/holdersAndBalances" , getHoldersAndBalances)
router.get("/totalSupply" , getTotalSupply)

export default router
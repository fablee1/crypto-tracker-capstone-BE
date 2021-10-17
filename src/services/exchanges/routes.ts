import { Router } from "express"
import * as controllers from "./controllers"
import cache from "../../redis-cache"

const router = Router()

router.get("/", cache.route("exchanges", 1800), controllers.getExchanges)

export default router

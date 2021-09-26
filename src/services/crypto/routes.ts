import { Router } from "express"
import * as controllers from "./controllers"

const router = Router()

router.get("/:id/history", controllers.getHistory).get("/all", controllers.getAllCoins)

export default router

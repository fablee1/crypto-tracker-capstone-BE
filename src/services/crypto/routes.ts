import { Router } from "express"
import JWTAuthMiddleware from "../../../src/middlewares/jwtauth"
import * as controllers from "./controllers"

const router = Router()

router
  .get("/:id/history", controllers.getHistory)
  .get("/all", controllers.getAllCoins)
  .get("/myCoins", JWTAuthMiddleware, controllers.getMyCoins)
  .get("/market", JWTAuthMiddleware, controllers.getMarketStats)

export default router

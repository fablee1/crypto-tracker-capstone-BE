import { Router } from "express"
import JWTAuthMiddleware from "../../../src/middlewares/jwtauth"
import * as controllers from "./controllers"

const router = Router()

router
  .get("/:id/history", controllers.getHistory)
  .get("/all", controllers.getAllCoinsMin)
  .get("/full", controllers.getAllCoins)
  .get("/myCoins", JWTAuthMiddleware, controllers.getMyCoins)
  .get("/market", JWTAuthMiddleware, controllers.getMarketStats)
  .post("/favourites/:coinId", JWTAuthMiddleware, controllers.toggleFavourites)
  .get("/:id", JWTAuthMiddleware, controllers.getSingleCoin)

export default router

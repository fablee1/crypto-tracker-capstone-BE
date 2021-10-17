import { Router } from "express"
import cache from "../../redis-cache"
import JWTAuthMiddleware from "../../../src/middlewares/jwtauth"
import * as controllers from "./controllers"

const router = Router()

router
  .get("/:id/history", cache.route("coinHistory", 300), controllers.getHistory)
  .get("/all", cache.route("coinsMin", 30), controllers.getAllCoinsMin)
  .get("/full", cache.route("coinsFull", 30), controllers.getAllCoins)
  .get("/market", cache.route("market", 60), controllers.getMarketStats)
  .get("/myCoins", JWTAuthMiddleware, controllers.getMyCoins)
  .post("/favourites/:coinId", JWTAuthMiddleware, controllers.toggleFavourites)
  .get("/:id", JWTAuthMiddleware, controllers.getSingleCoin)

export default router

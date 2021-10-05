import { Router } from "express"
import JWTAuthMiddleware from "../../../src/middlewares/jwtauth"
import * as controllers from "./controllers"

const router = Router()

router
  .get("/:id/history", controllers.getHistory)
  .get("/all", controllers.getAllCoins)
  .get("/myCoins", JWTAuthMiddleware, controllers.getMyCoins)

export default router

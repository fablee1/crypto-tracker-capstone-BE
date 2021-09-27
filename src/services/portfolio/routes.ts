import { Router } from "express"
import JWTAuthMiddleware from "../../middlewares/jwtauth"
import * as controllers from "./controllers"

const router = Router()

router.post("/add", JWTAuthMiddleware, controllers.addAsset)

export default router

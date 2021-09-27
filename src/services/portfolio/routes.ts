import { Router } from "express"
import { userAvatarParser } from "../../settings/cloudinary"
import JWTAuthMiddleware from "../../middlewares/jwtauth"
import * as controllers from "./controllers"

const router = Router()

router.post("/")

export default router

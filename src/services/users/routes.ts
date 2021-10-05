import { Router } from "express"
import { userAvatarParser } from "../../settings/cloudinary"
import JWTAuthMiddleware from "../../middlewares/jwtauth"
import * as controllers from "./controllers"

const router = Router()

router
  .get("/me", JWTAuthMiddleware, controllers.getMe)
  .put("/me", JWTAuthMiddleware, controllers.editMe)
  .post(
    "/me/avatar",
    JWTAuthMiddleware,
    userAvatarParser.single("avatar"),
    controllers.changeMyProfileImage
  )
  .post("/me/favourites/:coinId", JWTAuthMiddleware, controllers.toggleFavourites)

export default router

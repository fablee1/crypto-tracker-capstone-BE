import { Router } from "express"
import * as controllers from "./controllers"
import cache from "../../redis-cache"

const router = Router()

router
  .get("/latest", cache.route("latestNews", 120), controllers.getLatest)
  .get("/popular", cache.route("popularNews", 120), controllers.getPopular)

export default router

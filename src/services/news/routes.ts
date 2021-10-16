import { Router } from "express"
import * as controllers from "./controllers"

const router = Router()

router.get("/latest", controllers.getLatest).get("/popular", controllers.getPopular)

export default router

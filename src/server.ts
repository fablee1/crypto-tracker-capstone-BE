// Packages
import express from "express"
import cors from "cors"
import morgan from "morgan"

// Routers
import usersRouter from "./services/users/routes"
import authRouter from "./services/auth/routes"

import { corsOptions } from "./settings/cors"
import cookieParser from "cookie-parser"
import { errorsMiddleware } from "./errorsMiddlewares"

const app = express()

// MIDDLEWARES
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(morgan("dev"))

// ENDPOINTS
app.use("/users", usersRouter)
app.use("/auth", authRouter)

// ERRORS MIDDLEWARE
app.use(errorsMiddleware)

export default app

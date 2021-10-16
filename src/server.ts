// Packages
import express from "express"
import cors from "cors"
import morgan from "morgan"

// Routers
import usersRouter from "./services/users/routes"
import authRouter from "./services/auth/routes"
import cryptoRouter from "./services/crypto/routes"
import portfolioRouter from "./services/portfolio/routes"
import exchangesRouter from "./services/exchanges/routes"
import newsRouter from "./services/news/routes"

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
app.use("/crypto", cryptoRouter)
app.use("/portfolio", portfolioRouter)
app.use("/exchanges", exchangesRouter)
app.use("/news", newsRouter)

// ERRORS MIDDLEWARE
app.use(errorsMiddleware)

export default app

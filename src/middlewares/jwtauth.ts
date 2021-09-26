import { TController } from "../typings/controllers"
import createError from "http-errors"
import { verifyJWT } from "../services/auth/tools"
import { JwtPayload } from "jsonwebtoken"
import userModel from "../models/userModel"

const JWTAuthMiddleware: TController = async (req, res, next) => {
  if (!req.cookies.accessToken)
    return next(createError(401, "Please provide credentials in cookies."))
  const token = req.cookies.accessToken
  try {
    const decodedToken = (await verifyJWT(token)) as JwtPayload
    const user = await userModel.findById(decodedToken._id)
    if (!user) return next(createError(404, "User not found."))
    req.user = user
    next()
  } catch (error) {
    next(createError(401, "Invalid token"))
  }
}

export default JWTAuthMiddleware

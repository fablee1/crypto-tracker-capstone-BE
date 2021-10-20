import createError from "http-errors"
import { TController } from "../../typings/controllers"
import { getTokens } from "../auth/tools"
import { refreshTokens } from "./tools"
import UserModel from "../../models/userModel"
import { Response } from "express"

const cookiesConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
}

const sendTokens = async (
  res: Response,
  tokens: { [key: string]: string | undefined }
) => {
  const tokenTypes = ["accessToken", "refreshToken"]
  tokenTypes.forEach((t) => res.cookie(t, tokens[t], cookiesConfig as any))
  res.sendStatus(204)
}

export const refresh: TController = async (req, res, next) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) return next(createError(400, "Refresh token must be provided!"))
  try {
    const tokens = await refreshTokens(refreshToken)
    if (!tokens) return next(createError(401, "Invalid token"))
    sendTokens(res, tokens)
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const registerUser: TController = async (req, res, next) => {
  const newUser = { ...req.body }
  try {
    newUser.avatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
    const user = await new UserModel(newUser).save()

    const tokens = await getTokens(user)
    await sendTokens(res, tokens)
  } catch (error) {
    next(createError(400, error as Error))
  }
}

export const loginUser: TController = async (req, res, next) => {
  const { login, password } = req.body
  try {
    const user = await UserModel.checkCredentials(login, password)
    if (!user) return next(createError(401, "Invalid credentials"))
    const tokens = await getTokens(user)
    sendTokens(res, tokens)
  } catch (error) {
    next(createError(500, error as Error))
  }
}

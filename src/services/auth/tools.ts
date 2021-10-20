import jwt, { JwtPayload } from "jsonwebtoken"
import { IJWTPayload } from "../../typings/jwt"
import { IUserDocument } from "../../typings/users"
import UserModel from "../../models/userModel"

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const JWT_SECRET = process.env.JWT_SECRET

const generateJWT = (payload: IJWTPayload, refresh: boolean = false) =>
  new Promise<string | undefined>((resolve, reject) =>
    jwt.sign(
      payload,
      refresh ? JWT_REFRESH_SECRET! : JWT_SECRET!,
      { expiresIn: refresh ? "2w" : "5m" },
      (err, token) => {
        if (err) reject(err)
        resolve(token)
      }
    )
  )

export const verifyJWT = (token: string, refresh: boolean = false) =>
  new Promise<JwtPayload | undefined>((resolve, reject) =>
    jwt.verify(
      token,
      refresh ? JWT_REFRESH_SECRET! : JWT_SECRET!,
      (err, decodedToken) => {
        if (err) reject(err)
        resolve(decodedToken)
      }
    )
  )

export const getTokens = async (user: IUserDocument) => {
  const accessToken = await generateJWT({ _id: user._id })
  const refreshToken = await generateJWT({ _id: user._id }, true)

  user.refreshToken = refreshToken
  await user.save()

  return { accessToken, refreshToken }
}

export const refreshTokens = async (currentRefreshToken: string) => {
  try {
    const decoded = await verifyJWT(currentRefreshToken, true)
    const user = await UserModel.findById(decoded?._id)
    if (!user) return null
    if (currentRefreshToken !== user.refreshToken) return null
    const { accessToken, refreshToken } = await getTokens(user)
    return { accessToken, refreshToken }
  } catch (error) {
    return null
  }
}

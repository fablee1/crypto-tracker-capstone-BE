// Packages
import createError from "http-errors"
import { TController } from "../../typings/controllers"

// Models
import { IUserDocument } from "../../typings/users"
import CryptoCurrencyModel from "../../models/cryptoCurrencyModel"

export const getMe: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    if (user) {
      res.send(user)
    } else {
      next(createError(404, `User not found!`))
    }
  } catch (error) {
    next(error)
  }
}

export const editMe: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    await user?.updateOne(req.body)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

export const changeMyProfileImage: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    if (req.file?.path) {
      await user?.updateOne({ $set: { avatar: req.file.path } })
      res.sendStatus(200)
    } else if (req.body?.url) {
      await user?.updateOne({ $set: { avatar: req.body.url } })
      res.sendStatus(200)
    }
  } catch (error) {
    next(error)
  }
}

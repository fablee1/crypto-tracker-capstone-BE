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

export const toggleFavourites: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  const coin = req.params.coinId.toLowerCase()
  try {
    if (user) {
      if (!user.favourites.includes(coin)) {
        user.favourites.push(coin)
        await user.save()
        const addedCoin = await CryptoCurrencyModel.findOne({ id: coin })
        res.send(addedCoin)
      } else {
        user.favourites = user.favourites.filter((cId) => cId !== coin)
        await user.save()
        res.sendStatus(200)
      }
    } else {
      next(createError(404, `User not found!`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

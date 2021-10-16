// Packages
import createError from "http-errors"
import { cryptoCompare } from "../../axios"
import { TController } from "../../typings/controllers"

export const getLatest: TController = async (req, res, next) => {
  try {
    const { data } = await cryptoCompare.get("/news/?lang=EN&sortOrder=latest")
    res.send(data.Data)
  } catch (error) {
    next(error)
  }
}

export const getPopular: TController = async (req, res, next) => {
  try {
    const { data } = await cryptoCompare.get("/news/?lang=EN&sortOrder=popular")
    res.send(data.Data)
  } catch (error) {
    next(error)
  }
}

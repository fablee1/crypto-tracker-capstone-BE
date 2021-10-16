// Packages
import createError from "http-errors"
import { TController } from "../../typings/controllers"

// Models
import ExchangeModel from "../../models/exchangeModel"

export const getExchanges: TController = async (req, res, next) => {
  try {
    const exchanges = await ExchangeModel.find({}, "-_id id name image")
    res.send(exchanges)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

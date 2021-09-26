import createError from "http-errors"
import CryptoCurrencyModel from "../../models/cryptoCurrencyModel"
import { TController } from "../../typings/controllers"
import CryptoHistoryModel from "../../models/cryptoHistoryModel"

export const getHistory: TController = async (req, res, next) => {
  try {
    const history = await CryptoHistoryModel.findOne({ id: req.params.id })
    if (history) {
      res.send(history)
    } else {
      next(createError(404, `Cryptocurrency with id: ${req.params.id} was not found!`))
    }
  } catch (error) {
    next(error)
  }
}

export const getAllCoins: TController = async (req, res, next) => {
  try {
    const allCoins = await CryptoCurrencyModel.find(
      {},
      "-_id name symbol id image market_cap_rank"
    )
    res.send(allCoins)
  } catch (error) {
    next(error)
  }
}

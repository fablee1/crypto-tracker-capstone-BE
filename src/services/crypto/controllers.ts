import createError from "http-errors"
import CryptoCurrencyModel from "../../models/cryptoCurrencyModel"
import { TController } from "../../typings/controllers"
import CryptoHistoryModel from "../../models/cryptoHistoryModel"
import { IUserDocument } from "../../typings/users"
import { ICryptoHistoryDocument } from "../../typings/cryptoHistory"
import cryptoCurrencyModel from "../../models/cryptoCurrencyModel"
import { cmc } from "../../axios"

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

export const getAllCoinsMin: TController = async (req, res, next) => {
  try {
    const allCoins = await CryptoCurrencyModel.find(
      {},
      "-_id name symbol id image market_cap_rank"
    ).limit(1000)
    res.send(allCoins)
  } catch (error) {
    next(error)
  }
}

export const getAllCoins: TController = async (req, res, next) => {
  try {
    const allCoins = await CryptoCurrencyModel.find(
      { market_cap_rank: { $exists: true, $ne: undefined } },
      "-_id name symbol id image market_cap_rank current_price price_change_percentage_24h price_change_24h market_cap total_volume circulating_supply"
    )
      .limit(50)
      .sort({ market_cap_rank: "asc" })

    const coinsHistory1Month: ICryptoHistoryDocument[] = await CryptoHistoryModel.find(
      {
        id: allCoins.map((coin) => coin.id),
      },
      { historical1D: { $slice: -30 } }
    )

    const coinsWithHistory = allCoins.map((c) => {
      return {
        ...c.toObject(),
        historical1D: coinsHistory1Month.find((hist) => c.id === hist.id)?.historical1D,
      }
    })

    res.send(coinsWithHistory)
  } catch (error) {
    next(error)
  }
}

export const getMyCoins: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    if (user) {
      const allUserCoinIds = Array.from(
        new Set(user.portfolio.map((holding) => holding.coinId).concat(user.favourites))
      )
      const coins = await cryptoCurrencyModel.find({ id: allUserCoinIds })
      const coinsHistory1Month: ICryptoHistoryDocument[] = await CryptoHistoryModel.find(
        {
          id: allUserCoinIds,
        },
        { historical1D: { $slice: -30 } }
      )
      const coinsWithHistory = coins.map((c) => {
        return {
          ...c.toObject(),
          historical1D: coinsHistory1Month.find((hist) => c.id === hist.id)?.historical1D,
        }
      })

      res.send(coinsWithHistory)
    }
  } catch (error) {
    next(error)
  }
}

export const getMarketStats: TController = async (req, res, next) => {
  try {
    const { data } = await cmc.get("/v1/global-metrics/quotes/latest")
    const necessaryData = {
      total_market_cap: data.data.quote.USD.total_market_cap,
      btc_dominance: data.data.btc_dominance,
      cryptos: data.data.total_cryptocurrencies,
      exchanges: data.data.total_exchanges,
    }
    res.send(necessaryData)
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
        const coinHistory1Month: ICryptoHistoryDocument | null =
          await CryptoHistoryModel.findOne(
            {
              id: coin,
            },
            { historical1D: { $slice: -30 } }
          )

        const addedCoinWithHistory = {
          ...addedCoin?.toObject(),
          historical1D: coinHistory1Month?.historical1D,
        }
        res.send(addedCoinWithHistory)
      } else {
        user.favourites = user.favourites.filter((cId) => cId !== coin)
        await user.save()
        res.sendStatus(200)
      }
    } else {
      next(createError(404, `User not found!`))
    }
  } catch (error) {
    next(error)
  }
}

export const getSingleCoin: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  const coinId = req.params.id.toLowerCase()
  try {
    if (user) {
      const coinData = await cryptoCurrencyModel.findOne({ id: coinId })
      res.send(coinData)
    } else {
      next(createError(404, `User not found!`))
    }
  } catch (error) {
    next(error)
  }
}

import CryptoHistoryModel from "../models/cryptoHistoryModel"
import {
  getCryptocurrencyDataSlice,
  getSingleCryptocurrencyHistory,
} from "../axios/coingecko"
import cryptoCurrencyModel from "../models/cryptoCurrencyModel"

export const addNewCryptoHistory = async (id: string, todayTimestamp: number) => {
  const { prices } = await getSingleCryptocurrencyHistory(id)
  const historical1D = prices.map((arr) => {
    return { timestamp: arr[0], price: arr[1] }
  })
  const newTokenHistory = {
    id: id,
    historical1D,
  }
  newTokenHistory.historical1D[newTokenHistory.historical1D.length - 1].timestamp =
    todayTimestamp
  const updatedHistory = await CryptoHistoryModel.findOneAndUpdate(
    { id: id },
    newTokenHistory,
    { upsert: true, new: true }
  )
  return updatedHistory
}

export const updateLastPricesAndInfo = async () => {
  const limit = 250
  const pages = 4

  for (let page = 1; page <= pages; page++) {
    const data = await getCryptocurrencyDataSlice(page, limit)

    const query = data.map((c: { [key: string]: any }) => {
      const updateQuery: { [key: string]: any } = {}
      Object.keys(c).forEach((key) => (updateQuery[key] = c[key]))
      return {
        updateOne: {
          filter: { id: c.id },
          update: {
            $set: updateQuery,
            $push: {
              last1hPrice: {
                $each: [c.current_price],
                $slice: -120,
              },
            },
          },
          upsert: true,
        },
      }
    })

    await cryptoCurrencyModel.bulkWrite(query)
  }
}

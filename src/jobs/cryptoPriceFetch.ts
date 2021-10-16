import Agenda from "agenda"
import CryptoHistoryModel from "../models/cryptoHistoryModel"
import CryptoCurrencyModel from "../models/cryptoCurrencyModel"
import {
  addNewCryptoHistory,
  updateExchanges,
  updateLastPricesAndInfo,
} from "../utils/db"
import { ICryptoHistoryDocument } from "../typings/cryptoHistory"

const agenda = new Agenda({ db: { address: process.env.ATLAS_URL! } })

agenda.define("fetch all prices", async () => {
  await updateLastPricesAndInfo()
})

agenda.define("check if each token history is present and updated", async () => {
  const allTokenIds = await CryptoCurrencyModel.find({}, "id -_id")
  for (const token of allTokenIds) {
    const t: ICryptoHistoryDocument | null = (await CryptoHistoryModel.collection.findOne(
      {
        id: token.id,
      }
    )) as ICryptoHistoryDocument

    const today = new Date()
    const todayTimestamp = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      1
    ).getTime()
    try {
      if (t) {
        const lastElement = t?.historical1D?.pop()
        if (!(lastElement?.timestamp === todayTimestamp)) {
          await addNewCryptoHistory(token.id, todayTimestamp)
        }
      } else {
        await addNewCryptoHistory(token.id, todayTimestamp)
      }
    } catch {}
  }
})

agenda.define("update exchanges info", async () => {
  await updateExchanges()
})

export const startAgenda = async () => {
  await agenda.start()

  await agenda.every("30 seconds", "fetch all prices")
  await agenda.every("2 hours", "check if each token history is present and updated")
  await agenda.every("day", "update exchanges info")
}

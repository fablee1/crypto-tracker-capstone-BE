import mongoose from "mongoose"
import { addNewCryptoHistory } from "../utils/db"
import { ICryptoHistoryDocument } from "../typings/cryptoHistory"

const { Schema, model } = mongoose

const CryptoHistorySchema = new Schema(
  {
    id: { type: String, required: true },
    historical1D: [{ timestamp: Number, price: Number }],
  },
  { timestamps: true }
)

CryptoHistorySchema.post("findOne", async function (result: ICryptoHistoryDocument) {
  const today = new Date()

  const todayTimestamp = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    1
  ).getTime()

  const lastDayTimestamp =
    result.historical1D && result.historical1D[result.historical1D?.length - 1]?.timestamp
  if (!(lastDayTimestamp === todayTimestamp)) {
    const newCryptoHistory: ICryptoHistoryDocument = await addNewCryptoHistory(
      result.id,
      todayTimestamp
    )
    result.historical1D = newCryptoHistory.historical1D
  }
})

export default model("CryptoHistory", CryptoHistorySchema)

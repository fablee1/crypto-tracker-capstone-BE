import mongoose from "mongoose"

const { Schema, model } = mongoose

const CryptoHistorySchema = new Schema(
  {
    id: { type: String, required: true },
    historical1D: [{ timestamp: Number, price: Number }],
  },
  { timestamps: true }
)

CryptoHistorySchema.pre("find", function () {
  console.log(this)
})

export default model("CryptoHistory", CryptoHistorySchema)

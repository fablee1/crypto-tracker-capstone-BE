import mongoose from "mongoose"
import {
  ICryptoCurrencyDocument,
  ICryptoCurrencyModel,
} from "src/typings/cryptocurrencies"

const { Schema, model } = mongoose

const CryptoCurrenciesSchema = new Schema<ICryptoCurrencyDocument, ICryptoCurrencyModel>(
  {
    id: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    current_price: { type: Schema.Types.Decimal128, get: getFloats },
    market_cap: { type: Number, required: true },
    market_cap_rank: { type: Number, required: true },
    last1hPrice: [Number],
    fully_diluted_valuation: Number,
    total_volume: Number,
    high_24h: { type: Schema.Types.Decimal128, get: getFloats },
    low_24h: { type: Schema.Types.Decimal128, get: getFloats },
    price_change_24h: { type: Schema.Types.Decimal128, get: getFloats },
    price_change_percentage_24h: { type: Schema.Types.Decimal128, get: getFloats },
    market_cap_change_24h: { type: Schema.Types.Decimal128, get: getFloats },
    market_cap_change_percentage_24h: { type: Schema.Types.Decimal128, get: getFloats },
    circulating_supply: { type: Schema.Types.Decimal128, get: getFloats },
    total_supply: { type: Schema.Types.Decimal128, get: getFloats },
    max_supply: { type: Schema.Types.Decimal128, get: getFloats },
    ath: { type: Schema.Types.Decimal128, get: getFloats },
    ath_change_percentage: { type: Schema.Types.Decimal128, get: getFloats },
    ath_date: Date,
    atl: { type: Schema.Types.Decimal128, get: getFloats },
    atl_change_percentage: { type: Schema.Types.Decimal128, get: getFloats },
    atl_date: Date,
    roi: {
      times: { type: Schema.Types.Decimal128, get: getFloats },
      currency: String,
      percentage: { type: Schema.Types.Decimal128, get: getFloats },
    },
    last_updated: Date,
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true }, id: false }
)

function getFloats(value: number) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString())
  }
  return value
}

export default model<ICryptoCurrencyDocument, ICryptoCurrencyModel>(
  "Crypto",
  CryptoCurrenciesSchema
)

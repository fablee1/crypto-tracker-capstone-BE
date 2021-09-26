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
    current_price: { type: Schema.Types.Decimal128, required: true },
    market_cap: { type: Number, required: true },
    market_cap_rank: { type: Number, required: true },
    last1hPrice: [Number],
    fully_diluted_valuation: Number,
    total_volume: Number,
    high_24h: Schema.Types.Decimal128,
    low_24h: Schema.Types.Decimal128,
    price_change_24h: Schema.Types.Decimal128,
    price_change_percentage_24h: Schema.Types.Decimal128,
    market_cap_change_24h: Schema.Types.Decimal128,
    market_cap_change_percentage_24h: Schema.Types.Decimal128,
    circulating_supply: Schema.Types.Decimal128,
    total_supply: Schema.Types.Decimal128,
    max_supply: Schema.Types.Decimal128,
    ath: Schema.Types.Decimal128,
    ath_change_percentage: Schema.Types.Decimal128,
    ath_date: Date,
    atl: Schema.Types.Decimal128,
    atl_change_percentage: Schema.Types.Decimal128,
    atl_date: Date,
    roi: {
      times: Schema.Types.Decimal128,
      currency: String,
      percentage: Schema.Types.Decimal128,
    },
    last_updated: Date,
  },
  { timestamps: true }
)

export default model<ICryptoCurrencyDocument, ICryptoCurrencyModel>(
  "Crypto",
  CryptoCurrenciesSchema
)

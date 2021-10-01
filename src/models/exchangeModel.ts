import mongoose from "mongoose"
import { IExchangeDocument, IExchangeModel } from "src/typings/exchanges"

const { Schema, model } = mongoose

const ExchangeSchema = new Schema<IExchangeDocument, IExchangeModel>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    year_established: Number,
    country: String,
    description: String,
    url: String,
    image: String,
    has_trading_incentive: Boolean,
    trust_score: Number,
    trust_score_rank: Number,
    trade_volume_24h_btc: Schema.Types.Decimal128,
    trade_volume_24h_btc_normalized: Schema.Types.Decimal128,
  },
  { timestamps: true }
)

export default model<IExchangeDocument, IExchangeModel>("Exchange", ExchangeSchema)

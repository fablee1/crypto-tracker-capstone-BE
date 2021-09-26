import mongoose, { Document, Model, Schema } from "mongoose"

export interface ICryptoHistory {
  id: string
  historical1D?: { timestamp: number; price: number }[]
}

export interface ICryptoHistoryDocument extends Document, ICryptoHistory {}

export interface ICryptoHistoryModel extends Model<ICryptoHistoryDocument> {}

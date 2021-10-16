import mongoose, { Document, Model, Schema } from "mongoose"

export interface ITransaction {
  type: string
  coin: string
  from?: string
  to?: string
  exchange?: string
  for?: string
  total?: number
  quantity?: number
  fee?: number
  date: Date
  time: string
  notes: string
}

export interface ITransactionDocument extends Document, ITransaction {}

export interface ITransactionModel extends Model<ITransactionDocument> {}

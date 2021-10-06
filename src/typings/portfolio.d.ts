import mongoose, { Document, Model, Schema } from "mongoose"

export interface IPortfolio {
  coinId: string
  amount?: number
  averageBuyPrice?: number
}

export interface IPortfolioDocument extends Document, IPortfolio {}

export interface IPortfolioModel extends Model<IPortfolioDocument> {}

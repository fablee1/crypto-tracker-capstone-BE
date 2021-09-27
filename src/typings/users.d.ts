import mongoose, { Document, Model, Schema } from "mongoose"

export interface IUser {
  name: string
  surname: string
  username: string
  email: string
  password?: string
  avatar?: string
  refreshToken?: string
  favourites?: string[]
  portfolio?: { coindId: string; actions: IUserPortfolioActions[] }[]
}

export interface IUserDocument extends Document, IUser {}

export interface IUserModel extends Model<IUserDocument> {
  checkCredentials(email: string, password: string): Promise<IUserDocument | null>
}

export interface IUserPortfolioActions {
  action: string
  amount: number
  date: Date
}

export interface IUserPortfolioActionsDocument extends Document, IUserPortfolioActions {}

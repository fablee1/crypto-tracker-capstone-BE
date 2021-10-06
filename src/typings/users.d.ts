import mongoose, { Document, Model, Schema } from "mongoose"
import { IPortfolio } from "./portfolio"
import { ITransaction } from "./transaction"

export interface IUser {
  name: string
  surname: string
  username: string
  email: string
  password?: string
  avatar?: string
  refreshToken?: string
  favourites: string[]
  portfolio: IPortfolio[]
  transactions: ITransaction[]
}

export interface IUserDocument extends Document, IUser {}

export interface IUserModel extends Model<IUserDocument> {
  checkCredentials(email: string, password: string): Promise<IUserDocument | null>
}

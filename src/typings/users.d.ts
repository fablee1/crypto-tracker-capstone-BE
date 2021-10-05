import mongoose, { Document, Model, Schema } from "mongoose"
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
  portfolio: { coinId: string; amount: number }[]
  transactions: ITransaction[]
}

export interface IUserDocument extends Document, IUser {}

export interface IUserModel extends Model<IUserDocument> {
  checkCredentials(email: string, password: string): Promise<IUserDocument | null>
}

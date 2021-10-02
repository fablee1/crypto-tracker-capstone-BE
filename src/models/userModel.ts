import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import {
  IUserDocument,
  IUserModel,
  IUserPortfolioActionsDocument,
} from "../typings/users"
import { ITransaction } from "../typings/transaction"

const { isEmail } = validator
const { Schema, model } = mongoose

const UserPortfolioActionsSchema = new Schema<ITransaction>(
  {
    type: String,
    from: String,
    coin: String,
    to: String,
    exchange: String,
    for: String,
    total: Schema.Types.Decimal128,
    quantity: Schema.Types.Decimal128,
    fee: Schema.Types.Decimal128,
    date: Date,
    time: String,
    notes: String,
  },
  { timestamps: true }
)

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    username: { type: String, unique: true },
    email: {
      type: String,
      validate: { validator: isEmail, message: "Invalid email." },
      unique: true,
    },
    favourites: [{ type: String, ref: "Crypto" }],
    portfolio: [{ coinId: String, amount: Schema.Types.Decimal128 }],
    transactions: [UserPortfolioActionsSchema],
    password: String,
    avatar: String,
    refreshToken: String,
  },
  { timestamps: true }
)

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password!, 10)
  next()
})

UserSchema.statics.checkCredentials = async function (login, password) {
  const user = await this.findOne({ $or: [{ email: login }, { username: login }] })
  if (!user) return
  const isMatch = await bcrypt.compare(password, user.password!)
  if (isMatch) return user
}

UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.__v
  delete user.refreshToken
  return user
}

export default model<IUserDocument, IUserModel>("User", UserSchema)

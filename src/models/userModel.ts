import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import { IUserDocument, IUserModel } from "../typings/users"
import { ITransactionDocument, ITransactionModel } from "../typings/transaction"
import { IPortfolioDocument, IPortfolioModel } from "../typings/portfolio"

const { isEmail } = validator
const { Schema, model } = mongoose

const UserTransactionsSchema = new Schema<ITransactionDocument, ITransactionModel>(
  {
    type: String,
    from: String,
    coin: String,
    to: String,
    exchange: String,
    for: String,
    total: { type: Schema.Types.Decimal128, get: getFloats },
    quantity: { type: Schema.Types.Decimal128, get: getFloats },
    fee: { type: Schema.Types.Decimal128, get: getFloats },
    date: Date,
    time: String,
    notes: String,
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true }, id: false }
)

const UserPortfolioSchema = new Schema<IPortfolioDocument, IPortfolioModel>(
  {
    coinId: { type: String },
    amount: { type: Schema.Types.Decimal128, get: getFloats },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
    id: false,
  }
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
    favourites: [{ type: String }],
    portfolio: [UserPortfolioSchema],
    transactions: [UserTransactionsSchema],
    password: String,
    avatar: String,
    refreshToken: String,
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
    id: false,
  }
)

function getFloats(value: number) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString())
  }
  return value
}

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

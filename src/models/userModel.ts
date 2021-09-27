import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import {
  IUserDocument,
  IUserModel,
  IUserPortfolioActionsDocument,
} from "../typings/users"

const { isEmail } = validator
const { Schema, model } = mongoose

const UserPortfolioActionsSchema = new Schema<IUserPortfolioActionsDocument>(
  {
    action: String,
    amount: Schema.Types.Decimal128,
    date: Date,
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
    portfolio: [{ coinId: String, actions: [UserPortfolioActionsSchema] }],
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
  console.log(user)
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

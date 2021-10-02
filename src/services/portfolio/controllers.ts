// Packages
import createError from "http-errors"
import { TController } from "../../typings/controllers"

// Models
import userModel from "../../models/userModel"
import { IUserDocument } from "../../typings/users"
import { ITransaction } from "../../typings/transaction"

export const addData: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    const data: ITransaction = req.body
    if (user) {
      if (data.type === "buy") {
        const index = user.portfolio.findIndex((c) => c.coinId === data.coin)
        if (index === -1) {
          user.portfolio.push({ coinId: data.coin, amount: data.quantity })
        } else {
          user.portfolio[index].amount += data.quantity
        }
      } else if (data.type === "sell") {
        const index = user.portfolio.findIndex((c) => c.coinId === data.coin)
        if (index === -1) {
          user.portfolio.push({ coinId: data.coin, amount: -data.quantity })
        } else {
          user.portfolio[index].amount -= data.quantity
        }
      }
    }
    user?.transactions.push(data)
    await user?.save()
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

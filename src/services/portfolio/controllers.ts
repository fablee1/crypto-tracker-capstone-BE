// Packages
import createError from "http-errors"
import { TController } from "../../typings/controllers"
import { BigNumber } from "bignumber.js"

// Models
import { IUserDocument } from "../../typings/users"
import { ITransaction } from "../../typings/transaction"

export const addData: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    const data: ITransaction = req.body
    if (user) {
      let index = user.portfolio.findIndex((c) => c.coinId === data.coin)
      if (index === -1) {
        user.portfolio.push({ coinId: data.coin, amount: 0 })
        index = user.portfolio.findIndex((c) => c.coinId === data.coin)
      }
      if (data.type === "buy") {
        user.portfolio[index].amount = new BigNumber(user.portfolio[index].amount)
          .plus(data.quantity as number)
          .toNumber()
      } else if (data.type === "sell") {
        user.portfolio[index].amount = new BigNumber(user.portfolio[index].amount)
          .minus(data.quantity as number)
          .toNumber()
      } else if (data.type === "transfer") {
        if (data.from !== "external") {
          user.portfolio[index].amount = new BigNumber(user.portfolio[index].amount)
            .minus(data.quantity as number)
            .toNumber()
        } else if (data.to !== "external") {
          user.portfolio[index].amount = new BigNumber(user.portfolio[index].amount)
            .plus(data.quantity as number)
            .toNumber()
        }
      }
    }
    user?.transactions.push(data)
    await user?.save()
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

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
        user.portfolio.push({ coinId: data.coin, amount: 0, averageBuyPrice: 0 })
        index = user.portfolio.findIndex((c) => c.coinId === data.coin)
      }

      const portfolio = user.portfolio[index]

      if (data.type === "buy") {
        portfolio.amount = new BigNumber(portfolio.amount as number)
          .plus(data.quantity as number)
          .toNumber()
        portfolio.averageBuyPrice = new BigNumber(portfolio.averageBuyPrice as number)
          .multipliedBy(portfolio.amount - (data.quantity as number))
          .plus(data.total as number)
          .dividedBy(portfolio.amount)
          .toNumber()
      } else if (data.type === "sell") {
        portfolio.amount = new BigNumber(portfolio.amount as number)
          .minus(data.quantity as number)
          .toNumber()
      } else if (data.type === "transfer") {
        if (data.from !== "external") {
          portfolio.amount = new BigNumber(portfolio.amount as number)
            .minus(data.quantity as number)
            .toNumber()
        } else if (data.to !== "external") {
          portfolio.amount = new BigNumber(portfolio.amount as number)
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

// Packages
import createError from "http-errors"
import { TController } from "../../typings/controllers"
import { BigNumber } from "bignumber.js"

// Models
import { IUserDocument } from "../../typings/users"
import { ITransaction } from "../../typings/transaction"
import cryptoHistoryModel from "../../models/cryptoHistoryModel"
import { ICryptoHistoryDocument } from "src/typings/cryptoHistory"
import { getTimestamp240DaysAgo } from "../../utils/dates"
import { getDataBefore8Months } from "../../utils/portfolio"
import { processTransaction } from "../../utils/portfolio"
import cryptoCurrencyModel from "../../models/cryptoCurrencyModel"

export const addData: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    const data: ITransaction = req.body

    const date = new Date(req.body.date)
    date.setHours(1)
    data.date = date

    let index
    let coinData = null
    if (user) {
      index = user.portfolio.findIndex((c) => c.coinId === data.coin)

      if (index === -1) {
        coinData = (await cryptoCurrencyModel.findOne({ id: data.coin }))?.toObject()
        if (coinData) {
          const coinHistory = (await cryptoHistoryModel.findOne({
            id: data.coin,
          })) as ICryptoHistoryDocument
          coinData.historical1D = coinHistory?.toObject().historical1D
        }
      }

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

    const newData = user?.toObject()
    res.send({
      trans: newData?.transactions.slice(-1),
      portfolio: newData?.portfolio,
      coinData,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getPortfolioValueData: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    if (user) {
      const transTokens = Array.from(
        new Set(user.transactions.map((trans) => [trans.coin, trans?.for]).flat(1))
      ).filter((token) => token !== "usd") as string[]

      const tokensWithHistory: ICryptoHistoryDocument[] = await cryptoHistoryModel.find(
        {
          id: transTokens,
        },
        { historical1D: { $slice: -240 } }
      )

      const timestamps = tokensWithHistory[0].historical1D?.map(
        (hist) => hist.timestamp
      ) as number[]

      const sortedTransactions = user.transactions.sort(
        (a, b) => a.date.valueOf() - b.date.valueOf()
      )

      const tokenHistories: {
        [key: string]: { timestamp: number; price: number }[]
      } = {}
      tokensWithHistory.forEach((token) => {
        if (token.historical1D && token.historical1D.length < 240) {
          const arrayToFill: any[] = []
          timestamps.slice(0, 240 - token.historical1D.length).forEach((ts) => {
            arrayToFill.push({
              price: (token.historical1D as any)[0].price,
              timestamp: ts,
            })
          })
          tokenHistories[token.id] = arrayToFill.concat(token.historical1D)
        } else {
          tokenHistories[token.id] = token.historical1D!
        }
      })

      let initialData: {
        invested: {
          [key: string]: number
        }
        coinsBalances: {
          [key: string]: number
        }
      } = {
        invested: {},
        coinsBalances: { usd: 0 },
      }

      transTokens.forEach((token) => {
        initialData.invested[token] = 0
        initialData.coinsBalances[token] = 0
      })

      const timestamp240DaysAgo = getTimestamp240DaysAgo()
      const indexOfFirstTimestampOnOrAfterSpecifiedDate = sortedTransactions.findIndex(
        (trans) => trans.date.valueOf() + 360000 >= timestamp240DaysAgo
      )

      if (indexOfFirstTimestampOnOrAfterSpecifiedDate !== -1) {
        const dataBefore8Months = getDataBefore8Months(
          sortedTransactions.slice(0, indexOfFirstTimestampOnOrAfterSpecifiedDate),
          initialData
        )
        initialData = dataBefore8Months
      }

      const finalChartDataArray: {
        timestamp: number
        invested: number
        portfolioValue: number
      }[] = []
      const transactionsInLast8Months = sortedTransactions.slice(
        indexOfFirstTimestampOnOrAfterSpecifiedDate
      )

      let count = 0
      timestamps.reduce((prev, curr) => {
        if (transactionsInLast8Months.length > 0) {
          let targetTrans = transactionsInLast8Months[0]
          targetTrans.date.setHours(1, 0, 0, 0)
          while (targetTrans.date.valueOf() === curr) {
            prev = processTransaction(
              transactionsInLast8Months.shift() as ITransaction,
              prev
            )
            if (transactionsInLast8Months[0]) {
              targetTrans = transactionsInLast8Months[0]
              targetTrans.date.setHours(1, 0, 0, 0)
            } else {
              break
            }
          }
        }
        const invested = Object.values(prev.invested).reduce((a, b) => a + b, 0)
        const portfolioValue = Object.keys(prev.coinsBalances).reduce((a, b) => {
          if (b === "usd") {
            return a + prev.coinsBalances[b]
          } else {
            console.log(b)
            return a + tokenHistories[b][count].price * prev.coinsBalances[b]
          }
        }, 0)

        count++

        finalChartDataArray.push({
          timestamp: curr,
          invested: invested,
          portfolioValue: portfolioValue,
        })

        return prev
      }, initialData)

      res.send(finalChartDataArray)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

import { ITransaction } from "src/typings/transaction"
import { BigNumber } from "bignumber.js"

export const processTransaction = (
  transaction: ITransaction,
  data: {
    invested: {
      [key: string]: number
    }
    coinsBalances: {
      [key: string]: number
    }
  }
) => {
  if (transaction.type === "buy") {
    if (transaction.for === "usd") {
      if (data.coinsBalances.usd > 0) {
        if (data.coinsBalances.usd >= (transaction.total as number)) {
          data.coinsBalances.usd = new BigNumber(data.coinsBalances.usd)
            .minus(transaction.total as number)
            .toNumber()
        } else {
          const totalAfterSubtractingInvestableCash = new BigNumber(
            transaction.total as number
          )
            .minus(data.coinsBalances.usd)
            .toNumber()

          data.invested[transaction.coin] = new BigNumber(data.invested[transaction.coin])
            .plus(totalAfterSubtractingInvestableCash)
            .toNumber()

          data.coinsBalances.usd = 0
        }
      } else if (data.coinsBalances.usd === 0) {
        data.invested[transaction.coin] = new BigNumber(data.invested[transaction.coin])
          .plus(transaction.total as number)
          .toNumber()
      }
    } else {
      data.coinsBalances[transaction.for as string] = new BigNumber(
        data.coinsBalances[transaction.for as string]
      )
        .minus(transaction.total as number)
        .toNumber()
    }

    data.coinsBalances[transaction.coin] = new BigNumber(
      data.coinsBalances[transaction.coin]
    )
      .plus(transaction.quantity as number)
      .toNumber()
  } else if (transaction.type === "sell") {
    data.coinsBalances[transaction.for as string] = new BigNumber(
      data.coinsBalances[transaction.for as string]
    )
      .plus(transaction.total as number)
      .toNumber()

    data.coinsBalances[transaction.coin] = new BigNumber(
      data.coinsBalances[transaction.coin]
    )
      .minus(transaction.quantity as number)
      .toNumber()
  } else if (transaction.type === "transaction") {
    // available transaction sources: external, wallet, :any exchange:
    if (transaction.from !== "external") {
      data.coinsBalances[transaction.coin] = new BigNumber(
        data.coinsBalances[transaction.coin]
      )
        .minus(transaction.quantity as number)
        .toNumber()
    }
    if (transaction.to !== "external") {
      data.coinsBalances[transaction.coin] = new BigNumber(
        data.coinsBalances[transaction.coin]
      )
        .plus(transaction.quantity as number)
        .toNumber()
    }
  }
  return data
}

export const getDataBefore8Months = (
  transactions: ITransaction[],
  initialData: {
    invested: {
      [key: string]: number
    }
    coinsBalances: {
      [key: string]: number
    }
  }
) => {
  return transactions.reduce((prev, curr) => {
    return processTransaction(curr, prev)
  }, initialData)
}

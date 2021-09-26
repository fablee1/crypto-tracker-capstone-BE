import { coingecko } from "."
import { ICryptoCurrency } from "../typings/cryptocurrencies"
import { AxiosResponse } from "axios"

export const getCryptocurrencyDataSlice = async (page: number, limit: number) => {
  const { data }: AxiosResponse<ICryptoCurrency[]> = await coingecko.get(
    `/coins/markets?vs_currency=usd&page=${page}&per_page=${limit}`
  )
  return data
}

interface ICryptoHistoryResponse {
  prices: [[number, number]]
  market_caps: [[number, number]]
  total_volumes: [[number, number]]
}

export const getSingleCryptocurrencyHistory = async (
  id: string,
  days: string = "max",
  interval: string = "daily",
  vs_curr: string = "usd"
) => {
  const { data }: AxiosResponse<ICryptoHistoryResponse> = await coingecko.get(
    `/coins/${id}/market_chart?vs_currency=${vs_curr}&days=${days}&interval=${interval}`
  )
  return data
}

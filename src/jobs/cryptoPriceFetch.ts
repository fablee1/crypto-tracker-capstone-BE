import Agenda from "agenda"
import { AxiosResponse } from "axios"
import { coingecko } from "../axios"
import { ICryptoCurrency } from "../typings/cryptocurrencies"
import CryptoCurrencyModel from "../services/cryptocurrencies/model"

const agenda = new Agenda({ db: { address: process.env.ATLAS_URL! } })

agenda.define("fetch all prices", async () => {
  const limit = 250
  const pages = 4

  console.log("Fetching prices")

  for (let page = 1; page <= pages; page++) {
    console.log(`Fetching ${page}/${pages}`)

    const { data }: AxiosResponse<ICryptoCurrency[]> = await coingecko.get(
      `/coins/markets?vs_currency=usd&page=${page}&per_page=${limit}`
    )

    const query = data.map((c: { [key: string]: any }) => {
      const updateQuery: { [key: string]: any } = {}
      Object.keys(c).forEach((key) => (updateQuery[key] = c[key]))
      return {
        updateOne: {
          filter: { id: c.id },
          update: {
            $set: updateQuery,
          },
          upsert: true,
        },
      }
    })

    await CryptoCurrencyModel.bulkWrite(query)
  }
})

export const startAgenda = async () => {
  await agenda.start()

  await agenda.every("minute", "fetch all prices")
}

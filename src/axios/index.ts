import axios from "axios"
import rateLimit from "axios-rate-limit"

export const coingecko = rateLimit(
  axios.create({
    baseURL: "https://api.coingecko.com/api/v3",
  }),
  { maxRequests: 50, perMilliseconds: 60000 }
)

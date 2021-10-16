import { TErrorMiddlewareFunction } from "./typings/middlewares"

export const errorsMiddleware: TErrorMiddlewareFunction = (err, req, res, next) => {
  const errStatus = [400, 401, 403, 404, 500]
  if (!errStatus.includes(err.status)) {
    res.status(err.status).json("Generic Server Error")
  } else {
    res.status(err.status).json({ [err.name]: err.message })
  }
}

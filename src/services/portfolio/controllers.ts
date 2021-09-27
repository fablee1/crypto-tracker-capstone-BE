// Packages
import createError from "http-errors"
import { TController } from "../../typings/controllers"

// Models
import userModel from "../../models/userModel"
import { IUserDocument } from "../../typings/users"

export const addAsset: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    const newAction = {
      action: req.body.action,
      amount: req.body.amount,
    }

    const result = await userModel.findOneAndUpdate(
      { _id: user?._id, "portfolio.coinId": req.body.coinId },
      { $push: { "portfolio.$.actions": newAction } }
    )
    if (!result)
      await userModel.findOneAndUpdate(
        { _id: user?._id },
        { $push: { portfolio: { coinId: req.body.coinId, actions: [{ newAction }] } } }
      )

    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

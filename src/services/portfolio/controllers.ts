// Packages
import createError from "http-errors"
import { TController } from "../../typings/controllers"

// Models
import { IUserDocument } from "../../typings/users"

export const addAsset: TController = async (req, res, next) => {
  const user: IUserDocument | undefined = req.user
  try {
    const userPopulated = await user?.populate("favourites")
    if (userPopulated) {
      res.send(userPopulated)
    } else {
      next(createError(404, `User not found!`))
    }
  } catch (error) {
    next(error)
  }
}

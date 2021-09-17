import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"

const userAvatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: `PortfolioTracker/Users/Avatars`,
    }
  },
})
export const userAvatarParser = multer({ storage: userAvatarStorage })

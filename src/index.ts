import mongoose from "mongoose"
import { startAgenda } from "./jobs/cryptoPriceFetch"
import server from "./socket"

const PORT = process.env.PORT || 3001

mongoose.set("returnOriginal", false)
mongoose
  .connect(process.env.ATLAS_URL!)
  .then(() => server.listen(PORT, () => console.log("Server running on port " + PORT)))
  .catch((err) => {
    console.log("Error with connecting to DB, error: ", err)
    process.exit(1)
  })

startAgenda()

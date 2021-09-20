import Agenda from "agenda"

const agenda = new Agenda({ db: { address: process.env.ATLAS_URL! } })

agenda.define("fetch all prices", async () => {})

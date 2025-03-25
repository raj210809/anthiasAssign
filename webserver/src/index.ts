import express from "express"
import router from "./route/route"

const app = express()
const PORT = 3000

app.use(express.json())
app.use("/api/v1" , router)

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})
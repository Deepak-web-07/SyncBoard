import express from "express";
import bodyParser from "body-parser";
import todoRoute from "./routes/todoRoute.js";
import userRoute from "./routes/userRoute.js";
import boardRoute from "./routes/boardRoute.js";
import db from "./db.js";
import cors from "cors";
import passport from "passport";
import passportStrategy from "passport-strategy";
import dotenv from "dotenv"
dotenv.config()

const app = express();
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(bodyParser.json())
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.use('/user', userRoute)
app.use('/todo', todoRoute)
app.use('/board', boardRoute)

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

export default app;
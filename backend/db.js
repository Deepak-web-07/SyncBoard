import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL)

const db = mongoose.connection;

db.on('connected', () => {
    console.log('MongoDB connected')
})

db.on('error', (err) => {
    console.log('MongoDB connection error', err)
})

db.on('disconnected', () => {
    console.log('MongoDB disconnected')
})

export default db;
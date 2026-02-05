import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../components/feature/todoSlice"

export const store = configureStore({
    reducer: todoReducer
})
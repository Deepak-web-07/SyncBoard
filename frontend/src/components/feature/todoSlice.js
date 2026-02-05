import { createSlice, nanoid } from "@reduxjs/toolkit";

export const todoSlice = createSlice({
    name: 'todo',
    initialState: {
        todos: []
    },
    reducers: {
        setTodos: (state, action) => {
            state.todos = action.payload
        },
        addTodo: (state, action) => {
            // content from backend
            state.todos.unshift(action.payload)
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter((todo) => todo._id !== action.payload)
        },
        updateTodo: (state, action) => {
            const { _id, title, body, status, position, priority } = action.payload;
            const todo = state.todos.find((todo) => todo._id === _id);
            if (todo) {
                if (title !== undefined) todo.title = title;
                if (body !== undefined) todo.body = body;
                if (status !== undefined) todo.status = status;
                if (position !== undefined) todo.position = position;
                if (priority !== undefined) todo.priority = priority;
            }
        },
        toggleTodo: (state, action) => { // Backend doesn't seem to have toggle route visible in snippet? 
            // The route snippet showed add, update, delete, get.
            // I'll leave toggle for now but it might not persist unless I add a route.
            // For now, let's just keep it local or remove it if not supported by backend.
            // The user didn't ask to implement new backend features, just connect.
            const todo = state.todos.find((todo) => todo._id === action.payload)
            if (todo) {
                todo.isCompleted = !todo.isCompleted
            }
        }
    }
})

export const { setTodos, addTodo, removeTodo, updateTodo, toggleTodo } = todoSlice.actions

export default todoSlice.reducer
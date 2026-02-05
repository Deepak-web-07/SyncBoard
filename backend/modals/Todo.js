import mongoose from "mongoose";


const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },
    position: {
        type: Number,
        required: true,
        default: 0
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    {
        timestamps: true
    }
)

const Todo = mongoose.model('Todo', todoSchema)
export default Todo
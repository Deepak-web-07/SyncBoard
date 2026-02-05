import express from "express";
import Todo from "../modals/Todo.js";
import { jwtAuthMiddleware } from "../jwt.js";
import User from "../modals/User.js";
const router = express.Router();

// router.use(jwtAuthMiddleware);

// create todo
router.post("/addTodo", async (req, res) => {
    try {
        const { title, body, email, status, position, priority, boardId, assignedTo } = req.body;
        if (!title || !body || !email) {
            return res.status(404).json({ message: 'All fields are required' })
        }
        const existUser = await User.findOne({ email })
        if (!existUser) {
            return res.status(404).json({ message: 'User Not Found' })
        }

        // Automatically share with team members
        const teamIds = existUser.participate || [];

        const todo = await Todo.create({
            title,
            body,
            user: [existUser._id, ...teamIds],
            status,
            position,
            priority,
            boardId,
            assignedTo
        });
        existUser.todos.push(todo._id)
        await existUser.save();

        // Populate for immediate return
        await todo.populate('assignedTo', 'username email');

        res.status(200).json({ todo })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
})

// Get Todos by Board
router.get('/getBoardTodos/:boardId', async (req, res) => {
    try {
        const todos = await Todo.find({ boardId: req.params.boardId })
            .sort({ createdAt: -1 })
            .populate('assignedTo', 'username email');
        res.status(200).json({ todos: todos })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// update todo
router.put('/updateTodo/:id', async (req, res) => {
    try {
        const { title, body, email, status, position, priority, assignedTo } = req.body;
        // if (!title || !body || !email) {
        //     return res.status(404).json({ message: 'All fields are required' })
        // }
        const existUser = await User.findOne({ email })
        if (!existUser) {
            return res.status(404).json({ message: 'User Not Found' })
        }
        const todo = await Todo.findByIdAndUpdate(req.params.id,
            { title, body, status, position, priority, assignedTo },
            { new: true }
        ).populate('assignedTo', 'username email');
        // todo.save()
        res.status(200).json({ message: 'Todo Updated Successfully', todo })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})

// delete todo 
router.delete('/deleteTodo/:id', async (req, res) => {
    try {
        const { email } = req.body;
        const existUser = await User.findOneAndUpdate({ email }, { $pull: { todos: req.params.id } })    //  { $pull: { todos: req.params.id } ---->   pull the todo from the user's todos array
        if (!existUser) {
            return res.status(404).json({ message: 'User Not Found' })
        }
        const todo = await Todo.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Todo Deleted Successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

// get todos
router.get('/getTodos/:id', async (req, res) => {
    const todos = await Todo.find({ user: req.params.id }).sort({ createdAt: -1 });
    // Optional: You could sort by priority here in JS if needed
    // const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    // todos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    res.status(200).json({ todos: todos })
})

export default router;
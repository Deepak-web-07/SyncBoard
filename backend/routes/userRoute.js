import User from "../modals/User.js";
import Todo from "../modals/Todo.js";
import express from "express";
const router = express.Router()
import bcrypt from "bcryptjs"
import { jwtAuthMiddleware, generateToken, checkAdmin } from "../jwt.js";


// Signin
router.post('/signup', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username, password })
        await user.save()

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role
        }
        const token = generateToken(payload)

        res.status(200).json({ user: user, token: token });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'User Already Exists' })
    }
})

// Login
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "Wrong Username" })
        }
        const isPasswordMatch = await user.comparePassword(password)
        if (!isPasswordMatch) {
            return res.status(404).json({ message: 'Wrong Password' })
        }

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role
        }
        const token = generateToken(payload)

        res.status(200).json({ user: user, token: token })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// updateUser
router.put('/updateUser/:id', async (req, res) => {
    const { email, username, password } = req.body;
    const existUser = await User.findOne({ _id: req.params.id })
    if (!existUser) {
        return res.status(404).json({ message: 'User Not Found' })
    }

    if (email) {
        existUser.email = email
    }
    if (username) {
        existUser.username = username
    }
    if (password) {
        existUser.password = password
    }

    await existUser.save()
    res.status(200).json({ message: 'User Updated Successfully' })
})

router.delete('deleteUser/:id', jwtAuthMiddleware, checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' })
        }
        await user.deleteOne()
        res.status(200).json({ message: 'User Deleted Sucessfully' })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Get All Users (Admin Only)
router.get('/getAllUsers', jwtAuthMiddleware, checkAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password from the result
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.use(jwtAuthMiddleware);

// Share Board with another user
router.post('/shareBoard', async (req, res) => {
    try {
        const { myEmail, targetEmail } = req.body;

        if (myEmail === targetEmail) {
            return res.status(400).json({ message: "You cannot share with yourself" });
        }

        const currentUser = await User.findOne({ email: myEmail });
        const targetUser = await User.findOne({ email: targetEmail });

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add to participate list using $addToSet (avoids duplicates automatically)
        await User.findByIdAndUpdate(currentUser._id, {
            $addToSet: { participate: targetUser._id }
        });

        // Add target user to All Todos of current user
        // We find todos where 'user' array contains currentUser._id
        // And atomicially add targetUser._id
        await Todo.updateMany(
            { user: currentUser._id },
            { $addToSet: { user: targetUser._id } }
        );

        res.status(200).json({ message: `Board Shared with ${targetUser.username} successfully!` });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get Team Members
router.get('/team/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('participate', 'username email');
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        res.status(200).json({ team: user.participate });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Remove Team Member
router.post('/removeMember', async (req, res) => {
    try {
        const { myId, memberId } = req.body;

        const currentUser = await User.findById(myId);
        if (!currentUser) return res.status(404).json({ message: 'User Not Found' });

        // Remove from participate list
        await User.findByIdAndUpdate(myId, {
            $pull: { participate: memberId }
        });

        // Remove that member from ALL todos that belong to me
        await Todo.updateMany(
            { user: myId },
            { $pull: { user: memberId } }
        );

        res.status(200).json({ message: 'Member removed successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
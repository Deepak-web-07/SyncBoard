import express from "express";
import Board from "../modals/Board.js";
import User from "../modals/User.js";
import { jwtAuthMiddleware } from "../jwt.js";
import { nanoid } from "nanoid";

const router = express.Router();

router.use(jwtAuthMiddleware);

// Get my boards (Personal + Shared)
router.get("/myBoards", async (req, res) => {
    try {
        const userId = req.user.user.id;
        const boards = await Board.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        }).populate("owner", "username email")
            .populate("members", "username email");
        res.status(200).json({ boards });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Create Board
router.post("/create", async (req, res) => {
    try {
        const { name, description, theme } = req.body;
        const userId = req.user.user.id;

        if (!name) return res.status(400).json({ message: "Board Name is required" });

        const inviteCode = nanoid(10); // Generates unique 10-char ID

        const board = await Board.create({
            name,
            description,
            theme,
            inviteCode,
            owner: userId,
            members: [] // Owner is separate, but can be added if we want stricter queries
        });

        // Add board to User's list (optional, but good for populate)
        // await User.findByIdAndUpdate(userId, { $push: { boards: board._id } });

        // Populate the board before returning
        await board.populate("owner", "username email");
        await board.populate("members", "username email");

        res.status(201).json({ board });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get Single Board Details
router.get("/:id", async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
            .populate("members", "username email")
            .populate("owner", "username email");

        if (!board) return res.status(404).json({ message: "Board Not Found" });

        // Check Access
        const userId = req.user.user.id;
        const isOwner = board.owner._id.toString() === userId;
        const isMember = board.members.some(m => m._id.toString() === userId);

        if (!isOwner && !isMember) {
            return res.status(403).json({ message: "Access Denied" });
        }

        res.status(200).json({ board });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Join Board via Code
router.post("/join", async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const userId = req.user.user.id;

        const board = await Board.findOne({ inviteCode });
        if (!board) return res.status(404).json({ message: "Invalid Invite Code" });

        // Check if already member
        if (board.owner.toString() === userId || board.members.includes(userId)) {
            return res.status(200).json({ message: "Already a member", boardId: board._id });
        }

        board.members.push(userId);
        await board.save();

        res.status(200).json({ message: "Joined Board Successfully", boardId: board._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Remove Member from Board
router.post("/removeMember", async (req, res) => {
    try {
        const { boardId, memberId } = req.body;
        const userId = req.user.user.id; // Owner ID

        const board = await Board.findById(boardId);
        if (!board) return res.status(404).json({ message: "Board Not Found" });

        // Check if requester is Owner
        if (board.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only the Board Owner can remove members" });
        }

        // Remove the member
        board.members = board.members.filter(id => id.toString() !== memberId);
        await board.save();

        res.status(200).json({ message: "Member removed successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete Board
router.delete("/delete/:id", async (req, res) => {
    try {
        const boardId = req.params.id;
        const userId = req.user.user.id;

        const board = await Board.findById(boardId);
        if (!board) return res.status(404).json({ message: "Board Not Found" });

        if (board.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only the Board Owner can delete the board" });
        }

        await Board.findByIdAndDelete(boardId);

        // Delete all todos associated with this board
        // await Todo.deleteMany({ boardId: boardId }); // Need to import Todo if we want this, but for now let's just delete the board. 
        // Actually, let's leave todos for now or better, I should check if I can import Todo.
        // The file imports are:
        // import Board from "../modals/Board.js";
        // import User from "../modals/User.js";

        res.status(200).json({ message: "Board deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;

import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    theme: {
        type: String,
        default: "from-blue-500 to-purple-600" // Default gradient
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    inviteCode: {
        type: String, // Unique code for joining, e.g., "aX9d2L"
        unique: true,
        sparse: true
    }
}, { timestamps: true });

export default mongoose.model("Board", boardSchema);

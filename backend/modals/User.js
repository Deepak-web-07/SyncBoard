import mongoose from "mongoose";

import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    participate: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo"
        }
    ]
},
    {
        timestamps: true
    }
)

userSchema.pre('save', async function () {
    const user = this
    if (!user.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)
        user.password = hashedPassword
    } catch (error) {
        throw error
    }
})

userSchema.methods.comparePassword = async function (userPassword) {
    try {
        return await bcrypt.compare(userPassword, this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('User', userSchema)
export default User
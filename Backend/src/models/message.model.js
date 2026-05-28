import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "chat"
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true
    }
}, { timestamps: true })

export const messageModel = mongoose.model('message', messageSchema)
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true
    },
    userName: {
        type: String,
        required: [true, "Please provide a user ID"]
    },
    message: {
        type: String,
        required: [true, "Please provide a message"]
    },
    createdOn: {
        type: Date,
        default: () => Date.now()
    }
});

const Chat = mongoose.models.chats || mongoose.model("chats", ChatSchema);

export default Chat;
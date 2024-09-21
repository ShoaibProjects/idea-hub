import mongoose from 'mongoose';
const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users involved in the chat
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who sent the message
        content: { type: String, required: true }, // Message content
        timestamp: { type: Date, default: Date.now } // When the message was sent
    }]
}, { timestamps: true });
const Chats = mongoose.model('Chats', chatSchema);
export default Chats;

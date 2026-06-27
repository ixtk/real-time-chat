import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
)

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    participants: [
      {
        type: String,
        required: true,
      },
    ],
    messages: [messageSchema],
  },
  { timestamps: true },
)

const Chat = mongoose.model('Chat', chatSchema)

export default Chat

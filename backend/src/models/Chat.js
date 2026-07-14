import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    messageReadAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

const chatSchema = new mongoose.Schema(
  {
    participantKey: {
      type: String,
      required: true,
      unique: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    messages: [messageSchema],
  },
  { timestamps: true },
)

chatSchema.index({ participantKey: 1 }, { unique: true })

const Chat = mongoose.model('Chat', chatSchema)

export default Chat

// წევრები +
// მესიჯები + 
  // წაიკითხა თუ არა (მესიჯს)
  // დროები +
  // ტექსტი
// სახელი
// სურათი
// ფაილები
// თემა
// adfalk238faldfkjadlf

import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      }
    ]
  },
  { timestamps: true },
)

const Chat = mongoose.model('Chat', userSchema)

export default Chat

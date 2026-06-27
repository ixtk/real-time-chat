import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.warn('MONGO_URI is not set. Backend started without MongoDB.')
    return
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
  }
}

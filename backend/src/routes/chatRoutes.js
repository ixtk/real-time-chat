import express from 'express'
import {
  createChat,
  getChats,
  markChatRead,
  sendMessage,
} from '../controllers/chatController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAuth, getChats)
router.post('/', requireAuth, createChat)
router.post('/:chatId/messages', requireAuth, sendMessage)
router.patch('/:chatId/read', requireAuth, markChatRead)

export default router

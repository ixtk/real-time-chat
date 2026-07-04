import express from 'express'
import { createChat, getChats, sendMessage } from '../controllers/chatController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAuth, getChats)
router.post('/', requireAuth, createChat)
router.post('/:chatId/messages', requireAuth, sendMessage)

export default router

import express from 'express'
import {
  getAllUsers,
  loadChatByUserId,
  sendMessage
} from "../controllers/userController.js"
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/all-users", requireAuth, getAllUsers)
router.get("/:userId/loadChat", requireAuth, loadChatByUserId)
router.post("/:chatId/sendMessage", requireAuth, sendMessage)

export default router

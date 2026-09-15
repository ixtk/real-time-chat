import express from 'express'
import { getAllUsers, loadChatByUserId } from "../controllers/userController.js"
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/all-users", requireAuth, getAllUsers)
router.get("/:userId/loadChat", requireAuth, loadChatByUserId)

export default router

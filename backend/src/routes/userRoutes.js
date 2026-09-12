import express from 'express'
import { getAllUsers, loadChatByUserId } from "../controllers/userController.js"
import { getCurrentUser } from "../controllers/authController.js"

const router = express.Router()

// middleware to check if user is authenticated
router.get("/all-users", getCurrentUser, getAllUsers)
router.get("/:userId/loadChat", getCurrentUser, loadChatByUserId)

export default router

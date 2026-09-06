import express from 'express'
import { getAllUsers, loadChatByUserId } from "../controllers/userController.js"

const router = express.Router()

router.get("/all-users", getAllUsers)
router.get("/:userId/loadChat", loadChatByUserId)

export default router

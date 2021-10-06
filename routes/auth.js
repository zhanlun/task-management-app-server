import express from 'express'
import { loginUser } from '../auth/authController.js'

const router = express.Router({ mergeParams: true })

router.post('/login', loginUser)

export default router
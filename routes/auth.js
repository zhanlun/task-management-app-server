import express from 'express'
import { loginUser, signUpUser } from '../auth/authController.js'

const router = express.Router({ mergeParams: true })

router.post('/login', loginUser)
router.post('/signup', signUpUser)

export default router